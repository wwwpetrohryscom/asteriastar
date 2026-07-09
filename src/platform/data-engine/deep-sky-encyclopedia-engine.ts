import {
  CE_RECORDS,
  CE_BY_SLUG,
  classes,
  objects,
  type CeRecord,
  type CeKind,
} from "@/knowledge-graph/data/deep-sky-encyclopedia-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Deep Sky Encyclopedia Engine — resolver and query surface for the Deep Sky Objects Encyclopedia
 * (engine.deepSkyEncyclopedia). Pure, deterministic, framework-free. It resolves the deep-sky object
 * classes and the two new objects, and REUSES the graph's 619+ deep-sky objects, galaxy morphologies,
 * interstellar-medium concepts, supernova classes, catalogues, and constellations, fabricating nothing.
 */
type Ref = { id: string; name: string; href?: string };
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  return e ? { id, name: e.name, href: entityGraphPath(e) } : undefined;
}
const byName = (a: CeRecord, b: CeRecord) => a.name.localeCompare(b.name);
const byKind = (k: CeKind) => CE_RECORDS.filter((r) => r.kind === k).sort(byName);

export interface ResolvedCe {
  record: CeRecord;
  related: Ref[];
  usedBy: Ref[];
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveRecord(r: CeRecord): ResolvedCe {
  const entity = getEntityById(r.id);
  return {
    record: r,
    related: (r.relatedKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    usedBy: CE_RECORDS.filter((o) => o.id !== r.id && (o.relatedKeys ?? []).includes(r.id))
      .map((o) => refFromId(o.id))
      .filter(Boolean) as Ref[],
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export const deepSkyEncyclopediaEngine = {
  count: CE_RECORDS.length,
  all: (): CeRecord[] => CE_RECORDS.slice(),
  get: (slug: string): CeRecord | undefined => CE_BY_SLUG.get(slug),
  classes: (): CeRecord[] => classes.slice().sort(byName),
  objects: (): CeRecord[] => objects.slice().sort(byName),
  byKind: (k: CeKind): CeRecord[] => byKind(k),
  resolveEntry: (slug: string): ResolvedCe | null => {
    const r = CE_BY_SLUG.get(slug);
    return r ? resolveRecord(r) : null;
  },
};
