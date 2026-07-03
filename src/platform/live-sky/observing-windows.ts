import type { SunData, MoonPositionData, NightType } from "@/platform/live-sky/models";
import { localMinuteToUtcMs, type ResolvedLocation } from "@/platform/live-sky/location";

/**
 * Observing-window helpers (Program T). Pure, deterministic derivations from the
 * ALREADY-COMPUTED Sun and Moon engine outputs — no astronomy is recomputed here.
 * They classify the night and work out whether the Moon is up while the sky is
 * dark, which the dashboard uses for its darkness summary and moonlight rule.
 */

/** Astronomical night (Sun below −18°) shorter than this counts as a "short night". */
export const SHORT_NIGHT_MINUTES = 120;

export interface DarknessSummary {
  /** Minutes the Sun is below −18° (true astronomical darkness). */
  darknessMinutes: number;
  nightType: NightType;
  /** The astronomical-dark window as dusk → dawn (crosses midnight); null when there is none. */
  darknessWindow: { startIso: string; endIso: string } | null;
}

/**
 * Classify the night and its darkness. The night the dashboard shows is the
 * CONTINUOUS one that begins on this date's evening: astronomical dusk on date D
 * to astronomical dawn on date D+1 — so `sunNext` (the next day's Sun) supplies
 * the closing dawn. `darknessMinutes`/`nightType` come from date D's durations.
 */
export function darknessSummary(sun: SunData, sunNext: SunData | null): DarknessSummary {
  const d = sun.duration;
  const darknessMinutes = Math.max(
    0,
    Math.round(1440 - d.daylightMinutes - d.civilTwilightMinutes - d.nauticalTwilightMinutes - d.astronomicalTwilightMinutes),
  );
  let nightType: NightType;
  if (sun.status.includes("polar_day")) nightType = "polar_day";
  else if (sun.status.includes("polar_night")) nightType = "polar_night";
  else if (darknessMinutes <= 0) nightType = "no_darkness";
  else if (darknessMinutes < SHORT_NIGHT_MINUTES) nightType = "short_night";
  else nightType = "normal_night";

  const dusk = sun.events.astronomicalDusk.iso;
  const dawnNext = sunNext?.events.astronomicalDawn.iso ?? null;
  const darknessWindow = dusk && dawnNext && new Date(dawnNext).getTime() > new Date(dusk).getTime() ? { startIso: dusk, endIso: dawnNext } : null;
  return { darknessMinutes, nightType, darknessWindow };
}

type Interval = [number, number];

const ms = (iso: string | null): number | null => (iso ? new Date(iso).getTime() : null);

/** Overlap of two sets of intervals, in minutes. */
export function overlapMinutes(a: Interval[], b: Interval[]): number {
  let total = 0;
  for (const [as, ae] of a) {
    for (const [bs, be] of b) {
      const s = Math.max(as, bs);
      const e = Math.min(ae, be);
      if (e > s) total += (e - s) / 60_000;
    }
  }
  return total;
}

/** The intervals within the civil day during which the Moon is above the horizon. */
export function moonUpIntervals(moon: MoonPositionData, dayStartMs: number, dayEndMs: number): Interval[] {
  if (moon.horizon.alwaysAboveHorizon) return [[dayStartMs, dayEndMs]];
  if (moon.horizon.alwaysBelowHorizon) return [];
  const rise = ms(moon.events.moonrise.iso);
  const set = ms(moon.events.moonset.iso);
  if (rise !== null && set !== null) return rise < set ? [[rise, set]] : [[dayStartMs, set], [rise, dayEndMs]];
  if (rise !== null) return [[rise, dayEndMs]];
  if (set !== null) return [[dayStartMs, set]];
  return [];
}

export interface MoonDarkOverlap {
  /** Whether the Moon is above the horizon during any of the dusk→dawn dark window (null if not assessable). */
  moonUpDuringDark: boolean | null;
  /** Minutes of the dark window that are moonless (the Moon below the horizon). */
  moonlessDarkMinutes: number;
  /** Length of the dusk→dawn dark window (minutes). */
  darkWindowMinutes: number;
}

/**
 * How the Moon overlaps the CONTINUOUS dusk→dawn dark window (date D's dusk to
 * date D+1's dawn). Moon-up intervals are drawn from both date D's and date D+1's
 * Moon events so the overlap covers exactly the window the dashboard shows.
 */
export function moonDarkOverlap(
  sun: SunData,
  sunNext: SunData | null,
  moon: MoonPositionData,
  moonNext: MoonPositionData | null,
  loc: ResolvedLocation,
): MoonDarkOverlap {
  const dusk = ms(sun.events.astronomicalDusk.iso);
  const dawnNext = ms(sunNext?.events.astronomicalDawn.iso ?? null);
  if (dusk === null || dawnNext === null || dawnNext <= dusk) {
    return { moonUpDuringDark: null, moonlessDarkMinutes: 0, darkWindowMinutes: 0 };
  }
  const dark: Interval[] = [[dusk, dawnNext]];
  const dayStart = localMinuteToUtcMs(loc, 0);
  const dayEnd = localMinuteToUtcMs(loc, 1440); // == start of date D+1
  const up = moonUpIntervals(moon, dayStart, dayEnd);
  if (moonNext) up.push(...moonUpIntervals(moonNext, dayEnd, dayEnd + 86_400_000));
  const darkWindowMinutes = Math.round((dawnNext - dusk) / 60_000);
  const moonUpMinutes = overlapMinutes(up, dark);
  return {
    moonUpDuringDark: moonUpMinutes > 0,
    moonlessDarkMinutes: Math.max(0, Math.round(darkWindowMinutes - moonUpMinutes)),
    darkWindowMinutes,
  };
}
