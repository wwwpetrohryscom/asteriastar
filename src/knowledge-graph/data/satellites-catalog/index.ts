import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/satellites-catalog/legacy-relations";
import { KIND_ENTITY_TYPE, type SatelliteKind, type SatelliteRecord } from "@/knowledge-graph/data/satellites-catalog/types";
import { orbits } from "@/knowledge-graph/data/satellites-catalog/data/orbits";
import { operators } from "@/knowledge-graph/data/satellites-catalog/data/operators";
import { constellations } from "@/knowledge-graph/data/satellites-catalog/data/constellations";
import { networks } from "@/knowledge-graph/data/satellites-catalog/data/networks";
import { satellites } from "@/knowledge-graph/data/satellites-catalog/data/satellites";

/**
 * Satellite Encyclopedia catalog (Program X). The curated dataset ENRICHES the
 * existing graph entities it reuses — space agencies (as operators), reused
 * rockets (launched_by), reused launch sites (launched_from), and the astronomy
 * satellites already modelled as space telescopes — and CREATES the new ones:
 * individual satellites, satellite constellations, orbit types, civil/commercial
 * operators, and tracking networks. It derives typed relations that reuse existing
 * entities (has_orbit, operated_by, launched_by, launched_from,
 * belongs_to_constellation, associated_with). Cross-references resolve by slug
 * AGAINST THE MAP FOR THE TARGET KIND — a satellite slug and a constellation slug
 * may collide (e.g. "oneweb" is both an operator and a constellation), so resolution
 * is type-aware. Relations that duplicate an existing graph edge or whose endpoints
 * don't resolve are dropped. Nothing is fabricated — every technical figure is
 * source-backed, and unknown values are simply omitted.
 */
export const SATELLITE_RECORDS: SatelliteRecord[] = [
  ...orbits, ...operators, ...constellations, ...networks, ...satellites,
];

export const SATELLITE_BY_ID = new Map(SATELLITE_RECORDS.map((r) => [r.id, r]));

// Per-kind slug → record maps (slugs are unique WITHIN a kind, not across kinds).
const byKind = (k: SatelliteKind) => new Map(SATELLITE_RECORDS.filter((r) => r.kind === k).map((r) => [r.slug, r]));
export const ORBIT_BY_SLUG = byKind("orbit");
export const OPERATOR_BY_SLUG = byKind("operator");
export const CONSTELLATION_BY_SLUG = byKind("constellation");
export const NETWORK_BY_SLUG = byKind("network");
export const SATELLITE_BY_SLUG = byKind("satellite");

/**
 * Existing graph entities referenced by catalogue slug but not (re)defined here —
 * the reused launch vehicles and launch sites. (Agencies are defined as
 * `existing: true` operator records, so they resolve through OPERATOR_BY_SLUG.)
 * Every id here is verified to exist in the graph; a reference to anything not
 * listed simply resolves to `undefined` and its relation is dropped.
 */
const EXTERNAL_SLUG_IDS: Record<string, string> = {
  // reused launch vehicles (rockets catalog)
  "atlas-v": "launch_vehicle:atlas-v",
  "falcon-9": "launch_vehicle:falcon-9",
  "falcon-heavy": "launch_vehicle:falcon-heavy",
  // reused launch sites
  vandenberg: "launch_site:vandenberg",
  "cape-canaveral": "launch_site:cape-canaveral",
  tanegashima: "launch_site:tanegashima",
};

// Type-aware resolvers — each maps a slug to the id of an entity of the RIGHT kind.
const rOperator = (s?: string) => (s ? OPERATOR_BY_SLUG.get(s)?.id : undefined);
const rOrbit = (s?: string) => (s ? ORBIT_BY_SLUG.get(s)?.id : undefined);
const rConstellation = (s?: string) => (s ? CONSTELLATION_BY_SLUG.get(s)?.id : undefined);
const rSatellite = (s?: string) => (s ? SATELLITE_BY_SLUG.get(s)?.id : undefined);
const rExternal = (s?: string) => (s ? EXTERNAL_SLUG_IDS[s] : undefined);
// Reused entities addressed by their own type prefix (validated at the graph level by
// the entry gate + validateGraph, which drop any endpoint that does not resolve).
const rProgram = (s?: string) => (s ? `mission_program:${s}` : undefined);
const rInstrument = (s?: string) => (s ? `scientific_instrument:${s}` : undefined);

/* ----------------------------------------------------------- entities */

/** The published route for each kind (each has a real page — see src/app/satellites). */
export function entryPathFor(r: Pick<SatelliteRecord, "kind" | "slug">): string {
  switch (r.kind) {
    case "constellation":
      return `/satellites/constellation/${r.slug}`;
    case "orbit":
      return `/satellites/orbit/${r.slug}`;
    case "operator":
      return `/satellites/operator/${r.slug}`;
    case "network":
      return `/satellites/network/${r.slug}`;
    case "satellite":
      return `/satellites/${r.slug}`;
  }
}

const newRecords = SATELLITE_RECORDS.filter((r) => !r.existing);

export const entities: GraphEntity[] = newRecords.map((r) => ({
  id: r.id,
  type: r.id.slice(0, r.id.indexOf(":")) as EntityType,
  name: r.name,
  domain: "science" as const,
  entryPath: entryPathFor(r),
  description: r.description,
  aliases: r.altNames,
  sources: r.sources,
}));

/* ----------------------------------------------------------- relations */

const derived: GraphRelation[] = [];
const seenRel = new Set<string>();
function add(from: string, type: RelationType, to: string | undefined) {
  if (!from || !to || from === to) return;
  const id = `${from}|${type}|${to}`;
  if (LEGACY_RELATION_IDS.has(id) || seenRel.has(id)) return;
  seenRel.add(id);
  derived.push(rel(from, type, to, "confirmed", "science"));
}

for (const r of SATELLITE_RECORDS) {
  switch (r.kind) {
    case "satellite":
      add(r.id, "has_orbit", rOrbit(r.orbitSlug));
      add(r.id, "operated_by", rOperator(r.operatorSlug));
      add(r.id, "launched_by", rExternal(r.launchVehicleSlug));
      add(r.id, "launched_from", rExternal(r.launchSiteSlug));
      add(r.id, "belongs_to_constellation", rConstellation(r.constellationSlug));
      add(r.id, "part_of_program", rProgram(r.programSlug));
      for (const i of r.instrumentSlugs ?? []) add(r.id, "contains_instrument", rInstrument(i));
      add(r.id, "replaced_by", rSatellite(r.replacedBySlug));
      for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
      break;
    case "constellation":
      add(r.id, "operated_by", rOperator(r.operatorSlug));
      add(r.id, "has_orbit", rOrbit(r.orbitSlug));
      for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
      break;
    case "network":
      add(r.id, "operated_by", rOperator(r.networkAgencySlug));
      break;
    case "orbit":
    case "operator":
      break; // incoming edges only (has_orbit / operated_by point at them)
  }
}

export const relations: GraphRelation[] = derived;

/* ----------------------------------------------------------- indexes & stats */

function group(key: (r: SatelliteRecord) => string | undefined) {
  const m = new Map<string, SatelliteRecord[]>();
  for (const r of SATELLITE_RECORDS) {
    const k = key(r);
    if (!k) continue;
    (m.get(k) ?? m.set(k, []).get(k)!).push(r);
  }
  return m;
}

export const SATELLITES_BY_KIND = group((r) => r.kind);
export const SATELLITES_BY_CATEGORY = group((r) => (r.kind === "satellite" ? r.category : undefined));
export const SATELLITES_BY_ORBIT = group((r) => (r.kind === "satellite" || r.kind === "constellation" ? r.orbitSlug : undefined));
export const SATELLITES_BY_OPERATOR = group((r) => (r.kind === "satellite" || r.kind === "constellation" ? r.operatorSlug : undefined));
export const SATELLITES_BY_CONSTELLATION = group((r) => (r.kind === "satellite" ? r.constellationSlug : undefined));

export const SATELLITES_STATS = {
  records: SATELLITE_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  byKind: Object.fromEntries([...SATELLITES_BY_KIND.entries()].map(([k, v]) => [k, v.length])),
  satellites: SATELLITES_BY_KIND.get("satellite")?.length ?? 0,
  constellations: SATELLITES_BY_KIND.get("constellation")?.length ?? 0,
  orbits: SATELLITES_BY_KIND.get("orbit")?.length ?? 0,
  operators: SATELLITES_BY_KIND.get("operator")?.length ?? 0,
  networks: SATELLITES_BY_KIND.get("network")?.length ?? 0,
} as const;

export function validateSatellites(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const kinds = new Set(Object.keys(KIND_ENTITY_TYPE) as SatelliteKind[]);
  // Slug uniqueness is enforced PER KIND (cross-kind collisions like "oneweb" are legal).
  const seenSlugByKind = new Map<SatelliteKind, Set<string>>();
  for (const r of SATELLITE_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate satellite id: ${r.id}`);
    seenId.add(r.id);
    const ks = seenSlugByKind.get(r.kind) ?? seenSlugByKind.set(r.kind, new Set()).get(r.kind)!;
    if (ks.has(r.slug)) issues.push(`duplicate ${r.kind} slug: ${r.slug}`);
    ks.add(r.slug);
    if (!ID.test(r.id)) issues.push(`bad satellite id: ${r.id}`);
    if (!kinds.has(r.kind)) issues.push(`${r.id}: unknown kind ${r.kind}`);
    if (r.id !== `${KIND_ENTITY_TYPE[r.kind]}:${r.slug}`) issues.push(`${r.id}: id does not match kind ${r.kind} / slug ${r.slug}`);
    if (!r.sources?.length) issues.push(`${r.id}: missing sources`);
    if (!r.description) issues.push(`${r.id}: missing description`);
    // No fabricated numbers: any present numeric spec must be finite and, for the
    // fields where it makes sense, within a physical range.
    for (const [k, v] of Object.entries(r)) {
      if (typeof v !== "number") continue;
      if (!Number.isFinite(v)) issues.push(`${r.id}: non-finite numeric ${k}=${v}`);
      else if (k === "inclinationDeg") { if (v < 0 || v > 180) issues.push(`${r.id}: inclination out of range: ${v}`); }
      else if (k === "altitudeKm") { if (v <= 0 || v > 500000) issues.push(`${r.id}: implausible altitude: ${v}`); }
      else if (v < 0) issues.push(`${r.id}: invalid numeric ${k}=${v}`);
    }
  }
  // Relation integrity: every referenced cross-reference slug must resolve to a real
  // id OF THE EXPECTED KIND (a catalog record or a verified reused external entity).
  // Catches typos, dangling references, and wrong-kind targets before they reach the
  // graph. (relatedKeys are full graph ids validated later by validateGraph.)
  const checks: [keyof SatelliteRecord, (s?: string) => string | undefined][] = [
    ["operatorSlug", rOperator],
    ["networkAgencySlug", rOperator],
    ["orbitSlug", rOrbit],
    ["constellationSlug", rConstellation],
    ["replacedBySlug", rSatellite],
    ["launchVehicleSlug", rExternal],
    ["launchSiteSlug", rExternal],
    ["programSlug", rProgram],
  ];
  for (const r of SATELLITE_RECORDS) {
    for (const [f, fn] of checks) {
      const slug = r[f] as string | undefined;
      if (slug && !fn(slug)) issues.push(`${r.id}: unresolved ${String(f)} "${slug}"`);
    }
    for (const slug of r.instrumentSlugs ?? []) if (!rInstrument(slug)) issues.push(`${r.id}: unresolved instrument "${slug}"`);
  }
  // Every NEW entity must carry at least one relation (no isolated nodes).
  const connected = new Set<string>();
  for (const x of relations) {
    connected.add(x.from);
    connected.add(x.to);
  }
  for (const e of entities) if (!connected.has(e.id)) issues.push(`isolated new entity: ${e.id}`);
  return issues;
}

// Re-export record types + helpers for the engine.
export type { SatelliteRecord, SatelliteKind, SatelliteCategory } from "@/knowledge-graph/data/satellites-catalog/types";
export { KIND_ENTITY_TYPE, KIND_LABEL, KIND_PLURAL } from "@/knowledge-graph/data/satellites-catalog/types";
export { orbits, operators, constellations, networks, satellites };
