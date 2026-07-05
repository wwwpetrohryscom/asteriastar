import {
  BF_RECORDS,
  BF_BY_SLUG,
  processes,
  nucleosynthesis,
  concepts,
  type StellarRecord,
} from "@/knowledge-graph/data/stellar-astrophysics-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Stellar Astrophysics Engine — resolver and query surface for the Stellar Astrophysics Deep-Dive
 * Encyclopedia (engine.stellarAstrophysics). Pure, deterministic, framework-free. It resolves the
 * stellar-process, nucleosynthesis-process, and stellar-physics-concept entities and REUSES the
 * stellar end-states, the supernova/kilonova/variable classes, the spectral-classification and
 * asteroseismology methods, Big Bang nucleosynthesis, the molecular cloud, the Roche limit,
 * Chandrasekhar, and real example stars, clusters and nebulae via the graph, fabricating nothing.
 */
type Ref = { id: string; name: string; href?: string };
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  return e ? { id, name: e.name, href: entityGraphPath(e) } : undefined;
}
const byName = (a: StellarRecord, b: StellarRecord) => a.name.localeCompare(b.name);

export interface ResolvedStellarPhysics {
  record: StellarRecord;
  related: Ref[]; // reused or sibling entities it uses
  usedBy: Ref[]; // other BF entities that reference this one
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveRecord(r: StellarRecord): ResolvedStellarPhysics {
  const entity = getEntityById(r.id);
  return {
    record: r,
    related: (r.relatedKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    usedBy: BF_RECORDS.filter((o) => o.id !== r.id && (o.relatedKeys ?? []).includes(r.id))
      .map((o) => refFromId(o.id))
      .filter(Boolean) as Ref[],
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export const stellarAstrophysicsEngine = {
  count: BF_RECORDS.length,
  processCount: processes.length,
  all: (): StellarRecord[] => BF_RECORDS.slice(),
  get: (slug: string): StellarRecord | undefined => BF_BY_SLUG.get(slug),
  processes: (): StellarRecord[] => processes.slice().sort(byName),
  nucleosynthesis: (): StellarRecord[] => nucleosynthesis.slice().sort(byName),
  concepts: (): StellarRecord[] => concepts.slice().sort(byName),
  resolveEntry: (slug: string): ResolvedStellarPhysics | null => {
    const r = BF_BY_SLUG.get(slug);
    return r ? resolveRecord(r) : null;
  },
};
