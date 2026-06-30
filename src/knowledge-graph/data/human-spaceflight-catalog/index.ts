import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { HSF_LEGACY_RELATION_IDS } from "@/knowledge-graph/data/human-spaceflight-catalog/legacy-relations";
import { KIND_ENTITY_TYPE, type HsfKind, type HsfRecord } from "@/knowledge-graph/data/human-spaceflight-catalog/types";
import { stations } from "@/knowledge-graph/data/human-spaceflight-catalog/data/stations";
import { modules } from "@/knowledge-graph/data/human-spaceflight-catalog/data/modules";
import { spacecraft } from "@/knowledge-graph/data/human-spaceflight-catalog/data/spacecraft";
import { programs } from "@/knowledge-graph/data/human-spaceflight-catalog/data/programs";
import { astronauts } from "@/knowledge-graph/data/human-spaceflight-catalog/data/astronauts";
import { expeditions } from "@/knowledge-graph/data/human-spaceflight-catalog/data/expeditions";
import { evas } from "@/knowledge-graph/data/human-spaceflight-catalog/data/evas";
import { systems } from "@/knowledge-graph/data/human-spaceflight-catalog/data/systems";

/**
 * Human-spaceflight catalog. The curated dataset enriches existing entities
 * (the ISS, the reused programs and astronauts) and creates the rest, deriving
 * typed relations (part_of_station, operated_by, part_of_program, visited_station,
 * served_on_expedition, commanded_expedition, performed_eva, supported_by…).
 * Cross-references resolve by slug against the catalog and a small set of
 * existing graph entities; relations are deduped against every existing edge,
 * and unresolved endpoints are dropped. Real public facts only.
 */
export const HSF_RECORDS: HsfRecord[] = [
  ...stations, ...modules, ...spacecraft, ...programs, ...astronauts, ...expeditions, ...evas, ...systems,
];

export const HSF_BY_ID = new Map(HSF_RECORDS.map((r) => [r.id, r]));
export const HSF_BY_SLUG = new Map(HSF_RECORDS.map((r) => [r.slug, r]));

/** Existing graph entities referenced by slug but not (re)defined here. */
const EXTERNAL_SLUG_IDS: Record<string, string> = {
  nasa: "organization:nasa", roscosmos: "organization:roscosmos", esa: "organization:esa",
  jaxa: "organization:jaxa", csa: "organization:csa", cnsa: "organization:cnsa",
  "uk-space-agency": "organization:uk-space-agency", asi: "organization:asi", spacex: "organization:spacex",
  soyuz: "launch_vehicle:soyuz", "soyuz-program": "mission_program:soyuz-program",
  "neil-armstrong": "astronaut:neil-armstrong", "buzz-aldrin": "astronaut:buzz-aldrin",
  "alexei-leonov": "astronaut:alexei-leonov", "peggy-whitson": "astronaut:peggy-whitson",
  "voskhod-2": "space_mission:voskhod-2", "apollo-11": "space_mission:apollo-11",
};

function resolve(slug: string | undefined): string | undefined {
  if (!slug) return undefined;
  return HSF_BY_SLUG.get(slug)?.id ?? EXTERNAL_SLUG_IDS[slug];
}

/* ----------------------------------------------------------- entities */

const newRecords = HSF_RECORDS.filter((r) => !r.existing);

export const entities: GraphEntity[] = newRecords.map((r) => ({
  id: r.id,
  type: r.id.slice(0, r.id.indexOf(":")) as EntityType,
  name: r.name,
  domain: "science" as const,
  entryPath: `/human-spaceflight/${r.slug}`,
  description: r.description,
  aliases: r.altNames,
  sources: r.sources,
}));

/* ----------------------------------------------------------- relations */

const derived: GraphRelation[] = [];
const seen = new Set<string>();
function add(from: string | undefined, type: RelationType, to: string | undefined, note?: string) {
  if (!from || !to || from === to) return;
  const id = `${from}|${type}|${to}`;
  if (HSF_LEGACY_RELATION_IDS.has(id) || seen.has(id)) return;
  seen.add(id);
  derived.push(rel(from, type, to, "confirmed", "science", note ? { note } : {}));
}

for (const r of HSF_RECORDS) {
  const A = resolve(r.agencySlug);
  const station = resolve(r.stationSlug);
  switch (r.kind) {
    case "station":
      add(r.id, "operated_by", A);
      for (const p of r.partnerAgencySlugs ?? []) add(r.id, "operated_by", resolve(p), "Partner agency.");
      add(r.id, "part_of_program", resolve(r.programSlug));
      if (r.slug !== r.stationSlug) add(r.id, "attached_to", station); // e.g. Axiom → ISS
      add(r.id, "preceded_by", resolve(r.precededBySlug));
      break;
    case "module":
      add(r.id, "part_of_station", station);
      add(r.id, "operated_by", A);
      add(r.id, "built_by", resolve(r.builtBySlug));
      add(r.id, "preceded_by", resolve(r.precededBySlug));
      break;
    case "crew-vehicle":
    case "cargo-vehicle":
      add(r.id, "operated_by", A);
      for (const p of r.partnerAgencySlugs ?? []) add(r.id, "operated_by", resolve(p), "Partner agency.");
      add(r.id, "part_of_program", resolve(r.programSlug));
      add(r.id, "visited_station", station);
      break;
    case "program":
      add(r.id, "operated_by", A);
      break;
    case "astronaut":
      add(r.id, "associated_with", A);
      for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
      break;
    case "expedition":
      add(r.id, "part_of_station", station);
      add(r.id, "launched_by", resolve(r.launchVehicleSlug));
      add(resolve(r.commanderSlug), "commanded_expedition", r.id);
      for (const c of r.crewSlugs ?? []) add(resolve(c), "served_on_expedition", r.id);
      break;
    case "eva":
      for (const p of r.participantSlugs ?? []) add(resolve(p), "performed_eva", r.id);
      add(r.id, "part_of_mission", resolve(r.missionSlug));
      add(r.id, "part_of_station", station);
      add(r.id, "part_of_program", resolve(r.programSlug));
      break;
    case "docking-system":
      add(r.id, "attached_to", station);
      break;
    case "life-support":
      add(station, "supported_by", r.id);
      break;
    case "experiment":
    case "medicine":
      add(station, "supports_science", r.id);
      break;
  }
}

export const relations: GraphRelation[] = derived;

/* ----------------------------------------------------------- indexes & stats */

function group(key: (r: HsfRecord) => string | undefined) {
  const m = new Map<string, HsfRecord[]>();
  for (const r of HSF_RECORDS) {
    const k = key(r);
    if (!k) continue;
    (m.get(k) ?? m.set(k, []).get(k)!).push(r);
  }
  return m;
}

export const HSF_BY_KIND = group((r) => r.kind);

export const HSF_STATS = {
  records: HSF_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  byKind: Object.fromEntries([...HSF_BY_KIND.entries()].map(([k, v]) => [k, v.length])),
  stations: HSF_BY_KIND.get("station")?.length ?? 0,
} as const;

export function validateHumanSpaceflight(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const seenSlug = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const kinds = new Set(Object.keys(KIND_ENTITY_TYPE) as HsfKind[]);
  for (const r of HSF_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate hsf id: ${r.id}`);
    seenId.add(r.id);
    if (seenSlug.has(r.slug)) issues.push(`duplicate hsf slug: ${r.slug}`);
    seenSlug.add(r.slug);
    if (!ID.test(r.id)) issues.push(`bad hsf id: ${r.id}`);
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
