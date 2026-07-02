import { preparedEnvelope, type Enveloped } from "@/platform/live-sky/schema";
import type { MoonPhase, MoonPhaseName } from "@/platform/live-sky/models";

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

/** The Moon's synodic period (new Moon to new Moon), a timeless constant. */
export const SYNODIC_MONTH_DAYS = 29.53;

export const MOON_ENTITY_ID = "moon:the-moon";
export const SUN_ENTITY_ID = "star:sun";

export const moon = {
  phases: MOON_PHASES,
  synodicMonthDays: SYNODIC_MONTH_DAYS,
  linkedEntityIds: [MOON_ENTITY_ID, SUN_ENTITY_ID],
  /**
   * The current Moon phase and illumination. Prepared for integration — a
   * connected ephemeris provider (USNO almanac or JPL Horizons) and an observer
   * location are required. No current phase is fabricated.
   */
  currentPhase: (): Enveloped<MoonPhase> => ({
    data: null,
    envelope: preparedEnvelope({
      source: ["usno", "jpl"], provider: "usno",
      provenance: "Current phase, illumination, and moonrise/moonset require a connected ephemeris provider and an observer location. No value is shown until then.",
    }),
  }),
};
