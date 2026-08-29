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
    provenance: "The A–X solar-flare classes and the G1–G5 geomagnetic storm scale are standard, timeless classifications — reference data, not a reading. Current flare and storm activity is measured live at /space-weather.",
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
        provenance: "This Live Sky module carries the timeless flare classification only; it fetches nothing. Current flare activity IS available — the GOES X-ray state from NOAA SWPC and the catalogued flares from NASA DONKI are served at /space-weather/solar-activity, each with the provider's own timestamp. Nothing is shown here, and nothing is invented here.",
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
        provenance: "This Live Sky module carries the timeless G-scale only; it fetches nothing. The current planetary K-index and G-level ARE available — from NOAA SWPC at /space-weather/geomagnetic, with the provider's own timestamps. Nothing is shown here, and nothing is invented here.",
      }),
    },
  ],
};
