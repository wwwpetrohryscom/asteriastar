import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Astrobiology, Biosignatures & the Search for Life data model (Program AR). It REUSES the
 * ocean-world moons (Europa, Enceladus, Titan), Mars, the habitable-zone concept, the SETI
 * Institute, the life-search missions (Europa Clipper, Dragonfly, Perseverance), the ocean-worlds
 * exploration theme, spectroscopy, and the closed-loop life-support technology already in the
 * graph; the new entities are the astrobiology disciplines, the biosignatures, the habitability
 * factors, and the planetary-protection measures. Nothing is fabricated; the search for life is
 * presented as science — biosignatures are potential, and false positives are treated seriously.
 */

export type AstrobiologyKind =
  | "topic" // a discipline of astrobiology (the grouping)
  | "biosignature" // a class of biosignature or technosignature
  | "factor" // a factor of planetary habitability
  | "protection"; // a planetary-protection measure

export const KIND_ENTITY_TYPE: Record<AstrobiologyKind, EntityType> = {
  topic: "astrobiology_topic",
  biosignature: "biosignature",
  factor: "habitability_factor",
  protection: "planetary_protection",
};

export const KIND_LABEL: Record<AstrobiologyKind, string> = {
  topic: "Discipline",
  biosignature: "Biosignature",
  factor: "Habitability factor",
  protection: "Planetary protection",
};

export interface AstrobiologyRecord {
  id: string;
  slug: string;
  name: string;
  kind: AstrobiologyKind;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  existing?: boolean;

  /* cross-references */
  topicSlug?: string; // → astrobiology_topic (member_of_group) — for non-topic kinds
  relatedKeys?: string[]; // full ids of REUSED entities (associated_with)

  /* display */
  definition?: string;
  highlights?: string[];
}
