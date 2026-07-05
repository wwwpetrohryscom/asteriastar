import {
  EXG_RECORDS,
  EXG_BY_SLUG,
  morphologies,
  agnTypes,
  processes,
  structures,
  type ExtragalacticRecord,
} from "@/knowledge-graph/data/galaxies-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Galaxies Engine — resolver and query surface for the Galaxies, AGN & Extragalactic Universe
 * Encyclopedia (engine.galaxies). Pure, deterministic, framework-free. It resolves the galaxy-
 * morphology, AGN-type, galactic-process, and cosmic-structure entities and REUSES the galaxies,
 * astrophysical object classes, and cosmology concepts via the graph, creating and fabricating
 * nothing.
 */
type Ref = { id: string; name: string; href?: string };
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  return e ? { id, name: e.name, href: entityGraphPath(e) } : undefined;
}
const byName = (a: ExtragalacticRecord, b: ExtragalacticRecord) => a.name.localeCompare(b.name);
const NEW_IDS = new Set(EXG_RECORDS.map((r) => r.id));

export interface ResolvedExtragalactic {
  record: ExtragalacticRecord;
  related: Ref[]; // reused/new entities it is associated_with (outgoing)
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveRecord(r: ExtragalacticRecord): ResolvedExtragalactic {
  const entity = getEntityById(r.id);
  return {
    record: r,
    related: (r.relatedKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export const galaxiesEngine = {
  count: EXG_RECORDS.length,
  morphologyCount: morphologies.length,
  all: (): ExtragalacticRecord[] => EXG_RECORDS.slice(),
  get: (slug: string): ExtragalacticRecord | undefined => EXG_BY_SLUG.get(slug),
  morphologies: (): ExtragalacticRecord[] => morphologies.slice(),
  agnTypes: (): ExtragalacticRecord[] => agnTypes.slice().sort(byName),
  processes: (): ExtragalacticRecord[] => processes.slice().sort(byName),
  structures: (): ExtragalacticRecord[] => structures.slice().sort(byName),
  /** Whether an id belongs to this catalog (a new extragalactic entity). */
  isNew: (id: string): boolean => NEW_IDS.has(id),
  resolveEntry: (slug: string): ResolvedExtragalactic | null => {
    const r = EXG_BY_SLUG.get(slug);
    return r ? resolveRecord(r) : null;
  },
};
