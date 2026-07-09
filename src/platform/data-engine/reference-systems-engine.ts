import {
  CF_RECORDS,
  CF_BY_SLUG,
  coordinates,
  effects,
  bodies,
  type CfRecord,
  type CfKind,
} from "@/knowledge-graph/data/reference-systems-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Reference Systems Engine — resolver and query surface for the Astronomical Coordinates, Time & Reference
 * Systems Encyclopedia (engine.referenceSystems). Pure, deterministic, framework-free. It resolves the
 * coordinate systems, the FK5/FK4/ICRF3 frames, the Julian date, the astrometric effects, and the IAU &
 * IERS, and REUSES the existing frames, time scales, astrometry methods, ephemerides, and Gaia/Hipparcos
 * via the graph, fabricating nothing.
 */
type Ref = { id: string; name: string; href?: string };
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  return e ? { id, name: e.name, href: entityGraphPath(e) } : undefined;
}
const byName = (a: CfRecord, b: CfRecord) => a.name.localeCompare(b.name);
const byKind = (k: CfKind) => CF_RECORDS.filter((r) => r.kind === k).sort(byName);

export interface ResolvedCf {
  record: CfRecord;
  related: Ref[];
  usedBy: Ref[];
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveRecord(r: CfRecord): ResolvedCf {
  const entity = getEntityById(r.id);
  return {
    record: r,
    related: (r.relatedKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    usedBy: CF_RECORDS.filter((o) => o.id !== r.id && (o.relatedKeys ?? []).includes(r.id))
      .map((o) => refFromId(o.id))
      .filter(Boolean) as Ref[],
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export const referenceSystemsEngine = {
  count: CF_RECORDS.length,
  all: (): CfRecord[] => CF_RECORDS.slice(),
  get: (slug: string): CfRecord | undefined => CF_BY_SLUG.get(slug),
  coordinates: (): CfRecord[] => coordinates.slice().sort(byName),
  frames: (): CfRecord[] => byKind("frame"),
  timescales: (): CfRecord[] => byKind("timescale"),
  effects: (): CfRecord[] => effects.slice().sort(byName),
  bodies: (): CfRecord[] => bodies.slice().sort(byName),
  byKind: (k: CfKind): CfRecord[] => byKind(k),
  resolveEntry: (slug: string): ResolvedCf | null => {
    const r = CF_BY_SLUG.get(slug);
    return r ? resolveRecord(r) : null;
  },
};
