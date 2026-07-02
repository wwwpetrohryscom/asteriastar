/**
 * Scientific review model.
 *
 * The typed model for how an entity is reviewed for scientific and editorial
 * accuracy. Program N seeds the first real reviews for flagship entities, all
 * performed by the internal Asteria Scientific Review Process — never a
 * fabricated external reviewer. An entity with no record is honestly "unreviewed".
 */
import { SEED_REVIEWS } from "@/platform/authority/data/flagship-reviews";

export type ReviewStatus = "unreviewed" | "in-review" | "reviewed" | "verified" | "needs-update";

/**
 * The recognised review identities. Reviews may only claim one of these — an
 * internal Asteria review process — so no fabricated external reviewer name can
 * ever appear. A real, sourced external reviewer would be added here explicitly.
 */
export const INTERNAL_REVIEW_IDENTITIES = [
  "Asteria Scientific Review Process",
  "Asteria Editorial Review",
] as const;

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

/**
 * Real entity reviews. Program N seeds the first batch (SEED_REVIEWS) for
 * flagship entities via the internal Asteria Scientific Review Process. Entities
 * without a record remain honestly "unreviewed".
 */
export const REVIEWS: EntityReview[] = [...SEED_REVIEWS];

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

    // A reviewed/verified entity must name a real (internal) review identity —
    // never a fabricated external reviewer.
    if (r.status === "reviewed" || r.status === "verified") {
      if (!r.reviewedBy?.trim()) issues.push(`${r.entityId}: reviewed entity has no reviewer identity`);
      else if (!(INTERNAL_REVIEW_IDENTITIES as readonly string[]).includes(r.reviewedBy))
        issues.push(`${r.entityId}: unrecognized reviewer identity "${r.reviewedBy}" (no fabricated external reviewers)`);
      if (!r.reviewVersion?.trim()) issues.push(`${r.entityId}: reviewed entity has no review version`);
    }
  }
  return issues;
}

export const REVIEW_STATS = {
  total: REVIEWS.length,
  reviewed: REVIEWS.filter((r) => r.status === "reviewed" || r.status === "verified").length,
} as const;
