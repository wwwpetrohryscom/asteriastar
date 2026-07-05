import {
  BE_RECORDS,
  BE_BY_SLUG,
  dynamics,
  frames,
  ephemerides,
  timekeeping,
  type MechanicsRecord,
} from "@/knowledge-graph/data/celestial-mechanics-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Celestial Mechanics Engine — resolver and query surface for the Celestial Mechanics & Timekeeping
 * Encyclopedia (engine.celestialMechanics). Pure, deterministic, framework-free. It resolves the
 * orbital-mechanics-concept, reference-frame, ephemeris-system, and time-standard entities and
 * REUSES the gravitation theory, Kepler, JPL, the planets, the Jupiter resonances, the TAI/UTC
 * standards, the precession discovery, JWST, and parallax via the graph, creating and fabricating
 * nothing.
 */
type Ref = { id: string; name: string; href?: string };
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  return e ? { id, name: e.name, href: entityGraphPath(e) } : undefined;
}
const byName = (a: MechanicsRecord, b: MechanicsRecord) => a.name.localeCompare(b.name);

export interface ResolvedMechanics {
  record: MechanicsRecord;
  related: Ref[]; // reused or sibling entities it uses
  usedBy: Ref[]; // other BE entities that reference this one
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveRecord(r: MechanicsRecord): ResolvedMechanics {
  const entity = getEntityById(r.id);
  return {
    record: r,
    related: (r.relatedKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    usedBy: BE_RECORDS.filter((o) => o.id !== r.id && (o.relatedKeys ?? []).includes(r.id))
      .map((o) => refFromId(o.id))
      .filter(Boolean) as Ref[],
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export const celestialMechanicsEngine = {
  count: BE_RECORDS.length,
  dynamicsCount: dynamics.length,
  all: (): MechanicsRecord[] => BE_RECORDS.slice(),
  get: (slug: string): MechanicsRecord | undefined => BE_BY_SLUG.get(slug),
  dynamics: (): MechanicsRecord[] => dynamics.slice().sort(byName),
  frames: (): MechanicsRecord[] => frames.slice().sort(byName),
  ephemerides: (): MechanicsRecord[] => ephemerides.slice().sort(byName),
  timekeeping: (): MechanicsRecord[] => timekeeping.slice().sort(byName),
  resolveEntry: (slug: string): ResolvedMechanics | null => {
    const r = BE_BY_SLUG.get(slug);
    return r ? resolveRecord(r) : null;
  },
};
