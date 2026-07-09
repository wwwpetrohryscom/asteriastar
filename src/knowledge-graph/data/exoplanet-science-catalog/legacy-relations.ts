import { relations as rSolarSystem } from "@/knowledge-graph/data/solar-system";
import { relations as rStarsConst } from "@/knowledge-graph/data/stars-constellations";
import { relations as rDeepSky } from "@/knowledge-graph/data/deep-sky";
import { relations as rMissionsTelescopes } from "@/knowledge-graph/data/missions-telescopes";
import { relations as rSkyEvents } from "@/knowledge-graph/data/sky-events-mythology";
import { relations as rMessier } from "@/knowledge-graph/data/messier";
import { relations as rMoonsExtra } from "@/knowledge-graph/data/moons-extra";
import { relations as rAgenciesVehicles } from "@/knowledge-graph/data/agencies-vehicles";
import { relations as rObservatories } from "@/knowledge-graph/data/observatories-astronomers";
import { relations as rDeepSkyExtra } from "@/knowledge-graph/data/deep-sky-extra";
import { relations as rStarsExtra } from "@/knowledge-graph/data/stars-extra";
import { relations as rExoplanets } from "@/knowledge-graph/data/exoplanets-systems";
import { relations as rNotable } from "@/knowledge-graph/data/notable-objects";
import { relations as rCrossLinks } from "@/knowledge-graph/data/cross-links";
import { relations as rStarCatalog } from "@/knowledge-graph/data/star-catalog";
import { relations as rSolarCatalog } from "@/knowledge-graph/data/solar-system-catalog";
import { relations as rDeepSkyCatalog } from "@/knowledge-graph/data/deep-sky-catalog";
import { relations as rExploration } from "@/knowledge-graph/data/exploration-catalog";
import { relations as rHumanSpaceflight } from "@/knowledge-graph/data/human-spaceflight-catalog";
import { relations as rObservatoryCatalog } from "@/knowledge-graph/data/observatory-catalog";
import { relations as rExoplanetCatalog } from "@/knowledge-graph/data/exoplanet-catalog";
import { relations as rHistoryCatalog } from "@/knowledge-graph/data/history-catalog";
import { relations as rCosmologyCatalog } from "@/knowledge-graph/data/cosmology-catalog";
import { relations as rImageCatalog } from "@/knowledge-graph/data/image-catalog";
import { relations as rRocketsCatalog } from "@/knowledge-graph/data/rockets-catalog";
import { relations as rConstellationsCatalog } from "@/knowledge-graph/data/constellations-catalog";
import { relations as rSatellitesCatalog } from "@/knowledge-graph/data/satellites-catalog";
import { relations as rAsteroidsCatalog } from "@/knowledge-graph/data/asteroids-catalog";
import { relations as rCometsCatalog } from "@/knowledge-graph/data/comets-catalog";
import { relations as rMeteoritesCatalog } from "@/knowledge-graph/data/meteorites-catalog";
import { relations as rInterstellarCatalog } from "@/knowledge-graph/data/interstellar-catalog";
import { relations as rSmallBodyMissionsCatalog } from "@/knowledge-graph/data/small-body-missions-catalog";
import { relations as rDeepSpaceCommsCatalog } from "@/knowledge-graph/data/deep-space-comms-catalog";
import { relations as rSpaceEnvironmentCatalog } from "@/knowledge-graph/data/space-environment-catalog";
import { relations as rMissionOperationsCatalog } from "@/knowledge-graph/data/mission-operations-catalog";
import { relations as rSpacecraftSystemsCatalog } from "@/knowledge-graph/data/spacecraft-systems-catalog";
import { relations as rInstrumentsCatalog } from "@/knowledge-graph/data/instruments-catalog";
import { relations as rPlanetaryGeologyCatalog } from "@/knowledge-graph/data/planetary-geology-catalog";
import { relations as rInstitutionsCatalog } from "@/knowledge-graph/data/institutions-catalog";
import { relations as rSpaceflightHistoryCatalog } from "@/knowledge-graph/data/spaceflight-history-catalog";
import { relations as rSpaceMedicineCatalog } from "@/knowledge-graph/data/space-medicine-catalog";
import { relations as rSpaceInfrastructureCatalog } from "@/knowledge-graph/data/space-infrastructure-catalog";
import { relations as rFutureMissionsCatalog } from "@/knowledge-graph/data/future-missions-catalog";
import { relations as rAstronomyMethodsCatalog } from "@/knowledge-graph/data/astronomy-methods-catalog";
import { relations as rTimeDomainCatalog } from "@/knowledge-graph/data/time-domain-catalog";
import { relations as rGalaxiesCatalog } from "@/knowledge-graph/data/galaxies-catalog";
import { relations as rAstrobiologyCatalog } from "@/knowledge-graph/data/astrobiology-catalog";
import { relations as rPlanetaryDefenseCatalog } from "@/knowledge-graph/data/planetary-defense-catalog";
import { relations as rDataArchivesCatalog } from "@/knowledge-graph/data/data-archives-catalog";
import { relations as rObservatoryFrontierCatalog } from "@/knowledge-graph/data/observatory-frontier-catalog";
import { relations as rDistanceLadderCatalog } from "@/knowledge-graph/data/distance-ladder-catalog";
import { relations as rHeliophysicsCatalog } from "@/knowledge-graph/data/heliophysics-catalog";
import { relations as rAstroMlCatalog } from "@/knowledge-graph/data/astro-ml-catalog";
import { relations as rCitizenAstronomyCatalog } from "@/knowledge-graph/data/citizen-astronomy-catalog";
import { relations as rMultiMessengerCatalog } from "@/knowledge-graph/data/multi-messenger-catalog";
import { relations as rComparativePlanetologyCatalog } from "@/knowledge-graph/data/comparative-planetology-catalog";
import { relations as rAstrochemistryCatalog } from "@/knowledge-graph/data/astrochemistry-catalog";
import { relations as rSpacePolicyCatalog } from "@/knowledge-graph/data/space-policy-catalog";
import { relations as rDiscoveryHistoryCatalog } from "@/knowledge-graph/data/discovery-history-catalog";
import { relations as rCelestialMechanicsCatalog } from "@/knowledge-graph/data/celestial-mechanics-catalog";
import { relations as rStellarAstrophysicsCatalog } from "@/knowledge-graph/data/stellar-astrophysics-catalog";
import { relations as rGalacticAstronomyCatalog } from "@/knowledge-graph/data/galactic-astronomy-catalog";
import { relations as rAstroinformaticsCatalog } from "@/knowledge-graph/data/astroinformatics-catalog";
import { relations as rDeepSpaceExplorationCatalog } from "@/knowledge-graph/data/deep-space-exploration-catalog";
import { relations as rSkyAtlasCatalog } from "@/knowledge-graph/data/sky-atlas-catalog";
import { relations as rScientificCalculatorsCatalog } from "@/knowledge-graph/data/scientific-calculators-catalog";
import { relations as rObservingSuiteCatalog } from "@/knowledge-graph/data/observing-suite-catalog";
import { relations as rGraphExplorerCatalog } from "@/knowledge-graph/data/graph-explorer-catalog";
import { relations as rScientificAssistantCatalog } from "@/knowledge-graph/data/scientific-assistant-catalog";
import { relations as rLiveDataCatalog } from "@/knowledge-graph/data/live-data-catalog";
import { relations as rWebglUniverseCatalog } from "@/knowledge-graph/data/webgl-universe-catalog";
import { relations as rWorkspaceCatalog } from "@/knowledge-graph/data/workspace-catalog";
import { relations as rOpenPlatformCatalog } from "@/knowledge-graph/data/open-platform-catalog";
import { relations as rSolarPhysicsCatalog } from "@/knowledge-graph/data/solar-physics-catalog";
import { relations as rCompactObjectsCatalog } from "@/knowledge-graph/data/compact-objects-catalog";
import { relations as rFundamentalPhysicsCatalog } from "@/knowledge-graph/data/fundamental-physics-catalog";
import { relations as rSpaceEngineeringCatalog } from "@/knowledge-graph/data/space-engineering-catalog";
import { coreRelations as rCore } from "@/knowledge-graph/data/core-relations";

/**
 * Ids of every relation defined OUTSIDE the exoplanet-science catalog. The catalog dedupes its derived
 * relations against this so it enriches the graph without ever duplicating an existing edge — most
 * importantly any edges already touching the reused special/general relativity, spacetime, cosmic
 * inflation, dark matter/energy, the cosmological constant, the Standard Model, quantum gravity, the
 * neutrino method, IceCube, cosmic rays, and the Sun. Exoplanet-science is the newest catalog and is
 * appended last (after space-engineering).
 */
export const LEGACY_RELATION_IDS: ReadonlySet<string> = new Set(
  [
    ...rSolarSystem, ...rStarsConst, ...rDeepSky, ...rMissionsTelescopes, ...rSkyEvents,
    ...rMessier, ...rMoonsExtra, ...rAgenciesVehicles, ...rObservatories, ...rDeepSkyExtra,
    ...rStarsExtra, ...rExoplanets, ...rNotable, ...rCrossLinks, ...rStarCatalog,
    ...rSolarCatalog, ...rDeepSkyCatalog, ...rExploration, ...rHumanSpaceflight,
    ...rObservatoryCatalog, ...rExoplanetCatalog, ...rHistoryCatalog, ...rCosmologyCatalog,
    ...rImageCatalog, ...rRocketsCatalog, ...rConstellationsCatalog, ...rSatellitesCatalog,
    ...rAsteroidsCatalog, ...rCometsCatalog, ...rMeteoritesCatalog, ...rInterstellarCatalog,
    ...rSmallBodyMissionsCatalog, ...rDeepSpaceCommsCatalog, ...rSpaceEnvironmentCatalog, ...rMissionOperationsCatalog, ...rSpacecraftSystemsCatalog, ...rInstrumentsCatalog, ...rPlanetaryGeologyCatalog, ...rInstitutionsCatalog, ...rSpaceflightHistoryCatalog, ...rSpaceMedicineCatalog, ...rSpaceInfrastructureCatalog, ...rFutureMissionsCatalog, ...rAstronomyMethodsCatalog, ...rTimeDomainCatalog, ...rGalaxiesCatalog, ...rAstrobiologyCatalog, ...rPlanetaryDefenseCatalog, ...rDataArchivesCatalog, ...rObservatoryFrontierCatalog, ...rDistanceLadderCatalog, ...rHeliophysicsCatalog, ...rAstroMlCatalog, ...rCitizenAstronomyCatalog, ...rMultiMessengerCatalog, ...rComparativePlanetologyCatalog, ...rAstrochemistryCatalog, ...rSpacePolicyCatalog, ...rDiscoveryHistoryCatalog, ...rCelestialMechanicsCatalog, ...rStellarAstrophysicsCatalog, ...rGalacticAstronomyCatalog, ...rAstroinformaticsCatalog, ...rDeepSpaceExplorationCatalog, ...rSkyAtlasCatalog, ...rScientificCalculatorsCatalog, ...rObservingSuiteCatalog, ...rGraphExplorerCatalog, ...rScientificAssistantCatalog, ...rLiveDataCatalog, ...rWebglUniverseCatalog, ...rWorkspaceCatalog, ...rOpenPlatformCatalog, ...rSolarPhysicsCatalog, ...rCompactObjectsCatalog, ...rFundamentalPhysicsCatalog, ...rSpaceEngineeringCatalog, ...rCore,
  ].map((x) => x.id),
);
