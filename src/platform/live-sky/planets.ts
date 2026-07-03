import { computedEnvelope, withStaleness, type Enveloped } from "@/platform/live-sky/schema";
import type { PlanetVisibilityData, PlanetVisibilityEntry, PlanetEvent } from "@/platform/live-sky/models";
import { computePlanetVisibility, type PlanetDay, type WindowLabel } from "@/platform/live-sky/planet-visibility";
import { NAKED_EYE_PLANET_KEYS, type PlanetKey } from "@/platform/live-sky/providers/planetary-position";
import {
  resolveLocation,
  isValidIanaTimeZone,
  timezoneOffsetMinutes,
  type LocationInput,
  type LocationField,
  type ResolvedLocation,
} from "@/platform/live-sky/location";

/** Reference: the naked-eye planets and how they generally appear (timeless). */
export const NAKED_EYE_PLANETS: { entityId: string; name: string; behaviour: string }[] = [
  { entityId: "planet:mercury", name: "Mercury", behaviour: "An inner planet; only ever visible low in twilight, briefly after sunset or before sunrise." },
  { entityId: "planet:venus", name: "Venus", behaviour: "The brightest planet; a brilliant 'morning' or 'evening star' near the Sun, never far from twilight." },
  { entityId: "planet:mars", name: "Mars", behaviour: "An outer planet, reddish; brightest and visible all night around opposition, roughly every 26 months." },
  { entityId: "planet:jupiter", name: "Jupiter", behaviour: "An outer planet; very bright, visible all night around opposition each year." },
  { entityId: "planet:saturn", name: "Saturn", behaviour: "An outer planet; steady and golden, best around its yearly opposition." },
];

/** Uranus and Neptune are outer planets requiring optical aid. */
export const TELESCOPIC_PLANETS = ["planet:uranus", "planet:neptune"];

const PLANET_CATALOG: Record<PlanetKey, { entityId: string; name: string }> = {
  mercury: { entityId: "planet:mercury", name: "Mercury" },
  venus: { entityId: "planet:venus", name: "Venus" },
  mars: { entityId: "planet:mars", name: "Mars" },
  jupiter: { entityId: "planet:jupiter", name: "Jupiter" },
  saturn: { entityId: "planet:saturn", name: "Saturn" },
  uranus: { entityId: "planet:uranus", name: "Uranus" },
  neptune: { entityId: "planet:neptune", name: "Neptune" },
};

/** Short validity/cache horizon — a current planet position drifts slowly but the sky rotates. */
const PLANET_CACHE_HOURS = 1;

const pad = (n: number): string => String(n).padStart(2, "0");

const CALC_NOTES =
  "Positions are computed from public-domain Keplerian orbital elements (NASA/JPL 'Approximate Positions of the Planets'); rise, set, and transit are found by sampling each planet's altitude across the local day. Visibility applies conservative naked-eye rules: a planet counts as visible only if it reaches at least 10° altitude while the sky is dark (the Sun more than 6° below the horizon), is more than 15° from the Sun, and is bright enough for the naked eye (magnitude ≤ 6). Position, magnitude, and above-horizon status are for the reference time (now for a current query, else local noon of the requested date). Events that do not occur are null.";

const ACCURACY_NOTES =
  "Approximate: planetary position ~a few arcminutes to ~0.1°, rise/set/transit ~1–2 minutes, apparent magnitude ~±0.3–0.5 (Saturn's rings are not modelled). Suitable for observing guidance — NOT for high-precision astrometry, occultation predictions, spacecraft navigation, or legal/almanac-grade use. The visibility rules are deliberately conservative approximations, not a guarantee.";

/** The local civil date (YYYY-MM-DD) of an instant in a timezone (UTC if none/invalid). */
function localDateOf(instant: Date, timezone: string | undefined): string {
  const off = timezone && isValidIanaTimeZone(timezone) ? timezoneOffsetMinutes(timezone, instant) : 0;
  const local = new Date(instant.getTime() + off * 60_000);
  return `${local.getUTCFullYear()}-${pad(local.getUTCMonth() + 1)}-${pad(local.getUTCDate())}`;
}
function localNoon(loc: ResolvedLocation): Date {
  return new Date(Date.UTC(loc.year, loc.month - 1, loc.day, 12, 0, 0) - loc.utcOffsetMinutes * 60_000);
}
function eventTimes(loc: ResolvedLocation, utcMs: number | null): PlanetEvent {
  if (utcMs === null) return { iso: null, local: null };
  const instant = new Date(utcMs);
  const off = loc.timezoneProvided ? timezoneOffsetMinutes(loc.timezone, instant) : 0;
  const wall = new Date(instant.getTime() + off * 60_000);
  return { iso: instant.toISOString(), local: `${pad(wall.getUTCHours())}:${pad(wall.getUTCMinutes())}` };
}

function brightnessWord(mag: number): string {
  if (mag < -3) return "brilliant";
  if (mag < 0) return "very bright";
  if (mag < 1.5) return "bright";
  if (mag < 3.5) return "modest";
  return "faint";
}
const WINDOW_PHRASE: Record<WindowLabel, string> = {
  evening: "in the evening sky after sunset",
  morning: "in the morning sky before dawn",
  "all-night": "for much of the night",
  "not-visible": "",
};

function toEntry(key: PlanetKey, day: PlanetDay, loc: ResolvedLocation): PlanetVisibilityEntry {
  const cat = PLANET_CATALOG[key];
  const best = eventTimes(loc, day.bestTimeUtcMs);
  let visibilityWindow: string;
  let observingSummary: string;
  if (day.visibleTonight && best.local) {
    visibilityWindow = `Best around ${best.local} at ${day.bestAltitudeDeg}° (${day.window}).`;
    observingSummary = `${cat.name} is ${brightnessWord(day.apparentMagnitude)} at about magnitude ${day.apparentMagnitude}, visible ${WINDOW_PHRASE[day.window]}.`;
  } else {
    visibilityWindow = "Not comfortably visible tonight.";
    observingSummary =
      `${cat.name} is not comfortably visible tonight from this location` +
      (day.limitingFactors.length ? ` — ${day.limitingFactors[0].replace(/\.$/, "").toLowerCase()}.` : ".");
  }

  return {
    objectEntityId: cat.entityId,
    planetName: cat.name,
    events: {
      rise: eventTimes(loc, day.riseUtcMs),
      set: eventTimes(loc, day.setUtcMs),
      transit: eventTimes(loc, day.transitUtcMs),
    },
    position: {
      altitudeDeg: day.altitudeDeg,
      azimuthDeg: day.azimuthDeg,
      rightAscensionDeg: day.rightAscensionDeg,
      declinationDeg: day.declinationDeg,
      distanceAu: day.distanceAu,
      elongationDeg: day.elongationDeg,
      apparentMagnitude: day.apparentMagnitude,
    },
    visibility: {
      aboveHorizonAtReferenceTime: day.aboveHorizonAtReferenceTime,
      visibleTonight: day.visibleTonight,
      visibilityWindow,
      morningOrEvening: day.window,
      bestTimeIso: day.bestTimeUtcMs !== null ? new Date(day.bestTimeUtcMs).toISOString() : null,
      observingSummary,
      limitingFactors: day.limitingFactors,
    },
    status: day.status,
  };
}

/** The result of a planet-visibility computation: the enveloped data, or a structured error. */
export type PlanetVisibilityResult =
  | { ok: true; value: Enveloped<PlanetVisibilityData> }
  | { ok: false; field: LocationField; message: string };

function buildLocationAware(input: LocationInput, now: Date, planet?: PlanetKey): PlanetVisibilityResult {
  const isCurrent = !input.date;
  const withDate: LocationInput = isCurrent ? { ...input, date: localDateOf(now, input.timezone) } : input;
  const resolved = resolveLocation(withDate);
  if (!resolved.ok) return { ok: false, field: resolved.field, message: resolved.message };
  const loc = resolved.location;

  const refTime = isCurrent ? now : localNoon(loc);
  const keys = planet ? [planet] : NAKED_EYE_PLANET_KEYS;
  const entries = keys.map((key) => toEntry(key, computePlanetVisibility(key, loc, refTime), loc));

  const data: PlanetVisibilityData = {
    input: {
      latitude: loc.latitude,
      longitude: loc.longitude,
      date: loc.date,
      timezone: loc.timezone,
      utcOffsetMinutes: loc.utcOffsetMinutes,
    },
    referenceTimeIso: refTime.toISOString(),
    planets: entries,
    method: "computed",
    calculationNotes: CALC_NOTES,
    accuracyNotes: ACCURACY_NOTES,
  };

  const validFrom = refTime.toISOString();
  const validUntil = isCurrent ? new Date(refTime.getTime() + PLANET_CACHE_HOURS * 3_600_000).toISOString() : validFrom;
  let envelope = computedEnvelope({
    source: ["jpl", "usno"],
    generatedAt: now.toISOString(),
    validFrom,
    validUntil,
    confidence: "modeled",
    provenance:
      "Computed deterministically from the public-domain NASA/JPL 'Approximate Positions of the Planets' Keplerian elements and Astronomical Almanac (USNO) magnitude coefficients — not fetched from a live provider. Location is used only for this calculation and is not stored.",
    licenseNotes:
      "Computed values. The underlying orbital elements and coefficients are public-domain astronomical quantities; no provider data is redistributed.",
  });
  if (isCurrent) envelope = withStaleness(envelope, now.toISOString());

  return { ok: true, value: { data, envelope } };
}

export const planets = {
  nakedEye: NAKED_EYE_PLANETS,
  telescopic: TELESCOPIC_PLANETS,
  linkedEntityIds: [
    "planet:mercury", "planet:venus", "planet:mars", "planet:jupiter", "planet:saturn", "planet:uranus", "planet:neptune",
  ],

  /**
   * Computed planet visibility (Program S): rise/set/transit, position, and honest
   * visibility rules for the naked-eye planets (or one planet) at an explicit
   * location and date. `now` is the real computation time. A validation failure
   * returns a structured error rather than a guessed value.
   */
  forLocationDate: (input: LocationInput, now: Date, planet?: PlanetKey): PlanetVisibilityResult => buildLocationAware(input, now, planet),
};
