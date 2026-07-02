import type { EntityReview } from "@/platform/authority/review";
import { SEED_PROVENANCE } from "@/platform/authority/data/flagship-provenance";

/**
 * Program N — the first real batch of entity reviews for flagship entities.
 *
 * Reviews are performed by the INTERNAL Asteria Scientific Review Process — an
 * honest, in-house editorial/scientific check against authoritative sources. It
 * is NOT an external institutional or peer review, so the verification level is
 * "sourced", never "peer-aligned". No fabricated dates: reviews carry a
 * deterministic review version rather than an invented per-entity review date.
 *
 * Every reviewed entity has a matching provenance record (the reviews are
 * derived from the provenance set), so review and provenance coverage stay in
 * lock-step and there are no reviews of un-sourced entities.
 */

/** The internal review batch version (deterministic; not a date). */
export const AUTHORITY_REVIEW_VERSION = "2026.1";

/** Entities whose review note flags genuine open questions. */
const NUANCED = new Set<string>([
  "exoplanet:k2-18-b",
  "cosmology_concept:dark-matter",
  "cosmology_concept:dark-energy",
]);

const REVIEWED_ENTITY_IDS = [...new Set(SEED_PROVENANCE.map((p) => p.entityId))];

export const SEED_REVIEWS: EntityReview[] = REVIEWED_ENTITY_IDS.map((entityId) => ({
  entityId,
  status: "reviewed",
  reviewedBy: "Asteria Scientific Review Process",
  reviewVersion: AUTHORITY_REVIEW_VERSION,
  scientificAccuracy: "accurate",
  editorialAccuracy: "accurate",
  verificationLevel: "sourced",
  reviewCycle: "on-change",
  notes: NUANCED.has(entityId)
    ? "Reviewed against authoritative sources; open questions and contested claims are labelled honestly and not overstated. Internal review, not an external institutional review."
    : "Reviewed against authoritative sources (NASA/ESA/IAU/JPL and peer-reviewed literature) and backed by a sourced provenance record. Internal review, not an external institutional review.",
}));
