import { moonTopocentric, MOON_RISE_ALTITUDE } from "@/platform/live-sky/providers/lunar-position";
import { localMinuteToUtcMs, type ResolvedLocation } from "@/platform/live-sky/location";

/**
 * Moonrise / moonset / transit finder (Program R). It samples the Moon's
 * topocentric altitude and hour angle across the requested LOCAL civil day and
 * finds the horizon crossings and the meridian transits. Because the Moon moves
 * quickly, a closed-form hour-angle solution (as used for the Sun) is not
 * accurate, so we sample and refine. Every edge case is reported honestly: an
 * event that does not occur IN the local day — including a transit whose
 * culmination falls outside the day — is null, and the horizon flags say why. No
 * value is ever faked.
 */

const SAMPLE_STEP_MIN = 10;
const round = (x: number, dp: number): number => Math.round(x * 10 ** dp) / 10 ** dp;
const norm180 = (x: number): number => ((((x + 180) % 360) + 360) % 360) - 180;

const altitudeAt = (utcMs: number, lat: number, lon: number): number => moonTopocentric(new Date(utcMs), lat, lon).altitudeDeg;

/** Bisection refine of a horizon crossing between two straddling UTC instants (to ~1 s). */
function refineCrossing(loMs: number, hiMs: number, lat: number, lon: number): number {
  let lo = loMs;
  let hi = hiMs;
  const fLo = altitudeAt(lo, lat, lon) - MOON_RISE_ALTITUDE;
  for (let i = 0; i < 22; i++) {
    const mid = (lo + hi) / 2;
    if (hi - lo < 500) return mid;
    const fMid = altitudeAt(mid, lat, lon) - MOON_RISE_ALTITUDE;
    if (Math.sign(fMid) === Math.sign(fLo)) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/** Bisection refine of the upper transit (hour angle ascends through 0) between two instants. */
function refineUpperTransit(loMs: number, hiMs: number, lat: number, lon: number): number {
  let lo = loMs;
  let hi = hiMs;
  for (let i = 0; i < 22; i++) {
    const mid = (lo + hi) / 2;
    if (hi - lo < 500) return mid;
    if (moonTopocentric(new Date(mid), lat, lon).hourAngleDeg < 0) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/** Bisection refine of the lower transit (hour angle passes through ±180) between two instants. */
function refineLowerTransit(loMs: number, hiMs: number, lat: number, lon: number): number {
  let lo = loMs;
  let hi = hiMs;
  const unwrapped = (ms: number): number => {
    const h = moonTopocentric(new Date(ms), lat, lon).hourAngleDeg;
    return h < 0 ? h + 360 : h; // map the ±180 neighbourhood to a monotonic ~[170,190]
  };
  for (let i = 0; i < 22; i++) {
    const mid = (lo + hi) / 2;
    if (hi - lo < 500) return mid;
    if (unwrapped(mid) < 180) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

export interface LunarDayEvents {
  moonriseUtcMs: number | null;
  riseAzimuthDeg: number | null;
  moonsetUtcMs: number | null;
  setAzimuthDeg: number | null;
  transitUtcMs: number | null;
  transitAltitudeDeg: number | null;
  lowerTransitUtcMs: number | null;
  alwaysAbove: boolean;
  alwaysBelow: boolean;
  noMoonrise: boolean;
  noMoonset: boolean;
  /** True when the Moon rises or sets more than once on this local date (only the first of each is reported). */
  multipleEventsSameDay: boolean;
}

/**
 * Find the Moon's rise, set, upper transit, and lower transit for the resolved
 * LOCAL civil date at the resolved location. Deterministic and pure. Rise/set use
 * the first crossing of each kind (the calendar-day convention); a second
 * crossing of either kind is flagged rather than silently dropped. A transit is
 * reported only when its meridian passage genuinely falls inside the local day.
 */
export function computeLunarDay(loc: ResolvedLocation): LunarDayEvents {
  const { latitude, longitude } = loc;

  // Sample the whole local day INCLUSIVE of both endpoints (00:00 and 24:00).
  const samples: { ms: number; alt: number; ha: number }[] = [];
  for (let m = 0; m <= 1440; m += SAMPLE_STEP_MIN) {
    const ms = localMinuteToUtcMs(loc, m);
    const t = moonTopocentric(new Date(ms), latitude, longitude);
    samples.push({ ms, alt: t.altitudeDeg, ha: t.hourAngleDeg });
  }

  let anyAbove = false;
  let anyBelow = false;
  for (const s of samples) {
    if (s.alt > MOON_RISE_ALTITUDE) anyAbove = true;
    else anyBelow = true;
  }

  let moonriseUtcMs: number | null = null;
  let moonsetUtcMs: number | null = null;
  let riseAzimuthDeg: number | null = null;
  let setAzimuthDeg: number | null = null;
  let riseCount = 0;
  let setCount = 0;
  let transitUtcMs: number | null = null;
  let transitAltitudeDeg: number | null = null;
  let lowerTransitUtcMs: number | null = null;

  for (let i = 1; i < samples.length; i++) {
    const a = samples[i - 1];
    const b = samples[i];
    const relA = a.alt - MOON_RISE_ALTITUDE;
    const relB = b.alt - MOON_RISE_ALTITUDE;

    // Moonrise: altitude ascends through the threshold.
    if (relA < 0 && relB >= 0) {
      riseCount++;
      if (moonriseUtcMs === null) {
        moonriseUtcMs = refineCrossing(a.ms, b.ms, latitude, longitude);
        riseAzimuthDeg = round(moonTopocentric(new Date(moonriseUtcMs), latitude, longitude).azimuthDeg, 1);
      }
    }
    // Moonset: altitude descends through the threshold.
    if (relA >= 0 && relB < 0) {
      setCount++;
      if (moonsetUtcMs === null) {
        moonsetUtcMs = refineCrossing(a.ms, b.ms, latitude, longitude);
        setAzimuthDeg = round(moonTopocentric(new Date(moonsetUtcMs), latitude, longitude).azimuthDeg, 1);
      }
    }
    // Upper transit: hour angle ascends through 0 (east → west), a small step (not a ±180 wrap).
    if (transitUtcMs === null && a.ha < 0 && b.ha >= 0 && b.ha - a.ha < 180) {
      transitUtcMs = refineUpperTransit(a.ms, b.ms, latitude, longitude);
      transitAltitudeDeg = round(moonTopocentric(new Date(transitUtcMs), latitude, longitude).altitudeDeg, 1);
    }
    // Lower transit: hour angle wraps through ±180 (|Δ| > 180 between adjacent samples).
    if (lowerTransitUtcMs === null && Math.abs(norm180(b.ha) - norm180(a.ha)) > 180) {
      lowerTransitUtcMs = refineLowerTransit(a.ms, b.ms, latitude, longitude);
    }
  }

  const alwaysAbove = anyAbove && !anyBelow;
  const alwaysBelow = anyBelow && !anyAbove;
  return {
    moonriseUtcMs,
    riseAzimuthDeg,
    moonsetUtcMs,
    setAzimuthDeg,
    transitUtcMs,
    transitAltitudeDeg,
    lowerTransitUtcMs,
    alwaysAbove,
    alwaysBelow,
    noMoonrise: moonriseUtcMs === null,
    noMoonset: moonsetUtcMs === null,
    multipleEventsSameDay: riseCount > 1 || setCount > 1,
  };
}
