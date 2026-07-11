/**
 * Raw JPL SBDB snapshot row for one small body, transcribed verbatim. Every orbital
 * element carries its own uncertainty (sigma) and shares the body's osculating epoch;
 * `null` means SBDB had no value. Values are numbers parsed from SBDB's decimal strings.
 */

export interface SbdbValue {
  value: number;
  sigma: number | null;
  unit: string | null;
}

export interface SbdbRow {
  key: string; // the sstr queried, e.g. "4", "67P", "C/1995 O1"
  bodyId: string; // our catalogue entity id
  kind: string; // "asteroid" | "comet" | ...
  fullname: string;
  spkid: string | null;
  neo: boolean | null;
  pha: boolean | null;
  orbitClassCode: string | null;
  orbitClassName: string | null;
  /** Osculating epoch of the orbit solution (Julian Date, TDB). */
  epochJd: number | null;
  moidAu: number | null;
  conditionCode: string | null;
  dataArcDays: number | null;
  nObsUsed: number | null;
  producer: string | null;
  /** Orbital elements (heliocentric ecliptic J2000). `ad` (aphelion) is absent for unbound orbits. */
  a: SbdbValue | null; // semi-major axis (au) — NEGATIVE for hyperbolic orbits
  e: SbdbValue | null; // eccentricity — ≥ 1 for hyperbolic
  i: SbdbValue | null; // inclination (deg)
  om: SbdbValue | null; // longitude of ascending node (deg)
  w: SbdbValue | null; // argument of perihelion (deg)
  ma: SbdbValue | null; // mean anomaly (deg)
  q: SbdbValue | null; // perihelion distance (au)
  ad: SbdbValue | null; // aphelion distance (au)
  per: SbdbValue | null; // sidereal orbital period (days)
  tp: SbdbValue | null; // time of perihelion passage (JD, TDB)
  /** Physical parameters. */
  H: SbdbValue | null; // absolute magnitude
  albedo: SbdbValue | null;
  diameter: SbdbValue | null; // km
  rotPer: SbdbValue | null; // h
  density: SbdbValue | null; // g/cm^3
}
