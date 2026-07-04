import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/spacecraft-systems-catalog/legacy-relations";
import { KIND_ENTITY_TYPE, type SysKind, type SysRecord } from "@/knowledge-graph/data/spacecraft-systems-catalog/types";
import { subsystems } from "@/knowledge-graph/data/spacecraft-systems-catalog/data/subsystems";
import { components } from "@/knowledge-graph/data/spacecraft-systems-catalog/data/components";

/**
 * Spacecraft Systems & Engineering catalog (Program AG). It CREATES the subsystem and
 * component entities and links components to their subsystems and to the REUSED docking
 * systems, life-support systems, antennas, and attitude sensors. Relations that duplicate
 * an existing edge or whose endpoints don't resolve are dropped. Nothing is fabricated.
 */
export const SYS_RECORDS: SysRecord[] = [...subsystems, ...components];
export const SYS_BY_ID = new Map(SYS_RECORDS.map((r) => [r.id, r]));
export const SYS_BY_SLUG = new Map(SYS_RECORDS.map((r) => [r.slug, r]));
const SUBSYSTEM_BY_SLUG = new Map(subsystems.map((r) => [r.slug, r]));
const rSubsystem = (s?: string) => (s ? SUBSYSTEM_BY_SLUG.get(s)?.id : undefined);

export function entryPathFor(r: Pick<SysRecord, "slug">): string {
  return `/spacecraft-systems/${r.slug}`;
}

export const entities: GraphEntity[] = SYS_RECORDS.map((r) => ({
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

for (const r of SYS_RECORDS) {
  if (r.kind === "component") add(r.id, "part_of", rSubsystem(r.subsystemSlug));
  for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
}

export const relations: GraphRelation[] = derived;

export const SYS_STATS = {
  records: SYS_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  subsystems: subsystems.length,
  components: components.length,
} as const;

export function validateSpacecraftSystems(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const kinds = new Set(Object.keys(KIND_ENTITY_TYPE) as SysKind[]);
  const seenSlug = new Set<string>();
  const seenSlugByKind = new Map<SysKind, Set<string>>();
  for (const r of SYS_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate systems id: ${r.id}`);
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
    if (r.kind === "component" && !rSubsystem(r.subsystemSlug)) issues.push(`${r.id}: unresolved subsystemSlug "${r.subsystemSlug}"`);
    if (r.kind === "subsystem" && r.subsystemSlug) issues.push(`${r.id}: a subsystem cannot have a parent subsystem`);
    for (const k of r.relatedKeys ?? []) if (!ID.test(k)) issues.push(`${r.id}: malformed reference id "${k}"`);
  }
  const connected = new Set<string>();
  for (const x of relations) { connected.add(x.from); connected.add(x.to); }
  for (const e of entities) if (!connected.has(e.id)) issues.push(`isolated new entity: ${e.id}`);
  return issues;
}

export type { SysRecord, SysKind, SysCategory } from "@/knowledge-graph/data/spacecraft-systems-catalog/types";
export { KIND_ENTITY_TYPE, KIND_LABEL } from "@/knowledge-graph/data/spacecraft-systems-catalog/types";
export { subsystems, components };
