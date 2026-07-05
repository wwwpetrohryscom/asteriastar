import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Heliophysics & Space Weather Operations data model (Program AW) — the operational layer of
 * heliophysics: how the Sun drives space weather and how that weather affects technology and
 * people. It REUSES the space-weather phenomena already in the graph (solar flares, CMEs, the
 * solar wind, the heliosphere, geomagnetic storms, the magnetosphere, the aurora), the NOAA G/S/R
 * scales, the solar-energetic-particle and Van Allen radiation environments, the Parker Solar
 * Probe, Solar Orbiter, DSCOVR and ACE missions, the SWPC, NOAA and ESA organisations, and the
 * Sun. The new entities are the solar-source phenomena still missing from the graph (created with
 * the existing space-weather-phenomenon type), the operational impacts (a new type), and ESA's
 * space-weather service (created with the existing organization type, matching the reused NOAA
 * SWPC). Nothing is fabricated.
 */

export type HelioKind =
  | "phenomenon" // a solar-source or space-weather phenomenon (reused space-weather-phenomenon type)
  | "impact" // an operational impact of space weather
  | "service"; // a space-weather forecasting service (reused organization type, like NOAA SWPC)

export const KIND_ENTITY_TYPE: Record<HelioKind, EntityType> = {
  phenomenon: "space_weather_phenomenon",
  impact: "space_weather_impact",
  service: "organization",
};

export const KIND_LABEL: Record<HelioKind, string> = {
  phenomenon: "Solar & space-weather phenomenon",
  impact: "Operational impact",
  service: "Forecasting service",
};

export interface HelioRecord {
  id: string;
  slug: string;
  name: string;
  kind: HelioKind;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  existing?: boolean;

  /* cross-references */
  relatedKeys?: string[]; // full ids of REUSED or new entities (associated_with)

  /* display */
  sectorLabel?: string; // e.g. "Ground infrastructure" / "Solar source" — only when well established
  definition?: string;
  highlights?: string[];
}
