import { compassPoint, equatorOfDateToEcef, lookAngles, type LookAngles } from "@/platform/satellites/frames";
import { isSunlit, stateAt, type SatelliteState } from "@/platform/satellites/ephemeris";
import { solarDirectionEci } from "@/platform/live-sky/providers/solar-calculator";
import type { Ephemeris } from "@/platform/satellites/oem";

/**
 * Visible-pass prediction for an observer.
 *
 * A pass is only worth telling someone about if all three of these hold at once: the satellite is
 * above their horizon, the satellite is in sunlight, and their own sky is dark. The station is a
 * mirror — it is invisible in daylight because the sky outshines it, and invisible in Earth's
 * shadow because there is nothing to reflect. Predicting geometry alone would produce a list of
 * times when nothing can be seen, which is worse than no list.
 *
 * Everything here is deterministic geometry over a published ephemeris. Nothing is fetched, nothing
 * is stored, and the observer's coordinates are arguments to a pure function — on the passes page
 * this runs in the reader's own browser, so their location never leaves their device at all.
 *
 * What it deliberately does NOT model: the weather. A pass listed here is a pass that is
 * geometrically visible and astronomically dark. Whether anyone actually sees it depends on cloud,
 * and no cloud data is connected.
 */

export interface Observer {
  latitudeDeg: number;
  longitudeDeg: number;
  /** Height above the ellipsoid in kilometres. Zero is a fine default; it barely matters. */
  altitudeKm: number;
}

export interface PassSample extends LookAngles {
  timeMs: number;
  sunlit: boolean;
  /** The Sun's altitude at the observer, degrees. Negative is below the horizon. */
  sunElevationDeg: number;
}

export type PassVisibility =
  /** Sunlit satellite, dark sky: visible to the naked eye if the weather allows. */
  | "visible"
  /** Above the horizon and sunlit, but the observer's sky is too bright. */
  | "daylight"
  /** Above the horizon in a dark sky, but the satellite is in Earth's shadow. */
  | "eclipsed"
  /** Above the horizon, but neither sunlit nor in a dark sky. */
  | "not-visible";

export interface SatellitePass {
  startMs: number;
  peakMs: number;
  endMs: number;
  /** Highest elevation reached, degrees. */
  maxElevationDeg: number;
  /** Where it appears, and where it disappears. */
  riseAzimuthDeg: number;
  setAzimuthDeg: number;
  riseCompass: string;
  setCompass: string;
  peakAzimuthDeg: number;
  peakCompass: string;
  /** Closest approach to the observer during the pass, kilometres. */
  minRangeKm: number;
  visibility: PassVisibility;
  /** The window within the pass during which it is actually visible, when there is one. */
  visibleFromMs?: number;
  visibleToMs?: number;
  durationSeconds: number;
}

/**
 * The minimum elevation a pass must reach to be worth listing. Ten degrees is the conventional
 * threshold: below it, buildings, trees and haze make a sighting a matter of luck rather than
 * prediction, and reporting a two-degree maximum as a "pass" is a promise the geometry cannot keep.
 */
export const MINIMUM_PASS_ELEVATION_DEG = 10;

/**
 * How dark the observer's sky must be for a sunlit satellite to stand out. Civil twilight, the
 * Sun six degrees below the horizon, is the standard threshold for the brightest satellites.
 */
export const DARK_SKY_SUN_ELEVATION_DEG = -6;

/** Coarse scan step. Thirty seconds cannot miss a pass: the shortest are several minutes long. */
const SCAN_STEP_MS = 30_000;
/** Refinement step for rise, set and peak. */
const REFINE_STEP_MS = 2_000;

const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;

/** The Sun's altitude at an observer, from the same solar series the rest of the platform uses. */
function sunElevationDeg(observer: Observer, timeMs: number): number {
  const sunEcef = equatorOfDateToEcef(solarDirectionEci(timeMs), timeMs);
  const lat = observer.latitudeDeg * D2R;
  const lon = observer.longitudeDeg * D2R;
  // The observer's local zenith direction in the Earth-fixed frame.
  const zenith: [number, number, number] = [Math.cos(lat) * Math.cos(lon), Math.cos(lat) * Math.sin(lon), Math.sin(lat)];
  const dot = zenith[0] * sunEcef[0] + zenith[1] * sunEcef[1] + zenith[2] * sunEcef[2];
  return Math.asin(Math.max(-1, Math.min(1, dot))) * R2D;
}

/** One instant of a pass: where the satellite is in the sky, whether it is lit, how dark it is. */
export function sampleAt(ephemeris: Ephemeris, observer: Observer, timeMs: number): (PassSample & { state: SatelliteState }) | null {
  const state = stateAt(ephemeris, timeMs);
  if (!state) return null;
  const angles = lookAngles(observer, state.positionEcef);
  // Both vectors are carried into the Earth-fixed frame before they are compared, so the eclipse
  // test is not quietly mixing a J2000 satellite position with an of-date solar direction.
  const sunEcef = equatorOfDateToEcef(solarDirectionEci(timeMs), timeMs);
  return {
    ...angles,
    timeMs,
    sunlit: isSunlit(state.positionEcef, sunEcef),
    sunElevationDeg: sunElevationDeg(observer, timeMs),
    state,
  };
}

function classify(samples: PassSample[]): { visibility: PassVisibility; from?: number; to?: number } {
  const visible = samples.filter((s) => s.sunlit && s.sunElevationDeg <= DARK_SKY_SUN_ELEVATION_DEG);
  if (visible.length > 0) {
    return { visibility: "visible", from: visible[0].timeMs, to: visible[visible.length - 1].timeMs };
  }
  const anySunlit = samples.some((s) => s.sunlit);
  const anyDark = samples.some((s) => s.sunElevationDeg <= DARK_SKY_SUN_ELEVATION_DEG);
  if (anySunlit && !anyDark) return { visibility: "daylight" };
  if (anyDark && !anySunlit) return { visibility: "eclipsed" };
  return { visibility: "not-visible" };
}

/**
 * Find every pass above the elevation threshold in a window.
 *
 * Scans on a coarse grid, then refines each boundary. Returns nothing at all for a window the
 * ephemeris does not cover — no extrapolation, because the published trajectory ends and the
 * station manoeuvres.
 */
export function findPasses(
  ephemeris: Ephemeris,
  observer: Observer,
  fromMs: number,
  toMs: number,
  minimumElevationDeg = MINIMUM_PASS_ELEVATION_DEG,
): SatellitePass[] {
  const passes: SatellitePass[] = [];
  const lastCovered = ephemeris.states[ephemeris.states.length - 1].timeMs;
  const start = Math.max(fromMs, ephemeris.states[0].timeMs);
  const end = Math.min(toMs, lastCovered);
  if (end <= start) return passes;

  let current: PassSample[] | null = null;

  for (let t = start; t <= end; t += SCAN_STEP_MS) {
    const s = sampleAt(ephemeris, observer, t);
    if (!s) continue;
    const above = s.elevationDeg >= minimumElevationDeg;

    if (above) {
      if (!current) current = [];
      current.push(s);
      continue;
    }
    if (current) {
      passes.push(buildPass(ephemeris, observer, current, minimumElevationDeg));
      current = null;
    }
  }
  // A pass still in progress at the end of the window is only reported if the ephemeris ended too;
  // otherwise it is truncated by our own window and would understate its duration.
  if (current && end >= lastCovered) passes.push(buildPass(ephemeris, observer, current, minimumElevationDeg));
  return passes;
}

function buildPass(ephemeris: Ephemeris, observer: Observer, samples: PassSample[], minimumElevationDeg: number): SatellitePass {
  // Refine the rise and set boundaries, which the coarse scan bracketed to within one step.
  const refineBoundary = (aroundMs: number, direction: 1 | -1): PassSample => {
    let best = samples[direction === 1 ? 0 : samples.length - 1];
    for (let t = aroundMs; direction === 1 ? t < best.timeMs : t > best.timeMs; t += direction * REFINE_STEP_MS) {
      const s = sampleAt(ephemeris, observer, t);
      if (s && s.elevationDeg >= minimumElevationDeg) { best = s; break; }
    }
    return best;
  };

  const rise = refineBoundary(samples[0].timeMs - SCAN_STEP_MS, 1);
  const set = refineBoundary(samples[samples.length - 1].timeMs + SCAN_STEP_MS, -1);

  // Refine the peak on a fine grid around the coarse maximum.
  let peak = samples.reduce((a, b) => (b.elevationDeg > a.elevationDeg ? b : a));
  for (let t = peak.timeMs - SCAN_STEP_MS; t <= peak.timeMs + SCAN_STEP_MS; t += REFINE_STEP_MS) {
    const s = sampleAt(ephemeris, observer, t);
    if (s && s.elevationDeg > peak.elevationDeg) peak = s;
  }

  const all = [rise, ...samples, set];
  const { visibility, from, to } = classify(all);

  return {
    startMs: rise.timeMs,
    peakMs: peak.timeMs,
    endMs: set.timeMs,
    maxElevationDeg: peak.elevationDeg,
    riseAzimuthDeg: rise.azimuthDeg,
    setAzimuthDeg: set.azimuthDeg,
    riseCompass: compassPoint(rise.azimuthDeg),
    setCompass: compassPoint(set.azimuthDeg),
    peakAzimuthDeg: peak.azimuthDeg,
    peakCompass: compassPoint(peak.azimuthDeg),
    minRangeKm: Math.min(...all.map((s) => s.rangeKm)),
    visibility,
    visibleFromMs: from,
    visibleToMs: to,
    durationSeconds: Math.round((set.timeMs - rise.timeMs) / 1000),
  };
}

/**
 * Whether an observer's coordinates are usable. Explicit, bounded, and finite — there is no default
 * location anywhere in this program, and nothing is ever inferred from a request.
 */
export function validateObserver(latitudeDeg: unknown, longitudeDeg: unknown): { ok: true; observer: Observer } | { ok: false; problem: string } {
  const lat = typeof latitudeDeg === "number" ? latitudeDeg : Number(latitudeDeg);
  const lon = typeof longitudeDeg === "number" ? longitudeDeg : Number(longitudeDeg);
  if (!Number.isFinite(lat) || lat < -90 || lat > 90) return { ok: false, problem: "latitude must be a number between -90 and 90" };
  if (!Number.isFinite(lon) || lon < -180 || lon > 180) return { ok: false, problem: "longitude must be a number between -180 and 180" };
  return { ok: true, observer: { latitudeDeg: lat, longitudeDeg: lon, altitudeKm: 0 } };
}
