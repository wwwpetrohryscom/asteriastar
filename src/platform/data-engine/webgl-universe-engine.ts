import {
  WU_RECORDS,
  WU_BY_SLUG,
  WU_STATS,
  scenes,
  CATEGORY_LABEL,
  COVERAGE_LABEL,
  entryPathFor,
  type UniverseSceneRecord,
  type SceneCategory,
  type CoverageMode,
} from "@/knowledge-graph/data/webgl-universe-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Universe Engine — resolver and query surface for the 3D/Canvas Universe Platform
 * (engine.webglUniverse). It resolves the universe-scene entities, REUSES the bodies, stars,
 * constellations, galaxies and galactic structures each scene renders via the graph, and completes the
 * "3D-ready" Sky Atlas views. It fabricates no geometry: the scene data itself is built from measured
 * coordinates by the pure builders in src/lib/universe-3d, and where no numeric geometry exists a scene
 * is honestly descriptive.
 */
type Ref = { id: string; name: string; href?: string };
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  return e ? { id, name: e.name, href: entityGraphPath(e) } : undefined;
}
const byName = (a: UniverseSceneRecord, b: UniverseSceneRecord) => a.name.localeCompare(b.name);

export interface ResolvedScene {
  record: UniverseSceneRecord;
  entryPath: string;
  completes: Ref | undefined;
  related: Ref[];
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveRecord(r: UniverseSceneRecord): ResolvedScene {
  const entity = getEntityById(r.id);
  return {
    record: r,
    entryPath: entryPathFor(r),
    completes: refFromId(r.completesAtlasView),
    related: (r.relatedKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export const webglUniverseEngine = {
  count: WU_RECORDS.length,
  sceneCount: scenes.length,
  stats: WU_STATS,
  all: (): UniverseSceneRecord[] => WU_RECORDS.slice().sort(byName),
  get: (slug: string): UniverseSceneRecord | undefined => WU_BY_SLUG.get(slug),
  byCategory: (c: SceneCategory): UniverseSceneRecord[] => WU_RECORDS.filter((r) => r.category === c).sort(byName),
  categories: (): SceneCategory[] => ["solar-system", "stellar", "galactic", "extragalactic"],
  /** Scenes that render a real interactive 3D view (real geometry), as opposed to descriptive ones. */
  interactiveScenes: (): UniverseSceneRecord[] => WU_RECORDS.filter((r) => r.interactive),
  categoryLabel: (c: SceneCategory): string => CATEGORY_LABEL[c],
  coverageLabel: (c: CoverageMode): string => COVERAGE_LABEL[c],
  resolveEntry: (slug: string): ResolvedScene | null => {
    const r = WU_BY_SLUG.get(slug);
    return r ? resolveRecord(r) : null;
  },
};
