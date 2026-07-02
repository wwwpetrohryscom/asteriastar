import {
  CONTRIBUTION_TYPES,
  CONTRIBUTION_TYPE_BY_ID,
  type ContributionType,
  type ImpactCategory,
} from "@/platform/contributions/schema";

/**
 * Quality-impact model.
 *
 * An accepted contribution can improve specific, DETERMINISTIC quality
 * dimensions — never a fabricated score. These categories align with the
 * Authority layer's QualityDimension coverage model, extended with scientific
 * and historical accuracy. This module only classifies WHICH dimensions a
 * contribution type can improve; it never computes a number.
 */

export const IMPACT_CATEGORIES: ImpactCategory[] = [
  "sourceCoverage",
  "citationCoverage",
  "relationshipCoverage",
  "reviewCoverage",
  "imageCoverage",
  "localizationCoverage",
  "datasetCompleteness",
  "scientificAccuracy",
  "historicalAccuracy",
];

export const IMPACT_CATEGORY_LABELS: Record<ImpactCategory, string> = {
  sourceCoverage: "Source coverage",
  citationCoverage: "Citation coverage",
  relationshipCoverage: "Relationship coverage",
  reviewCoverage: "Review coverage",
  imageCoverage: "Image coverage",
  localizationCoverage: "Localization coverage",
  datasetCompleteness: "Dataset completeness",
  scientificAccuracy: "Scientific accuracy",
  historicalAccuracy: "Historical accuracy",
};

export const IMPACT_CATEGORY_DESCRIPTIONS: Record<ImpactCategory, string> = {
  sourceCoverage: "More entities and relationships are backed by an authoritative source.",
  citationCoverage: "More claims carry a formal, resolvable citation.",
  relationshipCoverage: "The graph gains correct, typed relationships between entities.",
  reviewCoverage: "More of the graph has been checked by an editor or scientific reviewer.",
  imageCoverage: "More entities have a verified, properly-provenanced image.",
  localizationCoverage: "More entities have accurate titles and descriptions in more languages.",
  datasetCompleteness: "Published datasets become more complete and correct.",
  scientificAccuracy: "Factual values and relationships better match current science.",
  historicalAccuracy: "Dates, events, and discoveries better match the historical record.",
};

/** The quality dimensions an accepted contribution of this type can improve. */
export function contributionImpact(type: ContributionType): ImpactCategory[] {
  return CONTRIBUTION_TYPE_BY_ID[type]?.impact ?? [];
}

/** For a given quality dimension, which contribution types can improve it. */
export function contributionsForImpact(category: ImpactCategory): ContributionType[] {
  return CONTRIBUTION_TYPES.filter((t) => t.impact.includes(category)).map((t) => t.id);
}

/** Self-check: every declared impact category is a known category. */
export function validateImpactModel(): string[] {
  const issues: string[] = [];
  const known = new Set<ImpactCategory>(IMPACT_CATEGORIES);
  for (const t of CONTRIBUTION_TYPES) {
    for (const c of t.impact) {
      if (!known.has(c)) issues.push(`contribution type ${t.id} declares unknown impact category '${c}'`);
    }
  }
  for (const c of IMPACT_CATEGORIES) {
    if (!(c in IMPACT_CATEGORY_LABELS)) issues.push(`impact category ${c} missing a label`);
  }
  return issues;
}
