import {
  getConnections,
  getEntityById,
  type GraphEntity,
  type GraphRelation,
  type RelationType,
} from "@/knowledge-graph";

/**
 * Graph Traversal Engine — walk the knowledge graph from a starting entity with
 * depth limits, relation/domain filters, cycle protection, and visited tracking.
 * Pure and deterministic (BFS in stable relation order). The basis for
 * discovery paths and "how is X connected to Y" queries.
 */

export type TraversalDomain = "scientific" | "interpretive" | "mixed";

export interface TraversalOptions {
  /** Maximum hops from the start (default 2). */
  maxDepth?: number;
  /** Safety cap on total nodes visited (default 250). */
  maxNodes?: number;
  /** Only follow these relation types. */
  relationTypes?: RelationType[];
  /** Restrict to scientific-only, interpretive-only, or mixed relations. */
  domain?: TraversalDomain;
}

export interface TraversalNode {
  entity: GraphEntity;
  /** Hops from the start (start = 0). */
  distance: number;
  /** The relation type that first reached this node. */
  viaRelation?: RelationType;
  fromId?: string;
}

export interface TraversalEdge {
  from: string;
  to: string;
  type: RelationType;
  domain: GraphRelation["domain"];
  label: string;
}

export interface TraversalResult {
  start: GraphEntity;
  nodes: TraversalNode[];
  edges: TraversalEdge[];
  /** True when maxNodes capped the walk. */
  truncated: boolean;
}

function relationDomainAllowed(td: TraversalDomain, d: GraphRelation["domain"]): boolean {
  if (td === "mixed") return true;
  if (td === "scientific") return d === "science" || d === "editorial";
  return d === "culture" || d === "astrology";
}

export const traversalEngine = {
  traverse(startId: string, opts: TraversalOptions = {}): TraversalResult | null {
    const start = getEntityById(startId);
    if (!start) return null;

    const maxDepth = opts.maxDepth ?? 2;
    const maxNodes = opts.maxNodes ?? 250;
    const td = opts.domain ?? "mixed";
    const typeFilter = opts.relationTypes ? new Set(opts.relationTypes) : null;

    const visited = new Set<string>([startId]); // cycle protection
    const nodes: TraversalNode[] = [{ entity: start, distance: 0 }];
    const edges: TraversalEdge[] = [];
    const seenEdge = new Set<string>();
    const queue: { id: string; depth: number }[] = [{ id: startId, depth: 0 }];
    let truncated = false;

    while (queue.length > 0) {
      const { id, depth } = queue.shift() as { id: string; depth: number };
      if (depth >= maxDepth) continue;

      for (const c of getConnections(id)) {
        if (typeFilter && !typeFilter.has(c.relation.type)) continue;
        if (!relationDomainAllowed(td, c.relation.domain)) continue;

        const edgeKey = c.relation.id;
        if (!seenEdge.has(edgeKey)) {
          seenEdge.add(edgeKey);
          // Record the relation in its canonical direction (from → to), not the
          // traversal direction, so incoming relations are not reversed.
          edges.push({
            from: c.relation.from,
            to: c.relation.to,
            type: c.relation.type,
            domain: c.relation.domain,
            label: c.relation.type.replace(/_/g, " "),
          });
        }

        if (!visited.has(c.other.id)) {
          if (nodes.length >= maxNodes) {
            truncated = true;
            continue;
          }
          visited.add(c.other.id);
          nodes.push({ entity: c.other, distance: depth + 1, viaRelation: c.relation.type, fromId: id });
          queue.push({ id: c.other.id, depth: depth + 1 });
        }
      }
    }

    return { start, nodes, edges, truncated };
  },

  /** Shortest relation path between two entities (BFS), or null if unreachable. */
  path(fromId: string, toId: string, opts: { maxDepth?: number } = {}): GraphEntity[] | null {
    if (!getEntityById(fromId) || !getEntityById(toId)) return null;
    if (fromId === toId) return [getEntityById(fromId) as GraphEntity];
    const maxDepth = opts.maxDepth ?? 6;
    const prev = new Map<string, string>();
    const visited = new Set<string>([fromId]);
    const queue: { id: string; depth: number }[] = [{ id: fromId, depth: 0 }];

    while (queue.length > 0) {
      const { id, depth } = queue.shift() as { id: string; depth: number };
      if (depth >= maxDepth) continue;
      for (const c of getConnections(id)) {
        if (visited.has(c.other.id)) continue;
        visited.add(c.other.id);
        prev.set(c.other.id, id);
        if (c.other.id === toId) {
          const chain: string[] = [toId];
          let cur = toId;
          while (cur !== fromId) {
            cur = prev.get(cur) as string;
            chain.unshift(cur);
          }
          return chain.map((cid) => getEntityById(cid) as GraphEntity);
        }
        queue.push({ id: c.other.id, depth: depth + 1 });
      }
    }
    return null;
  },
};
