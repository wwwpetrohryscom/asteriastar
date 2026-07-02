import { preparedEnvelope, type Enveloped } from "@/platform/live-sky/schema";
import type { AsteroidCloseApproach } from "@/platform/live-sky/models";

/** Notable near-Earth or well-known asteroids already in the graph, for linking. */
export const NOTABLE_ASTEROID_IDS = ["asteroid:apophis", "asteroid:bennu", "asteroid:eros"];

export const asteroids = {
  linkedEntityIds: NOTABLE_ASTEROID_IDS,
  reference: {
    lunarDistance: "Close-approach distances are often given in lunar distances (LD): 1 LD ≈ 384,400 km, the average Earth–Moon distance.",
    closeIsNotCollision: "A 'close approach' means an object passes relatively near Earth's orbit. The vast majority pass millions of kilometres away and pose no danger; genuine impact risks are tracked separately and are rare.",
  },
  /**
   * Upcoming asteroid close approaches. Prepared for integration — data will
   * come from the Minor Planet Center and NASA's near-Earth object services. No
   * approach dates or miss distances are fabricated.
   */
  closeApproaches: (): Enveloped<AsteroidCloseApproach>[] => [
    {
      data: null,
      envelope: preparedEnvelope({
        source: ["mpc", "nasa"], provider: "minor-planet-center",
        provenance: "Close-approach dates and miss distances will be sourced from the Minor Planet Center and NASA near-Earth object data. No values are shown until then — none are invented.",
      }),
    },
  ],
};
