import { buildGraphJsonLd } from "@/lib/open-platform/graph-exports";

/**
 * JSON-LD export of the knowledge graph (RDF-compatible, SPARQL-ready shape).
 * Statically generated from the real graph. Served at /data/graph.jsonld.
 * Each entity is a node with a resolvable @id; outgoing relations are embedded
 * as predicates grouped by relation type. The same serialiser backs the download
 * manifest, so the advertised size and checksum match the served bytes.
 */
export const dynamic = "force-static";

export function GET(): Response {
  return new Response(buildGraphJsonLd(), {
    headers: { "Content-Type": "application/ld+json; charset=utf-8" },
  });
}
