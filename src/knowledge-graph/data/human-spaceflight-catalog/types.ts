import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Human-spaceflight data model.
 *
 * Records are hand-curated from authoritative public sources (NASA, ESA,
 * Roscosmos, JAXA, CSA, CNSA, Smithsonian). Every factual field — crew, launch
 * and landing dates, EVA durations, modules, operational status — is optional
 * and omitted when not reliably sourced. Nothing is invented. Cross-references
 * use catalogue slugs, resolved to graph ids (and deduplicated against existing
 * entities) in the index.
 */

export type HsfKind =
  | "station"
  | "module"
  | "crew-vehicle"
  | "cargo-vehicle"
  | "program"
  | "astronaut"
  | "expedition"
  | "eva"
  | "docking-system"
  | "life-support"
  | "experiment"
  | "medicine";

export const KIND_ENTITY_TYPE: Record<HsfKind, EntityType> = {
  station: "space_station",
  module: "station_module",
  "crew-vehicle": "crew_vehicle",
  "cargo-vehicle": "cargo_vehicle",
  program: "human_spaceflight_program",
  astronaut: "astronaut",
  expedition: "expedition",
  eva: "eva",
  "docking-system": "docking_system",
  "life-support": "life_support_system",
  experiment: "space_experiment",
  medicine: "space_medicine_topic",
};

export const KIND_LABEL: Record<HsfKind, string> = {
  station: "Space station",
  module: "Station module",
  "crew-vehicle": "Crewed spacecraft",
  "cargo-vehicle": "Cargo spacecraft",
  program: "Human spaceflight program",
  astronaut: "Astronaut",
  expedition: "Expedition",
  eva: "Spacewalk (EVA)",
  "docking-system": "Docking system",
  "life-support": "Life-support system",
  experiment: "Space experiment",
  medicine: "Space medicine",
};

export const KIND_PLURAL: Record<HsfKind, string> = {
  station: "Space stations",
  module: "Station modules",
  "crew-vehicle": "Crewed spacecraft",
  "cargo-vehicle": "Cargo spacecraft",
  program: "Human spaceflight programs",
  astronaut: "Astronauts",
  expedition: "Expeditions",
  eva: "Spacewalks (EVAs)",
  "docking-system": "Docking systems",
  "life-support": "Life-support systems",
  experiment: "Space experiments",
  medicine: "Space medicine topics",
};

export interface HsfRecord {
  /** Graph entity id, "<type>:<slug>" (existing reused, else created). */
  id: string;
  slug: string;
  name: string;
  kind: HsfKind;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  /** True when this id already exists in the graph (enrich, don't create). */
  existing?: boolean;

  /* --- cross-references by catalogue slug (resolved in the index) --- */
  agencySlug?: string;
  partnerAgencySlugs?: string[];
  programSlug?: string;
  stationSlug?: string;
  moduleSlugs?: string[];
  launchVehicleSlug?: string;
  siteSlug?: string;
  missionSlug?: string;
  crewSlugs?: string[];
  commanderSlug?: string;
  participantSlugs?: string[];
  dockingSlugs?: string[];
  lifeSupportSlugs?: string[];
  experimentSlugs?: string[];
  builtBySlug?: string;
  precededBySlug?: string;
  replacedBySlug?: string;
  /** Graph entity ids of related missions/spacecraft that already exist. */
  relatedKeys?: string[];

  /* --- structured display fields (all optional, never invented) --- */
  status?: string;
  country?: string;
  role?: string;
  launchDate?: string;
  reentryDate?: string;
  operationalPeriod?: string;
  orbit?: string;
  massKg?: number;
  lengthM?: number;
  pressurizedVolumeM3?: number;
  crewCapacity?: number;
  dockingPorts?: number;
  craftType?: string;
  nationality?: string;
  bornYear?: string;
  firstFlight?: string;
  notableFor?: string;
  expeditionNumber?: number;
  durationText?: string;
  /** Bullet facts (objectives, achievements). */
  highlights?: string[];
}
