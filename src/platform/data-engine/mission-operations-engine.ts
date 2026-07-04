import {
  OPS_RECORDS,
  OPS_BY_SLUG,
  centers,
  functions,
  type OpsCategory,
  type OpsRecord,
} from "@/knowledge-graph/data/mission-operations-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Mission Operations Engine — resolver and query surface for the Ground Segment & Mission
 * Operations Encyclopedia (engine.missionOperations). Pure, deterministic, framework-free.
 * It resolves the operations-centre and operations-function entities and REUSES the
 * agencies, networks, and missions via the graph, creating and fabricating nothing.
 */
type Ref = { id: string; name: string; href?: string };
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  return e ? { id, name: e.name, href: entityGraphPath(e) } : undefined;
}
const byName = (a: OpsRecord, b: OpsRecord) => a.name.localeCompare(b.name, "en", { numeric: true });

export interface ResolvedOps {
  record: OpsRecord;
  operator?: Ref;
  networks: Ref[];
  related: Ref[];
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveRecord(r: OpsRecord): ResolvedOps {
  const entity = getEntityById(r.id);
  return {
    record: r,
    operator: refFromId(r.operatorKey),
    networks: (r.networkKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    related: (r.relatedKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export const missionOperationsEngine = {
  count: OPS_RECORDS.length,
  all: (): OpsRecord[] => OPS_RECORDS.slice().sort(byName),
  get: (slug: string): OpsRecord | undefined => OPS_BY_SLUG.get(slug),
  centers: (): OpsRecord[] => centers.slice().sort(byName),
  functions: (): OpsRecord[] => functions.slice(),
  byCategory: (c: OpsCategory): OpsRecord[] => OPS_RECORDS.filter((r) => r.category === c).sort(byName),
  resolveEntry: (slug: string): ResolvedOps | null => {
    const r = OPS_BY_SLUG.get(slug);
    return r ? resolveRecord(r) : null;
  },
  resolveCenter: (slug: string): ResolvedOps | null => {
    const r = OPS_BY_SLUG.get(slug);
    return r && r.kind === "center" ? resolveRecord(r) : null;
  },
  resolveFunction: (slug: string): ResolvedOps | null => {
    const r = OPS_BY_SLUG.get(slug);
    return r && r.kind === "function" ? resolveRecord(r) : null;
  },
};
