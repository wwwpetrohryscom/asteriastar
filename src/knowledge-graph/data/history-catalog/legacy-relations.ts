import { EXO_LEGACY_RELATION_IDS } from "@/knowledge-graph/data/exoplanet-catalog/legacy-relations";
import { relations as exoRelations } from "@/knowledge-graph/data/exoplanet-catalog";

/**
 * Every relation id defined by earlier catalogs in the dedup chain. The history
 * catalog skips emitting any relation already present so the graph never holds
 * a duplicate edge. The chain's previous link is the exoplanet catalog.
 */
export const HISTORY_LEGACY_RELATION_IDS: ReadonlySet<string> = new Set([
  ...EXO_LEGACY_RELATION_IDS,
  ...exoRelations.map((r) => r.id),
]);
