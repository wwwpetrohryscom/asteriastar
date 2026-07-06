/**
 * Scientific Data Engine — the execution layer of Asteria Star.
 *
 * The single, framework-independent way to resolve reality. Pure, deterministic,
 * composable, cacheable. No React, no Next.js, no UI imports — future CLI and API
 * compatible. Every consumer (website, mobile, API, SDK, AI, research tools)
 * reads through this engine; nothing reads raw graph files directly.
 *
 * Usage:
 *   import { engine } from "@/platform/data-engine";
 *   const mars = engine.entity.resolve("planet:mars");
 *   const path = engine.traversal.traverse("star:sirius", { maxDepth: 2 });
 *   const moons = engine.query.run("moons-of-jupiter");
 */
import { entityEngine } from "@/platform/data-engine/entity-engine";
import { relationshipEngine } from "@/platform/data-engine/relationship-engine";
import { traversalEngine } from "@/platform/data-engine/traversal-engine";
import { queryEngine } from "@/platform/data-engine/query-engine";
import { recommendationEngine } from "@/platform/data-engine/recommendation-engine";
import { timelineEngine } from "@/platform/data-engine/timeline-engine";
import { comparisonEngine } from "@/platform/data-engine/comparison-engine";
import { learningEngine } from "@/platform/data-engine/learning-engine";
import { discoveryEngine } from "@/platform/data-engine/discovery-engine";
import { metadataEngine } from "@/platform/data-engine/metadata-engine";
import { sourceEngine } from "@/platform/data-engine/source-engine";
import { citationEngine } from "@/platform/data-engine/citation-engine";
import { datasetEngine } from "@/platform/data-engine/dataset-engine";
import { authorityEngine } from "@/platform/data-engine/authority-engine";
import { localizationEngine } from "@/platform/data-engine/localization-engine";
import { starEngine } from "@/platform/data-engine/star-engine";
import { solarEngine } from "@/platform/data-engine/solar-engine";
import { deepSkyEngine } from "@/platform/data-engine/deepsky-engine";
import { explorationEngine } from "@/platform/data-engine/exploration-engine";
import { humanSpaceflightEngine } from "@/platform/data-engine/human-spaceflight-engine";
import { observatoryEngine } from "@/platform/data-engine/observatory-engine";
import { exoplanetEngine } from "@/platform/data-engine/exoplanet-engine";
import { historyEngine } from "@/platform/data-engine/history-engine";
import { cosmologyEngine } from "@/platform/data-engine/cosmology-engine";
import { liveSkyEngine } from "@/platform/data-engine/live-sky-engine";
import { imagesEngine } from "@/platform/data-engine/images-engine";
import { launchVehicleEngine } from "@/platform/data-engine/launch-vehicle-engine";
import { constellationEngine } from "@/platform/data-engine/constellation-engine";
import { satelliteEngine } from "@/platform/data-engine/satellite-engine";
import { asteroidEngine } from "@/platform/data-engine/asteroid-engine";
import { cometEngine } from "@/platform/data-engine/comet-engine";
import { meteoriteEngine } from "@/platform/data-engine/meteorite-engine";
import { interstellarEngine } from "@/platform/data-engine/interstellar-engine";
import { smallBodyMissionsEngine } from "@/platform/data-engine/small-body-missions-engine";
import { deepSpaceCommunicationsEngine } from "@/platform/data-engine/deep-space-comms-engine";
import { spaceEnvironmentEngine } from "@/platform/data-engine/space-environment-engine";
import { missionOperationsEngine } from "@/platform/data-engine/mission-operations-engine";
import { spacecraftSystemsEngine } from "@/platform/data-engine/spacecraft-systems-engine";
import { instrumentsEngine } from "@/platform/data-engine/instruments-engine";
import { institutionsEngine } from "@/platform/data-engine/institutions-engine";
import { spaceflightHistoryEngine } from "@/platform/data-engine/spaceflight-history-engine";
import { spaceMedicineEngine } from "@/platform/data-engine/space-medicine-engine";
import { spaceInfrastructureEngine } from "@/platform/data-engine/space-infrastructure-engine";
import { futureMissionsEngine } from "@/platform/data-engine/future-missions-engine";
import { astronomyMethodsEngine } from "@/platform/data-engine/astronomy-methods-engine";
import { timeDomainEngine } from "@/platform/data-engine/time-domain-engine";
import { galaxiesEngine } from "@/platform/data-engine/galaxies-engine";
import { astrobiologyEngine } from "@/platform/data-engine/astrobiology-engine";
import { planetaryDefenseEngine } from "@/platform/data-engine/planetary-defense-engine";
import { dataArchivesEngine } from "@/platform/data-engine/data-archives-engine";
import { observatoryFrontierEngine } from "@/platform/data-engine/observatory-frontier-engine";
import { distanceLadderEngine } from "@/platform/data-engine/distance-ladder-engine";
import { heliophysicsEngine } from "@/platform/data-engine/heliophysics-engine";
import { astroMlEngine } from "@/platform/data-engine/astro-ml-engine";
import { citizenAstronomyEngine } from "@/platform/data-engine/citizen-astronomy-engine";
import { multiMessengerEngine } from "@/platform/data-engine/multi-messenger-engine";
import { comparativePlanetologyEngine } from "@/platform/data-engine/comparative-planetology-engine";
import { astrochemistryEngine } from "@/platform/data-engine/astrochemistry-engine";
import { spacePolicyEngine } from "@/platform/data-engine/space-policy-engine";
import { discoveryHistoryEngine } from "@/platform/data-engine/discovery-history-engine";
import { celestialMechanicsEngine } from "@/platform/data-engine/celestial-mechanics-engine";
import { stellarAstrophysicsEngine } from "@/platform/data-engine/stellar-astrophysics-engine";
import { galacticAstronomyEngine } from "@/platform/data-engine/galactic-astronomy-engine";
import { astroinformaticsEngine } from "@/platform/data-engine/astroinformatics-engine";
import { deepSpaceExplorationEngine } from "@/platform/data-engine/deep-space-exploration-engine";
import { skyAtlasEngine } from "@/platform/data-engine/sky-atlas-engine";
import { scientificCalculatorsEngine } from "@/platform/data-engine/scientific-calculators-engine";
import { observingSuiteEngine } from "@/platform/data-engine/observing-suite-engine";
import { planetaryGeologyEngine } from "@/platform/data-engine/planetary-geology-engine";
import { validationEngine } from "@/platform/data-engine/validation-engine";
import { contributionsEngine } from "@/platform/contributions";

/** The unified engine surface — the forty-two modules of the data engine. */
export const engine = {
  entity: entityEngine,
  relationship: relationshipEngine,
  traversal: traversalEngine,
  query: queryEngine,
  recommendation: recommendationEngine,
  timeline: timelineEngine,
  comparison: comparisonEngine,
  learning: learningEngine,
  discovery: discoveryEngine,
  metadata: metadataEngine,
  source: sourceEngine,
  citation: citationEngine,
  dataset: datasetEngine,
  authority: authorityEngine,
  localization: localizationEngine,
  star: starEngine,
  solar: solarEngine,
  deepSky: deepSkyEngine,
  exploration: explorationEngine,
  humanSpaceflight: humanSpaceflightEngine,
  observatories: observatoryEngine,
  exoplanets: exoplanetEngine,
  history: historyEngine,
  cosmology: cosmologyEngine,
  liveSky: liveSkyEngine,
  images: imagesEngine,
  launchVehicles: launchVehicleEngine,
  constellations: constellationEngine,
  satellites: satelliteEngine,
  asteroids: asteroidEngine,
  comets: cometEngine,
  meteorites: meteoriteEngine,
  interstellarObjects: interstellarEngine,
  smallBodyMissions: smallBodyMissionsEngine,
  deepSpaceCommunications: deepSpaceCommunicationsEngine,
  spaceEnvironment: spaceEnvironmentEngine,
  missionOperations: missionOperationsEngine,
  spacecraftSystems: spacecraftSystemsEngine,
  instruments: instrumentsEngine,
  planetaryGeology: planetaryGeologyEngine,
  institutions: institutionsEngine,
  spaceflightHistory: spaceflightHistoryEngine,
  spaceMedicine: spaceMedicineEngine,
  spaceInfrastructure: spaceInfrastructureEngine,
  futureMissions: futureMissionsEngine,
  astronomyMethods: astronomyMethodsEngine,
  timeDomain: timeDomainEngine,
  galaxies: galaxiesEngine,
  astrobiology: astrobiologyEngine,
  planetaryDefense: planetaryDefenseEngine,
  dataArchives: dataArchivesEngine,
  observatoryFrontier: observatoryFrontierEngine,
  distanceLadder: distanceLadderEngine,
  heliophysics: heliophysicsEngine,
  astroMl: astroMlEngine,
  citizenAstronomy: citizenAstronomyEngine,
  multiMessenger: multiMessengerEngine,
  comparativePlanetology: comparativePlanetologyEngine,
  astrochemistry: astrochemistryEngine,
  spacePolicy: spacePolicyEngine,
  discoveryHistory: discoveryHistoryEngine,
  celestialMechanics: celestialMechanicsEngine,
  stellarAstrophysics: stellarAstrophysicsEngine,
  galacticAstronomy: galacticAstronomyEngine,
  astroinformatics: astroinformaticsEngine,
  deepSpaceExploration: deepSpaceExplorationEngine,
  skyAtlas: skyAtlasEngine,
  scientificCalculators: scientificCalculatorsEngine,
  observingSuite: observingSuiteEngine,
  contributions: contributionsEngine,
  validation: validationEngine,
} as const;

/** Names of the engine modules (for documentation/registry). */
export const ENGINE_MODULES = Object.keys(engine) as (keyof typeof engine)[];

// Named exports for direct use + types.
export { entityEngine, relationshipEngine, traversalEngine, queryEngine };
export { recommendationEngine, timelineEngine, comparisonEngine, learningEngine };
export { discoveryEngine, metadataEngine, sourceEngine, citationEngine };
export { datasetEngine, authorityEngine, localizationEngine, starEngine, solarEngine, deepSkyEngine, explorationEngine, humanSpaceflightEngine, observatoryEngine, exoplanetEngine, historyEngine, cosmologyEngine, liveSkyEngine, imagesEngine, launchVehicleEngine, constellationEngine, satelliteEngine, asteroidEngine, cometEngine, meteoriteEngine, interstellarEngine, smallBodyMissionsEngine, deepSpaceCommunicationsEngine, spaceEnvironmentEngine, missionOperationsEngine, spacecraftSystemsEngine, instrumentsEngine, planetaryGeologyEngine, institutionsEngine, spaceflightHistoryEngine, spaceMedicineEngine, spaceInfrastructureEngine, futureMissionsEngine, astronomyMethodsEngine, timeDomainEngine, galaxiesEngine, astrobiologyEngine, planetaryDefenseEngine, dataArchivesEngine, observatoryFrontierEngine, distanceLadderEngine, heliophysicsEngine, astroMlEngine, citizenAstronomyEngine, multiMessengerEngine, comparativePlanetologyEngine, astrochemistryEngine, spacePolicyEngine, discoveryHistoryEngine, celestialMechanicsEngine, stellarAstrophysicsEngine, galacticAstronomyEngine, astroinformaticsEngine, deepSpaceExplorationEngine, skyAtlasEngine, scientificCalculatorsEngine, observingSuiteEngine, contributionsEngine, validationEngine };
export type { ResolvedLaunchVehicle } from "@/platform/data-engine/launch-vehicle-engine";
export type { ResolvedConstellation } from "@/platform/data-engine/constellation-engine";
export type { ResolvedSatellite, ResolvedConstellationSat, ResolvedOperator, ResolvedOrbit, ResolvedNetwork, ResolvedProgram } from "@/platform/data-engine/satellite-engine";
export type { ResolvedAsteroid, ResolvedPopulation, ResolvedImpact, ResolvedPlanetaryDefense } from "@/platform/data-engine/asteroid-engine";
export type { ResolvedComet, ResolvedCometGroup } from "@/platform/data-engine/comet-engine";
export type { ResolvedMeteorite, ResolvedMeteoriteGroup, ResolvedFireball } from "@/platform/data-engine/meteorite-engine";
export type { ResolvedInterstellar, ResolvedTrajectoryClass, ResolvedMethod } from "@/platform/data-engine/interstellar-engine";
export type { ResolvedMission, ResolvedSample, ResolvedMissionClass } from "@/platform/data-engine/small-body-missions-engine";
export type { ResolvedDSNetwork, ResolvedStation, ResolvedInfra } from "@/platform/data-engine/deep-space-comms-engine";
export type { ResolvedEnv } from "@/platform/data-engine/space-environment-engine";
export type { ResolvedOps } from "@/platform/data-engine/mission-operations-engine";
export type { ResolvedSys } from "@/platform/data-engine/spacecraft-systems-engine";
export type { ResolvedInstrument } from "@/platform/data-engine/instruments-engine";
export type { ResolvedGeo } from "@/platform/data-engine/planetary-geology-engine";
export type { ResolvedInstitution } from "@/platform/data-engine/institutions-engine";
export type { ResolvedTimeline } from "@/platform/data-engine/spaceflight-history-engine";
export type { ResolvedMed } from "@/platform/data-engine/space-medicine-engine";
export type { ResolvedInfrastructure } from "@/platform/data-engine/space-infrastructure-engine";
export type { ResolvedConcept } from "@/platform/data-engine/future-missions-engine";
export type { ResolvedAstronomyMethod } from "@/platform/data-engine/astronomy-methods-engine";
export type { ResolvedTimeDomain } from "@/platform/data-engine/time-domain-engine";
export type { ResolvedExtragalactic } from "@/platform/data-engine/galaxies-engine";
export type { ResolvedAstrobiology } from "@/platform/data-engine/astrobiology-engine";
export type { ResolvedDefense } from "@/platform/data-engine/planetary-defense-engine";
export type { ResolvedArchive } from "@/platform/data-engine/data-archives-engine";
export type { ResolvedFrontier } from "@/platform/data-engine/observatory-frontier-engine";
export type { ResolvedDistance } from "@/platform/data-engine/distance-ladder-engine";
export type { ResolvedHeliophysics } from "@/platform/data-engine/heliophysics-engine";
export type { ResolvedAstroMl } from "@/platform/data-engine/astro-ml-engine";
export type { ResolvedCitizen } from "@/platform/data-engine/citizen-astronomy-engine";
export type { ResolvedMultiMessenger } from "@/platform/data-engine/multi-messenger-engine";
export type { ResolvedPlanetology } from "@/platform/data-engine/comparative-planetology-engine";
export type { ResolvedChemistry } from "@/platform/data-engine/astrochemistry-engine";
export type { ResolvedPolicy } from "@/platform/data-engine/space-policy-engine";
export type { ResolvedDiscoveryHistory } from "@/platform/data-engine/discovery-history-engine";
export type { ResolvedMechanics } from "@/platform/data-engine/celestial-mechanics-engine";
export type { ResolvedStellarPhysics } from "@/platform/data-engine/stellar-astrophysics-engine";
export type { ResolvedGalacticAstronomy } from "@/platform/data-engine/galactic-astronomy-engine";
export type { ResolvedAstroinformatics } from "@/platform/data-engine/astroinformatics-engine";
export type { ResolvedDeepSpaceExploration } from "@/platform/data-engine/deep-space-exploration-engine";
export type { ResolvedAtlas } from "@/platform/data-engine/sky-atlas-engine";
export type { ResolvedCalculator } from "@/platform/data-engine/scientific-calculators-engine";
export type { ResolvedObserving } from "@/platform/data-engine/observing-suite-engine";
export type { ResolvedStar } from "@/platform/data-engine/star-engine";
export type { ResolvedBody } from "@/platform/data-engine/solar-engine";
export type { ResolvedDeepSky } from "@/platform/data-engine/deepsky-engine";
export type { ResolvedExploration } from "@/platform/data-engine/exploration-engine";
export type { ResolvedHsf } from "@/platform/data-engine/human-spaceflight-engine";
export type { ResolvedObs } from "@/platform/data-engine/observatory-engine";
export type { ResolvedExo } from "@/platform/data-engine/exoplanet-engine";
export type { ResolvedHistory } from "@/platform/data-engine/history-engine";
export type { ResolvedCosmology } from "@/platform/data-engine/cosmology-engine";
export type { ResolvedSky } from "@/platform/data-engine/live-sky-engine";
export type { ResolvedImage } from "@/platform/data-engine/images-engine";

export type { ResolvedEntity } from "@/platform/data-engine/entity-engine";
export type {
  TraversalOptions,
  TraversalResult,
  TraversalNode,
  TraversalEdge,
  TraversalDomain,
} from "@/platform/data-engine/traversal-engine";
export type { ScientificQuery, QueryResult } from "@/platform/data-engine/query-engine";
export { QUERIES, UNSUPPORTED_QUERIES } from "@/platform/data-engine/query-engine";
export type { ValidationReport } from "@/platform/data-engine/validation-engine";
