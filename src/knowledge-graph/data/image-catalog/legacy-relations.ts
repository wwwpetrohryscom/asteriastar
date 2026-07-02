import { COSMOLOGY_LEGACY_RELATION_IDS } from "@/knowledge-graph/data/cosmology-catalog/legacy-relations";
import { relations as cosmologyRelations } from "@/knowledge-graph/data/cosmology-catalog";

/**
 * Every relation id defined by earlier catalogs in the dedup chain. The image
 * catalog skips emitting any relation already present so the graph never holds
 * a duplicate edge. The chain's previous link is the cosmology catalog (the most
 * recent catalog to add graph entities; the Live Sky layer added none).
 */
export const IMAGE_LEGACY_RELATION_IDS: ReadonlySet<string> = new Set([
  ...COSMOLOGY_LEGACY_RELATION_IDS,
  ...cosmologyRelations.map((r) => r.id),
]);
