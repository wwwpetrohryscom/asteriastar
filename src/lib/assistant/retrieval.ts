import { getEntityById, getConnectionsByDomain, entityGraphPath, type GraphEntity } from "@/knowledge-graph";
import { getShortestPath, getNeighborhood, searchEntities, isMetaNode, type NeighborNode } from "@/lib/graph-explorer/algorithms";

/**
 * Grounded retrieval for the Scientific AI Research Assistant (Program BS). Every answer here is built
 * ONLY from facts already in the knowledge graph — entity descriptions, their sources, and the real
 * relations between them. There is no language model in this layer and nothing is generated or
 * invented: this is the "no-hallucination" core, the retrieval and reasoning the graph can back with
 * evidence. A future LLM layer would phrase these grounded facts, never add to them.
 */

export type Ref = { id: string; name: string; type: string; href: string };
function toRef(e: GraphEntity): Ref { return { id: e.id, name: e.name, type: e.type, href: entityGraphPath(e) }; }

/** Grounded explanation of an entity: its own description, its sources, and its real connections. */
export function explainEntity(id: string): { entity: Ref; description?: string; sources?: readonly string[]; links: { relation: string; other: Ref }[] } | null {
  const e = getEntityById(id);
  if (!e) return null;
  const conns = (getConnectionsByDomain(id).science ?? []).filter((c) => !isMetaNode(c.other.id));
  const links = conns.slice(0, 20).map((c) => ({
    relation: c.relation.type,
    other: toRef(c.other),
  }));
  return { entity: toRef(e), description: (e as { description?: string }).description, sources: (e as { sources?: readonly string[] }).sources, links };
}

/** The evidence chain connecting two entities: a real shortest path of relations. Empty when the two
 *  are the same; null when no path exists. */
export function evidenceChain(aId: string, bId: string): NeighborNode[] | null {
  return getShortestPath(aId, bId);
}

/** Concept comparison: the entities that BOTH inputs connect to — a grounded common ground. */
export function compareConcepts(aId: string, bId: string): { a: Ref; b: Ref; shared: Ref[] } | null {
  const a = getEntityById(aId);
  const b = getEntityById(bId);
  if (!a || !b) return null;
  const nb = (id: string) => new Map((getConnectionsByDomain(id).science ?? []).filter((c) => !isMetaNode(c.other.id)).map((c) => [c.other.id, c.other]));
  const na = nb(aId);
  const nbm = nb(bId);
  const shared: Ref[] = [];
  for (const [id, ent] of na) {
    if (nbm.has(id) && id !== aId && id !== bId) shared.push(toRef(ent));
  }
  shared.sort((x, y) => x.name.localeCompare(y.name));
  return { a: toRef(a), b: toRef(b), shared };
}

/** Related concepts: the immediate neighbourhood of an entity, grounded in the real relations. */
export function relatedConcepts(id: string, limit = 12): Ref[] {
  const nb = getNeighborhood(id, 1, limit);
  return nb.nodes.map((n) => ({ id: n.id, name: n.name, type: n.type, href: n.href }));
}

/** Grounded scientific search over the graph by name. */
export function scientificSearch(query: string, limit = 20): Ref[] {
  return searchEntities(query, limit).map((r) => ({ id: r.id, name: r.name, type: r.type, href: r.href }));
}
