import {
  CONCEPTS, MODELS, OBJECT_CLASSES, PROGRAMS, PHYSICISTS, UNIVERSE_TIMELINE, EPOCHS,
  CONCEPT_BY_SLUG, MODEL_BY_SLUG, OBJECT_BY_SLUG, PROGRAM_BY_SLUG, PHYSICIST_BY_SLUG,
  CONCEPTS_BY_CONSENSUS, conceptId, modelId, objectId, programId, physicistId,
} from "@/knowledge-graph/data/cosmology-catalog";
import {
  CONSENSUS, CONSENSUS_LEVELS, type ConsensusLevel, type ConsensusMeta, type ConceptRecord,
  type ModelRecord, type ObjectClassRecord, type ProgramRecord, type PhysicistRecord, type TopicLinks, type TimelinePoint,
} from "@/knowledge-graph/data/cosmology-catalog/types";
import { getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { computeEntityQuality, type EntityQuality } from "@/platform/authority/quality";
import { reviewStatusFor, type ReviewStatus } from "@/platform/authority/review";

/**
 * Cosmology Engine — resolver and query surface for the Cosmology & Universe
 * encyclopedia. Resolves any /cosmology slug to a concept, model, object class,
 * observational program, or physicist, and surfaces the explicit consensus
 * classification for every topic. Pure, deterministic, framework-independent.
 */

export type Ref = { id: string; name: string; href: string };
function entRef(id: string | undefined): Ref | undefined {
  if (!id) return undefined;
  const e = getEntityById(id);
  if (!e) return undefined;
  return { id, name: e.name, href: e.entryPath ?? `/explore/entity/${id.replace(":", "/")}` };
}
function refs(ids: (string | undefined)[]): Ref[] {
  return ids.map(entRef).filter((r): r is Ref => Boolean(r));
}
function quality(id: string): EntityQuality | null {
  const e = getEntityById(id);
  return e ? computeEntityQuality(e) : null;
}

/** Resolve a topic's links into grouped, page-ready reference lists. */
export interface ResolvedLinks {
  foundations: Ref[];   // depends_on (concepts) + theories
  predicts: Ref[];
  related: Ref[];       // related concepts/objects + related discoveries + examples
  model?: Ref;          // part_of_model
  contains: Ref[];
  discoveries: Ref[];   // confirmed_by + related discoveries (reused H discoveries)
  scientists: Ref[];    // studied_by + developed_by
  facilities: Ref[];    // measured_by (missions/observatories/programs)
}
function resolveLinks(l: TopicLinks): ResolvedLinks {
  const containsRefs = (l.contains ?? []).map((s) => entRef(conceptId(s)) ?? entRef(objectId(s))).filter((r): r is Ref => Boolean(r));
  return {
    foundations: refs([...(l.dependsOn ?? []).map(conceptId), ...(l.theoryIds ?? [])]),
    predicts: refs((l.predicts ?? []).map(conceptId)),
    related: refs([...(l.relatedConcepts ?? []).map(conceptId), ...(l.relatedObjects ?? []).map(objectId)]),
    model: l.partOfModel ? entRef(modelId(l.partOfModel)) : undefined,
    contains: containsRefs,
    discoveries: refs([...(l.confirmedBy ?? []), ...(l.relatedDiscoveries ?? []), ...(l.examples ?? [])]),
    scientists: refs([...(l.studiedBy ?? []), ...(l.developedBy ?? [])]),
    facilities: refs(l.measuredBy ?? []),
  };
}

/* ------------------------------------------------------------- resolve types */
interface Base { consensusMeta: ConsensusMeta; links: ResolvedLinks; connections: ReturnType<typeof getConnectionsByDomain>; quality: EntityQuality | null; reviewStatus: ReviewStatus; }
export interface ResolvedConcept extends Base { kind: "concept"; record: ConceptRecord; }
export interface ResolvedModel extends Base { kind: "model"; record: ModelRecord; components: Ref[]; }
export interface ResolvedObject extends Base { kind: "object"; record: ObjectClassRecord; }
export interface ResolvedProgram { kind: "program"; record: ProgramRecord; operator?: Ref; measures: Ref[]; connections: ReturnType<typeof getConnectionsByDomain>; quality: EntityQuality | null; reviewStatus: ReviewStatus; }
export interface ResolvedPhysicist { kind: "physicist"; record: PhysicistRecord; developed: Ref[]; connections: ReturnType<typeof getConnectionsByDomain>; quality: EntityQuality | null; reviewStatus: ReviewStatus; }
export type ResolvedCosmology = ResolvedConcept | ResolvedModel | ResolvedObject | ResolvedProgram | ResolvedPhysicist;

/** Incoming refs of a given relation type, resolved (e.g. concepts part_of a model). */
function incoming(id: string, type: string): Ref[] {
  const conns = getConnectionsByDomain(id).science;
  return conns.filter((c) => !c.outgoing && c.relation.type === type).map((c) => entRef(c.other.id)).filter((r): r is Ref => Boolean(r));
}
function outgoing(id: string, type: string): Ref[] {
  const conns = getConnectionsByDomain(id).science;
  return conns.filter((c) => c.outgoing && c.relation.type === type).map((c) => entRef(c.other.id)).filter((r): r is Ref => Boolean(r));
}

function resolveConcept(c: ConceptRecord): ResolvedConcept {
  const id = conceptId(c.slug);
  return { kind: "concept", record: c, consensusMeta: CONSENSUS[c.consensus], links: resolveLinks(c), connections: getConnectionsByDomain(id), quality: quality(id), reviewStatus: reviewStatusFor(id) };
}
function resolveModel(m: ModelRecord): ResolvedModel {
  const id = modelId(m.slug);
  return { kind: "model", record: m, consensusMeta: CONSENSUS[m.consensus], links: resolveLinks(m), components: incoming(id, "part_of_model"), connections: getConnectionsByDomain(id), quality: quality(id), reviewStatus: reviewStatusFor(id) };
}
function resolveObject(o: ObjectClassRecord): ResolvedObject {
  const id = objectId(o.slug);
  return { kind: "object", record: o, consensusMeta: CONSENSUS[o.consensus], links: resolveLinks(o), connections: getConnectionsByDomain(id), quality: quality(id), reviewStatus: reviewStatusFor(id) };
}
function resolveProgram(p: ProgramRecord): ResolvedProgram {
  const id = programId(p.slug);
  return { kind: "program", record: p, operator: p.operatorId ? entRef(p.operatorId) : undefined, measures: incoming(id, "measured_by"), connections: getConnectionsByDomain(id), quality: quality(id), reviewStatus: reviewStatusFor(id) };
}
function resolvePhysicist(p: PhysicistRecord): ResolvedPhysicist {
  const id = physicistId(p.slug);
  return { kind: "physicist", record: p, developed: outgoing(id, "developed"), connections: getConnectionsByDomain(id), quality: quality(id), reviewStatus: reviewStatusFor(id) };
}

function resolve(slug: string): ResolvedCosmology | null {
  const c = CONCEPT_BY_SLUG.get(slug); if (c) return resolveConcept(c);
  const m = MODEL_BY_SLUG.get(slug); if (m) return resolveModel(m);
  const o = OBJECT_BY_SLUG.get(slug); if (o) return resolveObject(o);
  const p = PROGRAM_BY_SLUG.get(slug); if (p) return resolveProgram(p);
  const ph = PHYSICIST_BY_SLUG.get(slug); if (ph) return resolvePhysicist(ph);
  return null;
}

function allSlugs(): string[] {
  return [...new Set([
    ...CONCEPTS.map((c) => c.slug), ...MODELS.map((m) => m.slug), ...OBJECT_CLASSES.map((o) => o.slug),
    ...PROGRAMS.map((p) => p.slug), ...PHYSICISTS.map((p) => p.slug),
  ])];
}

/** Title + kind label for any resolved topic. */
export function cosmologyTitle(d: ResolvedCosmology): string { return d.record.name; }

export const cosmologyEngine = {
  count: allSlugs().length,
  conceptCount: CONCEPTS.length,
  modelCount: MODELS.length,
  objectCount: OBJECT_CLASSES.length,
  resolve,
  allSlugs,
  concepts: (): ConceptRecord[] => CONCEPTS,
  models: (): ModelRecord[] => MODELS,
  objects: (): ObjectClassRecord[] => OBJECT_CLASSES,
  programs: (): ProgramRecord[] => PROGRAMS,
  physicists: (): PhysicistRecord[] => PHYSICISTS,
  timeline: (): TimelinePoint[] => UNIVERSE_TIMELINE,
  epochs: (): ConceptRecord[] => EPOCHS,
  consensusLevels: (): ConsensusMeta[] => CONSENSUS_LEVELS.map((l) => CONSENSUS[l]),
  consensus: (level: ConsensusLevel): ConsensusMeta => CONSENSUS[level],
  conceptsByConsensus: (level: ConsensusLevel): ConceptRecord[] => CONCEPTS_BY_CONSENSUS.get(level) ?? [],
  /** All topics (concepts + models + objects) at a consensus level. */
  topicsByConsensus: (level: ConsensusLevel) => [...CONCEPTS, ...MODELS, ...OBJECT_CLASSES].filter((t) => t.consensus === level),
  conceptsByCategory: (category: ConceptRecord["category"]): ConceptRecord[] => CONCEPTS.filter((c) => c.category === category),
  objectsByCategory: (category: ObjectClassRecord["category"]): ObjectClassRecord[] => OBJECT_CLASSES.filter((o) => o.category === category),
  /** Featured topics for the hub. */
  featured: (): ConceptRecord[] => {
    const slugs = ["the-big-bang", "cosmic-expansion", "dark-matter", "dark-energy", "cosmic-microwave-background", "gravitational-waves", "cosmic-inflation", "hubble-tension"];
    return slugs.map((s) => CONCEPT_BY_SLUG.get(s)).filter((c): c is ConceptRecord => Boolean(c));
  },
  openQuestions: (): { slug: string; name: string; questions: string[] }[] =>
    [...CONCEPTS, ...OBJECT_CLASSES].filter((t) => (t.openQuestions?.length ?? 0) > 0).map((t) => ({ slug: t.slug, name: t.name, questions: t.openQuestions! })),
};
