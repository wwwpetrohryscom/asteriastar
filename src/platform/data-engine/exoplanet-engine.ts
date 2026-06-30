import {
  EXOPLANET_RECORDS, EXO_BY_ID, EXO_BY_SLUG, EXO_BY_CLASS,
  EXO_SYSTEMS, EXO_SYSTEM_BY_SLUG, EXO_HOSTS, EXO_HOST_BY_SLUG,
  type ExoSystem, type HostInfo,
} from "@/knowledge-graph/data/exoplanet-catalog";
import { DETECTION_METHODS, PLANET_CLASSES, type ExoplanetRecord } from "@/knowledge-graph/data/exoplanet-catalog/types";
import { getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Exoplanet Engine — resolver and query surface for the exoplanets encyclopedia.
 * Resolves any /exoplanets slug to a planet, host star, system, detection method,
 * or planetary class. Pure, deterministic, framework-independent.
 */

const METHOD_BY_SLUG = new Map(DETECTION_METHODS.map((m) => [m.slug, m]));
const CLASS_BY_SLUG = new Map(PLANET_CLASSES.map((c) => [c.slug, c]));
const ly = (pc: number | undefined) => (pc == null ? undefined : Math.round(pc * 3.262));

type Ref = { id: string; name: string; href: string };
function entRef(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  if (!e) return undefined;
  return { id, name: e.name, href: e.entryPath ?? `/explore/entity/${id.replace(":", "/")}` };
}

export interface ResolvedPlanet {
  kind: "planet";
  record: ExoplanetRecord;
  className?: string;
  host?: Ref;
  system?: { slug: string; name: string };
  method?: { slug: string; name: string };
  facility?: Ref;
  distanceLy?: number;
  siblings: ExoplanetRecord[];
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}
export interface ResolvedHost { kind: "host"; host: HostInfo; planets: ExoplanetRecord[]; distanceLy?: number; quality: EntityQuality | null; reviewStatus: ReviewStatus; connections: ReturnType<typeof getConnectionsByDomain>; }
export interface ResolvedSystem { kind: "system"; system: ExoSystem; host?: Ref; planets: ExoplanetRecord[]; years: number[]; }
export interface ResolvedMethod { kind: "method"; method: (typeof DETECTION_METHODS)[number]; examples: ExoplanetRecord[]; }
export interface ResolvedClass { kind: "class"; cls: (typeof PLANET_CLASSES)[number]; planets: ExoplanetRecord[] }
export type ResolvedExo = ResolvedPlanet | ResolvedHost | ResolvedSystem | ResolvedMethod | ResolvedClass;

function resolvePlanet(r: ExoplanetRecord): ResolvedPlanet {
  const sys = EXO_SYSTEMS.find((s) => s.planets.includes(r));
  const m = r.methodSlug ? METHOD_BY_SLUG.get(r.methodSlug) : undefined;
  const entity = getEntityById(r.id);
  return {
    kind: "planet", record: r,
    className: r.classSlug ? CLASS_BY_SLUG.get(r.classSlug)?.name : undefined,
    host: entRef(r.hostId),
    system: sys ? { slug: sys.slug, name: sys.name } : undefined,
    method: m ? { slug: m.slug, name: m.name } : undefined,
    facility: entRef(r.facilityId),
    distanceLy: ly(r.hostDistancePc),
    siblings: (sys?.planets ?? []).filter((p) => p.id !== r.id),
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

function resolve(slug: string): ResolvedExo | null {
  const p = EXO_BY_SLUG.get(slug); if (p) return resolvePlanet(p);
  const h = EXO_HOST_BY_SLUG.get(slug);
  if (h) { const e = getEntityById(h.id); return { kind: "host", host: h, planets: h.planets, distanceLy: ly(h.record.hostDistancePc), quality: e ? computeEntityQuality(e) : null, reviewStatus: reviewStatusFor(h.id), connections: getConnectionsByDomain(h.id) }; }
  const s = EXO_SYSTEM_BY_SLUG.get(slug);
  if (s) return { kind: "system", system: s, host: entRef(s.hostId), planets: s.planets.slice().sort(byPeriod), years: [...new Set(s.planets.map((p) => p.discoveryYear).filter((y): y is number => Boolean(y)))].sort() };
  const m = METHOD_BY_SLUG.get(slug);
  if (m) return { kind: "method", method: m, examples: EXOPLANET_RECORDS.filter((r) => r.methodSlug === slug).slice(0, 12) };
  const c = CLASS_BY_SLUG.get(slug);
  if (c) return { kind: "class", cls: c, planets: (EXO_BY_CLASS.get(slug) ?? []).slice() };
  return null;
}

const byPeriod = (a: ExoplanetRecord, b: ExoplanetRecord) => (a.orbitalPeriodDays ?? 9e9) - (b.orbitalPeriodDays ?? 9e9);
const byDist = (a: ExoplanetRecord, b: ExoplanetRecord) => (a.hostDistancePc ?? 9e9) - (b.hostDistancePc ?? 9e9);

/** Every routable /exoplanets slug (planets, hosts, systems, methods, classes). */
function allSlugs(): string[] {
  return [
    ...EXOPLANET_RECORDS.map((r) => r.slug),
    ...EXO_HOSTS.filter((h) => !h.existing).map((h) => h.slug),
    ...EXO_SYSTEMS.map((s) => s.slug),
    ...DETECTION_METHODS.map((m) => m.slug),
    ...PLANET_CLASSES.map((c) => c.slug),
  ];
}

export const exoplanetEngine = {
  planetCount: EXOPLANET_RECORDS.length,
  systemCount: EXO_SYSTEMS.length,
  hostCount: EXO_HOSTS.length,
  all: (): ExoplanetRecord[] => EXOPLANET_RECORDS,
  allSlugs,
  resolve,
  getPlanet: (slug: string): ExoplanetRecord | undefined => EXO_BY_SLUG.get(slug) ?? EXO_BY_ID.get(slug),
  byClass: (classSlug: string): ExoplanetRecord[] => (EXO_BY_CLASS.get(classSlug) ?? []).slice().sort(byPeriod),
  byMethod: (methodSlug: string): ExoplanetRecord[] => EXOPLANET_RECORDS.filter((r) => r.methodSlug === methodSlug).slice().sort(byDist),
  byFacility: (facilityId: string): ExoplanetRecord[] => EXOPLANET_RECORDS.filter((r) => r.facilityId === facilityId).slice().sort(byDist),
  nearby: (limit = 60): ExoplanetRecord[] => EXOPLANET_RECORDS.filter((r) => r.hostDistancePc != null).slice().sort(byDist).slice(0, limit),
  habitable: (): ExoplanetRecord[] => EXOPLANET_RECORDS.filter((r) => r.habitableCandidate).slice().sort(byDist),
  famous: (limit = 12): ExoplanetRecord[] => {
    const f = ["proxima-centauri-b", "trappist-1-e", "51-pegasi-b", "hd-209458-b", "kepler-186f", "55-cancri-e", "k2-18-b", "hr-8799-b", "wasp-12-b", "kepler-452-b", "gj-1214-b", "bet-pic-b"];
    return f.map((s) => EXO_BY_SLUG.get(s)).filter((x): x is ExoplanetRecord => Boolean(x)).slice(0, limit);
  },
  multiPlanetSystems: (): ExoSystem[] => EXO_SYSTEMS.slice().sort((a, b) => b.planets.length - a.planets.length),
  methods: () => DETECTION_METHODS.map((m) => ({ ...m, count: EXOPLANET_RECORDS.filter((r) => r.methodSlug === m.slug).length })),
  classes: () => PLANET_CLASSES.map((c) => ({ ...c, count: (EXO_BY_CLASS.get(c.slug) ?? []).length })),
};
