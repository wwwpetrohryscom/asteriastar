/**
 * Scientific review model (architecture only — no backend, no auth).
 *
 * The typed model for how an entity is reviewed for scientific and editorial
 * accuracy. The registry ships EMPTY — no fabricated review history. An entity
 * with no record is honestly "unreviewed".
 */

export type ReviewStatus = "unreviewed" | "in-review" | "reviewed" | "verified" | "needs-update";

export type AccuracyStatus = "unverified" | "accurate" | "needs-correction" | "disputed";

export type VerificationLevel = "none" | "basic" | "sourced" | "peer-aligned";

export const REVIEW_STATUSES: ReviewStatus[] = [
  "unreviewed",
  "in-review",
  "reviewed",
  "verified",
  "needs-update",
];

export const ACCURACY_STATUSES: AccuracyStatus[] = [
  "unverified",
  "accurate",
  "needs-correction",
  "disputed",
];

export const VERIFICATION_LEVELS: VerificationLevel[] = ["none", "basic", "sourced", "peer-aligned"];

export const REVIEW_STATUS_LABELS: Record<ReviewStatus, string> = {
  unreviewed: "Unreviewed",
  "in-review": "In review",
  reviewed: "Reviewed",
  verified: "Verified",
  "needs-update": "Needs update",
};

export const REVIEW_STATUS_ACCENT: Record<ReviewStatus, string> = {
  unreviewed: "stone",
  "in-review": "comet",
  reviewed: "halo",
  verified: "halo",
  "needs-update": "ember",
};

export interface EntityReview {
  entityId: string;
  status: ReviewStatus;
  reviewedBy?: string;
  reviewDate?: string;
  reviewVersion?: string;
  notes?: string;
  scientificAccuracy?: AccuracyStatus;
  editorialAccuracy?: AccuracyStatus;
  verificationLevel?: VerificationLevel;
  /** e.g. "annual", "on-change". */
  reviewCycle?: string;
}

/** No fabricated review history — entities are honestly unreviewed until reviewed. */
export const REVIEWS: EntityReview[] = [];

const BY_ENTITY = new Map<string, EntityReview>(REVIEWS.map((r) => [r.entityId, r]));

export function getReviewForEntity(entityId: string): EntityReview | undefined {
  return BY_ENTITY.get(entityId);
}

/** The review status of an entity, defaulting to "unreviewed". */
export function reviewStatusFor(entityId: string): ReviewStatus {
  return BY_ENTITY.get(entityId)?.status ?? "unreviewed";
}

export function validateReviews(
  reviews: EntityReview[] = REVIEWS,
  entityIds?: Set<string>,
): string[] {
  const issues: string[] = [];
  const seen = new Set<string>();
  for (const r of reviews) {
    if (seen.has(r.entityId)) issues.push(`duplicate review for entity: ${r.entityId}`);
    seen.add(r.entityId);
    if (!REVIEW_STATUSES.includes(r.status)) issues.push(`${r.entityId}: invalid review status "${r.status}"`);
    if (r.scientificAccuracy && !ACCURACY_STATUSES.includes(r.scientificAccuracy))
      issues.push(`${r.entityId}: invalid scientific accuracy "${r.scientificAccuracy}"`);
    if (r.editorialAccuracy && !ACCURACY_STATUSES.includes(r.editorialAccuracy))
      issues.push(`${r.entityId}: invalid editorial accuracy "${r.editorialAccuracy}"`);
    if (r.verificationLevel && !VERIFICATION_LEVELS.includes(r.verificationLevel))
      issues.push(`${r.entityId}: invalid verification level "${r.verificationLevel}"`);
    if (entityIds && !entityIds.has(r.entityId)) issues.push(`${r.entityId}: review references unknown entity`);
  }
  return issues;
}

export const REVIEW_STATS = {
  total: REVIEWS.length,
  reviewed: REVIEWS.filter((r) => r.status === "reviewed" || r.status === "verified").length,
} as const;
