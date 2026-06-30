import { rel, type GraphEntity, type GraphRelation, type EntityType } from "@/knowledge-graph/schema";
import { BODY_KIND_LABELS, type BodyRecord, type BodyKind } from "@/knowledge-graph/data/solar-system-catalog/types";
import { generatedBodies } from "@/knowledge-graph/data/solar-system-catalog/generated-bodies";
import { enrichmentBodies, newBodies } from "@/knowledge-graph/data/solar-system-catalog/curated";

/**
 * Solar System catalog. The typed BodyRecord dataset enriches existing graph
 * entities and creates entities/relations for new objects (missions, spacecraft,
 * surface features, and a few small bodies). Nothing is hardcoded into the graph;
 * everything derives from the dataset. All values are real.
 */

// Merge records by id (a body may appear in both the generated and curated sets,
// e.g. Pluto): later records fill/override fields, sources are unioned.
const merged = new Map<string, BodyRecord>();
for (const b of [...generatedBodies, ...enrichmentBodies, ...newBodies]) {
  const prev = merged.get(b.id);
  merged.set(b.id, prev ? { ...prev, ...b, sources: [...new Set([...prev.sources, ...b.sources])] } : b);
}
export const BODY_RECORDS: BodyRecord[] = [...merged.values()];
export const BODY_BY_ID = new Map(BODY_RECORDS.map((b) => [b.id, b]));

export function bodySlug(id: string): string {
  return id.slice(id.indexOf(":") + 1);
}
export const BODY_BY_SLUG = new Map(BODY_RECORDS.map((b) => [bodySlug(b.id), b]));

export const BODIES_BY_KIND = new Map<BodyKind, BodyRecord[]>();
for (const b of BODY_RECORDS) {
  const list = BODIES_BY_KIND.get(b.kind);
  if (list) list.push(b);
  else BODIES_BY_KIND.set(b.kind, [b]);
}

function entityTypeForKind(kind: BodyKind): EntityType {
  switch (kind) {
    case "planet": return "planet";
    case "dwarf-planet": return "dwarf_planet";
    case "moon": return "moon";
    case "asteroid": return "asteroid";
    case "comet": return "comet";
    case "mission": return "space_mission";
    case "spacecraft": return "spacecraft";
    case "surface-feature": return "surface_feature";
    case "star": return "star";
  }
}

function describe(b: BodyRecord): string {
  const parentName = b.parent ? BODY_BY_ID.get(b.parent)?.name ?? "the Sun" : undefined;
  switch (b.kind) {
    case "mission":
    case "spacecraft":
      return [b.classification ?? BODY_KIND_LABELS[b.kind], b.agency, b.launchYear ? `launched ${b.launchYear}` : null]
        .filter(Boolean).join(" · ") + ".";
    case "surface-feature":
      return `${b.classification ?? "Surface feature"}${parentName ? ` on ${parentName}` : ""}.`;
    case "asteroid":
    case "comet":
      return `${b.classification ?? BODY_KIND_LABELS[b.kind]}${b.designation ? ` — ${b.designation}` : ""}.`;
    default:
      return `${b.classification ?? BODY_KIND_LABELS[b.kind]}.`;
  }
}

const NEW_IDS = new Set(newBodies.map((b) => b.id));

const derivedEntities: GraphEntity[] = newBodies.map((b) => ({
  id: b.id,
  type: entityTypeForKind(b.kind),
  name: b.name,
  domain: "science" as const,
  entryPath: `/solar-system/${bodySlug(b.id)}`,
  description: describe(b),
  sources: b.sources,
  ...(b.designation ? { catalogNumbers: [b.designation] } : {}),
}));
export const entities: GraphEntity[] = derivedEntities;

const derivedRelations: GraphRelation[] = [];
for (const b of newBodies) {
  const src = b.sources;
  if (b.kind === "mission") {
    for (const t of b.targets ?? []) derivedRelations.push(rel(b.id, "target_of_mission", t, "confirmed", "science", { sources: src }));
  } else if (b.kind === "spacecraft") {
    if (b.partOfMission) derivedRelations.push(rel(b.id, "part_of_mission", b.partOfMission, "confirmed", "science", { sources: src }));
    for (const t of b.landedOn ?? []) derivedRelations.push(rel(b.id, "landed_on", t, "confirmed", "science", { sources: src }));
    if (b.parent) derivedRelations.push(rel(b.id, "located_on", b.parent, "confirmed", "science", { sources: src }));
  } else if (b.kind === "surface-feature") {
    if (b.parent) derivedRelations.push(rel(b.id, "located_on", b.parent, "confirmed", "science", { sources: src }));
  } else if ((b.kind === "asteroid" || b.kind === "comet") && b.parent) {
    derivedRelations.push(rel(b.id, "orbits", b.parent, "confirmed", "science", { sources: src }));
  }
}
export const relations: GraphRelation[] = derivedRelations;

export const SOLAR_SYSTEM_STATS = {
  bodies: BODY_RECORDS.length,
  newEntities: derivedEntities.length,
  relations: relations.length,
  byKind: Object.fromEntries([...BODIES_BY_KIND.entries()].map(([k, v]) => [k, v.length])),
} as const;

export function validateSolarSystem(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const seenSlug = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  for (const b of BODY_RECORDS) {
    if (seenId.has(b.id)) issues.push(`duplicate body id: ${b.id}`);
    seenId.add(b.id);
    if (!ID.test(b.id)) issues.push(`bad body id: ${b.id}`);
    const slug = bodySlug(b.id);
    if (seenSlug.has(slug)) issues.push(`duplicate body slug: ${slug} (${b.id})`);
    seenSlug.add(slug);
    if (!b.sources?.length) issues.push(`${b.id}: missing sources`);
    if (b.parent && !ID.test(b.parent)) issues.push(`${b.id}: bad parent ${b.parent}`);
  }
  // New entities must reference real relation endpoints (parent/targets exist as
  // a body record or are well-known existing ids handled by graph validation).
  return issues;
}

export { NEW_IDS };
