import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/space-engineering-catalog/legacy-relations";
import { KIND_ENTITY_TYPE, type EngKind, type EngRecord } from "@/knowledge-graph/data/space-engineering-catalog/types";
import { propulsion } from "@/knowledge-graph/data/space-engineering-catalog/data/propulsion";
import { performance } from "@/knowledge-graph/data/space-engineering-catalog/data/performance";
import { maneuvers } from "@/knowledge-graph/data/space-engineering-catalog/data/maneuvers";

/**
 * Space Engineering & Launch Systems Deep Dive catalog (Program CB). It CREATES the concept-and-method
 * layer that unifies the engineering hardware already in the graph — the propulsion *methods* (electric,
 * nuclear-electric, VASIMR, arcjet, resistojet, solar sail, mono/bipropellant, staged-combustion cycle),
 * the rocketry *principles* (the Tsiolkovsky rocket equation, specific impulse, thrust-to-weight, the
 * delta-v budget, staging, thrust vector control), and the flight *maneuvers* (orbital rendezvous,
 * station-keeping, aerobraking, aerocapture, gravity-turn ascent) — all under a single new
 * space_engineering_concept type, grouped for discovery by kind. It REUSES the rocket engines, stages and
 * propellants, the spacecraft subsystems and components, the docking and navigation systems, and the
 * operations functions by pointing at those entities via relatedKeys. Only well-established engineering
 * is stated; not-yet-flown technologies are flagged as such and nothing is fabricated.
 */

export const CB_RECORDS: EngRecord[] = [...propulsion, ...performance, ...maneuvers];
export const CB_BY_ID = new Map(CB_RECORDS.map((r) => [r.id, r]));
export const CB_BY_SLUG = new Map(CB_RECORDS.map((r) => [r.slug, r]));

export function entryPathFor(r: Pick<EngRecord, "slug">): string {
  return `/space-engineering/${r.slug}`;
}

export const entities: GraphEntity[] = CB_RECORDS.filter((r) => !r.existing).map((r) => ({
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

for (const r of CB_RECORDS) {
  for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
}

export const relations: GraphRelation[] = derived;

const KINDS: EngKind[] = ["propulsion", "performance", "maneuver"];

export const CB_STATS = {
  records: CB_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  byKind: Object.fromEntries(KINDS.map((k) => [k, CB_RECORDS.filter((r) => r.kind === k).length])) as Record<EngKind, number>,
} as const;

export function validateSpaceEngineering(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const seenSlug = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const kinds = new Set(KINDS);
  for (const r of CB_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate space-engineering id: ${r.id}`);
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

export type { EngRecord, EngKind } from "@/knowledge-graph/data/space-engineering-catalog/types";
export { KIND_ENTITY_TYPE, KIND_LABEL } from "@/knowledge-graph/data/space-engineering-catalog/types";
export { propulsion, performance, maneuvers };
