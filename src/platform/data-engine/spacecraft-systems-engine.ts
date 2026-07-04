import {
  SYS_RECORDS,
  SYS_BY_SLUG,
  subsystems,
  components,
  type SysCategory,
  type SysRecord,
} from "@/knowledge-graph/data/spacecraft-systems-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Spacecraft Systems Engine — resolver and query surface for the Spacecraft Systems &
 * Engineering Encyclopedia (engine.spacecraftSystems). Pure, deterministic, framework-free.
 * It resolves the subsystem and component entities and REUSES docking systems, life-support
 * systems, antennas, and attitude sensors via the graph, creating and fabricating nothing.
 */
type Ref = { id: string; name: string; href?: string };
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  return e ? { id, name: e.name, href: entityGraphPath(e) } : undefined;
}
const byName = (a: SysRecord, b: SysRecord) => a.name.localeCompare(b.name, "en", { numeric: true });

export interface ResolvedSys {
  record: SysRecord;
  subsystem?: Ref;
  components: SysRecord[]; // for a subsystem: its components
  related: Ref[];
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveRecord(r: SysRecord): ResolvedSys {
  const entity = getEntityById(r.id);
  return {
    record: r,
    subsystem: r.kind === "component" ? refFromId(`spacecraft_subsystem:${r.subsystemSlug}`) : undefined,
    components: r.kind === "subsystem" ? components.filter((x) => x.subsystemSlug === r.slug).sort(byName) : [],
    related: (r.relatedKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export const spacecraftSystemsEngine = {
  count: SYS_RECORDS.length,
  all: (): SysRecord[] => SYS_RECORDS.slice(),
  get: (slug: string): SysRecord | undefined => SYS_BY_SLUG.get(slug),
  subsystems: (): SysRecord[] => subsystems.slice(),
  components: (): SysRecord[] => components.slice().sort(byName),
  byCategory: (c: SysCategory): SysRecord[] => SYS_RECORDS.filter((r) => r.category === c).sort(byName),
  componentsOf: (subsystemSlug: string): SysRecord[] => components.filter((x) => x.subsystemSlug === subsystemSlug).sort(byName),
  resolveEntry: (slug: string): ResolvedSys | null => {
    const r = SYS_BY_SLUG.get(slug);
    return r ? resolveRecord(r) : null;
  },
};
