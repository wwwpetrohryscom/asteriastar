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
import { coreRelations as rCore } from "@/knowledge-graph/data/core-relations";

/**
 * Ids of every relation defined OUTSIDE the galaxies catalog. The catalog dedupes its derived
 * relations against this so it enriches the graph without ever duplicating an existing edge —
 * most importantly any edges already touching the reused ocean-world moons, Mars, the
 * habitable-zone concept, the SETI Institute, and the life-search missions. Astrobiology is the
 * newest catalog and is appended last.
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
    ...rSmallBodyMissionsCatalog, ...rDeepSpaceCommsCatalog, ...rSpaceEnvironmentCatalog, ...rMissionOperationsCatalog, ...rSpacecraftSystemsCatalog, ...rInstrumentsCatalog, ...rPlanetaryGeologyCatalog, ...rInstitutionsCatalog, ...rSpaceflightHistoryCatalog, ...rSpaceMedicineCatalog, ...rSpaceInfrastructureCatalog, ...rFutureMissionsCatalog, ...rAstronomyMethodsCatalog, ...rTimeDomainCatalog, ...rGalaxiesCatalog, ...rCore,
  ].map((x) => x.id),
);
