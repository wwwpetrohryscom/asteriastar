import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Life Support, Space Biology & Space Medicine Encyclopedia data model (Program AL) — the
 * human-in-space scientific layer. It REUSES the ECLSS life-support system, the radiation
 * environments, the space stations, the crew-systems subsystem, and the astronauts already
 * in the graph; the new entities are the space-biology disciplines, the physiological effects
 * of spaceflight, the life-support technologies, and the countermeasures. Nothing is
 * fabricated — quantitative figures are omitted unless well established.
 */

export type MedKind =
  | "topic" // a discipline of space life science (the grouping the others belong to)
  | "effect" // a physiological effect of spaceflight on the body
  | "technology" // a life-support technology (part of ECLSS)
  | "countermeasure"; // a countermeasure that protects crew health

export const KIND_ENTITY_TYPE: Record<MedKind, EntityType> = {
  topic: "space_biology_topic",
  effect: "physiological_effect",
  technology: "life_support_technology",
  countermeasure: "countermeasure",
};

export const KIND_LABEL: Record<MedKind, string> = {
  topic: "Discipline",
  effect: "Physiological effect",
  technology: "Life-support technology",
  countermeasure: "Countermeasure",
};

export type MedCategory =
  | "discipline"
  | "musculoskeletal"
  | "cardiovascular"
  | "neuro-ocular"
  | "neurovestibular"
  | "immune"
  | "radiation"
  | "behavioral"
  | "atmosphere"
  | "water-waste"
  | "food"
  | "exercise"
  | "medical"
  | "shielding";

export interface MedRecord {
  id: string;
  slug: string;
  name: string;
  kind: MedKind;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  existing?: boolean;

  /* cross-references */
  topicSlug?: string; // → space_biology_topic (member_of_group) — for effect/technology/countermeasure
  mitigatesSlugs?: string[]; // effect slugs a countermeasure mitigates (→ mitigates relation)
  partOfEclss?: boolean; // technology → part_of life_support_system:eclss
  relatedKeys?: string[]; // full ids of REUSED entities (associated_with)

  /* display */
  category?: MedCategory;
  definition?: string;
  highlights?: string[];
}
