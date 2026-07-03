import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/meteorites-catalog/legacy-relations";
import { KIND_ENTITY_TYPE, type MeteoriteKind, type MeteoriteRecord } from "@/knowledge-graph/data/meteorites-catalog/types";
import { meteorites } from "@/knowledge-graph/data/meteorites-catalog/data/meteorites";
import { classes } from "@/knowledge-graph/data/meteorites-catalog/data/classes";
import { groups } from "@/knowledge-graph/data/meteorites-catalog/data/groups";
import { fireballs } from "@/knowledge-graph/data/meteorites-catalog/data/fireballs";
import { structures } from "@/knowledge-graph/data/meteorites-catalog/data/structures";
import { sites } from "@/knowledge-graph/data/meteorites-catalog/data/sites";

/**
 * Meteors, Meteorites & Fireballs catalog (Program AA). The capstone of the small-bodies
 * trilogy (Y asteroids → Z comets → AA). It CREATES the meteorite / class / group /
 * fireball / impact-structure / recovery-site entities and derives typed relations that
 * REUSE existing entities: the asteroid Vesta (Program Y) for the HED meteorites, Mars
 * and the Moon for the Martian and Lunar groups, the impact events, and Earth. Cross-
 * references resolve against the map for the target kind; relations that duplicate an
 * existing graph edge or whose endpoints don't resolve are dropped. Nothing is
 * fabricated — classifications, fall dates, and recovery data are omitted when unknown.
 */
export const METEORITE_RECORDS: MeteoriteRecord[] = [
  ...meteorites, ...classes, ...groups, ...fireballs, ...structures, ...sites,
];

export const METEORITE_BY_ID = new Map(METEORITE_RECORDS.map((r) => [r.id, r]));

const byKind = (k: MeteoriteKind) => new Map(METEORITE_RECORDS.filter((r) => r.kind === k).map((r) => [r.slug, r]));
export const METEORITE_BY_SLUG = byKind("meteorite");
export const CLASS_BY_SLUG = byKind("class");
export const GROUP_BY_SLUG = byKind("group");
export const FIREBALL_BY_SLUG = byKind("fireball");
export const STRUCTURE_BY_SLUG = byKind("impact-structure");
export const SITE_BY_SLUG = byKind("recovery-site");

const rClass = (s?: string) => (s ? CLASS_BY_SLUG.get(s)?.id : undefined);
const rGroup = (s?: string) => (s ? GROUP_BY_SLUG.get(s)?.id : undefined);
const rSite = (s?: string) => (s ? SITE_BY_SLUG.get(s)?.id : undefined);

/* ----------------------------------------------------------- entities */

export function entryPathFor(r: Pick<MeteoriteRecord, "kind" | "slug">): string {
  switch (r.kind) {
    case "meteorite":
      return `/meteorites/${r.slug}`;
    case "class":
      return `/meteorites/class/${r.slug}`;
    case "group":
      return `/meteorites/group/${r.slug}`;
    case "fireball":
      return `/meteorites/fireball/${r.slug}`;
    case "impact-structure":
      return `/meteorites/impact-structure/${r.slug}`;
    case "recovery-site":
      return `/meteorites/site/${r.slug}`;
  }
}

export const entities: GraphEntity[] = METEORITE_RECORDS.map((r) => ({
  id: r.id,
  type: r.id.slice(0, r.id.indexOf(":")) as EntityType,
  name: r.name,
  domain: "science" as const,
  entryPath: entryPathFor(r),
  description: r.description,
  aliases: r.altNames,
  ...(r.classificationLabel ? { catalogNumbers: [r.classificationLabel] } : {}),
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

for (const r of METEORITE_RECORDS) {
  switch (r.kind) {
    case "meteorite":
      add(r.id, "member_of_group", rGroup(r.groupSlug) ?? rClass(r.classSlug));
      for (const p of r.parentBodyKeys ?? []) add(r.id, "parent_body", p);
      add(r.id, "located_at", rSite(r.recoverySiteSlug));
      for (const f of r.fireballKeys ?? []) add(r.id, "associated_with", f);
      for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
      break;
    case "group":
      add(r.id, "part_of", rClass(r.partOfClassSlug));
      for (const p of r.parentBodyKeys ?? []) add(r.id, "parent_body", p);
      break;
    case "fireball":
    case "impact-structure":
      add(r.id, "associated_with", "planet:earth");
      for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
      break;
    case "class":
    case "recovery-site":
      break; // incoming edges only
  }
}

export const relations: GraphRelation[] = derived;

/* ----------------------------------------------------------- indexes & stats */

function group(key: (r: MeteoriteRecord) => string | undefined) {
  const m = new Map<string, MeteoriteRecord[]>();
  for (const r of METEORITE_RECORDS) {
    const k = key(r);
    if (!k) continue;
    (m.get(k) ?? m.set(k, []).get(k)!).push(r);
  }
  return m;
}

export const METEORITES_BY_KIND = group((r) => r.kind);
export const METEORITES_BY_CATEGORY = group((r) => (r.kind === "meteorite" ? r.category : undefined));

export const METEORITES_STATS = {
  records: METEORITE_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  byKind: Object.fromEntries([...METEORITES_BY_KIND.entries()].map(([k, v]) => [k, v.length])),
  meteorites: METEORITES_BY_KIND.get("meteorite")?.length ?? 0,
  classes: METEORITES_BY_KIND.get("class")?.length ?? 0,
  groups: METEORITES_BY_KIND.get("group")?.length ?? 0,
  fireballs: METEORITES_BY_KIND.get("fireball")?.length ?? 0,
  structures: METEORITES_BY_KIND.get("impact-structure")?.length ?? 0,
  sites: METEORITES_BY_KIND.get("recovery-site")?.length ?? 0,
} as const;

export function validateMeteorites(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const kinds = new Set(Object.keys(KIND_ENTITY_TYPE) as MeteoriteKind[]);
  const seenSlugByKind = new Map<MeteoriteKind, Set<string>>();
  for (const r of METEORITE_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate meteorite id: ${r.id}`);
    seenId.add(r.id);
    const ks = seenSlugByKind.get(r.kind) ?? seenSlugByKind.set(r.kind, new Set()).get(r.kind)!;
    if (ks.has(r.slug)) issues.push(`duplicate ${r.kind} slug: ${r.slug}`);
    ks.add(r.slug);
    if (!ID.test(r.id)) issues.push(`bad id: ${r.id}`);
    if (!kinds.has(r.kind)) issues.push(`${r.id}: unknown kind ${r.kind}`);
    if (r.id !== `${KIND_ENTITY_TYPE[r.kind]}:${r.slug}`) issues.push(`${r.id}: id does not match kind ${r.kind} / slug ${r.slug}`);
    if (!r.sources?.length) issues.push(`${r.id}: missing sources`);
    if (!r.description) issues.push(`${r.id}: missing description`);
    for (const [k, v] of Object.entries(r)) {
      if (typeof v === "number" && !Number.isFinite(v)) issues.push(`${r.id}: non-finite numeric ${k}=${v}`);
    }
  }
  // Relation integrity: catalog-internal cross-references must resolve to a real id of
  // the expected kind. (Parent bodies / fireball / related keys are full graph ids
  // validated at the graph level.)
  for (const r of METEORITE_RECORDS) {
    if (r.groupSlug && !rGroup(r.groupSlug)) issues.push(`${r.id}: unresolved groupSlug "${r.groupSlug}"`);
    if (r.classSlug && !rClass(r.classSlug)) issues.push(`${r.id}: unresolved classSlug "${r.classSlug}"`);
    if (r.partOfClassSlug && !rClass(r.partOfClassSlug)) issues.push(`${r.id}: unresolved partOfClassSlug "${r.partOfClassSlug}"`);
    if (r.recoverySiteSlug && !rSite(r.recoverySiteSlug)) issues.push(`${r.id}: unresolved recoverySiteSlug "${r.recoverySiteSlug}"`);
    // A meteorite must attach to exactly one taxonomy node (a group or a class).
    if (r.kind === "meteorite" && !r.groupSlug && !r.classSlug) issues.push(`${r.id}: meteorite has no group or class`);
    for (const p of r.parentBodyKeys ?? []) if (!ID.test(p)) issues.push(`${r.id}: bad parent body id "${p}"`);
  }
  // Every entity must carry at least one relation (no isolated nodes).
  const connected = new Set<string>();
  for (const x of relations) {
    connected.add(x.from);
    connected.add(x.to);
  }
  for (const e of entities) if (!connected.has(e.id)) issues.push(`isolated new entity: ${e.id}`);
  return issues;
}

// Re-export record types + helpers for the engine.
export type { MeteoriteRecord, MeteoriteKind, MeteoriteCategory } from "@/knowledge-graph/data/meteorites-catalog/types";
export { KIND_ENTITY_TYPE, KIND_LABEL } from "@/knowledge-graph/data/meteorites-catalog/types";
export { meteorites, classes, groups, fireballs, structures, sites };
