import {
  BO_RECORDS,
  BO_BY_SLUG,
  views,
  overlays,
  type AtlasRecord,
} from "@/knowledge-graph/data/sky-atlas-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Sky Atlas Engine — resolver and query surface for the Interactive Sky Atlas & 3D Universe
 * Encyclopedia (engine.skyAtlas). Pure, deterministic, framework-free. It resolves the atlas-view
 * and atlas-overlay entities and REUSES the real stars, deep-sky objects, planets, moons, galaxies,
 * exoplanets, constellations, telescopes and surveys via the graph. It fabricates no positions; the
 * maps are drawn from the measured coordinates already stored in the star and deep-sky catalogs.
 */
type Ref = { id: string; name: string; href?: string };
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  return e ? { id, name: e.name, href: entityGraphPath(e) } : undefined;
}
const byName = (a: AtlasRecord, b: AtlasRecord) => a.name.localeCompare(b.name);

export interface ResolvedAtlas {
  record: AtlasRecord;
  related: Ref[]; // reused or sibling entities it uses
  usedBy: Ref[]; // other BO entities that reference this one
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveRecord(r: AtlasRecord): ResolvedAtlas {
  const entity = getEntityById(r.id);
  return {
    record: r,
    related: (r.relatedKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    usedBy: BO_RECORDS.filter((o) => o.id !== r.id && (o.relatedKeys ?? []).includes(r.id))
      .map((o) => refFromId(o.id))
      .filter(Boolean) as Ref[],
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export const skyAtlasEngine = {
  count: BO_RECORDS.length,
  viewCount: views.length,
  all: (): AtlasRecord[] => BO_RECORDS.slice(),
  get: (slug: string): AtlasRecord | undefined => BO_BY_SLUG.get(slug),
  views: (): AtlasRecord[] => views.slice().sort(byName),
  overlays: (): AtlasRecord[] => overlays.slice().sort(byName),
  skyCharts: (): AtlasRecord[] => views.filter((v) => v.renderMode === "sky-chart").sort(byName),
  resolveEntry: (slug: string): ResolvedAtlas | null => {
    const r = BO_BY_SLUG.get(slug);
    return r ? resolveRecord(r) : null;
  },
};
