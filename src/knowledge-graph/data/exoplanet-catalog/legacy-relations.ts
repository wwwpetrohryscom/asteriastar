import { OBS_LEGACY_RELATION_IDS } from "@/knowledge-graph/data/observatory-catalog/legacy-relations";
import { relations as obsRelations } from "@/knowledge-graph/data/observatory-catalog";

/**
 * Ids of every relation defined outside the exoplanet catalog — the observatory
 * catalog's dedupe set (which already includes the human-spaceflight and
 * exploration catalogs, core relations, and all legacy modules) plus the
 * observatory catalog's own derived relations. The exoplanet catalog dedupes
 * against this so it never duplicates an existing edge.
 */
export const EXO_LEGACY_RELATION_IDS: ReadonlySet<string> = new Set([
  ...OBS_LEGACY_RELATION_IDS,
  ...obsRelations.map((r) => r.id),
]);
