import type { SourceKey } from "@/lib/sources";

/**
 * Live Sky — core schema (Program J).
 *
 * The Live Sky platform is a set of data CLIENTS built on top of the Knowledge
 * Graph and the Scientific Data Engine. Its single most important rule is
 * HONESTY: it never fabricates live values, sky conditions, positions,
 * forecasts, or event dates. Every datum is wrapped in an envelope that records
 * its status, source, timestamps, confidence, staleness, provenance, and
 * licensing — so a page can never present invented data as if it were live.
 *
 * There are, deliberately, no connected live providers yet. Data is either
 * `reference` (timeless, source-backed facts such as the annual meteor-shower
 * parameters) or `prepared` (architecture ready for a named provider, with no
 * current values shown).
 */

/** The honesty status of a piece of sky data. */
export type DataStatus =
  | "reference"  // timeless, source-backed facts (e.g. the annual Perseids parameters)
  | "prepared"   // architecture ready for a named provider; NO current values shown
  | "computed"   // a deterministic, source-backed calculation valid within its window (NOT a live provider feed)
  | "live"       // real data from a connected provider within its validity window
  | "stale";     // live/computed data now past its validUntil — must be flagged, never shown as current

export const DATA_STATUS_LABEL: Record<DataStatus, string> = {
  reference: "Reference data",
  prepared: "Prepared for live data",
  computed: "Computed (source-backed calculation)",
  live: "Live",
  stale: "Stale — awaiting refresh",
};

/** How confident/qualified a value is. */
export type Confidence = "established" | "typical" | "modeled" | "forecast" | "unknown";

/**
 * The provenance envelope carried by every sky datum. `generatedAt`,
 * `validFrom`, and `validUntil` are ISO-8601 strings or null. For `reference`
 * data, `generatedAt` is the dataset compilation date (NOT "now"); `validFrom`
 * / `validUntil` are null when the fact is timeless/annual. For `prepared`
 * data, all timestamps are null and no value is shown.
 */
export interface SkyEnvelope {
  status: DataStatus;
  /** Source registry keys this datum is (or will be) drawn from. Never empty. */
  source: SourceKey[];
  /** The provider that supplies (or is planned to supply) this datum. */
  provider?: ProviderKey;
  generatedAt: string | null;
  validFrom: string | null;
  validUntil: string | null;
  confidence: Confidence;
  /** True only when `status` is "stale". */
  stale: boolean;
  provenance: string;
  licenseNotes: string;
}

/** Data-provider keys (typed interfaces defined in providers.ts). */
export type ProviderKey =
  | "nasa-apis"
  | "jpl-horizons"
  | "nasa-donki"
  | "noaa-swpc"
  | "celestrak"
  | "minor-planet-center"
  | "imo"
  | "usno"
  | "eclipse-catalogue";

/** A value together with its provenance envelope. `data` is null when nothing has been generated. */
export interface Enveloped<T> {
  data: T | null;
  envelope: SkyEnvelope;
}

/** The fixed compilation date for the reference datasets (never "now"). */
export const REFERENCE_COMPILED_AT = "2026-01-01T00:00:00Z";

/** Build an envelope for timeless, source-backed reference data. */
export function referenceEnvelope(opts: {
  source: SourceKey[];
  provider?: ProviderKey;
  confidence?: Confidence;
  provenance: string;
  licenseNotes?: string;
  validFrom?: string | null;
  validUntil?: string | null;
}): SkyEnvelope {
  return {
    status: "reference",
    source: opts.source,
    provider: opts.provider,
    generatedAt: REFERENCE_COMPILED_AT,
    validFrom: opts.validFrom ?? null,
    validUntil: opts.validUntil ?? null,
    confidence: opts.confidence ?? "established",
    stale: false,
    provenance: opts.provenance,
    licenseNotes: opts.licenseNotes ?? "Compiled from public, citable sources; see the source registry.",
  };
}

/** Build an envelope for a module that is prepared for integration but has no live data. */
export function preparedEnvelope(opts: {
  source: SourceKey[];
  provider: ProviderKey;
  provenance?: string;
  licenseNotes?: string;
}): SkyEnvelope {
  return {
    status: "prepared",
    source: opts.source,
    provider: opts.provider,
    generatedAt: null,
    validFrom: null,
    validUntil: null,
    confidence: "unknown",
    stale: false,
    provenance: opts.provenance ?? "No live provider is connected. This module is architecture only; no current values are shown.",
    licenseNotes: opts.licenseNotes ?? "Provider licensing will be verified before any integration.",
  };
}

/**
 * Build an envelope for a deterministic, source-backed calculation (e.g. the
 * computed Moon phase). It is NOT a live provider feed — `provider` is omitted
 * and the caller records the calculation basis in `provenance`/`licenseNotes`.
 * `generatedAt` is the real computation time; `validUntil` is a conservative
 * cache/validity horizon.
 */
export function computedEnvelope(opts: {
  source: SourceKey[];
  generatedAt: string;
  validFrom: string;
  validUntil: string;
  confidence?: Confidence;
  stale?: boolean;
  provenance: string;
  licenseNotes: string;
}): SkyEnvelope {
  return {
    status: opts.stale ? "stale" : "computed",
    source: opts.source,
    generatedAt: opts.generatedAt,
    validFrom: opts.validFrom,
    validUntil: opts.validUntil,
    confidence: opts.confidence ?? "modeled",
    stale: opts.stale ?? false,
    provenance: opts.provenance,
    licenseNotes: opts.licenseNotes,
  };
}

/**
 * Compute staleness for a live OR computed datum given the current time. Pure
 * and deterministic. If the status is not time-bounded (reference/prepared), or
 * there is no `validUntil`, staleness does not apply and the envelope is
 * returned unchanged. Past `validUntil`, the status flips to "stale" and
 * `stale` is true — such data must never be shown as current.
 */
export function withStaleness(env: SkyEnvelope, nowIso: string): SkyEnvelope {
  if ((env.status !== "live" && env.status !== "computed") || !env.validUntil) return env;
  const stale = nowIso > env.validUntil;
  return { ...env, status: stale ? "stale" : env.status, stale };
}
