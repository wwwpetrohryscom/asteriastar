import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Comets & Small-Body Reservoirs Encyclopedia data model (Program Z) — the companion
 * to Program Y (Asteroids & Minor Planets).
 *
 * Hand-curated from authoritative public sources — the IAU Minor Planet Center, the
 * NASA/JPL Small-Body Database and CNEOS, and agency mission pages. EVERY technical
 * field is optional and omitted when not reliably known: designations, orbital
 * periods, perihelion dates, discoverers, meteor-shower links, and mission targets
 * are NEVER invented. Cross-references reuse existing graph entities — the ten comets
 * already modelled, the meteor showers, the small-body missions, and Program Y's
 * dynamical reservoirs (Kuiper Belt, scattered disc, Centaurs) and Chiron — this
 * program duplicates none of them.
 */

export type CometKind =
  | "comet" // individual comet (existing type — reuse where already present)
  | "class" // dynamical class (Jupiter-family, Halley-type, long-period, sungrazing, main-belt)
  | "family" // genetic family (e.g. the Kreutz sungrazers)
  | "reservoir" // source reservoir (Oort cloud, inner Oort cloud)
  | "active-asteroid" // an asteroid that shows cometary activity
  | "dormant-comet" // an extinct / dormant cometary nucleus
  | "mission"; // comet mission not yet in the graph (reused type — no page)

/** The graph EntityType each kind maps to. comet / mission reuse existing types. */
export const KIND_ENTITY_TYPE: Record<CometKind, EntityType> = {
  comet: "comet",
  class: "comet_class",
  family: "comet_family",
  reservoir: "small_body_reservoir",
  "active-asteroid": "active_asteroid",
  "dormant-comet": "dormant_comet",
  mission: "space_mission",
};

export const KIND_LABEL: Record<CometKind, string> = {
  comet: "Comet",
  class: "Comet class",
  family: "Comet family",
  reservoir: "Small-body reservoir",
  "active-asteroid": "Active asteroid",
  "dormant-comet": "Dormant comet",
  mission: "Mission",
};

/** Broad browse category — drives some discovery hubs (not a graph entity). */
export type CometCategory =
  | "periodic"
  | "long-period"
  | "great-comet"
  | "sungrazer"
  | "transition"
  | "reservoir";

export interface CometRecord {
  /* --- identity / graph --- */
  id: string; // "<type>:<slug>"
  slug: string;
  name: string;
  kind: CometKind;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  /** True when this id already exists in the graph (enrich, don't create). */
  existing?: boolean;

  /* --- cross-references (resolved in the index; reuse existing entities) --- */
  familySlug?: string; // → comet_family (member_of_family)
  classSlugs?: string[]; // → comet_class (member_of_group)
  reservoirSlugs?: string[]; // → small_body_reservoir created here (belongs_to_reservoir)
  reusedReservoirKeys?: string[]; // full ids of REUSED reservoirs, e.g. minor_planet_group:scattered-disc
  meteorShowerIds?: string[]; // full meteor_shower ids (source_of_meteor_shower)
  visitedBySlugs?: string[]; // → space_mission (visited_by)
  sampleReturnBySlugs?: string[]; // → space_mission (returned_samples_from)
  targetOfSlugs?: string[]; // → en-route / planned mission (target_of_mission)
  observedBySlugs?: string[]; // → observatory / telescope (observed_by)
  relatedKeys?: string[]; // full ids of existing entities (associated_with)

  /* --- display specs, ALL optional, never invented --- */
  category?: CometCategory;
  designation?: string; // formal designation, e.g. "1P/Halley", "C/1995 O1 (Hale–Bopp)"
  discoveredBy?: string;
  discoveryYear?: string;
  cometTypeLabel?: string; // human class label, e.g. "Jupiter-family comet"

  // orbital
  orbitalPeriodYears?: number;
  perihelionAu?: number;
  aphelionAu?: number;
  eccentricity?: number;
  inclinationDeg?: number;
  perihelionDate?: string; // date of a well-documented perihelion passage
  lastPerihelion?: string;
  nextPerihelion?: string;

  // physical
  nucleusDiameterKm?: number;

  // flags / notes
  greatComet?: boolean;
  sungrazer?: boolean;
  fragmented?: boolean; // has broken into fragments (e.g. 73P, SL9)
  meteorShowerNote?: string; // parent-shower link where the shower is not yet a graph entity

  // reservoir metadata
  regionLabel?: string; // e.g. "≈ 2,000–100,000 AU"
  definition?: string;

  highlights?: string[];
}
