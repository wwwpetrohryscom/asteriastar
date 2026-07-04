import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/spaceflight-history-catalog/legacy-relations";
import { KIND_ENTITY_TYPE, type TimelineKind, type TimelineRecord } from "@/knowledge-graph/data/spaceflight-history-catalog/types";
import { eras } from "@/knowledge-graph/data/spaceflight-history-catalog/data/eras";
import { events } from "@/knowledge-graph/data/spaceflight-history-catalog/data/events";
import { milestones } from "@/knowledge-graph/data/spaceflight-history-catalog/data/milestones";
import { records } from "@/knowledge-graph/data/spaceflight-history-catalog/data/records";

/**
 * Space Missions Timeline & Historical Events catalog (Program AK). It CREATES the historic
 * eras, dated timeline events, mission milestones, and standing records, and links each to
 * the REUSED missions, mission programs, astronauts, organizations, stations, telescopes,
 * and bodies it concerns (associated_with) and to its era (part_of). It creates and
 * duplicates nothing that already exists. Relations that duplicate an existing edge or whose
 * endpoints don't resolve are dropped. Nothing is fabricated.
 */

export const TIMELINE_RECORDS: TimelineRecord[] = [...eras, ...events, ...milestones, ...records];
export const TIMELINE_BY_ID = new Map(TIMELINE_RECORDS.map((r) => [r.id, r]));
export const TIMELINE_BY_SLUG = new Map(TIMELINE_RECORDS.map((r) => [r.slug, r]));
const ERA_BY_SLUG = new Map(eras.map((r) => [r.slug, r]));
const rEra = (s?: string) => (s ? ERA_BY_SLUG.get(s)?.id : undefined);

export function entryPathFor(r: Pick<TimelineRecord, "slug">): string {
  return `/timeline/${r.slug}`;
}

export const entities: GraphEntity[] = TIMELINE_RECORDS.map((r) => ({
  id: r.id,
  type: r.id.slice(0, r.id.indexOf(":")) as EntityType,
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

for (const r of TIMELINE_RECORDS) {
  if (r.kind === "era") continue;
  add(r.id, "part_of", rEra(r.eraSlug));
  add(r.id, "associated_with", r.bodyKey);
  for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
}

export const relations: GraphRelation[] = derived;

export const TIMELINE_STATS = {
  records: TIMELINE_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  eras: eras.length,
  events: events.length,
  milestones: milestones.length,
  superlatives: records.length,
} as const;

export function validateSpaceflightHistory(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const kinds = new Set(Object.keys(KIND_ENTITY_TYPE) as TimelineKind[]);
  const seenSlug = new Set<string>();
  const seenSlugByKind = new Map<TimelineKind, Set<string>>();
  for (const r of TIMELINE_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate timeline id: ${r.id}`);
    seenId.add(r.id);
    const ks = seenSlugByKind.get(r.kind) ?? seenSlugByKind.set(r.kind, new Set()).get(r.kind)!;
    if (ks.has(r.slug)) issues.push(`duplicate ${r.kind} slug: ${r.slug}`);
    ks.add(r.slug);
    if (seenSlug.has(r.slug)) issues.push(`duplicate slug across kinds: ${r.slug}`);
    seenSlug.add(r.slug);
    if (!ID.test(r.id)) issues.push(`bad id: ${r.id}`);
    if (!kinds.has(r.kind)) issues.push(`${r.id}: unknown kind ${r.kind}`);
    if (r.id !== `${KIND_ENTITY_TYPE[r.kind]}:${r.slug}`) issues.push(`${r.id}: id does not match kind ${r.kind} / slug ${r.slug}`);
    if (!r.sources?.length) issues.push(`${r.id}: missing sources`);
    if (!r.description) issues.push(`${r.id}: missing description`);
    if (r.kind === "event" || r.kind === "milestone") {
      if (!rEra(r.eraSlug)) issues.push(`${r.id}: unresolved eraSlug "${r.eraSlug}"`);
      if (r.year === undefined) issues.push(`${r.id}: dated ${r.kind} has no year`);
    }
    for (const k of [r.bodyKey, ...(r.relatedKeys ?? [])].filter(Boolean) as string[]) if (!ID.test(k)) issues.push(`${r.id}: malformed reference id "${k}"`);
  }
  const connected = new Set<string>();
  for (const x of relations) { connected.add(x.from); connected.add(x.to); }
  for (const e of entities) if (!connected.has(e.id)) issues.push(`isolated new entity: ${e.id}`);
  return issues;
}

export type { TimelineRecord, TimelineKind, TimelineCategory } from "@/knowledge-graph/data/spaceflight-history-catalog/types";
export { KIND_ENTITY_TYPE, KIND_LABEL } from "@/knowledge-graph/data/spaceflight-history-catalog/types";
export { eras, events, milestones, records };
