import {
  BG_RECORDS,
  BG_BY_SLUG,
  structure,
  dynamics,
  type GalacticRecord,
} from "@/knowledge-graph/data/galactic-astronomy-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Galactic Astronomy Engine — resolver and query surface for the Galactic Astronomy & the Milky Way
 * Encyclopedia (engine.galacticAstronomy). Pure, deterministic, framework-free. It resolves the
 * galactic-structure and galactic-dynamics entities and REUSES the Milky Way, Sagittarius A*, the
 * Local Group, the Magellanic Clouds, Andromeda, the dark-matter halo, the rotation-curve method,
 * the galaxy-merger process, Gaia, the interstellar medium, and the stellar-populations concept via
 * the graph, fabricating nothing.
 */
type Ref = { id: string; name: string; href?: string };
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  return e ? { id, name: e.name, href: entityGraphPath(e) } : undefined;
}
const byName = (a: GalacticRecord, b: GalacticRecord) => a.name.localeCompare(b.name);

export interface ResolvedGalacticAstronomy {
  record: GalacticRecord;
  related: Ref[]; // reused or sibling entities it uses
  usedBy: Ref[]; // other BG entities that reference this one
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveRecord(r: GalacticRecord): ResolvedGalacticAstronomy {
  const entity = getEntityById(r.id);
  return {
    record: r,
    related: (r.relatedKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    usedBy: BG_RECORDS.filter((o) => o.id !== r.id && (o.relatedKeys ?? []).includes(r.id))
      .map((o) => refFromId(o.id))
      .filter(Boolean) as Ref[],
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export const galacticAstronomyEngine = {
  count: BG_RECORDS.length,
  structureCount: structure.length,
  all: (): GalacticRecord[] => BG_RECORDS.slice(),
  get: (slug: string): GalacticRecord | undefined => BG_BY_SLUG.get(slug),
  structure: (): GalacticRecord[] => structure.slice().sort(byName),
  dynamics: (): GalacticRecord[] => dynamics.slice().sort(byName),
  resolveEntry: (slug: string): ResolvedGalacticAstronomy | null => {
    const r = BG_BY_SLUG.get(slug);
    return r ? resolveRecord(r) : null;
  },
};
