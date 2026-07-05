import {
  AU_RECORDS,
  AU_BY_SLUG,
  facilities,
  instruments,
  detectors,
  interferometryTechniques,
  techniques,
  type FrontierRecord,
} from "@/knowledge-graph/data/observatory-frontier-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Observatory Frontier Engine — resolver and query surface for the Ground-Based Observatories &
 * Instrumentation Frontier Encyclopedia (engine.observatoryFrontier). Pure, deterministic,
 * framework-free. It resolves the next-generation-facility, instrumentation, detector,
 * interferometry, and observing-technique entities and REUSES the ground observatories, the
 * adaptive-optics/interferometry/spectroscopy methods, the SPHERE/MUSE/HIRES instruments, and the
 * wavelength bands via the graph, creating and fabricating nothing.
 */
type Ref = { id: string; name: string; href?: string };
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  return e ? { id, name: e.name, href: entityGraphPath(e) } : undefined;
}
const byName = (a: FrontierRecord, b: FrontierRecord) => a.name.localeCompare(b.name);

export interface ResolvedFrontier {
  record: FrontierRecord;
  related: Ref[]; // reused or sibling entities it uses
  usedBy: Ref[]; // other AU entities that reference this one
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveRecord(r: FrontierRecord): ResolvedFrontier {
  const entity = getEntityById(r.id);
  return {
    record: r,
    related: (r.relatedKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    usedBy: AU_RECORDS.filter((o) => o.id !== r.id && (o.relatedKeys ?? []).includes(r.id))
      .map((o) => refFromId(o.id))
      .filter(Boolean) as Ref[],
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export const observatoryFrontierEngine = {
  count: AU_RECORDS.length,
  facilityCount: facilities.length,
  all: (): FrontierRecord[] => AU_RECORDS.slice(),
  get: (slug: string): FrontierRecord | undefined => AU_BY_SLUG.get(slug),
  facilities: (): FrontierRecord[] => facilities.slice().sort(byName),
  instruments: (): FrontierRecord[] => instruments.slice().sort(byName),
  detectors: (): FrontierRecord[] => detectors.slice().sort(byName),
  interferometry: (): FrontierRecord[] => interferometryTechniques.slice().sort(byName),
  techniques: (): FrontierRecord[] => techniques.slice().sort(byName),
  resolveEntry: (slug: string): ResolvedFrontier | null => {
    const r = AU_BY_SLUG.get(slug);
    return r ? resolveRecord(r) : null;
  },
};
