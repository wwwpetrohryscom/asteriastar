import { computedEnvelope, withStaleness, type Enveloped } from "@/platform/live-sky/schema";
import type { MoonData, MoonPhaseName, MoonPositionData, MoonRiseEvent, MoonTransitEvent } from "@/platform/live-sky/models";
import { computeMoon, SYNODIC_MONTH_DAYS } from "@/platform/live-sky/providers/computed-moon";
import { moonTopocentric, MOON_RISE_ALTITUDE } from "@/platform/live-sky/providers/lunar-position";
import { computeLunarDay } from "@/platform/live-sky/moonrise";
import {
  resolveLocation,
  isValidIanaTimeZone,
  timezoneOffsetMinutes,
  type LocationInput,
  type LocationField,
  type ResolvedLocation,
} from "@/platform/live-sky/location";

/** Reference: the eight principal phases of the Moon and their meaning (timeless). */
export const MOON_PHASES: { phase: MoonPhaseName; name: string; meaning: string }[] = [
  { phase: "new-moon", name: "New Moon", meaning: "The Moon is between Earth and the Sun; its night side faces us and it is invisible." },
  { phase: "waxing-crescent", name: "Waxing Crescent", meaning: "A growing sliver visible in the west after sunset." },
  { phase: "first-quarter", name: "First Quarter", meaning: "Half-lit; highest in the sky at sunset." },
  { phase: "waxing-gibbous", name: "Waxing Gibbous", meaning: "More than half lit and still growing." },
  { phase: "full-moon", name: "Full Moon", meaning: "Fully lit; rises at sunset and sets at sunrise." },
  { phase: "waning-gibbous", name: "Waning Gibbous", meaning: "More than half lit and shrinking; rises after sunset." },
  { phase: "last-quarter", name: "Last Quarter", meaning: "Half-lit; highest in the sky at sunrise." },
  { phase: "waning-crescent", name: "Waning Crescent", meaning: "A shrinking sliver visible in the east before sunrise." },
];

const PHASE_NAME = new Map(MOON_PHASES.map((p) => [p.phase, p.name]));

export const MOON_ENTITY_ID = "moon:the-moon";
export const SUN_ENTITY_ID = "star:sun";

/** Conservative validity/cache horizon for a computed Moon phase reading. */
export const MOON_CACHE_HOURS = 3;
/** The Moon's topocentric position drifts faster than its phase, so a shorter horizon. */
export const MOON_POSITION_CACHE_HOURS = 1;

export { SYNODIC_MONTH_DAYS };

const round = (x: number, dp: number): number => Math.round(x * 10 ** dp) / 10 ** dp;
const pad = (n: number): string => String(n).padStart(2, "0");

const CALC_NOTES =
  "Illuminated fraction k = (1 − cos ψ)/2, where ψ is the Sun–Moon elongation; the phase name is binned by ψ. Computed from public-domain solar/lunar formulae (accuracy ~1% illumination; phase name reliable). This is not a full ephemeris — moonrise/moonset are not provided.";

function build(instant: Date, now: Date, isCurrent: boolean): Enveloped<MoonData> {
  const m = computeMoon(instant);
  // A "current now" reading is served as a snapshot and cacheable for a few
  // hours, so its validity window is now → now + cache horizon and it is subject
  // to now-based staleness. An explicit-date reading is an exact, reproducible
  // computation for that single instant: it is a point value (validFrom ==
  // validUntil == instant), it does not decay, and it is never "stale".
  const validUntil = isCurrent
    ? new Date(instant.getTime() + MOON_CACHE_HOURS * 3_600_000).toISOString()
    : instant.toISOString();
  let envelope = computedEnvelope({
    // Only USNO is a genuine source of the math (approximate solar coordinates);
    // the lunar series is public-domain Meeus/Almanac (no source key), named in
    // the provenance. NASA is a Moon-facts *reference* (a citation), not a source
    // of any formula, so it is deliberately NOT listed here.
    source: ["usno"],
    generatedAt: now.toISOString(),
    validFrom: instant.toISOString(),
    validUntil,
    confidence: "modeled",
    provenance:
      "Computed deterministically from published solar (USNO approximate solar coordinates) and low-precision lunar formulae — not fetched from a live provider. See the citations and the methodology notes.",
    licenseNotes:
      "Computed values. The underlying formulae and constants are public-domain astronomical quantities; no provider data is redistributed.",
  });
  if (isCurrent) envelope = withStaleness(envelope, now.toISOString());

  const data: MoonData = {
    objectEntityId: MOON_ENTITY_ID,
    phase: m.phase,
    phaseName: PHASE_NAME.get(m.phase) ?? m.phase,
    phaseAngleDeg: round(m.elongationDeg, 1),
    illuminationFraction: round(m.illuminationFraction, 4),
    illuminationPercent: round(m.illuminationFraction * 100, 1),
    synodicAgeDays: round(m.synodicAgeDays, 2),
    waxing: m.waxing,
    method: "computed",
    atIso: instant.toISOString(),
    calculationNotes: CALC_NOTES,
  };
  return { data, envelope };
}

const POSITION_CALC_NOTES =
  "Moonrise, moonset, and transit are found by sampling the Moon's topocentric altitude across the local civil day and refining the horizon crossings (threshold −0.833° — the refracted upper limb at a flat sea-level horizon). Position is topocentric (parallax-corrected); phase and illumination reuse the Program P computation. The position, phase, and horizon status are evaluated at the reference time (now for a current query, else local noon of the requested date); events that do not occur are null.";

const POSITION_ACCURACY_NOTES =
  "Low-precision lunar theory (principal periodic terms): geocentric position ~0.05–0.2°, moonrise/moonset/transit ~1–2 minutes, topocentric altitude ~0.1°. Suitable for observing guidance — NOT for occultations, grazes, spacecraft navigation, high-precision astrometry, or legal/almanac-grade use.";

/** The result of a location-aware Moon computation: the enveloped data, or a structured error. */
export type MoonPositionResult =
  | { ok: true; value: Enveloped<MoonPositionData> }
  | { ok: false; field: LocationField; message: string };

/** The local civil date (YYYY-MM-DD) of an instant in a timezone (UTC if none/invalid). */
function localDateOf(instant: Date, timezone: string | undefined): string {
  const off = timezone && isValidIanaTimeZone(timezone) ? timezoneOffsetMinutes(timezone, instant) : 0;
  const local = new Date(instant.getTime() + off * 60_000);
  return `${local.getUTCFullYear()}-${pad(local.getUTCMonth() + 1)}-${pad(local.getUTCDate())}`;
}

/** The UTC instant of local noon on the resolved civil date. */
function localNoon(loc: ResolvedLocation): Date {
  return new Date(Date.UTC(loc.year, loc.month - 1, loc.day, 12, 0, 0) - loc.utcOffsetMinutes * 60_000);
}

/** Format an event UTC instant as { iso, local } in the resolved timezone. */
function eventTimes(loc: ResolvedLocation, utcMs: number | null): { iso: string | null; local: string | null } {
  if (utcMs === null) return { iso: null, local: null };
  const instant = new Date(utcMs);
  const off = loc.timezoneProvided ? timezoneOffsetMinutes(loc.timezone, instant) : 0;
  const wall = new Date(instant.getTime() + off * 60_000);
  return { iso: instant.toISOString(), local: `${pad(wall.getUTCHours())}:${pad(wall.getUTCMinutes())}` };
}

function buildLocationAware(input: LocationInput, now: Date): MoonPositionResult {
  const isCurrent = !input.date;
  const withDate: LocationInput = isCurrent ? { ...input, date: localDateOf(now, input.timezone) } : input;
  const resolved = resolveLocation(withDate);
  if (!resolved.ok) return { ok: false, field: resolved.field, message: resolved.message };
  const loc = resolved.location;

  const refTime = isCurrent ? now : localNoon(loc);
  const day = computeLunarDay(loc);
  const pos = moonTopocentric(refTime, loc.latitude, loc.longitude);
  const m = computeMoon(refTime);

  const riseEvent = (utcMs: number | null, azimuthDeg: number | null): MoonRiseEvent => ({ ...eventTimes(loc, utcMs), azimuthDeg });
  const transitEvent = (utcMs: number | null, altitudeDeg: number | null): MoonTransitEvent => ({ ...eventTimes(loc, utcMs), altitudeDeg });

  const data: MoonPositionData = {
    objectEntityId: MOON_ENTITY_ID,
    input: {
      latitude: loc.latitude,
      longitude: loc.longitude,
      date: loc.date,
      timezone: loc.timezone,
      utcOffsetMinutes: loc.utcOffsetMinutes,
    },
    referenceTimeIso: refTime.toISOString(),
    events: {
      moonrise: riseEvent(day.moonriseUtcMs, day.riseAzimuthDeg),
      moonset: riseEvent(day.moonsetUtcMs, day.setAzimuthDeg),
      lunarTransit: transitEvent(day.transitUtcMs, day.transitAltitudeDeg),
      lunarLowerTransit: eventTimes(loc, day.lowerTransitUtcMs),
    },
    position: {
      altitudeDeg: round(pos.altitudeDeg, 2),
      azimuthDeg: round(pos.azimuthDeg, 2),
      rightAscensionDeg: round(pos.rightAscensionDeg, 3),
      declinationDeg: round(pos.declinationDeg, 3),
      distanceKm: round(pos.distanceKm, 0),
      hourAngleDeg: round(pos.hourAngleDeg, 2),
    },
    phase: {
      phase: m.phase,
      phaseName: PHASE_NAME.get(m.phase) ?? m.phase,
      phaseAngleDeg: round(m.elongationDeg, 1),
      illuminationFraction: round(m.illuminationFraction, 4),
      illuminationPercent: round(m.illuminationFraction * 100, 1),
      synodicAgeDays: round(m.synodicAgeDays, 2),
      waxing: m.waxing,
    },
    horizon: {
      aboveHorizonAtReferenceTime: pos.altitudeDeg > MOON_RISE_ALTITUDE,
      alwaysAboveHorizon: day.alwaysAbove,
      alwaysBelowHorizon: day.alwaysBelow,
      noMoonrise: day.noMoonrise,
      noMoonset: day.noMoonset,
      multipleEventsSameDay: day.multipleEventsSameDay,
    },
    method: "computed",
    calculationNotes: POSITION_CALC_NOTES,
    accuracyNotes: POSITION_ACCURACY_NOTES,
  };

  // Current reading: the position drifts, so a short validity window + staleness.
  // Explicit-date reading: an immutable point value that never goes stale.
  const validFrom = refTime.toISOString();
  const validUntil = isCurrent
    ? new Date(refTime.getTime() + MOON_POSITION_CACHE_HOURS * 3_600_000).toISOString()
    : validFrom;
  let envelope = computedEnvelope({
    source: ["usno"],
    generatedAt: now.toISOString(),
    validFrom,
    validUntil,
    confidence: "modeled",
    provenance:
      "Computed deterministically from public-domain low-precision lunar theory (Astronomical Almanac / USNO; methodology per J. Meeus) — not fetched from a live provider. Location is used only for this calculation and is not stored.",
    licenseNotes:
      "Computed values. The underlying formulae and constants are public-domain astronomical quantities; no provider data is redistributed.",
  });
  if (isCurrent) envelope = withStaleness(envelope, now.toISOString());

  return { ok: true, value: { data, envelope } };
}

export const moon = {
  phases: MOON_PHASES,
  synodicMonthDays: SYNODIC_MONTH_DAYS,
  linkedEntityIds: [MOON_ENTITY_ID, SUN_ENTITY_ID],

  /**
   * The current Moon phase and illumination, computed for `now`. Real, source-
   * backed, deterministic, timestamped, and stale-aware — never fabricated. The
   * caller injects `now` so the platform contract stays pure and testable.
   */
  current: (now: Date): Enveloped<MoonData> => build(now, now, true),

  /**
   * The Moon phase and illumination computed for an explicit instant (e.g. a
   * `?date=` query). `now` is the real computation time recorded in the envelope.
   */
  at: (instant: Date, now: Date): Enveloped<MoonData> => build(instant, now, false),

  /**
   * Location-aware Moon data (Program R): moonrise, moonset, transit, position,
   * phase, and horizon status for an explicit location and date. Reuses the phase
   * computation above. `now` is the real computation time. A validation failure
   * returns a structured error rather than a guessed value.
   */
  forLocationDate: (input: LocationInput, now: Date): MoonPositionResult => buildLocationAware(input, now),
};
