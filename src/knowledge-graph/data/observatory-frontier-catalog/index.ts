import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/observatory-frontier-catalog/legacy-relations";
import { KIND_ENTITY_TYPE, type FrontierKind, type FrontierRecord } from "@/knowledge-graph/data/observatory-frontier-catalog/types";
import { facilities } from "@/knowledge-graph/data/observatory-frontier-catalog/data/facilities";
import { instruments } from "@/knowledge-graph/data/observatory-frontier-catalog/data/instruments";
import { detectors } from "@/knowledge-graph/data/observatory-frontier-catalog/data/detectors";
import { interferometryTechniques } from "@/knowledge-graph/data/observatory-frontier-catalog/data/interferometry";
import { techniques } from "@/knowledge-graph/data/observatory-frontier-catalog/data/techniques";

/**
 * Ground-Based Observatories & Instrumentation Frontier catalog (Program AU). It CREATES the three
 * next-generation facilities still missing from the graph (GMT, ngVLA, CTA — with the EXISTING
 * telescope/observatory types), the instrumentation techniques, the detector technologies, the
 * interferometry techniques, and the ground observing techniques, and links each to the REUSED
 * facilities, methods, instruments, organisations, and bands it uses (associated_with). It creates
 * and duplicates nothing that already exists. Relations that duplicate an existing edge or whose
 * endpoints don't resolve are dropped. Nothing is fabricated.
 */

export const AU_RECORDS: FrontierRecord[] = [...facilities, ...instruments, ...detectors, ...interferometryTechniques, ...techniques];
export const AU_BY_ID = new Map(AU_RECORDS.map((r) => [r.id, r]));
export const AU_BY_SLUG = new Map(AU_RECORDS.map((r) => [r.slug, r]));

export function entryPathFor(r: Pick<FrontierRecord, "slug">): string {
  return `/observatory-frontier/${r.slug}`;
}

export const entities: GraphEntity[] = AU_RECORDS.filter((r) => !r.existing).map((r) => ({
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

for (const r of AU_RECORDS) {
  for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
}

export const relations: GraphRelation[] = derived;

export const AU_STATS = {
  records: AU_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  facilities: facilities.length,
  instruments: instruments.length,
  detectors: detectors.length,
  interferometry: interferometryTechniques.length,
  techniques: techniques.length,
} as const;

const FACILITY_TYPES = new Set<EntityType>(["telescope", "observatory"]);

export function validateObservatoryFrontier(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const kinds = new Set<FrontierKind>(["facility", "instrument", "detector", "interferometry", "technique"]);
  const seenSlug = new Set<string>();
  const seenSlugByKind = new Map<FrontierKind, Set<string>>();
  for (const r of AU_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate observatory-frontier id: ${r.id}`);
    seenId.add(r.id);
    const ks = seenSlugByKind.get(r.kind) ?? seenSlugByKind.set(r.kind, new Set()).get(r.kind)!;
    if (ks.has(r.slug)) issues.push(`duplicate ${r.kind} slug: ${r.slug}`);
    ks.add(r.slug);
    if (seenSlug.has(r.slug)) issues.push(`duplicate slug across kinds: ${r.slug}`);
    seenSlug.add(r.slug);
    if (!ID.test(r.id)) issues.push(`bad id: ${r.id}`);
    if (!kinds.has(r.kind)) issues.push(`${r.id}: unknown kind ${r.kind}`);
    if (r.kind === "facility") {
      if (!r.facilityType || !FACILITY_TYPES.has(r.facilityType)) issues.push(`${r.id}: facility needs a telescope/observatory facilityType`);
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

export type { FrontierRecord, FrontierKind, FacilityType } from "@/knowledge-graph/data/observatory-frontier-catalog/types";
export { KIND_ENTITY_TYPE, KIND_LABEL } from "@/knowledge-graph/data/observatory-frontier-catalog/types";
export { facilities, instruments, detectors, interferometryTechniques, techniques };
