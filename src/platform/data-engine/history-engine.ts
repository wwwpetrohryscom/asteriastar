import {
  ASTRONOMERS, DISCOVERIES, PUBLICATIONS, THEORIES, CATALOGUES, ERAS, EVENTS, AWARDS,
  ASTRO_BY_SLUG, DISCOVERY_BY_SLUG, PUBLICATION_BY_SLUG, THEORY_BY_SLUG, CATALOGUE_BY_SLUG,
  ERA_BY_SLUG, EVENT_BY_SLUG, AWARD_BY_SLUG, ERA_MEMBERS, RECIPIENTS_BY_AWARD,
  DISCOVERIES_BY_ASTRONOMER, PUBLICATIONS_BY_ASTRONOMER, THEORIES_BY_ASTRONOMER, CATALOGUES_BY_ASTRONOMER,
  DATED_ITEMS, astronomerId, discoveryId, theoryId, catalogueId, eraId, awardId,
} from "@/knowledge-graph/data/history-catalog";
import type {
  AstronomerRecord, DiscoveryRecord, PublicationRecord, TheoryRecord, CatalogueRecord,
  EraRecord, EventRecord, AwardRecord, DatedItem,
} from "@/knowledge-graph/data/history-catalog/types";
import { formatLifespan, formatHistYear } from "@/knowledge-graph/data/history-catalog/types";
import { getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * History Engine — resolver and query surface for the History of Astronomy
 * encyclopedia. Resolves any /history slug to an astronomer, discovery,
 * publication, theory, catalogue, era, event, or award. Pure, deterministic,
 * framework-independent.
 */

export type Ref = { id: string; name: string; href: string };

function entRef(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  if (!e) return undefined;
  return { id, name: e.name, href: e.entryPath ?? `/explore/entity/${id.replace(":", "/")}` };
}
function refs(ids: string[] | undefined): Ref[] {
  return (ids ?? []).map(entRef).filter((r): r is Ref => Boolean(r));
}
function astroRefs(slugs: string[] | undefined): Ref[] {
  return refs((slugs ?? []).map(astronomerId));
}
function eraRef(slug: string | undefined): Ref | undefined {
  return slug ? entRef(eraId(slug)) : undefined;
}
function quality(id: string): EntityQuality | null {
  const e = getEntityById(id);
  return e ? computeEntityQuality(e) : null;
}

/* ------------------------------------------------------------- resolve types */

export interface ResolvedAstronomer {
  kind: "astronomer";
  record: AstronomerRecord;
  lifespan?: string;
  era?: Ref;
  discoveries: DiscoveryRecord[];
  publications: PublicationRecord[];
  theories: TheoryRecord[];
  catalogues: CatalogueRecord[];
  awards: { slug: string; name: string; year?: number; href: string }[];
  workedAt: Ref[];
  observed: Ref[];
  studentOf: Ref[];
  collaborators: Ref[];
  influenced: Ref[];
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}
export interface ResolvedDiscovery {
  kind: "discovery";
  record: DiscoveryRecord;
  yearLabel?: string;
  by: Ref[];
  predictedBy: Ref[];
  firstObservedBy: Ref[];
  era?: Ref;
  related: Ref[];
  facilities: Ref[];
  confirms?: Ref;
  refutes?: Ref;
  publications: PublicationRecord[];
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}
export interface ResolvedPublication {
  kind: "publication";
  record: PublicationRecord;
  yearLabel?: string;
  authors: Ref[];
  era?: Ref;
  introduces: Ref[];
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}
export interface ResolvedTheory {
  kind: "theory";
  record: TheoryRecord;
  yearLabel?: string;
  by: Ref[];
  era?: Ref;
  confirmedBy: DiscoveryRecord[];
  refutedBy: DiscoveryRecord[];
  publications: PublicationRecord[];
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}
export interface ResolvedCatalogue {
  kind: "catalogue";
  record: CatalogueRecord;
  yearLabel?: string;
  by: Ref[];
  era?: Ref;
  mission?: Ref;
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
  reviewStatus: ReviewStatus;
}
export interface ResolvedEra {
  kind: "era";
  record: EraRecord;
  members: ReturnType<typeof membersOf>;
  parent?: Ref;
  subEras: Ref[];
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
}
export interface ResolvedEvent {
  kind: "event";
  record: EventRecord;
  yearLabel?: string;
  era?: Ref;
  related: Ref[];
  people: Ref[];
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
}
export interface ResolvedAward {
  kind: "award";
  record: AwardRecord;
  recipients: { record: AstronomerRecord; year?: number }[];
  connections: ReturnType<typeof getConnectionsByDomain>;
  quality: EntityQuality | null;
}
export type ResolvedHistory =
  | ResolvedAstronomer | ResolvedDiscovery | ResolvedPublication | ResolvedTheory
  | ResolvedCatalogue | ResolvedEra | ResolvedEvent | ResolvedAward;

function membersOf(eraSlug: string) {
  const m = ERA_MEMBERS.get(eraSlug);
  return m ?? { astronomers: [], discoveries: [], publications: [], theories: [], catalogues: [], events: [] };
}

/* ----------------------------------------------------------------- resolvers */

function resolveAstronomer(a: AstronomerRecord): ResolvedAstronomer {
  const id = astronomerId(a.slug);
  return {
    kind: "astronomer", record: a, lifespan: formatLifespan(a), era: eraRef(a.eraSlug),
    discoveries: (DISCOVERIES_BY_ASTRONOMER.get(a.slug) ?? []).slice().sort(byYear),
    publications: (PUBLICATIONS_BY_ASTRONOMER.get(a.slug) ?? []).slice().sort(byYear),
    theories: (THEORIES_BY_ASTRONOMER.get(a.slug) ?? []).slice().sort(byYear),
    catalogues: (CATALOGUES_BY_ASTRONOMER.get(a.slug) ?? []).slice().sort(byYear),
    awards: (a.awards ?? []).map((aw) => ({ slug: aw.slug, name: AWARD_BY_SLUG.get(aw.slug)?.name ?? aw.slug, year: aw.year, href: `/history/${aw.slug}` })),
    workedAt: refs(a.workedAt),
    observed: refs(a.observed),
    studentOf: astroRefs(a.studentOf),
    collaborators: astroRefs(a.collaborators),
    influenced: astroRefs(a.influenced),
    connections: getConnectionsByDomain(id),
    quality: quality(id), reviewStatus: reviewStatusFor(id),
  };
}

function resolveDiscovery(d: DiscoveryRecord): ResolvedDiscovery {
  const id = discoveryId(d.slug);
  const publications = PUBLICATIONS.filter((p) => (p.introducesDiscoveries ?? []).includes(d.slug));
  return {
    kind: "discovery", record: d, yearLabel: formatHistYear(d.year, d.yearApprox),
    by: astroRefs(d.by), predictedBy: astroRefs(d.predictedBy), firstObservedBy: astroRefs(d.firstObservedBy),
    era: eraRef(d.eraSlug), related: refs(d.relatedEntityIds), facilities: refs(d.facilityIds),
    confirms: d.confirmsTheory ? entRef(theoryId(d.confirmsTheory)) : undefined,
    refutes: d.refutesTheory ? entRef(theoryId(d.refutesTheory)) : undefined,
    publications,
    connections: getConnectionsByDomain(id), quality: quality(id), reviewStatus: reviewStatusFor(id),
  };
}

function resolvePublication(p: PublicationRecord): ResolvedPublication {
  const id = `publication:${p.slug}`;
  const introduces = [
    ...(p.introducesTheories ?? []).map(theoryId),
    ...(p.introducesDiscoveries ?? []).map(discoveryId),
  ];
  return {
    kind: "publication", record: p, yearLabel: formatHistYear(p.year, p.yearApprox),
    authors: astroRefs(p.authors), era: eraRef(p.eraSlug), introduces: refs(introduces),
    connections: getConnectionsByDomain(id), quality: quality(id), reviewStatus: reviewStatusFor(id),
  };
}

function resolveTheory(t: TheoryRecord): ResolvedTheory {
  const id = theoryId(t.slug);
  return {
    kind: "theory", record: t, yearLabel: formatHistYear(t.year, t.yearApprox),
    by: astroRefs(t.by), era: eraRef(t.eraSlug),
    confirmedBy: DISCOVERIES.filter((d) => d.confirmsTheory === t.slug),
    refutedBy: DISCOVERIES.filter((d) => d.refutesTheory === t.slug),
    publications: PUBLICATIONS.filter((p) => (p.introducesTheories ?? []).includes(t.slug)),
    connections: getConnectionsByDomain(id), quality: quality(id), reviewStatus: reviewStatusFor(id),
  };
}

function resolveCatalogue(c: CatalogueRecord): ResolvedCatalogue {
  const id = catalogueId(c.slug);
  return {
    kind: "catalogue", record: c, yearLabel: formatHistYear(c.year, c.yearApprox),
    by: astroRefs(c.by), era: eraRef(c.eraSlug), mission: entRef(c.missionId),
    connections: getConnectionsByDomain(id), quality: quality(id), reviewStatus: reviewStatusFor(id),
  };
}

function resolveEra(e: EraRecord): ResolvedEra {
  const id = eraId(e.slug);
  // Sub-eras: the ancient traditions grouped under the Ancient Astronomy period.
  const sub = e.slug === "ancient-astronomy"
    ? ERAS.filter((x) => ANCIENT_TRADITION_SET.has(x.slug))
    : [];
  return {
    kind: "era", record: e, members: membersOf(e.slug),
    parent: ANCIENT_TRADITION_SET.has(e.slug) ? entRef(eraId("ancient-astronomy")) : undefined,
    subEras: sub.map((x) => entRef(eraId(x.slug))).filter((r): r is Ref => Boolean(r)),
    connections: getConnectionsByDomain(id), quality: quality(id),
  };
}

function resolveEvent(e: EventRecord): ResolvedEvent {
  const id = `historical_event:${e.slug}`;
  return {
    kind: "event", record: e, yearLabel: formatHistYear(e.year, e.yearApprox),
    era: eraRef(e.eraSlug), related: refs(e.relatedEntityIds), people: astroRefs(e.people),
    connections: getConnectionsByDomain(id), quality: quality(id),
  };
}

function resolveAward(a: AwardRecord): ResolvedAward {
  const id = awardId(a.slug);
  const recipients = (RECIPIENTS_BY_AWARD.get(a.slug) ?? []).map((r) => ({
    record: r, year: (r.awards ?? []).find((x) => x.slug === a.slug)?.year,
  })).sort((x, y) => (x.year ?? 0) - (y.year ?? 0));
  return { kind: "award", record: a, recipients, connections: getConnectionsByDomain(id), quality: quality(id) };
}

const ANCIENT_TRADITION_SET = new Set([
  "babylonian-astronomy", "egyptian-astronomy", "greek-astronomy", "roman-astronomy",
  "chinese-astronomy", "indian-astronomy", "mayan-astronomy",
]);

const byYear = (a: { year?: number }, b: { year?: number }) => (a.year ?? 9e9) - (b.year ?? 9e9);

/* -------------------------------------------------------------------- resolve */

function resolve(slug: string): ResolvedHistory | null {
  const a = ASTRO_BY_SLUG.get(slug); if (a) return resolveAstronomer(a);
  const d = DISCOVERY_BY_SLUG.get(slug); if (d) return resolveDiscovery(d);
  const p = PUBLICATION_BY_SLUG.get(slug); if (p) return resolvePublication(p);
  const t = THEORY_BY_SLUG.get(slug); if (t) return resolveTheory(t);
  const c = CATALOGUE_BY_SLUG.get(slug); if (c && !c.existing) return resolveCatalogue(c);
  const e = ERA_BY_SLUG.get(slug); if (e) return resolveEra(e);
  const ev = EVENT_BY_SLUG.get(slug); if (ev) return resolveEvent(ev);
  const aw = AWARD_BY_SLUG.get(slug); if (aw) return resolveAward(aw);
  return null;
}

/** Every routable /history slug. */
function allSlugs(): string[] {
  return [...new Set([
    ...ASTRONOMERS.map((a) => a.slug),
    ...DISCOVERIES.map((d) => d.slug),
    ...PUBLICATIONS.map((p) => p.slug),
    ...THEORIES.map((t) => t.slug),
    ...CATALOGUES.filter((c) => !c.existing).map((c) => c.slug),
    ...ERAS.map((e) => e.slug),
    ...EVENTS.map((e) => e.slug),
    ...AWARDS.map((a) => a.slug),
  ])];
}

/* --------------------------------------------------------------------- query */

const byLife = (a: AstronomerRecord, b: AstronomerRecord) => (a.birthYear ?? 9e9) - (b.birthYear ?? 9e9);

export const historyEngine = {
  count: 0, // set below
  astronomerCount: ASTRONOMERS.length,
  discoveryCount: DISCOVERIES.length,
  publicationCount: PUBLICATIONS.length,
  eraCount: ERAS.length,
  resolve,
  allSlugs,
  eras: (): EraRecord[] => ERAS,
  astronomers: (): AstronomerRecord[] => ASTRONOMERS.slice().sort(byLife),
  astronomersAZ: (): AstronomerRecord[] => ASTRONOMERS.slice().sort((a, b) => a.name.localeCompare(b.name)),
  discoveries: (): DiscoveryRecord[] => DISCOVERIES.slice().sort(byYear),
  publications: (): PublicationRecord[] => PUBLICATIONS.slice().sort(byYear),
  theories: (): TheoryRecord[] => THEORIES.slice().sort(byYear),
  catalogues: (): CatalogueRecord[] => CATALOGUES.slice().sort(byYear),
  events: (): EventRecord[] => EVENTS.slice().sort(byYear),
  awards: (): AwardRecord[] => AWARDS,
  timeline: (): DatedItem[] => DATED_ITEMS,
  membersOfEra: membersOf,
  /** Astronomers whose primary era is the given slug, life-sorted. */
  astronomersInEra: (eraSlug: string): AstronomerRecord[] => membersOf(eraSlug).astronomers.slice().sort(byLife),
  /** Featured astronomers for the hub. */
  featured: (): AstronomerRecord[] => {
    const slugs = ["galileo-galilei", "johannes-kepler", "isaac-newton", "nicolaus-copernicus", "edwin-hubble", "vera-rubin", "subrahmanyan-chandrasekhar", "jocelyn-bell-burnell", "carl-sagan", "andrea-ghez", "michel-mayor", "al-sufi"];
    return slugs.map((s) => ASTRO_BY_SLUG.get(s)).filter((a): a is AstronomerRecord => Boolean(a));
  },
  /** Women astronomers in the catalogue, for the "Women in Astronomy" collection. */
  women: (): AstronomerRecord[] => {
    const slugs = ["caroline-herschel", "henrietta-leavitt", "annie-jump-cannon", "cecilia-payne-gaposchkin", "vera-rubin", "jocelyn-bell-burnell", "jane-luu", "andrea-ghez", "nancy-grace-roman"];
    return slugs.map((s) => ASTRO_BY_SLUG.get(s)).filter((a): a is AstronomerRecord => Boolean(a)).sort(byLife);
  },
  /** Nobel laureates among the astronomers. */
  nobelLaureates: (): { record: AstronomerRecord; year?: number }[] =>
    (RECIPIENTS_BY_AWARD.get("nobel-prize-physics") ?? []).map((r) => ({ record: r, year: (r.awards ?? []).find((x) => x.slug === "nobel-prize-physics")?.year })).sort((a, b) => (a.year ?? 0) - (b.year ?? 0)),
};

// derived count of routable pages
(historyEngine as { count: number }).count = allSlugs().length;
