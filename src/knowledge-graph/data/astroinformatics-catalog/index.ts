import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/astroinformatics-catalog/legacy-relations";
import { KIND_ENTITY_TYPE, type AstroinformaticsKind, type AstroinformaticsRecord } from "@/knowledge-graph/data/astroinformatics-catalog/types";
import { software } from "@/knowledge-graph/data/astroinformatics-catalog/data/software";
import { computing } from "@/knowledge-graph/data/astroinformatics-catalog/data/computing";
import { concepts } from "@/knowledge-graph/data/astroinformatics-catalog/data/concepts";

/**
 * Astroinformatics & Virtual Research Ecosystem catalog (Program BH). It CREATES the research-software
 * packages, the research-computing infrastructure, and the astroinformatics concepts, and links each
 * to the REUSED Virtual Observatory and TAP protocol, the FITS/VOTable standards, the archives, the
 * reproducibility/persistent-identifier/data-pipeline open-science practices, the machine-learning
 * methods, the Rubin Observatory, the LSST/SKA/Gaia surveys (associated_with). It creates and
 * duplicates nothing that already exists. Relations that duplicate an existing edge or whose
 * endpoints don't resolve are dropped. Nothing is fabricated.
 */

export const BH_RECORDS: AstroinformaticsRecord[] = [...software, ...computing, ...concepts];
export const BH_BY_ID = new Map(BH_RECORDS.map((r) => [r.id, r]));
export const BH_BY_SLUG = new Map(BH_RECORDS.map((r) => [r.slug, r]));

export function entryPathFor(r: Pick<AstroinformaticsRecord, "slug">): string {
  return `/astroinformatics/${r.slug}`;
}

export const entities: GraphEntity[] = BH_RECORDS.filter((r) => !r.existing).map((r) => ({
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

for (const r of BH_RECORDS) {
  for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
}

export const relations: GraphRelation[] = derived;

export const BH_STATS = {
  records: BH_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  software: software.length,
  computing: computing.length,
  concepts: concepts.length,
} as const;

export function validateAstroinformatics(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const kinds = new Set(Object.keys(KIND_ENTITY_TYPE) as AstroinformaticsKind[]);
  const seenSlug = new Set<string>();
  const seenSlugByKind = new Map<AstroinformaticsKind, Set<string>>();
  for (const r of BH_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate astroinformatics id: ${r.id}`);
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
    for (const k of r.relatedKeys ?? []) if (!ID.test(k)) issues.push(`${r.id}: malformed reference id "${k}"`);
  }
  const connected = new Set<string>();
  for (const x of relations) { connected.add(x.from); connected.add(x.to); }
  for (const e of entities) if (!connected.has(e.id)) issues.push(`isolated new entity: ${e.id}`);
  return issues;
}

export type { AstroinformaticsRecord, AstroinformaticsKind } from "@/knowledge-graph/data/astroinformatics-catalog/types";
export { KIND_ENTITY_TYPE, KIND_LABEL } from "@/knowledge-graph/data/astroinformatics-catalog/types";
export { software, computing, concepts };
