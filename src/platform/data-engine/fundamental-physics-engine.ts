import {
  CA_RECORDS,
  CA_BY_SLUG,
  quantum,
  particle,
  relativity,
  cosmo,
  type PhysicsRecord,
  type PhysicsKind,
} from "@/knowledge-graph/data/fundamental-physics-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Fundamental Physics Engine — resolver and query surface for the Quantum & Fundamental Physics for
 * Astronomy Encyclopedia (engine.fundamentalPhysics). Pure, deterministic, framework-free. It resolves
 * the quantum, particle, relativity, and quantum-cosmology concepts, and REUSES the special/general
 * relativity, spacetime, inflation, dark-sector, Standard-Model, quantum-gravity, neutrino/IceCube,
 * cosmic-ray, CMB and Sun entities via the graph, fabricating nothing.
 */
type Ref = { id: string; name: string; href?: string };
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  return e ? { id, name: e.name, href: entityGraphPath(e) } : undefined;
}
const byName = (a: PhysicsRecord, b: PhysicsRecord) => a.name.localeCompare(b.name);
const byKind = (k: PhysicsKind) => CA_RECORDS.filter((r) => r.kind === k).sort(byName);

export interface ResolvedPhysics {
  record: PhysicsRecord;
  related: Ref[];
  usedBy: Ref[];
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveRecord(r: PhysicsRecord): ResolvedPhysics {
  const entity = getEntityById(r.id);
  return {
    record: r,
    related: (r.relatedKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    usedBy: CA_RECORDS.filter((o) => o.id !== r.id && (o.relatedKeys ?? []).includes(r.id))
      .map((o) => refFromId(o.id))
      .filter(Boolean) as Ref[],
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export const fundamentalPhysicsEngine = {
  count: CA_RECORDS.length,
  all: (): PhysicsRecord[] => CA_RECORDS.slice(),
  get: (slug: string): PhysicsRecord | undefined => CA_BY_SLUG.get(slug),
  quantum: (): PhysicsRecord[] => quantum.slice().sort(byName),
  particle: (): PhysicsRecord[] => particle.slice().sort(byName),
  relativity: (): PhysicsRecord[] => relativity.slice().sort(byName),
  cosmo: (): PhysicsRecord[] => cosmo.slice().sort(byName),
  byKind: (k: PhysicsKind): PhysicsRecord[] => byKind(k),
  resolveEntry: (slug: string): ResolvedPhysics | null => {
    const r = CA_BY_SLUG.get(slug);
    return r ? resolveRecord(r) : null;
  },
};
