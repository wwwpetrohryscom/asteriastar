import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/fundamental-physics-catalog/legacy-relations";
import { KIND_ENTITY_TYPE, type PhysicsKind, type PhysicsRecord } from "@/knowledge-graph/data/fundamental-physics-catalog/types";
import { quantum } from "@/knowledge-graph/data/fundamental-physics-catalog/data/quantum";
import { particle } from "@/knowledge-graph/data/fundamental-physics-catalog/data/particle";
import { relativity } from "@/knowledge-graph/data/fundamental-physics-catalog/data/relativity";
import { cosmo } from "@/knowledge-graph/data/fundamental-physics-catalog/data/cosmo";

/**
 * Quantum & Fundamental Physics for Astronomy catalog (Program CA). It CREATES the quantum-mechanics
 * concepts, the particle-physics concepts, the additional relativity concepts, and the quantum-cosmology
 * concepts — all under a single new physics_concept type, grouped for discovery by kind. It REUSES the
 * physics already in the graph (special & general relativity, spacetime, cosmic inflation, dark matter,
 * dark energy, the cosmological constant, the Standard Model, quantum gravity, the neutrino method,
 * IceCube, cosmic rays, the CMB, Big Bang nucleosynthesis, the Sun and solar core) by pointing at those
 * entities via relatedKeys. Every statement is well-established physics framed by its astronomical
 * relevance; open problems are flagged as open, and nothing is fabricated.
 */

export const CA_RECORDS: PhysicsRecord[] = [...quantum, ...particle, ...relativity, ...cosmo];
export const CA_BY_ID = new Map(CA_RECORDS.map((r) => [r.id, r]));
export const CA_BY_SLUG = new Map(CA_RECORDS.map((r) => [r.slug, r]));

export function entryPathFor(r: Pick<PhysicsRecord, "slug">): string {
  return `/fundamental-physics/${r.slug}`;
}

export const entities: GraphEntity[] = CA_RECORDS.filter((r) => !r.existing).map((r) => ({
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

for (const r of CA_RECORDS) {
  for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
}

export const relations: GraphRelation[] = derived;

const KINDS: PhysicsKind[] = ["quantum", "particle", "relativity", "cosmo"];

export const CA_STATS = {
  records: CA_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  byKind: Object.fromEntries(KINDS.map((k) => [k, CA_RECORDS.filter((r) => r.kind === k).length])) as Record<PhysicsKind, number>,
} as const;

export function validateFundamentalPhysics(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const seenSlug = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const kinds = new Set(KINDS);
  for (const r of CA_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate fundamental-physics id: ${r.id}`);
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

export type { PhysicsRecord, PhysicsKind } from "@/knowledge-graph/data/fundamental-physics-catalog/types";
export { KIND_ENTITY_TYPE, KIND_LABEL } from "@/knowledge-graph/data/fundamental-physics-catalog/types";
export { quantum, particle, relativity, cosmo };
