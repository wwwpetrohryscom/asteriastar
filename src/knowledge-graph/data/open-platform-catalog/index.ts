import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/open-platform-catalog/legacy-relations";
import type { PlatformCapabilityRecord, PlatformCategory, PlatformStatus } from "@/knowledge-graph/data/open-platform-catalog/types";
import { capabilities } from "@/knowledge-graph/data/open-platform-catalog/data/capabilities";

/**
 * Open Astronomy Platform catalog (Program BX). It CREATES the platform-capability entities — the facets
 * of AsteriaStar as an open, research-grade data platform — and links each to its sibling capabilities.
 * These are platform-feature meta-nodes (isMetaNode), so they never surface as scientific facts. The
 * honesty envelope is the status: `available` capabilities work today over the real graph;
 * `architecture-ready` and `planned` ones are described honestly and serve no data. Nothing is faked.
 */

export const BX_RECORDS: PlatformCapabilityRecord[] = [...capabilities];
export const BX_BY_ID = new Map(BX_RECORDS.map((r) => [r.id, r]));
export const BX_BY_SLUG = new Map(BX_RECORDS.map((r) => [r.slug, r]));

export function entryPathFor(r: Pick<PlatformCapabilityRecord, "category">): string {
  // Capabilities are presented on their category page under /open-platform.
  const PAGE: Record<PlatformCategory, string> = {
    api: "/open-platform/api",
    graph: "/open-platform/graph",
    datasets: "/open-platform/datasets",
    downloads: "/open-platform/downloads",
    licenses: "/open-platform/licenses",
    sdk: "/open-platform/sdk",
    federation: "/open-platform/federation",
    standards: "/open-platform/graph",
  };
  return PAGE[r.category];
}

export const entities: GraphEntity[] = BX_RECORDS.filter((r) => !r.existing).map((r) => ({
  id: r.id,
  type: "platform_capability" as EntityType,
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

for (const r of BX_RECORDS) {
  for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
}

export const relations: GraphRelation[] = derived;

const CATEGORIES: PlatformCategory[] = ["api", "graph", "datasets", "downloads", "licenses", "sdk", "federation", "standards"];
const STATUSES: PlatformStatus[] = ["available", "architecture-ready", "planned"];

export const BX_STATS = {
  records: BX_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  byCategory: Object.fromEntries(CATEGORIES.map((c) => [c, BX_RECORDS.filter((r) => r.category === c).length])) as Record<PlatformCategory, number>,
  byStatus: Object.fromEntries(STATUSES.map((s) => [s, BX_RECORDS.filter((r) => r.status === s).length])) as Record<PlatformStatus, number>,
  available: BX_RECORDS.filter((r) => r.status === "available").length,
} as const;

export function validateOpenPlatform(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const seenSlug = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const cats = new Set(CATEGORIES);
  const stats = new Set(STATUSES);
  for (const r of BX_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate capability id: ${r.id}`);
    seenId.add(r.id);
    if (seenSlug.has(r.slug)) issues.push(`duplicate capability slug: ${r.slug}`);
    seenSlug.add(r.slug);
    if (!ID.test(r.id)) issues.push(`bad id: ${r.id}`);
    if (r.id !== `platform_capability:${r.slug}`) issues.push(`${r.id}: id does not match slug ${r.slug}`);
    if (!cats.has(r.category)) issues.push(`${r.id}: unknown category ${r.category}`);
    if (!stats.has(r.status)) issues.push(`${r.id}: unknown status ${r.status}`);
    if (!r.sources?.length) issues.push(`${r.id}: missing sources`);
    if (!r.description) issues.push(`${r.id}: missing description`);
    // Honesty: an available capability should point at a real endpoint/export; a non-available one must
    // state its limitations and must NOT advertise a live endpoint it does not serve.
    if (r.status === "available" && !r.endpoint) issues.push(`${r.id}: an 'available' capability should expose its real endpoint`);
    if (r.status !== "available" && r.endpoint) issues.push(`${r.id}: a '${r.status}' capability must not advertise a live endpoint (${r.endpoint})`);
    if (r.status !== "available" && !r.limitations) issues.push(`${r.id}: a '${r.status}' capability must state its limitations (what it does not yet do)`);
    for (const k of r.relatedKeys ?? []) if (!ID.test(k)) issues.push(`${r.id}: malformed reference id "${k}"`);
  }
  const connected = new Set<string>();
  for (const x of relations) { connected.add(x.from); connected.add(x.to); }
  for (const e of entities) if (!connected.has(e.id)) issues.push(`isolated new entity: ${e.id}`);
  return issues;
}

export type { PlatformCapabilityRecord, PlatformCategory, PlatformStatus } from "@/knowledge-graph/data/open-platform-catalog/types";
export { CATEGORY_LABEL, STATUS_LABEL } from "@/knowledge-graph/data/open-platform-catalog/types";
export { capabilities };
