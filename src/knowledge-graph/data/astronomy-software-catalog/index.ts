import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/astronomy-software-catalog/legacy-relations";
import { KIND_ENTITY_TYPE, type ChKind, type ChRecord } from "@/knowledge-graph/data/astronomy-software-catalog/types";
import { desktop } from "@/knowledge-graph/data/astronomy-software-catalog/data/desktop";
import { capture } from "@/knowledge-graph/data/astronomy-software-catalog/data/capture";
import { scientific } from "@/knowledge-graph/data/astronomy-software-catalog/data/scientific";

/**
 * Astronomical Software Ecosystem catalog (Program CH). It CREATES the desktop planetarium and imaging/
 * acquisition applications as a new `astronomy_software` type (Stellarium, KStars, Celestia, Cartes du
 * Ciel, SkySafari, PixInsight, Siril, DeepSkyStacker, N.I.N.A., PHD2, ASCOM, INDI, Ekos), and the
 * scientific tools and libraries as `research_software` (the existing type — IRAF, CASA, TOPCAT, DS9,
 * Aladin, AstroImageJ, Montage, Skyfield, poliastro, Orekit). It REUSES the already-present Astropy and
 * Astroquery research software, the SPICE/JPL-Horizons/JPL-DE ephemeris systems, the data archives
 * and standards (VizieR, SIMBAD, MAST, CDS, FITS, VOTable, the Virtual Observatory), the observing
 * techniques, the observatories, and the equipment via relatedKeys. Only well-established facts (purpose,
 * platforms) are stated; version numbers are omitted and nothing is fabricated.
 */

export const CH_RECORDS: ChRecord[] = [...desktop, ...capture, ...scientific];
export const CH_BY_ID = new Map(CH_RECORDS.map((r) => [r.id, r]));
export const CH_BY_SLUG = new Map(CH_RECORDS.map((r) => [r.slug, r]));

export function entryPathFor(r: Pick<ChRecord, "slug">): string {
  return `/astronomy-software/${r.slug}`;
}

export const entities: GraphEntity[] = CH_RECORDS.filter((r) => !r.existing).map((r) => ({
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

for (const r of CH_RECORDS) {
  for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
}

export const relations: GraphRelation[] = derived;

const KINDS: ChKind[] = ["desktop", "imaging", "acquisition", "scientific", "library"];

export const CH_STATS = {
  records: CH_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  byKind: Object.fromEntries(KINDS.map((k) => [k, CH_RECORDS.filter((r) => r.kind === k).length])) as Record<ChKind, number>,
} as const;

export function validateAstronomySoftware(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const seenSlug = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const kinds = new Set(KINDS);
  for (const r of CH_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate astronomy-software id: ${r.id}`);
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

export type { ChRecord, ChKind } from "@/knowledge-graph/data/astronomy-software-catalog/types";
export { KIND_ENTITY_TYPE, KIND_LABEL } from "@/knowledge-graph/data/astronomy-software-catalog/types";
export { desktop, capture, scientific };
