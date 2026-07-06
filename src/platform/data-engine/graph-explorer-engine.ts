import {
  BR_RECORDS,
  BR_BY_SLUG,
  views,
  type GraphViewRecord,
} from "@/knowledge-graph/data/graph-explorer-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";
import { getStatistics, getNeighborhood, getShortestPath, searchEntities } from "@/lib/graph-explorer/algorithms";

/**
 * Graph Explorer Engine — resolver, query, and traversal surface for the Scientific Knowledge Graph
 * Explorer (engine.graphExplorer). It resolves the graph-explorer view entities AND exposes the real
 * graph algorithms — statistics, neighbourhoods, shortest paths, search — that run over the ACTUAL
 * knowledge graph. Every number is counted and every path is a real chain of relations; nothing is
 * fabricated.
 */
type Ref = { id: string; name: string; href?: string };
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  return e ? { id, name: e.name, href: entityGraphPath(e) } : undefined;
}
const byName = (a: GraphViewRecord, b: GraphViewRecord) => a.name.localeCompare(b.name);

export interface ResolvedGraphView {
  record: GraphViewRecord;
  related: Ref[];
  usedBy: Ref[];
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveRecord(r: GraphViewRecord): ResolvedGraphView {
  const entity = getEntityById(r.id);
  return {
    record: r,
    related: (r.relatedKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    usedBy: BR_RECORDS.filter((o) => o.id !== r.id && (o.relatedKeys ?? []).includes(r.id))
      .map((o) => refFromId(o.id))
      .filter(Boolean) as Ref[],
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export const graphExplorerEngine = {
  count: BR_RECORDS.length,
  viewCount: views.length,
  all: (): GraphViewRecord[] => BR_RECORDS.slice().sort(byName),
  get: (slug: string): GraphViewRecord | undefined => BR_BY_SLUG.get(slug),
  computedViews: (): GraphViewRecord[] => BR_RECORDS.filter((r) => r.backing === "computed").sort(byName),
  resolveEntry: (slug: string): ResolvedGraphView | null => {
    const r = BR_BY_SLUG.get(slug);
    return r ? resolveRecord(r) : null;
  },
  // Real graph algorithms over the actual graph.
  statistics: getStatistics,
  neighborhood: getNeighborhood,
  shortestPath: getShortestPath,
  search: searchEntities,
};
