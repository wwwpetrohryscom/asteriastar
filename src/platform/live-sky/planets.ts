import { preparedEnvelope, type Enveloped } from "@/platform/live-sky/schema";
import type { PlanetVisibility } from "@/platform/live-sky/models";

/** Reference: the naked-eye planets and how they generally appear (timeless). */
export const NAKED_EYE_PLANETS: { entityId: string; name: string; behaviour: string }[] = [
  { entityId: "planet:mercury", name: "Mercury", behaviour: "An inner planet; only ever visible low in twilight, briefly after sunset or before sunrise." },
  { entityId: "planet:venus", name: "Venus", behaviour: "The brightest planet; a brilliant 'morning' or 'evening star' near the Sun, never far from twilight." },
  { entityId: "planet:mars", name: "Mars", behaviour: "An outer planet, reddish; brightest and visible all night around opposition, roughly every 26 months." },
  { entityId: "planet:jupiter", name: "Jupiter", behaviour: "An outer planet; very bright, visible all night around opposition each year." },
  { entityId: "planet:saturn", name: "Saturn", behaviour: "An outer planet; steady and golden, best around its yearly opposition." },
];

/** Uranus and Neptune are outer planets requiring optical aid. */
export const TELESCOPIC_PLANETS = ["planet:uranus", "planet:neptune"];

export const planets = {
  nakedEye: NAKED_EYE_PLANETS,
  telescopic: TELESCOPIC_PLANETS,
  linkedEntityIds: [
    "planet:mercury", "planet:venus", "planet:mars", "planet:jupiter", "planet:saturn", "planet:uranus", "planet:neptune",
  ],
  /**
   * Current planet visibility for an observer. Prepared for integration — needs
   * JPL Horizons ephemerides and an observer location. No current positions,
   * magnitudes, or rise/set times are fabricated.
   */
  currentVisibility: (): Enveloped<PlanetVisibility>[] => [
    {
      data: null,
      envelope: preparedEnvelope({
        source: ["jpl"], provider: "jpl-horizons",
        provenance: "Which planets are visible tonight, and where, requires ephemerides from a connected provider and an observer location. No current visibility is shown until then.",
      }),
    },
  ],
};
