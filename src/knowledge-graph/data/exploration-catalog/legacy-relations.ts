import { relations as rMoonsExtra } from "@/knowledge-graph/data/moons-extra";
import { relations as rExoplanets } from "@/knowledge-graph/data/exoplanets-systems";
import { relations as rDeepSky } from "@/knowledge-graph/data/deep-sky";
import { relations as rNotable } from "@/knowledge-graph/data/notable-objects";
import { relations as rStarsConst } from "@/knowledge-graph/data/stars-constellations";
import { relations as rObservatories } from "@/knowledge-graph/data/observatories-astronomers";
import { relations as rMessier } from "@/knowledge-graph/data/messier";
import { relations as rSolarSystem } from "@/knowledge-graph/data/solar-system";
import { relations as rCrossLinks } from "@/knowledge-graph/data/cross-links";
import { relations as rMissionsTelescopes } from "@/knowledge-graph/data/missions-telescopes";
import { relations as rStarsExtra } from "@/knowledge-graph/data/stars-extra";
import { relations as rAgenciesVehicles } from "@/knowledge-graph/data/agencies-vehicles";
import { relations as rDeepSkyExtra } from "@/knowledge-graph/data/deep-sky-extra";
import { relations as rSkyEvents } from "@/knowledge-graph/data/sky-events-mythology";
import { relations as rSolarCatalog } from "@/knowledge-graph/data/solar-system-catalog";
import { relations as rDeepSkyCatalog } from "@/knowledge-graph/data/deep-sky-catalog";
import { coreRelations as rCore } from "@/knowledge-graph/data/core-relations";

/**
 * Ids of every relation defined outside the exploration catalog. The catalog
 * dedupes its derived relations against this so it enriches the graph without
 * ever duplicating an existing edge. (The star catalog has no mission/agency
 * relations, so it is intentionally omitted to keep this set cheap.)
 */
export const LEGACY_RELATION_IDS: ReadonlySet<string> = new Set(
  [
    ...rMoonsExtra, ...rExoplanets, ...rDeepSky, ...rNotable, ...rStarsConst,
    ...rObservatories, ...rMessier, ...rSolarSystem, ...rCrossLinks, ...rMissionsTelescopes,
    ...rStarsExtra, ...rAgenciesVehicles, ...rDeepSkyExtra, ...rSkyEvents,
    ...rSolarCatalog, ...rDeepSkyCatalog, ...rCore,
  ].map((x) => x.id),
);
