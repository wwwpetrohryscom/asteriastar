import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { EXO_LEGACY_RELATION_IDS } from "@/knowledge-graph/data/exoplanet-catalog/legacy-relations";
import { DETECTION_METHODS, PLANET_CLASSES, type ExoplanetRecord } from "@/knowledge-graph/data/exoplanet-catalog/types";
import { records as c0 } from "@/knowledge-graph/data/exoplanet-catalog/records/chunk-00";
import { records as c1 } from "@/knowledge-graph/data/exoplanet-catalog/records/chunk-01";
import { records as c2 } from "@/knowledge-graph/data/exoplanet-catalog/records/chunk-02";

/**
 * Exoplanet catalog. Planet records (from the NASA Exoplanet Archive) drive the
 * derivation of new exoplanet entities, host-star entities (only where the star
 * is not already in the Star Encyclopedia), planetary systems, detection
 * methods, classes, the catalogue, and a habitable-zone concept — plus all
 * relations. Existing exoplanets and host stars are reused by id. Every planet
 * connects to its host (no orphans); nothing is fabricated; habitability is
 * never asserted as certainty.
 */
export const EXOPLANET_RECORDS: ExoplanetRecord[] = [...c0, ...c1, ...c2];

export const EXO_BY_ID = new Map(EXOPLANET_RECORDS.map((r) => [r.id, r]));
export const EXO_BY_SLUG = new Map(EXOPLANET_RECORDS.map((r) => [r.slug, r]));

const CLASS_LABEL = new Map(PLANET_CLASSES.map((c) => [c.slug, c.name]));
const METHOD_LABEL = new Map(DETECTION_METHODS.map((m) => [m.slug, m.name]));

const CATALOGUE_ID = "exoplanet_catalogue:nasa-exoplanet-archive";
const HZ_ID = "habitable_zone_candidate:habitable-zone";

/* ----------------------------------------------------- derived host stars & systems */

export interface HostInfo { slug: string; id: string; existing: boolean; name: string; record: ExoplanetRecord; planets: ExoplanetRecord[]; }
const HOSTS = new Map<string, HostInfo>();
for (const r of EXOPLANET_RECORDS) {
  let h = HOSTS.get(r.hostId);
  if (!h) { h = { slug: r.hostSlug, id: r.hostId, existing: r.hostExisting, name: r.hostName, record: r, planets: [] }; HOSTS.set(r.hostId, h); }
  h.planets.push(r);
}

export interface ExoSystem { slug: string; id: string; name: string; hostId: string; planets: ExoplanetRecord[]; }
export const EXO_SYSTEMS: ExoSystem[] = [...HOSTS.values()]
  .filter((h) => h.planets.length >= 2)
  .map((h) => ({ slug: `${h.slug}-system`, id: `planetary_system:${h.slug}-system`, name: `${h.name} system`, hostId: h.id, planets: h.planets }));
const SYSTEM_BY_HOST = new Map(EXO_SYSTEMS.map((s) => [s.hostId, s]));
export const EXO_SYSTEM_BY_SLUG = new Map(EXO_SYSTEMS.map((s) => [s.slug, s]));
export const EXO_HOSTS: HostInfo[] = [...HOSTS.values()];
export const EXO_HOST_BY_SLUG = new Map(EXO_HOSTS.filter((h) => !h.existing).map((h) => [h.slug, h]));
export const EXO_HOST_BY_ID = new Map(EXO_HOSTS.map((h) => [h.id, h]));

/* ----------------------------------------------------------- descriptions */

function planetDesc(r: ExoplanetRecord): string {
  const cls = r.classSlug ? CLASS_LABEL.get(r.classSlug) ?? "exoplanet" : "exoplanet";
  const disc = r.discoveryYear ? `, discovered in ${r.discoveryYear}` : "";
  const method = r.methodSlug ? ` by the ${METHOD_LABEL.get(r.methodSlug)?.toLowerCase()}` : "";
  return `${r.name} is ${/^[aeiou]/i.test(cls) ? "an" : "a"} ${cls.toLowerCase()} orbiting ${r.hostName}${disc}${method}.`;
}
function hostDesc(h: HostInfo): string {
  const sp = h.record.hostSpectralType ? `a ${h.record.hostSpectralType} star ` : "a star ";
  const n = h.planets.length;
  const d = h.record.hostDistancePc ? `, about ${Math.round(h.record.hostDistancePc * 3.262)} light-years away` : "";
  return `${h.name} is ${sp}that hosts ${n} known exoplanet${n === 1 ? "" : "s"} in this catalogue${d}.`;
}

/* ----------------------------------------------------------- entities */

const newPlanets = EXOPLANET_RECORDS.filter((r) => !r.existing);

const planetEntities: GraphEntity[] = newPlanets.map((r) => ({
  id: r.id, type: "exoplanet" as EntityType, name: r.name, domain: "science" as const,
  entryPath: `/exoplanets/${r.slug}`, description: planetDesc(r), sources: r.sources,
}));

const hostEntities: GraphEntity[] = [...HOSTS.values()].filter((h) => !h.existing).map((h) => ({
  id: h.id, type: "host_star" as EntityType, name: h.name, domain: "science" as const,
  entryPath: `/exoplanets/${h.slug}`, description: hostDesc(h),
  aliases: [h.record.hostSpectralType].filter((x): x is string => Boolean(x)), sources: ["nasa"],
}));

const systemEntities: GraphEntity[] = EXO_SYSTEMS.map((s) => ({
  id: s.id, type: "planetary_system" as EntityType, name: s.name, domain: "science" as const,
  entryPath: `/exoplanets/${s.slug}`,
  description: `The ${s.name} is a planetary system with ${s.planets.length} known planets in this catalogue.`, sources: ["nasa"],
}));

const methodEntities: GraphEntity[] = DETECTION_METHODS.map((m) => ({
  id: `exoplanet_detection_method:${m.slug}`, type: "exoplanet_detection_method" as EntityType, name: m.name,
  domain: "science" as const, entryPath: `/exoplanets/${m.slug}`, description: m.description, sources: ["nasa"],
}));

const classEntities: GraphEntity[] = PLANET_CLASSES.map((c) => ({
  id: `planetary_class:${c.slug}`, type: "planetary_class" as EntityType, name: c.name,
  domain: "science" as const, entryPath: `/exoplanets/${c.slug}`, description: c.description, sources: ["nasa"],
}));

const conceptEntities: GraphEntity[] = [
  { id: CATALOGUE_ID, type: "exoplanet_catalogue", name: "NASA Exoplanet Archive", domain: "science",
    entryPath: "/exoplanets", description: "The NASA Exoplanet Archive is the authoritative catalogue of confirmed exoplanets and their measured parameters.", sources: ["nasa"] },
  { id: HZ_ID, type: "habitable_zone_candidate", name: "Habitable zone", domain: "science",
    entryPath: "/exoplanets/discover/potentially-habitable", description: "The habitable zone is the range of orbits around a star where a planet could, in principle, hold liquid water on its surface. Lying in the zone is not a guarantee of habitability.", sources: ["nasa"] },
];

export const entities: GraphEntity[] = [
  ...planetEntities, ...hostEntities, ...systemEntities, ...methodEntities, ...classEntities, ...conceptEntities,
];

/* ----------------------------------------------------------- relations */

const derived: GraphRelation[] = [];
const seen = new Set<string>();
function add(from: string | undefined, type: RelationType, to: string | undefined, note?: string) {
  if (!from || !to || from === to) return;
  const id = `${from}|${type}|${to}`;
  if (EXO_LEGACY_RELATION_IDS.has(id) || seen.has(id)) return;
  seen.add(id);
  derived.push(rel(from, type, to, "confirmed", "science", note ? { note } : {}));
}

const ARCHETYPE: Record<string, string> = {
  "hot-jupiter": "exoplanet:51-pegasi-b", "super-earth": "exoplanet:55-cancri-e",
  "mini-neptune": "exoplanet:gj-1214-b", "gas-giant": "exoplanet:hd-209458-b", terrestrial: "exoplanet:trappist-1-e",
};

for (const r of EXOPLANET_RECORDS) {
  add(r.id, "orbits_star", r.hostId);
  const sys = SYSTEM_BY_HOST.get(r.hostId);
  if (sys) add(r.id, "member_of_planetary_system", sys.id);
  if (r.methodSlug) add(r.id, "discovered_by_method", `exoplanet_detection_method:${r.methodSlug}`);
  if (r.facilityId) {
    const t = r.facilityId.startsWith("space_telescope:") || r.facilityId.startsWith("space_mission:") ? "discovered_by_mission" : "discovered_by_facility";
    add(r.id, t, r.facilityId);
  }
  add(r.id, "part_of_catalogue", CATALOGUE_ID);
  if (r.habitableCandidate) add(r.id, "candidate_for_habitable_zone", HZ_ID);
}
for (const m of DETECTION_METHODS) add(`exoplanet_detection_method:${m.slug}`, "part_of_catalogue", CATALOGUE_ID);
for (const c of PLANET_CLASSES) if (ARCHETYPE[c.slug] && EXO_BY_ID.has(ARCHETYPE[c.slug])) add(`planetary_class:${c.slug}`, "similar_to", ARCHETYPE[c.slug]);

export const relations: GraphRelation[] = derived;

/* ----------------------------------------------------------- indexes & stats */

export const EXO_BY_CLASS = new Map<string, ExoplanetRecord[]>();
for (const r of EXOPLANET_RECORDS) { if (!r.classSlug) continue; (EXO_BY_CLASS.get(r.classSlug) ?? EXO_BY_CLASS.set(r.classSlug, []).get(r.classSlug)!).push(r); }

export const EXO_STATS = {
  planets: EXOPLANET_RECORDS.length,
  newPlanets: planetEntities.length,
  newHosts: hostEntities.length,
  reusedHosts: [...HOSTS.values()].filter((h) => h.existing).length,
  systems: EXO_SYSTEMS.length,
  newEntities: entities.length,
  relations: relations.length,
  habitable: EXOPLANET_RECORDS.filter((r) => r.habitableCandidate).length,
} as const;

export function validateExoplanets(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const seenSlug = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  // Slug uniqueness across all routable entities under /exoplanets.
  for (const e of entities) {
    if (seenId.has(e.id)) issues.push(`duplicate exoplanet-catalog id: ${e.id}`);
    seenId.add(e.id);
    if (!ID.test(e.id)) issues.push(`bad id: ${e.id}`);
    const slug = e.entryPath?.startsWith("/exoplanets/") ? e.entryPath.slice("/exoplanets/".length) : undefined;
    if (slug) { if (seenSlug.has(slug)) issues.push(`duplicate /exoplanets slug: ${slug}`); seenSlug.add(slug); }
  }
  // No orphan planets: every planet must orbit a host.
  const orbits = new Set(relations.filter((x) => x.type === "orbits_star").map((x) => x.from));
  for (const r of EXOPLANET_RECORDS) if (!orbits.has(r.id)) issues.push(`orphan exoplanet (no host): ${r.id}`);
  // Every new entity carries at least one relation (no isolated nodes).
  const connected = new Set<string>();
  for (const x of relations) { connected.add(x.from); connected.add(x.to); }
  for (const e of entities) if (!connected.has(e.id)) issues.push(`isolated new entity: ${e.id}`);
  return issues;
}
