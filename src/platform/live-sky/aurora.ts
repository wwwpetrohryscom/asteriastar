import { referenceEnvelope, preparedEnvelope, type Enveloped } from "@/platform/live-sky/schema";
import type { AuroraForecast } from "@/platform/live-sky/models";

const SUN = "star:sun", EARTH = "planet:earth";

/** Reference: the planetary K-index (Kp) scale (timeless). */
export const KP_SCALE: { kp: number; meaning: string }[] = [
  { kp: 0, meaning: "Very quiet; aurora confined to high polar latitudes." },
  { kp: 3, meaning: "Unsettled; aurora possible at high latitudes." },
  { kp: 5, meaning: "Minor geomagnetic storm (G1); aurora may reach mid-high latitudes." },
  { kp: 7, meaning: "Strong storm (G3); aurora may be seen at mid-latitudes." },
  { kp: 9, meaning: "Extreme storm (G5); aurora possible far from the poles." },
];

export const aurora = {
  linkedEntityIds: [SUN, EARTH],
  kpScale: KP_SCALE,
  referenceEnvelope: referenceEnvelope({
    source: ["swpc"], provider: "noaa-swpc", confidence: "established",
    provenance: "The Kp scale and the physical cause of aurora (solar wind and CMEs exciting Earth's upper atmosphere along the magnetic field) are timeless reference facts. The live OVATION forecast and the current Kp are served at /space-weather/aurora.",
  }),
  reference: {
    cause: "Aurorae occur when charged particles from the Sun — carried by the solar wind and coronal mass ejections — are funnelled by Earth's magnetic field into the upper atmosphere, exciting oxygen and nitrogen to glow.",
  },
  /**
   * Aurora visibility forecast for a location. Prepared for integration — needs
   * NOAA SWPC's OVATION model and Kp forecast, plus an observer location. No
   * forecast is fabricated.
   */
  forecast: (): Enveloped<AuroraForecast> => ({
    data: null,
    envelope: preparedEnvelope({
      source: ["swpc"], provider: "noaa-swpc",
      provenance: "A LOCATION-AWARE aurora forecast needs an observer position, which this module has not been given, so no visibility line for any place is shown or invented. The hemispheric forecast that does not need one IS available: NOAA's OVATION model and the planetary K-index are served at /space-weather/aurora.",
    }),
  }),
};
