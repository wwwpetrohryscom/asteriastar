import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/space-environment-catalog/legacy-relations";
import { KIND_ENTITY_TYPE, type EnvKind, type EnvRecord } from "@/knowledge-graph/data/space-environment-catalog/types";
import { phenomena, radiationEnvironments, hazards, indices } from "@/knowledge-graph/data/space-environment-catalog/data/environment";
import { monitors } from "@/knowledge-graph/data/space-environment-catalog/data/monitors";

/**
 * Space Environment & Hazards catalog (Program AE). It CREATES the space-weather, radiation,
 * hazard, and index entities (and the SOHO/SDO/ACE/DSCOVR monitoring missions and NOAA's
 * SWPC) and links them to the REUSED Sun, planets, moons, and solar missions. Relations
 * that duplicate an existing graph edge or whose endpoints don't resolve are dropped.
 * Nothing is fabricated — quantitative values are omitted when not reliably known.
 */
export const ENV_RECORDS: EnvRecord[] = [
  ...phenomena, ...radiationEnvironments, ...hazards, ...indices, ...monitors,
];

export const ENV_BY_ID = new Map(ENV_RECORDS.map((r) => [r.id, r]));

const byKind = (k: EnvKind | EnvKind[]) => {
  const kinds = Array.isArray(k) ? k : [k];
  return new Map(ENV_RECORDS.filter((r) => kinds.includes(r.kind)).map((r) => [r.slug, r]));
};
// The four hazard-layer kinds share the /space-environment/{slug} route.
export const ENTRY_BY_SLUG = byKind(["phenomenon", "radiation", "hazard", "index"]);

export function entryPathFor(r: Pick<EnvRecord, "kind" | "slug">): string | undefined {
  switch (r.kind) {
    case "phenomenon":
    case "radiation":
    case "hazard":
    case "index":
      return `/space-environment/${r.slug}`;
    case "monitor-mission":
    case "monitor-org":
      return undefined;
  }
}

const newRecords = ENV_RECORDS.filter((r) => !r.existing);

export const entities: GraphEntity[] = newRecords.map((r) => {
  const entryPath = entryPathFor(r);
  return {
    id: r.id,
    type: r.id.slice(0, r.id.indexOf(":")) as EntityType,
    name: r.name,
    domain: "science" as const,
    ...(entryPath ? { entryPath } : {}),
    description: r.description,
    aliases: r.altNames,
    sources: r.sources,
  };
});

const derived: GraphRelation[] = [];
const seenRel = new Set<string>();
function add(from: string | undefined, type: RelationType, to: string | undefined) {
  if (!from || !to || from === to) return;
  const id = `${from}|${type}|${to}`;
  if (LEGACY_RELATION_IDS.has(id) || seenRel.has(id)) return;
  seenRel.add(id);
  derived.push(rel(from, type, to, "confirmed", "science"));
}

for (const r of ENV_RECORDS) {
  switch (r.kind) {
    case "phenomenon":
    case "radiation":
    case "hazard":
    case "index":
      add(r.id, "part_of", r.partOfKey);
      for (const k of r.affectsKeys ?? []) add(r.id, "affects", k);
      for (const k of r.monitoredByKeys ?? []) add(r.id, "observed_by", k);
      add(r.id, "associated_with", r.originKey);
      for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
      break;
    case "monitor-mission":
    case "monitor-org":
      break; // incoming edges only
  }
}

export const relations: GraphRelation[] = derived;

function group(key: (r: EnvRecord) => string | undefined) {
  const m = new Map<string, EnvRecord[]>();
  for (const r of ENV_RECORDS) { const k = key(r); if (!k) continue; (m.get(k) ?? m.set(k, []).get(k)!).push(r); }
  return m;
}
export const ENV_BY_KIND = group((r) => r.kind);
export const ENV_BY_CATEGORY = group((r) => r.category);

export const ENV_STATS = {
  records: ENV_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  phenomena: ENV_BY_KIND.get("phenomenon")?.length ?? 0,
  radiation: ENV_BY_KIND.get("radiation")?.length ?? 0,
  hazards: ENV_BY_KIND.get("hazard")?.length ?? 0,
  indices: ENV_BY_KIND.get("index")?.length ?? 0,
  monitors: (ENV_BY_KIND.get("monitor-mission")?.length ?? 0) + (ENV_BY_KIND.get("monitor-org")?.length ?? 0),
} as const;

export function validateSpaceEnvironment(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const kinds = new Set(Object.keys(KIND_ENTITY_TYPE) as EnvKind[]);
  const seenSlugByKind = new Map<EnvKind, Set<string>>();
  const AFFECTS_OK = ["planet:", "moon:", "dwarf_planet:", "asteroid:", "space_mission:", "space_station:", "satellite:", "spacecraft:"];
  for (const r of ENV_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate env id: ${r.id}`);
    seenId.add(r.id);
    const ks = seenSlugByKind.get(r.kind) ?? seenSlugByKind.set(r.kind, new Set()).get(r.kind)!;
    if (ks.has(r.slug)) issues.push(`duplicate ${r.kind} slug: ${r.slug}`);
    ks.add(r.slug);
    if (!ID.test(r.id)) issues.push(`bad id: ${r.id}`);
    if (!kinds.has(r.kind)) issues.push(`${r.id}: unknown kind ${r.kind}`);
    if (r.id !== `${KIND_ENTITY_TYPE[r.kind]}:${r.slug}`) issues.push(`${r.id}: id does not match kind ${r.kind} / slug ${r.slug}`);
    if (!r.sources?.length) issues.push(`${r.id}: missing sources`);
    if (!r.description) issues.push(`${r.id}: missing description`);
    for (const k of [r.partOfKey, r.originKey, ...(r.affectsKeys ?? []), ...(r.monitoredByKeys ?? []), ...(r.relatedKeys ?? [])].filter(Boolean) as string[]) {
      if (!ID.test(k)) issues.push(`${r.id}: malformed reference id "${k}"`);
    }
    // A hazard/phenomenon can only affect a body or a spacecraft.
    for (const k of r.affectsKeys ?? []) if (!AFFECTS_OK.some((p) => k.startsWith(p))) issues.push(`${r.id}: affects target must be a body or spacecraft: "${k}"`);
    // Monitors must be a mission or organization.
    for (const k of r.monitoredByKeys ?? []) if (!k.startsWith("space_mission:") && !k.startsWith("organization:")) issues.push(`${r.id}: monitoredBy must be a space_mission/organization id: "${k}"`);
  }
  // Cross-kind slug uniqueness across the four route-sharing kinds.
  const entrySlugs = new Set<string>();
  for (const r of ENV_RECORDS) {
    if (!["phenomenon", "radiation", "hazard", "index"].includes(r.kind)) continue;
    if (entrySlugs.has(r.slug)) issues.push(`duplicate entry slug across kinds: ${r.slug}`);
    entrySlugs.add(r.slug);
  }
  const connected = new Set<string>();
  for (const x of relations) { connected.add(x.from); connected.add(x.to); }
  for (const e of entities) if (!connected.has(e.id)) issues.push(`isolated new entity: ${e.id}`);
  return issues;
}

export type { EnvRecord, EnvKind, EnvCategory } from "@/knowledge-graph/data/space-environment-catalog/types";
export { KIND_ENTITY_TYPE, KIND_LABEL } from "@/knowledge-graph/data/space-environment-catalog/types";
export { phenomena, radiationEnvironments, hazards, indices, monitors };
