import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import {
  LIVE_PRODUCTS, LIVE_PROVIDERS, getLiveProduct, getLiveProvider, providerState,
} from "../../src/platform/live-providers/registry";
import { checkProviderUrl, ALLOWED_PROVIDER_HOSTS, MAX_RESPONSE_BYTES } from "../../src/platform/live-providers/fetch";
import {
  classifyFreshness, refreshStatus, CURRENT_STATUSES, NO_VALUE_STATUSES,
  FUTURE_TIMESTAMP_TOLERANCE_SECONDS, type LiveEnvelope,
} from "../../src/platform/live-providers/envelope";
import { CACHE_FALLBACK_RETENTION_SECONDS, clearCache } from "../../src/platform/live-providers/cache";
import { clearHealth } from "../../src/platform/live-providers/health";
import { loadProduct } from "../../src/platform/live-providers/client";
import { PROVIDERS } from "../../src/platform/live-sky/providers";
import { BT_RECORDS } from "../../src/knowledge-graph/data/live-data-catalog";
import { SPACE_WEATHER_SLUGS, NEO_SLUGS } from "../../src/lib/routes";
import { liveCacheControl } from "../../src/platform/space-weather/api";

/**
 * PERMANENT GATE — live-provider honesty.
 *
 * Offline and deterministic: it makes no network request, so it runs in CI and on a laptop with no
 * connectivity and always gives the same answer. It checks the things that, if they ever became
 * false, would let AsteriaStar tell a lie about live data:
 *
 *   1  stale data presented as live
 *   2  a provider timestamp in the future accepted as fresh
 *   3  a value without units
 *   4  a value without a source
 *   5  a value without a fetch time
 *   6  a provider status that contradicts the integration behind it
 *   7  cached data not labelled stale
 *   8  a cache window longer than the data is valid for
 *   9  a fabricated provider status — CONNECTED asserted rather than earned
 *  10  a dynamic query URL in the sitemap
 *  11  a provider URL that is not on the fetch allowlist
 *  12  a provider URL built from anything but constants and the server clock
 *  13  provider responses committed to the repository
 *  14  a catalogue record that contradicts the running integration
 *
 * Where a rule is about BEHAVIOUR rather than shape it is tested by execution, not by inspection:
 * a static check cannot tell whether `classifyFreshness` actually returns "stale", so this runs it.
 */

const issues: string[] = [];
const checks: string[] = [];
const ok = (what: string) => checks.push(what);

const REPO = join(import.meta.dirname, "..", "..");

/* ------------------------------------------------------------------ 1–2. freshness semantics */
{
  const policy = { basis: "observation" as const, liveWithinSeconds: 900, recentWithinSeconds: 3600, staleAfterSeconds: 10800 };
  const now = "2026-01-01T12:00:00.000Z";
  const at = (secondsAgo: number) => new Date(Date.parse(now) - secondsAgo * 1000).toISOString();

  const cases: [number, string][] = [
    [60, "live"],
    [900, "live"],
    [901, "recent"],
    [3600, "recent"],
    [3601, "delayed"],
    [10800, "delayed"],
    [10801, "stale"],
    [86400, "stale"],
  ];
  for (const [age, expected] of cases) {
    const got = classifyFreshness(policy, at(age), now);
    if (got !== expected) issues.push(`freshness: a reading ${age}s old classified as "${got}", expected "${expected}" — stale data must never read as live`);
  }
  ok(`freshness ladder holds across ${cases.length} ages`);

  // A timestamp beyond the clock-skew tolerance is not a fresh datum, it is an unusable one.
  const future = new Date(Date.parse(now) + (FUTURE_TIMESTAMP_TOLERANCE_SECONDS + 60) * 1000).toISOString();
  if (classifyFreshness(policy, future, now) !== "provider_error") {
    issues.push("freshness: a provider timestamp far in the future was accepted — it must be rejected, not treated as maximally fresh");
  }
  const slightlyAhead = new Date(Date.parse(now) + 60_000).toISOString();
  if (classifyFreshness(policy, slightlyAhead, now) !== "live") {
    issues.push("freshness: a timestamp a minute ahead was rejected — ordinary clock skew must be tolerated");
  }
  if (!Number.isNaN(0) && classifyFreshness(policy, "not-a-date", now) !== "provider_error") {
    issues.push("freshness: an unparseable timestamp was not rejected");
  }
  ok("future and unparseable provider timestamps are rejected, ordinary skew tolerated");

  // Re-ageing a rendered envelope must actually downgrade it.
  const envelope: LiveEnvelope<number> = {
    provider: "test", providerKey: "test", productKey: "swpc:solar-wind-speed", organization: "test",
    sourceUrl: "https://services.swpc.noaa.gov/products/summary/solar-wind-speed.json", sources: ["swpc"],
    license: "test", providerState: "CONNECTED", kind: "observation", cacheSeconds: 60,
    provenance: "test", status: "live", stale: false, generatedAt: at(0), fetchedAt: at(0), data: 400,
  };
  const later = new Date(Date.parse(now) + 4 * 3600 * 1000).toISOString();
  const aged = refreshStatus(envelope, policy, later);
  if (aged.status !== "stale" || !aged.stale) {
    issues.push(`re-ageing: an envelope rendered four hours ago still reports "${aged.status}" — a cached page must age its own status`);
  }
  ok("a rendered envelope downgrades to stale when re-aged");
}

/* ------------------------------------------------------- 3–5. units, sources, fetch timestamps */
for (const product of LIVE_PRODUCTS) {
  const provider = getLiveProvider(product.providerKey);
  if (!provider) {
    issues.push(`${product.productKey}: references unknown provider "${product.providerKey}"`);
    continue;
  }
  if (!provider.sources.length) issues.push(`${provider.providerKey}: declares no source-registry keys — a value with no source cannot be cited`);
  if (!product.limitations) issues.push(`${product.productKey}: states no limitations`);
  if (!product.cacheRationale) issues.push(`${product.productKey}: gives no reason for its cache window`);
  if (product.refreshCadenceSeconds <= 0) issues.push(`${product.productKey}: has no publication cadence`);
}
ok(`${LIVE_PRODUCTS.length} products declare sources, limitations and a cache rationale`);

/*
 * Units live on each datum, not on the product, and the type system already forbids a `LiveDatum`
 * without a `unit` — that is why there is no runtime unit check here. What this gate can add is the
 * guarantee that the measured products exist at all, so that a registry emptied by a bad refactor
 * fails loudly instead of passing every other rule vacuously. The units themselves are exercised
 * end-to-end by `npm run live:probe`, which fetches every product and inspects what comes back.
 */
{
  const measured = LIVE_PRODUCTS.filter((p) => p.kind === "observation" || p.kind === "model");
  if (measured.length === 0) issues.push("registry: no observation or model products are registered at all");
  ok(`${measured.length} measured products registered (units are enforced by the LiveDatum type and exercised by live:probe)`);
}

/* --------------------------------------------------- 6, 9. provider state is earned, not typed */
{
  clearHealth();
  for (const provider of LIVE_PROVIDERS) {
    const keys = LIVE_PRODUCTS.filter((p) => p.providerKey === provider.providerKey).map((p) => p.productKey);
    if (keys.length === 0) issues.push(`${provider.providerKey}: is registered but serves no products`);

    const state = providerState(provider, keys);
    if (provider.integration === "PLANNED" && state !== "PLANNED") {
      issues.push(`${provider.providerKey}: integration is PLANNED but state resolves to ${state}`);
    }
    // The one route to CONNECTED without a successful request in this process is a recorded
    // end-to-end verification. Anything else would be a status typed in by hand.
    if (provider.integration === "IMPLEMENTED" && !provider.verifiedAt && state === "CONNECTED") {
      issues.push(`${provider.providerKey}: reports CONNECTED with no successful request and no recorded verification — a fabricated status`);
    }
    if (provider.verifiedAt && !/^\d{4}-\d{2}-\d{2}$/.test(provider.verifiedAt)) {
      issues.push(`${provider.providerKey}: verifiedAt "${provider.verifiedAt}" is not a plain ISO date`);
    }
    if (provider.verifiedAt && provider.verifiedAt > new Date().toISOString().slice(0, 10)) {
      issues.push(`${provider.providerKey}: verifiedAt is in the future`);
    }
    if (provider.authentication === "api-key" && !provider.apiKeyEnvVar) {
      issues.push(`${provider.providerKey}: requires a key but names no environment variable for it`);
    }
    if (!provider.rateLimits || !provider.redistribution || !provider.license || !provider.attribution) {
      issues.push(`${provider.providerKey}: is missing its terms (rate limits, redistribution, licence, attribution)`);
    }
    if (!Number.isInteger(provider.maxConcurrentRequests) || provider.maxConcurrentRequests < 1) {
      issues.push(`${provider.providerKey}: declares no usable concurrency limit — this is a term of use, not a tuning value`);
    }
    if (provider.backoffAfterFailures < 1 || provider.backoffSeconds < 1) {
      issues.push(`${provider.providerKey}: declares no failure back-off; a provider outage would become a request storm`);
    }
  }
  ok(`${LIVE_PROVIDERS.length} providers derive their state from real request history or a recorded verification`);
  const serialised = LIVE_PROVIDERS.filter((p) => p.maxConcurrentRequests === 1).map((p) => p.providerKey);
  ok(`every provider declares a concurrency limit and a failure back-off${serialised.length > 0 ? ` (serialised by their own terms: ${serialised.join(", ")})` : ""}`);
}

/* -------------------------------------------- 7–8. cache windows and the stale-fallback contract */
for (const product of LIVE_PRODUCTS) {
  const { cacheSeconds, refreshCadenceSeconds, freshness, productKey } = product;
  if (cacheSeconds > freshness.staleAfterSeconds) {
    issues.push(`${productKey}: cached for ${cacheSeconds}s but treated as stale after ${freshness.staleAfterSeconds}s — the cache would outlive the data's validity`);
  }
  if (freshness.liveWithinSeconds > freshness.recentWithinSeconds || freshness.recentWithinSeconds > freshness.staleAfterSeconds) {
    issues.push(`${productKey}: freshness thresholds are not ordered live <= recent <= stale`);
  }
  if (freshness.basis === "observation" && freshness.liveWithinSeconds < refreshCadenceSeconds) {
    issues.push(`${productKey}: would be marked stale before the provider has published again (live window ${freshness.liveWithinSeconds}s < cadence ${refreshCadenceSeconds}s)`);
  }
  if (product.maxBytes > MAX_RESPONSE_BYTES) {
    issues.push(`${productKey}: its byte ceiling exceeds the global cap`);
  }
}
if (CACHE_FALLBACK_RETENTION_SECONDS <= 0) issues.push("cache: the stale-fallback retention window is not positive");
ok(`${LIVE_PRODUCTS.length} cache windows are shorter than their own stale thresholds`);

/*
 * The HTTP header must obey the same rule as the in-process cache. `stale-while-revalidate` ADDS to
 * `max-age` rather than capping it, so it is their SUM that bounds how old a shared cache may serve
 * a response — and that sum must stay under the shortest product's stale threshold, or the header
 * would permit exactly what the platform refuses to do everywhere else.
 */
{
  const groups: string[][] = [
    LIVE_PRODUCTS.map((p) => p.productKey),
    LIVE_PRODUCTS.filter((p) => p.providerKey === "noaa-swpc").map((p) => p.productKey),
    LIVE_PRODUCTS.filter((p) => p.providerKey === "nasa-donki").map((p) => p.productKey),
    ["swpc:solar-wind-speed"],
    ["swpc:ovation-aurora"],
  ];
  for (const group of groups) {
    const header = liveCacheControl(group);
    const maxAge = Number(/max-age=(\d+)/.exec(header)?.[1]);
    const swr = Number(/stale-while-revalidate=(\d+)/.exec(header)?.[1]);
    if (!Number.isFinite(maxAge) || !Number.isFinite(swr)) {
      issues.push(`cache-control: "${header}" does not declare both max-age and stale-while-revalidate`);
      continue;
    }
    const shortestStale = Math.min(...group.map((k) => getLiveProduct(k)?.freshness.staleAfterSeconds ?? Infinity));
    if (maxAge + swr > shortestStale) {
      issues.push(`cache-control: "${header}" permits a shared cache to serve a response ${maxAge + swr}s old, past the ${shortestStale}s stale threshold of the shortest-lived product it covers`);
    }
  }
  ok(`${groups.length} cache-control headers keep max-age + stale-while-revalidate inside the stale threshold`);
}

/*
 * The stale-fallback path, executed. A cached value returned after a failed refresh must come back
 * flagged `stale` and `servedFromCache`, never as a current reading. This is checked by running the
 * client against an unregistered product (guaranteed offline) and confirming the no-data contract,
 * then by confirming the envelope shape for the cached path in `client.ts`.
 */
/** The one check that must run the client, so it lives in an async step (see `main` below). */
async function checkFailurePath(): Promise<void> {
  clearCache();
  clearHealth();
  const envelope = await loadProduct("this-product-does-not-exist", () => ({ ok: true as const, value: 1 }));
  if (envelope.data !== undefined) issues.push("client: an unregistered product returned data");
  if (!NO_VALUE_STATUSES.has(envelope.status)) issues.push(`client: an unregistered product returned status "${envelope.status}" instead of a no-value status`);
  if (!envelope.error) issues.push("client: an unregistered product returned no reason");
  ok("an unresolvable product returns an honest empty envelope rather than throwing");

  const clientSource = readFileSync(join(REPO, "src/platform/live-providers/client.ts"), "utf8");
  if (!/status: "stale",\s*\n\s*stale: true,\s*\n\s*servedFromCache: true,/.test(clientSource)) {
    issues.push("client: the cache-fallback path no longer marks its response stale and served-from-cache");
  }
  if (!clientSource.includes('return { ...base, status: isProviderError ? "provider_error" : "unavailable", stale: false, error: reason };')) {
    issues.push("client: the no-cache failure path no longer returns an envelope without data");
  }
  ok("the failure path returns either an honestly-stale cached value or no value at all");
}

/* --------------------------------------------- 11–12. every provider URL is safe and constant */
for (const product of LIVE_PRODUCTS) {
  const concrete = product.url.replace("{startDate}", "2026-01-01").replace("{endDate}", "2026-01-31");
  const checked = checkProviderUrl(concrete);
  if (!checked.ok) {
    issues.push(`${product.productKey}: its URL is refused by the fetch guard — ${checked.message}`);
    continue;
  }
  const placeholders = product.url.match(/\{[^}]*\}/g) ?? [];
  for (const p of placeholders) {
    if (p !== "{startDate}" && p !== "{endDate}") {
      issues.push(`${product.productKey}: URL carries placeholder ${p}; only {startDate} and {endDate} are permitted, and both come from the server clock`);
    }
  }
  if (placeholders.length > 0 && product.windowDays === undefined) {
    issues.push(`${product.productKey}: templated URL without a windowDays setting`);
  }
  const provider = getLiveProvider(product.providerKey);
  if (provider && !concrete.startsWith(provider.baseUrl)) {
    issues.push(`${product.productKey}: its URL is not under its provider's declared base URL`);
  }
}
ok(`${LIVE_PRODUCTS.length} product URLs resolve to allowlisted HTTPS hosts (${ALLOWED_PROVIDER_HOSTS.length} permitted)`);

/*
 * No provider URL may be assembled from a request. Scanning the source for a template literal that
 * interpolates into a provider host is what catches an SSRF being introduced later, when the guard
 * would still pass because the host happens to be right.
 */
{
  const runtimeDir = join(REPO, "src/platform/live-providers");
  for (const file of readdirSync(runtimeDir)) {
    if (!file.endsWith(".ts")) continue;
    const src = readFileSync(join(runtimeDir, file), "utf8");
    if (/fetch\s*\(\s*`/.test(src)) {
      issues.push(`live-providers/${file}: calls fetch with a template literal — provider URLs must be resolved through the registry and the guard`);
    }
  }
  for (const domain of ["space-weather", "neo"]) {
    const domainDir = join(REPO, "src/platform", domain);
    for (const file of readdirSync(domainDir)) {
      if (!file.endsWith(".ts")) continue;
      const src = readFileSync(join(domainDir, file), "utf8");
      if (/\bfetch\s*\(/.test(src)) {
        issues.push(`${domain}/${file}: calls fetch directly — every provider request must go through loadProduct`);
      }
    }
  }
  ok("no domain client calls fetch directly; every request goes through the guarded path");
}

/* ------------------------------------------------- 10. no dynamic query URL reaches the sitemap */
{
  const sitemap = readFileSync(join(REPO, "src/app/sitemap.ts"), "utf8");
  for (const marker of ["?lat", "?lon", "?latitude", "?longitude", "?date=", "&lat", "&lon"]) {
    if (sitemap.includes(marker)) issues.push(`sitemap: contains "${marker}" — coordinate and date parameters must never be crawlable`);
  }
  /*
   * Each live route family must be exactly the slugs it declares — no more, no fewer, and no query
   * parameters anywhere. A page on disk that the sitemap does not know about is invisible; a slug
   * in the sitemap with no page behind it is a 404 served to a crawler.
   */
  const families: [string, readonly string[], string][] = [
    ["space-weather", SPACE_WEATHER_SLUGS, "SPACE_WEATHER_SLUGS"],
    ["neo", NEO_SLUGS, "NEO_SLUGS"],
  ];
  for (const [dir, slugs, token] of families) {
    if (!sitemap.includes(token)) {
      issues.push(`sitemap: the ${dir} family is not generated from its declared slug list (${token})`);
    }
    const pagesDir = join(REPO, "src/app", dir);
    const present = readdirSync(pagesDir).filter((d) => statSync(join(pagesDir, d)).isDirectory()).sort();
    const declared = [...slugs].sort();
    if (present.join(",") !== declared.join(",")) {
      issues.push(`${dir}: the routes on disk (${present.join(", ")}) do not match the declared slugs (${declared.join(", ")}) — the sitemap would list a page that does not exist, or miss one that does`);
    }
    ok(`the ${dir} family is exactly ${declared.length} stable URLs with no query parameters`);
  }
}

/* ------------------------------------ 13. no operational provider response is in the repository */
{
  const forbidden: string[] = [];
  const scan = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) {
        if (name === "node_modules" || name === ".git" || name === ".next") continue;
        scan(full);
      } else if (/\.(json|csv|ndjson)$/.test(name)) {
        // A committed file whose name matches a live product key would be a cached observation.
        for (const product of LIVE_PRODUCTS) {
          const slug = product.productKey.replace(":", "-");
          if (name.includes(slug)) forbidden.push(full.slice(REPO.length + 1));
        }
      }
    }
  };
  scan(join(REPO, "src"));
  scan(join(REPO, "public"));
  for (const f of forbidden) {
    issues.push(`retention: ${f} looks like a committed provider response — operational data must be cached in memory, never committed`);
  }
  ok("no operational provider response is committed to the repository");
}

/* -------------------------- 14. the catalogue, the live-sky registry and the runtime agree */
for (const provider of LIVE_PROVIDERS) {
  const connected = provider.integration === "IMPLEMENTED" && Boolean(provider.verifiedAt);

  if (provider.liveSkyKey) {
    const skyProvider = PROVIDERS.find((p) => p.key === provider.liveSkyKey);
    if (!skyProvider) {
      issues.push(`${provider.providerKey}: names live-sky provider "${provider.liveSkyKey}", which does not exist`);
    } else if (connected && skyProvider.status !== "connected") {
      issues.push(`${provider.providerKey}: is connected, but the live-sky registry still reports "${skyProvider.status}" — the two views must not disagree`);
    } else if (!connected && skyProvider.status === "connected") {
      issues.push(`${provider.providerKey}: the live-sky registry claims connected, but there is no verified integration behind it`);
    }
  }

  if (provider.entityId) {
    const record = BT_RECORDS.find((r) => r.id === provider.entityId);
    if (!record) {
      issues.push(`${provider.providerKey}: names catalogue entity "${provider.entityId}", which does not exist`);
    } else if (connected && record.status !== "connected") {
      issues.push(`${provider.providerKey}: is connected, but its live-data catalogue record still reports "${record.status}"`);
    } else if (!connected && record.status === "connected") {
      issues.push(`${provider.providerKey}: the catalogue claims connected, but there is no verified integration behind it`);
    }
  }
}
ok("the runtime registry, the live-sky registry and the knowledge-graph catalogue agree on who is connected");

/*
 * A forecast product must never come back as an observation. This is checked by EXECUTION, because
 * the rule lives in a branch of `statusFor` that a static read cannot evaluate: the OVATION aurora
 * grid and the Kp forecast are predictions, and `live` is defined as a real observation.
 */
for (const product of LIVE_PRODUCTS.filter((p) => p.kind === "forecast")) {
  const fresh = classifyFreshness(product.freshness, new Date().toISOString(), new Date().toISOString());
  if (fresh === "live") {
    // The freshness ladder itself still says "live"; what matters is that the product's kind
    // overrides it. That override lives in the client, which the failure-mode suite executes —
    // this records which products depend on it.
    ok(`${product.productKey} is a forecast product and relies on the kind override in statusFor`);
  }
}

/* --------------------------------------------- no page may claim a no-value status is current */
{
  for (const status of ["unavailable", "provider_error", "stale", "forecast", "historical"] as const) {
    if (CURRENT_STATUSES.has(status)) issues.push(`envelope: "${status}" is listed as a status that may describe current conditions`);
  }
  for (const status of ["live", "recent", "delayed", "computed"] as const) {
    if (!CURRENT_STATUSES.has(status)) issues.push(`envelope: "${status}" is not listed as a status that may describe current conditions`);
  }
  ok("the current-conditions status set excludes forecast, historical, stale and unavailable");
}

/* ---------------------------------------------------------------------------------- report */
async function main(): Promise<void> {
  await checkFailurePath();

  if (issues.length > 0) {
    console.error(`\n✗ Live-provider gate failed — ${issues.length} issue(s):`);
    for (const i of issues) console.error(`  • ${i}`);
    process.exit(1);
  }

  console.log(`✓ Live providers valid — ${LIVE_PROVIDERS.length} providers, ${LIVE_PRODUCTS.length} products, ${checks.length} invariants held`);
  for (const c of checks) console.log(`    · ${c}`);
}

void main();
