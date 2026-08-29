import { ecefToGeodetic, eme2000ToEcef, EARTH_RADIUS_KM, type Geodetic, type Vec3 } from "@/platform/satellites/frames";
import type { Ephemeris, StateVector } from "@/platform/satellites/oem";

/**
 * Working with an ephemeris: interpolating between its state vectors, and turning one into the
 * things an observer wants to know.
 *
 * The ephemeris is a table at four-minute spacing. The ISS moves about 1,840 km in four minutes, so
 * linear interpolation between neighbours would be wrong by tens of kilometres at mid-interval.
 * Lagrange interpolation over eight surrounding points reduces that to metres — and, importantly,
 * this is the method the CCSDS standard itself specifies for OEM consumers.
 *
 * Nothing here extrapolates. Asking for a time outside the file's span returns nothing at all,
 * because a trajectory beyond the end of the published ephemeris is a guess, and the station
 * manoeuvres.
 */

/** How many surrounding points the interpolation uses. Eight is the CCSDS-recommended order. */
const INTERPOLATION_POINTS = 8;

export interface SatelliteState {
  timeMs: number;
  /** Position in the ephemeris frame (EME2000), kilometres. */
  positionEci: Vec3;
  /** Velocity in the ephemeris frame, kilometres per second. */
  velocityEci: Vec3;
  /** Position in the Earth-fixed frame, kilometres. */
  positionEcef: Vec3;
  /** Sub-satellite point and height above the WGS-84 ellipsoid. */
  geodetic: Geodetic;
  /** Speed in the inertial frame, kilometres per second. */
  speedKmS: number;
  /** True when the state came from interpolation rather than sitting on a tabulated epoch. */
  interpolated: boolean;
}

function lagrange(states: StateVector[], timeMs: number): { position: Vec3; velocity: Vec3 } {
  const out: [number, number, number, number, number, number] = [0, 0, 0, 0, 0, 0];
  for (let m = 0; m < states.length; m++) {
    let weight = 1;
    for (let n = 0; n < states.length; n++) {
      if (n === m) continue;
      weight *= (timeMs - states[n].timeMs) / (states[m].timeMs - states[n].timeMs);
    }
    for (let c = 0; c < 3; c++) {
      out[c] += weight * states[m].position[c];
      out[c + 3] += weight * states[m].velocity[c];
    }
  }
  return { position: [out[0], out[1], out[2]], velocity: [out[3], out[4], out[5]] };
}

/**
 * The satellite's state at an instant, or null if the ephemeris does not cover it.
 *
 * Returning null rather than extrapolating is the point. The published span ends fifteen days out
 * and the station manoeuvres; a position computed past the end of the file would look exactly like
 * a real one.
 */
export function stateAt(ephemeris: Ephemeris, timeMs: number): SatelliteState | null {
  const { states } = ephemeris;
  if (timeMs < states[0].timeMs || timeMs > states[states.length - 1].timeMs) return null;

  // Binary search for the first tabulated epoch at or after the requested time.
  let lo = 0;
  let hi = states.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (states[mid].timeMs < timeMs) lo = mid + 1;
    else hi = mid;
  }

  const exact = states[lo].timeMs === timeMs;
  const window = Math.max(0, Math.min(lo - INTERPOLATION_POINTS / 2, states.length - INTERPOLATION_POINTS));
  const slice = states.slice(window, window + INTERPOLATION_POINTS);
  const { position, velocity } = exact
    ? { position: states[lo].position, velocity: states[lo].velocity }
    : lagrange(slice, timeMs);

  const positionEcef = eme2000ToEcef(position, timeMs);
  return {
    timeMs,
    positionEci: position,
    velocityEci: velocity,
    positionEcef,
    geodetic: ecefToGeodetic(positionEcef),
    speedKmS: Math.hypot(velocity[0], velocity[1], velocity[2]),
    interpolated: !exact,
  };
}

/**
 * The orbital period, derived from the ephemeris rather than assumed.
 *
 * Taken from the mean of the intervals between successive ascending-node crossings found by
 * scanning the tabulated states for a sign change in the z coordinate. That is the nodal period,
 * which is what "how long does one orbit take" means for a satellite in a non-spherical gravity
 * field — and it is measured from the data rather than computed from a textbook two-body formula
 * that would ignore the oblateness the station actually flies in.
 */
export function nodalPeriodMinutes(ephemeris: Ephemeris): number | undefined {
  const crossings: number[] = [];
  const { states } = ephemeris;
  for (let i = 1; i < states.length; i++) {
    const a = states[i - 1].position[2];
    const b = states[i].position[2];
    if (a < 0 && b >= 0) {
      // Linear interpolation of the crossing instant is ample: the interval is four minutes and the
      // z coordinate is very nearly linear across the equator.
      const f = -a / (b - a);
      crossings.push(states[i - 1].timeMs + f * (states[i].timeMs - states[i - 1].timeMs));
    }
  }
  if (crossings.length < 2) return undefined;
  const total = crossings[crossings.length - 1] - crossings[0];
  return total / (crossings.length - 1) / 60000;
}

export interface GroundTrackPoint {
  timeMs: number;
  latitudeDeg: number;
  longitudeDeg: number;
  altitudeKm: number;
}

/**
 * The sub-satellite path over a window, sampled at a fixed step.
 *
 * Points outside the ephemeris are omitted rather than extrapolated, so a track that runs off the
 * end of the published file simply stops — which is the truth about what is known.
 */
export function groundTrack(ephemeris: Ephemeris, fromMs: number, toMs: number, stepSeconds = 60): GroundTrackPoint[] {
  const out: GroundTrackPoint[] = [];
  for (let t = fromMs; t <= toMs; t += stepSeconds * 1000) {
    const s = stateAt(ephemeris, t);
    if (!s) continue;
    out.push({ timeMs: t, latitudeDeg: s.geodetic.latitudeDeg, longitudeDeg: s.geodetic.longitudeDeg, altitudeKm: s.geodetic.altitudeKm });
  }
  return out;
}

/**
 * The angular radius of Earth's shadow cone at the satellite's distance, used to decide whether the
 * satellite is in sunlight. A cylindrical shadow is assumed — the penumbra is ignored — which
 * shifts the entry and exit of eclipse by a few seconds. That is well inside the minute-level
 * granularity of a naked-eye pass prediction.
 */
export function isSunlit(satelliteEci: Vec3, sunDirectionEci: Vec3): boolean {
  const dot = satelliteEci[0] * sunDirectionEci[0] + satelliteEci[1] * sunDirectionEci[1] + satelliteEci[2] * sunDirectionEci[2];
  if (dot >= 0) return true; // sunward hemisphere: never in shadow
  const rMag = Math.hypot(satelliteEci[0], satelliteEci[1], satelliteEci[2]);
  // Perpendicular distance from the Earth–Sun line. Inside one Earth radius means eclipsed.
  const perpendicular = Math.sqrt(Math.max(0, rMag * rMag - dot * dot));
  return perpendicular > EARTH_RADIUS_KM;
}

/** How much of the published ephemeris is still ahead of a given moment, in hours. */
export function remainingCoverageHours(ephemeris: Ephemeris, nowMs: number): number {
  return Math.max(0, (ephemeris.states[ephemeris.states.length - 1].timeMs - nowMs) / 3_600_000);
}
