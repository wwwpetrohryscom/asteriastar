import {
  BB_RECORDS,
  BB_BY_SLUG,
  environments,
  molecules,
  processes,
  type ChemistryRecord,
} from "@/knowledge-graph/data/astrochemistry-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Astrochemistry Engine — resolver and query surface for the Astrochemistry & Molecular Universe
 * Encyclopedia (engine.astrochemistry). Pure, deterministic, framework-free. It resolves the
 * interstellar-environment, interstellar-molecule, and astrochemical-process entities and REUSES the
 * spectroscopy method, ALMA/APEX, JWST, the Orion Nebula, the origins-of-life topic, the Murchison
 * and Allende meteorites, and the bands via the graph, creating and fabricating nothing.
 */
type Ref = { id: string; name: string; href?: string };
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  return e ? { id, name: e.name, href: entityGraphPath(e) } : undefined;
}
const byName = (a: ChemistryRecord, b: ChemistryRecord) => a.name.localeCompare(b.name);

export interface ResolvedChemistry {
  record: ChemistryRecord;
  related: Ref[]; // reused or sibling entities it uses
  usedBy: Ref[]; // other BB entities that reference this one
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveRecord(r: ChemistryRecord): ResolvedChemistry {
  const entity = getEntityById(r.id);
  return {
    record: r,
    related: (r.relatedKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    usedBy: BB_RECORDS.filter((o) => o.id !== r.id && (o.relatedKeys ?? []).includes(r.id))
      .map((o) => refFromId(o.id))
      .filter(Boolean) as Ref[],
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export const astrochemistryEngine = {
  count: BB_RECORDS.length,
  moleculeCount: molecules.length,
  all: (): ChemistryRecord[] => BB_RECORDS.slice(),
  get: (slug: string): ChemistryRecord | undefined => BB_BY_SLUG.get(slug),
  environments: (): ChemistryRecord[] => environments.slice().sort(byName),
  molecules: (): ChemistryRecord[] => molecules.slice().sort(byName),
  processes: (): ChemistryRecord[] => processes.slice().sort(byName),
  resolveEntry: (slug: string): ResolvedChemistry | null => {
    const r = BB_BY_SLUG.get(slug);
    return r ? resolveRecord(r) : null;
  },
};
