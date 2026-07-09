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
import { validateDeepSpaceCommunications } from "@/knowledge-graph/data/deep-space-comms-catalog";
import { validateSpaceEnvironment } from "@/knowledge-graph/data/space-environment-catalog";
import { validateMissionOperations } from "@/knowledge-graph/data/mission-operations-catalog";
import { validateSpacecraftSystems } from "@/knowledge-graph/data/spacecraft-systems-catalog";
import { validateInstruments } from "@/knowledge-graph/data/instruments-catalog";
import { validatePlanetaryGeology } from "@/knowledge-graph/data/planetary-geology-catalog";
import { validateInstitutions } from "@/knowledge-graph/data/institutions-catalog";
import { validateSpaceflightHistory } from "@/knowledge-graph/data/spaceflight-history-catalog";
import { validateSpaceMedicine } from "@/knowledge-graph/data/space-medicine-catalog";
import { validateSpaceInfrastructure } from "@/knowledge-graph/data/space-infrastructure-catalog";
import { validateFutureMissions } from "@/knowledge-graph/data/future-missions-catalog";
import { validateAstronomyMethods } from "@/knowledge-graph/data/astronomy-methods-catalog";
import { validateTimeDomain } from "@/knowledge-graph/data/time-domain-catalog";
import { validateGalaxies } from "@/knowledge-graph/data/galaxies-catalog";
import { validateAstrobiology } from "@/knowledge-graph/data/astrobiology-catalog";
import { validatePlanetaryDefense } from "@/knowledge-graph/data/planetary-defense-catalog";
import { validateDataArchives } from "@/knowledge-graph/data/data-archives-catalog";
import { validateObservatoryFrontier } from "@/knowledge-graph/data/observatory-frontier-catalog";
import { validateDistanceLadder } from "@/knowledge-graph/data/distance-ladder-catalog";
import { validateHeliophysics } from "@/knowledge-graph/data/heliophysics-catalog";
import { validateAstroMl } from "@/knowledge-graph/data/astro-ml-catalog";
import { validateCitizenAstronomy } from "@/knowledge-graph/data/citizen-astronomy-catalog";
import { validateMultiMessenger } from "@/knowledge-graph/data/multi-messenger-catalog";
import { validateComparativePlanetology } from "@/knowledge-graph/data/comparative-planetology-catalog";
import { validateAstrochemistry } from "@/knowledge-graph/data/astrochemistry-catalog";
import { validateSpacePolicy } from "@/knowledge-graph/data/space-policy-catalog";
import { validateDiscoveryHistory } from "@/knowledge-graph/data/discovery-history-catalog";
import { validateCelestialMechanics } from "@/knowledge-graph/data/celestial-mechanics-catalog";
import { validateStellarAstrophysics } from "@/knowledge-graph/data/stellar-astrophysics-catalog";
import { validateGalacticAstronomy } from "@/knowledge-graph/data/galactic-astronomy-catalog";
import { validateAstroinformatics } from "@/knowledge-graph/data/astroinformatics-catalog";
import { validateDeepSpaceExploration } from "@/knowledge-graph/data/deep-space-exploration-catalog";
import { validateSkyAtlas } from "@/knowledge-graph/data/sky-atlas-catalog";
import { validateScientificCalculators } from "@/knowledge-graph/data/scientific-calculators-catalog";
import { validateObservingSuite } from "@/knowledge-graph/data/observing-suite-catalog";
import { validateGraphExplorer } from "@/knowledge-graph/data/graph-explorer-catalog";
import { validateScientificAssistant } from "@/knowledge-graph/data/scientific-assistant-catalog";
import { validateLiveData } from "@/knowledge-graph/data/live-data-catalog";
import { validateWebglUniverse } from "@/knowledge-graph/data/webgl-universe-catalog";
import { validateWorkspace } from "@/knowledge-graph/data/workspace-catalog";
import { validateOpenPlatform } from "@/knowledge-graph/data/open-platform-catalog";
import { validateSolarPhysics } from "@/knowledge-graph/data/solar-physics-catalog";
import { validateCompactObjects } from "@/knowledge-graph/data/compact-objects-catalog";
import { validateFundamentalPhysics } from "@/knowledge-graph/data/fundamental-physics-catalog";
import { validateSpaceEngineering } from "@/knowledge-graph/data/space-engineering-catalog";
import { validateExoplanetScience } from "@/knowledge-graph/data/exoplanet-science-catalog";
import { validateSkyCatalogs } from "@/knowledge-graph/data/sky-catalogs-catalog";
import { validateDeepSkyEncyclopedia } from "@/knowledge-graph/data/deep-sky-encyclopedia-catalog";
import { validateReferenceSystems } from "@/knowledge-graph/data/reference-systems-catalog";
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
  deepSpaceCommunications: (): string[] => validateDeepSpaceCommunications(),
  spaceEnvironment: (): string[] => validateSpaceEnvironment(),
  missionOperations: (): string[] => validateMissionOperations(),
  spacecraftSystems: (): string[] => validateSpacecraftSystems(),
  instruments: (): string[] => validateInstruments(),
  planetaryGeology: (): string[] => validatePlanetaryGeology(),
  institutions: (): string[] => validateInstitutions(),
  spaceflightHistory: (): string[] => validateSpaceflightHistory(),
  spaceMedicine: (): string[] => validateSpaceMedicine(),
  spaceInfrastructure: (): string[] => validateSpaceInfrastructure(),
  futureMissions: (): string[] => validateFutureMissions(),
  astronomyMethods: (): string[] => validateAstronomyMethods(),
  timeDomain: (): string[] => validateTimeDomain(),
  galaxies: (): string[] => validateGalaxies(),
  astrobiology: (): string[] => validateAstrobiology(),
  planetaryDefense: (): string[] => validatePlanetaryDefense(),
  dataArchives: (): string[] => validateDataArchives(),
  observatoryFrontier: (): string[] => validateObservatoryFrontier(),
  distanceLadder: (): string[] => validateDistanceLadder(),
  heliophysics: (): string[] => validateHeliophysics(),
  astroMl: (): string[] => validateAstroMl(),
  citizenAstronomy: (): string[] => validateCitizenAstronomy(),
  multiMessenger: (): string[] => validateMultiMessenger(),
  comparativePlanetology: (): string[] => validateComparativePlanetology(),
  astrochemistry: (): string[] => validateAstrochemistry(),
  spacePolicy: (): string[] => validateSpacePolicy(),
  discoveryHistory: (): string[] => validateDiscoveryHistory(),
  celestialMechanics: (): string[] => validateCelestialMechanics(),
  stellarAstrophysics: (): string[] => validateStellarAstrophysics(),
  galacticAstronomy: (): string[] => validateGalacticAstronomy(),
  astroinformatics: (): string[] => validateAstroinformatics(),
  deepSpaceExploration: (): string[] => validateDeepSpaceExploration(),
  skyAtlas: (): string[] => validateSkyAtlas(),
  scientificCalculators: (): string[] => validateScientificCalculators(),
  observingSuite: (): string[] => validateObservingSuite(),
  graphExplorer: (): string[] => validateGraphExplorer(),
  scientificAssistant: (): string[] => validateScientificAssistant(),
  liveScientificData: (): string[] => validateLiveData(),
  webglUniverse: (): string[] => validateWebglUniverse(),
  researchWorkspace: (): string[] => validateWorkspace(),
  openPlatform: (): string[] => validateOpenPlatform(),
  solarPhysics: (): string[] => validateSolarPhysics(),
  compactObjects: (): string[] => validateCompactObjects(),
  fundamentalPhysics: (): string[] => validateFundamentalPhysics(),
  spaceEngineering: (): string[] => validateSpaceEngineering(),
  exoplanetScience: (): string[] => validateExoplanetScience(),
  skyCatalogs: (): string[] => validateSkyCatalogs(),
  deepSkyEncyclopedia: (): string[] => validateDeepSkyEncyclopedia(),
  referenceSystems: (): string[] => validateReferenceSystems(),
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
      { category: "deepSpaceCommunications", issues: this.deepSpaceCommunications() },
      { category: "spaceEnvironment", issues: this.spaceEnvironment() },
      { category: "missionOperations", issues: this.missionOperations() },
      { category: "spacecraftSystems", issues: this.spacecraftSystems() },
      { category: "instruments", issues: this.instruments() },
      { category: "planetaryGeology", issues: this.planetaryGeology() },
      { category: "institutions", issues: this.institutions() },
      { category: "spaceflightHistory", issues: this.spaceflightHistory() },
      { category: "spaceMedicine", issues: this.spaceMedicine() },
      { category: "spaceInfrastructure", issues: this.spaceInfrastructure() },
      { category: "futureMissions", issues: this.futureMissions() },
      { category: "astronomyMethods", issues: this.astronomyMethods() },
      { category: "timeDomain", issues: this.timeDomain() },
      { category: "galaxies", issues: this.galaxies() },
      { category: "astrobiology", issues: this.astrobiology() },
      { category: "planetaryDefense", issues: this.planetaryDefense() },
      { category: "dataArchives", issues: this.dataArchives() },
      { category: "observatoryFrontier", issues: this.observatoryFrontier() },
      { category: "distanceLadder", issues: this.distanceLadder() },
      { category: "heliophysics", issues: this.heliophysics() },
      { category: "astroMl", issues: this.astroMl() },
      { category: "citizenAstronomy", issues: this.citizenAstronomy() },
      { category: "multiMessenger", issues: this.multiMessenger() },
      { category: "comparativePlanetology", issues: this.comparativePlanetology() },
      { category: "astrochemistry", issues: this.astrochemistry() },
      { category: "spacePolicy", issues: this.spacePolicy() },
      { category: "discoveryHistory", issues: this.discoveryHistory() },
      { category: "celestialMechanics", issues: this.celestialMechanics() },
      { category: "stellarAstrophysics", issues: this.stellarAstrophysics() },
      { category: "galacticAstronomy", issues: this.galacticAstronomy() },
      { category: "astroinformatics", issues: this.astroinformatics() },
      { category: "deepSpaceExploration", issues: this.deepSpaceExploration() },
      { category: "skyAtlas", issues: this.skyAtlas() },
      { category: "scientificCalculators", issues: this.scientificCalculators() },
      { category: "observingSuite", issues: this.observingSuite() },
      { category: "graphExplorer", issues: this.graphExplorer() },
      { category: "scientificAssistant", issues: this.scientificAssistant() },
      { category: "liveScientificData", issues: this.liveScientificData() },
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
