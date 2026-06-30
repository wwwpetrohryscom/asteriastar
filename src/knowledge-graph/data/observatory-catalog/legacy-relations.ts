import { HSF_LEGACY_RELATION_IDS } from "@/knowledge-graph/data/human-spaceflight-catalog/legacy-relations";
import { relations as hsfRelations } from "@/knowledge-graph/data/human-spaceflight-catalog";

/**
 * Ids of every relation defined outside the observatory catalog — the
 * human-spaceflight catalog's dedupe set (which already includes the exploration
 * catalog, core relations, and all legacy modules) plus the human-spaceflight
 * catalog's own derived relations. The observatory catalog dedupes against this
 * so it never duplicates an existing edge.
 */
export const OBS_LEGACY_RELATION_IDS: ReadonlySet<string> = new Set([
  ...HSF_LEGACY_RELATION_IDS,
  ...hsfRelations.map((r) => r.id),
]);
