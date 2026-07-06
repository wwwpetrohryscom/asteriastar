import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Deep-Space Human Exploration & Habitation data model (Program BI) — the architecture of sending
 * humans beyond low Earth orbit to stay, and the challenges of keeping them alive and well far from
 * home. This domain is heavily served by existing catalogs, so it REUSES the Artemis program, the
 * Lunar Gateway, in-situ resource utilisation and regolith processing, the ECLSS, closed-loop and
 * bioregenerative life support and space agriculture, the countermeasures (radiation shielding,
 * artificial gravity, exercise, psychological support, telemedicine), the inflatable habitat, the
 * surface-operations phase, nuclear-thermal propulsion, the construction processes, planetary
 * protection, the Deep Space Network, and the space-medicine and human-factors topics. The new
 * entities are the deep-space mission/habitation architectures and the integrative human challenges.
 * Nothing is fabricated; only well-established plans and physics are stated, and unknown values are
 * left empty.
 */

export type DeepExplorationKind =
  | "architecture" // a deep-space mission or habitation architecture
  | "challenge"; // an integrative human challenge of deep-space flight

export const KIND_ENTITY_TYPE: Record<DeepExplorationKind, EntityType> = {
  architecture: "exploration_architecture",
  challenge: "deep_space_challenge",
};

export const KIND_LABEL: Record<DeepExplorationKind, string> = {
  architecture: "Exploration architecture",
  challenge: "Deep-space challenge",
};

export interface DeepExplorationRecord {
  id: string;
  slug: string;
  name: string;
  kind: DeepExplorationKind;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  existing?: boolean;

  /* cross-references */
  relatedKeys?: string[]; // full ids of REUSED or new entities (associated_with)

  /* display */
  symbolLabel?: string; // e.g. "~20 min each way" — only when well established
  definition?: string;
  highlights?: string[];
}
