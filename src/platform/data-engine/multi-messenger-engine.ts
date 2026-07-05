import {
  AZ_RECORDS,
  AZ_BY_SLUG,
  facilities,
  detectionMethods,
  sources,
  alerts,
  channels,
  followupStages,
  dataProducts,
  type MmRecord,
} from "@/knowledge-graph/data/multi-messenger-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Multi-Messenger Engine — resolver and query surface for the Multi-Messenger & Gravitational-Wave
 * Operations Encyclopedia (engine.multiMessenger). Pure, deterministic, framework-free. It resolves
 * the detector, detection-method, source-class, alert-system, channel, follow-up-stage, and
 * data-product entities and REUSES the LIGO/Virgo/KAGRA detectors and the LISA concept, the
 * gravitational-wave/multi-messenger/neutrino methods, the transient classes, the alert systems,
 * the standard-siren indicator, and the bands via the graph, creating and fabricating nothing.
 */
type Ref = { id: string; name: string; href?: string };
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  return e ? { id, name: e.name, href: entityGraphPath(e) } : undefined;
}
const byName = (a: MmRecord, b: MmRecord) => a.name.localeCompare(b.name);

export interface ResolvedMultiMessenger {
  record: MmRecord;
  related: Ref[]; // reused or sibling entities it uses
  usedBy: Ref[]; // other AZ entities that reference this one
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveRecord(r: MmRecord): ResolvedMultiMessenger {
  const entity = getEntityById(r.id);
  return {
    record: r,
    related: (r.relatedKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    usedBy: AZ_RECORDS.filter((o) => o.id !== r.id && (o.relatedKeys ?? []).includes(r.id))
      .map((o) => refFromId(o.id))
      .filter(Boolean) as Ref[],
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export const multiMessengerEngine = {
  count: AZ_RECORDS.length,
  facilityCount: facilities.length,
  all: (): MmRecord[] => AZ_RECORDS.slice(),
  get: (slug: string): MmRecord | undefined => AZ_BY_SLUG.get(slug),
  facilities: (): MmRecord[] => facilities.slice().sort(byName),
  detectionMethods: (): MmRecord[] => detectionMethods.slice().sort(byName),
  sources: (): MmRecord[] => sources.slice().sort(byName),
  alerts: (): MmRecord[] => alerts.slice().sort(byName),
  channels: (): MmRecord[] => channels.slice().sort(byName),
  followupStages: (): MmRecord[] => followupStages.slice().sort(byName),
  dataProducts: (): MmRecord[] => dataProducts.slice().sort(byName),
  resolveEntry: (slug: string): ResolvedMultiMessenger | null => {
    const r = AZ_BY_SLUG.get(slug);
    return r ? resolveRecord(r) : null;
  },
};
