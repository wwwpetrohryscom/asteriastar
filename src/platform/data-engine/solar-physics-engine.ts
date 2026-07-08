import {
  BY_RECORDS,
  BY_BY_SLUG,
  structure,
  features,
  dynamics,
  heliosphere,
  type SolarRecord,
  type SolarKind,
} from "@/knowledge-graph/data/solar-physics-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Solar Physics Engine — resolver and query surface for the Solar Physics, Heliosphere & Solar
 * Observatory Encyclopedia (engine.solarPhysics). Pure, deterministic, framework-free. It resolves the
 * solar regions, features, physics/cycle/wind concepts, and heliosphere structures, and REUSES the Sun,
 * the space-weather phenomena, helioseismology, the solar observatories and the operating organisations
 * via the graph, fabricating nothing.
 */
type Ref = { id: string; name: string; href?: string };
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  return e ? { id, name: e.name, href: entityGraphPath(e) } : undefined;
}
const byName = (a: SolarRecord, b: SolarRecord) => a.name.localeCompare(b.name);
const byKind = (k: SolarKind) => BY_RECORDS.filter((r) => r.kind === k).sort(byName);

export interface ResolvedSolar {
  record: SolarRecord;
  related: Ref[];
  usedBy: Ref[];
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveRecord(r: SolarRecord): ResolvedSolar {
  const entity = getEntityById(r.id);
  return {
    record: r,
    related: (r.relatedKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    usedBy: BY_RECORDS.filter((o) => o.id !== r.id && (o.relatedKeys ?? []).includes(r.id))
      .map((o) => refFromId(o.id))
      .filter(Boolean) as Ref[],
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export const solarPhysicsEngine = {
  count: BY_RECORDS.length,
  regionCount: structure.length,
  all: (): SolarRecord[] => BY_RECORDS.slice(),
  get: (slug: string): SolarRecord | undefined => BY_BY_SLUG.get(slug),
  interior: (): SolarRecord[] => byKind("interior"),
  atmosphere: (): SolarRecord[] => byKind("atmosphere"),
  regions: (): SolarRecord[] => structure.slice().sort(byName),
  features: (): SolarRecord[] => features.slice().sort(byName),
  dynamics: (): SolarRecord[] => dynamics.slice().sort(byName),
  physics: (): SolarRecord[] => byKind("physics"),
  cycle: (): SolarRecord[] => byKind("cycle"),
  wind: (): SolarRecord[] => byKind("wind"),
  heliosphere: (): SolarRecord[] => heliosphere.slice().sort(byName),
  resolveEntry: (slug: string): ResolvedSolar | null => {
    const r = BY_BY_SLUG.get(slug);
    return r ? resolveRecord(r) : null;
  },
};
