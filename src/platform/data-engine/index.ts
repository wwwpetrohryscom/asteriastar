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
import { validationEngine } from "@/platform/data-engine/validation-engine";

/** The unified engine surface — the sixteen modules of the data engine. */
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
  validation: validationEngine,
} as const;

/** Names of the engine modules (for documentation/registry). */
export const ENGINE_MODULES = Object.keys(engine) as (keyof typeof engine)[];

// Named exports for direct use + types.
export { entityEngine, relationshipEngine, traversalEngine, queryEngine };
export { recommendationEngine, timelineEngine, comparisonEngine, learningEngine };
export { discoveryEngine, metadataEngine, sourceEngine, citationEngine };
export { datasetEngine, authorityEngine, localizationEngine, validationEngine };

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
