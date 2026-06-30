import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Space-exploration data model.
 *
 * Records are hand-curated from authoritative public sources (NASA, ESA, JPL,
 * national agencies). Every factual field is optional and omitted when not
 * reliably known — launch dates, agencies, vehicles, and outcomes are never
 * invented. Cross-references use catalogue slugs, resolved to graph ids (and
 * deduplicated against existing entities) in the index.
 */

export type ExplorationKind =
  | "agency"
  | "program"
  | "vehicle"
  | "site"
  | "mission"
  | "spacecraft"
  | "astronaut"
  | "instrument";

export const KIND_ENTITY_TYPE: Record<ExplorationKind, EntityType> = {
  agency: "organization",
  program: "mission_program",
  vehicle: "launch_vehicle",
  site: "launch_site",
  mission: "space_mission",
  spacecraft: "spacecraft",
  astronaut: "astronaut",
  instrument: "scientific_instrument",
};

export const KIND_LABEL: Record<ExplorationKind, string> = {
  agency: "Space agency",
  program: "Mission program",
  vehicle: "Launch vehicle",
  site: "Launch site",
  mission: "Space mission",
  spacecraft: "Spacecraft",
  astronaut: "Astronaut",
  instrument: "Scientific instrument",
};

export const KIND_PLURAL: Record<ExplorationKind, string> = {
  agency: "Space agencies",
  program: "Mission programs",
  vehicle: "Launch vehicles",
  site: "Launch sites",
  mission: "Space missions",
  spacecraft: "Spacecraft",
  astronaut: "Astronauts",
  instrument: "Scientific instruments",
};

export interface ExplorationRecord {
  /** Graph entity id, "<type>:<slug>" (existing reused, else created). */
  id: string;
  slug: string;
  name: string;
  kind: ExplorationKind;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  /** True when this id already exists in the graph (enrich, don't create). */
  existing?: boolean;

  /* --- cross-references by catalogue slug (resolved in the index) --- */
  agencySlug?: string;
  /** Additional collaborating agencies. */
  partnerAgencySlugs?: string[];
  programSlug?: string;
  vehicleSlug?: string;
  siteSlug?: string;
  operatorSlug?: string;
  spacecraftSlugs?: string[];
  instrumentSlugs?: string[];
  crewSlugs?: string[];
  /** Graph entity ids of targets that already exist (planet:mars, moon:moon…). */
  targetKeys?: string[];
  precededBySlug?: string;

  /* --- structured display fields (all optional, never invented) --- */
  country?: string;
  abbreviation?: string;
  founded?: string;
  headquarters?: string;
  startYear?: string;
  endYear?: string;
  status?: string;
  launchDate?: string;
  endDate?: string;
  missionType?: string;
  destination?: string;
  firstFlight?: string;
  craftType?: string;
  instrumentType?: string;
  measures?: string;
  nationality?: string;
  bornYear?: string;
  notableFor?: string;
  location?: string;
  payloadLeoKg?: number;
  height?: string;
  objectives?: string[];
  outcome?: string;
  discoveries?: string[];
}
