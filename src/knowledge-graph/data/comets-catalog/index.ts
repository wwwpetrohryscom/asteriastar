import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/comets-catalog/legacy-relations";
import { KIND_ENTITY_TYPE, type CometKind, type CometRecord } from "@/knowledge-graph/data/comets-catalog/types";
import { comets } from "@/knowledge-graph/data/comets-catalog/data/comets";
import { classes } from "@/knowledge-graph/data/comets-catalog/data/classes";
import { families } from "@/knowledge-graph/data/comets-catalog/data/families";
import { reservoirs } from "@/knowledge-graph/data/comets-catalog/data/reservoirs";
import { transition } from "@/knowledge-graph/data/comets-catalog/data/transition";
import { missions } from "@/knowledge-graph/data/comets-catalog/data/missions";

/**
 * Comets & Small-Body Reservoirs catalog (Program Z). The curated dataset ENRICHES
 * the ten comets already in the graph — linking them into dynamical classes, genetic
 * families, source reservoirs, meteor showers, and missions — and CREATES the new
 * ones: additional comets, the class / family / reservoir entities, and the
 * transition objects (active asteroids, dormant comets). Relation targets reuse
 * existing entities wherever possible: the meteor showers, the missions, Program Y's
 * dynamical reservoirs (Kuiper Belt / scattered disc / Centaurs) and Sedna. Cross-
 * references resolve against the map for the target kind; relations that duplicate an
 * existing graph edge or whose endpoints don't resolve are dropped. Nothing is
 * fabricated — unknown values are omitted.
 */
export const COMET_RECORDS: CometRecord[] = [
  ...comets, ...classes, ...families, ...reservoirs, ...transition, ...missions,
];

export const COMET_BY_ID = new Map(COMET_RECORDS.map((r) => [r.id, r]));

const byKind = (k: CometKind | CometKind[]) => {
  const kinds = Array.isArray(k) ? k : [k];
  return new Map(COMET_RECORDS.filter((r) => kinds.includes(r.kind)).map((r) => [r.slug, r]));
};
export const COMET_BY_SLUG = byKind(["comet", "active-asteroid", "dormant-comet"]); // "bodies"
export const CLASS_BY_SLUG = byKind("class");
export const FAMILY_BY_SLUG = byKind("family");
export const RESERVOIR_BY_SLUG = byKind("reservoir");
export const MISSION_BY_SLUG = byKind("mission");

// Type-aware resolvers.
const rClass = (s?: string) => (s ? CLASS_BY_SLUG.get(s)?.id : undefined);
const rFamily = (s?: string) => (s ? FAMILY_BY_SLUG.get(s)?.id : undefined);
const rReservoir = (s?: string) => (s ? RESERVOIR_BY_SLUG.get(s)?.id : undefined);
// Missions are reused entities addressed by type prefix; existence is verified at the
// graph level (the entry gate + validateGraph drop dangling edges).
const rMission = (s?: string) => (s ? `space_mission:${s}` : undefined);

/* ----------------------------------------------------------- entities */

export function entryPathFor(r: Pick<CometRecord, "kind" | "slug">): string | undefined {
  switch (r.kind) {
    case "comet":
      return `/comets/${r.slug}`;
    case "class":
      return `/comets/class/${r.slug}`;
    case "family":
      return `/comets/family/${r.slug}`;
    case "reservoir":
      return `/comets/reservoir/${r.slug}`;
    case "active-asteroid":
      return `/comets/active/${r.slug}`;
    case "dormant-comet":
      return `/comets/dormant/${r.slug}`;
    case "mission": // reused type — resolves to the standalone /explore graph page
      return undefined;
  }
}

const newRecords = COMET_RECORDS.filter((r) => !r.existing);

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

for (const r of COMET_RECORDS) {
  switch (r.kind) {
    case "comet":
    case "active-asteroid":
    case "dormant-comet":
      add(r.id, "member_of_family", rFamily(r.familySlug));
      for (const c of r.classSlugs ?? []) add(r.id, "member_of_group", rClass(c));
      for (const s of r.reservoirSlugs ?? []) add(r.id, "belongs_to_reservoir", rReservoir(s));
      for (const k of r.reusedReservoirKeys ?? []) add(r.id, "belongs_to_reservoir", k);
      for (const m of r.meteorShowerIds ?? []) add(r.id, "source_of_meteor_shower", m);
      for (const m of r.visitedBySlugs ?? []) add(r.id, "visited_by", rMission(m));
      for (const m of r.sampleReturnBySlugs ?? []) add(rMission(m) ?? "", "returned_samples_from", r.id);
      for (const m of r.targetOfSlugs ?? []) add(rMission(m) ?? "", "target_of_mission", r.id);
      for (const o of r.observedBySlugs ?? []) add(r.id, "observed_by", `observatory:${o}`);
      for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
      break;
    case "reservoir":
      for (const s of r.reservoirSlugs ?? []) add(r.id, "part_of", rReservoir(s)); // inner cloud → outer cloud
      for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
      break;
    case "class":
    case "family":
    case "mission":
      break; // incoming edges only
  }
}

export const relations: GraphRelation[] = derived;

/* ----------------------------------------------------------- indexes & stats */

function group(key: (r: CometRecord) => string | undefined) {
  const m = new Map<string, CometRecord[]>();
  for (const r of COMET_RECORDS) {
    const k = key(r);
    if (!k) continue;
    (m.get(k) ?? m.set(k, []).get(k)!).push(r);
  }
  return m;
}

export const COMETS_BY_KIND = group((r) => r.kind);
export const COMETS_BY_CATEGORY = group((r) => (r.kind === "comet" ? r.category : undefined));

export const COMETS_STATS = {
  records: COMET_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  byKind: Object.fromEntries([...COMETS_BY_KIND.entries()].map(([k, v]) => [k, v.length])),
  comets: COMETS_BY_KIND.get("comet")?.length ?? 0,
  classes: COMETS_BY_KIND.get("class")?.length ?? 0,
  families: COMETS_BY_KIND.get("family")?.length ?? 0,
  reservoirs: COMETS_BY_KIND.get("reservoir")?.length ?? 0,
  activeAsteroids: COMETS_BY_KIND.get("active-asteroid")?.length ?? 0,
  dormantComets: COMETS_BY_KIND.get("dormant-comet")?.length ?? 0,
} as const;

export function validateComets(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const kinds = new Set(Object.keys(KIND_ENTITY_TYPE) as CometKind[]);
  const seenSlugByKind = new Map<CometKind, Set<string>>();
  for (const r of COMET_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate comet id: ${r.id}`);
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
      // Comets are exactly the bodies that reach and exceed e ≈ 1 (near-parabolic and
      // hyperbolic orbits), so only a negative or absurdly large value is invalid here.
      else if (k === "eccentricity") { if (v < 0 || v > 5) issues.push(`${r.id}: eccentricity out of range: ${v}`); }
      else if (k === "inclinationDeg") { if (v < 0 || v > 180) issues.push(`${r.id}: inclination out of range: ${v}`); }
      else if (k === "orbitalPeriodYears") { if (v <= 0 || v > 100000) issues.push(`${r.id}: implausible period: ${v}`); }
      else if (v < 0) issues.push(`${r.id}: invalid numeric ${k}=${v}`);
    }
  }
  // Relation integrity: catalog-internal cross-references must resolve to a real id of
  // the expected kind. (Mission/shower/reused-reservoir/related are full graph ids
  // validated at the graph level.)
  for (const r of COMET_RECORDS) {
    if (r.familySlug && !rFamily(r.familySlug)) issues.push(`${r.id}: unresolved familySlug "${r.familySlug}"`);
    for (const c of r.classSlugs ?? []) if (!rClass(c)) issues.push(`${r.id}: unresolved class "${c}"`);
    for (const s of r.reservoirSlugs ?? []) if (!rReservoir(s)) issues.push(`${r.id}: unresolved reservoir "${s}"`);
    for (const k of r.reusedReservoirKeys ?? []) if (!/^minor_planet_group:[a-z0-9-]+$/.test(k)) issues.push(`${r.id}: reused reservoir must be a minor_planet_group id: "${k}"`);
    for (const m of r.meteorShowerIds ?? []) if (!/^meteor_shower:[a-z0-9-]+$/.test(m)) issues.push(`${r.id}: meteor shower must be a meteor_shower id: "${m}"`);
  }
  // Bodies (comet / active-asteroid / dormant-comet) share ONE slug namespace via
  // COMET_BY_SLUG, so their slugs must be unique ACROSS those kinds, not just within
  // each — otherwise a colliding record would be silently shadowed and its page misroute.
  const bodySlugs = new Set<string>();
  for (const r of COMET_RECORDS) {
    if (r.kind !== "comet" && r.kind !== "active-asteroid" && r.kind !== "dormant-comet") continue;
    if (bodySlugs.has(r.slug)) issues.push(`duplicate body slug across kinds: ${r.slug}`);
    bodySlugs.add(r.slug);
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
export type { CometRecord, CometKind, CometCategory } from "@/knowledge-graph/data/comets-catalog/types";
export { KIND_ENTITY_TYPE, KIND_LABEL } from "@/knowledge-graph/data/comets-catalog/types";
export { comets, classes, families, reservoirs, transition, missions };
