import { rel, type EntityType, type GraphEntity, type GraphRelation, type RelationType } from "@/knowledge-graph/schema";
import { LEGACY_RELATION_IDS } from "@/knowledge-graph/data/webgl-universe-catalog/legacy-relations";
import type { UniverseSceneRecord, SceneCategory, CoverageMode } from "@/knowledge-graph/data/webgl-universe-catalog/types";
import { scenes } from "@/knowledge-graph/data/webgl-universe-catalog/data/scenes";

/**
 * Universe Engine catalog (Program BU). It CREATES the universe-scene entities — the interactive 3D /
 * Canvas scenes over the graph — and links each to the REUSED bodies, stars, constellations, galaxies
 * and galactic structures it renders, and to the "3D-ready" Sky Atlas view it completes. It reuses the
 * star, solar-system, constellation and galaxy engines and duplicates nothing. No position, distance
 * or coordinate is fabricated: a scene renders real geometry where it exists and is honestly
 * descriptive where the catalogue carries no numeric geometry.
 */

export const WU_RECORDS: UniverseSceneRecord[] = [...scenes];
export const WU_BY_ID = new Map(WU_RECORDS.map((r) => [r.id, r]));
export const WU_BY_SLUG = new Map(WU_RECORDS.map((r) => [r.slug, r]));

export function entryPathFor(r: Pick<UniverseSceneRecord, "slug">): string {
  return `/universe-3d/${r.slug}`;
}

export const entities: GraphEntity[] = WU_RECORDS.filter((r) => !r.existing).map((r) => ({
  id: r.id,
  type: "universe_scene" as EntityType,
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

for (const r of WU_RECORDS) {
  if (r.completesAtlasView) add(r.id, "associated_with", r.completesAtlasView);
  for (const k of r.relatedKeys ?? []) add(r.id, "associated_with", k);
}

export const relations: GraphRelation[] = derived;

const CATEGORIES: SceneCategory[] = ["solar-system", "stellar", "galactic", "extragalactic"];
const COVERAGE: CoverageMode[] = ["to-scale", "distance-true", "direction-only", "descriptive"];

/** Scene slugs that have a wired real-geometry builder in src/lib/universe-3d/scene-data.ts. Kept in
 *  lockstep with that module and the validate-entries.ts runtime gate; the validator cross-checks that a
 *  scene's `interactive` flag matches whether a real builder actually exists, so an interactive scene can
 *  never ship without a scene (a viewer-less page) and a buildable scene can never be mislabelled. */
const WU_BUILDER_SLUGS: ReadonlySet<string> = new Set(["solar-system", "stars", "constellations"]);

export const WU_STATS = {
  records: WU_RECORDS.length,
  newEntities: entities.length,
  relations: relations.length,
  byCategory: Object.fromEntries(CATEGORIES.map((c) => [c, WU_RECORDS.filter((r) => r.category === c).length])) as Record<SceneCategory, number>,
  byCoverage: Object.fromEntries(COVERAGE.map((c) => [c, WU_RECORDS.filter((r) => r.coverageMode === c).length])) as Record<CoverageMode, number>,
  interactive: WU_RECORDS.filter((r) => r.interactive).length,
} as const;

export function validateWebglUniverse(): string[] {
  const issues: string[] = [];
  const seenId = new Set<string>();
  const seenSlug = new Set<string>();
  const ID = /^[a-z_]+:[a-z0-9-]+$/;
  const cats = new Set(CATEGORIES);
  const covs = new Set(COVERAGE);
  for (const r of WU_RECORDS) {
    if (seenId.has(r.id)) issues.push(`duplicate scene id: ${r.id}`);
    seenId.add(r.id);
    if (seenSlug.has(r.slug)) issues.push(`duplicate scene slug: ${r.slug}`);
    seenSlug.add(r.slug);
    if (!ID.test(r.id)) issues.push(`bad id: ${r.id}`);
    if (r.id !== `universe_scene:${r.slug}`) issues.push(`${r.id}: id does not match slug ${r.slug}`);
    if (!cats.has(r.category)) issues.push(`${r.id}: unknown category ${r.category}`);
    if (!covs.has(r.coverageMode)) issues.push(`${r.id}: unknown coverageMode ${r.coverageMode}`);
    if (!r.sources?.length) issues.push(`${r.id}: missing sources`);
    if (!r.description) issues.push(`${r.id}: missing description`);
    if (!r.coordinateBasis) issues.push(`${r.id}: missing coordinateBasis (the honest statement of what drives the geometry)`);
    // Honesty: a scene that carries no numeric geometry (descriptive) must NOT claim to be interactive,
    // and must state its limitations. An interactive scene must rest on real geometry, never "descriptive".
    if (r.coverageMode === "descriptive" && r.interactive) issues.push(`${r.id}: descriptive scene must not be marked interactive (no fabricated geometry)`);
    // Distinct invariant: the interactive flag must match whether a real-geometry builder is actually wired.
    if (r.interactive !== WU_BUILDER_SLUGS.has(r.slug)) issues.push(`${r.id}: interactive=${r.interactive} but ${WU_BUILDER_SLUGS.has(r.slug) ? "a real-geometry builder is wired" : "no real-geometry builder is wired"} for slug "${r.slug}"`);
    if (r.coverageMode === "descriptive" && !r.limitations) issues.push(`${r.id}: descriptive scene must state its limitations`);
    if (r.completesAtlasView && !ID.test(r.completesAtlasView)) issues.push(`${r.id}: malformed completesAtlasView "${r.completesAtlasView}"`);
    for (const k of r.relatedKeys ?? []) if (!ID.test(k)) issues.push(`${r.id}: malformed reference id "${k}"`);
  }
  const connected = new Set<string>();
  for (const x of relations) { connected.add(x.from); connected.add(x.to); }
  for (const e of entities) if (!connected.has(e.id)) issues.push(`isolated new entity: ${e.id}`);
  return issues;
}

export type { UniverseSceneRecord, SceneCategory, CoverageMode } from "@/knowledge-graph/data/webgl-universe-catalog/types";
export { CATEGORY_LABEL, COVERAGE_LABEL } from "@/knowledge-graph/data/webgl-universe-catalog/types";
export { scenes };
