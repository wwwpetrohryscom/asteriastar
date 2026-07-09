import {
  CD_RECORDS,
  CD_BY_SLUG,
  catalogs,
  families,
  designations,
  type CdRecord,
  type CdKind,
} from "@/knowledge-graph/data/sky-catalogs-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Sky Catalogs Engine — resolver, query, and search surface for the Astronomical Catalogs & Professional
 * Sky Databases Encyclopedia (engine.skyCatalogs). Pure, deterministic, framework-free. It resolves the
 * professional catalogues, catalog families, and designation systems, and REUSES the existing catalogue
 * entities, data archives, sky surveys, astronomers, and the Gaia telescope via the graph, fabricating
 * nothing.
 */
type Ref = { id: string; name: string; href?: string };
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  return e ? { id, name: e.name, href: entityGraphPath(e) } : undefined;
}
const byName = (a: CdRecord, b: CdRecord) => a.name.localeCompare(b.name);
const byKind = (k: CdKind) => CD_RECORDS.filter((r) => r.kind === k).sort(byName);

export interface ResolvedCd {
  record: CdRecord;
  related: Ref[];
  usedBy: Ref[];
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveRecord(r: CdRecord): ResolvedCd {
  const entity = getEntityById(r.id);
  return {
    record: r,
    related: (r.relatedKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    usedBy: CD_RECORDS.filter((o) => o.id !== r.id && (o.relatedKeys ?? []).includes(r.id))
      .map((o) => refFromId(o.id))
      .filter(Boolean) as Ref[],
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export const skyCatalogsEngine = {
  count: CD_RECORDS.length,
  all: (): CdRecord[] => CD_RECORDS.slice(),
  get: (slug: string): CdRecord | undefined => CD_BY_SLUG.get(slug),
  catalogs: (): CdRecord[] => catalogs.slice().sort(byName),
  families: (): CdRecord[] => families.slice().sort(byName),
  designations: (): CdRecord[] => designations.slice().sort(byName),
  byKind: (k: CdKind): CdRecord[] => byKind(k),
  /** Case-insensitive search over catalogue names, alt-names, and designation abbreviations. */
  search: (query: string): CdRecord[] => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return CD_RECORDS.filter((r) =>
      r.name.toLowerCase().includes(q) ||
      (r.abbrev?.toLowerCase() === q) ||
      (r.altNames ?? []).some((a) => a.toLowerCase().includes(q)),
    ).sort(byName);
  },
  resolveEntry: (slug: string): ResolvedCd | null => {
    const r = CD_BY_SLUG.get(slug);
    return r ? resolveRecord(r) : null;
  },
};
