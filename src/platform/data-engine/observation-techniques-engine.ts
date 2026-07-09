import {
  CG_RECORDS,
  CG_BY_SLUG,
  type CgRecord,
  type CgKind,
} from "@/knowledge-graph/data/observation-techniques-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Observation Techniques Engine — resolver and query surface for the Professional Observation Techniques
 * Encyclopedia (engine.observationTechniques). Pure, deterministic, framework-free. It resolves the
 * visual, imaging, processing, and workflow techniques, and REUSES the frontier techniques, detectors,
 * equipment, measurement methods, and planners via the graph, fabricating nothing.
 */
type Ref = { id: string; name: string; href?: string };
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  return e ? { id, name: e.name, href: entityGraphPath(e) } : undefined;
}
const byName = (a: CgRecord, b: CgRecord) => a.name.localeCompare(b.name);
const byKind = (k: CgKind) => CG_RECORDS.filter((r) => r.kind === k).sort(byName);

export interface ResolvedCg {
  record: CgRecord;
  related: Ref[];
  usedBy: Ref[];
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveRecord(r: CgRecord): ResolvedCg {
  const entity = getEntityById(r.id);
  return {
    record: r,
    related: (r.relatedKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    usedBy: CG_RECORDS.filter((o) => o.id !== r.id && (o.relatedKeys ?? []).includes(r.id))
      .map((o) => refFromId(o.id))
      .filter(Boolean) as Ref[],
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export const observationTechniquesEngine = {
  count: CG_RECORDS.length,
  all: (): CgRecord[] => CG_RECORDS.slice(),
  get: (slug: string): CgRecord | undefined => CG_BY_SLUG.get(slug),
  visual: (): CgRecord[] => byKind("visual"),
  imaging: (): CgRecord[] => byKind("imaging"),
  processing: (): CgRecord[] => byKind("processing"),
  workflow: (): CgRecord[] => byKind("workflow"),
  byKind: (k: CgKind): CgRecord[] => byKind(k),
  resolveEntry: (slug: string): ResolvedCg | null => {
    const r = CG_BY_SLUG.get(slug);
    return r ? resolveRecord(r) : null;
  },
};
