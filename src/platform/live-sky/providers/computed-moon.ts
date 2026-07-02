import type { MoonPhaseName } from "@/platform/live-sky/models";

/**
 * Deterministic Moon-phase calculation (Program P).
 *
 * This is a COMPUTED provider, not a live network feed: it derives the Moon's
 * phase and illuminated fraction from the Sun–Moon geometry using published,
 * public-domain astronomical formulae and constants. It fetches nothing, scrapes
 * nothing, and uses no paid API. Results are labelled `method: "computed"`.
 *
 * Sources & methodology (public domain / open):
 *  - Solar ecliptic longitude: USNO "Approximate Solar Coordinates"
 *    (aa.usno.navy.mil) — mean anomaly, mean longitude, and equation of centre.
 *  - Lunar mean elements and the dominant periodic terms of the Moon's ecliptic
 *    longitude: standard low-precision lunar theory (as tabulated by Jean Meeus,
 *    "Astronomical Algorithms"; and the Astronomical Almanac). Only the mean
 *    elements and a handful of the largest terms are used — public-domain
 *    quantities, not copyrighted text.
 *  - Synodic month = 29.530588853 days (mean value, IAU/almanac constant).
 *
 * Accuracy: illuminated fraction is good to ~1% and the phase name is reliable —
 * ample for observing guidance. It is NOT a substitute for a full ephemeris
 * (JPL Horizons / USNO almanac) for rise/set or high-precision work.
 */

export const SYNODIC_MONTH_DAYS = 29.530588853;

/** The eight phase-name bins by Sun–Moon elongation (degrees, 0 = new, 180 = full). */
const PHASE_BINS: { max: number; phase: MoonPhaseName }[] = [
  { max: 22.5, phase: "new-moon" },
  { max: 67.5, phase: "waxing-crescent" },
  { max: 112.5, phase: "first-quarter" },
  { max: 157.5, phase: "waxing-gibbous" },
  { max: 202.5, phase: "full-moon" },
  { max: 247.5, phase: "waning-gibbous" },
  { max: 292.5, phase: "last-quarter" },
  { max: 337.5, phase: "waning-crescent" },
  { max: 360.1, phase: "new-moon" },
];

export interface MoonComputation {
  /** Sun–Moon elongation in degrees (0 = new, 90 = first quarter, 180 = full, 270 = last quarter). */
  elongationDeg: number;
  /** Illuminated fraction of the disc, 0–1. */
  illuminationFraction: number;
  /** Age since the previous new moon, in days (0 … ~29.53). */
  synodicAgeDays: number;
  phase: MoonPhaseName;
  /** True when the Moon is waxing (elongation increasing, 0–180°). */
  waxing: boolean;
}

const D2R = Math.PI / 180;
const norm360 = (x: number): number => ((x % 360) + 360) % 360;
const sinD = (d: number): number => Math.sin(d * D2R);
const cosD = (d: number): number => Math.cos(d * D2R);

/** Julian Day from a JS Date (UTC). */
export function julianDay(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

/**
 * Compute the Moon's phase geometry for an instant. Pure and deterministic —
 * the same instant always yields the same result. No fabricated values: every
 * output is derived from the sourced formulae above.
 */
export function computeMoon(at: Date): MoonComputation {
  const d = julianDay(at) - 2451545.0; // days since J2000.0 (2000-01-01 12:00 UTC)

  // Sun — USNO approximate solar coordinates (degrees).
  const g = norm360(357.529 + 0.98560028 * d); // mean anomaly
  const q = norm360(280.459 + 0.98564736 * d); // mean longitude
  const lSun = norm360(q + 1.915 * sinD(g) + 0.020 * sinD(2 * g)); // ecliptic longitude

  // Moon — mean elements (degrees).
  const lp = norm360(218.316 + 13.176396 * d); // mean longitude
  const mp = norm360(134.963 + 13.064993 * d); // mean anomaly
  const dm = norm360(297.850 + 12.190749 * d); // mean elongation
  const f = norm360(93.272 + 13.229350 * d); // argument of latitude

  // Moon ecliptic longitude — the dominant periodic terms (degrees).
  const lMoon = norm360(
    lp +
      6.289 * sinD(mp) -
      1.274 * sinD(mp - 2 * dm) +
      0.658 * sinD(2 * dm) +
      0.214 * sinD(2 * mp) -
      0.186 * sinD(g) -
      0.114 * sinD(2 * f),
  );

  const elongationDeg = norm360(lMoon - lSun);
  const illuminationFraction = (1 - cosD(elongationDeg)) / 2;
  const synodicAgeDays = (elongationDeg / 360) * SYNODIC_MONTH_DAYS;
  const phase = PHASE_BINS.find((b) => elongationDeg < b.max)!.phase;
  return { elongationDeg, illuminationFraction, synodicAgeDays, phase, waxing: elongationDeg <= 180 };
}
