import { engine } from "@/platform/data-engine";
import type { GraphViewRecord } from "@/knowledge-graph/data/graph-explorer-catalog/types";

/** Engine-driven discovery hubs for the Scientific Knowledge Graph Explorer. */
export interface BrDiscovery {
  slug: string;
  title: string;
  description: string;
  get: () => GraphViewRecord[];
}

const e = engine.graphExplorer;

export const BR_DISCOVERIES: BrDiscovery[] = [
  { slug: "explore", title: "Explore the Graph", description: "The live tools that run real algorithms over the actual knowledge graph — statistics and metrics, the entity and relation explorers, neighbourhood expansion, the shortest-path finder, the taxonomy and cross-domain explorers, and graph search.", get: () => e.all().filter((v) => v.backing === "computed") },
  { slug: "lenses", title: "Lenses & Visualisations", description: "The visualisation modes and domain lenses — force-directed, hierarchical, and cluster layouts, and the mission, institution, discovery, and scientific-lineage graphs — that reveal the shape and stories woven into the graph.", get: () => e.all().filter((v) => v.backing === "rendering" || v.backing === "architecture") },
];

const BY_SLUG = new Map(BR_DISCOVERIES.map((d) => [d.slug, d]));
export function getBrDiscovery(slug: string): BrDiscovery | undefined {
  return BY_SLUG.get(slug);
}
