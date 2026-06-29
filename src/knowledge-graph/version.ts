import { GRAPH_STATS } from "@/knowledge-graph/helpers";

/**
 * Knowledge graph version metadata.
 *
 * The graph is the product; these versions give it long-term, machine-readable
 * compatibility. Semantic versioning: bump SCHEMA_VERSION on a breaking change
 * to entity/relation shape; GRAPH_VERSION on any data change; DATASET_VERSION on
 * a published dataset snapshot. Stable entity ids never change across versions.
 */
export const SCHEMA_VERSION = "1.0.0";
export const GRAPH_VERSION = "1.0.0";
export const DATASET_VERSION = "1.0.0";

/** Release date of this graph snapshot (fixed for deterministic builds). */
export const GRAPH_RELEASED = "2026-06-29";

export const GRAPH_VERSION_INFO = {
  graphVersion: GRAPH_VERSION,
  schemaVersion: SCHEMA_VERSION,
  datasetVersion: DATASET_VERSION,
  released: GRAPH_RELEASED,
  entityCount: GRAPH_STATS.entityCount,
  relationCount: GRAPH_STATS.relationCount,
  /** The stable identifier scheme: every entity id is `type:slug`. */
  identifierScheme: "type:slug",
  license: "CC BY-SA 4.0",
} as const;
