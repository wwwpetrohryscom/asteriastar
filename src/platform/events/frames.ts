/**
 * The one coordinate correction the event engine cannot do without.
 *
 * AsteriaStar already carries two independent position calculators, and they do NOT speak the same
 * frame:
 *
 *  - `planetary-position.ts` builds the Sun and the planets from JPL's "Approximate Positions of
 *    the Planets" elements, which are referred to the **mean ecliptic and equinox of J2000.0**.
 *  - `lunar-position.ts` uses the Almanac's low-precision lunar theory, whose longitude is referred
 *    to the **mean equinox of date**, as that theory is conventionally tabulated.
 *
 * Every event in this module is defined by an angle between two of those bodies, or between a body
 * and the equinox itself. Mixing the frames, or comparing a J2000 longitude against a definition
 * written in terms of the equinox of date, introduces the accumulated precession — 0.363° in 2026 —
 * as a silent systematic error. It does not look like an error. It looks like an equinox nine hours
 * late and a full Moon three quarters of an hour early, which is exactly what the first version of
 * this code produced when checked against NASA's own tables.
 *
 * So longitudes are brought to the equinox of date here, in one place, and the event finders work in
 * that frame throughout — because that is the frame the definitions are written in. An equinox is
 * the instant the Sun's apparent longitude, referred to the equinox OF THAT MOMENT, reaches zero.
 *
 * Method: the IAU 2006 expression for general precession in longitude, applied as a rotation of the
 * origin rather than as the full rotation of the ecliptic plane. Measured against a rigorous
 * IAU 1976 precession over the range this platform covers, the shortfall depends on how far the
 * body sits from the ecliptic: 0.1″ on the ecliptic itself, about 1″ at 5° of latitude, and 4″ at
 * 9° — the extreme for Mercury and Venus. Every body this is applied to stays within that band, and
 * the term largely cancels in the longitude DIFFERENCES the events are actually defined by. Against
 * a position series accurate to five arcminutes, and uncertainties stated in minutes and hours, it
 * is immaterial — but it is four arcseconds, not a fraction of one.
 */

import { OBLIQUITY_J2000_DEG } from "@/platform/live-sky/providers/planetary-position";

const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;

/** J2000.0 as a Unix millisecond value: 2000 January 1, 12:00 TT, taken as UTC. */
export const J2000_MS = Date.UTC(2000, 0, 1, 12, 0, 0);

/**
 * Mean obliquity of the ecliptic at J2000.0 — re-exported from the position series rather than
 * restated, so the two can never disagree about the plane they are rotating into.
 */
export { OBLIQUITY_J2000_DEG } from "@/platform/live-sky/providers/planetary-position";

export const norm360 = (x: number): number => ((x % 360) + 360) % 360;
export const norm180 = (x: number): number => norm360(x + 180) - 180;

/** Julian centuries from J2000.0. */
export function julianCenturies(timeMs: number): number {
  return (timeMs - J2000_MS) / (36525 * 86_400_000);
}

/**
 * General precession in longitude since J2000.0, in degrees (IAU 2006, Capitaine et al.).
 *
 * Positive: the equinox moves westward along the ecliptic, so a fixed direction acquires an
 * increasing longitude as time runs forward.
 */
export function precessionInLongitudeDeg(timeMs: number): number {
  const t = julianCenturies(timeMs);
  return (5028.796195 * t + 1.1054348 * t * t + 0.00007964 * t * t * t) / 3600;
}

/**
 * Geocentric ecliptic longitude referred to the mean equinox of date, from an equatorial position
 * expressed in the J2000 frame.
 */
export function eclipticLongitudeOfDate(rightAscensionDeg: number, declinationDeg: number, timeMs: number): number {
  const eps = OBLIQUITY_J2000_DEG * D2R;
  const ra = rightAscensionDeg * D2R;
  const dec = declinationDeg * D2R;
  const x = Math.cos(dec) * Math.cos(ra);
  const y = Math.cos(dec) * Math.sin(ra) * Math.cos(eps) + Math.sin(dec) * Math.sin(eps);
  return norm360(Math.atan2(y, x) * R2D + precessionInLongitudeDeg(timeMs));
}


/** Angular separation between two equatorial positions, in degrees. */
export function angularSeparationDeg(aRaDeg: number, aDecDeg: number, bRaDeg: number, bDecDeg: number): number {
  const a1 = aRaDeg * D2R;
  const d1 = aDecDeg * D2R;
  const a2 = bRaDeg * D2R;
  const d2 = bDecDeg * D2R;
  const cos = Math.sin(d1) * Math.sin(d2) + Math.cos(d1) * Math.cos(d2) * Math.cos(a1 - a2);
  return Math.acos(Math.max(-1, Math.min(1, cos))) * R2D;
}
