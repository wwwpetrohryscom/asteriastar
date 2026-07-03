import {
  planetGeocentric,
  sunGeocentric,
  equatorialToHorizontal,
  PLANET_RISE_ALTITUDE,
  type PlanetKey,
} from "@/platform/live-sky/providers/planetary-position";
import { localMinuteToUtcMs, type ResolvedLocation } from "@/platform/live-sky/location";
import type { PlanetStatus } from "@/platform/live-sky/models";

/**
 * Planet visibility engine (Program S). For one planet and one local civil day it
 * computes rise, set, and transit by sampling the planet's altitude across the
 * day, and applies conservative, documented observing rules to decide whether the
 * planet is realistically visible, and when. Deterministic and pure. Every edge
 * case is honest: an event that does not occur is null; a planet lost in the Sun's
 * glare or never high enough is reported as not visible, never overpromised.
 */

const SAMPLE_STEP_MIN = 10;
/** A planet must reach at least this altitude while the Sun is down to count as comfortably visible. */
export const MIN_VISIBLE_ALTITUDE_DEG = 10;
/** Closer than this to the Sun, a planet is lost in twilight glare. */
export const MIN_ELONGATION_DEG = 15;
/** Fainter than about this magnitude, a planet is not a naked-eye object. */
export const NAKED_EYE_MAGNITUDE_LIMIT = 6;
/**
 * "Dark enough to observe" = the Sun more than 6° below the horizon (the end of
 * civil twilight). Using the geometric horizon (−0.833°) would count bright dawn
 * as observable and overstate visibility, so this is the conservative choice.
 */
const DARK_ENOUGH_ALTITUDE = -6;

const round = (x: number, dp: number): number => Math.round(x * 10 ** dp) / 10 ** dp;

export type WindowLabel = "morning" | "evening" | "all-night" | "not-visible";

export interface PlanetDay {
  riseUtcMs: number | null;
  setUtcMs: number | null;
  transitUtcMs: number | null;
  transitAltitudeDeg: number | null;
  /** Topocentric altitude/azimuth at the reference time. */
  altitudeDeg: number;
  azimuthDeg: number;
  rightAscensionDeg: number;
  declinationDeg: number;
  distanceAu: number;
  elongationDeg: number;
  apparentMagnitude: number;
  aboveHorizonAtReferenceTime: boolean;
  visibleTonight: boolean;
  window: WindowLabel;
  bestTimeUtcMs: number | null;
  bestAltitudeDeg: number | null;
  status: PlanetStatus[];
  limitingFactors: string[];
}

/**
 * Compute a planet's rise/set/transit and visibility for the resolved local day.
 * The planet's RA/Dec are evaluated once at `refTime` (planets move < ~1°/day, so
 * they are effectively fixed across the day — well within the ~1–2 min rise/set
 * target); the Sun's RA/Dec likewise, for the darkness test.
 */
export function computePlanetVisibility(planet: PlanetKey, loc: ResolvedLocation, refTime: Date): PlanetDay {
  const { latitude, longitude } = loc;
  const pos = planetGeocentric(planet, refTime);
  const sun = sunGeocentric(refTime);

  const planetAlt = (ms: number): number => equatorialToHorizontal(pos.rightAscensionDeg, pos.declinationDeg, latitude, longitude, new Date(ms)).altitudeDeg;
  const planetHa = (ms: number): number => equatorialToHorizontal(pos.rightAscensionDeg, pos.declinationDeg, latitude, longitude, new Date(ms)).hourAngleDeg;
  const sunAlt = (ms: number): number => equatorialToHorizontal(sun.rightAscensionDeg, sun.declinationDeg, latitude, longitude, new Date(ms)).altitudeDeg;

  const refH = equatorialToHorizontal(pos.rightAscensionDeg, pos.declinationDeg, latitude, longitude, refTime);

  // Sample the local day inclusive of both endpoints.
  const samples: { ms: number; alt: number; ha: number; sun: number }[] = [];
  for (let m = 0; m <= 1440; m += SAMPLE_STEP_MIN) {
    const ms = localMinuteToUtcMs(loc, m);
    samples.push({ ms, alt: planetAlt(ms), ha: planetHa(ms), sun: sunAlt(ms) });
  }

  let anyAbove = false;
  let anyBelow = false;
  for (const s of samples) {
    if (s.alt > PLANET_RISE_ALTITUDE) anyAbove = true;
    else anyBelow = true;
  }

  const refine = (loMs: number, hiMs: number): number => {
    let lo = loMs;
    let hi = hiMs;
    const fLo = planetAlt(lo) - PLANET_RISE_ALTITUDE;
    for (let i = 0; i < 20; i++) {
      const mid = (lo + hi) / 2;
      if (hi - lo < 500) return mid;
      if (Math.sign(planetAlt(mid) - PLANET_RISE_ALTITUDE) === Math.sign(fLo)) lo = mid;
      else hi = mid;
    }
    return (lo + hi) / 2;
  };
  const refineTransit = (loMs: number, hiMs: number): number => {
    let lo = loMs;
    let hi = hiMs;
    for (let i = 0; i < 20; i++) {
      const mid = (lo + hi) / 2;
      if (hi - lo < 500) return mid;
      if (planetHa(mid) < 0) lo = mid;
      else hi = mid;
    }
    return (lo + hi) / 2;
  };

  let riseUtcMs: number | null = null;
  let setUtcMs: number | null = null;
  let transitUtcMs: number | null = null;
  let transitAltitudeDeg: number | null = null;
  for (let i = 1; i < samples.length; i++) {
    const a = samples[i - 1];
    const b = samples[i];
    const ra = a.alt - PLANET_RISE_ALTITUDE;
    const rb = b.alt - PLANET_RISE_ALTITUDE;
    if (ra < 0 && rb >= 0 && riseUtcMs === null) riseUtcMs = refine(a.ms, b.ms);
    if (ra >= 0 && rb < 0 && setUtcMs === null) setUtcMs = refine(a.ms, b.ms);
    if (transitUtcMs === null && a.ha < 0 && b.ha >= 0 && b.ha - a.ha < 180) {
      transitUtcMs = refineTransit(a.ms, b.ms);
      transitAltitudeDeg = round(planetAlt(transitUtcMs), 1);
    }
  }

  // Within a civil day the two dark periods (early morning + late evening) are
  // separated by DAYTIME, so solar NOON (the Sun's highest point) is what splits
  // the morning half from the evening half — not solar midnight.
  let solarNoonMs = samples[0].ms;
  let maxSun = -Infinity;
  for (const s of samples) {
    if (s.sun > maxSun) {
      maxSun = s.sun;
      solarNoonMs = s.ms;
    }
  }
  // Dark-enough window = the Sun more than 6° below the horizon (civil dark).
  const night = samples.filter((s) => s.sun < DARK_ENOUGH_ALTITUDE);
  let bestAltitudeDeg = -Infinity;
  let bestTimeUtcMs: number | null = null;
  let eveningUp = false;
  let morningUp = false;
  for (const s of night) {
    if (s.alt > bestAltitudeDeg) {
      bestAltitudeDeg = s.alt;
      bestTimeUtcMs = s.ms;
    }
    if (s.alt >= MIN_VISIBLE_ALTITUDE_DEG) {
      if (s.ms < solarNoonMs) morningUp = true;
      else eveningUp = true;
    }
  }

  const alwaysAbove = anyAbove && !anyBelow;
  const alwaysBelow = anyBelow && !anyAbove;
  const hasNight = night.length > 0;
  const glare = pos.elongationDeg < MIN_ELONGATION_DEG;
  const highEnough = hasNight && bestAltitudeDeg >= MIN_VISIBLE_ALTITUDE_DEG;
  const nakedEye = pos.apparentMagnitude <= NAKED_EYE_MAGNITUDE_LIMIT;
  // "Visible" means visible to the naked eye: high enough in a dark sky, clear of
  // the Sun's glare, and bright enough. A well-placed but too-faint planet is
  // reported not-visible with the faintness spelled out in the limiting factors.
  const visibleTonight = highEnough && !glare && nakedEye;

  const window: WindowLabel = eveningUp && morningUp ? "all-night" : eveningUp ? "evening" : morningUp ? "morning" : "not-visible";

  const status: PlanetStatus[] = [];
  if (alwaysBelow) status.push("below_horizon_all_day");
  if (alwaysAbove) status.push("above_horizon_all_day");
  if (riseUtcMs === null && !alwaysAbove && !alwaysBelow) status.push("no_rise");
  if (setUtcMs === null && !alwaysAbove && !alwaysBelow) status.push("no_set");
  if (glare) status.push("near_sun_glare");
  if (!alwaysBelow && hasNight && bestAltitudeDeg < MIN_VISIBLE_ALTITUDE_DEG) status.push("low_altitude");
  status.push(visibleTonight ? "normal" : "not_visible");

  const limitingFactors: string[] = [];
  if (alwaysBelow) limitingFactors.push("Below the horizon all day.");
  if (glare) limitingFactors.push(`Only ${round(pos.elongationDeg, 0)}° from the Sun — lost in its glare.`);
  if (!hasNight) limitingFactors.push("The sky never gets dark on this date — the Sun stays within 6° of the horizon.");
  else if (!alwaysBelow && bestAltitudeDeg < MIN_VISIBLE_ALTITUDE_DEG) {
    limitingFactors.push(`Never rises above ${MIN_VISIBLE_ALTITUDE_DEG}° while the Sun is down (peaks at ${round(Math.max(bestAltitudeDeg, 0), 0)}°).`);
  }
  if (pos.apparentMagnitude > NAKED_EYE_MAGNITUDE_LIMIT) {
    limitingFactors.push(`Too faint for the naked eye at magnitude ${round(pos.apparentMagnitude, 1)} — needs binoculars or a telescope.`);
  }

  return {
    riseUtcMs,
    setUtcMs,
    transitUtcMs,
    transitAltitudeDeg,
    altitudeDeg: round(refH.altitudeDeg, 2),
    azimuthDeg: round(refH.azimuthDeg, 2),
    rightAscensionDeg: round(pos.rightAscensionDeg, 3),
    declinationDeg: round(pos.declinationDeg, 3),
    distanceAu: round(pos.distanceAu, 4),
    elongationDeg: round(pos.elongationDeg, 1),
    apparentMagnitude: round(pos.apparentMagnitude, 1),
    aboveHorizonAtReferenceTime: refH.altitudeDeg > PLANET_RISE_ALTITUDE,
    visibleTonight,
    window,
    bestTimeUtcMs: visibleTonight ? bestTimeUtcMs : null,
    bestAltitudeDeg: bestTimeUtcMs !== null && Number.isFinite(bestAltitudeDeg) ? round(bestAltitudeDeg, 1) : null,
    status,
    limitingFactors,
  };
}
