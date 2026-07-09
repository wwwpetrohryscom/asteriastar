import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/exoplanet-science-catalog/legacy-relations";
import { KIND_ENTITY_TYPE, type CcKind, type CcRecord } from "@/knowledge-graph/data/exoplanet-science-catalog/types";
import { characterization } from "@/knowledge-graph/data/exoplanet-science-catalog/data/characterization";
import { atmospheres } from "@/knowledge-graph/data/exoplanet-science-catalog/data/atmospheres";
import { formation } from "@/knowledge-graph/data/exoplanet-science-catalog/data/formation";
import { missions } from "@/knowledge-graph/data/exoplanet-science-catalog/data/missions";

/**
 * Exoplanet Science & Characterization catalog (Program CC). It CREATES the atmospheric-characterization
 * methods (transmission & emission spectroscopy, the secondary eclipse, phase curves, atmospheric
 * retrieval, high-resolution cross-correlation spectroscopy, the Rossiter–McLaughlin effect), the
 * atmosphere concepts (clouds & hazes, thermal inversion, equilibrium temperature, atmospheric
 * metallicity & C/O), the planet-formation concepts (core accretion, disk instability, migration, the
 * snow line, pebble accretion) — all under one new exoplanet_science_concept type — plus the two absent
 * exoplanet missions Ariel and PLATO as proper space_telescope entities. It REUSES the eight detection
 * methods, the planetary classes, the habitable zone, the biosignatures, the atmospheric processes, the
 * protoplanetary disk, the spectroscopy technique, and JWST/Spitzer/Kepler/TESS/Roman/HWO/ELT/GMT/TMT
 * via relatedKeys. Only well-established science is stated; not-yet-launched missions are flagged and
 * nothing is fabricated.
 */

export const CC_RECORDS: CcRecord[] = [...characterization, ...atmospheres, ...formation, ...missions];
export const CC_BY_ID = new Map(CC_RECORDS.map((r) => [r.id, r]));
export const CC_BY_SLUG = new Map(CC_RECORDS.map((r) => [r.slug, r]));

export function entryPathFor(r: Pick<CcRecord, "slug">): string {
  return `/exoplanet-science/${r.slug}`;
}

export const entities: GraphEntity[] = CC_RECORDS.filter((r) => !r.existing).map((r) => ({
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

for (const r of CC_RECORDS) {
  for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
}

export const relations: GraphRelation[] = derived;

const KINDS: CcKind[] = ["characterization", "atmosphere", "formation", "mission"];

export const CC_STATS = {
  records: CC_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  byKind: Object.fromEntries(KINDS.map((k) => [k, CC_RECORDS.filter((r) => r.kind === k).length])) as Record<CcKind, number>,
} as const;

export function validateExoplanetScience(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const seenSlug = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const kinds = new Set(KINDS);
  for (const r of CC_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate exoplanet-science id: ${r.id}`);
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

export type { CcRecord, CcKind } from "@/knowledge-graph/data/exoplanet-science-catalog/types";
export { KIND_ENTITY_TYPE, KIND_LABEL } from "@/knowledge-graph/data/exoplanet-science-catalog/types";
export { characterization, atmospheres, formation, missions };
