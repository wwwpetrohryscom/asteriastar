import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/mission-operations-catalog/legacy-relations";
import { KIND_ENTITY_TYPE, type OpsKind, type OpsRecord } from "@/knowledge-graph/data/mission-operations-catalog/types";
import { centers } from "@/knowledge-graph/data/mission-operations-catalog/data/centers";
import { functions } from "@/knowledge-graph/data/mission-operations-catalog/data/functions";

/**
 * Ground Segment & Mission Operations catalog (Program AF). It CREATES the operations
 * centres and operational functions and links them to the REUSED agencies, tracking
 * networks, and missions. Relations that duplicate an existing edge or whose endpoints
 * don't resolve are dropped. Nothing is fabricated.
 */
export const OPS_RECORDS: OpsRecord[] = [...centers, ...functions];
export const OPS_BY_ID = new Map(OPS_RECORDS.map((r) => [r.id, r]));
export const OPS_BY_SLUG = new Map(OPS_RECORDS.map((r) => [r.slug, r]));

export function entryPathFor(r: Pick<OpsRecord, "slug">): string {
  return `/mission-operations/${r.slug}`;
}

export const entities: GraphEntity[] = OPS_RECORDS.map((r) => ({
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

for (const r of OPS_RECORDS) {
  if (r.kind === "center") {
    add(r.id, "operated_by", r.operatorKey);
    for (const k of r.networkKeys ?? []) add(r.id, "associated_with", k);
  }
  for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
}

export const relations: GraphRelation[] = derived;

export const OPS_STATS = {
  records: OPS_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  centers: centers.length,
  functions: functions.length,
} as const;

export function validateMissionOperations(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const kinds = new Set(Object.keys(KIND_ENTITY_TYPE) as OpsKind[]);
  const seenSlug = new Set<string>();
  const seenSlugByKind = new Map<OpsKind, Set<string>>();
  for (const r of OPS_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate ops id: ${r.id}`);
    seenId.add(r.id);
    const ks = seenSlugByKind.get(r.kind) ?? seenSlugByKind.set(r.kind, new Set()).get(r.kind)!;
    if (ks.has(r.slug)) issues.push(`duplicate ${r.kind} slug: ${r.slug}`);
    ks.add(r.slug);
    // Centres and functions share the /mission-operations/{slug} route.
    if (seenSlug.has(r.slug)) issues.push(`duplicate slug across kinds: ${r.slug}`);
    seenSlug.add(r.slug);
    if (!ID.test(r.id)) issues.push(`bad id: ${r.id}`);
    if (!kinds.has(r.kind)) issues.push(`${r.id}: unknown kind ${r.kind}`);
    if (r.id !== `${KIND_ENTITY_TYPE[r.kind]}:${r.slug}`) issues.push(`${r.id}: id does not match kind ${r.kind} / slug ${r.slug}`);
    if (!r.sources?.length) issues.push(`${r.id}: missing sources`);
    if (!r.description) issues.push(`${r.id}: missing description`);
    if (r.operatorKey && !r.operatorKey.startsWith("organization:")) issues.push(`${r.id}: operatorKey must be an organization id: "${r.operatorKey}"`);
    if (r.kind === "center" && !r.operatorKey) issues.push(`${r.id}: operations centre has no operator`);
    for (const k of r.networkKeys ?? []) if (!k.startsWith("tracking_network:")) issues.push(`${r.id}: networkKey must be a tracking_network id: "${k}"`);
    for (const k of [r.operatorKey, ...(r.networkKeys ?? []), ...(r.relatedKeys ?? [])].filter(Boolean) as string[]) {
      if (!ID.test(k)) issues.push(`${r.id}: malformed reference id "${k}"`);
    }
  }
  const connected = new Set<string>();
  for (const x of relations) { connected.add(x.from); connected.add(x.to); }
  for (const e of entities) if (!connected.has(e.id)) issues.push(`isolated new entity: ${e.id}`);
  return issues;
}

export type { OpsRecord, OpsKind, OpsCategory } from "@/knowledge-graph/data/mission-operations-catalog/types";
export { KIND_ENTITY_TYPE, KIND_LABEL } from "@/knowledge-graph/data/mission-operations-catalog/types";
export { centers, functions };
