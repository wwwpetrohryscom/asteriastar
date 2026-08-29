import type { SourceKey } from "@/lib/sources";

/**
 * The global data-honesty model for live and near-live external data (Programs CJ–CN).
 *
 * Everything AsteriaStar shows from an external provider travels inside a `LiveEnvelope`.
 * The envelope's job is to make it structurally impossible to present a value as something
 * it is not: a six-hour-old observation cannot be labelled "live", a forecast cannot be
 * labelled an observation, a cached response cannot be shown without its staleness, and a
 * provider that could not be reached produces *no value at all* rather than a zero.
 *
 * This sits beside — not on top of — the existing Live Sky `SkyEnvelope`
 * (`platform/live-sky/schema`), which describes reference/prepared/computed data compiled
 * into the repository. That one answers "where did this fact come from?"; this one answers
 * "how old is this measurement, right now, and did the provider actually answer?".
 */

/**
 * The honesty status of a live datum. Deliberately finer-grained than "live or not":
 * the distinctions between an observation, a model product, and a forecast, and between
 * a late-but-publishing provider and a dead one, are the ones that mislead when collapsed.
 */
export type LiveDataStatus =
  | "live" // a real observation, inside the provider's own publication cadence
  | "recent" // a real observation, older than the cadence but still current enough to be useful
  | "delayed" // the provider is still answering, but its newest datum is late — shown, and said
  | "forecast" // a prediction for a future time, from the provider — never an observation
  | "computed" // derived by AsteriaStar from real inputs; the method is named
  | "historical" // a past-time row in a series; true when it was measured, not "current"
  | "stale" // served from cache past its validity window — must never be shown as current
  | "unavailable" // no value could be obtained and none is cached: nothing is shown
  | "provider_error"; // the provider answered, but not with data we can trust (schema/HTTP/size)

export const LIVE_STATUS_LABEL: Record<LiveDataStatus, string> = {
  live: "Live",
  recent: "Recent",
  delayed: "Delayed",
  forecast: "Forecast",
  computed: "Computed",
  historical: "Historical",
  stale: "Stale",
  unavailable: "Unavailable",
  provider_error: "Provider error",
};

/**
 * Whether a status may be presented as describing conditions *now*. `forecast`,
 * `historical`, `stale`, `unavailable` and `provider_error` may not — a page that shows them
 * in a "current conditions" slot is a bug, and the live-provider validator looks for it.
 */
export const CURRENT_STATUSES: ReadonlySet<LiveDataStatus> = new Set<LiveDataStatus>(["live", "recent", "delayed", "computed"]);

/** Whether a status means "no value is being shown". */
export const NO_VALUE_STATUSES: ReadonlySet<LiveDataStatus> = new Set<LiveDataStatus>(["unavailable", "provider_error"]);

/** What kind of thing a number is. Collapsing these is how model output becomes "measured". */
export type ObservationKind =
  | "observation" // measured by an instrument
  | "model" // produced by a model from observations (e.g. solar wind propagated to the bow shock)
  | "forecast" // a prediction for a future time
  | "computed" // calculated by AsteriaStar from source-backed inputs
  | "index"; // a derived geophysical index published by the provider (Kp, the NOAA scales)

export const OBSERVATION_KIND_LABEL: Record<ObservationKind, string> = {
  observation: "Observation",
  model: "Model product",
  forecast: "Forecast",
  computed: "Computed by AsteriaStar",
  index: "Published index",
};

/**
 * How a product's freshness is judged.
 *
 * `basis: "observation"` — the status comes from the age of the newest datum. Right for a
 * continuously-sampled measurement, where an old newest-value means the feed has gone quiet.
 *
 * `basis: "fetch"` — the status comes from the age of our fetch. Right for an *event* feed
 * (alerts, flare catalogues), where "the newest item is four days old" means four quiet days,
 * not a broken provider. Each item still carries its own timestamp.
 */
export interface FreshnessPolicy {
  basis: "observation" | "fetch";
  /** Inside this age the datum is `live`. Normally the provider's own publication cadence. */
  liveWithinSeconds: number;
  /** Inside this age the datum is `recent` — usable, and labelled as not brand new. */
  recentWithinSeconds: number;
  /** Past this age the datum is `stale` and must not be presented as current. */
  staleAfterSeconds: number;
}

/**
 * Tolerance for a provider timestamp that is slightly ahead of our clock. Real feeds do this
 * routinely (rounding, NTP drift, a product stamped at the end of its window). Beyond this the
 * timestamp is not believable and the datum is rejected as a schema anomaly rather than
 * silently shown — a future observation time would otherwise read as maximally fresh.
 */
export const FUTURE_TIMESTAMP_TOLERANCE_SECONDS = 300;

/** Seconds between two ISO timestamps (`b - a`); NaN if either is unparseable. */
export function secondsBetween(aIso: string, bIso: string): number {
  const a = Date.parse(aIso);
  const b = Date.parse(bIso);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return NaN;
  return (b - a) / 1000;
}

/**
 * Classify a real timestamp against a freshness policy. Pure and deterministic: the same
 * inputs always give the same status, which is what lets the server render and a client
 * island re-evaluate later and agree.
 *
 * Returns `provider_error` for an unparseable or implausibly-future timestamp — a datum whose
 * own time we cannot trust is not a datum we can age.
 */
export function classifyFreshness(policy: FreshnessPolicy, referenceIso: string, nowIso: string): LiveDataStatus {
  const age = secondsBetween(referenceIso, nowIso);
  if (!Number.isFinite(age)) return "provider_error";
  if (age < -FUTURE_TIMESTAMP_TOLERANCE_SECONDS) return "provider_error";
  if (age <= policy.liveWithinSeconds) return "live";
  if (age <= policy.recentWithinSeconds) return "recent";
  if (age <= policy.staleAfterSeconds) return "delayed";
  return "stale";
}

/** A single number with the unit it is measured in. A bare number is never rendered. */
export interface Quantity {
  value: number;
  /** SI-style unit token, e.g. "km/s", "nT", "cm^-3", "W/m^2". Empty string only for a true index. */
  unit: string;
}

/** One live measurement, with everything needed to say honestly what it is. */
export interface LiveDatum<T = number> {
  value: T;
  unit: string;
  /** The provider's own timestamp for this value (ISO 8601, UTC). Never invented. */
  observedAt: string;
  kind: ObservationKind;
  status: LiveDataStatus;
  /** Provider-exposed quality/uncertainty note, when the provider exposes one. */
  quality?: string;
  /** Which product within the provider this came from — two products are not interchangeable. */
  product?: string;
}

/** The provider's own operational state, independent of any one datum. */
export type ProviderState = "PLANNED" | "CONNECTED" | "DEGRADED" | "UNAVAILABLE" | "DISABLED";

export const PROVIDER_STATE_LABEL: Record<ProviderState, string> = {
  PLANNED: "Planned",
  CONNECTED: "Connected",
  DEGRADED: "Degraded",
  UNAVAILABLE: "Unavailable",
  DISABLED: "Disabled",
};

/**
 * The envelope every live response carries. Absent fields mean "the provider does not supply
 * this", never "zero" and never a placeholder: `fetchedAt` is missing precisely when no fetch
 * happened, and `data` is missing precisely when there is no value to show.
 */
export interface LiveEnvelope<T = unknown> {
  /* provider identity */
  provider: string;
  providerKey: string;
  /** The specific product this response came from — a provider serves many, with different rules. */
  productKey: string;
  organization: string;
  /** The exact URL the value came from — not the provider's home page. */
  sourceUrl: string;
  /** Source-registry keys, so the value joins the site's existing citation machinery. */
  sources: SourceKey[];
  license: string;

  /* timestamps — all real, none fabricated */
  /** When AsteriaStar fetched this. Absent when no fetch occurred. */
  fetchedAt?: string;
  /** The provider's own generation time for the product, when it publishes one. */
  generatedAt?: string;
  validFrom?: string;
  validUntil?: string;
  /** The last fetch of this product that succeeded, in this runtime instance. */
  lastSuccessAt?: string;
  /** The last fetch of this product that was attempted, in this runtime instance. */
  lastAttemptAt?: string;

  /* honesty */
  status: LiveDataStatus;
  stale: boolean;
  providerState: ProviderState;
  kind: ObservationKind;
  /** Seconds between provider publications, as the provider documents or demonstrates it. */
  refreshCadenceSeconds?: number;
  /** How long AsteriaStar caches this product, and why that is defensible. */
  cacheSeconds: number;
  provenance: string;
  /** Honest, specific limits of the value — resolution, coverage, what it is not. */
  limitations?: string;
  /** Present only when the fetch failed; a normalised reason, never upstream markup. */
  error?: string;
  /** True when `data` came from cache after a failed refresh: a real past value, shown as past. */
  servedFromCache?: boolean;

  /** The payload. Absent whenever there is nothing real to show. */
  data?: T;
}

/**
 * Build the envelope for a provider that returned nothing usable. There is no `data`, so no
 * page can render a value from it; the reason is carried so the failure can be explained
 * rather than hidden behind an empty state.
 */
export function unavailableEnvelope<T>(base: Omit<LiveEnvelope<T>, "status" | "stale" | "data">, reason: string, isProviderError = false): LiveEnvelope<T> {
  return { ...base, status: isProviderError ? "provider_error" : "unavailable", stale: false, error: reason };
}

/**
 * How far a status is from "a current observation". Re-ageing may move a value DOWN this ladder and
 * never up: time only makes data older.
 */
const STALENESS_RANK: Partial<Record<LiveDataStatus, number>> = { live: 0, recent: 1, delayed: 2, stale: 3 };

/**
 * The worse of two freshness statuses — the one further from a current observation.
 *
 * Shared by the server's `refreshStatus` and by the browser's freshness island, so there is exactly
 * one implementation of the rule "a recomputation may never improve a status". An unranked status
 * (`provider_error`, from a timestamp that cannot be aged at all) always wins: not being able to
 * age a datum is worse than any freshness level.
 */
export function worseOf(a: LiveDataStatus, b: LiveDataStatus): LiveDataStatus {
  const ra = STALENESS_RANK[a];
  const rb = STALENESS_RANK[b];
  if (ra === undefined) return a;
  if (rb === undefined) return b;
  return rb > ra ? b : a;
}

/**
 * Re-evaluate an envelope's freshness at a later moment.
 *
 * Rendered HTML can be cached and served long after it was produced, so a status computed at
 * render time is a claim about the past. This recomputes it from the datum's own timestamp
 * against a later clock — the same pure function the server used — so a page that was `live`
 * when generated correctly reads `stale` when it is finally viewed.
 *
 * It can only ever make a status WORSE. That rule is not decoration: the failure path deliberately
 * forces `stale` on a value served from cache after a failed refresh, because whatever we hold is
 * by definition no longer the provider's current publication — and that value's own observation
 * time is usually recent, so a naive recomputation would promote it straight back to "live" and
 * present a cached reading during a total provider outage as a live measurement. Timestamps age a
 * datum; they cannot re-establish a connection.
 */
export function refreshStatus<T>(env: LiveEnvelope<T>, policy: FreshnessPolicy, nowIso: string): LiveEnvelope<T> {
  if (NO_VALUE_STATUSES.has(env.status)) return env;
  if (env.status === "forecast" || env.status === "historical" || env.status === "computed") return env;
  // A value we are showing only because the refresh failed stays stale for as long as we show it.
  if (env.servedFromCache) return env;

  const reference = policy.basis === "fetch" ? env.fetchedAt : (env.generatedAt ?? env.fetchedAt);
  if (!reference) return env;

  const status = worseOf(env.status, classifyFreshness(policy, reference, nowIso));
  return { ...env, status, stale: status === "stale" };
}
