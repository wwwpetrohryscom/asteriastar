import {
  getRelationsForEntity,
  entityGraphPath,
  type GraphEntity,
} from "@/knowledge-graph";
import { getImagesForEntity } from "@/lib/media/registry";
import { TIMELINES } from "@/lib/timelines";
import { ENTITY_LOCALIZATIONS } from "@/platform/localization";
import { getReviewForEntity } from "@/platform/authority/review";
import { PROVENANCE } from "@/platform/authority/provenance";

/**
 * Data quality framework.
 *
 * Quality is NOT an invented score — it is structured completeness derived from
 * what actually exists for an entity (sources, relationships, review, images,
 * timeline, localization, citations/provenance). Honest gaps stay visible.
 */

export type CoverageLevel = "complete" | "partial" | "none";

export type QualityDimension =
  | "completeness"
  | "sourceCoverage"
  | "citationCoverage"
  | "relationshipCoverage"
  | "reviewCoverage"
  | "imageCoverage"
  | "timelineCoverage"
  | "localizationCoverage";

export const QUALITY_DIMENSION_LABELS: Record<QualityDimension, string> = {
  completeness: "Completeness",
  sourceCoverage: "Source coverage",
  citationCoverage: "Citation coverage",
  relationshipCoverage: "Relationship coverage",
  reviewCoverage: "Review coverage",
  imageCoverage: "Image coverage",
  timelineCoverage: "Timeline coverage",
  localizationCoverage: "Localization coverage",
};

export interface EntityQuality {
  entityId: string;
  indicators: Record<QualityDimension, CoverageLevel>;
  /** Derived from indicators (complete = 1, partial = 0.5, none = 0). */
  completenessPercent: number;
  overall: CoverageLevel;
}

const DIMENSIONS: QualityDimension[] = [
  "completeness",
  "sourceCoverage",
  "citationCoverage",
  "relationshipCoverage",
  "reviewCoverage",
  "imageCoverage",
  "timelineCoverage",
  "localizationCoverage",
];

// Build a path → timeline-presence index once.
const TIMELINE_PATHS = new Set<string>();
for (const t of TIMELINES) for (const ev of t.events) if (ev.href) TIMELINE_PATHS.add(ev.href);

const LOCALIZED_ENTITY_IDS = new Set(ENTITY_LOCALIZATIONS.map((t) => t.entityId));
const PROVENANCE_ENTITY_IDS = new Set(PROVENANCE.map((p) => p.entityId));

function level(n: number, partialAt = 1, completeAt = 3): CoverageLevel {
  if (n >= completeAt) return "complete";
  if (n >= partialAt) return "partial";
  return "none";
}

/** Compute structured completeness indicators for an entity (real data only). */
export function computeEntityQuality(entity: GraphEntity): EntityQuality {
  const path = entityGraphPath(entity);
  const review = getReviewForEntity(entity.id);
  const reviewLevel: CoverageLevel =
    review?.status === "verified" || review?.status === "reviewed"
      ? "complete"
      : review?.status === "in-review"
        ? "partial"
        : "none";

  const indicators: Record<QualityDimension, CoverageLevel> = {
    completeness: entity.description ? "complete" : "partial",
    sourceCoverage: level(entity.sources?.length ?? 0, 1, 2),
    citationCoverage: PROVENANCE_ENTITY_IDS.has(entity.id) ? "complete" : "none",
    relationshipCoverage: level(getRelationsForEntity(entity.id).length),
    reviewCoverage: reviewLevel,
    imageCoverage: getImagesForEntity(entity.id).length > 0 ? "complete" : "none",
    timelineCoverage:
      TIMELINE_PATHS.has(path) || (entity.entryPath ? TIMELINE_PATHS.has(entity.entryPath) : false)
        ? "complete"
        : "none",
    localizationCoverage: LOCALIZED_ENTITY_IDS.has(entity.id) ? "complete" : "none",
  };

  const weight = (l: CoverageLevel) => (l === "complete" ? 1 : l === "partial" ? 0.5 : 0);
  const score = DIMENSIONS.reduce((sum, d) => sum + weight(indicators[d]), 0) / DIMENSIONS.length;
  const completenessPercent = Math.round(score * 100);
  const overall: CoverageLevel = score >= 0.6 ? "complete" : score >= 0.3 ? "partial" : "none";

  return { entityId: entity.id, indicators, completenessPercent, overall };
}

export const COVERAGE_ACCENT: Record<CoverageLevel, string> = {
  complete: "halo",
  partial: "comet",
  none: "stone",
};

export const COVERAGE_LABELS: Record<CoverageLevel, string> = {
  complete: "Complete",
  partial: "Partial",
  none: "None",
};
