import {
  BH_RECORDS,
  BH_BY_SLUG,
  software,
  computing,
  concepts,
  type AstroinformaticsRecord,
} from "@/knowledge-graph/data/astroinformatics-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Astroinformatics Engine — resolver and query surface for the Astroinformatics & Virtual Research
 * Ecosystem Encyclopedia (engine.astroinformatics). Pure, deterministic, framework-free. It resolves
 * the research-software, research-computing, and astroinformatics-concept entities and REUSES the
 * Virtual Observatory, the TAP protocol, the FITS standard, the archives, the open-science practices,
 * the machine-learning methods, and the Rubin/LSST/SKA/Gaia facilities via the graph, fabricating
 * nothing.
 */
type Ref = { id: string; name: string; href?: string };
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  return e ? { id, name: e.name, href: entityGraphPath(e) } : undefined;
}
const byName = (a: AstroinformaticsRecord, b: AstroinformaticsRecord) => a.name.localeCompare(b.name);

export interface ResolvedAstroinformatics {
  record: AstroinformaticsRecord;
  related: Ref[]; // reused or sibling entities it uses
  usedBy: Ref[]; // other BH entities that reference this one
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveRecord(r: AstroinformaticsRecord): ResolvedAstroinformatics {
  const entity = getEntityById(r.id);
  return {
    record: r,
    related: (r.relatedKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    usedBy: BH_RECORDS.filter((o) => o.id !== r.id && (o.relatedKeys ?? []).includes(r.id))
      .map((o) => refFromId(o.id))
      .filter(Boolean) as Ref[],
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export const astroinformaticsEngine = {
  count: BH_RECORDS.length,
  softwareCount: software.length,
  all: (): AstroinformaticsRecord[] => BH_RECORDS.slice(),
  get: (slug: string): AstroinformaticsRecord | undefined => BH_BY_SLUG.get(slug),
  software: (): AstroinformaticsRecord[] => software.slice().sort(byName),
  computing: (): AstroinformaticsRecord[] => computing.slice().sort(byName),
  concepts: (): AstroinformaticsRecord[] => concepts.slice().sort(byName),
  resolveEntry: (slug: string): ResolvedAstroinformatics | null => {
    const r = BH_BY_SLUG.get(slug);
    return r ? resolveRecord(r) : null;
  },
};
