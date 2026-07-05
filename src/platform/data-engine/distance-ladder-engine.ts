import {
  AV_RECORDS,
  AV_BY_SLUG,
  indicators,
  parameters,
  programs,
  concepts,
  type DistanceRecord,
} from "@/knowledge-graph/data/distance-ladder-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Distance Ladder Engine — resolver and query surface for the Cosmic Distance Ladder &
 * Cosmological Tensions Encyclopedia (engine.distanceLadder). Pure, deterministic, framework-free.
 * It resolves the distance-indicator, cosmological-parameter, measurement-programme, and cosmology-
 * concept entities and REUSES the parallax/Cepheid/standard-candle/distance-ladder methods, the
 * Hubble constant and tension, dark energy and dark matter, and the Planck/Gaia/HST/DESI facilities
 * via the graph, creating and fabricating nothing.
 */
type Ref = { id: string; name: string; href?: string };
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  return e ? { id, name: e.name, href: entityGraphPath(e) } : undefined;
}
const byName = (a: DistanceRecord, b: DistanceRecord) => a.name.localeCompare(b.name);

export interface ResolvedDistance {
  record: DistanceRecord;
  related: Ref[]; // reused or sibling entities it uses
  usedBy: Ref[]; // other AV entities that reference this one
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveRecord(r: DistanceRecord): ResolvedDistance {
  const entity = getEntityById(r.id);
  return {
    record: r,
    related: (r.relatedKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    usedBy: AV_RECORDS.filter((o) => o.id !== r.id && (o.relatedKeys ?? []).includes(r.id))
      .map((o) => refFromId(o.id))
      .filter(Boolean) as Ref[],
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export const distanceLadderEngine = {
  count: AV_RECORDS.length,
  indicatorCount: indicators.length,
  all: (): DistanceRecord[] => AV_RECORDS.slice(),
  get: (slug: string): DistanceRecord | undefined => AV_BY_SLUG.get(slug),
  indicators: (): DistanceRecord[] => indicators.slice().sort(byName),
  parameters: (): DistanceRecord[] => parameters.slice().sort(byName),
  programs: (): DistanceRecord[] => programs.slice().sort(byName),
  concepts: (): DistanceRecord[] => concepts.slice().sort(byName),
  resolveEntry: (slug: string): ResolvedDistance | null => {
    const r = AV_BY_SLUG.get(slug);
    return r ? resolveRecord(r) : null;
  },
};
