import {
  MINOR_BODY_RECORDS,
  BODY_BY_ID,
  ASTEROID_BY_SLUG,
  FAMILY_BY_SLUG,
  GROUP_BY_SLUG,
  NEO_BY_SLUG,
  TROJAN_BY_SLUG,
  RESONANCE_BY_SLUG,
  IMPACT_BY_SLUG,
  BODIES_BY_CATEGORY,
  BODIES_BY_TAXONOMY,
  entryPathFor,
  families,
  groups,
  neoClasses,
  trojans,
  resonances,
  impacts,
  type BodyCategory,
  type MinorBodyRecord,
} from "@/knowledge-graph/data/asteroids-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Asteroid Engine — resolver and query surface for the Asteroids & Minor Planets
 * Encyclopedia (engine.asteroids). Pure, deterministic, framework-free. It resolves
 * the new asteroid / family / group / near-Earth-class / Trojan / resonance /
 * impact-event entities and REUSES the platform's dwarf planets, existing asteroids,
 * missions, and planets via the graph — creating and fabricating nothing. Reused
 * bodies keep their canonical Solar System pages; only new bodies get /asteroids/*
 * pages, so this engine never produces a duplicate URL.
 */

type Ref = { id: string; name: string; slug?: string; href?: string };

/** The browsable URL for a catalog body: its /asteroids page if new, else its existing home. */
function bodyHref(r: MinorBodyRecord): string | undefined {
  const p = entryPathFor(r);
  if (p && !r.existing) return p;
  const e = getEntityById(r.id);
  return e ? entityGraphPath(e) : undefined;
}

function catalogRef(r: MinorBodyRecord | undefined): Ref | undefined {
  if (!r) return undefined;
  return { id: r.id, name: r.name, slug: r.slug, href: bodyHref(r) };
}

/** Ref to any reused/graph entity by id (missions, planets, the Sun). */
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  if (!e) return undefined;
  return { id, name: e.name, href: entityGraphPath(e) };
}

const byName = (a: MinorBodyRecord, b: MinorBodyRecord) => a.name.localeCompare(b.name, "en", { numeric: true });
const byDiameterDesc = (a: MinorBodyRecord, b: MinorBodyRecord) => (b.meanDiameterKm ?? 0) - (a.meanDiameterKm ?? 0);
const byYear = (a: MinorBodyRecord, b: MinorBodyRecord) => (a.discoveryYear ?? "9999").localeCompare(b.discoveryYear ?? "9999");

const bodies = () => MINOR_BODY_RECORDS.filter((r) => r.kind === "asteroid" || r.kind === "dwarf-planet");

/* ----------------------------------------------------------- resolvers */

export interface ResolvedAsteroid {
  record: MinorBodyRecord;
  family?: Ref;
  groups: Ref[];
  neoClass?: Ref;
  trojanGroups: Ref[];
  resonance?: Ref;
  primary?: Ref; // for a moonlet, its primary body
  visitedBy: Ref[];
  sampleReturnedBy: Ref[];
  targetedBy: Ref[];
  related: Ref[];
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveBody(r: MinorBodyRecord): ResolvedAsteroid {
  const entity = getEntityById(r.id);
  return {
    record: r,
    family: catalogRef(r.familySlug ? FAMILY_BY_SLUG.get(r.familySlug) : undefined),
    groups: (r.groupSlugs ?? []).map((g) => catalogRef(GROUP_BY_SLUG.get(g))).filter(Boolean) as Ref[],
    neoClass: catalogRef(r.neoClassSlug ? NEO_BY_SLUG.get(r.neoClassSlug) : undefined),
    trojanGroups: (r.trojanGroupSlugs ?? []).map((t) => catalogRef(TROJAN_BY_SLUG.get(t))).filter(Boolean) as Ref[],
    resonance: catalogRef(r.resonanceSlug ? RESONANCE_BY_SLUG.get(r.resonanceSlug) : undefined),
    primary: catalogRef(r.parentBodySlug ? ASTEROID_BY_SLUG.get(r.parentBodySlug) : undefined),
    visitedBy: (r.visitedBySlugs ?? []).map((m) => refFromId(`space_mission:${m}`)).filter(Boolean) as Ref[],
    sampleReturnedBy: (r.sampleReturnBySlugs ?? []).map((m) => refFromId(`space_mission:${m}`)).filter(Boolean) as Ref[],
    targetedBy: (r.targetOfSlugs ?? []).map((m) => refFromId(`space_mission:${m}`)).filter(Boolean) as Ref[],
    related: (r.relatedKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export interface ResolvedPopulation {
  record: MinorBodyRecord;
  members: MinorBodyRecord[];
  resonance?: Ref;
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function membersByGroup(slug: string): MinorBodyRecord[] {
  return bodies().filter((b) => (b.groupSlugs ?? []).includes(slug)).sort(byDiameterDesc);
}
function membersByNeo(slug: string): MinorBodyRecord[] {
  return bodies().filter((b) => b.neoClassSlug === slug).sort(byName);
}
function membersByTrojan(slug: string): MinorBodyRecord[] {
  return bodies().filter((b) => (b.trojanGroupSlugs ?? []).includes(slug)).sort(byName);
}
function membersByFamily(slug: string): MinorBodyRecord[] {
  return bodies().filter((b) => b.familySlug === slug).sort(byDiameterDesc);
}

function resolvePopulationRecord(r: MinorBodyRecord, members: MinorBodyRecord[]): ResolvedPopulation {
  const entity = getEntityById(r.id);
  return {
    record: r,
    members,
    resonance: catalogRef(r.resonanceSlug ? RESONANCE_BY_SLUG.get(r.resonanceSlug) : undefined),
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export interface ResolvedImpact {
  record: MinorBodyRecord;
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

export interface ResolvedPlanetaryDefense {
  potentiallyHazardous: MinorBodyRecord[];
  impactEvents: MinorBodyRecord[];
  deflectionTargets: MinorBodyRecord[]; // bodies visited/targeted by defense missions (DART/Hera)
}

/* ----------------------------------------------------------- engine surface */

export const asteroidEngine = {
  count: bodies().length,
  recordCount: MINOR_BODY_RECORDS.length,

  all: (): MinorBodyRecord[] => bodies().slice().sort(byName),
  get: (slug: string): MinorBodyRecord | undefined => ASTEROID_BY_SLUG.get(slug) ?? BODY_BY_ID.get(slug),

  asteroids: (): MinorBodyRecord[] => bodies().slice().sort(byName),
  /** New asteroid-kind records that own an /asteroids/{slug} page (reused bodies keep their canonical page). */
  pages: (): MinorBodyRecord[] => MINOR_BODY_RECORDS.filter((r) => r.kind === "asteroid" && !r.existing).sort(byName),
  families: (): MinorBodyRecord[] => families.slice().sort(byName),
  groups: (): MinorBodyRecord[] => groups.slice(),
  neoClasses: (): MinorBodyRecord[] => neoClasses.slice(),
  trojans: (): MinorBodyRecord[] => trojans.slice(),
  resonances: (): MinorBodyRecord[] => resonances.slice(),
  impacts: (): MinorBodyRecord[] => impacts.slice(),

  /* browse / discovery queries — honest filters (a body without a value is excluded) */
  byCategory: (c: BodyCategory): MinorBodyRecord[] => (BODIES_BY_CATEGORY.get(c) ?? []).slice().sort(byDiameterDesc),
  byTaxonomy: (t: string): MinorBodyRecord[] => (BODIES_BY_TAXONOMY.get(t) ?? []).slice().sort(byDiameterDesc),
  byGroup: membersByGroup,
  byNeoClass: membersByNeo,
  byTrojanGroup: membersByTrojan,
  byFamily: membersByFamily,
  largest: (n = 15): MinorBodyRecord[] => bodies().filter((b) => b.meanDiameterKm != null).sort(byDiameterDesc).slice(0, n),
  potentiallyHazardous: (): MinorBodyRecord[] => bodies().filter((b) => b.pha).sort(byName),
  binaries: (): MinorBodyRecord[] => bodies().filter((b) => b.systemType === "binary").sort(byName),
  triples: (): MinorBodyRecord[] => bodies().filter((b) => b.systemType === "triple").sort(byName),
  visited: (): MinorBodyRecord[] => bodies().filter((b) => (b.visitedBySlugs?.length ?? 0) > 0).sort(byName),
  sampleReturnTargets: (): MinorBodyRecord[] => bodies().filter((b) => (b.sampleReturnBySlugs?.length ?? 0) > 0).sort(byName),
  missionTargets: (): MinorBodyRecord[] => bodies().filter((b) => (b.visitedBySlugs?.length ?? 0) + (b.targetOfSlugs?.length ?? 0) > 0).sort(byName),
  historicDiscoveries: (): MinorBodyRecord[] => bodies().filter((b) => b.discoveryYear && b.discoveryYear < "1900").sort(byYear),
  withDiscoveryYear: (): MinorBodyRecord[] => bodies().filter((b) => b.discoveryYear).sort(byYear),
  bySlugs: (slugs: string[]): MinorBodyRecord[] => slugs.map((s) => ASTEROID_BY_SLUG.get(s)).filter((r): r is MinorBodyRecord => Boolean(r)),

  /* the named resolve* surface from the mission spec */
  resolveAsteroid: (slug: string): ResolvedAsteroid | null => {
    const r = ASTEROID_BY_SLUG.get(slug);
    return r ? resolveBody(r) : null;
  },
  resolveFamily: (slug: string): ResolvedPopulation | null => {
    const r = FAMILY_BY_SLUG.get(slug);
    return r ? resolvePopulationRecord(r, membersByFamily(slug)) : null;
  },
  resolveGroup: (slug: string): ResolvedPopulation | null => {
    const r = GROUP_BY_SLUG.get(slug);
    return r ? resolvePopulationRecord(r, membersByGroup(slug)) : null;
  },
  resolveNEO: (slug: string): ResolvedPopulation | null => {
    const r = NEO_BY_SLUG.get(slug);
    return r ? resolvePopulationRecord(r, membersByNeo(slug)) : null;
  },
  resolveTrojan: (slug: string): ResolvedPopulation | null => {
    const r = TROJAN_BY_SLUG.get(slug);
    return r ? resolvePopulationRecord(r, membersByTrojan(slug)) : null;
  },
  resolveResonance: (slug: string): ResolvedPopulation | null => {
    const r = RESONANCE_BY_SLUG.get(slug);
    if (!r) return null;
    // members: bodies/groups/trojans that share this resonance
    const members = MINOR_BODY_RECORDS.filter((b) => b.resonanceSlug === slug);
    return resolvePopulationRecord(r, members);
  },
  resolveImpact: (slug: string): ResolvedImpact | null => {
    const r = IMPACT_BY_SLUG.get(slug);
    if (!r) return null;
    const entity = getEntityById(r.id);
    return { record: r, connections: getConnectionsByDomain(r.id), quality: entity ? computeEntityQuality(entity) : null, reviewStatus: reviewStatusFor(r.id) };
  },
  /** Generic population resolver — tries group, then near-Earth class, then Trojan group. */
  resolvePopulation: (slug: string): ResolvedPopulation | null =>
    (GROUP_BY_SLUG.has(slug) && asteroidEngine.resolveGroup(slug)) ||
    (NEO_BY_SLUG.has(slug) && asteroidEngine.resolveNEO(slug)) ||
    (TROJAN_BY_SLUG.has(slug) && asteroidEngine.resolveTrojan(slug)) ||
    null,
  /** Bodies explored or targeted by a given mission (by mission slug). */
  resolveMissionTargets: (missionSlug: string): MinorBodyRecord[] =>
    bodies().filter((b) =>
      (b.visitedBySlugs ?? []).includes(missionSlug) ||
      (b.sampleReturnBySlugs ?? []).includes(missionSlug) ||
      (b.targetOfSlugs ?? []).includes(missionSlug),
    ).sort(byName),
  /** The planetary-defense knowledge slice — hazardous NEOs, impact history, deflection targets. */
  resolvePlanetaryDefense: (): ResolvedPlanetaryDefense => {
    const defenseMissions = new Set(["dart", "hera"]);
    return {
      potentiallyHazardous: bodies().filter((b) => b.pha).sort(byName),
      impactEvents: impacts.slice(),
      deflectionTargets: bodies().filter((b) =>
        [...(b.visitedBySlugs ?? []), ...(b.targetOfSlugs ?? [])].some((m) => defenseMissions.has(m)),
      ).sort(byName),
    };
  },
};
