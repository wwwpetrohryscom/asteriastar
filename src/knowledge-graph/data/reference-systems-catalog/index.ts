import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/reference-systems-catalog/legacy-relations";
import { KIND_ENTITY_TYPE, type CfKind, type CfRecord } from "@/knowledge-graph/data/reference-systems-catalog/types";
import { coordinates } from "@/knowledge-graph/data/reference-systems-catalog/data/coordinates";
import { frames } from "@/knowledge-graph/data/reference-systems-catalog/data/frames";
import { effects } from "@/knowledge-graph/data/reference-systems-catalog/data/effects";
import { bodies } from "@/knowledge-graph/data/reference-systems-catalog/data/bodies";

/**
 * Astronomical Coordinates, Time & Reference Systems catalog (Program CF). It CREATES the coordinate
 * systems (RA, declination, and the equatorial/galactic/ecliptic/horizontal/supergalactic systems and the
 * celestial sphere) under a new `coordinate_system` type, the astrometric effects (precession, nutation,
 * aberration, refraction, light-time, Earth orientation) under a new `astrometric_effect` type, the
 * FK5/FK4/ICRF3 frames (existing `reference_frame` type), the Julian date (existing `time_standard` type),
 * and the IAU & IERS (existing `organization` type). It REUSES the existing frames (ICRS, BCRS, GCRS,
 * J2000, B1950, the ecliptic), the time scales (TAI, UTC, UT1, TT, TDB, GPS, sidereal, leap second), the
 * parallax and proper-motion methods, the ephemeris systems, Gaia and Hipparcos, and the astrometric
 * catalogues via relatedKeys. Only well-established, checkable definitions are stated; nothing is
 * fabricated.
 */

export const CF_RECORDS: CfRecord[] = [...coordinates, ...frames, ...effects, ...bodies];
export const CF_BY_ID = new Map(CF_RECORDS.map((r) => [r.id, r]));
export const CF_BY_SLUG = new Map(CF_RECORDS.map((r) => [r.slug, r]));

export function entryPathFor(r: Pick<CfRecord, "slug">): string {
  return `/reference-systems/${r.slug}`;
}

export const entities: GraphEntity[] = CF_RECORDS.filter((r) => !r.existing).map((r) => ({
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

for (const r of CF_RECORDS) {
  for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
}

export const relations: GraphRelation[] = derived;

const KINDS: CfKind[] = ["coordinate", "frame", "timescale", "effect", "body"];

export const CF_STATS = {
  records: CF_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  byKind: Object.fromEntries(KINDS.map((k) => [k, CF_RECORDS.filter((r) => r.kind === k).length])) as Record<CfKind, number>,
} as const;

export function validateReferenceSystems(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const seenSlug = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const kinds = new Set(KINDS);
  for (const r of CF_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate reference-system id: ${r.id}`);
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

export type { CfRecord, CfKind } from "@/knowledge-graph/data/reference-systems-catalog/types";
export { KIND_ENTITY_TYPE, KIND_LABEL } from "@/knowledge-graph/data/reference-systems-catalog/types";
export { coordinates, frames, effects, bodies };
