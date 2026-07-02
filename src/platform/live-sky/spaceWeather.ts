import { referenceEnvelope, preparedEnvelope, type Enveloped } from "@/platform/live-sky/schema";
import type { SolarFlare, GeomagneticStorm, FlareClass, GeomagneticScale } from "@/platform/live-sky/models";

const SUN = "star:sun", EARTH = "planet:earth";

/** Reference: the solar-flare classification (timeless). */
export const SOLAR_FLARE_CLASSES: { flareClass: FlareClass; meaning: string }[] = [
  { flareClass: "A", meaning: "Background level; negligible effects." },
  { flareClass: "B", meaning: "Minor; no noticeable effects." },
  { flareClass: "C", meaning: "Small flares with few noticeable consequences." },
  { flareClass: "M", meaning: "Medium flares; can cause brief radio blackouts and minor radiation storms." },
  { flareClass: "X", meaning: "The most intense flares; can trigger planet-wide radio blackouts and strong radiation storms." },
];

/** Reference: the NOAA geomagnetic storm scale (timeless). */
export const GEOMAGNETIC_SCALE: { gScale: GeomagneticScale; meaning: string }[] = [
  { gScale: "G1", meaning: "Minor: weak power-grid fluctuations; aurora at high latitudes." },
  { gScale: "G2", meaning: "Moderate: aurora reaches mid-high latitudes." },
  { gScale: "G3", meaning: "Strong: aurora at mid-latitudes; possible satellite and navigation effects." },
  { gScale: "G4", meaning: "Severe: widespread aurora and grid/navigation impacts." },
  { gScale: "G5", meaning: "Extreme: aurora far from the poles; major infrastructure risk." },
];

export const spaceWeather = {
  linkedEntityIds: [SUN, EARTH],
  flareClasses: SOLAR_FLARE_CLASSES,
  geomagneticScale: GEOMAGNETIC_SCALE,
  scalesEnvelope: referenceEnvelope({
    source: ["swpc", "donki"], provider: "noaa-swpc", confidence: "established",
    provenance: "The A–X solar-flare classes and the G1–G5 geomagnetic storm scale are standard, timeless classifications. Current flare and storm activity is not shown here.",
  }),
  /**
   * Recent solar flares. Prepared for integration — data will come from NASA
   * DONKI / NOAA SWPC. No flare events are fabricated.
   */
  recentFlares: (): Enveloped<SolarFlare>[] => [
    {
      data: null,
      envelope: preparedEnvelope({
        source: ["donki", "swpc"], provider: "nasa-donki",
        provenance: "Recent solar-flare events will be sourced from NASA DONKI / NOAA SWPC. No current flare data is shown until then.",
      }),
    },
  ],
  /**
   * Geomagnetic storm status. Prepared for integration — data will come from
   * NOAA SWPC. No storm status is fabricated.
   */
  geomagneticStorms: (): Enveloped<GeomagneticStorm>[] => [
    {
      data: null,
      envelope: preparedEnvelope({
        source: ["swpc"], provider: "noaa-swpc",
        provenance: "Current geomagnetic storm level (Kp / G-scale) will be sourced from NOAA SWPC. No current storm data is shown until then.",
      }),
    },
  ],
};
