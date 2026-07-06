import {
  BQ_RECORDS,
  BQ_BY_SLUG,
  planners,
  integrations,
  type ObservingRecord,
} from "@/knowledge-graph/data/observing-suite-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Observing Suite Engine — resolver and query surface for the Professional Observatory Planning Suite
 * (engine.observingSuite). Pure, deterministic, framework-free. It resolves the observing-planner and
 * data-integration entities and REUSES the live-sky computations, the observing equipment, sites and
 * techniques, and the Moon/Sun/planets/showers/deep-sky objects via the graph. It re-implements no
 * ephemeris and fabricates no observing conditions.
 */
type Ref = { id: string; name: string; href?: string };
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  return e ? { id, name: e.name, href: entityGraphPath(e) } : undefined;
}
const byName = (a: ObservingRecord, b: ObservingRecord) => a.name.localeCompare(b.name);

export interface ResolvedObserving {
  record: ObservingRecord;
  related: Ref[];
  usedBy: Ref[];
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveRecord(r: ObservingRecord): ResolvedObserving {
  const entity = getEntityById(r.id);
  return {
    record: r,
    related: (r.relatedKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    usedBy: BQ_RECORDS.filter((o) => o.id !== r.id && (o.relatedKeys ?? []).includes(r.id))
      .map((o) => refFromId(o.id))
      .filter(Boolean) as Ref[],
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export const observingSuiteEngine = {
  count: BQ_RECORDS.length,
  plannerCount: planners.length,
  all: (): ObservingRecord[] => BQ_RECORDS.slice(),
  get: (slug: string): ObservingRecord | undefined => BQ_BY_SLUG.get(slug),
  planners: (): ObservingRecord[] => planners.slice().sort(byName),
  integrations: (): ObservingRecord[] => integrations.slice().sort(byName),
  resolveEntry: (slug: string): ResolvedObserving | null => {
    const r = BQ_BY_SLUG.get(slug);
    return r ? resolveRecord(r) : null;
  },
};
