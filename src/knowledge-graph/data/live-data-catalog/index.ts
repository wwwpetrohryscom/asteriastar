import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/live-data-catalog/legacy-relations";
import type { LiveSourceRecord, LiveCategory, LiveStatus } from "@/knowledge-graph/data/live-data-catalog/types";
import { sources } from "@/knowledge-graph/data/live-data-catalog/data/sources";

/**
 * Live Scientific Data catalog (Program BT). It CREATES the live-data-source entities — real external
 * providers modelled as graph nodes with the honesty envelope — and links each to the REUSED
 * operating organisation, the space-weather phenomena, and the observing-suite integrations. It
 * reuses the existing live-sky provider registry as the source of truth for status and duplicates
 * nothing. No live value, timestamp, or provider response is fabricated: an unconnected provider
 * reports its honest status.
 */

export const BT_RECORDS: LiveSourceRecord[] = [...sources];
export const BT_BY_ID = new Map(BT_RECORDS.map((r) => [r.id, r]));
export const BT_BY_SLUG = new Map(BT_RECORDS.map((r) => [r.slug, r]));

export function entryPathFor(r: Pick<LiveSourceRecord, "slug">): string {
  return `/live/${r.slug}`;
}

export const entities: GraphEntity[] = BT_RECORDS.filter((r) => !r.existing).map((r) => ({
  id: r.id,
  type: "live_data_source" as EntityType,
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

for (const r of BT_RECORDS) {
  for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
}

export const relations: GraphRelation[] = derived;

const CATEGORIES: LiveCategory[] = ["space-weather", "solar-activity", "near-earth-object", "orbital", "atmospheric"];
const STATUSES: LiveStatus[] = ["connected", "computed", "cached", "stale", "unavailable", "planned"];

export const BT_STATS = {
  records: BT_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  byCategory: Object.fromEntries(CATEGORIES.map((c) => [c, BT_RECORDS.filter((r) => r.category === c).length])) as Record<LiveCategory, number>,
  connected: BT_RECORDS.filter((r) => r.status === "connected").length,
  planned: BT_RECORDS.filter((r) => r.status === "planned").length,
} as const;

export function validateLiveData(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const seenSlug = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const cats = new Set(CATEGORIES);
  const stats = new Set(STATUSES);
  for (const r of BT_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate live-data id: ${r.id}`);
    seenId.add(r.id);
    if (seenSlug.has(r.slug)) issues.push(`duplicate live-data slug: ${r.slug}`);
    seenSlug.add(r.slug);
    if (!ID.test(r.id)) issues.push(`bad id: ${r.id}`);
    if (r.id !== `live_data_source:${r.slug}`) issues.push(`${r.id}: id does not match slug ${r.slug}`);
    if (!cats.has(r.category)) issues.push(`${r.id}: unknown category ${r.category}`);
    if (!stats.has(r.status)) issues.push(`${r.id}: unknown status ${r.status}`);
    if (!r.sources?.length) issues.push(`${r.id}: missing sources`);
    if (!r.description) issues.push(`${r.id}: missing description`);
    // Honesty: a source that is not connected must not carry data claims it cannot back — it must
    // state its limitations. Every non-connected provider must have a limitations note.
    if (r.status !== "connected" && !r.limitations) issues.push(`${r.id}: non-connected provider must state its limitations`);
    for (const k of r.relatedKeys ?? []) if (!ID.test(k)) issues.push(`${r.id}: malformed reference id "${k}"`);
  }
  const connected = new Set<string>();
  for (const x of relations) { connected.add(x.from); connected.add(x.to); }
  for (const e of entities) if (!connected.has(e.id)) issues.push(`isolated new entity: ${e.id}`);
  return issues;
}

export type { LiveSourceRecord, LiveCategory, LiveStatus, ProviderEnvelope } from "@/knowledge-graph/data/live-data-catalog/types";
export { CATEGORY_LABEL } from "@/knowledge-graph/data/live-data-catalog/types";
export { sources };
