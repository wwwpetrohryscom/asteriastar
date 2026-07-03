import {
  COMET_RECORDS,
  COMET_BY_ID,
  COMET_BY_SLUG,
  CLASS_BY_SLUG,
  FAMILY_BY_SLUG,
  RESERVOIR_BY_SLUG,
  COMETS_BY_CATEGORY,
  entryPathFor,
  comets,
  classes,
  families,
  reservoirs,
  transition,
  type CometCategory,
  type CometRecord,
} from "@/knowledge-graph/data/comets-catalog";
import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Comet Engine — resolver and query surface for the Comets & Small-Body Reservoirs
 * Encyclopedia (engine.comets). Pure, deterministic, framework-free. It resolves the
 * new comet / class / family / reservoir / active-asteroid / dormant-comet entities
 * and REUSES the platform's existing comets, meteor showers, missions, and Program Y's
 * dynamical reservoirs — creating and fabricating nothing. It performs NO live
 * visibility computation: comet pages link to the Live Sky tools rather than inventing
 * a current brightness or "visible tonight" claim. Reused bodies keep their canonical
 * pages; only new bodies get /comets/* pages, so this engine never mints a duplicate URL.
 */

type Ref = { id: string; name: string; slug?: string; href?: string };

/** The browsable URL for a catalog body: its /comets page if new, else its existing home. */
function bodyHref(r: CometRecord): string | undefined {
  const p = entryPathFor(r);
  if (p && !r.existing) return p;
  const e = getEntityById(r.id);
  return e ? entityGraphPath(e) : undefined;
}
function catalogRef(r: CometRecord | undefined): Ref | undefined {
  if (!r) return undefined;
  return { id: r.id, name: r.name, slug: r.slug, href: bodyHref(r) };
}
function refFromId(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  if (!e) return undefined;
  return { id, name: e.name, href: entityGraphPath(e) };
}

const byName = (a: CometRecord, b: CometRecord) => a.name.localeCompare(b.name, "en", { numeric: true });
const byPeriod = (a: CometRecord, b: CometRecord) => (a.orbitalPeriodYears ?? 1e9) - (b.orbitalPeriodYears ?? 1e9);

const bodies = () => COMET_RECORDS.filter((r) => r.kind === "comet" || r.kind === "active-asteroid" || r.kind === "dormant-comet");

/* ----------------------------------------------------------- resolvers */

export interface ResolvedComet {
  record: CometRecord;
  family?: Ref;
  classes: Ref[];
  reservoirs: Ref[];
  meteorShowers: Ref[];
  visitedBy: Ref[];
  sampleReturnedBy: Ref[];
  targetedBy: Ref[];
  observedBy: Ref[];
  related: Ref[];
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function resolveBody(r: CometRecord): ResolvedComet {
  const entity = getEntityById(r.id);
  const reservoirs: Ref[] = [
    ...(r.reservoirSlugs ?? []).map((s) => catalogRef(RESERVOIR_BY_SLUG.get(s))),
    ...(r.reusedReservoirKeys ?? []).map((k) => refFromId(k)),
  ].filter(Boolean) as Ref[];
  return {
    record: r,
    family: catalogRef(r.familySlug ? FAMILY_BY_SLUG.get(r.familySlug) : undefined),
    classes: (r.classSlugs ?? []).map((c) => catalogRef(CLASS_BY_SLUG.get(c))).filter(Boolean) as Ref[],
    reservoirs,
    meteorShowers: (r.meteorShowerIds ?? []).map((m) => refFromId(m)).filter(Boolean) as Ref[],
    visitedBy: (r.visitedBySlugs ?? []).map((m) => refFromId(`space_mission:${m}`)).filter(Boolean) as Ref[],
    sampleReturnedBy: (r.sampleReturnBySlugs ?? []).map((m) => refFromId(`space_mission:${m}`)).filter(Boolean) as Ref[],
    targetedBy: (r.targetOfSlugs ?? []).map((m) => refFromId(`space_mission:${m}`)).filter(Boolean) as Ref[],
    observedBy: (r.observedBySlugs ?? []).map((o) => refFromId(`observatory:${o}`)).filter(Boolean) as Ref[],
    related: (r.relatedKeys ?? []).map((k) => refFromId(k)).filter(Boolean) as Ref[],
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

export interface ResolvedCometGroup {
  record: CometRecord;
  members: CometRecord[];
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}

function membersOfClass(slug: string): CometRecord[] {
  return bodies().filter((b) => (b.classSlugs ?? []).includes(slug)).sort(byName);
}
function membersOfFamily(slug: string): CometRecord[] {
  return bodies().filter((b) => b.familySlug === slug).sort(byName);
}
function membersOfReservoir(slug: string): CometRecord[] {
  return bodies().filter((b) => (b.reservoirSlugs ?? []).includes(slug)).sort(byName);
}
/** Bodies whose source is a REUSED reservoir (a Program Y minor_planet_group id). */
function membersOfReusedReservoir(id: string): CometRecord[] {
  return bodies().filter((b) => (b.reusedReservoirKeys ?? []).includes(id)).sort(byName);
}

function resolveGroupRecord(r: CometRecord, members: CometRecord[]): ResolvedCometGroup {
  const entity = getEntityById(r.id);
  return {
    record: r,
    members,
    connections: getConnectionsByDomain(r.id),
    quality: entity ? computeEntityQuality(entity) : null,
    reviewStatus: reviewStatusFor(r.id),
  };
}

/* ----------------------------------------------------------- engine surface */

export const cometEngine = {
  count: bodies().length,
  recordCount: COMET_RECORDS.length,

  all: (): CometRecord[] => bodies().slice().sort(byName),
  get: (slug: string): CometRecord | undefined => COMET_BY_SLUG.get(slug) ?? COMET_BY_ID.get(slug),

  comets: (): CometRecord[] => comets.slice().sort(byName),
  /** New bodies that own a /comets/{slug} page (reused comets keep their canonical page). */
  pages: (): CometRecord[] => comets.filter((r) => !r.existing).sort(byName),
  classes: (): CometRecord[] => classes.slice(),
  families: (): CometRecord[] => families.slice(),
  reservoirs: (): CometRecord[] => reservoirs.slice(),
  activeAsteroids: (): CometRecord[] => transition.filter((r) => r.kind === "active-asteroid").sort(byName),
  dormantComets: (): CometRecord[] => transition.filter((r) => r.kind === "dormant-comet").sort(byName),

  /* discovery queries — honest filters */
  byCategory: (c: CometCategory): CometRecord[] => (COMETS_BY_CATEGORY.get(c) ?? []).slice().sort(byName),
  byClass: membersOfClass,
  byFamily: membersOfFamily,
  byReservoir: membersOfReservoir,
  periodicComets: (): CometRecord[] => comets.filter((c) => c.orbitalPeriodYears != null).sort(byPeriod),
  longPeriodComets: (): CometRecord[] => comets.filter((c) => (c.classSlugs ?? []).includes("long-period")).sort(byName),
  greatComets: (): CometRecord[] => comets.filter((c) => c.greatComet).sort(byName),
  sungrazers: (): CometRecord[] => comets.filter((c) => c.sungrazer || (c.classSlugs ?? []).includes("sungrazing")).sort(byName),
  cometMissionTargets: (): CometRecord[] => bodies().filter((c) => (c.visitedBySlugs?.length ?? 0) + (c.targetOfSlugs?.length ?? 0) > 0).sort(byName),
  sampleReturnComets: (): CometRecord[] => bodies().filter((c) => (c.sampleReturnBySlugs?.length ?? 0) > 0).sort(byName),
  meteorShowerParents: (): CometRecord[] => bodies().filter((c) => (c.meteorShowerIds?.length ?? 0) > 0 || c.meteorShowerNote).sort(byName),
  transitionObjects: (): CometRecord[] => bodies().filter((c) => c.kind !== "comet" || c.category === "transition").sort(byName),
  /** Comets/objects relevant to planetary defense — impactors and Earth/Mars close approaches. */
  planetaryDefenseComets: (): CometRecord[] => comets.filter((c) => c.fragmented || (c.relatedKeys ?? []).some((k) => k === "planet:jupiter" || k === "planet:mars")).sort(byName),
  historicComets: (): CometRecord[] => comets.filter((c) => c.discoveryYear && c.discoveryYear < "1910").sort(byName),
  bySlugs: (slugs: string[]): CometRecord[] => slugs.map((s) => COMET_BY_SLUG.get(s)).filter((r): r is CometRecord => Boolean(r)),

  /* the named resolve* surface from the mission spec */
  resolveComet: (slug: string): ResolvedComet | null => {
    const r = COMET_BY_SLUG.get(slug);
    return r ? resolveBody(r) : null;
  },
  resolveCometFamily: (slug: string): ResolvedCometGroup | null => {
    const r = FAMILY_BY_SLUG.get(slug);
    return r ? resolveGroupRecord(r, membersOfFamily(slug)) : null;
  },
  resolveCometClass: (slug: string): ResolvedCometGroup | null => {
    const r = CLASS_BY_SLUG.get(slug);
    return r ? resolveGroupRecord(r, membersOfClass(slug)) : null;
  },
  resolveReservoir: (slug: string): ResolvedCometGroup | null => {
    const r = RESERVOIR_BY_SLUG.get(slug);
    return r ? resolveGroupRecord(r, membersOfReservoir(slug)) : null;
  },
  /** Resolve the parent bodies of a meteor shower by its graph id (Live Sky integration). */
  resolveMeteorStream: (showerId: string): { showerId: string; parents: Ref[] } => ({
    showerId,
    parents: bodies().filter((b) => (b.meteorShowerIds ?? []).includes(showerId)).map((b) => catalogRef(b)).filter(Boolean) as Ref[],
  }),
  /** Bodies explored or targeted by a given mission (by mission slug). */
  resolveMissionTargets: (missionSlug: string): CometRecord[] =>
    bodies().filter((b) =>
      (b.visitedBySlugs ?? []).includes(missionSlug) ||
      (b.sampleReturnBySlugs ?? []).includes(missionSlug) ||
      (b.targetOfSlugs ?? []).includes(missionSlug),
    ).sort(byName),
  /** All modelled parent-body → meteor-shower links (comet slug + shower ids/notes). */
  resolveParentBodyLinks: (): { body: CometRecord; showerIds: string[]; note?: string }[] =>
    bodies()
      .filter((b) => (b.meteorShowerIds?.length ?? 0) > 0 || b.meteorShowerNote)
      .map((b) => ({ body: b, showerIds: b.meteorShowerIds ?? [], note: b.meteorShowerNote }))
      .sort((a, z) => byName(a.body, z.body)),
  /** Reused Program Y reservoir → the comets sourced from it (cross-program view). */
  reusedReservoirMembers: membersOfReusedReservoir,
};
