import {
  AW_RECORDS,
  AW_BY_SLUG,
  phenomena,
  impacts,
  services,
  type HelioRecord,
} from "@/knowledge-graph/data/heliophysics-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Heliophysics Engine — resolver and query surface for the Heliophysics & Space Weather Operations
 * Encyclopedia (engine.heliophysics). Pure, deterministic, framework-free. It resolves the
 * solar-source-phenomenon, operational-impact, and forecasting-service entities and REUSES the
 * space-weather phenomena, the NOAA scales, the radiation environments, the Parker/Solar Orbiter/
 * DSCOVR/ACE missions, and the SWPC/NOAA/ESA organisations via the graph, creating and fabricating
 * nothing.
 */
type Ref = { id: string; name: string; href?: string };
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  return e ? { id, name: e.name, href: entityGraphPath(e) } : undefined;
}
const byName = (a: HelioRecord, b: HelioRecord) => a.name.localeCompare(b.name);

export interface ResolvedHeliophysics {
  record: HelioRecord;
  related: Ref[]; // reused or sibling entities it uses
  usedBy: Ref[]; // other AW entities that reference this one
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveRecord(r: HelioRecord): ResolvedHeliophysics {
  const entity = getEntityById(r.id);
  return {
    record: r,
    related: (r.relatedKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    usedBy: AW_RECORDS.filter((o) => o.id !== r.id && (o.relatedKeys ?? []).includes(r.id))
      .map((o) => refFromId(o.id))
      .filter(Boolean) as Ref[],
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export const heliophysicsEngine = {
  count: AW_RECORDS.length,
  impactCount: impacts.length,
  all: (): HelioRecord[] => AW_RECORDS.slice(),
  get: (slug: string): HelioRecord | undefined => AW_BY_SLUG.get(slug),
  phenomena: (): HelioRecord[] => phenomena.slice().sort(byName),
  impacts: (): HelioRecord[] => impacts.slice().sort(byName),
  services: (): HelioRecord[] => services.slice().sort(byName),
  resolveEntry: (slug: string): ResolvedHeliophysics | null => {
    const r = AW_BY_SLUG.get(slug);
    return r ? resolveRecord(r) : null;
  },
};
