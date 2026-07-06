import { entityGraphPath, getConnectionsByDomain, getEntityById } from "@/knowledge-graph";
import { RELATION_LABELS } from "@/knowledge-graph/schema";
import { isMetaNode } from "@/lib/graph-explorer/algorithms";
import { citationsForEntity, type Citation } from "@/lib/citations";
import { LEARNING_PATHS } from "@/lib/learn";
import { explainEntity, relatedConcepts, type Ref } from "@/lib/assistant/retrieval";
import type { GroundedEvidence } from "@/lib/assistant/llm";

/**
 * Additional deterministic, grounded tools for the Grounded Scientific AI (Program BW), extending the
 * Program BS retrieval core. Like that core, these are built ONLY from facts already in the graph — an
 * entity's real citations and its real relations — and the platform's curated learning paths. There is
 * no language model here: nothing is generated or invented. Where the graph has no answer, the tool
 * says so rather than fill the gap.
 */

function toRef(e: { id: string; name: string; type: string }): Ref {
  const full = getEntityById(e.id);
  return { id: e.id, name: e.name, type: e.type, href: full ? entityGraphPath(full) : "#" };
}

export interface CitationSummaryResult {
  entity: Ref;
  sourceKeys: readonly string[];
  citations: Citation[];
  note?: string;
}

/** A grounded citation summary: the real citation records that support an entity, plus its source keys.
 *  Reuses the platform citation registry; fabricates nothing. */
export function citationSummary(id: string): CitationSummaryResult | null {
  const e = getEntityById(id);
  if (!e) return null;
  const citations = citationsForEntity(id);
  const sourceKeys = (e as { sources?: readonly string[] }).sources ?? [];
  return {
    entity: { id: e.id, name: e.name, type: e.type, href: entityGraphPath(e) },
    sourceKeys,
    citations,
    note: citations.length === 0 ? "No dedicated citation records link to this entity yet; its cited source registries are listed instead. Nothing is invented." : undefined,
  };
}

/** Relations that place an entity in a larger context or a prerequisite — the "foundations" of a path. */
const FOUNDATION_RELS = new Set<string>([
  "part_of", "part_of_catalogue", "part_of_program", "part_of_mission", "part_of_star_system",
  "part_of_station", "part_of_observatory", "part_of_survey", "part_of_model", "part_of_collection",
  "member_of_group", "member_of_cluster", "member_of_planetary_system", "belongs_to", "belongs_to_family",
  "belongs_to_constellation", "located_in", "located_in_constellation", "located_on", "located_at",
  "orbits", "orbits_star", "depends_on",
]);

export interface LearningPathResult {
  entity: Ref;
  /** Real broader context / prerequisites, from hierarchical relations. */
  foundations: Ref[];
  /** Real neighbouring concepts to explore next. */
  explore: Ref[];
  /** Curated platform learning paths that reference this entity. */
  curatedPaths: { slug: string; title: string; description: string }[];
  note?: string;
}

/** A grounded learning path from an entity: its real broader context, related concepts to explore, and
 *  any curated platform learning path that already features it. Ordered from foundations outward. */
export function learningPath(id: string): LearningPathResult | null {
  const e = getEntityById(id);
  if (!e) return null;
  const conns = (getConnectionsByDomain(id).science ?? []).filter((c) => !isMetaNode(c.other.id));
  const seen = new Set<string>([id]);
  const foundations: Ref[] = [];
  for (const c of conns) {
    if (FOUNDATION_RELS.has(c.relation.type) && !seen.has(c.other.id)) {
      seen.add(c.other.id);
      foundations.push(toRef(c.other));
    }
  }
  const explore = relatedConcepts(id, 30).filter((r) => !seen.has(r.id)).slice(0, 12);
  const curatedPaths = LEARNING_PATHS.filter((p) => p.relatedEntityIds?.includes(id)).map((p) => ({ slug: p.slug, title: p.title, description: p.description }));
  return {
    entity: { id: e.id, name: e.name, type: e.type, href: entityGraphPath(e) },
    foundations: foundations.slice(0, 8),
    explore,
    curatedPaths,
    note: foundations.length === 0 && explore.length === 0 && curatedPaths.length === 0 ? "The graph has no related concepts or curated path for this entity yet — not enough graph evidence to build a learning path." : undefined,
  };
}

/**
 * Assemble grounded evidence for an entity into the shape a RAG packet consumes — each fact traces to a
 * real relation or the entity's own description, with the entity's real citations attached. This is the
 * bridge from the deterministic graph retrieval to the (unwired) language-model layer: a model would be
 * handed exactly this, and nothing more. Returns null when the entity is unknown.
 */
export function assembleEvidence(id: string, question?: string): GroundedEvidence | null {
  const ex = explainEntity(id);
  if (!ex) return null;
  const q = question?.trim() || `What is ${ex.entity.name}, and how does it connect to the rest of the graph?`;
  const facts: { statement: string; source: Ref }[] = [];
  if (ex.description) facts.push({ statement: ex.description, source: ex.entity });
  for (const l of ex.links) {
    facts.push({ statement: `${ex.entity.name} — ${RELATION_LABELS[l.relation as keyof typeof RELATION_LABELS] ?? l.relation.replace(/_/g, " ")} → ${l.other.name}`, source: l.other });
  }
  const entities: Ref[] = [ex.entity, ...ex.links.map((l) => l.other)];
  const citations = citationsForEntity(id);
  return { question: q, facts, entities, citations };
}
