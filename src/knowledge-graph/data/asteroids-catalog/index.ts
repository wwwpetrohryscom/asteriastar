import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/asteroids-catalog/legacy-relations";
import { KIND_ENTITY_TYPE, type MinorBodyKind, type MinorBodyRecord } from "@/knowledge-graph/data/asteroids-catalog/types";
import { asteroids } from "@/knowledge-graph/data/asteroids-catalog/data/asteroids";
import { families } from "@/knowledge-graph/data/asteroids-catalog/data/families";
import { groups } from "@/knowledge-graph/data/asteroids-catalog/data/groups";
import { neoClasses } from "@/knowledge-graph/data/asteroids-catalog/data/neo-classes";
import { trojans } from "@/knowledge-graph/data/asteroids-catalog/data/trojans";
import { resonances } from "@/knowledge-graph/data/asteroids-catalog/data/resonances";
import { impacts } from "@/knowledge-graph/data/asteroids-catalog/data/impacts";
import { missions } from "@/knowledge-graph/data/asteroids-catalog/data/missions";

/**
 * Asteroids & Minor Planets catalog (Program Y). The curated dataset ENRICHES the
 * minor bodies already in the graph — the five dwarf planets and ten asteroids —
 * by linking them into families, dynamical groups, NEO classes, Trojan camps,
 * resonances, and missions, and CREATES the new ones: additional asteroids, and the
 * family / group / near-Earth-class / Trojan / resonance / impact-event entities.
 * Relation targets reuse existing entities (missions, planets, the Sun) wherever
 * possible; cross-references resolve AGAINST THE MAP FOR THE TARGET KIND. Relations
 * that duplicate an existing graph edge (e.g. a mission target already emitted by
 * the exploration catalog) or whose endpoints don't resolve are dropped. Nothing is
 * fabricated — every figure is source-backed and unknown values are omitted.
 */
export const MINOR_BODY_RECORDS: MinorBodyRecord[] = [
  ...asteroids, ...families, ...groups, ...neoClasses, ...trojans, ...resonances, ...impacts, ...missions,
];

export const BODY_BY_ID = new Map(MINOR_BODY_RECORDS.map((r) => [r.id, r]));

// Per-kind slug → record maps (slugs are unique within a kind).
const byKind = (k: MinorBodyKind | MinorBodyKind[]) => {
  const kinds = Array.isArray(k) ? k : [k];
  return new Map(MINOR_BODY_RECORDS.filter((r) => kinds.includes(r.kind)).map((r) => [r.slug, r]));
};
export const ASTEROID_BY_SLUG = byKind(["asteroid", "dwarf-planet"]); // individual bodies
export const FAMILY_BY_SLUG = byKind("family");
export const GROUP_BY_SLUG = byKind("group");
export const NEO_BY_SLUG = byKind("neo-class");
export const TROJAN_BY_SLUG = byKind("trojan-group");
export const RESONANCE_BY_SLUG = byKind("resonance");
export const IMPACT_BY_SLUG = byKind("impact");
export const MISSION_BY_SLUG = byKind("mission");

// Type-aware resolvers.
const rBody = (s?: string) => (s ? ASTEROID_BY_SLUG.get(s)?.id : undefined);
const rFamily = (s?: string) => (s ? FAMILY_BY_SLUG.get(s)?.id : undefined);
const rGroup = (s?: string) => (s ? GROUP_BY_SLUG.get(s)?.id : undefined);
const rNeo = (s?: string) => (s ? NEO_BY_SLUG.get(s)?.id : undefined);
const rTrojan = (s?: string) => (s ? TROJAN_BY_SLUG.get(s)?.id : undefined);
const rResonance = (s?: string) => (s ? RESONANCE_BY_SLUG.get(s)?.id : undefined);
// Missions and planets are reused entities addressed by type prefix; existence is
// verified at the graph level (the entry gate + validateGraph drop dangling edges).
const rMission = (s?: string) => (s ? `space_mission:${s}` : undefined);
const rPlanet = (s?: string) => (s ? `planet:${s}` : undefined);

/* ----------------------------------------------------------- entities */

/** The published route for each kind. Reused bodies (existing) and missions get no page. */
export function entryPathFor(r: Pick<MinorBodyRecord, "kind" | "slug">): string | undefined {
  switch (r.kind) {
    case "asteroid":
      return `/asteroids/${r.slug}`;
    case "family":
      return `/asteroids/family/${r.slug}`;
    case "group":
      return `/asteroids/group/${r.slug}`;
    case "neo-class":
      return `/asteroids/near-earth/${r.slug}`;
    case "trojan-group":
      return `/asteroids/trojans/${r.slug}`;
    case "resonance":
      return `/asteroids/resonance/${r.slug}`;
    case "impact":
      return `/asteroids/impact/${r.slug}`;
    case "dwarf-planet": // reused — canonical page stays in the Solar System encyclopedia
    case "mission": // reused type — resolves to the standalone /explore graph page
      return undefined;
  }
}

const newRecords = MINOR_BODY_RECORDS.filter((r) => !r.existing);

export const entities: GraphEntity[] = newRecords.map((r) => {
  const entryPath = entryPathFor(r);
  return {
    id: r.id,
    type: r.id.slice(0, r.id.indexOf(":")) as EntityType,
    name: r.name,
    domain: "science" as const,
    ...(entryPath ? { entryPath } : {}),
    description: r.description,
    aliases: r.altNames,
    ...(r.designation ? { catalogNumbers: [r.designation] } : {}),
    sources: r.sources,
  };
});

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

for (const r of MINOR_BODY_RECORDS) {
  switch (r.kind) {
    case "asteroid":
    case "dwarf-planet":
      add(r.id, "member_of_family", rFamily(r.familySlug));
      for (const g of r.groupSlugs ?? []) add(r.id, "member_of_group", rGroup(g));
      add(r.id, "member_of_group", rNeo(r.neoClassSlug));
      for (const t of r.trojanGroupSlugs ?? []) add(r.id, "member_of_group", rTrojan(t));
      add(r.id, "shares_orbital_resonance", rResonance(r.resonanceSlug));
      if (r.parentBodySlug) add(r.id, "orbits", rBody(r.parentBodySlug)); // a moonlet orbits its primary
      for (const m of r.visitedBySlugs ?? []) add(r.id, "visited_by", rMission(m));
      for (const m of r.sampleReturnBySlugs ?? []) add(rMission(m) ?? "", "returned_samples_from", r.id);
      for (const m of r.targetOfSlugs ?? []) add(rMission(m) ?? "", "target_of_mission", r.id);
      for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
      break;
    case "group":
    case "trojan-group":
      add(r.id, "shares_orbital_resonance", rResonance(r.resonanceSlug));
      break;
    case "resonance":
      add(r.id, "associated_with", rPlanet(r.resonanceWithSlug));
      break;
    case "impact":
      add(r.id, "associated_with", "planet:earth");
      break;
    case "family":
    case "neo-class":
    case "mission":
      break; // incoming edges only
  }
}

export const relations: GraphRelation[] = derived;

/* ----------------------------------------------------------- indexes & stats */

function group(key: (r: MinorBodyRecord) => string | undefined) {
  const m = new Map<string, MinorBodyRecord[]>();
  for (const r of MINOR_BODY_RECORDS) {
    const k = key(r);
    if (!k) continue;
    (m.get(k) ?? m.set(k, []).get(k)!).push(r);
  }
  return m;
}

export const BODIES_BY_KIND = group((r) => r.kind);
export const BODIES_BY_CATEGORY = group((r) => ((r.kind === "asteroid" || r.kind === "dwarf-planet") ? r.category : undefined));
export const BODIES_BY_TAXONOMY = group((r) => r.taxonomyClass);

export const ASTEROIDS_STATS = {
  records: MINOR_BODY_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  byKind: Object.fromEntries([...BODIES_BY_KIND.entries()].map(([k, v]) => [k, v.length])),
  asteroids: (BODIES_BY_KIND.get("asteroid")?.length ?? 0) + (BODIES_BY_KIND.get("dwarf-planet")?.length ?? 0),
  families: BODIES_BY_KIND.get("family")?.length ?? 0,
  groups: BODIES_BY_KIND.get("group")?.length ?? 0,
  neoClasses: BODIES_BY_KIND.get("neo-class")?.length ?? 0,
  trojanGroups: BODIES_BY_KIND.get("trojan-group")?.length ?? 0,
  resonances: BODIES_BY_KIND.get("resonance")?.length ?? 0,
  impacts: BODIES_BY_KIND.get("impact")?.length ?? 0,
} as const;

export function validateAsteroids(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const kinds = new Set(Object.keys(KIND_ENTITY_TYPE) as MinorBodyKind[]);
  const seenSlugByKind = new Map<MinorBodyKind, Set<string>>();
  for (const r of MINOR_BODY_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate body id: ${r.id}`);
    seenId.add(r.id);
    const ks = seenSlugByKind.get(r.kind) ?? seenSlugByKind.set(r.kind, new Set()).get(r.kind)!;
    if (ks.has(r.slug)) issues.push(`duplicate ${r.kind} slug: ${r.slug}`);
    ks.add(r.slug);
    if (!ID.test(r.id)) issues.push(`bad id: ${r.id}`);
    if (!kinds.has(r.kind)) issues.push(`${r.id}: unknown kind ${r.kind}`);
    if (r.id !== `${KIND_ENTITY_TYPE[r.kind]}:${r.slug}`) issues.push(`${r.id}: id does not match kind ${r.kind} / slug ${r.slug}`);
    if (!r.sources?.length) issues.push(`${r.id}: missing sources`);
    if (!r.description) issues.push(`${r.id}: missing description`);
    // No fabricated numbers: present numeric specs must be finite and physical.
    for (const [k, v] of Object.entries(r)) {
      if (typeof v !== "number") continue;
      if (!Number.isFinite(v)) issues.push(`${r.id}: non-finite numeric ${k}=${v}`);
      else if (k === "eccentricity" || k === "albedo") { if (v < 0 || v > 1) issues.push(`${r.id}: ${k} out of range: ${v}`); }
      else if (k === "inclinationDeg") { if (v < 0 || v > 180) issues.push(`${r.id}: inclination out of range: ${v}`); }
      else if (k === "meanDiameterKm") { if (v <= 0 || v > 3000) issues.push(`${r.id}: implausible diameter: ${v}`); }
      else if (v < 0) issues.push(`${r.id}: invalid numeric ${k}=${v}`);
    }
    /* ---- Pass 5: orbital ordering, NEO/PHA consistency, discovery chronology ---- */
    // A bound orbit must obey perihelion ≤ semi-major axis ≤ aphelion (1% slack for rounding).
    const { perihelionAu: q, semiMajorAxisAu: a, aphelionAu: qa } = r;
    if (q != null && a != null && q > a * 1.01) issues.push(`${r.id}: perihelion ${q} AU exceeds semi-major axis ${a} AU`);
    if (a != null && qa != null && a > qa * 1.01) issues.push(`${r.id}: semi-major axis ${a} AU exceeds aphelion ${qa} AU`);
    // A Potentially Hazardous Asteroid is by definition a near-Earth asteroid, so it
    // must carry a near-Earth orbit class; and any near-Earth class implies a
    // perihelion inside 1.3 AU (the NEO definition) when a perihelion is known.
    if (r.pha === true && !r.neoClassSlug) issues.push(`${r.id}: flagged PHA but has no near-Earth orbit class`);
    if (r.neoClassSlug && q != null && q >= 1.3 * 1.01) issues.push(`${r.id}: near-Earth class ${r.neoClassSlug} but perihelion ${q} AU ≥ 1.3 AU`);
    // Discovery is a historical event: no asteroid predates Ceres (1801) by much, none is future.
    const dy = r.discoveryYear ? Number(String(r.discoveryYear).match(/(\d{4})/)?.[1]) : undefined;
    if (dy != null && Number.isFinite(dy) && (dy < 1750 || dy > new Date().getFullYear()))
      issues.push(`${r.id}: discovery year ${r.discoveryYear} is implausible`);
  }
  // Relation integrity: catalog-internal cross-references must resolve to a real id
  // of the expected kind. (Mission/planet targets are full ids validated at the graph
  // level; relatedKeys likewise.)
  const checks: [keyof MinorBodyRecord, (s?: string) => string | undefined][] = [
    ["familySlug", rFamily],
    ["neoClassSlug", rNeo],
    ["resonanceSlug", rResonance],
    ["parentBodySlug", rBody],
    ["systemPrimarySlug", rBody],
  ];
  for (const r of MINOR_BODY_RECORDS) {
    for (const [f, fn] of checks) {
      const slug = r[f] as string | undefined;
      if (slug && !fn(slug)) issues.push(`${r.id}: unresolved ${String(f)} "${slug}"`);
    }
    for (const g of r.groupSlugs ?? []) if (!rGroup(g)) issues.push(`${r.id}: unresolved group "${g}"`);
    for (const t of r.trojanGroupSlugs ?? []) if (!rTrojan(t)) issues.push(`${r.id}: unresolved trojan group "${t}"`);
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
export type { MinorBodyRecord, MinorBodyKind, BodyCategory } from "@/knowledge-graph/data/asteroids-catalog/types";
export { KIND_ENTITY_TYPE, KIND_LABEL } from "@/knowledge-graph/data/asteroids-catalog/types";
export { asteroids, families, groups, neoClasses, trojans, resonances, impacts, missions };
