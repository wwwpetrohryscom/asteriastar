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
 */
function statusFor(product: LiveProduct, fetchedAt: string, observedAt: string | undefined, nowIso: string): LiveDataStatus {
  const reference = product.freshness.basis === "fetch" ? fetchedAt : observedAt;
  if (!reference) {
    // An observation-aged product that carried no timestamp is not something we can age, and an
    // un-ageable "current" value is exactly what this model exists to prevent.
    return "provider_error";
  }
  return classifyFreshness(product.freshness, reference, nowIso);
}

/**
 * In-flight request coalescing. A page and its API route can render concurrently, and several
 * panels can want the same product; without this each would open its own socket to the provider
 * for the identical answer.
 */
const inFlight = new Map<string, Promise<unknown>>();

export interface LoadOptions {
  /** The moment to judge freshness against. Defaults to now; injected by tests. */
  now?: Date;
  /** Skip the cache and force a request. Used only by the provider probe. */
  force?: boolean;
}

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
  if (!opts.force) {
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
  const key = `${productKey}|${url}`;
  let pending = inFlight.get(key) as Promise<LiveEnvelope<T>> | undefined;
  if (!pending || opts.force) {
    pending = refresh<T>(product, provider, url, parse, nowIso).finally(() => {
      inFlight.delete(key);
    });
    inFlight.set(key, pending);
  }
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
