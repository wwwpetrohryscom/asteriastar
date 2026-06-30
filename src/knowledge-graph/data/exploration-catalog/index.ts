import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/exploration-catalog/legacy-relations";
import { KIND_ENTITY_TYPE, type ExplorationKind, type ExplorationRecord } from "@/knowledge-graph/data/exploration-catalog/types";
import { agencies } from "@/knowledge-graph/data/exploration-catalog/data/agencies";
import { programs } from "@/knowledge-graph/data/exploration-catalog/data/programs";
import { vehicles } from "@/knowledge-graph/data/exploration-catalog/data/vehicles";
import { sites } from "@/knowledge-graph/data/exploration-catalog/data/sites";
import { missions } from "@/knowledge-graph/data/exploration-catalog/data/missions";
import { spacecraft } from "@/knowledge-graph/data/exploration-catalog/data/spacecraft";
import { astronauts } from "@/knowledge-graph/data/exploration-catalog/data/astronauts";
import { instruments } from "@/knowledge-graph/data/exploration-catalog/data/instruments";

/**
 * Space-exploration catalog. The curated dataset enriches existing graph
 * entities and creates the rest, deriving typed relations (operated_by,
 * part_of_program, launched_by/from, mission_target, part_of_mission,
 * contains_instrument…). Cross-references resolve by slug; relations that
 * duplicate existing graph relations or whose endpoints don't resolve are
 * dropped — nothing is fabricated.
 */
export const EXPLORATION_RECORDS: ExplorationRecord[] = [
  ...agencies, ...programs, ...vehicles, ...sites, ...missions, ...spacecraft, ...astronauts, ...instruments,
];

export const EXPLORATION_BY_ID = new Map(EXPLORATION_RECORDS.map((r) => [r.id, r]));
export const EXPLORATION_BY_SLUG = new Map(EXPLORATION_RECORDS.map((r) => [r.slug, r]));

/** Existing graph entities referenced by slug but not (re)defined here. */
const EXTERNAL_SLUG_IDS: Record<string, string> = {
  spacex: "organization:spacex",
  arianespace: "organization:arianespace",
  ula: "organization:ula",
  jpl: "organization:jpl",
};

function resolve(slug: string | undefined): string | undefined {
  if (!slug) return undefined;
  return EXPLORATION_BY_SLUG.get(slug)?.id ?? EXTERNAL_SLUG_IDS[slug];
}

/* ----------------------------------------------------------- entities */

const newRecords = EXPLORATION_RECORDS.filter((r) => !r.existing);

export const entities: GraphEntity[] = newRecords.map((r) => ({
  id: r.id,
  type: r.id.slice(0, r.id.indexOf(":")) as EntityType,
  name: r.name,
  domain: "science" as const,
  entryPath: `/exploration/${r.slug}`,
  description: r.description,
  aliases: r.altNames,
  sources: r.sources,
}));

/* ----------------------------------------------------------- relations */

const derived: GraphRelation[] = [];
const seenRel = new Set<string>();
function add(from: string, type: RelationType, to: string | undefined, note?: string) {
  if (!to || from === to) return;
  const id = `${from}|${type}|${to}`;
  if (LEGACY_RELATION_IDS.has(id) || seenRel.has(id)) return;
  seenRel.add(id);
  derived.push(rel(from, type, to, "confirmed", "science", note ? { note } : {}));
}

for (const r of EXPLORATION_RECORDS) {
  const A = resolve(r.agencySlug);
  switch (r.kind) {
    case "mission":
      add(r.id, "operated_by", A);
      for (const p of r.partnerAgencySlugs ?? []) add(r.id, "operated_by", resolve(p), "Partner agency.");
      add(r.id, "part_of_program", resolve(r.programSlug));
      add(r.id, "launched_by", resolve(r.vehicleSlug));
      add(r.id, "launched_from", resolve(r.siteSlug));
      for (const t of r.targetKeys ?? []) add(r.id, "mission_target", t);
      for (const s of r.spacecraftSlugs ?? []) add(resolve(s) ?? "", "part_of_mission", r.id);
      for (const c of r.crewSlugs ?? []) add(resolve(c) ?? "", "part_of_mission", r.id);
      add(r.id, "preceded_by", resolve(r.precededBySlug));
      break;
    case "vehicle":
    case "site":
    case "program":
    case "spacecraft":
      add(r.id, "operated_by", resolve(r.operatorSlug) ?? A);
      break;
    case "astronaut":
      add(r.id, "associated_with", A);
      break;
    case "instrument":
      add(resolve(r.spacecraftSlugs?.[0]) ?? "", "contains_instrument", r.id);
      break;
  }
}

// Curated agency memberships (ESA member-state national agencies).
for (const member of ["dlr", "cnes", "asi", "uk-space-agency"]) {
  add(`organization:${member}`, "associated_with", "organization:esa", "ESA member-state agency.");
}

export const relations: GraphRelation[] = derived;

/* ----------------------------------------------------------- indexes & stats */

function group(key: (r: ExplorationRecord) => string | undefined) {
  const m = new Map<string, ExplorationRecord[]>();
  for (const r of EXPLORATION_RECORDS) {
    const k = key(r);
    if (!k) continue;
    (m.get(k) ?? m.set(k, []).get(k)!).push(r);
  }
  return m;
}

export const EXPLORATION_BY_KIND = group((r) => r.kind);
export const EXPLORATION_BY_AGENCY = group((r) => r.agencySlug);
export const EXPLORATION_BY_PROGRAM = group((r) => r.programSlug);

export const EXPLORATION_STATS = {
  records: EXPLORATION_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  byKind: Object.fromEntries([...EXPLORATION_BY_KIND.entries()].map(([k, v]) => [k, v.length])),
  missions: EXPLORATION_BY_KIND.get("mission")?.length ?? 0,
} as const;

export function validateExploration(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const seenSlug = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const kinds = new Set(Object.keys(KIND_ENTITY_TYPE) as ExplorationKind[]);
  for (const r of EXPLORATION_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate exploration id: ${r.id}`);
    seenId.add(r.id);
    if (seenSlug.has(r.slug)) issues.push(`duplicate exploration slug: ${r.slug}`);
    seenSlug.add(r.slug);
    if (!ID.test(r.id)) issues.push(`bad exploration id: ${r.id}`);
    if (!kinds.has(r.kind)) issues.push(`${r.id}: unknown kind ${r.kind}`);
    if (!r.existing && r.id.slice(0, r.id.indexOf(":")) !== KIND_ENTITY_TYPE[r.kind]) {
      issues.push(`${r.id}: id prefix does not match kind ${r.kind}`);
    }
    if (!r.sources?.length) issues.push(`${r.id}: missing sources`);
    if (!r.description) issues.push(`${r.id}: missing description`);
  }
  // Every NEW entity must carry at least one relation (no isolated nodes).
  const connected = new Set<string>();
  for (const x of relations) { connected.add(x.from); connected.add(x.to); }
  for (const e of entities) if (!connected.has(e.id)) issues.push(`isolated new entity: ${e.id}`);
  return issues;
}
