import { LEGACY_RELATION_IDS as EXPLORATION_LEGACY } from "@/knowledge-graph/data/exploration-catalog/legacy-relations";
import { relations as explorationRelations } from "@/knowledge-graph/data/exploration-catalog";

/**
 * Ids of every relation defined outside the human-spaceflight catalog — the
 * exploration catalog's dedupe set (all legacy modules + core relations) plus
 * the exploration catalog's own derived relations. The human-spaceflight
 * catalog dedupes against this so it never duplicates an existing edge.
 */
export const HSF_LEGACY_RELATION_IDS: ReadonlySet<string> = new Set([
  ...EXPLORATION_LEGACY,
  ...explorationRelations.map((r) => r.id),
]);
