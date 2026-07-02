import { HISTORY_LEGACY_RELATION_IDS } from "@/knowledge-graph/data/history-catalog/legacy-relations";
import { relations as historyRelations } from "@/knowledge-graph/data/history-catalog";

/**
 * Every relation id defined by earlier catalogs in the dedup chain. The
 * cosmology catalog skips emitting any relation already present so the graph
 * never holds a duplicate edge. The chain's previous link is the history catalog.
 */
export const COSMOLOGY_LEGACY_RELATION_IDS: ReadonlySet<string> = new Set([
  ...HISTORY_LEGACY_RELATION_IDS,
  ...historyRelations.map((r) => r.id),
]);
