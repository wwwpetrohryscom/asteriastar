import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Space Environment & Hazards Encyclopedia data model (Program AE) — the scientific layer
 * describing the hazards of space: space weather, radiation, and the physical hazards that
 * threaten spacecraft and astronauts.
 *
 * Hand-curated from authoritative public sources — NASA, NOAA/SWPC, and ESA. Every
 * quantitative value is optional and omitted when not reliably known — never invented.
 * The Sun, the planets and moons, the solar/monitoring missions, and NASA/NOAA are REUSED
 * from the existing graph; only the new hazard-layer entities are created here.
 */

export type EnvKind =
  | "phenomenon" // a space-weather phenomenon (solar wind, flare, CME, storm, aurora, magnetosphere…)
  | "radiation" // a radiation environment (Van Allen belts, GCRs, SEPs…)
  | "hazard" // a physical space hazard (debris, micrometeoroids, charging, atomic oxygen…)
  | "index" // a geomagnetic / space-weather index or scale (Kp, Dst, NOAA scales)
  | "monitor-mission" // a monitoring spacecraft (existing space_mission reused, or created)
  | "monitor-org"; // a monitoring organization (existing organization reused, or created)

export const KIND_ENTITY_TYPE: Record<EnvKind, EntityType> = {
  phenomenon: "space_weather_phenomenon",
  radiation: "radiation_environment",
  hazard: "space_hazard",
  index: "geomagnetic_index",
  "monitor-mission": "space_mission",
  "monitor-org": "organization",
};

export const KIND_LABEL: Record<EnvKind, string> = {
  phenomenon: "Space-weather phenomenon",
  radiation: "Radiation environment",
  hazard: "Space hazard",
  index: "Geomagnetic index",
  "monitor-mission": "Monitoring mission",
  "monitor-org": "Monitoring organization",
};

export type EnvCategory = "space-weather" | "radiation" | "hazard" | "index" | "monitoring";

export interface EnvRecord {
  id: string;
  slug: string;
  name: string;
  kind: EnvKind;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  existing?: boolean;

  /* cross-references (reuse existing entities) */
  partOfKey?: string; // full id (part_of) — e.g. inner belt part_of Van Allen belts
  affectsKeys?: string[]; // full ids (affects) — planets/moons/missions the hazard affects
  monitoredByKeys?: string[]; // full space_mission/organization ids (observed_by)
  originKey?: string; // full id (associated_with) — e.g. the Sun for solar phenomena
  relatedKeys?: string[]; // full ids (associated_with)

  /* display specs, all optional, never invented */
  category?: EnvCategory;
  symbol?: string; // e.g. "Kp", "Dst"
  scaleLabel?: string; // e.g. "0–9", "NOAA G1–G5"
  definition?: string;
  magnitudeLabel?: string;
  effectLabel?: string;
  timescaleLabel?: string;
  highlights?: string[];
}
