import type { PlanetVisibilityEntry, MoonlightImpact } from "@/platform/live-sky/models";

/**
 * Observability scoring (Program T). Deterministic, fully documented, and
 * conservative. It ranks how favourably a planet is placed tonight from the
 * ALREADY-COMPUTED planet engine outputs — nothing is recomputed. It is
 * COMPUTED GUIDANCE, not a guarantee, and it deliberately does NOT include
 * weather, cloud cover, seeing, atmospheric transparency, or light pollution.
 */

/** Weights over the three observing factors (sum = 1). No hidden factors. */
export const SCORE_WEIGHTS = { altitude: 0.5, brightness: 0.3, elongation: 0.2 } as const;
/** Altitude (deg) at which the altitude factor saturates to 1. */
export const IDEAL_ALTITUDE_DEG = 60;
/** Magnitude at/above which the brightness factor is 0, and at/below which it is 1. */
export const FAINTEST_MAG = 3;
export const BRIGHTEST_MAG = -5;
/** Sun elongation (deg) at which the elongation factor saturates to 1. */
export const IDEAL_ELONGATION_DEG = 90;

const clamp01 = (x: number): number => Math.max(0, Math.min(1, x));

/**
 * A 0–100 observability score for a planet, or null if it is not visible tonight
 * (or never rises into the dark). Higher is better placed. See SCORE_WEIGHTS.
 */
export function planetObservabilityScore(p: PlanetVisibilityEntry): number | null {
  if (!p.visibility.visibleTonight || p.visibility.bestAltitudeDeg === null) return null;
  const altitude = clamp01(p.visibility.bestAltitudeDeg / IDEAL_ALTITUDE_DEG);
  const brightness = clamp01((FAINTEST_MAG - p.position.apparentMagnitude) / (FAINTEST_MAG - BRIGHTEST_MAG));
  const elongation = clamp01(p.position.elongationDeg / IDEAL_ELONGATION_DEG);
  return Math.round(100 * (SCORE_WEIGHTS.altitude * altitude + SCORE_WEIGHTS.brightness * brightness + SCORE_WEIGHTS.elongation * elongation));
}

/** Illumination below this adds little sky brightness regardless of the Moon's position. */
export const MOONLIGHT_LOW_ILLUM = 35;
/** Illumination above this washes out faint targets when the Moon is up in the dark. */
export const MOONLIGHT_HIGH_ILLUM = 70;

/**
 * How much the Moon brightens the sky during the dark window. `unknown` when it
 * cannot be assessed (e.g. there is no astronomical-dark window to assess against).
 */
export function moonlightImpact(illuminationPercent: number, moonUpDuringDark: boolean | null): MoonlightImpact {
  if (moonUpDuringDark === null) return "unknown";
  if (illuminationPercent < MOONLIGHT_LOW_ILLUM) return "low";
  if (!moonUpDuringDark) return "low"; // a bright Moon that is below the horizon adds no light
  if (illuminationPercent > MOONLIGHT_HIGH_ILLUM) return "high";
  return "moderate";
}
