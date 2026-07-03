import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Rockets & Launch Vehicles data model (Program V).
 *
 * Hand-curated from authoritative public sources (agency user's manuals, NASA/
 * ESA/JAXA/ISRO/Roscosmos documentation, and manufacturer specifications). Every
 * technical field is OPTIONAL and omitted when not reliably known — payloads,
 * thrusts, specific impulses, dimensions, masses, and dates are NEVER invented.
 * Cross-references use catalogue slugs, resolved to graph ids (and deduplicated
 * against existing entities) in the index. Existing graph entities
 * (`launch_vehicle:*`, `organization:*`, `launch_site:*`, `mission_program:*`)
 * are ENRICHED (`existing: true`), never recreated.
 */

export type RocketKind =
  | "family"
  | "vehicle"
  | "stage"
  | "engine"
  | "propellant"
  | "pad"
  | "provider"
  | "program";

/** The graph EntityType each kind maps to. Vehicle/provider/program/pad reuse
 *  existing types; family/stage/engine/propellant are the Program-V-new types. */
export const KIND_ENTITY_TYPE: Record<RocketKind, EntityType> = {
  family: "rocket_family",
  vehicle: "launch_vehicle", // existing type — reuse
  stage: "rocket_stage",
  engine: "rocket_engine",
  propellant: "propellant",
  pad: "launch_pad",
  provider: "organization", // existing type — reuse
  program: "mission_program", // existing type — reuse
};

export const KIND_LABEL: Record<RocketKind, string> = {
  family: "Rocket family",
  vehicle: "Launch vehicle",
  stage: "Rocket stage",
  engine: "Rocket engine",
  propellant: "Propellant",
  pad: "Launch pad",
  provider: "Launch provider",
  program: "Launch program",
};

export const KIND_PLURAL: Record<RocketKind, string> = {
  family: "Rocket families",
  vehicle: "Launch vehicles",
  stage: "Rocket stages",
  engine: "Rocket engines",
  propellant: "Propellants",
  pad: "Launch pads",
  provider: "Launch providers",
  program: "Launch programs",
};

/** Role a stage plays in the stack (booster/core/upper). Never invented. */
export type StageRole = "booster" | "strap-on" | "first" | "core" | "second" | "third" | "upper";

export interface RocketRecord {
  /* --- identity / graph --- */
  /** Graph entity id, "<type>:<slug>" (existing reused, else created). */
  id: string;
  slug: string;
  name: string;
  kind: RocketKind;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  /** True when this id already exists in the graph (enrich, don't create). */
  existing?: boolean;

  /* --- cross-references by catalogue slug (resolved in the index) --- */
  familySlug?: string;
  vehicleSlugs?: string[]; // family → member vehicles (not strictly needed; vehicles point back)
  stageSlugs?: string[]; // vehicle → its stages
  engineSlugs?: string[]; // vehicle/stage → engines (direct)
  propellantSlugs?: string[]; // engine/stage → propellants
  providerSlug?: string; // → organization (operator)
  builtBySlug?: string; // → organization (manufacturer/developer)
  programSlug?: string; // → mission_program
  padSlugs?: string[]; // vehicle → launch pads
  siteSlug?: string; // pad → launch_site (parent)
  launchVehicleSlugs?: string[]; // engine → vehicles it powers (drives engine.launchVehicles)
  derivedFromSlug?: string; // vehicle/family derived from another
  precededBySlug?: string; // family/vehicle generation ordering
  succeededBySlug?: string; // replaced by / succeeded by
  /** Full graph ids of EXISTING entities to link via associated_with (missions, spacecraft…). */
  relatedKeys?: string[];

  /* --- display specs, ALL optional, never invented --- */
  status?: string; // "Active" | "Retired" | "In development" | "Planned"
  country?: string;
  firstFlight?: string;
  lastFlight?: string;
  operatorName?: string;

  // launch vehicle / family
  payloadLeoKg?: number;
  payloadGtoKg?: number;
  payloadTliKg?: number;
  heightM?: number;
  diameterM?: number;
  massKg?: number;
  stageCount?: number;
  boosterCount?: number;
  reusable?: boolean;
  humanRated?: boolean;
  thrustLiftoffKn?: number;
  liftClass?: string; // "Small-lift" | "Medium-lift" | "Heavy-lift" | "Super heavy-lift"

  // stage
  stageNumber?: number;
  stageRole?: StageRole;
  burnTimeS?: number;
  dryMassKg?: number;
  propellantMassKg?: number;
  engineCount?: number;

  // engine
  engineCycle?: string; // "Gas-generator" | "Staged combustion" | "Full-flow staged combustion" | "Electric-pump" | "Expander" | "Pressure-fed" | "Solid"
  thrustVacuumKn?: number;
  thrustSeaLevelKn?: number;
  specificImpulseVacuumS?: number;
  specificImpulseSeaLevelS?: number;
  chamberPressureBar?: number;

  // propellant
  fuel?: string; // e.g. "RP-1", "LH2", "CH4", "UDMH", "APCP"
  oxidizer?: string; // e.g. "LOX", "N2O4"
  propellantClass?: string; // "Cryogenic" | "Hypergolic" | "Semi-cryogenic" | "Solid" | "Storable"
  cryogenic?: boolean;
  hypergolic?: boolean;
  solid?: boolean;

  // pad
  location?: string;
  latitude?: number;
  longitude?: number;

  // family / program
  startYear?: string;
  endYear?: string;

  highlights?: string[];
}
