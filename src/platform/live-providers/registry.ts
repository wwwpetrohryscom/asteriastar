import type { SourceKey } from "@/lib/sources";
import type { FreshnessPolicy, ObservationKind, ProviderState } from "@/platform/live-providers/envelope";
import { getHealth } from "@/platform/live-providers/health";

/**
 * The live-provider registry.
 *
 * This extends the platform's existing provider architecture (`platform/live-sky/providers`,
 * which declares the typed interfaces and the organisations) with everything an actually-running
 * integration needs: the exact product URLs, authentication, documented rate limits,
 * redistribution terms, publication cadence, timeouts, cache windows and freshness thresholds.
 *
 * There is no second provider system. A provider here carries `liveSkyKey`, pointing at its
 * entry in that registry, and `entityId`, pointing at the live-data-source entity in the
 * Knowledge Graph, so all three views describe one thing.
 *
 * Every claim in a descriptor was checked against the provider's own documentation before it was
 * written down — including the ones that are inconvenient, such as CCMC's statement that DONKI
 * is prototyping-quality data.
 */

/** Whether client code exists for this provider — a fact about the repository, not about uptime. */
export type IntegrationLevel =
  | "PLANNED" // no client is written; nothing is fetched
  | "IMPLEMENTED" // a client exists and is wired
  | "DISABLED"; // a client exists but is deliberately switched off

export type ProviderCategory = "space-weather" | "solar-activity" | "near-earth-object" | "orbital" | "atmospheric" | "events";

export interface LiveProviderDescriptor {
  providerKey: string;
  name: string;
  organization: string;
  /** The provider's own documentation for the service being used. */
  documentation: string;
  /** The base URL products are fetched from. Its host must be on the fetch allowlist. */
  baseUrl: string;
  category: ProviderCategory;
  sources: SourceKey[];
  /** The matching key in the Live Sky provider registry, when the provider is modelled there. */
  liveSkyKey?: string;
  /** The Knowledge Graph entity for this provider, when one exists. */
  entityId?: string;

  /* access and terms — read off the provider's documentation, never assumed */
  authentication: "none" | "api-key" | "credentials";
  /** The environment variable that supplies the key, when one is required. */
  apiKeyEnvVar?: string;
  /** What the provider documents about request rates. "undocumented" is said, not guessed. */
  rateLimits: string;
  /** What the provider's terms permit, paraphrasing the stated terms. */
  redistribution: string;
  license: string;
  /** How the provider asks to be credited. */
  attribution: string;
  /** A limitation the provider itself states about its data. Quoted, not softened. */
  providerCaveat?: string;

  /* operational policy */
  integration: IntegrationLevel;
  timeoutMs: number;
  /**
   * How many requests this provider permits AsteriaStar to have open at once.
   *
   * Not a performance tuning knob — a term of use. JPL's Fair Use Policy for the SSD/CNEOS APIs
   * states: "You agree to submit only one API request at a time (no simultaneous requests)." The
   * service layer still composes products with `Promise.all`, so the queue that enforces this lives
   * in the loader, where it cannot be forgotten by a caller.
   */
  maxConcurrentRequests: number;
  /**
   * After this many consecutive failures the provider is left alone for `backoffSeconds` rather
   * than being asked again on every render. JPL asks that automated processes "back off or reduce
   * request rates" on errors; it is also what stops a provider outage becoming a request storm from
   * every serverless instance at once.
   */
  backoffAfterFailures: number;
  backoffSeconds: number;
  /** Version tag for the response shape this client parses. Bumped when a parser changes. */
  schemaVersion: string;
  /**
   * The date this integration was last verified end-to-end against the live provider by
   * `npm run live:probe`. Absent means never verified — which forbids claiming CONNECTED.
   */
  verifiedAt?: string;
  note?: string;
}

/**
 * One fetchable product from a provider. A provider is not a single feed: NOAA SWPC publishes
 * dozens of products with different cadences, semantics and sizes, and treating them as one
 * would mean caching a one-minute measurement like a daily summary.
 */
export interface LiveProduct {
  productKey: string;
  providerKey: string;
  label: string;
  /**
   * The URL fetched. Either constant, or a template whose ONLY placeholders are `{startDate}`
   * and `{endDate}` — both formatted from the server clock. No part of any provider URL is ever
   * built from a request, a header, or user input.
   */
  url: string;
  /** For a date-windowed product: how many days back `{startDate}` is set. */
  windowDays?: number;
  /** What the numbers in this product are. */
  kind: ObservationKind;
  /** Seconds AsteriaStar caches the parsed response. */
  cacheSeconds: number;
  /** How often the provider itself publishes, as documented or as demonstrated by the feed. */
  refreshCadenceSeconds: number;
  freshness: FreshnessPolicy;
  /** Ceiling for this product specifically; a response larger than this is refused. */
  maxBytes: number;
  /** Why this cache window is defensible for this product. */
  cacheRationale: string;
  /** Honest limits: resolution, coverage, what the product is not. */
  limitations: string;
}

/* ------------------------------------------------------------------ providers */

export const LIVE_PROVIDERS: LiveProviderDescriptor[] = [
  {
    providerKey: "noaa-swpc",
    name: "NOAA Space Weather Prediction Center",
    organization: "NOAA / National Weather Service",
    documentation: "https://www.spaceweather.gov/content/data-access",
    baseUrl: "https://services.swpc.noaa.gov",
    category: "space-weather",
    sources: ["swpc"],
    liveSkyKey: "noaa-swpc",
    entityId: "live_data_source:noaa-swpc",
    authentication: "none",
    rateLimits:
      "No key requirement and no published rate limit: SWPC serves these products as static JSON files. AsteriaStar polls no faster than each product's own publication cadence and caches every response, so a page view is not a provider request.",
    redistribution:
      "A work of the US Government, not subject to domestic copyright (17 U.S.C. §105) and freely reusable. 17 U.S.C. §403 asks that a work built predominantly on federal material identify it as such — which is what the provenance line on every value does.",
    license: "Public domain (US Government work). No licence fee and no redistribution restriction.",
    attribution: "NOAA Space Weather Prediction Center (SWPC)",
    integration: "IMPLEMENTED",
    timeoutMs: 8000,
    maxConcurrentRequests: 4,
    backoffAfterFailures: 3,
    backoffSeconds: 60,
    schemaVersion: "swpc-2026-08",
    verifiedAt: "2026-08-29",
  },
  {
    providerKey: "nasa-donki",
    name: "NASA DONKI",
    organization: "NASA Goddard Space Flight Center / Community Coordinated Modeling Center",
    documentation: "https://ccmc.gsfc.nasa.gov/tools/DONKI/",
    baseUrl: "https://kauai.ccmc.gsfc.nasa.gov",
    category: "solar-activity",
    sources: ["donki", "nasa"],
    liveSkyKey: "nasa-donki",
    entityId: "live_data_source:nasa-donki",
    authentication: "none",
    rateLimits:
      "The CCMC web service documents no rate limit and requires no key. (The same catalogue is mirrored behind api.nasa.gov, which does require a key and limits it to 1,000 requests an hour; AsteriaStar uses the documented key-less CCMC service instead.) Responses are cached for fifteen minutes, so each event feed costs at most four requests an hour.",
    redistribution: "NASA content is generally not copyrighted and may be reused; NASA asks that reuse not imply endorsement.",
    license: "Public domain (US Government work), subject to NASA's media usage guidelines.",
    attribution: "NASA CCMC DONKI (Space Weather Database Of Notifications, Knowledge, Information)",
    providerCaveat:
      "CCMC states that “the real-time space weather information and simulations stored in DONKI should be considered only as prototyping quality and in research context”. DONKI events are shown here as a curated research catalogue, not as an operational alert service — that role belongs to SWPC.",
    integration: "IMPLEMENTED",
    timeoutMs: 8000,
    maxConcurrentRequests: 2,
    backoffAfterFailures: 3,
    backoffSeconds: 120,
    schemaVersion: "donki-2026-08",
    verifiedAt: "2026-08-29",
  },

  {
    providerKey: "jpl-ssd",
    name: "JPL Solar System Dynamics / CNEOS",
    organization: "NASA Jet Propulsion Laboratory, California Institute of Technology",
    documentation: "https://ssd-api.jpl.nasa.gov/",
    baseUrl: "https://ssd-api.jpl.nasa.gov",
    category: "near-earth-object",
    sources: ["jpl", "nasa"],
    liveSkyKey: "jpl-horizons",
    entityId: "live_data_source:jpl-cneos",
    authentication: "none",
    rateLimits:
      "JPL publishes a Fair Use Policy rather than a numeric limit: requests must be \u201creasonably necessary\u201d, automated processes must not be \u201cunnecessarily frequent, repetitive, or redundant\u201d, only ONE request may be open at a time, and processes must back off on errors. AsteriaStar therefore serialises every JPL request, caches each product for hours, and stops asking after three consecutive failures.",
    redistribution:
      "A work of the US Government, freely reusable. JPL adds one restriction that shapes the architecture: \u201cYou may not embed these APIs in your website (per NASA CORS policy).\u201d No browser on this site ever contacts ssd-api.jpl.nasa.gov \u2014 every request is made server-side and the result is re-served from AsteriaStar's own origin, cached and attributed, which is also what the Fair Use Policy asks for.",
    license: "Public domain (US Government work), NASA/JPL-Caltech.",
    attribution: "NASA/JPL-Caltech, Solar System Dynamics and the Center for Near-Earth Object Studies (CNEOS)",
    providerCaveat:
      "JPL states of Sentry impact probabilities: \u201cThe probability computation is complex and depends on a number of assumptions that are difficult to verify. For these reasons the stated probability can easily be inaccurate by a factor of a few, and occasionally by a factor of ten or more.\u201d It also notes there is no guarantee any particular API remains available.",
    integration: "IMPLEMENTED",
    timeoutMs: 12000,
    // One. This is the provider's stated term, not a tuning choice.
    maxConcurrentRequests: 1,
    backoffAfterFailures: 3,
    backoffSeconds: 300,
    schemaVersion: "jpl-ssd-2026-08",
    verifiedAt: "2026-08-29",
  },

  {
    providerKey: "minor-planet-center",
    name: "IAU Minor Planet Center",
    organization: "International Astronomical Union / Center for Astrophysics, Harvard & Smithsonian",
    documentation: "https://minorplanetcenter.net/data",
    baseUrl: "https://minorplanetcenter.net",
    category: "near-earth-object",
    sources: ["mpc"],
    liveSkyKey: "minor-planet-center",
    entityId: "live_data_source:minor-planet-center",
    authentication: "none",
    rateLimits:
      "The MPC publishes machine-readable data files rather than an API, with no registration, no credentials and no documented rate limit. AsteriaStar reads one of them \u2014 the NEO Confirmation Page, about six kilobytes \u2014 and caches it for ten minutes.",
    redistribution: "Public IAU/MPC data. No documented redistribution restriction; attribution is requested.",
    license: "Public data of the IAU Minor Planet Center.",
    attribution:
      "This research has made use of data and/or services provided by the International Astronomical Union's Minor Planet Center.",
    providerCaveat:
      "The NEO Confirmation Page lists CANDIDATES, not discoveries. An entry may turn out to be an already-known object, a main-belt asteroid rather than a near-Earth one, or an artefact; most entries leave the page within days. The score is the MPC's estimate of how likely the object is a NEO, not a probability that it exists.",
    integration: "IMPLEMENTED",
    timeoutMs: 10000,
    maxConcurrentRequests: 2,
    backoffAfterFailures: 3,
    backoffSeconds: 300,
    schemaVersion: "mpc-neocp-2026-08",
    verifiedAt: "2026-08-29",
  },
];

const PROVIDER_BY_KEY = new Map(LIVE_PROVIDERS.map((p) => [p.providerKey, p]));

export function getLiveProvider(key: string): LiveProviderDescriptor | undefined {
  return PROVIDER_BY_KEY.get(key);
}

/* ------------------------------------------------------------------- products */

/** Continuously-sampled L1 measurements: a minute old is normal, an hour old means trouble. */
const REALTIME_STREAM: FreshnessPolicy = { basis: "observation", liveWithinSeconds: 900, recentWithinSeconds: 3600, staleAfterSeconds: 10800 };

/** Three-hourly geomagnetic indices: the newest value is legitimately up to three hours old. */
const THREE_HOURLY_INDEX: FreshnessPolicy = { basis: "observation", liveWithinSeconds: 12600, recentWithinSeconds: 21600, staleAfterSeconds: 43200 };

/** Products regenerated every few tens of minutes. */
const PERIODIC_SUMMARY: FreshnessPolicy = { basis: "observation", liveWithinSeconds: 3600, recentWithinSeconds: 10800, staleAfterSeconds: 21600 };

/** Daily products. */
const DAILY_PRODUCT: FreshnessPolicy = { basis: "observation", liveWithinSeconds: 30 * 3600, recentWithinSeconds: 48 * 3600, staleAfterSeconds: 96 * 3600 };

/**
 * Event feeds. Their freshness is the age of OUR fetch, not of the newest item: an alert list
 * whose newest entry is four days old means four quiet days, not a broken provider. Reading it
 * the other way round would mark a calm Sun as a system failure.
 */
const EVENT_FEED: FreshnessPolicy = { basis: "fetch", liveWithinSeconds: 1800, recentWithinSeconds: 7200, staleAfterSeconds: 21600 };

export const LIVE_PRODUCTS: LiveProduct[] = [
  /* --------------------------------------------------------- NOAA SWPC */
  {
    productKey: "swpc:solar-wind-speed",
    providerKey: "noaa-swpc",
    label: "Solar wind speed (real-time summary)",
    url: "https://services.swpc.noaa.gov/products/summary/solar-wind-speed.json",
    kind: "observation",
    cacheSeconds: 60,
    refreshCadenceSeconds: 60,
    freshness: REALTIME_STREAM,
    maxBytes: 16_000,
    cacheRationale: "The underlying spacecraft cadence is one minute, so a sixty-second cache can never hide a published value for longer than the interval between publications.",
    limitations: "A single spot value from the real-time solar-wind monitor at the L1 Lagrange point, roughly 1.5 million km sunward of Earth — not a measurement at Earth. Solar wind takes on the order of an hour to cross that gap.",
  },
  {
    productKey: "swpc:solar-wind-mag",
    providerKey: "noaa-swpc",
    label: "Interplanetary magnetic field (real-time summary)",
    url: "https://services.swpc.noaa.gov/products/summary/solar-wind-mag-field.json",
    kind: "observation",
    cacheSeconds: 60,
    refreshCadenceSeconds: 60,
    freshness: REALTIME_STREAM,
    maxBytes: 16_000,
    cacheRationale: "Matches the one-minute publication cadence of the real-time solar-wind monitor.",
    limitations: "Total field strength and the north–south component in GSM coordinates, measured at L1. A southward Bz is what lets the solar wind couple into Earth's magnetosphere; the value alone does not forecast a storm.",
  },
  {
    productKey: "swpc:solar-wind-propagated",
    providerKey: "noaa-swpc",
    label: "Solar wind propagated to the bow shock (1 hour)",
    url: "https://services.swpc.noaa.gov/products/geospace/propagated-solar-wind-1-hour.json",
    kind: "model",
    cacheSeconds: 60,
    refreshCadenceSeconds: 60,
    freshness: REALTIME_STREAM,
    maxBytes: 250_000,
    cacheRationale: "One-minute rows; a sixty-second cache adds at most one row of delay to the timeline.",
    limitations: "A MODEL product, not a measurement at Earth: L1 observations advected to the bow shock nose. Each row carries both the observation time at L1 and the propagated arrival time, and AsteriaStar shows the distinction rather than collapsing it.",
  },
  {
    productKey: "swpc:kp-index",
    providerKey: "noaa-swpc",
    label: "Planetary K-index (observed)",
    url: "https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json",
    kind: "index",
    cacheSeconds: 300,
    refreshCadenceSeconds: 10800,
    freshness: THREE_HOURLY_INDEX,
    maxBytes: 120_000,
    cacheRationale: "Kp is defined over three-hour intervals, so a five-minute cache is two orders of magnitude finer than the quantity's own resolution.",
    limitations: "A planetary average over three hours from a network of magnetometer stations. It says nothing about conditions at one location, and a quiet Kp does not rule out a local disturbance.",
  },
  {
    productKey: "swpc:kp-forecast",
    providerKey: "noaa-swpc",
    label: "Planetary K-index (observed, estimated and predicted)",
    url: "https://services.swpc.noaa.gov/products/noaa-planetary-k-index-forecast.json",
    kind: "forecast",
    cacheSeconds: 300,
    refreshCadenceSeconds: 10800,
    freshness: THREE_HOURLY_INDEX,
    maxBytes: 120_000,
    cacheRationale: "The forecast is reissued with the three-hourly Kp cycle; five minutes is well inside it.",
    limitations: "Each row states whether it is observed, estimated or predicted, and AsteriaStar keeps that distinction on every point it draws. A predicted Kp is a forecast, never an observation.",
  },
  {
    productKey: "swpc:noaa-scales",
    providerKey: "noaa-swpc",
    label: "NOAA space weather scales (R, S, G)",
    url: "https://services.swpc.noaa.gov/products/noaa-scales.json",
    kind: "index",
    cacheSeconds: 300,
    refreshCadenceSeconds: 1800,
    freshness: PERIODIC_SUMMARY,
    maxBytes: 32_000,
    cacheRationale: "SWPC regenerates the scales roughly every half hour; a five-minute cache cannot delay a change by a meaningful fraction of that.",
    limitations: "The R (radio blackout), S (solar radiation) and G (geomagnetic) scales summarise the last 24 hours and the next three days. The forecast entries are probabilities and expected levels, not observations.",
  },
  {
    productKey: "swpc:alerts",
    providerKey: "noaa-swpc",
    label: "Watches, warnings and alerts",
    url: "https://services.swpc.noaa.gov/products/alerts.json",
    kind: "observation",
    cacheSeconds: 300,
    refreshCadenceSeconds: 300,
    freshness: EVENT_FEED,
    maxBytes: 600_000,
    cacheRationale: "Alerts are issued irregularly; a five-minute cache bounds how long a newly-issued alert can be missing, while the feed itself carries each alert's real issue and validity times.",
    limitations: "The operational message stream. Each message is plain text issued by SWPC forecasters; AsteriaStar parses the structured header fields and never renders the message as markup.",
  },
  {
    productKey: "swpc:xray-flares",
    providerKey: "noaa-swpc",
    label: "GOES X-ray flare (latest)",
    url: "https://services.swpc.noaa.gov/json/goes/primary/xray-flares-latest.json",
    kind: "observation",
    cacheSeconds: 60,
    refreshCadenceSeconds: 60,
    freshness: REALTIME_STREAM,
    maxBytes: 32_000,
    cacheRationale: "GOES X-ray fluxes are published each minute; the cache matches the cadence.",
    limitations: "The current or most recent flare seen by the primary GOES satellite in the 1–8 Ångström band. A flare in progress has no end time yet, and its class can still rise.",
  },
  {
    productKey: "swpc:solar-regions",
    providerKey: "noaa-swpc",
    label: "Solar active regions (daily report)",
    url: "https://services.swpc.noaa.gov/json/solar_regions.json",
    kind: "observation",
    cacheSeconds: 3600,
    refreshCadenceSeconds: 86400,
    freshness: DAILY_PRODUCT,
    maxBytes: 600_000,
    cacheRationale: "A once-daily synoptic report. An hour's cache cannot make a daily product stale.",
    limitations: "Numbered active regions from the daily solar region summary, with sunspot area, magnetic and spot classification. The spot totals here are counts within numbered regions and are NOT the International Sunspot Number, which is defined differently and published by SILSO.",
  },
  {
    productKey: "swpc:f107",
    providerKey: "noaa-swpc",
    label: "10.7 cm solar radio flux",
    url: "https://services.swpc.noaa.gov/products/summary/10cm-flux.json",
    kind: "index",
    cacheSeconds: 3600,
    refreshCadenceSeconds: 86400,
    freshness: DAILY_PRODUCT,
    maxBytes: 16_000,
    cacheRationale: "F10.7 is a daily index; an hour's cache is far finer than its resolution.",
    limitations: "The daily 10.7 cm radio flux in solar flux units, the standard long-run proxy for solar activity. It is a disc-integrated index, not a measure of any one region.",
  },
  {
    productKey: "swpc:ovation-aurora",
    providerKey: "noaa-swpc",
    label: "OVATION aurora forecast grid",
    url: "https://services.swpc.noaa.gov/json/ovation_aurora_latest.json",
    kind: "forecast",
    cacheSeconds: 600,
    refreshCadenceSeconds: 300,
    freshness: PERIODIC_SUMMARY,
    maxBytes: 1_600_000,
    cacheRationale: "The OVATION grid is roughly a megabyte and is regenerated every five minutes for a forecast valid about an hour ahead; a ten-minute cache is a small fraction of the forecast's own validity window and keeps a page view from costing a megabyte of transfer.",
    limitations: "A model FORECAST of the probability of visible aurora on a one-degree grid, valid for a time about an hour ahead of the observation it is derived from. It is not a measurement, it is not a cloud forecast, and a high probability at your latitude does not mean the sky above you is clear.",
  },

  /* -------------------------------------------------------- NASA DONKI */
  {
    productKey: "donki:flares",
    providerKey: "nasa-donki",
    label: "Solar flare catalogue",
    url: "https://kauai.ccmc.gsfc.nasa.gov/DONKI/WS/get/FLR?startDate={startDate}&endDate={endDate}",
    windowDays: 30,
    kind: "observation",
    cacheSeconds: 900,
    refreshCadenceSeconds: 3600,
    freshness: EVENT_FEED,
    maxBytes: 600_000,
    cacheRationale: "A curated catalogue updated by analysts through the day, not a live stream; fifteen minutes bounds the delay on a newly-catalogued event without polling a research service every request.",
    limitations: "Analyst-curated flare records for the last 30 days, with begin, peak and end times and the associated active region. Curation lags the event, so the most recent hours may be incomplete — an absent flare is not evidence of a quiet Sun.",
  },
  {
    productKey: "donki:cmes",
    providerKey: "nasa-donki",
    label: "Coronal mass ejection catalogue",
    url: "https://kauai.ccmc.gsfc.nasa.gov/DONKI/WS/get/CME?startDate={startDate}&endDate={endDate}",
    windowDays: 7,
    kind: "observation",
    cacheSeconds: 900,
    refreshCadenceSeconds: 3600,
    freshness: EVENT_FEED,
    maxBytes: 1_000_000,
    cacheRationale: "As for flares. The window is seven days because the full catalogue entry for each CME is large and a month of them would be a quarter of a megabyte for no added meaning on a current-conditions page.",
    limitations: "Analyst-identified CMEs from coronagraph imagery over the last seven days. Speed and direction, where present, come from a fitted analysis with real uncertainty; most CMEs are not Earth-directed.",
  },
  {
    productKey: "donki:geomagnetic-storms",
    providerKey: "nasa-donki",
    label: "Geomagnetic storm catalogue",
    url: "https://kauai.ccmc.gsfc.nasa.gov/DONKI/WS/get/GST?startDate={startDate}&endDate={endDate}",
    windowDays: 30,
    kind: "observation",
    cacheSeconds: 900,
    refreshCadenceSeconds: 3600,
    freshness: EVENT_FEED,
    maxBytes: 300_000,
    cacheRationale: "As for flares.",
    limitations: "Storms catalogued after the fact, each with the observed Kp values that defined it. A storm in progress may not yet appear here even when SWPC has issued a warning.",
  },
  {
    productKey: "donki:sep",
    providerKey: "nasa-donki",
    label: "Solar energetic particle event catalogue",
    url: "https://kauai.ccmc.gsfc.nasa.gov/DONKI/WS/get/SEP?startDate={startDate}&endDate={endDate}",
    windowDays: 30,
    kind: "observation",
    cacheSeconds: 900,
    refreshCadenceSeconds: 3600,
    freshness: EVENT_FEED,
    maxBytes: 300_000,
    cacheRationale: "As for flares.",
    limitations: "Proton events identified in spacecraft particle data. The instrument and energy channel are recorded on each event because a detection in one channel is not a detection in another.",
  },
];

/**
 * Built lazily, because products are registered by program: the space-weather set is declared
 * inline above and the near-Earth-object set is appended below. A Map captured at module scope
 * before those appends would silently miss half the registry.
 */
let productIndex: Map<string, LiveProduct> | null = null;

export function getLiveProduct(key: string): LiveProduct | undefined {
  if (!productIndex) productIndex = new Map(LIVE_PRODUCTS.map((p) => [p.productKey, p]));
  return productIndex.get(key);
}

export function productsForProvider(providerKey: string): LiveProduct[] {
  return LIVE_PRODUCTS.filter((p) => p.providerKey === providerKey);
}

/**
 * The provider's state *right now*, derived from the declared integration level and this
 * instance's real request history. Nothing here is hand-asserted: a provider cannot be shown as
 * CONNECTED because someone typed it, only because a request to it actually succeeded — or
 * because the permanent probe gate verified it end-to-end on a recorded date and this instance
 * has not tried yet.
 */
export function providerState(descriptor: LiveProviderDescriptor, productKeys: string[]): ProviderState {
  if (descriptor.integration === "DISABLED") return "DISABLED";
  if (descriptor.integration === "PLANNED") return "PLANNED";

  const attempted = productKeys
    .map((k) => getHealth(k))
    .filter((h): h is NonNullable<typeof h> => Boolean(h?.lastAttemptAt));

  if (attempted.length === 0) {
    // No request has been made in this runtime instance. The integration is real if — and only
    // if — it has been verified against the live provider; otherwise it is still only planned.
    return descriptor.verifiedAt ? "CONNECTED" : "PLANNED";
  }

  const failing = attempted.filter((h) => h.consecutiveFailures > 0).length;
  if (failing === attempted.length) return "UNAVAILABLE";
  if (failing > 0) return "DEGRADED";
  return attempted.some((h) => h.successCount > 0) ? "CONNECTED" : "DEGRADED";
}

/* ------------------------------------------------------- near-Earth objects (Program CK) */

/**
 * JPL products are date-windowed through their own query parameters rather than the `{startDate}`
 * template, because the CAD API expresses its window as `date-min=now&date-max=+30` — server-side
 * relative terms the provider resolves itself. Nothing in these URLs comes from a request.
 */
const NEO_CATALOGUE: FreshnessPolicy = { basis: "fetch", liveWithinSeconds: 3600, recentWithinSeconds: 6 * 3600, staleAfterSeconds: 24 * 3600 };

/** The confirmation page turns over within days and is regenerated continuously. */
const NEOCP_FEED: FreshnessPolicy = { basis: "fetch", liveWithinSeconds: 1800, recentWithinSeconds: 3 * 3600, staleAfterSeconds: 12 * 3600 };

LIVE_PRODUCTS.push(
  {
    productKey: "jpl:close-approaches",
    providerKey: "jpl-ssd",
    label: "Near-Earth object close approaches",
    // `fullname` and `diameter` are requested explicitly; `dist-max=0.05 au` is about twenty lunar
    // distances, which is the window CNEOS itself uses for its public close-approach table.
    url: "https://ssd-api.jpl.nasa.gov/cad.api?date-min=now&date-max=%2B60&dist-max=0.05&sort=date&fullname=true&diameter=true",
    kind: "model",
    cacheSeconds: 3600,
    refreshCadenceSeconds: 86400,
    freshness: NEO_CATALOGUE,
    maxBytes: 600_000,
    cacheRationale:
      "Close-approach solutions change only when an object's orbit is refitted from new observations, which happens on a timescale of days. An hour's cache is far finer than that, and JPL's Fair Use Policy asks that automated requests not be unnecessarily frequent.",
    limitations:
      "Times are TDB (barycentric dynamical time), not UTC — the provider publishes them that way and AsteriaStar does not silently convert them. Distances are the nominal solution with 3-sigma minimum and maximum bounds alongside; a close approach is a computed prediction from a fitted orbit, not an observation. The window is the next 60 days within 0.05 au (about 20 lunar distances).",
  },
  {
    productKey: "jpl:sentry",
    providerKey: "jpl-ssd",
    label: "Sentry impact-risk table",
    url: "https://ssd-api.jpl.nasa.gov/sentry.api",
    kind: "model",
    cacheSeconds: 6 * 3600,
    refreshCadenceSeconds: 86400,
    freshness: NEO_CATALOGUE,
    // The table is ~560 KB at ~2,200 objects and grows as surveys find more; the ceiling leaves
    // room for that growth without leaving room for a runaway response.
    maxBytes: 1_500_000,
    cacheRationale:
      "Sentry is re-run when new observations arrive for a listed object; entries persist for months or years and change slowly. Six hours is well inside that, and keeps a page view from becoming a request to a research service.",
    limitations:
      "Impact probabilities are JPL's own, with JPL's own caveat that they can be wrong by a factor of a few and occasionally by ten or more. Diameters are estimated from absolute magnitude assuming an albedo of 0.154 unless a measurement exists. Objects LEAVE this table when further observations eliminate their potential impacts — a disappearance is good news, not missing data. The Torino scale is defined only for potential impacts less than a century away.",
  },
  {
    productKey: "jpl:recent-neos",
    providerKey: "jpl-ssd",
    label: "Recently observed near-Earth objects",
    // The `sb-cdata` constraint is a fixed JSON literal, URL-encoded: first observation on or after
    // a rolling date is NOT used, because the provider offers no relative form and a date computed
    // here would change the URL every day and defeat every cache. A fixed recent epoch is used and
    // the client filters to the newest entries.
    url: "https://ssd-api.jpl.nasa.gov/sbdb_query.api?fields=full_name,pdes,neo,pha,H,diameter,first_obs,class,moid&sb-class=IEO,ATE,APO,AMO&sb-cdata=%7B%22AND%22%3A%5B%22first_obs%7CGE%7C{startDate}%22%5D%7D&limit=300",
    windowDays: 60,
    kind: "observation",
    cacheSeconds: 6 * 3600,
    refreshCadenceSeconds: 86400,
    freshness: NEO_CATALOGUE,
    maxBytes: 600_000,
    cacheRationale:
      "A new NEO enters the database once its orbit is computed, which happens over days. Six hours cannot delay one meaningfully, and the date window only advances once per day.",
    limitations:
      "`first_obs` is the date of the FIRST OBSERVATION used in the orbit solution — not the date the object was announced, and not the date anyone recognised it as new. Absolute magnitude H is a brightness, not a size; a diameter appears only where one has actually been measured or modelled.",
  },
  {
    productKey: "mpc:neocp",
    providerKey: "minor-planet-center",
    label: "NEO Confirmation Page (unconfirmed candidates)",
    url: "https://minorplanetcenter.net/Extended_Files/neocp.json",
    kind: "observation",
    cacheSeconds: 600,
    refreshCadenceSeconds: 900,
    freshness: NEOCP_FEED,
    maxBytes: 200_000,
    cacheRationale:
      "The page is regenerated as observations arrive, and entries live on it for hours to days. Ten minutes bounds how long a new candidate is missing while keeping the request rate to a small file trivial.",
    limitations:
      "These are CANDIDATES awaiting confirmation, not discoveries. An entry may prove to be an already-known object, not a near-Earth object at all, or an artefact, and most leave the page within days. The score is the MPC's estimate of how likely the object is a NEO — it is not a probability that the object exists, and it is not an impact risk.",
  },
);
