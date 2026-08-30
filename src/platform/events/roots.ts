import { norm180 } from "@/platform/events/frames";

/**
 * Finding the instants at which an astronomical event happens.
 *
 * Almost every event in this module is one of two questions about a smooth function of time: when
 * does this angle reach a particular value (a phase, an equinox, an opposition), or when is this
 * quantity largest or smallest (an apsis, a greatest elongation, a closest approach). So there are
 * two finders, and every event family is expressed through them rather than through a closed-form
 * approximation of its own. One implementation to check, and the underlying position series stay the
 * single source of truth for where the bodies actually are.
 *
 * Both finders scan a window at a coarse step before refining. The step matters and is chosen per
 * caller: a scan that steps over a whole feature does not find it, and no amount of refinement
 * afterwards recovers an event the scan never saw. Nothing here extrapolates beyond the window it is
 * given.
 */

/** How many bisection halvings to apply. 52 takes any window under a century below a millisecond. */
const BISECTION_STEPS = 52;

/**
 * The largest jump in the wrapped difference that is treated as a real crossing rather than the
 * function passing through the ±180° branch cut. A genuine crossing between two scan samples changes
 * the difference by roughly the body's motion over one step; a branch-cut wrap changes it by ~360°.
 */
const MAX_STEP_JUMP_DEG = 170;

/**
 * Every instant in `[fromMs, toMs]` at which the angle `f` passes through `targetDeg`.
 *
 * `f` returns degrees in [0, 360); the comparison is made on the wrapped difference so that a target
 * of 0° is found exactly as reliably as one of 180°. Samples whose difference jumps nearly the whole
 * circle between neighbours are refused rather than bisected: that is the wrap in the representation,
 * not a crossing of the angle, and bisecting it would invent an event with a plausible-looking time.
 */
export function findCrossings(
  f: (timeMs: number) => number,
  targetDeg: number,
  fromMs: number,
  toMs: number,
  stepMs: number,
): number[] {
  const g = (t: number): number => norm180(f(t) - targetDeg);
  const out: number[] = [];
  let previousTime = fromMs;
  let previous = g(fromMs);

  for (let t = fromMs + stepMs; t <= toMs + stepMs; t += stepMs) {
    const now = Math.min(t, toMs);
    const value = g(now);
    if (previous === 0) out.push(previousTime);
    else if (previous * value < 0 && Math.abs(value - previous) < MAX_STEP_JUMP_DEG) {
      let lo = previousTime;
      let hi = now;
      let loValue = previous;
      for (let i = 0; i < BISECTION_STEPS; i++) {
        const mid = (lo + hi) / 2;
        const midValue = g(mid);
        if (loValue * midValue <= 0) hi = mid;
        else { lo = mid; loValue = midValue; }
      }
      out.push((lo + hi) / 2);
    }
    previousTime = now;
    previous = value;
    if (now >= toMs) break;
  }
  return out;
}

export interface Extremum {
  timeMs: number;
  value: number;
}

/**
 * Every local maximum (or minimum) of `f` strictly inside `[fromMs, toMs]`.
 *
 * Located as a sign change of the DERIVATIVE, not by searching for the largest sampled value. That
 * distinction matters for the flat features, which are most of them: Earth's distance from the Sun
 * changes by about thirty parts per billion an hour near aphelion, and a direct search on a curve
 * that flat is dominated by whatever the series happens to be doing. The derivative crosses zero
 * cleanly and linearly, so bisecting it is well conditioned even where the function itself is not.
 *
 * The derivative is a central difference over a quarter of the scan step. A feature at the very edge
 * of the window is not reported: with samples on only one side there is no way to tell a turning
 * point from the scan running out, and a "closest approach" that is really the edge of the search
 * window is a fabricated event. Callers that need events near a boundary widen the window.
 */
export function findExtrema(
  f: (timeMs: number) => number,
  fromMs: number,
  toMs: number,
  stepMs: number,
  kind: "maximum" | "minimum",
): Extremum[] {
  const h = Math.max(60_000, Math.round(stepMs / 4));
  const slope = (t: number): number => f(t + h) - f(t - h);
  const out: Extremum[] = [];

  let previousTime = fromMs + h;
  let previous = slope(previousTime);
  for (let t = previousTime + stepMs; t <= toMs - h; t += stepMs) {
    const value = slope(t);
    // A maximum is the derivative falling through zero; a minimum is it rising through zero.
    const isWanted = kind === "maximum" ? previous > 0 && value < 0 : previous < 0 && value > 0;
    if (isWanted) {
      let lo = previousTime;
      let hi = t;
      let loSlope = previous;
      for (let i = 0; i < BISECTION_STEPS && hi - lo > 1; i++) {
        const mid = (lo + hi) / 2;
        const midSlope = slope(mid);
        if (loSlope * midSlope <= 0) hi = mid;
        else { lo = mid; loSlope = midSlope; }
      }
      const timeMs = (lo + hi) / 2;
      out.push({ timeMs, value: f(timeMs) });
    }
    previousTime = t;
    previous = value;
  }
  return out;
}
