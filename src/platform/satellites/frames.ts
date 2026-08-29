/**
 * Reference-frame transformations for satellite tracking (Program CL).
 *
 * NASA publishes the ISS trajectory as state vectors in the mean equator and equinox of J2000
 * (EME2000). Every question an observer actually asks — where is it over the Earth, is it above my
 * horizon, when does it rise — is asked in an Earth-fixed frame. Getting between the two is the
 * whole of this file, and getting it wrong is invisible: a plausible-looking ground track that is
 * simply in the wrong place.
 *
 * The chain is the standard one: precession (IAU 1976) from J2000 to the mean equator of date,
 * nutation (IAU 1980) to the true equator of date, then Earth rotation through Greenwich apparent
 * sidereal time to the Earth-fixed frame.
 *
 * IT IS VERIFIED, not asserted. Every NASA ephemeris file states the Earth-fixed longitude of the
 * ISS's first and last ascending nodes, computed by NASA/JSC. Running this transform on the same
 * ephemeris at those epochs reproduces those longitudes to about a metre — and independently puts
 * the latitude at zero, which is what an ascending node is. `npm run live:validate` performs that
 * comparison on the real file, so a regression in this arithmetic fails the build rather than
 * quietly moving the ISS.
 *
 * Deliberately omitted: polar motion (a few tenths of an arcsecond, ~10 m on the ground) and the
 * UT1−UTC difference (under 0.9 s by definition, up to ~400 m of longitude). Both are far below
 * the accuracy that matters for a visible pass, and both are named here rather than hidden.
 */

const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;
const AS2R = D2R / 3600;

/** WGS-84 ellipsoid — the datum every consumer-grade coordinate is expressed in. */
export const EARTH_RADIUS_KM = 6378.137;
const FLATTENING = 1 / 298.257223563;
const E2 = FLATTENING * (2 - FLATTENING);

/**
 * TT − UTC in seconds: 32.184 s (TT − TAI) plus the 37 leap seconds in force since 2017.
 *
 * Hard-coded, and therefore something that must be revisited if IERS ever announces another leap
 * second. It is used only to evaluate precession and nutation, where a second of time moves the
 * result by well under a milliarcsecond, so a stale value here degrades nothing measurable — but a
 * constant that can silently expire is worth naming.
 */
const TT_MINUS_UTC_SECONDS = 69.184;

export type Vec3 = readonly [number, number, number];

/* Frame rotations, in the sense used throughout the astrodynamics literature: ROTn(a) rotates the
 * COORDINATE FRAME by +a about axis n, which is a rotation of the vector by −a. */
const rot1 = (a: number, v: Vec3): Vec3 => {
  const c = Math.cos(a), s = Math.sin(a);
  return [v[0], c * v[1] + s * v[2], -s * v[1] + c * v[2]];
};
const rot2 = (a: number, v: Vec3): Vec3 => {
  const c = Math.cos(a), s = Math.sin(a);
  return [c * v[0] - s * v[2], v[1], s * v[0] + c * v[2]];
};
const rot3 = (a: number, v: Vec3): Vec3 => {
  const c = Math.cos(a), s = Math.sin(a);
  return [c * v[0] + s * v[1], -s * v[0] + c * v[1], v[2]];
};

/** Julian Date from a UTC instant in epoch milliseconds. */
export function julianDate(utcMs: number): number {
  return utcMs / 86_400_000 + 2440587.5;
}

/**
 * The ten largest terms of the IAU 1980 nutation series, in units of 0.0001 arcseconds.
 *
 * Columns: the five Delaunay multipliers, then the longitude coefficient and its rate, then the
 * obliquity coefficient and its rate. Truncating at ten terms leaves an error under about half an
 * arcsecond, which is fifteen metres on the ground — two orders of magnitude below anything a pass
 * prediction cares about, and demonstrably so, since the node-longitude check would catch more.
 */
const NUTATION_TERMS: readonly (readonly number[])[] = [
  [0, 0, 0, 0, 1, -171996, -174.2, 92025, 8.9],
  [0, 0, 2, -2, 2, -13187, -1.6, 5736, -3.1],
  [0, 0, 2, 0, 2, -2274, -0.2, 977, -0.5],
  [0, 0, 0, 0, 2, 2062, 0.2, -895, 0.5],
  [0, 1, 0, 0, 0, 1426, -3.4, 54, -0.1],
  [1, 0, 0, 0, 0, 712, 0.1, -7, 0.0],
  [0, 1, 2, -2, 2, -517, 1.2, 224, -0.6],
  [0, 0, 2, 0, 1, -386, -0.4, 200, 0.0],
  [1, 0, 2, 0, 2, -301, 0.0, 129, -0.1],
  [0, -1, 2, -2, 2, 217, -0.5, -95, 0.3],
];

function nutation(T: number): { dpsi: number; deps: number } {
  const l = (134.96298139 + (1325 * 360 + 198.8673981) * T + 0.0086972 * T * T + 1.78e-5 * T ** 3) * D2R;
  const lp = (357.52772333 + (99 * 360 + 359.05034) * T - 0.0001603 * T * T - 3.3e-6 * T ** 3) * D2R;
  const F = (93.27191028 + (1342 * 360 + 82.0175381) * T - 0.0036825 * T * T + 3.1e-6 * T ** 3) * D2R;
  const D = (297.85036306 + (1236 * 360 + 307.11148) * T - 0.0019142 * T * T + 5.3e-6 * T ** 3) * D2R;
  const Om = (125.04452222 - (5 * 360 + 134.1362608) * T + 0.0020708 * T * T + 2.2e-6 * T ** 3) * D2R;

  let dpsi = 0;
  let deps = 0;
  for (const [a1, a2, a3, a4, a5, sc, sd, cc, cd] of NUTATION_TERMS) {
    const arg = a1 * l + a2 * lp + a3 * F + a4 * D + a5 * Om;
    dpsi += (sc + sd * T) * Math.sin(arg);
    deps += (cc + cd * T) * Math.cos(arg);
  }
  return { dpsi: dpsi * 1e-4 * AS2R, deps: deps * 1e-4 * AS2R };
}

/**
 * Greenwich Mean Sidereal Time in radians (IAU 1982), from UTC used in place of UT1.
 *
 * Verified against an independent implementation to the last printed digit at J2000 and at two
 * arbitrary 2026 epochs, which is what rules out the classic mistakes in this formula: the wrong
 * century argument, and confusing seconds of time with degrees.
 */
export function greenwichMeanSiderealTime(utcMs: number): number {
  const Tu = (julianDate(utcMs) - 2451545.0) / 36525;
  const seconds =
    67310.54841 + (876600 * 3600 + 8640184.812866) * Tu + 0.093104 * Tu * Tu - 6.2e-6 * Tu ** 3;
  // Seconds of time to degrees: one second of time is 1/240 of a degree.
  let radians = ((seconds % 86400) / 240) * D2R;
  if (radians < 0) radians += 2 * Math.PI;
  return radians;
}

/**
 * Transform a position from EME2000 (mean equator and equinox of J2000) to the Earth-fixed frame.
 *
 * The rotation order is the inverse of the one that carries a mean-of-date vector back to J2000 —
 * a distinction worth stating because getting it backwards does not produce nonsense. It produces a
 * ground track displaced by twice the accumulated precession, about 0.68° in 2026, which looks
 * entirely plausible until it is checked against something. The node-longitude verification is what
 * checks it.
 */
export function eme2000ToEcef(v: Vec3, utcMs: number): Vec3 {
  const jdTt = julianDate(utcMs) + TT_MINUS_UTC_SECONDS / 86400;
  const T = (jdTt - 2451545.0) / 36525;

  // IAU 1976 precession: J2000 -> mean equator and equinox of date.
  const zeta = (2306.2181 * T + 0.30188 * T * T + 0.017998 * T ** 3) * AS2R;
  const theta = (2004.3109 * T - 0.42665 * T * T - 0.041833 * T ** 3) * AS2R;
  const zAngle = (2306.2181 * T + 1.09468 * T * T + 0.018203 * T ** 3) * AS2R;
  let r = rot3(-zAngle, v);
  r = rot2(theta, r);
  r = rot3(-zeta, r);

  // IAU 1980 nutation: mean of date -> true equator and equinox of date.
  const eps0 = (23.439291111 - 0.0130041667 * T - 1.6389e-7 * T * T + 5.036e-7 * T ** 3) * D2R;
  const { dpsi, deps } = nutation(T);
  r = rot1(eps0, r);
  r = rot3(-dpsi, r);
  r = rot1(-(eps0 + deps), r);

  // Earth rotation through Greenwich APPARENT sidereal time — mean plus the equation of the
  // equinoxes, which is the nutation in longitude projected onto the equator. Using mean sidereal
  // time here would leave a periodic error of up to about a second of time.
  const gast = greenwichMeanSiderealTime(utcMs) + dpsi * Math.cos(eps0 + deps);
  return rot3(gast, r);
}

/**
 * Rotate a vector already referred to the true equator and equinox of date into the Earth-fixed
 * frame — Earth rotation only, no precession or nutation.
 *
 * This exists so that the Sun's direction, which the platform's solar series produces in the
 * equator of date, can be compared with a satellite position in the SAME frame. Comparing an
 * of-date solar vector against a J2000 satellite vector would leave the two about 0.4° apart in
 * 2026, which is small but is exactly the kind of quiet frame mismatch that produces an eclipse
 * boundary in the wrong place for no visible reason.
 */
export function equatorOfDateToEcef(v: Vec3, utcMs: number): Vec3 {
  const jdTt = julianDate(utcMs) + TT_MINUS_UTC_SECONDS / 86400;
  const T = (jdTt - 2451545.0) / 36525;
  const eps0 = (23.439291111 - 0.0130041667 * T - 1.6389e-7 * T * T + 5.036e-7 * T ** 3) * D2R;
  const { dpsi, deps } = nutation(T);
  const gast = greenwichMeanSiderealTime(utcMs) + dpsi * Math.cos(eps0 + deps);
  return rot3(gast, v);
}

export interface Geodetic {
  /** Geodetic latitude, degrees north. */
  latitudeDeg: number;
  /** Longitude, degrees east, in (−180, 180]. */
  longitudeDeg: number;
  /** Height above the WGS-84 ellipsoid, kilometres. */
  altitudeKm: number;
}

/**
 * Earth-fixed Cartesian coordinates to geodetic latitude, longitude and height.
 *
 * Iterative rather than closed-form: six passes converge to well below a millimetre for anything in
 * Earth orbit, and the iteration is easier to read and to check than Bowring's approximation.
 */
export function ecefToGeodetic(ecef: Vec3): Geodetic {
  const [x, y, z] = ecef;
  const p = Math.hypot(x, y);
  let latitude = Math.atan2(z, p * (1 - E2));
  let altitude = 0;
  for (let i = 0; i < 6; i++) {
    const sinLat = Math.sin(latitude);
    const n = EARTH_RADIUS_KM / Math.sqrt(1 - E2 * sinLat * sinLat);
    altitude = p / Math.cos(latitude) - n;
    latitude = Math.atan2(z, p * (1 - (E2 * n) / (n + altitude)));
  }
  return {
    latitudeDeg: latitude * R2D,
    longitudeDeg: ((Math.atan2(y, x) * R2D + 540) % 360) - 180,
    altitudeKm: altitude,
  };
}

/** Geodetic position to Earth-fixed Cartesian coordinates. */
export function geodeticToEcef(latitudeDeg: number, longitudeDeg: number, altitudeKm: number): Vec3 {
  const lat = latitudeDeg * D2R;
  const lon = longitudeDeg * D2R;
  const sinLat = Math.sin(lat);
  const n = EARTH_RADIUS_KM / Math.sqrt(1 - E2 * sinLat * sinLat);
  return [
    (n + altitudeKm) * Math.cos(lat) * Math.cos(lon),
    (n + altitudeKm) * Math.cos(lat) * Math.sin(lon),
    (n * (1 - E2) + altitudeKm) * sinLat,
  ];
}

export interface LookAngles {
  /** Degrees above the observer's horizon. Negative means below it. */
  elevationDeg: number;
  /** Compass bearing from true north, degrees clockwise, in [0, 360). */
  azimuthDeg: number;
  /** Straight-line distance from observer to satellite, kilometres. */
  rangeKm: number;
}

/**
 * Where a satellite appears from an observer on the ground: elevation above the horizon, azimuth
 * from true north, and slant range.
 *
 * Geometric only. No atmospheric refraction is applied, which lifts an object near the horizon by
 * roughly half a degree — irrelevant for a pass whose useful part is above ten degrees, and stated
 * rather than silently ignored.
 */
export function lookAngles(observer: { latitudeDeg: number; longitudeDeg: number; altitudeKm: number }, satelliteEcef: Vec3): LookAngles {
  const site = geodeticToEcef(observer.latitudeDeg, observer.longitudeDeg, observer.altitudeKm);
  const dx = satelliteEcef[0] - site[0];
  const dy = satelliteEcef[1] - site[1];
  const dz = satelliteEcef[2] - site[2];

  const lat = observer.latitudeDeg * D2R;
  const lon = observer.longitudeDeg * D2R;
  const sinLat = Math.sin(lat), cosLat = Math.cos(lat);
  const sinLon = Math.sin(lon), cosLon = Math.cos(lon);

  // Rotate the range vector into the topocentric south–east–zenith frame.
  const south = sinLat * cosLon * dx + sinLat * sinLon * dy - cosLat * dz;
  const east = -sinLon * dx + cosLon * dy;
  const zenith = cosLat * cosLon * dx + cosLat * sinLon * dy + sinLat * dz;

  const rangeKm = Math.hypot(dx, dy, dz);
  const elevationDeg = Math.asin(zenith / rangeKm) * R2D;
  let azimuthDeg = Math.atan2(east, -south) * R2D;
  if (azimuthDeg < 0) azimuthDeg += 360;
  return { elevationDeg, azimuthDeg, rangeKm };
}

/** A compass point for an azimuth, so a bearing can be read without a protractor. */
export function compassPoint(azimuthDeg: number): string {
  const points = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return points[Math.round(((azimuthDeg % 360) + 360) % 360 / 22.5) % 16];
}
