import {
  CH_RECORDS,
  CH_BY_SLUG,
  type ChRecord,
  type ChKind,
} from "@/knowledge-graph/data/astronomy-software-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Astronomy Software Engine — resolver and query surface for the Astronomical Software Ecosystem
 * Encyclopedia (engine.astronomySoftware). Pure, deterministic, framework-free. It resolves the desktop,
 * imaging, acquisition, scientific, and library packages, and REUSES the existing research software,
 * ephemeris systems, data archives and standards, observing techniques, observatories, and equipment via
 * the graph, fabricating nothing.
 */
type Ref = { id: string; name: string; href?: string };
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  return e ? { id, name: e.name, href: entityGraphPath(e) } : undefined;
}
const byName = (a: ChRecord, b: ChRecord) => a.name.localeCompare(b.name);
const byKind = (k: ChKind) => CH_RECORDS.filter((r) => r.kind === k).sort(byName);

export interface ResolvedCh {
  record: ChRecord;
  related: Ref[];
  usedBy: Ref[];
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveRecord(r: ChRecord): ResolvedCh {
  const entity = getEntityById(r.id);
  return {
    record: r,
    related: (r.relatedKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    usedBy: CH_RECORDS.filter((o) => o.id !== r.id && (o.relatedKeys ?? []).includes(r.id))
      .map((o) => refFromId(o.id))
      .filter(Boolean) as Ref[],
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export const astronomySoftwareEngine = {
  count: CH_RECORDS.length,
  all: (): ChRecord[] => CH_RECORDS.slice(),
  get: (slug: string): ChRecord | undefined => CH_BY_SLUG.get(slug),
  desktop: (): ChRecord[] => byKind("desktop"),
  imaging: (): ChRecord[] => byKind("imaging"),
  acquisition: (): ChRecord[] => byKind("acquisition"),
  scientific: (): ChRecord[] => byKind("scientific"),
  libraries: (): ChRecord[] => byKind("library"),
  byKind: (k: ChKind): ChRecord[] => byKind(k),
  resolveEntry: (slug: string): ResolvedCh | null => {
    const r = CH_BY_SLUG.get(slug);
    return r ? resolveRecord(r) : null;
  },
};
