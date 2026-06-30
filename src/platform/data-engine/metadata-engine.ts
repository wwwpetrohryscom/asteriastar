import { buildEntityMetadata, type EntityMetadata } from "@/platform/metadata";
import type { RuntimeEntity } from "@/platform/runtime";

/**
 * Metadata Engine — the single generator for all metadata facets (SEO, Open
 * Graph, JSON-LD/machine, citation, dataset, canonical). Delegates to the
 * Phase 8 universal metadata generator so there are no duplicate generators.
 */
export const metadataEngine = {
  for: (rt: RuntimeEntity): EntityMetadata => buildEntityMetadata(rt),
};
