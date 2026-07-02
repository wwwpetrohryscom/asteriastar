import { julianDay } from "@/platform/live-sky/providers/computed-moon";

/**
 * Deterministic lunar-position calculator (Program R — Moonrise, Moonset & Lunar
 * Position v1).
 *
 * A COMPUTED provider, not a live feed: it derives the Moon's geocentric
 * position, then the observer's topocentric altitude/azimuth, from published,
 * public-domain low-precision lunar theory. It fetches nothing, scrapes nothing,
 * and uses no paid API. Results are labelled `method: "computed"`.
 *
 * Sources & methodology (public domain / open):
 *  - Low-precision lunar theory — the mean elements and the principal periodic
 *    terms of the Moon's ecliptic longitude, latitude, and distance, as tabulated
 *    in the Astronomical Almanac (US Naval Observatory / HM Nautical Almanac
 *    Office) and, as a methodology reference, Jean Meeus, "Astronomical
 *    Algorithms". Only the mean elements and the largest terms are used —
 *    public-domain astronomical quantities, not copyrighted text. This extends
 *    the same series the Program P Moon phase already uses.
 *  - Standard spherical astronomy for the ecliptic→equatorial rotation, Greenwich
 *    mean sidereal time, the hour angle, and the altitude/azimuth transform.
 *  - Topocentric parallax from the Moon's horizontal parallax (the Moon is near
 *    enough that this ~1° shift matters for rise/set and altitude).
 *
 * Accuracy: geocentric position ~0.05–0.2°; moonrise/moonset/transit ~1–2 min;
 * topocentric altitude ~0.1°. Ample for observing guidance — NOT for
 * occultations, grazes, spacecraft navigation, high-precision astrometry, or
 * legal/almanac-grade use.
 */

const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;
const sinD = (d: number): number => Math.sin(d * D2R);
const cosD = (d: number): number => Math.cos(d * D2R);
const tanD = (d: number): number => Math.tan(d * D2R);
const asinD = (x: number): number => Math.asin(x) * R2D;
const atan2D = (y: number, x: number): number => Math.atan2(y, x) * R2D;
const norm360 = (x: number): number => ((x % 360) + 360) % 360;
const norm180 = (x: number): number => ((((x + 180) % 360) + 360) % 360) - 180;

/** Mean equatorial radius of the Earth (km) — for the horizontal parallax. */
const EARTH_RADIUS_KM = 6378.14;

export interface MoonEcliptic {
  /** Geocentric ecliptic longitude (degrees). */
  longitudeDeg: number;
  /** Geocentric ecliptic latitude (degrees). */
  latitudeDeg: number;
  /** Earth–Moon distance (km). */
  distanceKm: number;
  /** Julian centuries since J2000.0. */
  julianCentury: number;
}

/** The Moon's geocentric ecliptic longitude, latitude, and distance for an instant. */
export function moonEcliptic(at: Date): MoonEcliptic {
  const d = julianDay(at) - 2451545.0; // days since J2000.0
  const T = d / 36525;

  const lp = norm360(218.316 + 13.176396 * d); // mean longitude
  const m = norm360(357.529 + 0.98560028 * d); // Sun mean anomaly
  const mp = norm360(134.963 + 13.064993 * d); // Moon mean anomaly
  const dm = norm360(297.85 + 12.190749 * d); // mean elongation
  const f = norm360(93.272 + 13.22935 * d); // argument of latitude

  const longitudeDeg = norm360(
    lp +
      6.289 * sinD(mp) -
      1.274 * sinD(mp - 2 * dm) +
      0.658 * sinD(2 * dm) +
      0.214 * sinD(2 * mp) -
      0.186 * sinD(m) -
      0.114 * sinD(2 * f) +
      0.059 * sinD(2 * mp - 2 * dm) +
      0.057 * sinD(mp - 2 * dm + m) +
      0.053 * sinD(mp + 2 * dm) +
      0.046 * sinD(2 * dm - m) -
      0.041 * sinD(mp - m) -
      0.035 * sinD(dm) -
      0.031 * sinD(mp + m),
  );

  const latitudeDeg =
    5.128 * sinD(f) +
    0.281 * sinD(mp + f) +
    0.278 * sinD(mp - f) +
    0.173 * sinD(2 * dm - f) +
    0.055 * sinD(2 * dm - mp + f) +
    0.046 * sinD(2 * dm - mp - f) +
    0.033 * sinD(2 * dm + f) -
    0.017 * sinD(2 * mp + f);

  const distanceKm =
    385000.56 -
    20905.355 * cosD(mp) -
    3699.111 * cosD(2 * dm - mp) -
    2955.968 * cosD(2 * dm) -
    569.925 * cosD(2 * mp) +
    246.158 * cosD(2 * dm - 2 * mp) -
    152.138 * cosD(2 * dm - mp - m) -
    170.733 * cosD(2 * dm + mp);

  return { longitudeDeg, latitudeDeg, distanceKm, julianCentury: T };
}

export interface MoonEquatorial {
  rightAscensionDeg: number;
  declinationDeg: number;
  distanceKm: number;
  /** Horizontal parallax (degrees). */
  parallaxDeg: number;
}

/** The Moon's geocentric equatorial coordinates (RA, Dec) for an instant. */
export function moonEquatorial(at: Date): MoonEquatorial {
  const ecl = moonEcliptic(at);
  const eps = 23.439291 - 0.0130042 * ecl.julianCentury; // obliquity of the ecliptic
  const { longitudeDeg: lon, latitudeDeg: lat } = ecl;
  const rightAscensionDeg = norm360(atan2D(sinD(lon) * cosD(eps) - tanD(lat) * sinD(eps), cosD(lon)));
  const declinationDeg = asinD(sinD(lat) * cosD(eps) + cosD(lat) * sinD(eps) * sinD(lon));
  const parallaxDeg = asinD(EARTH_RADIUS_KM / ecl.distanceKm);
  return { rightAscensionDeg, declinationDeg, distanceKm: ecl.distanceKm, parallaxDeg };
}

/** Greenwich mean sidereal time (degrees) for an instant. */
export function greenwichMeanSiderealTimeDeg(at: Date): number {
  const d = julianDay(at) - 2451545.0;
  const T = d / 36525;
  return norm360(280.46061837 + 360.98564736629 * d + 0.000387933 * T * T - (T * T * T) / 38710000);
}

/** The topocentric altitude a moonrise/moonset threshold uses: the Moon's centre when its upper limb, refracted, meets the horizon. */
export const MOON_RISE_ALTITUDE = -0.833;

export interface MoonTopocentric {
  /** Topocentric (parallax-corrected) altitude above the horizon (degrees). */
  altitudeDeg: number;
  /** Azimuth measured from north, increasing eastward (0 = N, 90 = E, 180 = S, 270 = W). */
  azimuthDeg: number;
  hourAngleDeg: number;
  rightAscensionDeg: number;
  declinationDeg: number;
  distanceKm: number;
  parallaxDeg: number;
}

/**
 * The Moon's topocentric altitude and azimuth as seen from an explicit location.
 * Longitude is east-positive. Pure and deterministic — the same inputs always
 * yield the same result; no fabricated values.
 */
export function moonTopocentric(at: Date, latitude: number, longitude: number): MoonTopocentric {
  const eq = moonEquatorial(at);
  const lst = norm360(greenwichMeanSiderealTimeDeg(at) + longitude);
  const hourAngleDeg = norm180(lst - eq.rightAscensionDeg);
  const sinAlt = sinD(latitude) * sinD(eq.declinationDeg) + cosD(latitude) * cosD(eq.declinationDeg) * cosD(hourAngleDeg);
  const geoAlt = asinD(sinAlt);
  const azimuthDeg = norm360(
    atan2D(-cosD(eq.declinationDeg) * sinD(hourAngleDeg), sinD(eq.declinationDeg) * cosD(latitude) - cosD(eq.declinationDeg) * sinD(latitude) * cosD(hourAngleDeg)),
  );
  // Parallax lowers the apparent altitude (the observer is on the surface, not at Earth's centre).
  const altitudeDeg = geoAlt - eq.parallaxDeg * cosD(geoAlt);
  return {
    altitudeDeg,
    azimuthDeg,
    hourAngleDeg,
    rightAscensionDeg: eq.rightAscensionDeg,
    declinationDeg: eq.declinationDeg,
    distanceKm: eq.distanceKm,
    parallaxDeg: eq.parallaxDeg,
  };
}
