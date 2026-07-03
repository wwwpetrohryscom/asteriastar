import { julianDay } from "@/platform/live-sky/providers/computed-moon";
import { greenwichMeanSiderealTimeDeg } from "@/platform/live-sky/providers/lunar-position";

/**
 * Deterministic planetary-position calculator (Program S — Planet Visibility &
 * Rise/Set v1).
 *
 * A COMPUTED provider, not a live feed: it derives each planet's geocentric
 * position, elongation from the Sun, and an approximate apparent magnitude from
 * published, public-domain orbital elements. It fetches nothing, scrapes nothing,
 * and uses no paid API. Results are labelled `method: "computed"`.
 *
 * Sources & methodology (public domain / open):
 *  - Keplerian orbital elements and their per-century rates: NASA/JPL "Approximate
 *    Positions of the Planets" (Standish; ssd.jpl.nasa.gov/planets/approx_pos.html),
 *    the table valid for 1800–2050 AD — a US-government public-domain dataset.
 *  - Standard two-body Kepler solution and the ecliptic→equatorial rotation, as in
 *    the Astronomical Almanac and, as a methodology reference, Jean Meeus,
 *    "Astronomical Algorithms" (no copyrighted text is reproduced).
 *  - Approximate visual-magnitude coefficients: the standard H(1,0) + phase terms
 *    of the Astronomical Almanac (public-domain physical quantities).
 *
 * Accuracy: geocentric position ~a few arcminutes to ~0.1° over 1800–2050
 * (validated against Meeus's worked example and the 2025 elongations); magnitude
 * ~±0.3–0.5 (Saturn excludes ring tilt). Ample for observing guidance — NOT for
 * high-precision astrometry, occultations, or spacecraft navigation.
 */

const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;
const norm360 = (x: number): number => ((x % 360) + 360) % 360;
const norm180 = (x: number): number => norm360(x + 180) - 180;
const clamp1 = (x: number): number => Math.max(-1, Math.min(1, x));

/** Obliquity of the ecliptic at J2000.0 (degrees). */
const OBLIQUITY = 23.43928;

export type PlanetKey = "mercury" | "venus" | "mars" | "jupiter" | "saturn" | "uranus" | "neptune";

/** JPL approximate elements 1800–2050: [a, ȧ, e, ė, I, İ, L, L̇, ϖ, ϖ̇, Ω, Ω̇] (AU, deg, deg/century). */
const ELEMENTS: Record<PlanetKey | "earth", number[]> = {
  mercury: [0.38709927, 0.00000037, 0.20563593, 0.00001906, 7.00497902, -0.00594749, 252.2503235, 149472.67411175, 77.45779628, 0.16047689, 48.33076593, -0.12534081],
  venus: [0.72333566, 0.0000039, 0.00677672, -0.00004107, 3.39467605, -0.0007889, 181.9790995, 58517.81538729, 131.60246718, 0.00268329, 76.67984255, -0.27769418],
  earth: [1.00000261, 0.00000562, 0.01671123, -0.00004392, -0.00001531, -0.01294668, 100.46457166, 35999.37244981, 102.93768193, 0.32327364, 0.0, 0.0],
  mars: [1.52371034, 0.00001847, 0.0933941, 0.00007882, 1.84969142, -0.00813131, -4.55343205, 19140.30268499, -23.94362959, 0.44441088, 49.55953891, -0.29257343],
  jupiter: [5.202887, -0.00011607, 0.04838624, -0.00013253, 1.30439695, -0.00183714, 34.39644051, 3034.74612775, 14.72847983, 0.21252668, 100.47390909, 0.20469106],
  saturn: [9.53667594, -0.0012506, 0.05386179, -0.00050991, 2.48599187, 0.00193609, 49.95424423, 1222.49362201, 92.59887831, -0.41897216, 113.66242448, -0.28867794],
  uranus: [19.18916464, -0.00196176, 0.04725744, -0.00004397, 0.77263783, -0.00242939, 313.23810451, 428.48202785, 170.9542763, 0.40805281, 74.01692503, 0.04240589],
  neptune: [30.06992276, 0.00026291, 0.00859048, 0.00005105, 1.77004347, 0.00035372, -55.12002969, 218.45945325, 44.96476227, -0.32241464, 131.78422574, -0.00508664],
};

/** Approximate visual-magnitude coefficients: [H(1,0), c1·α, c2·α², c3·α³] (Astronomical Almanac). */
const MAGNITUDE: Record<PlanetKey, [number, number, number, number]> = {
  mercury: [-0.42, 0.038, -0.000273, 0.000002],
  venus: [-4.4, 0.0009, 0.000239, -0.00000065],
  mars: [-1.52, 0.016, 0, 0],
  jupiter: [-9.4, 0.005, 0, 0],
  saturn: [-8.88, 0, 0, 0], // ring tilt not modelled → rougher
  uranus: [-7.19, 0, 0, 0],
  neptune: [-6.87, 0, 0, 0],
};

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

/** Heliocentric ecliptic rectangular coordinates (AU) of a body at Julian century T. */
function heliocentric(body: PlanetKey | "earth", jc: number): Vec3 {
  const e = ELEMENTS[body];
  const a = e[0] + e[1] * jc;
  const ecc = e[2] + e[3] * jc;
  const inc = (e[4] + e[5] * jc) * D2R;
  const meanLong = e[6] + e[7] * jc;
  const longPeri = e[8] + e[9] * jc;
  const node = (e[10] + e[11] * jc) * D2R;
  const argPeri = longPeri * D2R - node;

  const m = norm180(meanLong - longPeri) * D2R;
  let ea = m + ecc * Math.sin(m);
  for (let i = 0; i < 12; i++) {
    const d = (ea - ecc * Math.sin(ea) - m) / (1 - ecc * Math.cos(ea));
    ea -= d;
    if (Math.abs(d) < 1e-10) break;
  }
  const xp = a * (Math.cos(ea) - ecc);
  const yp = a * Math.sqrt(1 - ecc * ecc) * Math.sin(ea);

  const cw = Math.cos(argPeri);
  const sw = Math.sin(argPeri);
  const cO = Math.cos(node);
  const sO = Math.sin(node);
  const ci = Math.cos(inc);
  const si = Math.sin(inc);
  return {
    x: (cw * cO - sw * sO * ci) * xp + (-sw * cO - cw * sO * ci) * yp,
    y: (cw * sO + sw * cO * ci) * xp + (-sw * sO + cw * cO * ci) * yp,
    z: sw * si * xp + cw * si * yp,
  };
}

export interface EquatorialPosition {
  rightAscensionDeg: number;
  declinationDeg: number;
  /** Geocentric distance (AU). */
  distanceAu: number;
}

function eclipticToEquatorial(x: number, y: number, z: number): { ra: number; dec: number; dist: number } {
  const eps = OBLIQUITY * D2R;
  const xe = x;
  const ye = y * Math.cos(eps) - z * Math.sin(eps);
  const ze = y * Math.sin(eps) + z * Math.cos(eps);
  const ra = norm360(Math.atan2(ye, xe) * R2D);
  const dec = Math.atan2(ze, Math.sqrt(xe * xe + ye * ye)) * R2D;
  const dist = Math.sqrt(x * x + y * y + z * z);
  return { ra, dec, dist };
}

/** The Sun's geocentric equatorial position (from the negated Earth vector). */
export function sunGeocentric(at: Date): EquatorialPosition {
  const jc = (julianDay(at) - 2451545.0) / 36525;
  const earth = heliocentric("earth", jc);
  const { ra, dec, dist } = eclipticToEquatorial(-earth.x, -earth.y, -earth.z);
  return { rightAscensionDeg: ra, declinationDeg: dec, distanceAu: dist };
}

export interface PlanetPosition extends EquatorialPosition {
  /** Heliocentric distance (AU). */
  heliocentricAu: number;
  /** Sun–planet elongation as seen from Earth (degrees). */
  elongationDeg: number;
  /** Phase angle at the planet (Sun–planet–Earth, degrees). */
  phaseAngleDeg: number;
  /** Approximate apparent visual magnitude. */
  apparentMagnitude: number;
}

/** A planet's geocentric equatorial position, elongation, and approximate magnitude. */
export function planetGeocentric(planet: PlanetKey, at: Date): PlanetPosition {
  const jc = (julianDay(at) - 2451545.0) / 36525;
  const pl = heliocentric(planet, jc);
  const earth = heliocentric("earth", jc);
  const gx = pl.x - earth.x;
  const gy = pl.y - earth.y;
  const gz = pl.z - earth.z;
  const { ra, dec, dist } = eclipticToEquatorial(gx, gy, gz);

  const helio = Math.sqrt(pl.x * pl.x + pl.y * pl.y + pl.z * pl.z);
  const sunDist = Math.sqrt(earth.x * earth.x + earth.y * earth.y + earth.z * earth.z);
  // Elongation: angle at Earth between the planet and the Sun (Sun geocentric = −earth).
  const dot = (gx * -earth.x + gy * -earth.y + gz * -earth.z) / (dist * sunDist);
  const elongationDeg = Math.acos(clamp1(dot)) * R2D;
  // Phase angle at the planet.
  const cosPhase = (helio * helio + dist * dist - sunDist * sunDist) / (2 * helio * dist);
  const phaseAngleDeg = Math.acos(clamp1(cosPhase)) * R2D;

  const [h0, c1, c2, c3] = MAGNITUDE[planet];
  const a = phaseAngleDeg;
  const apparentMagnitude = h0 + 5 * Math.log10(helio * dist) + c1 * a + c2 * a * a + c3 * a * a * a;

  return {
    rightAscensionDeg: ra,
    declinationDeg: dec,
    distanceAu: dist,
    heliocentricAu: helio,
    elongationDeg,
    phaseAngleDeg,
    apparentMagnitude,
  };
}

export interface HorizontalPosition {
  altitudeDeg: number;
  /** Azimuth from north, increasing eastward (0 = N, 90 = E, 180 = S, 270 = W). */
  azimuthDeg: number;
  hourAngleDeg: number;
}

/**
 * Convert an equatorial position (RA, Dec) to the observer's altitude/azimuth at
 * an instant. Shared by the planets and the Sun; parallax is negligible at
 * planetary distances, so no topocentric correction is applied.
 */
export function equatorialToHorizontal(raDeg: number, decDeg: number, latitude: number, longitude: number, at: Date): HorizontalPosition {
  const lst = norm360(greenwichMeanSiderealTimeDeg(at) + longitude);
  const hourAngleDeg = norm180(lst - raDeg);
  const ha = hourAngleDeg * D2R;
  const dec = decDeg * D2R;
  const lat = latitude * D2R;
  const altitudeDeg = Math.asin(clamp1(Math.sin(lat) * Math.sin(dec) + Math.cos(lat) * Math.cos(dec) * Math.cos(ha))) * R2D;
  const azimuthDeg = norm360(Math.atan2(-Math.cos(dec) * Math.sin(ha), Math.sin(dec) * Math.cos(lat) - Math.cos(dec) * Math.sin(lat) * Math.cos(ha)) * R2D);
  return { altitudeDeg, azimuthDeg, hourAngleDeg };
}

/** The standard altitude of a point source (planet) at rise/set: −34′ refraction. */
export const PLANET_RISE_ALTITUDE = -0.5667;

export const NAKED_EYE_PLANET_KEYS: PlanetKey[] = ["mercury", "venus", "mars", "jupiter", "saturn"];
export const ALL_PLANET_KEYS: PlanetKey[] = ["mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune"];
