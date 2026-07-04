import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Small-Body Missions & Sample Return Encyclopedia data model (Program AC) — the
 * engineering bridge across the small-body arc: it connects Space Exploration (D),
 * Launch Vehicles (V), Asteroids (Y), Comets (Z), Meteorites (AA), and Interstellar
 * objects (AB) through the missions that flew, orbited, landed, impacted, and returned
 * samples from small bodies.
 *
 * This is a MISSION encyclopedia, not another asteroid catalogue. Its emphasis is
 * mission history, engineering, science return, and graph connectivity.
 *
 * Hand-curated from authoritative public sources — NASA/JPL, ESA, JAXA, and mission
 * pages. EVERY timeline, target, launch vehicle, launch date, sample mass, discovery,
 * instrument, and outcome is optional and omitted when not reliably known — NEVER
 * invented. Missions, spacecraft, rockets, asteroids, comets, and organizations are
 * REUSED from the existing graph (missions are `space_mission` entities; existing ones
 * are enriched, not duplicated); only the genuinely-new mission-layer entities are
 * created here.
 */

export type SmallBodyKind =
  | "mission" // a small-body mission (existing space_mission enriched, or a new concept/planned mission)
  | "class" // a mission class (sample-return, flyby, rendezvous, orbiter, lander, impactor)
  | "sample" // a returned sample (material brought back to Earth)
  | "capsule" // a sample-return / reentry capsule
  | "phase" // a generic mission-lifecycle phase
  | "campaign"; // a joint science campaign (e.g. AIDA)

/** The graph EntityType each kind maps to. `mission` reuses the existing space_mission type. */
export const KIND_ENTITY_TYPE: Record<SmallBodyKind, EntityType> = {
  mission: "space_mission",
  class: "mission_class",
  sample: "returned_sample",
  capsule: "sample_return_capsule",
  phase: "mission_phase",
  campaign: "science_campaign",
};

export const KIND_LABEL: Record<SmallBodyKind, string> = {
  mission: "Mission",
  class: "Mission class",
  sample: "Returned sample",
  capsule: "Sample-return capsule",
  phase: "Mission phase",
  campaign: "Science campaign",
};

/** A mission's operational status. */
export type MissionStatus =
  | "completed"
  | "active"
  | "planned"
  | "concept" // studied/proposed, not built
  | "cancelled"
  | "extended"; // an extended mission of an earlier spacecraft

export const STATUS_LABEL: Record<MissionStatus, string> = {
  completed: "Completed",
  active: "Active",
  planned: "Planned",
  concept: "Concept / proposed",
  cancelled: "Cancelled",
  extended: "Extended mission",
};

/** Broad browse category — drives some discovery hubs (not a graph entity). */
export type MissionCategory =
  | "sample-return"
  | "comet"
  | "asteroid"
  | "planetary-defense"
  | "future"
  | "historic";

export interface SmallBodyRecord {
  /* --- identity / graph --- */
  id: string; // "<type>:<slug>"
  slug: string;
  name: string;
  kind: SmallBodyKind;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  /** True when this id already exists in the graph (enrich, don't create). */
  existing?: boolean;

  /* --- mission fields (kind === "mission") — ALL optional, never invented --- */
  status?: MissionStatus;
  category?: MissionCategory;
  agencyLabel?: string; // human agency label, e.g. "NASA / JHU APL"
  operatorKey?: string; // full organization id (operated_by) — reused agency
  launchDate?: string; // ISO or partial
  launchVehicleKey?: string; // full launch_vehicle id (launched_by) — reused rocket
  launchVehicleLabel?: string; // rocket label where the vehicle is not a graph entity
  launchSiteLabel?: string;
  spacecraftLabel?: string;

  classSlugs?: string[]; // → mission_class (member_of_group)
  // target relations — each a full graph id (asteroid/comet/dwarf_planet/moon).
  // ONLY assert an operational relation for an encounter that HAS HAPPENED; for a
  // planned/pending encounter use targetKeys (future-safe), never a past-tense relation.
  targetKeys?: string[]; // planned / pending target → target_of_mission
  visitedKeys?: string[]; // performed_flyby → visited (past)
  orbitedKeys?: string[]; // orbited (past/ongoing)
  landedOnKeys?: string[]; // landed_on / touchdown (past)
  impactedKeys?: string[]; // impacted — kinetic impact (past)
  sampleFromKeys?: string[]; // returned_samples_from (samples actually returned)
  collectedSampleSlug?: string; // → returned_sample (collected_sample)
  targetLabel?: string; // prose for targets not modelled as graph entities (e.g. Lucy Trojans)

  // Phase 8 science — optional prose, source-backed, omitted when unknown
  goals?: string;
  milestones?: string;
  discoveries?: string;
  sampleReturnLabel?: string;
  surfaceOps?: string;
  instrumentsLabel?: string;
  outcome?: string;
  limitations?: string;
  missionTypeLabel?: string; // human summary, e.g. "Rendezvous + sample return"
  publicationsLabel?: string;

  /* --- returned sample (kind === "sample") --- */
  sampleBodyKey?: string; // full body id (associated_with)
  massLabel?: string; // returned mass, ONLY where verified
  collectedByMissionSlug?: string; // the mission that returned it (for display)
  analysisLabel?: string;

  /* --- capsule (kind === "capsule") --- */
  missionSlug?: string; // the mission it belongs to (part_of_mission)
  reentryLabel?: string; // reentry date + site

  /* --- phase (kind === "phase") --- */
  nextPhaseSlug?: string; // followed_by
  exemplarKeys?: string[]; // exemplar mission ids (associated_with)
  order?: number;

  /* --- class / campaign --- */
  missionKeys?: string[]; // campaign → member missions (associated_with)
  definition?: string;

  highlights?: string[];
}
