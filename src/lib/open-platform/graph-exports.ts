import { entities, relations, GRAPH_VERSION_INFO, entityGraphPath } from "@/knowledge-graph";
import { absoluteUrl } from "@/lib/routes";

/**
 * Canonical serialisers for the machine-readable knowledge-graph exports (Program BX). Both the export
 * routes (/data/graph.json, /data/graph.jsonld) AND the download manifest use these, so a download's
 * advertised size and checksum are computed from EXACTLY the bytes that are served — never fabricated.
 * The content is the real typed graph; nothing is invented.
 */

const VOCAB = "https://asteriastar.com/schema#";

/** The canonical JSON export: the real entities and relations with the graph version. */
export function buildGraphJson(): string {
  return JSON.stringify({ version: GRAPH_VERSION_INFO, entities, relations });
}

/** The canonical JSON-LD export: an RDF-compatible, SPARQL-ready node-per-entity document. */
export function buildGraphJsonLd(): string {
  const iriById = new Map(entities.map((e) => [e.id, absoluteUrl(entityGraphPath(e))]));
  const resolve = (id: string) => iriById.get(id) ?? `${VOCAB}${id}`;

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
  return JSON.stringify(doc);
}
