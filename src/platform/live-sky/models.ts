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

/** A single solar event (Program Q). Null when the event does not occur that day. */
export interface SunEvent {
  /** UTC ISO-8601 instant, or null (polar day/night, or an absent twilight boundary). */
  iso: string | null;
  /** Local wall-clock time "HH:mm" in the resolved timezone, or null. */
  local: string | null;
}

/** The daylight/twilight conditions that can apply to a location-date. */
export type SolarDayCondition =
  | "normal"
  | "polar_day"                 // the Sun stays above the horizon for 24 h
  | "polar_night"               // the Sun stays below the horizon for 24 h
  | "no_civil_twilight"         // the Sun never sinks below −6° (no true civil darkness)
  | "no_nautical_twilight"      // the Sun never sinks below −12°
  | "no_astronomical_twilight"; // the Sun never sinks below −18° (no astronomical night)

/**
 * The Program Q Sun & Twilight data contract — deterministically computed solar
 * times for an explicit location and date. Timestamps, source, confidence, and
 * staleness live in the accompanying SkyEnvelope; this payload carries the values.
 * Events are null where they genuinely do not occur (handled honestly, never faked).
 */
export interface SunData {
  objectEntityId: string; // star:sun
  input: {
    latitude: number;
    longitude: number;
    date: string; // YYYY-MM-DD (the civil date at the location)
    timezone: string; // resolved IANA id, or "UTC"
    utcOffsetMinutes: number;
  };
  events: {
    sunrise: SunEvent;
    sunset: SunEvent;
    solarNoon: SunEvent;
    civilDawn: SunEvent;
    civilDusk: SunEvent;
    nauticalDawn: SunEvent;
    nauticalDusk: SunEvent;
    astronomicalDawn: SunEvent;
    astronomicalDusk: SunEvent;
  };
  duration: {
    /** Minutes the Sun is above the −0.833° horizon (0 in polar night, 1440 in polar day). */
    daylightMinutes: number;
    /** Total (morning + evening) minutes the Sun spends in each twilight band. */
    civilTwilightMinutes: number;
    nauticalTwilightMinutes: number;
    astronomicalTwilightMinutes: number;
  };
  solar: {
    declinationDeg: number;
    equationOfTimeMinutes: number;
    /** The Sun's altitude at solar noon (degrees). */
    noonElevationDeg: number;
  };
  /** Applicable conditions; ["normal"] in the common case, plus polar / no-twilight flags. */
  status: SolarDayCondition[];
  /** How the value was obtained. v1 is always "computed". */
  method: "computed" | "provider";
  calculationNotes: string;
}

/* ------------------------------------------------- moon position (Program R) */

/** A moonrise or moonset — its instant plus the horizon azimuth it occurs at. */
export interface MoonRiseEvent {
  iso: string | null;
  local: string | null;
  /** Azimuth of the horizon crossing, degrees from north (null if the event does not occur). */
  azimuthDeg: number | null;
}
/** A lunar transit (culmination) — its instant plus the altitude reached. */
export interface MoonTransitEvent {
  iso: string | null;
  local: string | null;
  altitudeDeg: number | null;
}

/**
 * The Program R location-aware Moon contract — deterministically computed
 * moonrise, moonset, transit, and the Moon's position, phase, and horizon status
 * for an explicit location and date. Timestamps, source, confidence, and
 * staleness live in the accompanying SkyEnvelope. Events that do not occur are
 * null (never faked).
 */
export interface MoonPositionData {
  objectEntityId: string; // moon:the-moon
  input: {
    latitude: number;
    longitude: number;
    date: string; // YYYY-MM-DD (the civil date at the location)
    timezone: string; // resolved IANA id, or "UTC"
    utcOffsetMinutes: number;
  };
  /** The instant `position`, `phase`, and `horizon` are evaluated at (now for a current query, else local noon of the date). */
  referenceTimeIso: string;
  events: {
    moonrise: MoonRiseEvent;
    moonset: MoonRiseEvent;
    /** Upper transit (culmination). */
    lunarTransit: MoonTransitEvent;
    /** Lower transit (anti-culmination), when the Moon is lowest. */
    lunarLowerTransit: { iso: string | null; local: string | null };
  };
  position: {
    /** Topocentric (parallax-corrected) altitude at the reference time (degrees). */
    altitudeDeg: number;
    /** Azimuth from north, increasing eastward (0 = N, 90 = E, 180 = S, 270 = W). */
    azimuthDeg: number;
    rightAscensionDeg: number;
    declinationDeg: number;
    distanceKm: number;
    hourAngleDeg: number;
  };
  phase: {
    phase: MoonPhaseName;
    phaseName: string;
    phaseAngleDeg: number;
    illuminationFraction: number;
    illuminationPercent: number;
    synodicAgeDays: number;
    waxing: boolean;
  };
  horizon: {
    /** Whether the Moon is above the horizon at the reference time. */
    aboveHorizonAtReferenceTime: boolean;
    alwaysAboveHorizon: boolean;
    alwaysBelowHorizon: boolean;
    noMoonrise: boolean;
    noMoonset: boolean;
    /** True at high latitudes when the Moon rises or sets more than once on the local date (only the first of each is reported in `events`). */
    multipleEventsSameDay: boolean;
  };
  method: "computed" | "provider";
  calculationNotes: string;
  accuracyNotes: string;
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
