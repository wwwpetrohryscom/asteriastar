import {
  CC_RECORDS,
  CC_BY_SLUG,
  characterization,
  atmospheres,
  formation,
  missions,
  type CcRecord,
  type CcKind,
} from "@/knowledge-graph/data/exoplanet-science-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Exoplanet Science Engine — resolver and query surface for the Exoplanet Science & Characterization
 * Encyclopedia (engine.exoplanetScience). Pure, deterministic, framework-free. It resolves the
 * characterization methods, atmosphere concepts, planet-formation concepts, and the Ariel & PLATO
 * missions, and REUSES the detection methods, planetary classes, habitable zone, biosignatures,
 * atmospheric processes, protoplanetary disk, and JWST/Kepler/TESS/Roman/HWO/ELT/GMT/TMT via the graph,
 * fabricating nothing.
 */
type Ref = { id: string; name: string; href?: string };
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  return e ? { id, name: e.name, href: entityGraphPath(e) } : undefined;
}
const byName = (a: CcRecord, b: CcRecord) => a.name.localeCompare(b.name);
const byKind = (k: CcKind) => CC_RECORDS.filter((r) => r.kind === k).sort(byName);

export interface ResolvedCc {
  record: CcRecord;
  related: Ref[];
  usedBy: Ref[];
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveRecord(r: CcRecord): ResolvedCc {
  const entity = getEntityById(r.id);
  return {
    record: r,
    related: (r.relatedKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    usedBy: CC_RECORDS.filter((o) => o.id !== r.id && (o.relatedKeys ?? []).includes(r.id))
      .map((o) => refFromId(o.id))
      .filter(Boolean) as Ref[],
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export const exoplanetScienceEngine = {
  count: CC_RECORDS.length,
  all: (): CcRecord[] => CC_RECORDS.slice(),
  get: (slug: string): CcRecord | undefined => CC_BY_SLUG.get(slug),
  characterization: (): CcRecord[] => characterization.slice().sort(byName),
  atmospheres: (): CcRecord[] => atmospheres.slice().sort(byName),
  formation: (): CcRecord[] => formation.slice().sort(byName),
  missions: (): CcRecord[] => missions.slice().sort(byName),
  byKind: (k: CcKind): CcRecord[] => byKind(k),
  resolveEntry: (slug: string): ResolvedCc | null => {
    const r = CC_BY_SLUG.get(slug);
    return r ? resolveRecord(r) : null;
  },
};
