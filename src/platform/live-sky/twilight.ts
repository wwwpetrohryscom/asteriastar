import type { SolarDayCondition } from "@/platform/live-sky/models";

/**
 * Twilight reference (Program Q). Timeless definitions of the three twilight
 * bands and the special daylight conditions. These are facts, not computed
 * values — the actual times for a location and date come from `sun`
 * (engine.liveSky.sun) and carry their own computed envelope.
 */

export const SUN_ENTITY_ID = "star:sun";
export const EARTH_ENTITY_ID = "planet:earth";

export interface TwilightBand {
  key: "civil" | "nautical" | "astronomical";
  name: string;
  /** Upper Sun altitude of the band (nearest the horizon), degrees. */
  upperDeg: number;
  /** Lower Sun altitude of the band, degrees. */
  lowerDeg: number;
  meaning: string;
}

/** The three twilight bands, from brightest (civil) to darkest (astronomical). */
export const TWILIGHT_BANDS: TwilightBand[] = [
  {
    key: "civil",
    name: "Civil twilight",
    upperDeg: -0.833,
    lowerDeg: -6,
    meaning:
      "The Sun is 0–6° below the horizon. The brightest objects are visible and, in clear conditions, there is enough natural light for most outdoor activity.",
  },
  {
    key: "nautical",
    name: "Nautical twilight",
    upperDeg: -6,
    lowerDeg: -12,
    meaning:
      "The Sun is 6–12° below the horizon. The horizon at sea is still faintly discernible and brighter stars are usable for navigation.",
  },
  {
    key: "astronomical",
    name: "Astronomical twilight",
    upperDeg: -12,
    lowerDeg: -18,
    meaning:
      "The Sun is 12–18° below the horizon. Scattered sunlight still faintly lights the sky; beyond −18° is astronomical night, the darkest sky.",
  },
];

/** Human-readable meaning for each daylight/twilight condition. */
export const CONDITION_MEANING: Record<SolarDayCondition, string> = {
  normal: "The Sun rises and sets, and all twilight phases occur.",
  polar_day: "The Sun stays above the horizon for the whole 24 hours (the midnight Sun) — there is no sunrise or sunset.",
  polar_night: "The Sun stays below the horizon for the whole 24 hours — there is no sunrise or sunset.",
  no_civil_twilight: "The Sun never sinks below −6°, so it never gets darker than civil twilight (a bright 'white night').",
  no_nautical_twilight: "The Sun never sinks below −12°, so nautical (and astronomical) darkness does not occur.",
  no_astronomical_twilight: "The Sun never sinks below −18°, so true astronomical night does not occur.",
};

/** The twilight reference surface (wrapped by engine.liveSky.twilight). */
export const twilight = {
  bands: TWILIGHT_BANDS,
  conditionMeaning: CONDITION_MEANING,
  linkedEntityIds: [SUN_ENTITY_ID, EARTH_ENTITY_ID],
};
