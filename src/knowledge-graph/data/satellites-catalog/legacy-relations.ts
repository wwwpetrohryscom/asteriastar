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
import { coreRelations as rCore } from "@/knowledge-graph/data/core-relations";

/**
 * Ids of every relation defined OUTSIDE the satellites catalog. The catalog dedupes
 * its derived relations against this so it enriches the graph without ever
 * duplicating an existing edge (e.g. an `operated_by` already emitted for a reused
 * agency, or a `launched_by` from the rockets catalog). Satellites is the newest
 * catalog and is appended last, so every other catalog — including rockets and
 * constellations — precedes it here.
 */
export const LEGACY_RELATION_IDS: ReadonlySet<string> = new Set(
  [
    ...rSolarSystem, ...rStarsConst, ...rDeepSky, ...rMissionsTelescopes, ...rSkyEvents,
    ...rMessier, ...rMoonsExtra, ...rAgenciesVehicles, ...rObservatories, ...rDeepSkyExtra,
    ...rStarsExtra, ...rExoplanets, ...rNotable, ...rCrossLinks, ...rStarCatalog,
    ...rSolarCatalog, ...rDeepSkyCatalog, ...rExploration, ...rHumanSpaceflight,
    ...rObservatoryCatalog, ...rExoplanetCatalog, ...rHistoryCatalog, ...rCosmologyCatalog,
    ...rImageCatalog, ...rRocketsCatalog, ...rConstellationsCatalog, ...rCore,
  ].map((x) => x.id),
);
