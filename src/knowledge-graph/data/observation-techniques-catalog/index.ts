import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/observation-techniques-catalog/legacy-relations";
import { KIND_ENTITY_TYPE, type CgKind, type CgRecord } from "@/knowledge-graph/data/observation-techniques-catalog/types";
import { techniques } from "@/knowledge-graph/data/observation-techniques-catalog/data/techniques";

/**
 * Professional Observation Techniques catalog (Program CG). It CREATES the everyday capture-to-image
 * observing techniques that were missing — visual astronomy, astrophotography and its planetary/deep-sky/
 * narrowband variants, autoguiding, the calibration frames, image processing and drizzle, plate solving,
 * and the imaging workflow — all as `observing_technique` entities (the existing type). It REUSES the
 * frontier techniques (lucky & speckle imaging, image stacking), the detectors (CCD/CMOS), adaptive
 * optics, and the measurement methods (photometry, spectroscopy, astrometry, calibration), the amateur
 * equipment and activities, the observing planners, and the telescopes via relatedKeys. No new
 * EntityType is introduced. Only well-established observing practice is stated; nothing is fabricated.
 */

export const CG_RECORDS: CgRecord[] = [...techniques];
export const CG_BY_ID = new Map(CG_RECORDS.map((r) => [r.id, r]));
export const CG_BY_SLUG = new Map(CG_RECORDS.map((r) => [r.slug, r]));

export function entryPathFor(r: Pick<CgRecord, "slug">): string {
  return `/observation-techniques/${r.slug}`;
}

export const entities: GraphEntity[] = CG_RECORDS.filter((r) => !r.existing).map((r) => ({
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

for (const r of CG_RECORDS) {
  for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
}

export const relations: GraphRelation[] = derived;

const KINDS: CgKind[] = ["visual", "imaging", "processing", "workflow"];

export const CG_STATS = {
  records: CG_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  byKind: Object.fromEntries(KINDS.map((k) => [k, CG_RECORDS.filter((r) => r.kind === k).length])) as Record<CgKind, number>,
} as const;

export function validateObservationTechniques(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const seenSlug = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const kinds = new Set(KINDS);
  for (const r of CG_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate observation-technique id: ${r.id}`);
    seenId.add(r.id);
    if (seenSlug.has(r.slug)) issues.push(`duplicate slug across kinds: ${r.slug}`);
    seenSlug.add(r.slug);
    if (!ID.test(r.id)) issues.push(`bad id: ${r.id}`);
    if (!kinds.has(r.kind)) issues.push(`${r.id}: unknown kind ${r.kind}`);
    if (r.id !== `${KIND_ENTITY_TYPE[r.kind]}:${r.slug}`) issues.push(`${r.id}: id does not match kind ${r.kind} / slug ${r.slug}`);
    if (!r.sources?.length) issues.push(`${r.id}: missing sources`);
    if (!r.description) issues.push(`${r.id}: missing description`);
    for (const k of r.relatedKeys ?? []) if (!ID.test(k)) issues.push(`${r.id}: malformed reference id "${k}"`);
  }
  const connected = new Set<string>();
  for (const x of relations) { connected.add(x.from); connected.add(x.to); }
  for (const e of entities) if (!connected.has(e.id)) issues.push(`isolated new entity: ${e.id}`);
  return issues;
}

export type { CgRecord, CgKind } from "@/knowledge-graph/data/observation-techniques-catalog/types";
export { KIND_ENTITY_TYPE, KIND_LABEL } from "@/knowledge-graph/data/observation-techniques-catalog/types";
export { techniques };
