import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/celestial-mechanics-catalog/legacy-relations";
import { KIND_ENTITY_TYPE, type MechanicsKind, type MechanicsRecord } from "@/knowledge-graph/data/celestial-mechanics-catalog/types";
import { dynamics } from "@/knowledge-graph/data/celestial-mechanics-catalog/data/dynamics";
import { frames } from "@/knowledge-graph/data/celestial-mechanics-catalog/data/frames";
import { ephemerides } from "@/knowledge-graph/data/celestial-mechanics-catalog/data/ephemerides";
import { timekeeping } from "@/knowledge-graph/data/celestial-mechanics-catalog/data/timekeeping";

/**
 * Celestial Mechanics & Timekeeping catalog (Program BE). It CREATES the orbital-mechanics concepts,
 * the reference frames, the ephemeris systems, and six additional time standards (with the existing
 * time-standard type), and links each to the REUSED gravitation theory, Kepler, JPL, the planets,
 * the Jupiter resonances, the TAI/UTC standards, the precession discovery, JWST, and parallax
 * (associated_with). It creates and duplicates nothing that already exists. Relations that duplicate
 * an existing edge or whose endpoints don't resolve are dropped. Nothing is fabricated.
 */

export const BE_RECORDS: MechanicsRecord[] = [...dynamics, ...frames, ...ephemerides, ...timekeeping];
export const BE_BY_ID = new Map(BE_RECORDS.map((r) => [r.id, r]));
export const BE_BY_SLUG = new Map(BE_RECORDS.map((r) => [r.slug, r]));

export function entryPathFor(r: Pick<MechanicsRecord, "slug">): string {
  return `/celestial-mechanics/${r.slug}`;
}

export const entities: GraphEntity[] = BE_RECORDS.filter((r) => !r.existing).map((r) => ({
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

for (const r of BE_RECORDS) {
  for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
}

export const relations: GraphRelation[] = derived;

export const BE_STATS = {
  records: BE_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  dynamics: dynamics.length,
  frames: frames.length,
  ephemerides: ephemerides.length,
  timekeeping: timekeeping.length,
} as const;

export function validateCelestialMechanics(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const kinds = new Set(Object.keys(KIND_ENTITY_TYPE) as MechanicsKind[]);
  const seenSlug = new Set<string>();
  const seenSlugByKind = new Map<MechanicsKind, Set<string>>();
  for (const r of BE_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate celestial-mechanics id: ${r.id}`);
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

export type { MechanicsRecord, MechanicsKind } from "@/knowledge-graph/data/celestial-mechanics-catalog/types";
export { KIND_ENTITY_TYPE, KIND_LABEL } from "@/knowledge-graph/data/celestial-mechanics-catalog/types";
export { dynamics, frames, ephemerides, timekeeping };
