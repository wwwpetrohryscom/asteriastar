/**
 * Deterministic solar-position calculator (Program Q — Sun & Twilight v1).
 *
 * This is a COMPUTED provider, not a live network feed: it derives the Sun's
 * declination, the equation of time, and the hour angles for sunrise/sunset and
 * the three twilight bands from published, public-domain astronomical formulae.
 * It fetches nothing, scrapes nothing, uses no paid API, and takes no user
 * location beyond the explicit latitude/longitude passed in. Results are
 * labelled `method: "computed"`.
 *
 * Sources & methodology (public domain / open):
 *  - The NOAA Solar Calculator (NOAA Global Monitoring Laboratory,
 *    gml.noaa.gov/grad/solcalc) — the mean solar-longitude, mean-anomaly,
 *    equation-of-centre, obliquity, declination, and equation-of-time series
 *    used below are its published constants. NOAA documents the algorithm as the
 *    low-precision method of the Astronomical Almanac.
 *  - The Astronomical Almanac (US Naval Observatory / HM Nautical Almanac
 *    Office) — the authoritative published origin of those low-precision solar
 *    formulae, and the platform's designated authority for Sun/Moon rise-set.
 *  - Standard rise/set geometry: the sun sits at a given altitude h0 when its
 *    hour angle H satisfies cos H = (sin h0 − sinφ·sinδ) / (cosφ·cosδ).
 *
 * Accuracy: rise/set and twilight times are good to ~1 minute for years
 * 1901–2099 — ample for observing guidance. It is NOT a substitute for a full
 * ephemeris (JPL Horizons / USNO almanac) for high-precision work, and it models
 * the Sun's centre with a standard −0.833° horizon dip (34′ refraction + 16′
 * semidiameter); local refraction, horizon height, and terrain are not modelled.
 */

const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;
const sinD = (d: number): number => Math.sin(d * D2R);
const cosD = (d: number): number => Math.cos(d * D2R);
const tanD = (d: number): number => Math.tan(d * D2R);
const asinD = (x: number): number => Math.asin(x) * R2D;
const acosD = (x: number): number => Math.acos(x) * R2D;
const norm360 = (x: number): number => ((x % 360) + 360) % 360;

/** Standard altitude of the Sun's centre at the moments that define each event (degrees). */
export const SOLAR_ALTITUDES = {
  /** Sunrise / sunset: geometric horizon − 34′ refraction − 16′ semidiameter. */
  sunrise: -0.833,
  /** Civil twilight boundary. */
  civil: -6,
  /** Nautical twilight boundary. */
  nautical: -12,
  /** Astronomical twilight boundary. */
  astronomical: -18,
} as const;

export type SolarThreshold = keyof typeof SOLAR_ALTITUDES;

/** Julian Day at 00:00 UTC of a UTC calendar date. */
export function julianDayNumberUTC(year: number, month: number, day: number): number {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5;
}

/** Convert a Julian Day to the corresponding Unix epoch milliseconds (UTC). */
export function julianDayToUnixMs(jd: number): number {
  return (jd - 2440587.5) * 86_400_000;
}

interface SolarGeometry {
  /** The Sun's declination δ (degrees). */
  declinationDeg: number;
  /** The equation of time (minutes: apparent − mean solar time). */
  eqTimeMin: number;
}

/** The Sun's declination and equation of time for a Julian century (NOAA formulae). */
function solarGeometry(jc: number): SolarGeometry {
  const l0 = norm360(280.46646 + jc * (36000.76983 + jc * 0.0003032)); // geometric mean longitude
  const m = 357.52911 + jc * (35999.05029 - 0.0001537 * jc); // geometric mean anomaly
  const e = 0.016708634 - jc * (0.000042037 + 0.0000001267 * jc); // eccentricity of Earth's orbit
  const c =
    sinD(m) * (1.914602 - jc * (0.004817 + 0.000014 * jc)) +
    sinD(2 * m) * (0.019993 - 0.000101 * jc) +
    sinD(3 * m) * 0.000289; // equation of centre
  const trueLong = l0 + c;
  const omega = 125.04 - 1934.136 * jc;
  const appLong = trueLong - 0.00569 - 0.00478 * sinD(omega); // apparent longitude λ
  const eps0 = 23 + (26 + (21.448 - jc * (46.815 + jc * (0.00059 - jc * 0.001813))) / 60) / 60; // mean obliquity
  const eps = eps0 + 0.00256 * cosD(omega); // corrected obliquity
  const declinationDeg = asinD(sinD(eps) * sinD(appLong));
  const y = tanD(eps / 2) * tanD(eps / 2);
  const eqTimeMin =
    4 *
    R2D *
    (y * sinD(2 * l0) -
      2 * e * sinD(m) +
      4 * e * y * sinD(m) * cosD(2 * l0) -
      0.5 * y * y * sinD(4 * l0) -
      1.25 * e * e * sinD(2 * m));
  return { declinationDeg, eqTimeMin };
}

/**
 * cos(hour angle) for the Sun to sit at altitude `h0` at latitude `lat` and
 * declination `decl`. A value outside [−1, 1] means that altitude is never
 * reached that day: > 1 ⇒ the Sun never rises that high (stays below h0);
 * < −1 ⇒ the Sun never sinks that low (stays above h0).
 */
function cosHourAngle(h0: number, lat: number, decl: number): number {
  return (sinD(h0) - sinD(lat) * sinD(decl)) / (cosD(lat) * cosD(decl));
}

/** The hour-angle geometry for one altitude threshold. */
export interface ThresholdGeometry {
  /** cos(H) — outside [−1, 1] when the altitude is never crossed (see cosHourAngle). */
  cosHourAngle: number;
  /** Half the arc the Sun spends above the threshold, in minutes; null if never crossed. */
  halfDayMinutes: number | null;
}

/** The full solar geometry for one UTC date at one location. Pure and deterministic. */
export interface SolarDay {
  declinationDeg: number;
  eqTimeMin: number;
  /** Solar noon as minutes past 00:00 UTC on the date (the Sun on the observer's meridian). */
  solarNoonMinutesUTC: number;
  /** The Sun's altitude at solar noon (degrees). */
  noonElevationDeg: number;
  /** The Sun's altitude at solar midnight — its lowest of the day (degrees). */
  midnightElevationDeg: number;
  thresholds: Record<SolarThreshold, ThresholdGeometry>;
}

/**
 * Compute the solar geometry for a UTC date (its Julian Day at 00:00 UTC) and a
 * location. Longitude is east-positive. Pure and deterministic — the same inputs
 * always yield the same result; no fabricated values.
 */
export function computeSolarDay(jdMidnightUTC: number, latitude: number, longitude: number): SolarDay {
  // Evaluate the geometry at local solar noon for best accuracy (one refinement pass).
  let jc = (jdMidnightUTC - 2451545.0) / 36525.0;
  let geom = solarGeometry(jc);
  let solarNoonMinutesUTC = 720 - 4 * longitude - geom.eqTimeMin;
  jc = (jdMidnightUTC + solarNoonMinutesUTC / 1440 - 2451545.0) / 36525.0;
  geom = solarGeometry(jc);
  solarNoonMinutesUTC = 720 - 4 * longitude - geom.eqTimeMin;

  const decl = geom.declinationDeg;
  const noonElevationDeg = 90 - Math.abs(latitude - decl);
  const midnightElevationDeg = asinD(sinD(latitude) * sinD(decl) - cosD(latitude) * cosD(decl));

  const mk = (h0: number): ThresholdGeometry => {
    const c = cosHourAngle(h0, latitude, decl);
    const halfDayMinutes = c >= -1 && c <= 1 ? acosD(c) * 4 : null; // 1° of hour angle = 4 minutes
    return { cosHourAngle: c, halfDayMinutes };
  };

  return {
    declinationDeg: decl,
    eqTimeMin: geom.eqTimeMin,
    solarNoonMinutesUTC,
    noonElevationDeg,
    midnightElevationDeg,
    thresholds: {
      sunrise: mk(SOLAR_ALTITUDES.sunrise),
      civil: mk(SOLAR_ALTITUDES.civil),
      nautical: mk(SOLAR_ALTITUDES.nautical),
      astronomical: mk(SOLAR_ALTITUDES.astronomical),
    },
  };
}

/**
 * Minutes in the day the Sun spends ABOVE a threshold altitude. Handles the
 * polar cases honestly: if the threshold is never crossed, the Sun is either
 * above it all day (cos H < −1 ⇒ 1440) or below it all day (cos H > 1 ⇒ 0).
 */
export function minutesAboveThreshold(t: ThresholdGeometry): number {
  if (t.halfDayMinutes != null) return 2 * t.halfDayMinutes;
  return t.cosHourAngle < -1 ? 1440 : 0;
}
