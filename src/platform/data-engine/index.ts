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
import { validationEngine } from "@/platform/data-engine/validation-engine";

/** The unified engine surface — the twenty-four modules of the data engine. */
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
  validation: validationEngine,
} as const;

/** Names of the engine modules (for documentation/registry). */
export const ENGINE_MODULES = Object.keys(engine) as (keyof typeof engine)[];

// Named exports for direct use + types.
export { entityEngine, relationshipEngine, traversalEngine, queryEngine };
export { recommendationEngine, timelineEngine, comparisonEngine, learningEngine };
export { discoveryEngine, metadataEngine, sourceEngine, citationEngine };
export { datasetEngine, authorityEngine, localizationEngine, starEngine, solarEngine, deepSkyEngine, explorationEngine, humanSpaceflightEngine, observatoryEngine, exoplanetEngine, historyEngine, validationEngine };
export type { ResolvedStar } from "@/platform/data-engine/star-engine";
export type { ResolvedBody } from "@/platform/data-engine/solar-engine";
export type { ResolvedDeepSky } from "@/platform/data-engine/deepsky-engine";
export type { ResolvedExploration } from "@/platform/data-engine/exploration-engine";
export type { ResolvedHsf } from "@/platform/data-engine/human-spaceflight-engine";
export type { ResolvedObs } from "@/platform/data-engine/observatory-engine";
export type { ResolvedExo } from "@/platform/data-engine/exoplanet-engine";
export type { ResolvedHistory } from "@/platform/data-engine/history-engine";

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
