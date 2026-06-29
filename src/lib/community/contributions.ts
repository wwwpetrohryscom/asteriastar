import type { ContributionId, EntityRef, ProfileId } from "@/lib/community/ids";

/**
 * Contribution model — ARCHITECTURE ONLY. There is no editing workflow yet.
 * Contributions enrich the knowledge graph; every contribution targets a graph
 * entity (or proposes a new one). Knowledge first: contributions are reviewed
 * for scientific accuracy before they would ever change the graph.
 */

export const CONTRIBUTION_TYPES = [
  "observation",
  "photo",
  "correction",
  "translation",
  "source",
  "timeline_improvement",
  "new_relationship",
  "new_entity_suggestion",
] as const;
export type ContributionType = (typeof CONTRIBUTION_TYPES)[number];

export const CONTRIBUTION_TYPE_LABELS: Record<ContributionType, string> = {
  observation: "Observation",
  photo: "Photo",
  correction: "Correction",
  translation: "Translation",
  source: "Additional source",
  timeline_improvement: "Timeline improvement",
  new_relationship: "New relationship",
  new_entity_suggestion: "New entity suggestion",
};

/** Review states a contribution would move through (no workflow implemented). */
export type ContributionStatus = "draft" | "submitted" | "under_review" | "accepted" | "declined";

export interface Contribution {
  id: ContributionId;
  contributorProfileId: ProfileId;
  type: ContributionType;
  /** The graph entity this enriches (absent only for new-entity suggestions). */
  targetEntity?: EntityRef;
  summary: string;
  status: ContributionStatus;
  /** Source/reference URLs supporting the contribution. */
  references?: string[];
}
