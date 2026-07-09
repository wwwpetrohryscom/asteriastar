import {
  CB_RECORDS,
  CB_BY_SLUG,
  propulsion,
  performance,
  maneuvers,
  type EngRecord,
  type EngKind,
} from "@/knowledge-graph/data/space-engineering-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Space Engineering Engine — resolver and query surface for the Space Engineering & Launch Systems Deep
 * Dive Encyclopedia (engine.spaceEngineering). Pure, deterministic, framework-free. It resolves the
 * propulsion methods, rocketry principles, and flight maneuvers, and REUSES the rocket engines, stages
 * and propellants, the spacecraft subsystems and components, the docking and navigation systems, and the
 * operations functions via the graph, fabricating nothing.
 */
type Ref = { id: string; name: string; href?: string };
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  return e ? { id, name: e.name, href: entityGraphPath(e) } : undefined;
}
const byName = (a: EngRecord, b: EngRecord) => a.name.localeCompare(b.name);
const byKind = (k: EngKind) => CB_RECORDS.filter((r) => r.kind === k).sort(byName);

export interface ResolvedEng {
  record: EngRecord;
  related: Ref[];
  usedBy: Ref[];
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveRecord(r: EngRecord): ResolvedEng {
  const entity = getEntityById(r.id);
  return {
    record: r,
    related: (r.relatedKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    usedBy: CB_RECORDS.filter((o) => o.id !== r.id && (o.relatedKeys ?? []).includes(r.id))
      .map((o) => refFromId(o.id))
      .filter(Boolean) as Ref[],
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export const spaceEngineeringEngine = {
  count: CB_RECORDS.length,
  all: (): EngRecord[] => CB_RECORDS.slice(),
  get: (slug: string): EngRecord | undefined => CB_BY_SLUG.get(slug),
  propulsion: (): EngRecord[] => propulsion.slice().sort(byName),
  performance: (): EngRecord[] => performance.slice().sort(byName),
  maneuvers: (): EngRecord[] => maneuvers.slice().sort(byName),
  byKind: (k: EngKind): EngRecord[] => byKind(k),
  resolveEntry: (slug: string): ResolvedEng | null => {
    const r = CB_BY_SLUG.get(slug);
    return r ? resolveRecord(r) : null;
  },
};
