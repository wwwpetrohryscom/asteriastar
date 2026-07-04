import {
  ENV_RECORDS,
  ENV_BY_ID,
  ENTRY_BY_SLUG,
  ENV_BY_CATEGORY,
  phenomena,
  radiationEnvironments,
  hazards,
  indices,
  monitors,
  type EnvCategory,
  type EnvRecord,
} from "@/knowledge-graph/data/space-environment-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Space Environment Engine — resolver and query surface for the Space Environment & Hazards
 * Encyclopedia (engine.spaceEnvironment). Pure, deterministic, framework-free. It resolves
 * the space-weather, radiation, hazard, and index entities and REUSES the Sun, planets,
 * moons, and solar missions via the graph, creating and fabricating nothing.
 */

type Ref = { id: string; name: string; slug?: string; href?: string };

function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  return e ? { id, name: e.name, href: entityGraphPath(e) } : undefined;
}

export interface ResolvedEnv {
  record: EnvRecord;
  affects: Ref[];
  monitoredBy: Ref[];
  origin?: Ref;
  related: Ref[];
  partOf?: Ref;
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveRecord(r: EnvRecord): ResolvedEnv {
  const entity = getEntityById(r.id);
  return {
    record: r,
    affects: (r.affectsKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    monitoredBy: (r.monitoredByKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    origin: refFromId(r.originKey),
    related: (r.relatedKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    partOf: refFromId(r.partOfKey),
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

const byName = (a: EnvRecord, b: EnvRecord) => a.name.localeCompare(b.name, "en", { numeric: true });

export const spaceEnvironmentEngine = {
  count: phenomena.length + radiationEnvironments.length + hazards.length + indices.length,
  recordCount: ENV_RECORDS.length,

  all: (): EnvRecord[] => [...phenomena, ...radiationEnvironments, ...hazards, ...indices].sort(byName),
  get: (slug: string): EnvRecord | undefined => ENTRY_BY_SLUG.get(slug) ?? ENV_BY_ID.get(slug),

  phenomena: (): EnvRecord[] => phenomena.slice(),
  radiationEnvironments: (): EnvRecord[] => radiationEnvironments.slice(),
  hazards: (): EnvRecord[] => hazards.slice(),
  indices: (): EnvRecord[] => indices.slice(),
  monitors: (): EnvRecord[] => monitors.slice(),
  byCategory: (c: EnvCategory): EnvRecord[] => (ENV_BY_CATEGORY.get(c) ?? []).slice().sort(byName),
  monitoringAssets: (): Ref[] => {
    const ids = new Set<string>();
    for (const r of [...phenomena, ...radiationEnvironments, ...hazards, ...indices]) for (const k of r.monitoredByKeys ?? []) ids.add(k);
    return [...ids].map((k) => refFromId(k)).filter(Boolean) as Ref[];
  },

  resolveEntry: (slug: string): ResolvedEnv | null => {
    const r = ENTRY_BY_SLUG.get(slug);
    return r ? resolveRecord(r) : null;
  },
  resolvePhenomenon: (slug: string): ResolvedEnv | null => {
    const r = ENTRY_BY_SLUG.get(slug);
    return r && r.kind === "phenomenon" ? resolveRecord(r) : null;
  },
  resolveHazard: (slug: string): ResolvedEnv | null => {
    const r = ENTRY_BY_SLUG.get(slug);
    return r && r.kind === "hazard" ? resolveRecord(r) : null;
  },
};
