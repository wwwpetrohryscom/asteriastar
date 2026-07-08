import {
  BZ_RECORDS,
  BZ_BY_SLUG,
  blackHoles,
  objects,
  type CompactRecord,
  type CompactKind,
} from "@/knowledge-graph/data/compact-objects-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Compact Objects Engine — resolver and query surface for the Black Holes, Neutron Stars & Compact
 * Objects Encyclopedia (engine.compactObjects). Pure, deterministic, framework-free. It resolves the
 * black-hole and neutron-star physics concepts, the pulsar classes, and the specific objects, and REUSES
 * the black-hole/neutron-star/magnetar classes, Sgr A* and M87*, the event horizon and accretion disk,
 * the merger/kilonova/tidal-disruption transients, the EHT and the gravitational-wave methods via the
 * graph, fabricating nothing.
 */
type Ref = { id: string; name: string; href?: string };
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  return e ? { id, name: e.name, href: entityGraphPath(e) } : undefined;
}
const byName = (a: CompactRecord, b: CompactRecord) => a.name.localeCompare(b.name);
const byKind = (k: CompactKind) => BZ_RECORDS.filter((r) => r.kind === k).sort(byName);

export interface ResolvedCompact {
  record: CompactRecord;
  related: Ref[];
  usedBy: Ref[];
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveRecord(r: CompactRecord): ResolvedCompact {
  const entity = getEntityById(r.id);
  return {
    record: r,
    related: (r.relatedKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    usedBy: BZ_RECORDS.filter((o) => o.id !== r.id && (o.relatedKeys ?? []).includes(r.id))
      .map((o) => refFromId(o.id))
      .filter(Boolean) as Ref[],
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export const compactObjectsEngine = {
  count: BZ_RECORDS.length,
  blackHoleConceptCount: blackHoles.length,
  all: (): CompactRecord[] => BZ_RECORDS.slice(),
  get: (slug: string): CompactRecord | undefined => BZ_BY_SLUG.get(slug),
  blackHolePhysics: (): CompactRecord[] => [...byKind("bh-physics"), ...byKind("bh-process")].sort(byName),
  neutronStarPhysics: (): CompactRecord[] => [...byKind("ns-physics"), ...byKind("ns-class")].sort(byName),
  blackHoleObjects: (): CompactRecord[] => byKind("bh-object"),
  neutronStarObjects: (): CompactRecord[] => byKind("ns-object"),
  objects: (): CompactRecord[] => objects.slice().sort(byName),
  physics: (): CompactRecord[] => [...byKind("bh-physics"), ...byKind("bh-process"), ...byKind("ns-physics"), ...byKind("ns-class")].sort(byName),
  resolveEntry: (slug: string): ResolvedCompact | null => {
    const r = BZ_BY_SLUG.get(slug);
    return r ? resolveRecord(r) : null;
  },
};
