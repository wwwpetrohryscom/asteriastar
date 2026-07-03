import type { GraphRelation } from "@/knowledge-graph/schema";
import { relations as solarSystem } from "@/knowledge-graph/data/solar-system";
import { relations as starsConstellations } from "@/knowledge-graph/data/stars-constellations";
import { relations as deepSky } from "@/knowledge-graph/data/deep-sky";
import { relations as missionsTelescopes } from "@/knowledge-graph/data/missions-telescopes";
import { relations as skyEventsMythology } from "@/knowledge-graph/data/sky-events-mythology";
import { relations as messier } from "@/knowledge-graph/data/messier";
import { relations as moonsExtra } from "@/knowledge-graph/data/moons-extra";
import { relations as agenciesVehicles } from "@/knowledge-graph/data/agencies-vehicles";
import { relations as observatoriesAstronomers } from "@/knowledge-graph/data/observatories-astronomers";
import { relations as deepSkyExtra } from "@/knowledge-graph/data/deep-sky-extra";
import { relations as starsExtra } from "@/knowledge-graph/data/stars-extra";
import { relations as exoplanetsSystems } from "@/knowledge-graph/data/exoplanets-systems";
import { relations as notableObjects } from "@/knowledge-graph/data/notable-objects";
import { relations as crossLinks } from "@/knowledge-graph/data/cross-links";
import { relations as starCatalog } from "@/knowledge-graph/data/star-catalog";
import { relations as solarSystemCatalog } from "@/knowledge-graph/data/solar-system-catalog";
import { relations as deepSkyCatalog } from "@/knowledge-graph/data/deep-sky-catalog";
import { relations as explorationCatalog } from "@/knowledge-graph/data/exploration-catalog";
import { relations as humanSpaceflightCatalog } from "@/knowledge-graph/data/human-spaceflight-catalog";
import { relations as observatoryCatalog } from "@/knowledge-graph/data/observatory-catalog";
import { relations as exoplanetCatalog } from "@/knowledge-graph/data/exoplanet-catalog";
import { relations as historyCatalog } from "@/knowledge-graph/data/history-catalog";
import { relations as cosmologyCatalog } from "@/knowledge-graph/data/cosmology-catalog";
import { relations as imageCatalog } from "@/knowledge-graph/data/image-catalog";
import { relations as rocketsCatalog } from "@/knowledge-graph/data/rockets-catalog";
import { relations as constellationsCatalog } from "@/knowledge-graph/data/constellations-catalog";
import { relations as satellitesCatalog } from "@/knowledge-graph/data/satellites-catalog";
import { relations as asteroidsCatalog } from "@/knowledge-graph/data/asteroids-catalog";
import { relations as cometsCatalog } from "@/knowledge-graph/data/comets-catalog";
import { coreRelations } from "@/knowledge-graph/data/core-relations";

/**
 * Knowledge-graph relations.
 *
 * `coreRelations` (below) is the original seed; the `data/` modules add the
 * Phase 3 expansion. Each relation is typed by domain (science | culture |
 * astrology) and confidence. Astrology relations are always domain "astrology"
 * + confidence "interpretive"; science relations are never interpretive — the
 * validator enforces both, so the boundary cannot be blurred.
 */
export const relations: GraphRelation[] = [
  ...coreRelations,
  ...solarSystem,
  ...starsConstellations,
  ...deepSky,
  ...missionsTelescopes,
  ...skyEventsMythology,
  ...messier,
  ...moonsExtra,
  ...agenciesVehicles,
  ...observatoriesAstronomers,
  ...deepSkyExtra,
  ...starsExtra,
  ...exoplanetsSystems,
  ...notableObjects,
  ...crossLinks,
  ...starCatalog,
  ...solarSystemCatalog,
  ...deepSkyCatalog,
  ...explorationCatalog,
  ...humanSpaceflightCatalog,
  ...observatoryCatalog,
  ...exoplanetCatalog,
  ...historyCatalog,
  ...cosmologyCatalog,
  ...imageCatalog,
  ...rocketsCatalog,
  ...constellationsCatalog,
  ...satellitesCatalog,
  ...asteroidsCatalog,
  ...cometsCatalog,
];
