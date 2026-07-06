import { entities, relations, getEntityById, ENTITY_TYPE_LABELS } from "@/knowledge-graph";

/**
 * Real graph algorithms for the Knowledge Graph Explorer (Program BR). These run over the ACTUAL
 * knowledge graph — every entity and every relation already in the platform — computing statistics,
 * neighbourhoods, and shortest paths. Nothing is fabricated: every number is counted from the real
 * graph, and every path is a real chain of relations. Adjacency is built once at module load.
 */

type Adj = Map<string, Set<string>>;

let _adj: Adj | null = null;
let _degree: Map<string, number> | null = null;

/** The explorer and the assistant traverse the KNOWLEDGE graph, not the platform's own feature
 *  catalogue. The interactive-platform meta-nodes (the graph views, atlas views/overlays, calculators,
 *  observing planners/integrations, and assistant capabilities) are excluded from adjacency so they
 *  never appear in a neighbourhood or on a shortest path — which would otherwise let a path route
 *  trivially through the very tool demonstrating it, or surface a platform feature as if it were a
 *  scientific fact. */
const META_PREFIXES = [
  "graph_view:",
  "assistant_capability:",
  "atlas_view:",
  "atlas_overlay:",
  "scientific_calculator:",
  "observing_planner:",
  "observing_integration:",
  "universe_scene:",
  "workspace_feature:",
];
export function isMetaNode(id: string): boolean {
  return META_PREFIXES.some((p) => id.startsWith(p));
}

function build(): { adj: Adj; degree: Map<string, number> } {
  if (_adj && _degree) return { adj: _adj, degree: _degree };
  const adj: Adj = new Map();
  const degree = new Map<string, number>();
  const link = (a: string, b: string) => {
    let s = adj.get(a);
    if (!s) { s = new Set(); adj.set(a, s); }
    if (!s.has(b)) { s.add(b); degree.set(a, (degree.get(a) ?? 0) + 1); }
  };
  for (const r of relations) {
    if (!r.from || !r.to || r.from === r.to) continue;
    if (isMetaNode(r.from) || isMetaNode(r.to)) continue;
    link(r.from, r.to);
    link(r.to, r.from);
  }
  _adj = adj;
  _degree = degree;
  return { adj, degree };
}

export interface GraphStatistics {
  entityCount: number;
  relationCount: number;
  typeCount: number;
  byDomain: { domain: string; count: number }[];
  topTypes: { type: string; label: string; count: number }[];
  averageDegree: number;
  mostConnected: { id: string; name: string; type: string; degree: number; href: string }[];
}

export function getStatistics(): GraphStatistics {
  const { degree } = build();
  const byType = new Map<string, number>();
  const byDomain = new Map<string, number>();
  for (const e of entities) {
    byType.set(e.type, (byType.get(e.type) ?? 0) + 1);
    const dom = (e as { domain?: string }).domain ?? "science";
    byDomain.set(dom, (byDomain.get(dom) ?? 0) + 1);
  }
  const topTypes = [...byType.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([type, count]) => ({ type, label: ENTITY_TYPE_LABELS[type as keyof typeof ENTITY_TYPE_LABELS] ?? type, count }));
  let degSum = 0;
  for (const d of degree.values()) degSum += d;
  const mostConnected = [...degree.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([id, deg]) => {
      const e = getEntityById(id);
      return { id, name: e?.name ?? id, type: e?.type ?? "", degree: deg, href: e ? entPath(e) : "#" };
    });
  return {
    entityCount: entities.length,
    relationCount: relations.length,
    typeCount: byType.size,
    byDomain: [...byDomain.entries()].map(([domain, count]) => ({ domain, count })).sort((a, b) => b.count - a.count),
    topTypes,
    averageDegree: degree.size ? degSum / degree.size : 0,
    mostConnected,
  };
}

function entPath(e: { entryPath?: string; id: string }): string {
  return e.entryPath ?? "#";
}

export interface NeighborNode { id: string; name: string; type: string; distance: number; href: string }

/** Breadth-first neighbourhood of an entity out to a given depth (default 1). */
export function getNeighborhood(id: string, depth = 1, limit = 60): { center: NeighborNode | null; nodes: NeighborNode[] } {
  const { adj } = build();
  const center = getEntityById(id);
  if (!center) return { center: null, nodes: [] };
  const seen = new Map<string, number>([[id, 0]]);
  let frontier = [id];
  for (let d = 1; d <= depth; d++) {
    const next: string[] = [];
    for (const node of frontier) {
      for (const nb of adj.get(node) ?? []) {
        if (!seen.has(nb)) { seen.set(nb, d); next.push(nb); }
      }
    }
    frontier = next;
  }
  const nodes: NeighborNode[] = [];
  for (const [nid, dist] of seen) {
    if (nid === id) continue;
    const e = getEntityById(nid);
    if (!e) continue;
    nodes.push({ id: nid, name: e.name, type: e.type, distance: dist, href: entPath(e) });
  }
  nodes.sort((a, b) => a.distance - b.distance || a.name.localeCompare(b.name));
  return {
    center: { id, name: center.name, type: center.type, distance: 0, href: entPath(center) },
    nodes: nodes.slice(0, limit),
  };
}

/** Breadth-first shortest path between two entities. Returns the chain of entity ids, or null. */
export function getShortestPath(fromId: string, toId: string, maxDepth = 8): NeighborNode[] | null {
  const { adj } = build();
  if (!getEntityById(fromId) || !getEntityById(toId)) return null;
  if (fromId === toId) return [];
  const prev = new Map<string, string>();
  const seen = new Set<string>([fromId]);
  let frontier = [fromId];
  for (let d = 0; d < maxDepth && frontier.length; d++) {
    const next: string[] = [];
    for (const node of frontier) {
      for (const nb of adj.get(node) ?? []) {
        if (seen.has(nb)) continue;
        seen.add(nb);
        prev.set(nb, node);
        if (nb === toId) {
          const chain: string[] = [toId];
          let cur = toId;
          while (prev.has(cur)) { cur = prev.get(cur)!; chain.unshift(cur); }
          return chain.map((cid) => {
            const e = getEntityById(cid)!;
            return { id: cid, name: e.name, type: e.type, distance: chain.indexOf(cid), href: entPath(e) };
          });
        }
        next.push(nb);
      }
    }
    frontier = next;
  }
  return null;
}

/** Simple name search over the graph. */
export function searchEntities(query: string, limit = 20): { id: string; name: string; type: string; href: string }[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const out: { id: string; name: string; type: string; href: string }[] = [];
  for (const e of entities) {
    if (isMetaNode(e.id)) continue;
    if ((e.name ?? "").toLowerCase().includes(q)) {
      out.push({ id: e.id, name: e.name, type: e.type, href: entPath(e) });
      if (out.length >= limit) break;
    }
  }
  return out;
}
