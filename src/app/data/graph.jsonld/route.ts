import { entities, relations, GRAPH_VERSION_INFO, entityGraphPath } from "@/knowledge-graph";
import { absoluteUrl } from "@/lib/routes";

/**
 * JSON-LD export of the knowledge graph (RDF-compatible, SPARQL-ready shape).
 * Statically generated from the real graph. Served at /data/graph.jsonld.
 * Each entity is a node with a resolvable @id; outgoing relations are embedded
 * as predicates grouped by relation type.
 */
export const dynamic = "force-static";

const VOCAB = "https://asteriastar.com/schema#";

export function GET(): Response {
  // Build a resolvable IRI per entity (entry path if present, else graph page).
  const iriById = new Map(entities.map((e) => [e.id, absoluteUrl(entityGraphPath(e))]));
  const resolve = (id: string) => iriById.get(id) ?? `${VOCAB}${id}`;

  // Group outgoing relations by type for each entity.
  const outgoing = new Map<string, Record<string, string[]>>();
  for (const r of relations) {
    const node = outgoing.get(r.from) ?? {};
    (node[r.type] ??= []).push(resolve(r.to));
    outgoing.set(r.from, node);
  }

  const graph = entities.map((e) => ({
    "@id": resolve(e.id),
    "@type": e.type,
    identifier: e.id,
    name: e.name,
    ...(e.description ? { description: e.description } : {}),
    domain: e.domain,
    ...(outgoing.get(e.id) ?? {}),
  }));

  const doc = {
    "@context": {
      "@vocab": VOCAB,
      name: "http://schema.org/name",
      description: "http://schema.org/description",
      identifier: "http://schema.org/identifier",
    },
    version: GRAPH_VERSION_INFO,
    "@graph": graph,
  };

  return new Response(JSON.stringify(doc), {
    headers: { "Content-Type": "application/ld+json; charset=utf-8" },
  });
}
