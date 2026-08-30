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
import { SPACE_WEATHER_SLUGS, NEO_SLUGS, SATELLITE_LIVE_SLUGS } from "../../src/lib/routes";
import { eme2000ToEcef, ecefToGeodetic, greenwichMeanSiderealTime, geodeticToEcef, lookAngles } from "../../src/platform/satellites/frames";
import { parseOem } from "../../src/platform/satellites/oem";
import { findPasses } from "../../src/platform/satellites/passes";
import type { Ephemeris } from "../../src/platform/satellites/oem";
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
  /*
   * A cadence, when the product HAS one, must be positive. A product may legitimately have none:
   * a published canon is not republished, and a cadence invented to fill the field would be shown
   * to readers as a claim that the provider reissues it on a schedule.
   */
  if (product.refreshCadenceSeconds !== undefined && product.refreshCadenceSeconds <= 0) {
    issues.push(`${product.productKey}: declares a cadence of ${product.refreshCadenceSeconds}s`);
  }
  if (product.refreshCadenceSeconds === undefined && product.freshness.basis === "observation") {
    issues.push(`${product.productKey}: is aged by its observation time but declares no publication cadence, so there is nothing to judge "late" against`);
  }
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
    /*
     * A server provider without products is a registry entry that does nothing. A BROWSER provider
     * legitimately has none — there is no server product to load, because the request is made by the
     * reader's own device — but it must say so, so that "no products" can never be the silent
     * result of forgetting to register one.
     */
    if (keys.length === 0 && provider.runtime !== "browser") {
      issues.push(`${provider.providerKey}: is registered but serves no products, and does not declare itself a browser-runtime provider`);
    }
    if (provider.runtime === "browser" && keys.length > 0) {
      issues.push(`${provider.providerKey}: declares a browser runtime but registers server products, which would be fetched by the server after all`);
    }

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
  if (freshness.basis === "observation" && refreshCadenceSeconds !== undefined && freshness.liveWithinSeconds < refreshCadenceSeconds) {
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
  for (const domain of ["space-weather", "neo", "satellites"]) {
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

  // The satellite family is nested under an existing encyclopedia section rather than owning its
  // own directory, so it is checked route by route instead of by listing a folder.
  if (!sitemap.includes("SATELLITE_LIVE_SLUGS")) {
    issues.push("sitemap: the live satellite family is not generated from its declared slug list (SATELLITE_LIVE_SLUGS)");
  }
  for (const slug of SATELLITE_LIVE_SLUGS) {
    const page = join(REPO, "src/app/satellites", slug, "page.tsx");
    try {
      statSync(page);
    } catch {
      issues.push(`satellites: /satellites/${slug} is in the sitemap but has no page at ${page.slice(REPO.length + 1)}`);
    }
  }
  ok(`the live satellite family is exactly ${SATELLITE_LIVE_SLUGS.length} stable URLs with no query parameters`);
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

/*
 * The reference-frame chain, checked by ARITHMETIC rather than by reading it.
 *
 * A satellite position is converted from NASA's J2000 state vectors into a place on the Earth
 * through precession, nutation and Earth rotation. Getting any of it wrong does not produce
 * nonsense — it produces a ground track displaced by a fraction of a degree, which looks entirely
 * plausible. These are the invariants that catch that without needing a network request; the
 * comparison against NASA's own node longitudes, which needs the live file, is in `live:probe`.
 */
{
  // Greenwich Mean Sidereal Time at J2000.0 is 18h 41m 50.548s by definition — the single value
  // that pins this formula's constant term and, with the second check, its rate.
  const j2000 = Date.UTC(2000, 0, 1, 12, 0, 0);
  const gmstJ2000Deg = (greenwichMeanSiderealTime(j2000) * 180) / Math.PI;
  const expectedJ2000 = ((67310.54841 % 86400) / 240);
  if (Math.abs(gmstJ2000Deg - expectedJ2000) > 1e-6) {
    issues.push(`frames: GMST at J2000.0 is ${gmstJ2000Deg.toFixed(6)}°, expected ${expectedJ2000.toFixed(6)}°`);
  }
  // One sidereal day later, GMST must have returned to the same value. This is what catches a wrong
  // rotation rate, which a single-epoch check cannot see.
  const siderealDayMs = 86164090.5;
  const after = (greenwichMeanSiderealTime(j2000 + siderealDayMs) * 180) / Math.PI;
  const drift = Math.abs(((after - gmstJ2000Deg + 540) % 360) - 180);
  if (drift > 0.001) issues.push(`frames: GMST drifted ${drift.toFixed(5)}° over one sidereal day; the rotation rate is wrong`);
  ok("sidereal time matches its defining value at J2000 and closes over one sidereal day");

  // Round-tripping geodetic coordinates through the Earth-fixed frame must return them unchanged.
  for (const [lat, lon, alt] of [[0, 0, 0], [51.4779, -0.0015, 0.024], [-33.8688, 151.2093, 0.058], [89.9, 179.9, 400]] as const) {
    const back = ecefToGeodetic(geodeticToEcef(lat, lon, alt));
    if (Math.abs(back.latitudeDeg - lat) > 1e-7 || Math.abs(back.altitudeKm - alt) > 1e-6) {
      issues.push(`frames: geodetic round trip failed for ${lat}, ${lon}, ${alt} km — got ${back.latitudeDeg}, ${back.longitudeDeg}, ${back.altitudeKm}`);
    }
  }
  ok("geodetic coordinates round-trip through the Earth-fixed frame at four latitudes");

  // A point directly above an observer must sit at 90° elevation; one on the opposite side of the
  // Earth must be far below the horizon. These catch a transposed topocentric rotation, which
  // otherwise produces azimuths that look reasonable and are wrong.
  const site = { latitudeDeg: 45, longitudeDeg: 20, altitudeKm: 0 };
  const overhead = geodeticToEcef(45, 20, 400);
  const zenith = lookAngles(site, overhead);
  if (Math.abs(zenith.elevationDeg - 90) > 1e-6) issues.push(`frames: a satellite directly overhead reported ${zenith.elevationDeg.toFixed(4)}° elevation`);
  if (Math.abs(zenith.rangeKm - 400) > 1e-6) issues.push(`frames: a satellite 400 km overhead reported a range of ${zenith.rangeKm.toFixed(3)} km`);
  const antipode = geodeticToEcef(-45, -160, 400);
  if (lookAngles(site, antipode).elevationDeg > -30) issues.push("frames: a satellite on the opposite side of the Earth was not far below the horizon");
  // Bearings, against the analytic great-circle formula rather than against intuition. A point at
  // the SAME latitude but a different longitude is not due east — on a sphere the initial bearing
  // to it is north of east, by about two degrees for six degrees of longitude at 45°N. Testing it
  // as 90° would be testing the wrong thing, and would pass only if the code were also wrong.
  const bearing = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const rad = Math.PI / 180;
    const dLon = (lon2 - lon1) * rad;
    const y = Math.sin(dLon) * Math.cos(lat2 * rad);
    const x = Math.cos(lat1 * rad) * Math.sin(lat2 * rad) - Math.sin(lat1 * rad) * Math.cos(lat2 * rad) * Math.cos(dLon);
    return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
  };
  for (const [lat2, lon2] of [[50, 20], [45, 26], [40, 14], [45, 14], [60, 45]] as const) {
    const measured = lookAngles(site, geodeticToEcef(lat2, lon2, 400)).azimuthDeg;
    const expected = bearing(site.latitudeDeg, site.longitudeDeg, lat2, lon2);
    const diff = Math.abs(((measured - expected + 540) % 360) - 180);
    // A tenth of a degree: the residual is the difference between the ellipsoid the look angles use
    // and the sphere the bearing formula assumes, which is real and small.
    if (diff > 0.1) issues.push(`frames: bearing to ${lat2}, ${lon2} read as ${measured.toFixed(3)}°, great-circle formula gives ${expected.toFixed(3)}°`);
  }
  ok("observer look angles match the analytic great-circle bearing at five directions, plus zenith and antipode");

  // The transform must actually MOVE with time: a fixed inertial vector maps to a longitude that
  // advances at the sidereal rate. A transform that silently ignored Earth rotation would pass
  // every static check above.
  const inertial = [7000, 0, 0] as const;
  const t0 = Date.UTC(2026, 5, 1, 0, 0, 0);
  const lon0 = ecefToGeodetic(eme2000ToEcef(inertial, t0)).longitudeDeg;
  const lon1 = ecefToGeodetic(eme2000ToEcef(inertial, t0 + 3600_000)).longitudeDeg;
  const moved = Math.abs(((lon0 - lon1 + 540) % 360) - 180);
  if (Math.abs(moved - 15.041) > 0.02) {
    issues.push(`frames: a fixed inertial direction moved ${moved.toFixed(3)}° of longitude in an hour; the sidereal rate is 15.041°`);
  }
  ok("a fixed inertial direction sweeps longitude at the sidereal rate");

  // The poles are ordinary points on the ellipsoid, and this is a general-purpose function. On the
  // polar axis the iteration divides by zero and every result downstream is NaN.
  for (const z of [6356.7523142, -6356.7523142, 6756.7523142]) {
    const g = ecefToGeodetic([0, 0, z]);
    if (!Number.isFinite(g.latitudeDeg) || !Number.isFinite(g.altitudeKm)) {
      issues.push(`frames: a position on the polar axis (z=${z}) produced NaN rather than a latitude of ±90°`);
    } else if (Math.abs(Math.abs(g.latitudeDeg) - 90) > 1e-9) {
      issues.push(`frames: a position on the polar axis reported latitude ${g.latitudeDeg}`);
    }
  }
  ok("a position exactly on the polar axis resolves rather than producing NaN");
}

/*
 * Pass-window edges, checked against a synthetic circular orbit so it needs no network.
 *
 * The rule being enforced is that a window boundary must not INVENT anything. A pass straddling an
 * edge previously came back with its rise clamped to the window — naming a compass direction the
 * satellite never rose from — or was dropped entirely at the other edge, which is the same defect
 * with the opposite sign.
 */
{
  // A 92-minute circular orbit at 51.6° inclination, tabulated every four minutes for two days,
  // built directly in EME2000. The numbers need not match any real satellite; what matters is that
  // it produces passes over a mid-latitude site.
  const states = [];
  const t0 = Date.UTC(2026, 6, 1, 0, 0, 0);
  const radius = 6778;
  const periodS = 92.9 * 60;
  const inc = (51.6 * Math.PI) / 180;
  for (let i = 0; i <= (2 * 86400) / 240; i++) {
    const t = t0 + i * 240_000;
    const u = (2 * Math.PI * (i * 240)) / periodS;
    const x = radius * Math.cos(u);
    const y = radius * Math.sin(u) * Math.cos(inc);
    const z = radius * Math.sin(u) * Math.sin(inc);
    states.push({ timeMs: t, position: [x, y, z] as [number, number, number], velocity: [0, 0, 0] as [number, number, number] });
  }
  const synthetic: Ephemeris = {
    objectName: "TEST", referenceFrame: "EME2000", timeSystem: "UTC",
    startMs: states[0].timeMs, stopMs: states[states.length - 1].timeMs,
    states, ascendingNodes: [], comments: [],
  };
  const observer = { latitudeDeg: 45, longitudeDeg: 10, altitudeKm: 0 };
  const full = findPasses(synthetic, observer, states[0].timeMs, states[states.length - 1].timeMs);

  if (full.length < 2) {
    issues.push(`pass finder: the synthetic orbit produced only ${full.length} passes over a mid-latitude site; the fixture is not exercising the boundary logic`);
  } else {
    const target = full[Math.floor(full.length / 2)];
    const mid = Math.round((target.startMs + target.endMs) / 2);
    const before = findPasses(synthetic, observer, states[0].timeMs, mid);
    const after = findPasses(synthetic, observer, mid, states[states.length - 1].timeMs);
    const inBefore = before.find((p) => Math.abs(p.startMs - target.startMs) < 60_000);
    const inAfter = after.find((p) => Math.abs(p.startMs - target.startMs) < 60_000);

    // Exactly one window, and with the pass's own rise — not the window's edge.
    if (Boolean(inBefore) === Boolean(inAfter)) {
      issues.push(`pass finder: a pass straddling a window boundary appeared in ${inBefore && inAfter ? "both" : "neither"} adjacent window; it must appear in exactly one`);
    }
    const found = inBefore ?? inAfter;
    if (found) {
      if (Math.abs(found.riseAzimuthDeg - target.riseAzimuthDeg) > 0.5) {
        issues.push(`pass finder: a boundary-straddling pass reported rise azimuth ${found.riseAzimuthDeg.toFixed(1)}°, but its real rise is ${target.riseAzimuthDeg.toFixed(1)}° — a clamped edge presented as a measurement`);
      }
      if (Math.abs(found.durationSeconds - target.durationSeconds) > 30) {
        issues.push(`pass finder: a boundary-straddling pass reported ${found.durationSeconds}s, but it lasts ${target.durationSeconds}s`);
      }
      if (found.truncatedByEphemeris) {
        issues.push("pass finder: a pass truncated only by the REQUESTED window was flagged as truncated by the ephemeris");
      }
    }
    ok(`a pass straddling a window boundary appears in exactly one window, with its own rise (${full.length} synthetic passes)`);
  }
}

/*
 * The OEM parser must refuse what it cannot safely interpret, rather than interpreting it.
 */
{
  const header = [
    "CCSDS_OEM_VERS = 2.0",
    "ORIGINATOR = TEST",
  ];
  const segment = (frame: string, timeSystem: string, epoch: string) => [
    "META_START",
    `OBJECT_NAME = TEST`,
    `CENTER_NAME = Earth`,
    `REF_FRAME = ${frame}`,
    `TIME_SYSTEM = ${timeSystem}`,
    `START_TIME = ${epoch}`,
    `STOP_TIME = ${epoch}`,
    "META_STOP",
    `${epoch} 7000.0 0.0 0.0 0.0 7.5 0.0`,
    `2026-07-01T00:04:00.000 7000.0 100.0 0.0 0.0 7.5 0.0`,
  ];

  const single = parseOem([...header, ...segment("EME2000", "UTC", "2026-07-01T00:00:00.000")].join("\n"));
  if (!single.ok) issues.push(`oem: a valid single-segment file was rejected — ${single.problem}`);

  // Two segments in different frames: the frame check reads only the LAST declaration while every
  // segment's vectors are merged, so this must be refused outright.
  const mixed = parseOem([
    ...header,
    ...segment("TEME", "UTC", "2026-07-01T00:00:00.000"),
    ...segment("EME2000", "UTC", "2026-07-01T01:00:00.000"),
  ].join("\n"));
  if (mixed.ok) issues.push("oem: a multi-segment file with two different reference frames was accepted; its state vectors would be silently mixed across coordinate systems");

  const wrongFrame = parseOem([...header, ...segment("TEME", "UTC", "2026-07-01T00:00:00.000")].join("\n"));
  if (wrongFrame.ok) issues.push("oem: a TEME file was accepted by a parser written for EME2000");
  const wrongTime = parseOem([...header, ...segment("EME2000", "TAI", "2026-07-01T00:00:00.000")].join("\n"));
  if (wrongTime.ok) issues.push("oem: a TAI file was accepted by a parser written for UTC");

  // The node regex backtracks quadratically; a bounded scan is what stops one long line from
  // blocking the event loop for minutes.
  const started = Date.now();
  parseOem([...header, `COMMENT asc. node: EPOCH = ${"A".repeat(200_000)}`, ...segment("EME2000", "UTC", "2026-07-01T00:00:00.000")].join("\n"));
  const elapsed = Date.now() - started;
  if (elapsed > 500) issues.push(`oem: a 200,000-character comment took ${elapsed}ms to parse; the comment scan is not bounded`);
  ok(`the OEM parser refuses mixed frames, wrong frames and wrong time systems, and bounds its comment scan (${elapsed}ms on 200k characters)`);
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
