import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/astrochemistry-catalog/legacy-relations";
import { KIND_ENTITY_TYPE, type ChemistryKind, type ChemistryRecord } from "@/knowledge-graph/data/astrochemistry-catalog/types";
import { environments } from "@/knowledge-graph/data/astrochemistry-catalog/data/environments";
import { molecules } from "@/knowledge-graph/data/astrochemistry-catalog/data/molecules";
import { processes } from "@/knowledge-graph/data/astrochemistry-catalog/data/processes";

/**
 * Astrochemistry & Molecular Universe catalog (Program BB). It CREATES the interstellar
 * environments, the interstellar molecules, and the astrochemical processes, and links each to the
 * REUSED spectroscopy method, ALMA and APEX, JWST, the Orion Nebula, the origins-of-life topic, the
 * Murchison and Allende meteorites, and the infrared/radio/submillimetre/ultraviolet bands it uses
 * (associated_with). It creates and duplicates nothing that already exists. Relations that duplicate
 * an existing edge or whose endpoints don't resolve are dropped. Nothing is fabricated.
 */

export const BB_RECORDS: ChemistryRecord[] = [...environments, ...molecules, ...processes];
export const BB_BY_ID = new Map(BB_RECORDS.map((r) => [r.id, r]));
export const BB_BY_SLUG = new Map(BB_RECORDS.map((r) => [r.slug, r]));

export function entryPathFor(r: Pick<ChemistryRecord, "slug">): string {
  return `/astrochemistry/${r.slug}`;
}

export const entities: GraphEntity[] = BB_RECORDS.filter((r) => !r.existing).map((r) => ({
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

for (const r of BB_RECORDS) {
  for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
}

export const relations: GraphRelation[] = derived;

export const BB_STATS = {
  records: BB_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  environments: environments.length,
  molecules: molecules.length,
  processes: processes.length,
} as const;

export function validateAstrochemistry(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const kinds = new Set(Object.keys(KIND_ENTITY_TYPE) as ChemistryKind[]);
  const seenSlug = new Set<string>();
  const seenSlugByKind = new Map<ChemistryKind, Set<string>>();
  for (const r of BB_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate astrochemistry id: ${r.id}`);
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
    if (r.kind !== "molecule" && r.formula) issues.push(`${r.id}: formula only valid on a molecule`);
    for (const k of r.relatedKeys ?? []) if (!ID.test(k)) issues.push(`${r.id}: malformed reference id "${k}"`);
  }
  const connected = new Set<string>();
  for (const x of relations) { connected.add(x.from); connected.add(x.to); }
  for (const e of entities) if (!connected.has(e.id)) issues.push(`isolated new entity: ${e.id}`);
  return issues;
}

export type { ChemistryRecord, ChemistryKind } from "@/knowledge-graph/data/astrochemistry-catalog/types";
export { KIND_ENTITY_TYPE, KIND_LABEL } from "@/knowledge-graph/data/astrochemistry-catalog/types";
export { environments, molecules, processes };
