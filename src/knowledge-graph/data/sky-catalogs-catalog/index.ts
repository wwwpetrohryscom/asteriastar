import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/sky-catalogs-catalog/legacy-relations";
import { KIND_ENTITY_TYPE, type CdKind, type CdRecord } from "@/knowledge-graph/data/sky-catalogs-catalog/types";
import { catalogs } from "@/knowledge-graph/data/sky-catalogs-catalog/data/catalogs";
import { families } from "@/knowledge-graph/data/sky-catalogs-catalog/data/families";
import { designations } from "@/knowledge-graph/data/sky-catalogs-catalog/data/designations";

/**
 * Astronomical Catalogs & Professional Sky Databases catalog (Program CD). It CREATES the professional
 * catalogues that were previously carried only as designation fields (Caldwell, Barnard, Sharpless,
 * Abell, PGC, UGC, Gliese, Tycho-2, SAO, GCVS, WDS, LHS, Wolf, the Bonner Durchmusterung) as first-class
 * `catalog` entities, the `catalog_family` groupings, and the stellar `designation_system` schemes
 * (Bayer, Flamsteed, variable-star naming). It REUSES the eleven existing catalogue entities (Messier,
 * NGC, IC, Henry Draper, Hipparcos, Gaia…), the data archives (CDS, SIMBAD, VizieR, NED), the compiling
 * astronomers, ESA, and the Gaia telescope via relatedKeys. Only well-established catalogue facts are
 * stated; unknown counts and epochs are left empty and nothing is fabricated.
 */

export const CD_RECORDS: CdRecord[] = [...catalogs, ...families, ...designations];
export const CD_BY_ID = new Map(CD_RECORDS.map((r) => [r.id, r]));
export const CD_BY_SLUG = new Map(CD_RECORDS.map((r) => [r.slug, r]));

export function entryPathFor(r: Pick<CdRecord, "slug">): string {
  return `/sky-catalogs/${r.slug}`;
}

export const entities: GraphEntity[] = CD_RECORDS.filter((r) => !r.existing).map((r) => ({
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

for (const r of CD_RECORDS) {
  for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
}

export const relations: GraphRelation[] = derived;

const KINDS: CdKind[] = ["catalog", "family", "designation"];

export const CD_STATS = {
  records: CD_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  byKind: Object.fromEntries(KINDS.map((k) => [k, CD_RECORDS.filter((r) => r.kind === k).length])) as Record<CdKind, number>,
} as const;

export function validateSkyCatalogs(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const seenSlug = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const kinds = new Set(KINDS);
  for (const r of CD_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate sky-catalog id: ${r.id}`);
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

export type { CdRecord, CdKind } from "@/knowledge-graph/data/sky-catalogs-catalog/types";
export { KIND_ENTITY_TYPE, KIND_LABEL } from "@/knowledge-graph/data/sky-catalogs-catalog/types";
export { catalogs, families, designations };
