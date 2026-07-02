import type { SourceKey } from "@/lib/sources";

/**
 * Live Sky — typed data models. These describe the SHAPE of sky data the
 * platform will serve once providers are connected. Every model that concerns a
 * physical body carries the graph entity id(s) it links to, so no live datum is
 * ever isolated from the Knowledge Graph. No values here are fabricated; the
 * domain modules return these wrapped in an Enveloped<T> whose `data` is null
 * until a real provider is connected.
 */

/* ------------------------------------------------------------- location/time */
export interface GeoLocation {
  name: string;
  latitude?: number;
  longitude?: number;
  elevationM?: number;
  timezone?: string; // IANA id, e.g. "Europe/London"
  /** Honest note: no location is assumed or inferred until the user provides one. */
  note?: string;
}
export interface Timezone {
  id: string; // IANA
  label: string;
  utcOffsetNote: string;
}
/** Placeholder for a future user observer profile — no personal data is collected yet. */
export interface ObserverProfile {
  id: string;
  location?: GeoLocation;
  preferredUnits?: "metric" | "imperial";
  note: string;
}

/* --------------------------------------------------------------- moon & sun */
export type MoonPhaseName =
  | "new-moon" | "waxing-crescent" | "first-quarter" | "waxing-gibbous"
  | "full-moon" | "waning-gibbous" | "last-quarter" | "waning-crescent";

export interface MoonPhase {
  phase: MoonPhaseName;
  illuminationPercent?: number;
  ageDays?: number;
  moonEntityId: string; // moon:the-moon
}

/**
 * The Program P Moon data contract — a computed (or, in future, provider-fetched)
 * Moon phase for an instant. Timestamps, source, confidence, and staleness live
 * in the accompanying SkyEnvelope; this payload carries the physical values.
 */
export interface MoonData {
  objectEntityId: string; // moon:the-moon
  phase: MoonPhaseName;
  phaseName: string; // human label, e.g. "Waxing Gibbous"
  /** Sun–Moon elongation in degrees (0 = new, 90 = first quarter, 180 = full, 270 = last quarter). */
  phaseAngleDeg: number;
  /** Illuminated fraction of the disc, 0–1. */
  illuminationFraction: number;
  /** Illuminated fraction as a percentage, 0–100. */
  illuminationPercent: number;
  /** Age since the previous new moon, in days. */
  synodicAgeDays: number;
  waxing: boolean;
  /** How the value was obtained. v1 is always "computed". */
  method: "computed" | "provider";
  /** The instant the values are for (ISO-8601). */
  atIso: string;
  calculationNotes: string;
}
export interface RiseSet {
  bodyEntityId: string; // moon:the-moon or star:sun
  riseIso?: string;
  setIso?: string;
  transitIso?: string;
  note?: string;
}

/* ----------------------------------------------------------------- planets */
export type VisibilityWindow = "morning" | "evening" | "all-night" | "daytime" | "not-visible";
export interface PlanetVisibility {
  planetEntityId: string; // planet:*
  window?: VisibilityWindow;
  constellationEntityId?: string;
  apparentMagnitude?: number;
  note?: string;
}

/* --------------------------------------------------------------- meteor showers */
export interface MeteorShower {
  slug: string;
  name: string;
  /** Existing meteor_shower:* graph entity, where one exists. */
  graphEntityId?: string;
  /** Annual activity window and peak, as timeless month-day labels (never a specific year's date). */
  activeWindow: string;
  peakLabel: string;
  /** Approximate months of activity (1-12), for the month-by-month guide. */
  activeMonths: number[];
  peakMonth: number;
  /** Zenithal hourly rate at peak under ideal conditions (a typical figure, not a live count). */
  zhr: number;
  /** Meteor speed on atmospheric entry (km/s). */
  velocityKmS: number;
  radiantConstellationId: string;
  /** Parent body graph id, where the entity exists. */
  parentBodyId?: string;
  parentBodyName: string;
  bestHemisphere: "Northern" | "Southern" | "Both";
  description: string;
}

/* --------------------------------------------------------------- eclipses */
export type EclipseKind =
  | "total-solar" | "annular-solar" | "partial-solar" | "hybrid-solar"
  | "total-lunar" | "partial-lunar" | "penumbral-lunar";
export interface EclipseType {
  kind: EclipseKind;
  family: "solar" | "lunar";
  name: string;
  description: string;
  sunEntityId?: string;
  moonEntityId: string;
  earthEntityId: string;
}
export interface Eclipse {
  kind: EclipseKind;
  dateIso?: string;
  note?: string;
  sunEntityId?: string;
  moonEntityId: string;
  earthEntityId: string;
}

/* --------------------------------------------------------------- small bodies */
export interface CometVisibility {
  cometEntityId: string;
  apparentMagnitude?: number;
  window?: VisibilityWindow;
  note?: string;
}
export interface AsteroidCloseApproach {
  asteroidEntityId: string;
  closeApproachIso?: string;
  missDistanceKm?: number;
  missDistanceLunar?: number; // lunar distances
  note?: string;
}

/* --------------------------------------------------------------- satellites */
export interface IssPass {
  satelliteEntityId: string; // satellite:international-space-station
  startIso?: string;
  maxElevationDeg?: number;
  durationMinutes?: number;
  apparentMagnitude?: number;
  note?: string;
}

/* --------------------------------------------------------------- space weather */
export type FlareClass = "A" | "B" | "C" | "M" | "X";
export interface SolarFlare {
  flareClass?: FlareClass;
  peakIso?: string;
  sunEntityId: string; // star:sun
  note?: string;
}
export type GeomagneticScale = "G1" | "G2" | "G3" | "G4" | "G5";
export interface GeomagneticStorm {
  gScale?: GeomagneticScale;
  kpIndex?: number;
  startIso?: string;
  earthEntityId: string; // planet:earth
  note?: string;
}
export interface AuroraForecast {
  kpIndex?: number;
  forecastIso?: string;
  /** Approximate lowest latitude where aurora may be visible (degrees). */
  visibilityLatitude?: number;
  sunEntityId: string;
  earthEntityId: string;
  note?: string;
}
export interface SpaceWeatherAlert {
  kind: "flare" | "geomagnetic-storm" | "radiation-storm" | "radio-blackout";
  issuedIso?: string;
  message?: string;
  source: SourceKey[];
}

/* --------------------------------------------------------------- calendar */
export type ObservingEventKind =
  | "meteor-shower" | "eclipse" | "solstice" | "equinox" | "opposition" | "conjunction" | "supermoon";
export interface ObservingEvent {
  slug: string;
  name: string;
  kind: ObservingEventKind;
  /** Month (1-12) the recurring event typically falls in, where applicable. Not a specific year's date. */
  month?: number;
  monthLabel?: string;
  relatedEntityIds: string[];
  description: string;
}
