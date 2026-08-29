import { preparedEnvelope, type Enveloped } from "@/platform/live-sky/schema";
import type { IssPass } from "@/platform/live-sky/models";

export const ISS_ENTITY_ID = "satellite:international-space-station";

export const iss = {
  linkedEntityIds: [ISS_ENTITY_ID],
  reference: {
    whatItIs: "The International Space Station orbits Earth about every 90 minutes at roughly 400 km altitude, travelling near 28,000 km/h.",
    howPassesWork: "The ISS is visible to the naked eye when it catches sunlight against a dark sky — usually within a couple of hours of sunrise or sunset. It appears as a bright, steady 'star' gliding silently across the sky over a few minutes, not blinking like an aircraft. Pass times for an explicit location are computed at /satellites/passes.",
  },
  /**
   * Visible ISS passes for an observer. Prepared for integration — needs current
   * orbital elements (CelesTrak TLEs), an SGP4 propagator, and an observer
   * location. NO position or pass time is ever fabricated.
   */
  passes: (): Enveloped<IssPass>[] => [
    {
      data: null,
      envelope: preparedEnvelope({
        source: ["celestrak"], provider: "celestrak",
        provenance: "This Live Sky module is reference material and fetches nothing. The station's live position and visible-pass predictions ARE available — computed from NASA/JSC's own published operational ephemeris at /satellites/iss and /satellites/passes, with the coordinate transformation verified against NASA's own ascending-node longitudes. Nothing is shown here, and nothing is fabricated here.",
      }),
    },
  ],
};
