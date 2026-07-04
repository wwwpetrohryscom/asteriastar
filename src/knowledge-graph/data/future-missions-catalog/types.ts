import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Future Space Exploration & Mission Concepts Encyclopedia data model (Program AN) — official
 * and highly-credible planned missions and mission concepts. It REUSES the missions already
 * in the graph that are in development or en route (Europa Clipper, MMX, Comet Interceptor,
 * JUICE, Mars Sample Return, the Roman telescope) and the agencies and target bodies; the new
 * entities are the exploration themes and the mission concepts not yet modelled. Only official
 * or credible concepts are included, each with an honest status; nothing is fabricated, and
 * uncertainties are stated plainly.
 */

export type ConceptKind =
  | "theme" // a theme of future exploration (the grouping)
  | "concept"; // a planned mission or mission concept

export const KIND_ENTITY_TYPE: Record<ConceptKind, EntityType> = {
  theme: "exploration_theme",
  concept: "mission_concept",
};

export const KIND_LABEL: Record<ConceptKind, string> = {
  theme: "Theme",
  concept: "Mission concept",
};

/** Honest programmatic status — never overstated. */
export type ConceptStatus = "concept" | "proposed" | "under-study" | "selected" | "in-development" | "planned" | "en-route";

export const STATUS_LABEL: Record<ConceptStatus, string> = {
  concept: "Concept",
  proposed: "Proposed",
  "under-study": "Under study",
  selected: "Selected",
  "in-development": "In development",
  planned: "Planned",
  "en-route": "En route",
};

export interface ConceptRecord {
  id: string;
  slug: string;
  name: string;
  kind: ConceptKind;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  existing?: boolean;

  /* cross-references */
  themeSlug?: string; // → exploration_theme (member_of_group) — for concepts
  agencyKey?: string; // organization id (associated_with)
  targetKey?: string; // body id (associated_with) — planet/moon/etc.
  relatedKeys?: string[]; // other reused ids (associated_with)

  /* the required concept fields (mission spec) */
  status?: ConceptStatus;
  timelineLabel?: string; // e.g. "Launch ~2028" — only when publicly stated
  goals?: string[];
  technology?: string;
  uncertainties?: string;

  /* display */
  definition?: string;
  highlights?: string[];
}
