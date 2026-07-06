import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/scientific-assistant-catalog/legacy-relations";
import type { AssistantRecord, Grounding } from "@/knowledge-graph/data/scientific-assistant-catalog/types";
import { capabilities } from "@/knowledge-graph/data/scientific-assistant-catalog/data/capabilities";

/**
 * Scientific AI Research Assistant catalog (Program BS). It CREATES the assistant-capability entities
 * — the capabilities of an explainable, grounded assistant — and links each to the REUSED example
 * entities it works over and its sibling capabilities (associated_with). The grounded capabilities
 * are backed by real graph retrieval; the architecture capabilities are interfaces for a future LLM
 * layer. It adds only the capability definitions and fabricates nothing.
 */

export const BS_RECORDS: AssistantRecord[] = [...capabilities];
export const BS_BY_ID = new Map(BS_RECORDS.map((r) => [r.id, r]));
export const BS_BY_SLUG = new Map(BS_RECORDS.map((r) => [r.slug, r]));

export function entryPathFor(r: Pick<AssistantRecord, "slug">): string {
  return `/assistant/${r.slug}`;
}

export const entities: GraphEntity[] = BS_RECORDS.filter((r) => !r.existing).map((r) => ({
  id: r.id,
  type: "assistant_capability" as EntityType,
  name: r.name,
  domain: "science" as const,
  entryPath: entryPathFor(r),
  description: r.description,
  aliases: r.altNames,
  sources: r.sources,
}));

const derived: GraphRelation[] = [];
const seenRel = new Set<string>();
function add(from: string | undefined, type: RelationType, to: string | undefined) {
  if (!from || !to || from === to) return;
  const id = `${from}|${type}|${to}`;
  if (LEGACY_RELATION_IDS.has(id) || seenRel.has(id)) return;
  seenRel.add(id);
  derived.push(rel(from, type, to, "confirmed", "science"));
}

for (const r of BS_RECORDS) {
  for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
}

export const relations: GraphRelation[] = derived;

const GROUNDINGS: Grounding[] = ["grounded", "architecture"];

export const BS_STATS = {
  records: BS_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  byGrounding: Object.fromEntries(GROUNDINGS.map((g) => [g, BS_RECORDS.filter((r) => r.grounding === g).length])) as Record<Grounding, number>,
} as const;

export function validateScientificAssistant(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const seenSlug = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const groundings = new Set(GROUNDINGS);
  for (const r of BS_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate assistant-capability id: ${r.id}`);
    seenId.add(r.id);
    if (seenSlug.has(r.slug)) issues.push(`duplicate assistant-capability slug: ${r.slug}`);
    seenSlug.add(r.slug);
    if (!ID.test(r.id)) issues.push(`bad id: ${r.id}`);
    if (r.id !== `assistant_capability:${r.slug}`) issues.push(`${r.id}: id does not match slug ${r.slug}`);
    if (!groundings.has(r.grounding)) issues.push(`${r.id}: unknown grounding ${r.grounding}`);
    if (!r.capability) issues.push(`${r.id}: missing capability`);
    if (!r.sources?.length) issues.push(`${r.id}: missing sources`);
    if (!r.description) issues.push(`${r.id}: missing description`);
    for (const k of r.relatedKeys ?? []) if (!ID.test(k)) issues.push(`${r.id}: malformed reference id "${k}"`);
  }
  const connected = new Set<string>();
  for (const x of relations) { connected.add(x.from); connected.add(x.to); }
  for (const e of entities) if (!connected.has(e.id)) issues.push(`isolated new entity: ${e.id}`);
  return issues;
}

export type { AssistantRecord, Grounding } from "@/knowledge-graph/data/scientific-assistant-catalog/types";
export { capabilities };
