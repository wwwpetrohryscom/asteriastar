import { entities, relations, GRAPH_VERSION_INFO } from "@/knowledge-graph";

/**
 * Machine-readable export of the canonical knowledge graph (JSON).
 * Statically generated from the real typed graph — not fabricated. Served at
 * /data/graph.json.
 */
export const dynamic = "force-static";

export function GET(): Response {
  return Response.json({
    version: GRAPH_VERSION_INFO,
    entities,
    relations,
  });
}
