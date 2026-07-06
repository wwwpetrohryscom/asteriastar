import {
  BT_RECORDS,
  BT_BY_SLUG,
  sources,
  type LiveSourceRecord,
  type LiveCategory,
} from "@/knowledge-graph/data/live-data-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";
import { buildStatusReport, plannedEnvelope, type LiveStatusReport } from "@/lib/live/status";

/**
 * Live Scientific Data Engine — resolver and honest-status surface for the Live Scientific Data
 * Platform (engine.liveScientificData). It resolves the live-data-source entities, REUSES the
 * operating organisations and space-weather phenomena via the graph, and reports each provider's real
 * status. It fabricates no live value: with no provider connected, it reports the honest planned /
 * unavailable state, never fake data.
 */
type Ref = { id: string; name: string; href?: string };
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  return e ? { id, name: e.name, href: entityGraphPath(e) } : undefined;
}
const byName = (a: LiveSourceRecord, b: LiveSourceRecord) => a.name.localeCompare(b.name);

export interface ResolvedLiveSource {
  record: LiveSourceRecord;
  related: Ref[];
  usedBy: Ref[];
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
  envelope: ReturnType<typeof plannedEnvelope>;
}

function resolveRecord(r: LiveSourceRecord): ResolvedLiveSource {
  const entity = getEntityById(r.id);
  return {
    record: r,
    related: (r.relatedKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    usedBy: BT_RECORDS.filter((o) => o.id !== r.id && (o.relatedKeys ?? []).includes(r.id))
      .map((o) => refFromId(o.id))
      .filter(Boolean) as Ref[],
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
    envelope: plannedEnvelope(r),
  };
}

export const liveScientificDataEngine = {
  count: BT_RECORDS.length,
  sourceCount: sources.length,
  all: (): LiveSourceRecord[] => BT_RECORDS.slice().sort(byName),
  get: (slug: string): LiveSourceRecord | undefined => BT_BY_SLUG.get(slug),
  byCategory: (c: LiveCategory): LiveSourceRecord[] => BT_RECORDS.filter((r) => r.category === c).sort(byName),
  categories: (): LiveCategory[] => ["space-weather", "solar-activity", "near-earth-object", "orbital", "atmospheric"],
  /** A truthful status report over every provider — never claims a provider is connected when it is not. */
  statusReport: (): LiveStatusReport => buildStatusReport(),
  resolveEntry: (slug: string): ResolvedLiveSource | null => {
    const r = BT_BY_SLUG.get(slug);
    return r ? resolveRecord(r) : null;
  },
};
