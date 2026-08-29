import type { LiveDatum, LiveEnvelope } from "@/platform/live-providers/envelope";

/**
 * The normalised space-weather domain (Program CJ).
 *
 * These are AsteriaStar's own types, not a provider's. Every field carries its unit and its own
 * timestamp, and anything a provider does not supply is simply absent — there are no defaults and
 * no zeroes standing in for missing measurements. Where two providers describe the same physical
 * thing differently (SWPC's operational X-ray flare state and DONKI's curated flare catalogue),
 * they stay separate types rather than being merged into one: they are not the same claim.
 */

/* -------------------------------------------------------------- solar wind */

/**
 * Current solar-wind conditions. Speed and field come from the real-time monitor at L1;
 * density and temperature come from the propagated model product, which is why each field
 * carries its own `kind` rather than the group carrying one.
 */
export interface SolarWindNow {
  /** Bulk proton speed, km/s, observed at L1. */
  speed?: LiveDatum;
  /** Proton number density, cm⁻³. From the propagated model product. */
  density?: LiveDatum;
  /** Proton temperature, K. From the propagated model product. */
  temperature?: LiveDatum;
  /** Total interplanetary magnetic field strength, nT. */
  bt?: LiveDatum;
  /** North–south component of the IMF in GSM coordinates, nT. Negative is southward. */
  bz?: LiveDatum;
}

/** One row of the propagated solar-wind series. */
export interface SolarWindPoint {
  /** Observation time at L1 (ISO). */
  observedAt: string;
  /** Modelled arrival time at Earth's bow shock nose (ISO). */
  arrivesAt?: string;
  speedKmS?: number;
  densityPerCm3?: number;
  btNt?: number;
  bzNt?: number;
}

/* ------------------------------------------------------------- geomagnetic */

export type KpProvenance = "observed" | "estimated" | "predicted";

/** One three-hour planetary K-index value, with what kind of value it is. */
export interface KpPoint {
  /** Start of the three-hour interval (ISO). */
  at: string;
  kp: number;
  provenance: KpProvenance;
  /** The NOAA G-scale the provider attached to this interval, when it attached one. */
  noaaScale?: string;
}

/** The NOAA R / S / G scale levels for one day. */
export interface NoaaScaleDay {
  /** "observed" for the current and past entries, "forecast" for the next three days. */
  provenance: "observed" | "forecast";
  date: string;
  /** The timestamp the provider stamped this block with (ISO). */
  at: string;
  /** Radio blackout level 0–5, and the provider's own word for it. */
  radioBlackout?: { scale: number; text?: string };
  /** Solar radiation storm level 0–5. */
  solarRadiation?: { scale: number; text?: string };
  /** Geomagnetic storm level 0–5. */
  geomagnetic?: { scale: number; text?: string };
  /** Forecast probabilities, percent. Present only on forecast days. */
  probabilities?: { radioMinor?: number; radioMajor?: number; solarRadiation?: number };
}

/* ------------------------------------------------------------------ alerts */

/** What SWPC issued: a watch, a warning, an alert, or a post-event summary. */
export type AlertKind = "watch" | "warning" | "alert" | "summary" | "cancellation" | "other";

/**
 * One SWPC operational message, parsed from its structured header. The full text is retained,
 * normalised to plain text; it is never rendered as markup.
 *
 * There is deliberately no `active` field. Whether a message is in force is a function of the
 * clock, and a boolean computed when the response was parsed would be cached alongside it — so an
 * expired warning could be served as still standing minutes later. `validFrom` and `validUntil`
 * are the facts; `activeAlerts()` evaluates them at the moment of reading.
 */
export interface SpaceWeatherAlert {
  productId: string;
  serial?: string;
  kind: AlertKind;
  /** The message's own headline line, e.g. "WARNING: Geomagnetic K-index of 5 expected". */
  headline: string;
  issuedAt: string;
  validFrom?: string;
  validUntil?: string;
  /** The NOAA scale the message names, e.g. "G1". */
  scale?: string;
  /** The full plain-text message as issued. */
  message: string;
}

/* --------------------------------------------------------------- solar */

/** The operational X-ray flare state from the primary GOES satellite. */
export interface XrayFlareState {
  observedAt: string;
  satellite?: number;
  /** The current 1–8 Å flux expressed as a flare class, e.g. "B5.0". */
  currentClass?: string;
  beganAt?: string;
  peakedAt?: string;
  peakClass?: string;
  endedAt?: string;
  /** True when the event has begun and has no end time yet — its class may still rise. */
  inProgress: boolean;
}

/** One numbered solar active region from the daily report. */
export interface ActiveRegion {
  number: number;
  /** Heliographic location as the provider writes it, e.g. "N09W72". */
  location?: string;
  latitude?: number;
  longitude?: number;
  /** Corrected sunspot area in millionths of a solar hemisphere. */
  areaMillionths?: number;
  /** McIntosh sunspot classification. */
  spotClass?: string;
  /** Mount Wilson magnetic classification. */
  magClass?: string;
  spotCount?: number;
  /** Provider-published flare probabilities for this region, percent. */
  flareProbability?: { c?: number; m?: number; x?: number };
}

export interface ActiveRegionReport {
  /** The date the report describes (YYYY-MM-DD), from the provider. */
  observedDate: string;
  regions: ActiveRegion[];
  /** Count of numbered regions on the disc in this report. */
  regionCount: number;
  /** Total spots across numbered regions. NOT the International Sunspot Number. */
  spotTotal?: number;
}

/* ---------------------------------------------------------------- aurora */

/**
 * A summary of the OVATION aurora forecast grid.
 *
 * The grid itself is about a megabyte of per-degree probabilities; what a page can honestly say
 * from it is where the aurora oval reaches and how strong it is. `equatorwardBoundary` is a named,
 * versioned computation over the provider's own numbers, not a provider product — which is why it
 * is labelled `computed` wherever it is shown.
 */
export interface AuroraForecastSummary {
  /** The time of the observation the forecast is derived from (ISO). */
  observedAt: string;
  /** The time the forecast is valid for — typically about an hour ahead (ISO). */
  forecastFor: string;
  /** Method identifier recorded with every derived figure. */
  method: string;
  /** Probability threshold, percent, used for the boundary. */
  thresholdPercent: number;
  northern: AuroraHemisphere;
  southern: AuroraHemisphere;
  /** Number of grid cells in the provider's response — a sanity check, not a physical quantity. */
  gridCells: number;
}

export interface AuroraHemisphere {
  /** The most equatorward latitude reaching the threshold at any longitude; absent if none does. */
  equatorwardBoundaryLat?: number;
  /** The highest probability anywhere in the hemisphere, percent. */
  maxProbabilityPercent: number;
}

/* ------------------------------------------------------------ DONKI events */

export interface DonkiFlareEvent {
  id: string;
  beganAt: string;
  peakedAt?: string;
  endedAt?: string;
  flareClass?: string;
  sourceLocation?: string;
  activeRegion?: number;
  instruments: string[];
  link?: string;
  note?: string;
}

export interface DonkiCmeEvent {
  id: string;
  startedAt: string;
  sourceLocation?: string;
  activeRegion?: number;
  instruments: string[];
  link?: string;
  note?: string;
  /** From the most accurate published analysis, when DONKI has one. */
  analysis?: { speedKmS?: number; halfAngleDeg?: number; type?: string; isMostAccurate: boolean };
}

export interface DonkiStormEvent {
  id: string;
  startedAt: string;
  link?: string;
  /** The observed Kp values that define the storm, as DONKI records them. */
  kpValues: { observedAt: string; kp: number; source?: string }[];
  /** The largest Kp in the event. */
  maxKp?: number;
}

export interface DonkiSepEvent {
  id: string;
  eventAt: string;
  instruments: string[];
  link?: string;
}

/* -------------------------------------------------------------- composite */

/**
 * Everything the space-weather surfaces are built from. Each field is a full envelope, so a
 * partial outage degrades one panel and leaves the rest of the page intact and honest.
 */
export interface SpaceWeatherSnapshot {
  solarWindSpeed: LiveEnvelope<{ speedKmS: number; observedAt: string }>;
  solarWindField: LiveEnvelope<{ btNt: number; bzNt: number; observedAt: string }>;
  solarWindSeries: LiveEnvelope<SolarWindPoint[]>;
  kpObserved: LiveEnvelope<KpPoint[]>;
  kpForecast: LiveEnvelope<KpPoint[]>;
  scales: LiveEnvelope<NoaaScaleDay[]>;
  alerts: LiveEnvelope<SpaceWeatherAlert[]>;
  xrayFlare: LiveEnvelope<XrayFlareState>;
  activeRegions: LiveEnvelope<ActiveRegionReport>;
  radioFlux: LiveEnvelope<{ sfu: number; observedAt: string }>;
  aurora: LiveEnvelope<AuroraForecastSummary>;
}

export interface SolarEventsSnapshot {
  flares: LiveEnvelope<DonkiFlareEvent[]>;
  cmes: LiveEnvelope<DonkiCmeEvent[]>;
  storms: LiveEnvelope<DonkiStormEvent[]>;
  sepEvents: LiveEnvelope<DonkiSepEvent[]>;
}
