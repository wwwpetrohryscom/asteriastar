import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/stellar-astrophysics-catalog/legacy-relations";
import { KIND_ENTITY_TYPE, type StellarKind, type StellarRecord } from "@/knowledge-graph/data/stellar-astrophysics-catalog/types";
import { processes } from "@/knowledge-graph/data/stellar-astrophysics-catalog/data/processes";
import { nucleosynthesis } from "@/knowledge-graph/data/stellar-astrophysics-catalog/data/nucleosynthesis";
import { concepts } from "@/knowledge-graph/data/stellar-astrophysics-catalog/data/concepts";

/**
 * Stellar Astrophysics Deep-Dive catalog (Program BF). It CREATES the stellar processes, the
 * nucleosynthesis pathways, and the physics concepts, and links each to the REUSED stellar
 * end-states (white dwarf, neutron star, magnetar, black hole), the supernova/kilonova/variable
 * transient classes, the spectral-classification and asteroseismology methods, Big Bang
 * nucleosynthesis, the molecular-cloud environment, the Roche limit, Chandrasekhar, and real example
 * stars, clusters and nebulae (associated_with). It creates and duplicates nothing that already
 * exists. Relations that duplicate an existing edge or whose endpoints don't resolve are dropped.
 * Nothing is fabricated.
 */

export const BF_RECORDS: StellarRecord[] = [...processes, ...nucleosynthesis, ...concepts];
export const BF_BY_ID = new Map(BF_RECORDS.map((r) => [r.id, r]));
export const BF_BY_SLUG = new Map(BF_RECORDS.map((r) => [r.slug, r]));

export function entryPathFor(r: Pick<StellarRecord, "slug">): string {
  return `/stellar-astrophysics/${r.slug}`;
}

export const entities: GraphEntity[] = BF_RECORDS.filter((r) => !r.existing).map((r) => ({
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

for (const r of BF_RECORDS) {
  for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
}

export const relations: GraphRelation[] = derived;

export const BF_STATS = {
  records: BF_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  processes: processes.length,
  nucleosynthesis: nucleosynthesis.length,
  concepts: concepts.length,
} as const;

export function validateStellarAstrophysics(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const kinds = new Set(Object.keys(KIND_ENTITY_TYPE) as StellarKind[]);
  const seenSlug = new Set<string>();
  const seenSlugByKind = new Map<StellarKind, Set<string>>();
  for (const r of BF_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate stellar-astrophysics id: ${r.id}`);
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

export type { StellarRecord, StellarKind } from "@/knowledge-graph/data/stellar-astrophysics-catalog/types";
export { KIND_ENTITY_TYPE, KIND_LABEL } from "@/knowledge-graph/data/stellar-astrophysics-catalog/types";
export { processes, nucleosynthesis, concepts };
