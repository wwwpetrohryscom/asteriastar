import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { COSMOLOGY_LEGACY_RELATION_IDS } from "@/knowledge-graph/data/cosmology-catalog/legacy-relations";
import { CONCEPTS } from "@/knowledge-graph/data/cosmology-catalog/data/concepts";
import { MODELS } from "@/knowledge-graph/data/cosmology-catalog/data/models";
import { OBJECT_CLASSES } from "@/knowledge-graph/data/cosmology-catalog/data/objects";
import { PROGRAMS, PHYSICISTS } from "@/knowledge-graph/data/cosmology-catalog/data/programs";
import { UNIVERSE_TIMELINE } from "@/knowledge-graph/data/cosmology-catalog/data/timeline";
import { CONSENSUS_LEVELS, type ConceptRecord, type TopicLinks } from "@/knowledge-graph/data/cosmology-catalog/types";

/**
 * Cosmology & Universe catalog (Program I).
 *
 * Curated concepts, models, object classes, observational programs, and one
 * essential physicist (Einstein) drive the derivation of first-class graph
 * entities and typed, provenance-bearing relations. Every topic carries an
 * explicit consensus level. Existing graph entities (theories, discoveries,
 * scientists, black holes, missions, observatories) are reused by id, never
 * duplicated; every relation is deduped against every edge defined earlier;
 * every new entity connects to at least one other (no orphans). Nothing is
 * fabricated.
 */

export { CONCEPTS, MODELS, OBJECT_CLASSES, PROGRAMS, PHYSICISTS, UNIVERSE_TIMELINE };

/* --------------------------------------------------------------- id helpers */
export const conceptId = (slug: string) => `cosmology_concept:${slug}`;
export const modelId = (slug: string) => `cosmological_model:${slug}`;
export const objectId = (slug: string) => `astrophysical_object_class:${slug}`;
export const programId = (slug: string) => `observational_program:${slug}`;
export const physicistId = (slug: string) => `astronomer:${slug}`;

/* ------------------------------------------------------------------ indexes */
export const CONCEPT_BY_SLUG = new Map(CONCEPTS.map((c) => [c.slug, c]));
export const MODEL_BY_SLUG = new Map(MODELS.map((m) => [m.slug, m]));
export const OBJECT_BY_SLUG = new Map(OBJECT_CLASSES.map((o) => [o.slug, o]));
export const PROGRAM_BY_SLUG = new Map(PROGRAMS.map((p) => [p.slug, p]));
export const PHYSICIST_BY_SLUG = new Map(PHYSICISTS.map((p) => [p.slug, p]));

const CONCEPT_SLUGS = new Set(CONCEPTS.map((c) => c.slug));
const OBJECT_SLUGS = new Set(OBJECT_CLASSES.map((o) => o.slug));
const MODEL_SLUGS = new Set(MODELS.map((m) => m.slug));

/** Concepts grouped by consensus level, and by category — for pages and stats. */
export const CONCEPTS_BY_CONSENSUS = new Map<string, ConceptRecord[]>();
for (const c of CONCEPTS) (CONCEPTS_BY_CONSENSUS.get(c.consensus) ?? CONCEPTS_BY_CONSENSUS.set(c.consensus, []).get(c.consensus)!).push(c);

/** Concepts with a place in the cosmic chronology, ordered (Big Bang → present). */
export const EPOCHS = CONCEPTS.filter((c) => c.epochOrder != null).slice().sort((a, b) => (a.epochOrder ?? 0) - (b.epochOrder ?? 0));

/* ----------------------------------------------------------------- helpers */
function shorten(text: string, max = 240): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const at = cut.lastIndexOf(". ");
  return at > 80 ? cut.slice(0, at + 1) : cut.slice(0, cut.lastIndexOf(" ")) + "…";
}
/** Resolve a catalog slug used in `contains` to an entity id (concept or object). */
function containsTarget(slug: string): string | undefined {
  if (CONCEPT_SLUGS.has(slug)) return conceptId(slug);
  if (OBJECT_SLUGS.has(slug)) return objectId(slug);
  return undefined;
}

/* ------------------------------------------------------------------ entities */
const conceptEntities: GraphEntity[] = CONCEPTS.map((c) => ({
  id: conceptId(c.slug), type: "cosmology_concept" as EntityType, name: c.name, domain: "science" as const,
  entryPath: `/cosmology/${c.slug}`, description: shorten(c.definition), sources: c.sources,
}));

const modelEntities: GraphEntity[] = MODELS.map((m) => ({
  id: modelId(m.slug), type: "cosmological_model" as EntityType, name: m.name, domain: "science" as const,
  entryPath: `/cosmology/${m.slug}`, description: shorten(m.definition), sources: m.sources,
}));

const objectEntities: GraphEntity[] = OBJECT_CLASSES.map((o) => ({
  id: objectId(o.slug), type: "astrophysical_object_class" as EntityType, name: o.name, domain: "science" as const,
  entryPath: `/cosmology/${o.slug}`, description: shorten(o.definition), sources: o.sources,
}));

const programEntities: GraphEntity[] = PROGRAMS.map((p) => ({
  id: programId(p.slug), type: "observational_program" as EntityType, name: p.name, domain: "science" as const,
  entryPath: `/cosmology/${p.slug}`, description: shorten(p.definition), sources: p.sources,
}));

const physicistEntities: GraphEntity[] = PHYSICISTS.map((p) => ({
  id: physicistId(p.slug), type: "astronomer" as EntityType, name: p.name, domain: "science" as const,
  entryPath: `/cosmology/${p.slug}`, description: shorten(p.bio),
  aliases: p.fullName && p.fullName !== p.name ? [p.fullName] : undefined, sources: p.sources,
}));

export const entities: GraphEntity[] = [
  ...conceptEntities, ...modelEntities, ...objectEntities, ...programEntities, ...physicistEntities,
];

/* ----------------------------------------------------------------- relations */
const derived: GraphRelation[] = [];
const seen = new Set<string>();
function add(from: string, type: RelationType, to: string) {
  if (!from || !to || from === to) return;
  const id = `${from}|${type}|${to}`;
  if (COSMOLOGY_LEGACY_RELATION_IDS.has(id) || seen.has(id)) return;
  seen.add(id);
  derived.push(rel(from, type, to, "confirmed", "science", {}));
}

/** Emit the relations shared by all topics (concepts, models, objects). */
function emitLinks(fromId: string, links: TopicLinks) {
  for (const s of links.dependsOn ?? []) add(fromId, "depends_on", conceptId(s));
  for (const s of links.predicts ?? []) add(fromId, "predicts", conceptId(s));
  for (const s of links.relatedConcepts ?? []) add(fromId, "related_to", conceptId(s));
  for (const s of links.relatedObjects ?? []) add(fromId, "related_to", objectId(s));
  if (links.partOfModel) add(fromId, "part_of_model", modelId(links.partOfModel));
  for (const s of links.contains ?? []) { const t = containsTarget(s); if (t) add(fromId, "contains", t); }
  for (const id of links.theoryIds ?? []) add(fromId, "depends_on", id);
  for (const id of links.confirmedBy ?? []) add(fromId, "confirmed_by", id);
  for (const id of links.relatedDiscoveries ?? []) add(fromId, "related_to", id);
  for (const id of links.studiedBy ?? []) add(fromId, "studied_by", id);
  for (const id of links.developedBy ?? []) add(id, "developed", fromId);
  for (const id of links.measuredBy ?? []) add(fromId, "measured_by", id);
  for (const id of links.examples ?? []) add(fromId, "related_to", id);
}

for (const c of CONCEPTS) emitLinks(conceptId(c.slug), c);
for (const m of MODELS) emitLinks(modelId(m.slug), m);
for (const o of OBJECT_CLASSES) emitLinks(objectId(o.slug), o);

// Programs: link to their operating organization (reused).
for (const p of PROGRAMS) if (p.operatorId) add(programId(p.slug), "operated_by", p.operatorId);

// Einstein: developed general relativity (reused theory) in addition to the
// cosmology concepts that already point to him via developedBy.
add(physicistId("albert-einstein"), "developed", "astronomical_theory:general-relativity");

// Chain the cosmic epochs in order (Big Bang → inflation → … → present).
for (let i = 0; i < EPOCHS.length - 1; i++) add(conceptId(EPOCHS[i].slug), "followed_by", conceptId(EPOCHS[i + 1].slug));

export const relations: GraphRelation[] = derived;

/* ------------------------------------------------------------ timeline export */
export const COSMOLOGY_TIMELINE_EVENTS = UNIVERSE_TIMELINE.map((p) => ({
  date: p.time,
  title: p.title,
  description: p.description,
  href: p.slug ? `/cosmology/${p.slug}` : undefined,
}));

/* -------------------------------------------------------------------- stats */
export const COSMOLOGY_STATS = {
  concepts: CONCEPTS.length,
  models: MODELS.length,
  objectClasses: OBJECT_CLASSES.length,
  programs: PROGRAMS.length,
  physicists: PHYSICISTS.length,
  newEntities: entities.length,
  relations: relations.length,
  timelinePoints: UNIVERSE_TIMELINE.length,
  byConsensus: Object.fromEntries(CONSENSUS_LEVELS.map((l) => [l, [...CONCEPTS, ...MODELS, ...OBJECT_CLASSES].filter((t) => t.consensus === l).length])),
} as const;

/* ---------------------------------------------------------------- validation */
const ID_RE = /^[a-z_]+:[a-z0-9-]+$/;

export function validateCosmology(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const seenSlug = new Set<string>();

  for (const e of entities) {
    if (seenId.has(e.id)) issues.push(`duplicate cosmology id: ${e.id}`);
    seenId.add(e.id);
    if (!ID_RE.test(e.id)) issues.push(`bad id: ${e.id}`);
    const slug = e.entryPath?.startsWith("/cosmology/") ? e.entryPath.slice("/cosmology/".length) : undefined;
    if (slug) { if (seenSlug.has(slug)) issues.push(`duplicate /cosmology slug: ${slug}`); seenSlug.add(slug); }
  }

  // Every topic must carry a valid consensus level.
  for (const t of [...CONCEPTS, ...MODELS, ...OBJECT_CLASSES]) {
    if (!CONSENSUS_LEVELS.includes(t.consensus)) issues.push(`bad consensus level on ${t.slug}: ${t.consensus}`);
  }

  // Referential integrity for INTERNAL slug references (reused full-id refs are
  // validated by the global graph validator).
  const checkConcept = (s: string, ctx: string) => { if (!CONCEPT_SLUGS.has(s)) issues.push(`${ctx} → unknown concept slug: ${s}`); };
  const checkObject = (s: string, ctx: string) => { if (!OBJECT_SLUGS.has(s)) issues.push(`${ctx} → unknown object slug: ${s}`); };
  const checkModel = (s: string, ctx: string) => { if (!MODEL_SLUGS.has(s)) issues.push(`${ctx} → unknown model slug: ${s}`); };
  const checkLinks = (slug: string, l: TopicLinks) => {
    for (const s of l.dependsOn ?? []) checkConcept(s, `${slug}.dependsOn`);
    for (const s of l.predicts ?? []) checkConcept(s, `${slug}.predicts`);
    for (const s of l.relatedConcepts ?? []) checkConcept(s, `${slug}.relatedConcepts`);
    for (const s of l.relatedObjects ?? []) checkObject(s, `${slug}.relatedObjects`);
    if (l.partOfModel) checkModel(l.partOfModel, `${slug}.partOfModel`);
    for (const s of l.contains ?? []) if (!CONCEPT_SLUGS.has(s) && !OBJECT_SLUGS.has(s)) issues.push(`${slug}.contains → unknown slug: ${s}`);
  };
  for (const c of CONCEPTS) checkLinks(c.slug, c);
  for (const m of MODELS) checkLinks(m.slug, m);
  for (const o of OBJECT_CLASSES) checkLinks(o.slug, o);

  // Timeline slugs must resolve to a concept.
  for (const p of UNIVERSE_TIMELINE) if (p.slug && !CONCEPT_SLUGS.has(p.slug)) issues.push(`timeline point "${p.title}" → unknown concept slug: ${p.slug}`);

  // No orphans: every new entity carries at least one relation.
  const connected = new Set<string>();
  for (const r of relations) { connected.add(r.from); connected.add(r.to); }
  for (const e of entities) if (!connected.has(e.id)) issues.push(`isolated cosmology entity: ${e.id}`);

  return issues;
}
