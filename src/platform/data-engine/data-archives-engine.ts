import {
  AT_RECORDS,
  AT_BY_SLUG,
  archives,
  standards,
  protocols,
  practices,
  type ArchiveRecord,
} from "@/knowledge-graph/data/data-archives-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Data Archives Engine — resolver and query surface for the Space Data Archives & Open Science
 * Infrastructure Encyclopedia (engine.dataArchives). Pure, deterministic, framework-free. It
 * resolves the archive, data-standard, Virtual Observatory protocol, and open-science-practice
 * entities and REUSES the operating organisations, the telescopes and surveys whose data the
 * archives hold, the calibration method, the Harvard classification, and VOEvent via the graph,
 * creating and fabricating nothing.
 */
type Ref = { id: string; name: string; href?: string };
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  return e ? { id, name: e.name, href: entityGraphPath(e) } : undefined;
}
const byName = (a: ArchiveRecord, b: ArchiveRecord) => a.name.localeCompare(b.name);

export interface ResolvedArchive {
  record: ArchiveRecord;
  related: Ref[]; // reused or sibling entities it uses
  usedBy: Ref[]; // new AT entities that reference this one
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveRecord(r: ArchiveRecord): ResolvedArchive {
  const entity = getEntityById(r.id);
  return {
    record: r,
    related: (r.relatedKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    usedBy: AT_RECORDS.filter((o) => o.id !== r.id && (o.relatedKeys ?? []).includes(r.id))
      .map((o) => refFromId(o.id))
      .filter(Boolean) as Ref[],
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export const dataArchivesEngine = {
  count: AT_RECORDS.length,
  archiveCount: archives.length,
  all: (): ArchiveRecord[] => AT_RECORDS.slice(),
  get: (slug: string): ArchiveRecord | undefined => AT_BY_SLUG.get(slug),
  archives: (): ArchiveRecord[] => archives.slice().sort(byName),
  standards: (): ArchiveRecord[] => standards.slice().sort(byName),
  protocols: (): ArchiveRecord[] => protocols.slice().sort(byName),
  practices: (): ArchiveRecord[] => practices.slice().sort(byName),
  resolveEntry: (slug: string): ResolvedArchive | null => {
    const r = AT_BY_SLUG.get(slug);
    return r ? resolveRecord(r) : null;
  },
};
