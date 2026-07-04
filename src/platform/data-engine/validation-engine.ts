import { entities, relations, validateGraph } from "@/knowledge-graph";
import { validateEntries } from "@/content/entries";
import { validateImages } from "@/lib/media/registry";
import { validateCitations } from "@/lib/citations";
import { DATASETS, getDatasetEntities } from "@/lib/datasets";
import { validateCommunity, COMMUNITY_DATA } from "@/lib/community";
import { validateStarCatalog } from "@/knowledge-graph/data/star-catalog";
import { validateSolarSystem } from "@/knowledge-graph/data/solar-system-catalog";
import { validateDeepSky } from "@/knowledge-graph/data/deep-sky-catalog";
import { validateExploration } from "@/knowledge-graph/data/exploration-catalog";
import { validateRockets } from "@/knowledge-graph/data/rockets-catalog";
import { validateConstellations } from "@/knowledge-graph/data/constellations-catalog";
import { validateSatellites } from "@/knowledge-graph/data/satellites-catalog";
import { validateAsteroids } from "@/knowledge-graph/data/asteroids-catalog";
import { validateComets } from "@/knowledge-graph/data/comets-catalog";
import { validateMeteorites } from "@/knowledge-graph/data/meteorites-catalog";
import { validateInterstellarObjects } from "@/knowledge-graph/data/interstellar-catalog";
import { validateSmallBodyMissions } from "@/knowledge-graph/data/small-body-missions-catalog";
import { validateHumanSpaceflight } from "@/knowledge-graph/data/human-spaceflight-catalog";
import { validateObservatories } from "@/knowledge-graph/data/observatory-catalog";
import { validateExoplanets } from "@/knowledge-graph/data/exoplanet-catalog";
import { validateHistory } from "@/knowledge-graph/data/history-catalog";
import { validateCosmology } from "@/knowledge-graph/data/cosmology-catalog";
import { validateLiveSky } from "@/platform/live-sky";
import { validateImages as validateImageCatalog } from "@/platform/images";
import { validatePlatform } from "@/platform/validate";
import { QUERIES, UNSUPPORTED_QUERIES } from "@/platform/data-engine/query-engine";
import { traversalEngine } from "@/platform/data-engine/traversal-engine";
import { entityEngine } from "@/platform/data-engine/entity-engine";

/**
 * Validation Engine — the single validator. Every integrity check (graph,
 * entities, images, datasets, citations, platform/authority, and the engine
 * itself) runs through one interface, so callers never assemble validation by
 * hand. Pure: returns issue lists, never throws for data problems.
 */

export interface ValidationReport {
  category: string;
  issues: string[];
}

function datasetIntegrity(): string[] {
  const issues: string[] = [];
  const slugs = new Set<string>();
  for (const d of DATASETS) {
    if (slugs.has(d.slug)) issues.push(`duplicate dataset slug: ${d.slug}`);
    slugs.add(d.slug);
    const recomputed = getDatasetEntities(d).length;
    if (recomputed !== d.entityCount) {
      issues.push(`dataset ${d.slug}: entityCount ${d.entityCount} != recomputed ${recomputed}`);
    }
  }
  return issues;
}

function engineSelfCheck(): string[] {
  const issues: string[] = [];

  // Query ids unique, runnable, and disjoint from the unsupported list.
  const seen = new Set<string>();
  for (const q of QUERIES) {
    if (seen.has(q.id)) issues.push(`duplicate query id: ${q.id}`);
    seen.add(q.id);
    try {
      const r = q.run();
      if (!Array.isArray(r)) issues.push(`query ${q.id}: run() did not return an array`);
    } catch (e) {
      issues.push(`query ${q.id}: run() threw (${(e as Error).message})`);
    }
  }
  for (const u of UNSUPPORTED_QUERIES) {
    if (seen.has(u.id)) issues.push(`unsupported query ${u.id} collides with an implemented query`);
  }

  // Traversal: known start resolves, unknown start returns null, cycle-safe.
  const sample = entities[0]?.id;
  if (sample) {
    const t = traversalEngine.traverse(sample, { maxDepth: 2 });
    if (!t) issues.push(`traversal: failed to traverse known entity ${sample}`);
    else if (t.nodes[0]?.entity.id !== sample) issues.push("traversal: start node is not at distance 0");
  }
  if (traversalEngine.traverse("does-not-exist:nope") !== null) {
    issues.push("traversal: unknown start should return null");
  }

  // Entity engine resolves a known entity with an attached quality block.
  if (sample) {
    const resolved = entityEngine.resolve(sample);
    if (!resolved) issues.push(`entity engine: failed to resolve known entity ${sample}`);
    else if (!resolved.quality) issues.push(`entity engine: resolved ${sample} without a quality block`);
  }

  return issues;
}

export const validationEngine = {
  graph: (): string[] => validateGraph(entities, relations),
  entries: (): string[] => validateEntries(),
  images: (): string[] => validateImages(),
  citations: (): string[] => validateCitations(),
  datasets: datasetIntegrity,
  community: (): string[] => validateCommunity(COMMUNITY_DATA),
  stars: (): string[] => validateStarCatalog(),
  solar: (): string[] => validateSolarSystem(),
  deepSky: (): string[] => validateDeepSky(),
  exploration: (): string[] => validateExploration(),
  rockets: (): string[] => validateRockets(),
  constellations: (): string[] => validateConstellations(),
  satellites: (): string[] => validateSatellites(),
  asteroids: (): string[] => validateAsteroids(),
  comets: (): string[] => validateComets(),
  meteorites: (): string[] => validateMeteorites(),
  interstellarObjects: (): string[] => validateInterstellarObjects(),
  smallBodyMissions: (): string[] => validateSmallBodyMissions(),
  humanSpaceflight: (): string[] => validateHumanSpaceflight(),
  observatories: (): string[] => validateObservatories(),
  exoplanets: (): string[] => validateExoplanets(),
  history: (): string[] => validateHistory(),
  cosmology: (): string[] => validateCosmology(),
  liveSky: (): string[] => validateLiveSky(),
  imagesCatalog: (): string[] => validateImageCatalog(),
  platform: (): string[] => validatePlatform(),
  engine: engineSelfCheck,

  /** Every category, in dependency order. */
  all(): ValidationReport[] {
    return [
      { category: "graph", issues: this.graph() },
      { category: "entries", issues: this.entries() },
      { category: "images", issues: this.images() },
      { category: "citations", issues: this.citations() },
      { category: "datasets", issues: this.datasets() },
      { category: "community", issues: this.community() },
      { category: "stars", issues: this.stars() },
      { category: "solar", issues: this.solar() },
      { category: "deepSky", issues: this.deepSky() },
      { category: "exploration", issues: this.exploration() },
      { category: "rockets", issues: this.rockets() },
      { category: "constellations", issues: this.constellations() },
      { category: "satellites", issues: this.satellites() },
      { category: "asteroids", issues: this.asteroids() },
      { category: "comets", issues: this.comets() },
      { category: "meteorites", issues: this.meteorites() },
      { category: "interstellarObjects", issues: this.interstellarObjects() },
      { category: "smallBodyMissions", issues: this.smallBodyMissions() },
      { category: "humanSpaceflight", issues: this.humanSpaceflight() },
      { category: "observatories", issues: this.observatories() },
      { category: "exoplanets", issues: this.exoplanets() },
      { category: "history", issues: this.history() },
      { category: "cosmology", issues: this.cosmology() },
      { category: "liveSky", issues: this.liveSky() },
      { category: "imageCatalog", issues: this.imagesCatalog() },
      { category: "platform", issues: this.platform() },
      { category: "engine", issues: this.engine() },
    ];
  },

  isValid(): boolean {
    return this.all().every((r) => r.issues.length === 0);
  },
};
