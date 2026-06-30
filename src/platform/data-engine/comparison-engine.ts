import {
  COMPARISONS,
  getComparison,
  resolveSide,
  getSharedConnections,
  getComparisonSources,
  type Comparison,
} from "@/lib/compare";

/**
 * Comparison Engine — reusable, rule-produced comparisons. Delegates to the
 * comparison registry and its resolver/shared-connection logic.
 */
export const comparisonEngine = {
  all: (): Comparison[] => COMPARISONS,
  get: (slug: string): Comparison | undefined => getComparison(slug),
  resolveSide,
  sharedConnections: getSharedConnections,
  sources: getComparisonSources,
};
