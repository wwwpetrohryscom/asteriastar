import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { HISTORY_LEGACY_RELATION_IDS } from "@/knowledge-graph/data/history-catalog/legacy-relations";
import { ASTRONOMERS } from "@/knowledge-graph/data/history-catalog/data/astronomers";
import { DISCOVERIES } from "@/knowledge-graph/data/history-catalog/data/discoveries";
import { PUBLICATIONS } from "@/knowledge-graph/data/history-catalog/data/publications";
import { THEORIES } from "@/knowledge-graph/data/history-catalog/data/theories";
import { CATALOGUES } from "@/knowledge-graph/data/history-catalog/data/catalogues";
import { ERAS } from "@/knowledge-graph/data/history-catalog/data/eras";
import { EVENTS } from "@/knowledge-graph/data/history-catalog/data/events";
import { AWARDS } from "@/knowledge-graph/data/history-catalog/data/awards";
import { formatLifespan, formatHistYear, type AstronomerRecord, type DatedItem } from "@/knowledge-graph/data/history-catalog/types";

/**
 * History of Astronomy catalog (Program H).
 *
 * Curated records for astronomers, discoveries, publications, theories,
 * catalogues, eras, events, and awards drive the derivation of first-class
 * knowledge-graph entities and typed, provenance-bearing relations. The 16
 * astronomers and the catalogues already in the graph are reused by id (never
 * duplicated); every history entity connects to at least one other (no
 * orphans); every relation is deduped against every edge defined earlier.
 * Nothing is fabricated.
 */

export {
  ASTRONOMERS, DISCOVERIES, PUBLICATIONS, THEORIES, CATALOGUES, ERAS, EVENTS, AWARDS,
};

/* --------------------------------------------------------------- id helpers */

export const astronomerId = (slug: string) => `astronomer:${slug}`;
export const discoveryId = (slug: string) => `historical_discovery:${slug}`;
export const publicationId = (slug: string) => `publication:${slug}`;
export const theoryId = (slug: string) => `astronomical_theory:${slug}`;
export const catalogueId = (slug: string) => `catalog:${slug}`;
export const eraId = (slug: string) => `astronomy_era:${slug}`;
export const eventId = (slug: string) => `historical_event:${slug}`;
export const awardId = (slug: string) => `scientific_award:${slug}`;

/* ------------------------------------------------------------------- indexes */

export const ASTRO_BY_SLUG = new Map(ASTRONOMERS.map((a) => [a.slug, a]));
export const DISCOVERY_BY_SLUG = new Map(DISCOVERIES.map((d) => [d.slug, d]));
export const PUBLICATION_BY_SLUG = new Map(PUBLICATIONS.map((p) => [p.slug, p]));
export const THEORY_BY_SLUG = new Map(THEORIES.map((t) => [t.slug, t]));
export const CATALOGUE_BY_SLUG = new Map(CATALOGUES.map((c) => [c.slug, c]));
export const ERA_BY_SLUG = new Map(ERAS.map((e) => [e.slug, e]));
export const EVENT_BY_SLUG = new Map(EVENTS.map((e) => [e.slug, e]));
export const AWARD_BY_SLUG = new Map(AWARDS.map((a) => [a.slug, a]));

/** Discoveries credited to an astronomer slug (discovered / predicted / first_observed). */
export const DISCOVERIES_BY_ASTRONOMER = new Map<string, typeof DISCOVERIES>();
for (const d of DISCOVERIES) {
  for (const a of [...(d.by ?? []), ...(d.predictedBy ?? []), ...(d.firstObservedBy ?? [])]) {
    (DISCOVERIES_BY_ASTRONOMER.get(a) ?? DISCOVERIES_BY_ASTRONOMER.set(a, []).get(a)!).push(d);
  }
}
export const PUBLICATIONS_BY_ASTRONOMER = new Map<string, typeof PUBLICATIONS>();
for (const p of PUBLICATIONS) for (const a of p.authors ?? []) (PUBLICATIONS_BY_ASTRONOMER.get(a) ?? PUBLICATIONS_BY_ASTRONOMER.set(a, []).get(a)!).push(p);
export const THEORIES_BY_ASTRONOMER = new Map<string, typeof THEORIES>();
for (const t of THEORIES) for (const a of t.by ?? []) (THEORIES_BY_ASTRONOMER.get(a) ?? THEORIES_BY_ASTRONOMER.set(a, []).get(a)!).push(t);
export const CATALOGUES_BY_ASTRONOMER = new Map<string, typeof CATALOGUES>();
for (const c of CATALOGUES) for (const a of c.by ?? []) (CATALOGUES_BY_ASTRONOMER.get(a) ?? CATALOGUES_BY_ASTRONOMER.set(a, []).get(a)!).push(c);

/** Members of each era, by slug, grouped by kind. */
export interface EraMembers { astronomers: AstronomerRecord[]; discoveries: typeof DISCOVERIES; publications: typeof PUBLICATIONS; theories: typeof THEORIES; catalogues: typeof CATALOGUES; events: typeof EVENTS; }
export const ERA_MEMBERS = new Map<string, EraMembers>();
for (const e of ERAS) ERA_MEMBERS.set(e.slug, { astronomers: [], discoveries: [], publications: [], theories: [], catalogues: [], events: [] });
for (const a of ASTRONOMERS) if (a.eraSlug && ERA_MEMBERS.has(a.eraSlug)) ERA_MEMBERS.get(a.eraSlug)!.astronomers.push(a);
for (const d of DISCOVERIES) if (d.eraSlug && ERA_MEMBERS.has(d.eraSlug)) ERA_MEMBERS.get(d.eraSlug)!.discoveries.push(d);
for (const p of PUBLICATIONS) if (p.eraSlug && ERA_MEMBERS.has(p.eraSlug)) ERA_MEMBERS.get(p.eraSlug)!.publications.push(p);
for (const t of THEORIES) if (t.eraSlug && ERA_MEMBERS.has(t.eraSlug)) ERA_MEMBERS.get(t.eraSlug)!.theories.push(t);
for (const c of CATALOGUES) if (c.eraSlug && ERA_MEMBERS.has(c.eraSlug)) ERA_MEMBERS.get(c.eraSlug)!.catalogues.push(c);
for (const e of EVENTS) if (e.eraSlug && ERA_MEMBERS.has(e.eraSlug)) ERA_MEMBERS.get(e.eraSlug)!.events.push(e);

/** Astronomers who received a given award slug. */
export const RECIPIENTS_BY_AWARD = new Map<string, AstronomerRecord[]>();
for (const a of ASTRONOMERS) for (const aw of a.awards ?? []) (RECIPIENTS_BY_AWARD.get(aw.slug) ?? RECIPIENTS_BY_AWARD.set(aw.slug, []).get(aw.slug)!).push(a);

/** All dated items for the History of Astronomy timeline, sorted ascending. */
export const DATED_ITEMS: DatedItem[] = [
  ...DISCOVERIES.filter((d) => d.year != null).map((d) => ({ year: d.year!, yearApprox: d.yearApprox, label: d.name, kind: "discovery" as const, slug: d.slug })),
  ...PUBLICATIONS.filter((p) => p.year != null).map((p) => ({ year: p.year!, yearApprox: p.yearApprox, label: p.name, kind: "publication" as const, slug: p.slug })),
  ...EVENTS.filter((e) => e.year != null).map((e) => ({ year: e.year!, yearApprox: e.yearApprox, label: e.name, kind: "event" as const, slug: e.slug })),
].sort((a, b) => a.year - b.year);

/** First sentence of a description, for compact contexts. */
function firstSentence(text: string): string {
  const i = text.indexOf(". ");
  return i > 0 ? text.slice(0, i + 1) : text;
}

/** Timeline events for the History of Astronomy chronology (graph-derived). */
export const HISTORY_TIMELINE_EVENTS = DATED_ITEMS.map((it) => {
  const rec = it.kind === "discovery" ? DISCOVERY_BY_SLUG.get(it.slug)
    : it.kind === "publication" ? PUBLICATION_BY_SLUG.get(it.slug)
      : EVENT_BY_SLUG.get(it.slug);
  return {
    date: formatHistYear(it.year, it.yearApprox) ?? String(it.year),
    title: it.label,
    description: rec ? firstSentence(rec.description) : undefined,
    href: `/history/${it.slug}`,
  };
});

/* ------------------------------------------------------------------ entities */

function shorten(text: string, max = 240): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const at = cut.lastIndexOf(". ");
  return at > 80 ? cut.slice(0, at + 1) : cut.slice(0, cut.lastIndexOf(" ")) + "…";
}

const astronomerEntities: GraphEntity[] = ASTRONOMERS.filter((a) => !a.existing).map((a) => ({
  id: astronomerId(a.slug), type: "astronomer" as EntityType, name: a.name, domain: "science" as const,
  entryPath: `/history/${a.slug}`, description: shorten(a.bio),
  aliases: a.fullName && a.fullName !== a.name ? [a.fullName] : undefined,
  sources: a.sources,
}));

const discoveryEntities: GraphEntity[] = DISCOVERIES.map((d) => ({
  id: discoveryId(d.slug), type: "historical_discovery" as EntityType, name: d.name, domain: "science" as const,
  entryPath: `/history/${d.slug}`, description: shorten(d.description), sources: d.sources,
}));

const publicationEntities: GraphEntity[] = PUBLICATIONS.map((p) => ({
  id: publicationId(p.slug), type: "publication" as EntityType, name: p.name, domain: "science" as const,
  entryPath: `/history/${p.slug}`, description: shorten(p.description), sources: p.sources,
}));

const theoryEntities: GraphEntity[] = THEORIES.map((t) => ({
  id: theoryId(t.slug), type: "astronomical_theory" as EntityType, name: t.name, domain: "science" as const,
  entryPath: `/history/${t.slug}`, description: shorten(t.description), sources: t.sources,
}));

const catalogueEntities: GraphEntity[] = CATALOGUES.filter((c) => !c.existing).map((c) => ({
  id: catalogueId(c.slug), type: "catalog" as EntityType, name: c.name, domain: "science" as const,
  entryPath: `/history/${c.slug}`, description: shorten(c.description), sources: c.sources,
}));

const eraEntities: GraphEntity[] = ERAS.map((e) => ({
  id: eraId(e.slug), type: "astronomy_era" as EntityType, name: e.name, domain: "science" as const,
  entryPath: `/history/${e.slug}`, description: shorten(e.description), sources: e.sources,
}));

const eventEntities: GraphEntity[] = EVENTS.map((e) => ({
  id: eventId(e.slug), type: "historical_event" as EntityType, name: e.name, domain: "science" as const,
  entryPath: `/history/${e.slug}`, description: shorten(e.description), sources: e.sources,
}));

const awardEntities: GraphEntity[] = AWARDS.map((a) => ({
  id: awardId(a.slug), type: "scientific_award" as EntityType, name: a.name, domain: "science" as const,
  entryPath: `/history/${a.slug}`, description: shorten(a.description), sources: a.sources,
}));

export const entities: GraphEntity[] = [
  ...astronomerEntities, ...discoveryEntities, ...publicationEntities, ...theoryEntities,
  ...catalogueEntities, ...eraEntities, ...eventEntities, ...awardEntities,
];

/* ----------------------------------------------------------------- relations */

const derived: GraphRelation[] = [];
const seen = new Set<string>();
function add(from: string, type: RelationType, to: string, note?: string) {
  if (!from || !to || from === to) return;
  const id = `${from}|${type}|${to}`;
  if (HISTORY_LEGACY_RELATION_IDS.has(id) || seen.has(id)) return;
  seen.add(id);
  derived.push(rel(from, type, to, "confirmed", "science", note ? { note } : {}));
}

/** A discovery/facility is a mission when it's a space telescope or space mission, else a ground facility. */
function facilityRelation(id: string): RelationType {
  return id.startsWith("space_telescope:") || id.startsWith("space_mission:") ? "discovered_by_mission" : "discovered_by_facility";
}

for (const a of ASTRONOMERS) {
  const id = astronomerId(a.slug);
  if (a.eraSlug) add(id, "part_of", eraId(a.eraSlug));
  for (const w of a.workedAt ?? []) add(id, "worked_at", w);
  for (const aw of a.awards ?? []) add(id, "received_award", awardId(aw.slug), aw.year != null ? String(aw.year) : undefined);
  for (const s of a.studentOf ?? []) add(id, "student_of", astronomerId(s));
  for (const c of a.collaborators ?? []) add(id, "collaborated_with", astronomerId(c));
  for (const inf of a.influenced ?? []) add(id, "influenced", astronomerId(inf));
  for (const o of a.observed ?? []) add(id, "observed", o);
}

for (const d of DISCOVERIES) {
  const id = discoveryId(d.slug);
  for (const a of d.by ?? []) add(astronomerId(a), "discovered", id);
  for (const a of d.predictedBy ?? []) add(astronomerId(a), "predicted", id);
  for (const a of d.firstObservedBy ?? []) add(astronomerId(a), "first_observed", id);
  if (d.eraSlug) add(id, "part_of", eraId(d.eraSlug));
  for (const e of d.relatedEntityIds ?? []) add(id, "related_to", e);
  for (const f of d.facilityIds ?? []) add(id, facilityRelation(f), f);
  if (d.confirmsTheory) add(id, "confirmed", theoryId(d.confirmsTheory));
  if (d.refutesTheory) add(id, "refuted", theoryId(d.refutesTheory));
}

for (const p of PUBLICATIONS) {
  const id = publicationId(p.slug);
  for (const a of p.authors ?? []) add(astronomerId(a), "published", id);
  if (p.eraSlug) add(id, "part_of", eraId(p.eraSlug));
  for (const t of p.introducesTheories ?? []) add(id, "introduced", theoryId(t));
  for (const dd of p.introducesDiscoveries ?? []) add(id, "introduced", discoveryId(dd));
}

for (const t of THEORIES) {
  const id = theoryId(t.slug);
  for (const a of t.by ?? []) add(astronomerId(a), "developed", id);
  if (t.eraSlug) add(id, "part_of", eraId(t.eraSlug));
}

for (const c of CATALOGUES) {
  const id = catalogueId(c.slug);
  for (const a of c.by ?? []) add(astronomerId(a), "introduced", id);
  if (c.eraSlug) add(id, "part_of", eraId(c.eraSlug));
  if (c.missionId) add(id, "related_to", c.missionId);
}

for (const e of EVENTS) {
  const id = eventId(e.slug);
  if (e.eraSlug) add(id, "part_of", eraId(e.eraSlug));
  for (const r of e.relatedEntityIds ?? []) add(id, "related_to", r);
  for (const a of e.people ?? []) add(astronomerId(a), "associated_with", id);
}

// Era hierarchy: the ancient cultural traditions are part of the Ancient
// Astronomy period, giving every era a place in the chronology.
const ANCIENT_TRADITION_SLUGS = [
  "babylonian-astronomy", "egyptian-astronomy", "greek-astronomy", "roman-astronomy",
  "chinese-astronomy", "indian-astronomy", "mayan-astronomy",
];
for (const s of ANCIENT_TRADITION_SLUGS) add(eraId(s), "part_of", eraId("ancient-astronomy"));

export const relations: GraphRelation[] = derived;

/* -------------------------------------------------------------------- stats */

export const HISTORY_STATS = {
  astronomers: ASTRONOMERS.length,
  newAstronomers: astronomerEntities.length,
  reusedAstronomers: ASTRONOMERS.filter((a) => a.existing).length,
  discoveries: DISCOVERIES.length,
  publications: PUBLICATIONS.length,
  theories: THEORIES.length,
  catalogues: CATALOGUES.length,
  eras: ERAS.length,
  events: EVENTS.length,
  awards: AWARDS.length,
  newEntities: entities.length,
  relations: relations.length,
  timelineEvents: DATED_ITEMS.length,
} as const;

/* ---------------------------------------------------------------- validation */

const ID_RE = /^[a-z_]+:[a-z0-9-]+$/;

export function validateHistory(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const seenSlug = new Set<string>();

  for (const e of entities) {
    if (seenId.has(e.id)) issues.push(`duplicate history id: ${e.id}`);
    seenId.add(e.id);
    if (!ID_RE.test(e.id)) issues.push(`bad id: ${e.id}`);
    const slug = e.entryPath?.startsWith("/history/") ? e.entryPath.slice("/history/".length) : undefined;
    if (slug) { if (seenSlug.has(slug)) issues.push(`duplicate /history slug: ${slug}`); seenSlug.add(slug); }
  }

  // Referential integrity: every astronomer/theory/discovery slug referenced actually exists.
  const has = (m: ReadonlyMap<string, unknown>, s: string, ctx: string) => { if (!m.has(s)) issues.push(`${ctx} references unknown slug: ${s}`); };
  for (const a of ASTRONOMERS) {
    for (const s of a.studentOf ?? []) has(ASTRO_BY_SLUG, s, `astronomer ${a.slug} studentOf`);
    for (const s of a.collaborators ?? []) has(ASTRO_BY_SLUG, s, `astronomer ${a.slug} collaborators`);
    for (const s of a.influenced ?? []) has(ASTRO_BY_SLUG, s, `astronomer ${a.slug} influenced`);
    for (const aw of a.awards ?? []) has(AWARD_BY_SLUG, aw.slug, `astronomer ${a.slug} award`);
  }
  for (const d of DISCOVERIES) {
    for (const s of [...(d.by ?? []), ...(d.predictedBy ?? []), ...(d.firstObservedBy ?? [])]) has(ASTRO_BY_SLUG, s, `discovery ${d.slug} credit`);
    if (d.confirmsTheory) has(THEORY_BY_SLUG, d.confirmsTheory, `discovery ${d.slug} confirmsTheory`);
    if (d.refutesTheory) has(THEORY_BY_SLUG, d.refutesTheory, `discovery ${d.slug} refutesTheory`);
    if (d.eraSlug) has(ERA_BY_SLUG, d.eraSlug, `discovery ${d.slug} era`);
  }
  for (const p of PUBLICATIONS) {
    for (const s of p.authors ?? []) has(ASTRO_BY_SLUG, s, `publication ${p.slug} author`);
    for (const s of p.introducesTheories ?? []) has(THEORY_BY_SLUG, s, `publication ${p.slug} theory`);
    for (const s of p.introducesDiscoveries ?? []) has(DISCOVERY_BY_SLUG, s, `publication ${p.slug} discovery`);
  }
  for (const t of THEORIES) for (const s of t.by ?? []) has(ASTRO_BY_SLUG, s, `theory ${t.slug} by`);
  for (const c of CATALOGUES) for (const s of c.by ?? []) has(ASTRO_BY_SLUG, s, `catalogue ${c.slug} by`);

  // No orphans: every new entity has at least one relation (in or out).
  const connected = new Set<string>();
  for (const r of relations) { connected.add(r.from); connected.add(r.to); }
  for (const e of entities) if (!connected.has(e.id)) issues.push(`isolated history entity: ${e.id}`);

  // Every astronomer (including reused) must connect to the history graph.
  for (const a of ASTRONOMERS) if (!connected.has(astronomerId(a.slug))) issues.push(`disconnected astronomer: ${a.slug}`);

  return issues;
}

/** Lifespan helper re-exported for pages. */
export { formatLifespan };
