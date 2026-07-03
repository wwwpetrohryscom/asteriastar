import {
  METEORITE_RECORDS,
  METEORITE_BY_ID,
  METEORITE_BY_SLUG,
  CLASS_BY_SLUG,
  GROUP_BY_SLUG,
  FIREBALL_BY_SLUG,
  STRUCTURE_BY_SLUG,
  SITE_BY_SLUG,
  METEORITES_BY_CATEGORY,
  entryPathFor,
  meteorites,
  classes,
  groups,
  fireballs,
  structures,
  sites,
  type MeteoriteCategory,
  type MeteoriteRecord,
} from "@/knowledge-graph/data/meteorites-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Meteorite Engine — resolver and query surface for the Meteors, Meteorites & Fireballs
 * Encyclopedia (engine.meteorites). Pure, deterministic, framework-free. It resolves the
 * new meteorite / class / group / fireball / impact-structure / recovery-site entities
 * and REUSES the platform's parent bodies (Vesta, Mars, the Moon), impact events, and
 * meteor showers via the graph — creating and fabricating nothing. It performs NO live
 * fireball detection: pages link to the Live Sky tools rather than inventing current
 * events.
 */

type Ref = { id: string; name: string; slug?: string; href?: string };

function catalogRef(r: MeteoriteRecord | undefined): Ref | undefined {
  if (!r) return undefined;
  return { id: r.id, name: r.name, slug: r.slug, href: entryPathFor(r) };
}
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  if (!e) return undefined;
  return { id, name: e.name, href: entityGraphPath(e) };
}

const byName = (a: MeteoriteRecord, b: MeteoriteRecord) => a.name.localeCompare(b.name, "en", { numeric: true });
const byDate = (a: MeteoriteRecord, b: MeteoriteRecord) => (b.fallDate ?? "0").localeCompare(a.fallDate ?? "0");

/* ----------------------------------------------------------- resolvers */

export interface ResolvedMeteorite {
  record: MeteoriteRecord;
  group?: Ref;
  class?: Ref;
  parentBodies: Ref[];
  recoverySite?: Ref;
  fireballs: Ref[];
  related: Ref[];
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveRecord(r: MeteoriteRecord): ResolvedMeteorite {
  const entity = getEntityById(r.id);
  return {
    record: r,
    group: catalogRef(r.groupSlug ? GROUP_BY_SLUG.get(r.groupSlug) : undefined),
    class: catalogRef(r.classSlug ? CLASS_BY_SLUG.get(r.classSlug) : undefined),
    parentBodies: (r.parentBodyKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    recoverySite: catalogRef(r.recoverySiteSlug ? SITE_BY_SLUG.get(r.recoverySiteSlug) : undefined),
    fireballs: (r.fireballKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    related: (r.relatedKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export interface ResolvedMeteoriteGroup {
  record: MeteoriteRecord;
  members: MeteoriteRecord[];
  subgroups: MeteoriteRecord[]; // for a class: its groups
  parentBodies: Ref[];
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function membersOfGroup(slug: string): MeteoriteRecord[] {
  return meteorites.filter((m) => m.groupSlug === slug).sort(byName);
}
function membersOfClass(slug: string): MeteoriteRecord[] {
  const groupSlugs = new Set(groups.filter((g) => g.partOfClassSlug === slug).map((g) => g.slug));
  return meteorites.filter((m) => m.classSlug === slug || (m.groupSlug && groupSlugs.has(m.groupSlug))).sort(byName);
}

function resolveGroupRecord(r: MeteoriteRecord, members: MeteoriteRecord[], subgroups: MeteoriteRecord[]): ResolvedMeteoriteGroup {
  const entity = getEntityById(r.id);
  return {
    record: r,
    members,
    subgroups,
    parentBodies: (r.parentBodyKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export interface ResolvedFireball {
  record: MeteoriteRecord;
  related: Ref[];
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}
function resolveEvent(r: MeteoriteRecord): ResolvedFireball {
  const entity = getEntityById(r.id);
  return {
    record: r,
    related: [...(r.relatedKeys ?? [])].map((k) => refFromId(k)).filter(Boolean) as Ref[],
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

/* ----------------------------------------------------------- engine surface */

// The largest meteorites, curated by well-established recovered mass (a reference list).
const LARGEST = ["hoba", "campo-del-cielo", "willamette", "sikhote-alin", "brenham"];

export const meteoriteEngine = {
  count: meteorites.length,
  recordCount: METEORITE_RECORDS.length,

  all: (): MeteoriteRecord[] => meteorites.slice().sort(byName),
  get: (slug: string): MeteoriteRecord | undefined => METEORITE_BY_SLUG.get(slug) ?? METEORITE_BY_ID.get(slug),

  meteorites: (): MeteoriteRecord[] => meteorites.slice().sort(byName),
  classes: (): MeteoriteRecord[] => classes.slice(),
  groups: (): MeteoriteRecord[] => groups.slice(),
  fireballs: (): MeteoriteRecord[] => fireballs.slice().sort(byName),
  structures: (): MeteoriteRecord[] => structures.slice().sort(byName),
  sites: (): MeteoriteRecord[] => sites.slice().sort(byName),

  /* discovery queries — honest filters */
  byCategory: (c: MeteoriteCategory): MeteoriteRecord[] => (METEORITES_BY_CATEGORY.get(c) ?? []).slice().sort(byName),
  byGroup: membersOfGroup,
  byClass: membersOfClass,
  largestMeteorites: (): MeteoriteRecord[] => LARGEST.map((s) => METEORITE_BY_SLUG.get(s)).filter((r): r is MeteoriteRecord => Boolean(r)),
  martianMeteorites: (): MeteoriteRecord[] => membersOfGroup("martian"),
  lunarMeteorites: (): MeteoriteRecord[] => membersOfGroup("lunar"),
  hedMeteorites: (): MeteoriteRecord[] => membersOfGroup("hed"),
  carbonaceous: (): MeteoriteRecord[] => membersOfGroup("carbonaceous-chondrite"),
  ironMeteorites: (): MeteoriteRecord[] => meteorites.filter((m) => m.classSlug === "iron").sort(byName),
  stonyMeteorites: (): MeteoriteRecord[] => meteorites.filter((m) => m.category === "chondrite" || m.category === "achondrite").sort(byName),
  falls: (): MeteoriteRecord[] => meteorites.filter((m) => m.fallType === "fall").sort(byDate),
  finds: (): MeteoriteRecord[] => meteorites.filter((m) => m.fallType === "find").sort(byName),
  recentFalls: (): MeteoriteRecord[] => meteorites.filter((m) => m.fallType === "fall" && (m.fallDate ?? "") >= "2000").sort(byDate),
  historicFireballs: (): MeteoriteRecord[] => fireballs.slice().sort(byName),
  bolides: (): MeteoriteRecord[] => fireballs.filter((f) => f.bolide).sort(byName),
  bySlugs: (slugs: string[]): MeteoriteRecord[] => slugs.map((s) => METEORITE_BY_SLUG.get(s)).filter((r): r is MeteoriteRecord => Boolean(r)),

  /* the named resolve* surface from the mission spec */
  resolveMeteorite: (slug: string): ResolvedMeteorite | null => {
    const r = METEORITE_BY_SLUG.get(slug);
    return r ? resolveRecord(r) : null;
  },
  resolveFall: (slug: string): ResolvedMeteorite | null => {
    const r = METEORITE_BY_SLUG.get(slug);
    return r ? resolveRecord(r) : null;
  },
  resolveMeteoriteClass: (slug: string): ResolvedMeteoriteGroup | null => {
    const r = CLASS_BY_SLUG.get(slug);
    if (!r) return null;
    return resolveGroupRecord(r, membersOfClass(slug), groups.filter((g) => g.partOfClassSlug === slug));
  },
  resolveGroup: (slug: string): ResolvedMeteoriteGroup | null => {
    const r = GROUP_BY_SLUG.get(slug);
    return r ? resolveGroupRecord(r, membersOfGroup(slug), []) : null;
  },
  resolveFireball: (slug: string): ResolvedFireball | null => {
    const r = FIREBALL_BY_SLUG.get(slug);
    return r ? resolveEvent(r) : null;
  },
  resolveImpact: (slug: string): ResolvedFireball | null => {
    const r = STRUCTURE_BY_SLUG.get(slug);
    return r ? resolveEvent(r) : null;
  },
  resolveSite: (slug: string): ResolvedMeteoriteGroup | null => {
    const r = SITE_BY_SLUG.get(slug);
    if (!r) return null;
    return resolveGroupRecord(r, meteorites.filter((m) => m.recoverySiteSlug === slug).sort(byName), []);
  },
};
