import type { SourceKey } from "@/lib/sources";

/**
 * Scientific Knowledge Graph Explorer data model (Program BR). Each view is a first-class entity that
 * exposes the REAL knowledge graph — its 7,000+ entities and 11,000+ relations — through a specific
 * lens: statistics, neighbourhoods, shortest paths, the taxonomy, cross-domain links. The computed
 * views run genuine graph algorithms over the actual graph (src/lib/graph-explorer/algorithms.ts);
 * every number is counted and every path is a real chain of relations. Nothing is fabricated. The
 * rendering views (force-directed, hierarchical, cluster) describe visualisation modes prepared as
 * architecture, and the graph API is an architecture-ready interface.
 */

/** How a view is backed: a real graph algorithm today, a visualisation mode, or an API interface. */
export type ViewBacking = "computed" | "rendering" | "architecture";

export interface GraphViewRecord {
  id: string;
  slug: string;
  name: string;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  existing?: boolean;

  /** How the view is backed. */
  backing: ViewBacking;
  /** Short label of the capability, e.g. "Breadth-first shortest path". */
  capability: string;

  /* cross-references */
  relatedKeys?: string[]; // full ids of REUSED example entities and sibling views (associated_with)

  /* display */
  highlights?: string[];
}
