import { fetchProviderJson } from "@/platform/live-providers/fetch";
import { entryAgeSeconds, isFresh, peek, put } from "@/platform/live-providers/cache";
import { recordAttempt, recordFailure, recordSchemaChange, recordSuccess, getHealth } from "@/platform/live-providers/health";
import { getLiveProduct, getLiveProvider, providerState, type LiveProduct, type LiveProviderDescriptor } from "@/platform/live-providers/registry";
import { classifyFreshness, type LiveEnvelope, type LiveDataStatus } from "@/platform/live-providers/envelope";

/**
 * The single path from a provider to a page.
 *
 * Every live value on AsteriaStar comes through `loadProduct`, which composes the guarded fetch,
 * the operational cache, the health record and the honesty envelope into one call that CANNOT
 * fail: it returns an envelope in every case, and a page renders whatever the envelope permits.
 * A provider being down produces an envelope with no `data`, so there is nothing for a page to
 * render a fake value from.
 *
 * Parsing is the caller's job and is expected to be strict. A response that parses as JSON but
 * not into the expected shape is recorded as a schema change, not as a transport failure — the
 * two mean different things and are shown differently on the Data Health dashboard.
 */

export type ParseResult<T> =
  | {
      ok: true;
      value: T;
      /**
       * The provider's own timestamp for the newest datum in the response (ISO 8601). Used to
       * age the response when the product's freshness is judged on observation time. Omit for
       * an event feed, whose currency is the age of the fetch.
       */
      observedAt?: string;
      /** The provider's own generation time for the product, when it publishes one. */
      generatedAt?: string;
      validFrom?: string;
      validUntil?: string;
    }
  | { ok: false; problem: string };

/** Format a date as the YYYY-MM-DD a date-windowed provider expects, in UTC. */
function utcDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * Resolve a product's URL. The only substitutions are the two date placeholders, and both are
 * formatted from the server clock — never from a request, a header, or any user input. A
 * template carrying any other placeholder is refused rather than fetched.
 */
export function resolveProductUrl(product: LiveProduct, now: Date): { ok: true; url: string } | { ok: false; problem: string } {
  if (!product.url.includes("{")) return { ok: true, url: product.url };
  if (product.windowDays === undefined) {
    return { ok: false, problem: `${product.productKey}: templated URL without a windowDays setting` };
  }
  const end = utcDate(now);
  const start = utcDate(new Date(now.getTime() - product.windowDays * 86400_000));
  const url = product.url.replace("{startDate}", start).replace("{endDate}", end);
  if (url.includes("{")) {
    return { ok: false, problem: `${product.productKey}: unresolved placeholder in the product URL` };
  }
  return { ok: true, url };
}

function baseEnvelope<T>(product: LiveProduct, provider: LiveProviderDescriptor, url: string): Omit<LiveEnvelope<T>, "status" | "stale"> {
  const health = getHealth(product.productKey);
  return {
    provider: provider.name,
    providerKey: provider.providerKey,
    productKey: product.productKey,
    organization: provider.organization,
    sourceUrl: url,
    sources: provider.sources,
    license: provider.license,
    providerState: providerState(provider, [product.productKey]),
    kind: product.kind,
    refreshCadenceSeconds: product.refreshCadenceSeconds,
    cacheSeconds: product.cacheSeconds,
    provenance: `${product.label} from ${provider.name}, fetched from ${url}. ${product.cacheRationale}`,
    limitations: product.limitations,
    lastSuccessAt: health?.lastSuccessAt,
    lastAttemptAt: health?.lastAttemptAt,
  };
}

/**
 * Classify a successfully-parsed response. `observation`-based products are aged by the
 * provider's own newest timestamp; `fetch`-based ones by when we asked.
 *
 * A FORECAST product can never come back "live". `live` is defined as a real observation inside the
 * provider's publication cadence, and OVATION's aurora grid and NOAA's Kp forecast are predictions
 * about a time that has not happened — so a current forecast is reported as `forecast`, and only
 * its going out of date is expressed on the freshness ladder. Without this, the aurora panel on the
 * "current conditions" page was headed by a green "Live" badge for a model forecast, which the
 * envelope's own `CURRENT_STATUSES` set exists to forbid.
 */
function statusFor(product: LiveProduct, fetchedAt: string, observedAt: string | undefined, nowIso: string): LiveDataStatus {
  const reference = product.freshness.basis === "fetch" ? fetchedAt : observedAt;
  if (!reference) {
    // An observation-aged product that carried no timestamp is not something we can age, and an
    // un-ageable "current" value is exactly what this model exists to prevent.
    return "provider_error";
  }
  const freshness = classifyFreshness(product.freshness, reference, nowIso);
  if (product.kind !== "forecast") return freshness;
  // Still current → say what it is. Past its window → the staleness is the more important fact.
  return freshness === "stale" || freshness === "provider_error" ? freshness : "forecast";
}

/**
 * In-flight request coalescing. A page and its API route can render concurrently, and several
 * panels can want the same product; without this each would open its own socket to the provider
 * for the identical answer.
 */
const inFlight = new Map<string, Promise<unknown>>();

/**
 * Per-provider request gates.
 *
 * A provider's concurrency limit is a TERM OF USE, not a tuning choice — JPL's Fair Use Policy for
 * the SSD/CNEOS APIs says "You agree to submit only one API request at a time (no simultaneous
 * requests)". The service layer composes products with `Promise.all` because that is the natural
 * way to write it, so the limit is enforced here, in the one place every request passes through,
 * rather than depending on each caller remembering.
 *
 * A gate is a promise chain: each request waits for the one `slots` places ahead of it. With
 * `slots = 1` that is strict serialisation.
 */
const gates = new Map<string, Promise<void>[]>();

async function throughGate<T>(providerKey: string, slots: number, run: () => Promise<T>): Promise<T> {
  const queue = gates.get(providerKey) ?? [];
  gates.set(providerKey, queue);

  // Wait for the request `slots` positions back, so at most `slots` run at once.
  const ahead = queue.length >= slots ? queue[queue.length - slots] : undefined;
  let release!: () => void;
  const mine = new Promise<void>((resolve) => {
    release = resolve;
  });
  queue.push(mine);

  try {
    if (ahead) await ahead;
    return await run();
  } finally {
    release();
    const index = queue.indexOf(mine);
    if (index >= 0) queue.splice(index, 1);
  }
}

/**
 * Whether a provider is inside a back-off window after repeated failures.
 *
 * Asking a dead provider once per render, from every serverless instance, is how a third party's
 * outage becomes a third party's outage plus a request storm. JPL asks explicitly that automated
 * processes "back off or reduce request rates" on errors; this is that, and it applies to every
 * provider because it is good manners regardless of who documents it.
 */
function inBackoff(descriptor: LiveProviderDescriptor, productKey: string, nowIso: string): number | null {
  const health = getHealth(productKey);
  if (!health || health.consecutiveFailures < descriptor.backoffAfterFailures) return null;
  if (!health.lastFailureAt) return null;
  const elapsed = (Date.parse(nowIso) - Date.parse(health.lastFailureAt)) / 1000;
  if (!Number.isFinite(elapsed)) return null;
  const remaining = descriptor.backoffSeconds - elapsed;
  return remaining > 0 ? Math.ceil(remaining) : null;
}

export interface LoadOptions {
  /** The moment to judge freshness against. Defaults to now; injected by tests. */
  now?: Date;
}

/*
 * There is deliberately no "force" option. One existed, was never passed by anything, and made the
 * in-flight map unsound: a second promise for the same key overwrote the first, and the first's
 * `finally` then deleted the second's entry while it was still running. Code that needs a
 * guaranteed real request calls `clearCache()` — the provider probe does — which needs no second
 * path through the loader and cannot desynchronise the coalescing map.
 */

/**
 * Load one product and return its honesty envelope. Never throws, never returns fabricated data,
 * and never returns `data` it cannot age.
 */
export async function loadProduct<T>(productKey: string, parse: (raw: unknown) => ParseResult<T>, opts: LoadOptions = {}): Promise<LiveEnvelope<T>> {
  const now = opts.now ?? new Date();
  const nowIso = now.toISOString();

  const product = getLiveProduct(productKey);
  const provider = product ? getLiveProvider(product.providerKey) : undefined;
  if (!product || !provider) {
    // A configuration error, not a provider failure. It still must not throw.
    return {
      provider: "unknown", providerKey: "unknown", productKey, organization: "unknown", sourceUrl: "", sources: [],
      license: "unknown", providerState: "DISABLED", kind: "observation", cacheSeconds: 0,
      provenance: "No such product is registered.", status: "unavailable", stale: false,
      error: `unregistered product "${productKey}"`,
    };
  }

  if (provider.integration !== "IMPLEMENTED") {
    const resolved = resolveProductUrl(product, now);
    return {
      ...baseEnvelope<T>(product, provider, resolved.ok ? resolved.url : product.url),
      status: "unavailable",
      stale: false,
      error: provider.integration === "DISABLED" ? "this provider is switched off in this deployment" : "no client is implemented for this provider",
    };
  }

  const resolved = resolveProductUrl(product, now);
  if (!resolved.ok) {
    return { ...baseEnvelope<T>(product, provider, product.url), status: "provider_error", stale: false, error: resolved.problem };
  }
  const url = resolved.url;

  /* ---------------------------------------------- serve a still-fresh cache entry */
  {
    const cached = peek<{ value: T; observedAt?: string; generatedAt?: string; validFrom?: string; validUntil?: string }>(productKey);
    if (cached && isFresh(cached)) {
      const status = statusFor(product, cached.fetchedAt, cached.value.observedAt, nowIso);
      return {
        ...baseEnvelope<T>(product, provider, url),
        fetchedAt: cached.fetchedAt,
        generatedAt: cached.value.generatedAt ?? cached.value.observedAt,
        validFrom: cached.value.validFrom,
        validUntil: cached.value.validUntil,
        status,
        stale: status === "stale",
        data: cached.value.value,
      };
    }
  }

  /* ------------------------------------------------------------- refresh */
  /* ------------------------------------------------------------- back off */
  const cooldown = inBackoff(provider, productKey, nowIso);
  if (cooldown !== null) {
    // The provider has failed repeatedly and is being left alone. Whatever is cached is still shown
    // — honestly stale — and if nothing is, no value is shown. Either way the reason names the
    // back-off rather than pretending a request was made and failed again.
    return fallbackOrNothing<T>(
      product,
      provider,
      url,
      nowIso,
      `${provider.name} has failed ${getHealth(productKey)?.consecutiveFailures ?? 0} times in a row; no further request will be made for ${cooldown}s.`,
      false,
    );
  }

  const key = `${productKey}|${url}`;
  const existing = inFlight.get(key) as Promise<LiveEnvelope<T>> | undefined;
  if (existing) return existing;

  const pending = throughGate(provider.providerKey, provider.maxConcurrentRequests, () =>
    refresh<T>(product, provider, url, parse, nowIso),
  ).finally(() => {
    // Safe because a key can only ever have one promise: this is the sole `set`, and it is
    // guarded by the `get` above.
    inFlight.delete(key);
  });
  inFlight.set(key, pending);
  return pending;
}

async function refresh<T>(
  product: LiveProduct,
  provider: LiveProviderDescriptor,
  url: string,
  parse: (raw: unknown) => ParseResult<T>,
  nowIso: string,
): Promise<LiveEnvelope<T>> {
  recordAttempt(product.productKey, provider.providerKey, nowIso);

  const result = await fetchProviderJson<unknown>(url, { timeoutMs: provider.timeoutMs, maxBytes: product.maxBytes });

  if (!result.ok) {
    recordFailure(product.productKey, provider.providerKey, result.fetchedAt, result.reason, result.message, result.latencyMs);
    return fallbackOrNothing<T>(product, provider, url, nowIso, `${provider.name} could not be reached: ${result.message}`, result.reason === "malformed" || result.reason === "content_type");
  }

  const parsed = parse(result.value);
  if (!parsed.ok) {
    recordSchemaChange(product.productKey, provider.providerKey, result.fetchedAt, parsed.problem);
    return fallbackOrNothing<T>(product, provider, url, nowIso, `${provider.name} answered, but not in the shape this integration understands: ${parsed.problem}`, true);
  }

  recordSuccess(product.productKey, provider.providerKey, result.fetchedAt, result.latencyMs, result.bytes);
  put(product.productKey, { value: parsed.value, observedAt: parsed.observedAt, generatedAt: parsed.generatedAt, validFrom: parsed.validFrom, validUntil: parsed.validUntil }, result.fetchedAt, product.cacheSeconds);

  const status = statusFor(product, result.fetchedAt, parsed.observedAt, nowIso);
  return {
    ...baseEnvelope<T>(product, provider, url),
    fetchedAt: result.fetchedAt,
    // The provider's own timestamp for the newest datum IS this product's generation time, so it is
    // carried on the envelope rather than kept internal to the freshness calculation. Without it,
    // re-ageing a cached page falls back to the time WE asked, which understates how old the
    // measurement actually is.
    generatedAt: parsed.generatedAt ?? parsed.observedAt,
    validFrom: parsed.validFrom,
    validUntil: parsed.validUntil,
    status,
    stale: status === "stale",
    data: parsed.value,
  };
}

/**
 * The failure path. If a real earlier value is still retained, it is returned CLEARLY LABELLED as
 * stale and served from cache, with its original fetch time — never restamped, never presented as
 * current. If nothing is retained, the envelope carries no data at all: there is deliberately
 * nothing a page could render as a value.
 */
function fallbackOrNothing<T>(
  product: LiveProduct,
  provider: LiveProviderDescriptor,
  url: string,
  nowIso: string,
  reason: string,
  isProviderError: boolean,
): LiveEnvelope<T> {
  const cached = peek<{ value: T; observedAt?: string; generatedAt?: string; validFrom?: string; validUntil?: string }>(product.productKey);
  const base = baseEnvelope<T>(product, provider, url);

  if (!cached) {
    return { ...base, status: isProviderError ? "provider_error" : "unavailable", stale: false, error: reason };
  }

  return {
    ...base,
    fetchedAt: cached.fetchedAt,
    generatedAt: cached.value.generatedAt ?? cached.value.observedAt,
    validFrom: cached.value.validFrom,
    validUntil: cached.value.validUntil,
    // A refresh has failed, so whatever we hold is by definition no longer the provider's current
    // publication. It is shown as stale regardless of how recently it was fetched.
    status: "stale",
    stale: true,
    servedFromCache: true,
    error: reason,
    provenance: `${base.provenance} This is the last value that was successfully fetched, ${entryAgeSeconds(cached)} seconds ago; the most recent refresh failed, so it is shown as stale rather than as current.`,
    data: cached.value.value,
  };
}
