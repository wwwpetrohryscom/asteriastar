import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Meteors, Meteorites & Fireballs Encyclopedia data model (Program AA) — the capstone
 * of the small-bodies trilogy (Program Y asteroids → Program Z comets → AA).
 *
 * Hand-curated from authoritative public sources — the Meteoritical Society's
 * Meteoritical Bulletin Database, NASA/JPL, and NASA CNEOS fireball data. EVERY field
 * is optional and omitted when not reliably known: classifications, fall dates,
 * recovery locations, masses, parent-body links, and impact energies are NEVER
 * invented. Cross-references reuse existing graph entities — the parent asteroid Vesta
 * (Program Y), Mars and the Moon, the impact events, and the meteor showers — this
 * program duplicates none of them.
 */

export type MeteoriteKind =
  | "meteorite" // an individual meteorite
  | "class" // top-level class (chondrite, achondrite, iron, stony-iron)
  | "group" // a group within a class (carbonaceous, HED, martian, pallasite…)
  | "fireball" // a bright atmospheric-entry event (bolide when it detonates)
  | "impact-structure" // a terrestrial impact crater / structure
  | "recovery-site"; // a strewn field / recovery location

export const KIND_ENTITY_TYPE: Record<MeteoriteKind, EntityType> = {
  meteorite: "meteorite",
  class: "meteorite_class",
  group: "meteorite_group",
  fireball: "fireball",
  "impact-structure": "impact_structure",
  "recovery-site": "recovery_site",
};

export const KIND_LABEL: Record<MeteoriteKind, string> = {
  meteorite: "Meteorite",
  class: "Meteorite class",
  group: "Meteorite group",
  fireball: "Fireball",
  "impact-structure": "Impact structure",
  "recovery-site": "Recovery site",
};

/** Broad browse category — drives some discovery hubs (not a graph entity). */
export type MeteoriteCategory =
  | "chondrite"
  | "achondrite"
  | "iron"
  | "stony-iron"
  | "fireball"
  | "impact-structure";

export interface MeteoriteRecord {
  /* --- identity / graph --- */
  id: string; // "<type>:<slug>"
  slug: string;
  name: string;
  kind: MeteoriteKind;
  altNames?: string[];
  description: string;
  sources: SourceKey[];

  /* --- cross-references (resolved in the index; reuse existing entities) --- */
  groupSlug?: string; // meteorite → its group (member_of_group)
  classSlug?: string; // meteorite → a class directly, e.g. an iron (member_of_group)
  partOfClassSlug?: string; // group → its class (part_of)
  parentBodyKeys?: string[]; // full ids of the parent body (parent_body): asteroid:vesta, planet:mars, moon:the-moon
  recoverySiteSlug?: string; // meteorite → its strewn field (located_at)
  fireballKeys?: string[]; // full ids of the fireball / impact event it came from (associated_with)
  relatedKeys?: string[]; // full ids of other existing entities (associated_with)

  /* --- display specs, ALL optional, never invented --- */
  category?: MeteoriteCategory;
  classificationLabel?: string; // e.g. "CV3 carbonaceous chondrite", "IIAB iron"
  fallType?: "fall" | "find"; // observed fall vs later find
  fallDate?: string;
  location?: string; // fall / find / structure location
  country?: string;
  massLabel?: string; // e.g. "~ 60 t (largest single meteorite)"
  discoveryYear?: string;

  // fireball
  bolide?: boolean;
  energyLabel?: string; // e.g. "~ 440–500 kt TNT"

  // impact structure
  diameterLabel?: string;
  ageLabel?: string;

  // group / class metadata
  definition?: string;

  highlights?: string[];
}
