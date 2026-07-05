import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/multi-messenger-catalog/legacy-relations";
import { KIND_ENTITY_TYPE, type MmKind, type MmRecord } from "@/knowledge-graph/data/multi-messenger-catalog/types";
import { facilities } from "@/knowledge-graph/data/multi-messenger-catalog/data/facilities";
import { detectionMethods } from "@/knowledge-graph/data/multi-messenger-catalog/data/detection";
import { sources } from "@/knowledge-graph/data/multi-messenger-catalog/data/sources";
import { alerts } from "@/knowledge-graph/data/multi-messenger-catalog/data/alerts";
import { channels } from "@/knowledge-graph/data/multi-messenger-catalog/data/channels";
import { followupStages, dataProducts } from "@/knowledge-graph/data/multi-messenger-catalog/data/workflow";

/**
 * Multi-Messenger & Gravitational-Wave Operations catalog (Program AZ). It CREATES the
 * gravitational-wave detectors still missing (with the existing observatory/mission-concept types), the
 * gravitational-wave detection methods, the compact-binary-merger source classes (existing
 * transient-class type), the SCiMMA and LVK alert systems (existing alert-system type), the
 * multi-messenger channels, the follow-up stages, and the data products, and links each to the
 * REUSED detectors, methods, transient classes, alert systems, and bands it uses (associated_with).
 * It creates and duplicates nothing that already exists. Relations that duplicate an existing edge
 * or whose endpoints don't resolve are dropped. Nothing is fabricated.
 */

export const AZ_RECORDS: MmRecord[] = [...facilities, ...detectionMethods, ...sources, ...alerts, ...channels, ...followupStages, ...dataProducts];
export const AZ_BY_ID = new Map(AZ_RECORDS.map((r) => [r.id, r]));
export const AZ_BY_SLUG = new Map(AZ_RECORDS.map((r) => [r.slug, r]));

export function entryPathFor(r: Pick<MmRecord, "slug">): string {
  return `/multi-messenger/${r.slug}`;
}

export const entities: GraphEntity[] = AZ_RECORDS.filter((r) => !r.existing).map((r) => ({
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

for (const r of AZ_RECORDS) {
  for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
}

export const relations: GraphRelation[] = derived;

export const AZ_STATS = {
  records: AZ_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  facilities: facilities.length,
  detectionMethods: detectionMethods.length,
  sources: sources.length,
  alerts: alerts.length,
  channels: channels.length,
  followupStages: followupStages.length,
  dataProducts: dataProducts.length,
} as const;

const FACILITY_TYPES = new Set<EntityType>(["observatory", "mission_concept"]);

export function validateMultiMessenger(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const kinds = new Set<MmKind>(["facility", "detection", "source", "alert", "channel", "stage", "product"]);
  const seenSlug = new Set<string>();
  const seenSlugByKind = new Map<MmKind, Set<string>>();
  for (const r of AZ_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate multi-messenger id: ${r.id}`);
    seenId.add(r.id);
    const ks = seenSlugByKind.get(r.kind) ?? seenSlugByKind.set(r.kind, new Set()).get(r.kind)!;
    if (ks.has(r.slug)) issues.push(`duplicate ${r.kind} slug: ${r.slug}`);
    ks.add(r.slug);
    if (seenSlug.has(r.slug)) issues.push(`duplicate slug across kinds: ${r.slug}`);
    seenSlug.add(r.slug);
    if (!ID.test(r.id)) issues.push(`bad id: ${r.id}`);
    if (!kinds.has(r.kind)) issues.push(`${r.id}: unknown kind ${r.kind}`);
    if (r.kind === "facility") {
      if (!r.facilityType || !FACILITY_TYPES.has(r.facilityType)) issues.push(`${r.id}: facility needs an observatory/mission_concept facilityType`);
      else if (r.id !== `${r.facilityType}:${r.slug}`) issues.push(`${r.id}: facility id does not match facilityType ${r.facilityType} / slug ${r.slug}`);
    } else {
      if (r.facilityType) issues.push(`${r.id}: facilityType only valid on a facility`);
      if (r.id !== `${KIND_ENTITY_TYPE[r.kind]}:${r.slug}`) issues.push(`${r.id}: id does not match kind ${r.kind} / slug ${r.slug}`);
    }
    if (!r.sources?.length) issues.push(`${r.id}: missing sources`);
    if (!r.description) issues.push(`${r.id}: missing description`);
    for (const k of r.relatedKeys ?? []) if (!ID.test(k)) issues.push(`${r.id}: malformed reference id "${k}"`);
  }
  const connected = new Set<string>();
  for (const x of relations) { connected.add(x.from); connected.add(x.to); }
  for (const e of entities) if (!connected.has(e.id)) issues.push(`isolated new entity: ${e.id}`);
  return issues;
}

export type { MmRecord, MmKind, FacilityType } from "@/knowledge-graph/data/multi-messenger-catalog/types";
export { KIND_ENTITY_TYPE, KIND_LABEL } from "@/knowledge-graph/data/multi-messenger-catalog/types";
export { facilities, detectionMethods, sources, alerts, channels, followupStages, dataProducts };
