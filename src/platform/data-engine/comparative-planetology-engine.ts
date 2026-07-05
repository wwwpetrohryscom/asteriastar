import {
  BA_RECORDS,
  BA_BY_SLUG,
  interiors,
  processes,
  worldtypes,
  type PlanetologyRecord,
} from "@/knowledge-graph/data/comparative-planetology-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Comparative Planetology Engine — resolver and query surface for the Comparative Planetology &
 * Planetary Atmospheres Encyclopedia (engine.comparativePlanetology). Pure, deterministic,
 * framework-free. It resolves the interior-layer, planetary-process, and world-type entities and
 * REUSES the planets, moons, Pluto, the planetary classes, the magnetosphere, the cryovolcano
 * feature, the habitable zone, and the ocean-worlds theme via the graph, creating and fabricating
 * nothing.
 */
type Ref = { id: string; name: string; href?: string };
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  return e ? { id, name: e.name, href: entityGraphPath(e) } : undefined;
}
const byName = (a: PlanetologyRecord, b: PlanetologyRecord) => a.name.localeCompare(b.name);

export interface ResolvedPlanetology {
  record: PlanetologyRecord;
  related: Ref[]; // reused or sibling entities it uses
  usedBy: Ref[]; // other BA entities that reference this one
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveRecord(r: PlanetologyRecord): ResolvedPlanetology {
  const entity = getEntityById(r.id);
  return {
    record: r,
    related: (r.relatedKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    usedBy: BA_RECORDS.filter((o) => o.id !== r.id && (o.relatedKeys ?? []).includes(r.id))
      .map((o) => refFromId(o.id))
      .filter(Boolean) as Ref[],
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export const comparativePlanetologyEngine = {
  count: BA_RECORDS.length,
  processCount: processes.length,
  all: (): PlanetologyRecord[] => BA_RECORDS.slice(),
  get: (slug: string): PlanetologyRecord | undefined => BA_BY_SLUG.get(slug),
  interiors: (): PlanetologyRecord[] => interiors.slice().sort(byName),
  processes: (): PlanetologyRecord[] => processes.slice().sort(byName),
  worldtypes: (): PlanetologyRecord[] => worldtypes.slice().sort(byName),
  resolveEntry: (slug: string): ResolvedPlanetology | null => {
    const r = BA_BY_SLUG.get(slug);
    return r ? resolveRecord(r) : null;
  },
};
