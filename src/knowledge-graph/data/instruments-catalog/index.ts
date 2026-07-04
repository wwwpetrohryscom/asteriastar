import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/instruments-catalog/legacy-relations";
import { KIND_ENTITY_TYPE, type InstKind, type InstRecord } from "@/knowledge-graph/data/instruments-catalog/types";
import { classes } from "@/knowledge-graph/data/instruments-catalog/data/classes";
import { instruments } from "@/knowledge-graph/data/instruments-catalog/data/instruments";

/**
 * Scientific Instruments & Payloads catalog (Program AH). It CREATES the instrument classes
 * and the new instruments, and ENRICHES the existing scientific_instrument entities (Mars,
 * JWST, Hubble, Juno, ground telescopes) by linking each to its instrument class — never
 * duplicating them. New instruments link to their reused host missions. Relations that
 * duplicate an existing edge or whose endpoints don't resolve are dropped. Nothing is
 * fabricated.
 */

/** Existing scientific_instrument entities enriched with their instrument class (reuse, not create). */
const REUSED_INSTRUMENT_CLASS: [string, string][] = [
  ["scientific_instrument:mastcam-z", "optical-camera"],
  ["scientific_instrument:supercam", "spectrometer"],
  ["scientific_instrument:chemcam", "spectrometer"],
  ["scientific_instrument:sam", "mass-spectrometer"],
  ["scientific_instrument:nircam", "optical-camera"],
  ["scientific_instrument:miri", "imaging-spectrometer"],
  ["scientific_instrument:nirspec", "spectrometer"],
  ["scientific_instrument:niriss", "spectrometer"],
  ["scientific_instrument:wfc3", "optical-camera"],
  ["scientific_instrument:acs", "optical-camera"],
  ["scientific_instrument:cos", "spectrometer"],
  ["scientific_instrument:stis", "spectrometer"],
  ["scientific_instrument:juno-microwave-radiometer", "radio-science"],
  ["scientific_instrument:hires", "spectrometer"],
  ["scientific_instrument:muse", "imaging-spectrometer"],
  ["scientific_instrument:sphere", "optical-camera"],
];

export const INST_RECORDS: InstRecord[] = [...classes, ...instruments];
export const INST_BY_ID = new Map(INST_RECORDS.map((r) => [r.id, r]));
export const INST_BY_SLUG = new Map(INST_RECORDS.map((r) => [r.slug, r]));
const CLASS_BY_SLUG = new Map(classes.map((r) => [r.slug, r]));
const rClass = (s?: string) => (s ? CLASS_BY_SLUG.get(s)?.id : undefined);

export function entryPathFor(r: Pick<InstRecord, "slug">): string {
  return `/instruments/${r.slug}`;
}

const newRecords = INST_RECORDS.filter((r) => !r.existing);

export const entities: GraphEntity[] = newRecords.map((r) => ({
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

for (const r of INST_RECORDS) {
  if (r.kind === "instrument") {
    add(r.id, "member_of_group", rClass(r.classSlug));
    for (const h of r.hostKeys ?? []) add(h, "contains_instrument", r.id);
    for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
  }
}
// Enrich the existing instruments with their class.
for (const [instId, classSlug] of REUSED_INSTRUMENT_CLASS) add(instId, "member_of_group", rClass(classSlug));

export const relations: GraphRelation[] = derived;

export const INST_STATS = {
  records: INST_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  classes: classes.length,
  newInstruments: instruments.length,
  reusedInstruments: REUSED_INSTRUMENT_CLASS.length,
} as const;

export function validateInstruments(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const kinds = new Set(Object.keys(KIND_ENTITY_TYPE) as InstKind[]);
  const seenSlug = new Set<string>();
  const seenSlugByKind = new Map<InstKind, Set<string>>();
  for (const r of INST_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate instrument id: ${r.id}`);
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
    if (r.kind === "instrument" && !rClass(r.classSlug)) issues.push(`${r.id}: unresolved classSlug "${r.classSlug}"`);
    for (const h of r.hostKeys ?? []) if (!h.startsWith("space_mission:") && !h.startsWith("space_telescope:") && !h.startsWith("spacecraft:")) issues.push(`${r.id}: host must be a mission/telescope/spacecraft id: "${h}"`);
    for (const k of [...(r.hostKeys ?? []), ...(r.relatedKeys ?? [])]) if (!ID.test(k)) issues.push(`${r.id}: malformed reference id "${k}"`);
  }
  // Reused enrichment ids must be well-formed and resolve to their class.
  const reusedSeen = new Set<string>();
  for (const [instId, classSlug] of REUSED_INSTRUMENT_CLASS) {
    if (!instId.startsWith("scientific_instrument:")) issues.push(`reused enrichment must be a scientific_instrument id: "${instId}"`);
    if (reusedSeen.has(instId)) issues.push(`duplicate reused enrichment: ${instId}`);
    reusedSeen.add(instId);
    if (!rClass(classSlug)) issues.push(`reused ${instId}: unresolved class "${classSlug}"`);
  }
  const connected = new Set<string>();
  for (const x of relations) { connected.add(x.from); connected.add(x.to); }
  for (const e of entities) if (!connected.has(e.id)) issues.push(`isolated new entity: ${e.id}`);
  return issues;
}

export type { InstRecord, InstKind, InstCategory } from "@/knowledge-graph/data/instruments-catalog/types";
export { KIND_ENTITY_TYPE, KIND_LABEL } from "@/knowledge-graph/data/instruments-catalog/types";
export { classes, instruments };
