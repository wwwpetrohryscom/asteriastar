import { preparedEnvelope, type Enveloped } from "@/platform/live-sky/schema";
import type { CometVisibility } from "@/platform/live-sky/models";

/** Notable comets already in the graph, for context and linking. */
export const NOTABLE_COMET_IDS = ["comet:halleys-comet", "comet:hale-bopp", "comet:hyakutake"];

export const comets = {
  linkedEntityIds: NOTABLE_COMET_IDS,
  reference: {
    whatMakesThemVisible: "A comet brightens as it nears the Sun and its ices vaporise, forming a glowing coma and one or more tails. Most comets need a telescope; only occasionally does one become a naked-eye 'great comet'. Predicting a comet's brightness is notoriously uncertain.",
  },
  /**
   * Currently visible comets and their brightness. Prepared for integration —
   * needs ephemerides (JPL) and Minor Planet Center designations. No current
   * comet brightness or position is fabricated (comet brightness is especially
   * unpredictable).
   */
  currentlyVisible: (): Enveloped<CometVisibility>[] => [
    {
      data: null,
      envelope: preparedEnvelope({
        source: ["jpl", "mpc"], provider: "jpl-horizons",
        provenance: "Which comets are currently visible, and how bright, requires ephemerides and up-to-date magnitude estimates from connected providers. No values are shown until then.",
      }),
    },
  ],
};
