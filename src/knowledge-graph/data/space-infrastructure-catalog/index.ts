import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/space-infrastructure-catalog/legacy-relations";
import { KIND_ENTITY_TYPE, type InfraKind, type InfraRecord } from "@/knowledge-graph/data/space-infrastructure-catalog/types";
import { domains } from "@/knowledge-graph/data/space-infrastructure-catalog/data/domains";
import { isruTechniques } from "@/knowledge-graph/data/space-infrastructure-catalog/data/isru";
import { manufacturingProcesses } from "@/knowledge-graph/data/space-infrastructure-catalog/data/manufacturing";
import { infrastructures } from "@/knowledge-graph/data/space-infrastructure-catalog/data/infrastructure";

/**
 * Space Manufacturing & In-Space Infrastructure catalog (Program AM). It CREATES the
 * infrastructure domains, the ISRU techniques, the manufacturing processes, and the
 * infrastructure systems, and links each to its domain (member_of_group) and to the REUSED
 * bodies, stations, propellants, and components it concerns (associated_with). It creates and
 * duplicates nothing that already exists. Relations that duplicate an existing edge or whose
 * endpoints don't resolve are dropped. Nothing is fabricated; maturity is stated honestly.
 */

export const INFRA_RECORDS: InfraRecord[] = [...domains, ...isruTechniques, ...manufacturingProcesses, ...infrastructures];
export const INFRA_BY_ID = new Map(INFRA_RECORDS.map((r) => [r.id, r]));
export const INFRA_BY_SLUG = new Map(INFRA_RECORDS.map((r) => [r.slug, r]));
const DOMAIN_BY_SLUG = new Map(domains.map((r) => [r.slug, r]));
const rDomain = (s?: string) => (s ? DOMAIN_BY_SLUG.get(s)?.id : undefined);

export function entryPathFor(r: Pick<InfraRecord, "slug">): string {
  return `/space-infrastructure/${r.slug}`;
}

export const entities: GraphEntity[] = INFRA_RECORDS.map((r) => ({
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

for (const r of INFRA_RECORDS) {
  if (r.kind === "domain") continue;
  add(r.id, "member_of_group", rDomain(r.domainSlug));
  for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
}

export const relations: GraphRelation[] = derived;

export const INFRA_STATS = {
  records: INFRA_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  domains: domains.length,
  isru: isruTechniques.length,
  manufacturing: manufacturingProcesses.length,
  infrastructure: infrastructures.length,
} as const;

export function validateSpaceInfrastructure(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const kinds = new Set(Object.keys(KIND_ENTITY_TYPE) as InfraKind[]);
  const MATURITIES = new Set(["operational", "demonstrated", "in-development", "planned", "concept", "theoretical"]);
  const seenSlug = new Set<string>();
  const seenSlugByKind = new Map<InfraKind, Set<string>>();
  for (const r of INFRA_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate infrastructure id: ${r.id}`);
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
    if (r.kind !== "domain") {
      if (!rDomain(r.domainSlug)) issues.push(`${r.id}: unresolved domainSlug "${r.domainSlug}"`);
      if (!r.maturity || !MATURITIES.has(r.maturity)) issues.push(`${r.id}: missing or invalid maturity`);
    }
    for (const k of r.relatedKeys ?? []) if (!ID.test(k)) issues.push(`${r.id}: malformed reference id "${k}"`);
  }
  const connected = new Set<string>();
  for (const x of relations) { connected.add(x.from); connected.add(x.to); }
  for (const e of entities) if (!connected.has(e.id)) issues.push(`isolated new entity: ${e.id}`);
  return issues;
}

export type { InfraRecord, InfraKind, InfraCategory, Maturity } from "@/knowledge-graph/data/space-infrastructure-catalog/types";
export { KIND_ENTITY_TYPE, KIND_LABEL, MATURITY_LABEL } from "@/knowledge-graph/data/space-infrastructure-catalog/types";
export { domains, isruTechniques, manufacturingProcesses, infrastructures };
