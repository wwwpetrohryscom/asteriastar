import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/workspace-catalog/legacy-relations";
import type { WorkspaceFeatureRecord, WorkspaceCategory } from "@/knowledge-graph/data/workspace-catalog/types";
import { features } from "@/knowledge-graph/data/workspace-catalog/data/features";

/**
 * Research Workspace catalog (Program BV). It CREATES the workspace-feature entities — the capabilities
 * of the privacy-first, local-only research workspace — and links each to its sibling features so the
 * workspace forms a connected subgraph. These are platform-feature meta-nodes (isMetaNode), so they
 * never surface as scientific facts. The workspace stores no server data and fabricates nothing: it
 * references real entities and the platform's real citation engine, all held only in the browser.
 */

export const BV_RECORDS: WorkspaceFeatureRecord[] = [...features];
export const BV_BY_ID = new Map(BV_RECORDS.map((r) => [r.id, r]));
export const BV_BY_SLUG = new Map(BV_RECORDS.map((r) => [r.slug, r]));

/**
 * The real page each feature is presented on. Several features SHARE a page — reading lists and
 * observation projects are managed on the collections page, and saving happens on the hub — so the
 * entryPath is mapped explicitly rather than derived from the slug, guaranteeing every entryPath
 * resolves to a page that exists (no 404s). A new feature without a mapping is caught by the validator.
 */
export const FEATURE_ROUTE: Record<string, string> = {
  "saved-entities": "/workspace",
  collections: "/workspace/collections",
  "reading-lists": "/workspace/collections",
  "observation-projects": "/workspace/collections",
  notes: "/workspace/notes",
  "citation-folder": "/workspace/citations",
  exports: "/workspace/exports",
  privacy: "/workspace/privacy",
};

export function entryPathFor(r: Pick<WorkspaceFeatureRecord, "slug">): string {
  return FEATURE_ROUTE[r.slug] ?? "/workspace";
}

export const entities: GraphEntity[] = BV_RECORDS.filter((r) => !r.existing).map((r) => ({
  id: r.id,
  type: "workspace_feature" as EntityType,
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

for (const r of BV_RECORDS) {
  for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
}

export const relations: GraphRelation[] = derived;

const CATEGORIES: WorkspaceCategory[] = ["saving", "organising", "notes", "citations", "exports", "privacy"];

export const BV_STATS = {
  records: BV_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  byCategory: Object.fromEntries(CATEGORIES.map((c) => [c, BV_RECORDS.filter((r) => r.category === c).length])) as Record<WorkspaceCategory, number>,
} as const;

export function validateWorkspace(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const seenSlug = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const cats = new Set(CATEGORIES);
  for (const r of BV_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate workspace-feature id: ${r.id}`);
    seenId.add(r.id);
    if (seenSlug.has(r.slug)) issues.push(`duplicate workspace-feature slug: ${r.slug}`);
    seenSlug.add(r.slug);
    if (!ID.test(r.id)) issues.push(`bad id: ${r.id}`);
    if (r.id !== `workspace_feature:${r.slug}`) issues.push(`${r.id}: id does not match slug ${r.slug}`);
    if (!cats.has(r.category)) issues.push(`${r.id}: unknown category ${r.category}`);
    if (!r.sources?.length) issues.push(`${r.id}: missing sources`);
    if (!r.description) issues.push(`${r.id}: missing description`);
    if (!r.capability) issues.push(`${r.id}: missing capability`);
    // Privacy honesty: every workspace feature stores its data only in the browser — never a server.
    if (r.storage !== "local-only") issues.push(`${r.id}: workspace data must be local-only (privacy-first), got "${r.storage}"`);
    // Every feature must map to a real page, so its graph entryPath never 404s.
    if (!FEATURE_ROUTE[r.slug]) issues.push(`${r.id}: no page route mapped for slug "${r.slug}" — its entryPath would 404`);
    for (const k of r.relatedKeys ?? []) if (!ID.test(k)) issues.push(`${r.id}: malformed reference id "${k}"`);
  }
  const connected = new Set<string>();
  for (const x of relations) { connected.add(x.from); connected.add(x.to); }
  for (const e of entities) if (!connected.has(e.id)) issues.push(`isolated new entity: ${e.id}`);
  return issues;
}

export type { WorkspaceFeatureRecord, WorkspaceCategory } from "@/knowledge-graph/data/workspace-catalog/types";
export { CATEGORY_LABEL } from "@/knowledge-graph/data/workspace-catalog/types";
export { features };
