import { computedEnvelope, withStaleness, type Enveloped } from "@/platform/live-sky/schema";
import type { MoonData, MoonPhaseName } from "@/platform/live-sky/models";
import { computeMoon, SYNODIC_MONTH_DAYS } from "@/platform/live-sky/providers/computed-moon";

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

/** Conservative validity/cache horizon for a computed Moon reading. */
export const MOON_CACHE_HOURS = 3;

export { SYNODIC_MONTH_DAYS };

const round = (x: number, dp: number): number => Math.round(x * 10 ** dp) / 10 ** dp;

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
};
