import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/rockets-catalog/legacy-relations";
import { KIND_ENTITY_TYPE, type RocketKind, type RocketRecord } from "@/knowledge-graph/data/rockets-catalog/types";
import { families } from "@/knowledge-graph/data/rockets-catalog/data/families";
import { vehicles } from "@/knowledge-graph/data/rockets-catalog/data/vehicles";
import { stages } from "@/knowledge-graph/data/rockets-catalog/data/stages";
import { engines } from "@/knowledge-graph/data/rockets-catalog/data/engines";
import { propellants } from "@/knowledge-graph/data/rockets-catalog/data/propellants";
import { pads } from "@/knowledge-graph/data/rockets-catalog/data/pads";
import { providers } from "@/knowledge-graph/data/rockets-catalog/data/providers";
import { programs } from "@/knowledge-graph/data/rockets-catalog/data/programs";

/**
 * Rockets & Launch Vehicles catalog (Program V). The curated dataset enriches
 * existing graph entities (launch vehicles, agencies, launch sites, programs) and
 * creates the new ones (families, stages, engines, propellants, pads, commercial
 * providers), deriving typed relations (member_of_family, has_stage, powered_by,
 * uses_propellant, operated_by, launched_from, part_of_program, built_by,
 * derived_from, replaced_by, part_of). Cross-references resolve by slug; relations
 * that duplicate existing graph edges or whose endpoints don't resolve are
 * dropped. Nothing is fabricated — every technical figure is source-backed.
 */
export const ROCKET_RECORDS: RocketRecord[] = [
  ...families, ...vehicles, ...stages, ...engines, ...propellants, ...pads, ...providers, ...programs,
];

export const ROCKET_BY_ID = new Map(ROCKET_RECORDS.map((r) => [r.id, r]));
export const ROCKET_BY_SLUG = new Map(ROCKET_RECORDS.map((r) => [r.slug, r]));

/**
 * Existing graph entities referenced by catalogue slug but not (re)defined here —
 * the launch_site parents of pads. (Providers, existing vehicles, and programs are
 * all defined as `existing: true` records, so they resolve via ROCKET_BY_SLUG.)
 */
const EXTERNAL_SLUG_IDS: Record<string, string> = {
  "kennedy-space-center": "launch_site:kennedy-space-center",
  "cape-canaveral": "launch_site:cape-canaveral",
  vandenberg: "launch_site:vandenberg",
  baikonur: "launch_site:baikonur",
  "guiana-space-centre": "launch_site:guiana-space-centre",
  tanegashima: "launch_site:tanegashima",
  "satish-dhawan": "launch_site:satish-dhawan",
  jiuquan: "launch_site:jiuquan",
  taiyuan: "launch_site:taiyuan",
  xichang: "launch_site:xichang",
  wenchang: "launch_site:wenchang",
  starbase: "launch_site:starbase",
  wallops: "launch_site:wallops",
  plesetsk: "launch_site:plesetsk",
  alcantara: "launch_site:alcantara",
};

function resolve(slug: string | undefined): string | undefined {
  if (!slug) return undefined;
  return ROCKET_BY_SLUG.get(slug)?.id ?? EXTERNAL_SLUG_IDS[slug];
}

/* ----------------------------------------------------------- entities */

const newRecords = ROCKET_RECORDS.filter((r) => !r.existing);

export const entities: GraphEntity[] = newRecords.map((r) => ({
  id: r.id,
  type: r.id.slice(0, r.id.indexOf(":")) as EntityType,
  name: r.name,
  domain: "science" as const,
  entryPath: `/rockets/${r.slug}`,
  description: r.description,
  aliases: r.altNames,
  sources: r.sources,
}));

/* ----------------------------------------------------------- relations */

const derived: GraphRelation[] = [];
const seenRel = new Set<string>();
function add(from: string, type: RelationType, to: string | undefined, note?: string) {
  if (!from || !to || from === to) return;
  const id = `${from}|${type}|${to}`;
  if (LEGACY_RELATION_IDS.has(id) || seenRel.has(id)) return;
  seenRel.add(id);
  derived.push(rel(from, type, to, "confirmed", "science", note ? { note } : {}));
}

for (const r of ROCKET_RECORDS) {
  switch (r.kind) {
    case "vehicle":
      add(r.id, "member_of_family", resolve(r.familySlug));
      add(r.id, "operated_by", resolve(r.providerSlug));
      add(r.id, "built_by", resolve(r.builtBySlug));
      add(r.id, "part_of_program", resolve(r.programSlug));
      for (const p of r.padSlugs ?? []) add(r.id, "launched_from", resolve(p));
      for (const s of r.stageSlugs ?? []) add(r.id, "has_stage", resolve(s));
      for (const e of r.engineSlugs ?? []) add(r.id, "powered_by", resolve(e));
      add(r.id, "derived_from", resolve(r.derivedFromSlug));
      add(r.id, "replaced_by", resolve(r.succeededBySlug));
      for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
      break;
    case "family":
      add(r.id, "operated_by", resolve(r.providerSlug));
      break;
    case "stage":
      for (const e of r.engineSlugs ?? []) add(r.id, "powered_by", resolve(e));
      for (const p of r.propellantSlugs ?? []) add(r.id, "uses_propellant", resolve(p));
      add(r.id, "built_by", resolve(r.builtBySlug));
      break;
    case "engine":
      add(r.id, "built_by", resolve(r.builtBySlug));
      for (const p of r.propellantSlugs ?? []) add(r.id, "uses_propellant", resolve(p));
      for (const v of r.launchVehicleSlugs ?? []) add(resolve(v) ?? "", "powered_by", r.id);
      break;
    case "pad":
      add(r.id, "part_of", resolve(r.siteSlug));
      break;
    case "propellant":
    case "provider":
    case "program":
      break; // incoming edges only
  }
}

export const relations: GraphRelation[] = derived;

/* ----------------------------------------------------------- indexes & stats */

function group(key: (r: RocketRecord) => string | undefined) {
  const m = new Map<string, RocketRecord[]>();
  for (const r of ROCKET_RECORDS) {
    const k = key(r);
    if (!k) continue;
    (m.get(k) ?? m.set(k, []).get(k)!).push(r);
  }
  return m;
}

export const ROCKETS_BY_KIND = group((r) => r.kind);
export const ROCKETS_BY_FAMILY = group((r) => (r.kind === "vehicle" ? r.familySlug : undefined));

export const ROCKETS_STATS = {
  records: ROCKET_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  byKind: Object.fromEntries([...ROCKETS_BY_KIND.entries()].map(([k, v]) => [k, v.length])),
  launchVehicles: ROCKETS_BY_KIND.get("vehicle")?.length ?? 0,
  engines: ROCKETS_BY_KIND.get("engine")?.length ?? 0,
  families: ROCKETS_BY_KIND.get("family")?.length ?? 0,
} as const;

export function validateRockets(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const seenSlug = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const kinds = new Set(Object.keys(KIND_ENTITY_TYPE) as RocketKind[]);
  for (const r of ROCKET_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate rocket id: ${r.id}`);
    seenId.add(r.id);
    if (seenSlug.has(r.slug)) issues.push(`duplicate rocket slug: ${r.slug}`);
    seenSlug.add(r.slug);
    if (!ID.test(r.id)) issues.push(`bad rocket id: ${r.id}`);
    if (!kinds.has(r.kind)) issues.push(`${r.id}: unknown kind ${r.kind}`);
    if (!r.existing && r.id.slice(0, r.id.indexOf(":")) !== KIND_ENTITY_TYPE[r.kind]) {
      issues.push(`${r.id}: id prefix does not match kind ${r.kind}`);
    }
    if (!r.sources?.length) issues.push(`${r.id}: missing sources`);
    if (!r.description) issues.push(`${r.id}: missing description`);
    // No fabricated numbers: numeric specs, where present, must be finite; most
    // are non-negative, but geographic coordinates are range-checked instead.
    for (const [k, v] of Object.entries(r)) {
      if (typeof v !== "number") continue;
      if (!Number.isFinite(v)) issues.push(`${r.id}: non-finite numeric ${k}=${v}`);
      else if (k === "latitude") { if (v < -90 || v > 90) issues.push(`${r.id}: latitude out of range: ${v}`); }
      else if (k === "longitude") { if (v < -180 || v > 180) issues.push(`${r.id}: longitude out of range: ${v}`); }
      else if (v < 0) issues.push(`${r.id}: invalid numeric ${k}=${v}`);
    }
  }
  // Relation integrity: every referenced cross-reference slug must resolve to a
  // real id (a catalog record or a reused external entity). Catches typos and
  // dangling references before they reach the graph. (relatedKeys are full graph
  // ids validated later by validateGraph.)
  const strFields: (keyof RocketRecord)[] = ["familySlug", "providerSlug", "builtBySlug", "programSlug", "derivedFromSlug", "succeededBySlug", "siteSlug"];
  const arrFields: (keyof RocketRecord)[] = ["padSlugs", "stageSlugs", "engineSlugs", "propellantSlugs", "launchVehicleSlugs"];
  for (const r of ROCKET_RECORDS) {
    for (const f of strFields) {
      const slug = r[f] as string | undefined;
      if (slug && !resolve(slug)) issues.push(`${r.id}: unresolved ${String(f)} "${slug}"`);
    }
    for (const f of arrFields) {
      for (const slug of (r[f] as string[] | undefined) ?? []) if (!resolve(slug)) issues.push(`${r.id}: unresolved ${String(f)} "${slug}"`);
    }
  }
  // Every NEW entity must carry at least one relation (no isolated nodes).
  const connected = new Set<string>();
  for (const x of relations) {
    connected.add(x.from);
    connected.add(x.to);
  }
  for (const e of entities) if (!connected.has(e.id)) issues.push(`isolated new entity: ${e.id}`);
  return issues;
}
