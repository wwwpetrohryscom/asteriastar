/**
 * Pure projection helpers for the Sky Atlas (Program BO). These transform REAL celestial coordinates
 * (right ascension in degrees, declination in degrees) into SVG pixel coordinates. They compute
 * geometry only — they never invent a position. A star or object is passed in with its measured
 * coordinates and comes out as a point to plot.
 */

export interface SkyPoint {
  id: string;
  name: string;
  /** Right ascension in degrees [0, 360). */
  raDeg: number;
  /** Declination in degrees [-90, 90]. */
  decDeg: number;
  /** Apparent magnitude, if known (used only for dot size). */
  magnitude?: number;
  href?: string;
}

export interface PlottedPoint extends SkyPoint {
  x: number;
  y: number;
  r: number;
}

/** Right ascension in hours [0, 24) → degrees. */
export function raHoursToDeg(hours: number): number {
  return (hours * 15) % 360;
}

/**
 * Equirectangular all-sky projection. RA increases to the LEFT (the standard planetarium
 * convention, looking out at the sky); declination +90° at the top. Returns pixel coordinates in a
 * [0,width] × [0,height] box.
 */
export function projectEquirectangular(raDeg: number, decDeg: number, width: number, height: number): { x: number; y: number } {
  const raNorm = ((raDeg % 360) + 360) % 360;
  const decClamped = Math.max(-90, Math.min(90, decDeg));
  const x = (1 - raNorm / 360) * width;
  const y = (1 - (decClamped + 90) / 180) * height;
  return { x, y };
}

/**
 * Map an apparent magnitude to a dot radius: brighter stars (smaller magnitude) render larger.
 * Objects with no known magnitude get the minimum radius. Purely a visual scale, not a measurement.
 */
export function magnitudeToRadius(magnitude: number | undefined, minR = 0.5, maxR = 3.2, brightMag = -1.5, faintMag = 6.5): number {
  if (typeof magnitude !== "number" || !Number.isFinite(magnitude)) return minR;
  const t = (faintMag - magnitude) / (faintMag - brightMag); // 0 at faint, 1 at bright
  const clamped = Math.max(0, Math.min(1, t));
  return minR + clamped * (maxR - minR);
}

/** Project a batch of real sky points into plotted points for an equirectangular chart. */
export function plotEquirectangular(points: SkyPoint[], width: number, height: number, magR?: { minR?: number; maxR?: number }): PlottedPoint[] {
  return points
    .filter((p) => Number.isFinite(p.raDeg) && Number.isFinite(p.decDeg))
    .map((p) => {
      const { x, y } = projectEquirectangular(p.raDeg, p.decDeg, width, height);
      return { ...p, x, y, r: magnitudeToRadius(p.magnitude, magR?.minR, magR?.maxR) };
    });
}
