import type { ProfileId } from "@/lib/community/ids";

/**
 * Reputation model — ARCHITECTURE ONLY.
 *
 * Reputation is explicitly NOT based on likes, followers, or engagement. It is
 * earned through scientific contribution quality. These are the dimensions the
 * future system would score; no values are computed or stored here.
 */

export const REPUTATION_DIMENSIONS = [
  "verified_sources",
  "accepted_contributions",
  "observation_quality",
  "reference_quality",
  "graph_contributions",
  "educational_content",
  "scientific_accuracy",
  "community_trust",
] as const;
export type ReputationDimension = (typeof REPUTATION_DIMENSIONS)[number];

export const REPUTATION_DIMENSION_LABELS: Record<ReputationDimension, string> = {
  verified_sources: "Verified sources",
  accepted_contributions: "Accepted contributions",
  observation_quality: "Observation quality",
  reference_quality: "Reference quality",
  graph_contributions: "Graph contributions",
  educational_content: "Educational content",
  scientific_accuracy: "Scientific accuracy",
  community_trust: "Community trust",
};

export interface Reputation {
  profileId: ProfileId;
  /** Per-dimension scores (0–1), computed by a future system. Empty by default. */
  scores: Partial<Record<ReputationDimension, number>>;
}

/** Explicitly excluded signals — documented so they are never added. */
export const EXCLUDED_REPUTATION_SIGNALS = [
  "likes",
  "followers",
  "reactions",
  "view counts",
  "trending",
] as const;
