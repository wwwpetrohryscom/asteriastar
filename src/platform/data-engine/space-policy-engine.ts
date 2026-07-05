import {
  BC_RECORDS,
  BC_BY_SLUG,
  treaties,
  topics,
  economy,
  organizations,
  type PolicyRecord,
} from "@/knowledge-graph/data/space-policy-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Space Policy Engine — resolver and query surface for the Space Policy, Sustainability & Space
 * Economy Encyclopedia (engine.spacePolicy). Pure, deterministic, framework-free. It resolves the
 * treaty, policy-topic, economy-topic, and organisation entities and REUSES the on-orbit-servicing
 * process, the ISRU domain, the planetary-protection topic and contamination measures, the
 * satellite-impact, and NASA via the graph, creating and fabricating nothing.
 */
type Ref = { id: string; name: string; href?: string };
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  return e ? { id, name: e.name, href: entityGraphPath(e) } : undefined;
}
const byName = (a: PolicyRecord, b: PolicyRecord) => a.name.localeCompare(b.name);

export interface ResolvedPolicy {
  record: PolicyRecord;
  related: Ref[]; // reused or sibling entities it uses
  usedBy: Ref[]; // other BC entities that reference this one
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveRecord(r: PolicyRecord): ResolvedPolicy {
  const entity = getEntityById(r.id);
  return {
    record: r,
    related: (r.relatedKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    usedBy: BC_RECORDS.filter((o) => o.id !== r.id && (o.relatedKeys ?? []).includes(r.id))
      .map((o) => refFromId(o.id))
      .filter(Boolean) as Ref[],
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export const spacePolicyEngine = {
  count: BC_RECORDS.length,
  topicCount: topics.length,
  all: (): PolicyRecord[] => BC_RECORDS.slice(),
  get: (slug: string): PolicyRecord | undefined => BC_BY_SLUG.get(slug),
  treaties: (): PolicyRecord[] => treaties.slice().sort(byName),
  topics: (): PolicyRecord[] => topics.slice().sort(byName),
  economy: (): PolicyRecord[] => economy.slice().sort(byName),
  organizations: (): PolicyRecord[] => organizations.slice().sort(byName),
  resolveEntry: (slug: string): ResolvedPolicy | null => {
    const r = BC_BY_SLUG.get(slug);
    return r ? resolveRecord(r) : null;
  },
};
