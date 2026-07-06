import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/graph-explorer-catalog/legacy-relations";
import type { GraphViewRecord, ViewBacking } from "@/knowledge-graph/data/graph-explorer-catalog/types";
import { views } from "@/knowledge-graph/data/graph-explorer-catalog/data/views";

/**
 * Scientific Knowledge Graph Explorer catalog (Program BR). It CREATES the graph-explorer view
 * entities — the lenses through which the real knowledge graph is explored — and links each to the
 * REUSED example entities it demonstrates and its sibling views (associated_with). The views run over
 * the real graph; they add no data of their own beyond the view definitions, and fabricate nothing.
 */

export const BR_RECORDS: GraphViewRecord[] = [...views];
export const BR_BY_ID = new Map(BR_RECORDS.map((r) => [r.id, r]));
export const BR_BY_SLUG = new Map(BR_RECORDS.map((r) => [r.slug, r]));

export function entryPathFor(r: Pick<GraphViewRecord, "slug">): string {
  return `/graph/${r.slug}`;
}

export const entities: GraphEntity[] = BR_RECORDS.filter((r) => !r.existing).map((r) => ({
  id: r.id,
  type: "graph_view" as EntityType,
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

for (const r of BR_RECORDS) {
  for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
}

export const relations: GraphRelation[] = derived;

const BACKINGS: ViewBacking[] = ["computed", "rendering", "architecture"];

export const BR_STATS = {
  records: BR_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  byBacking: Object.fromEntries(BACKINGS.map((b) => [b, BR_RECORDS.filter((r) => r.backing === b).length])) as Record<ViewBacking, number>,
} as const;

export function validateGraphExplorer(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const seenSlug = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const backings = new Set(BACKINGS);
  for (const r of BR_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate graph-view id: ${r.id}`);
    seenId.add(r.id);
    if (seenSlug.has(r.slug)) issues.push(`duplicate graph-view slug: ${r.slug}`);
    seenSlug.add(r.slug);
    if (!ID.test(r.id)) issues.push(`bad id: ${r.id}`);
    if (r.id !== `graph_view:${r.slug}`) issues.push(`${r.id}: id does not match slug ${r.slug}`);
    if (!backings.has(r.backing)) issues.push(`${r.id}: unknown backing ${r.backing}`);
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

export type { GraphViewRecord, ViewBacking } from "@/knowledge-graph/data/graph-explorer-catalog/types";
export { views };
