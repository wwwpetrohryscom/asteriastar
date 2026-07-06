import type { SourceKey } from "@/lib/sources";
import type { EntityType } from "@/knowledge-graph/schema";

/**
 * Interactive Sky Atlas & 3D Universe data model (Program BO) — the visual layer over the knowledge
 * graph. Each atlas view and overlay is a first-class entity that describes what it shows, which REAL
 * collection or engine backs it, and how it is rendered. It REUSES the real star, deep-sky, planet,
 * moon, galaxy, exoplanet, constellation, telescope and survey data already in the graph — nothing is
 * fabricated. Positional maps are drawn from the real right-ascension/declination coordinates already
 * stored in the star and deep-sky catalogs; object counts are computed from the reused engines at
 * render time, never hard-coded. 3D views are described as architecture-ready, not as fabricated
 * scenes. Unknown values are left empty.
 */

export type AtlasKind =
  | "view" // an atlas map or explorer
  | "overlay"; // a data overlay drawn on top of a view

export const KIND_ENTITY_TYPE: Record<AtlasKind, EntityType> = {
  view: "atlas_view",
  overlay: "atlas_overlay",
};

export const KIND_LABEL: Record<AtlasKind, string> = {
  view: "Atlas view",
  overlay: "Atlas overlay",
};

/** How a view is rendered. sky-chart = server-rendered SVG from real coordinates; collection = a
 *  browsable index of real graph objects; three-d-ready = an explorer whose data model is prepared
 *  for a future WebGL/3D scene (no fabricated geometry today). */
export type RenderMode = "sky-chart" | "collection" | "three-d-ready";

export interface AtlasRecord {
  id: string;
  slug: string;
  name: string;
  kind: AtlasKind;
  altNames?: string[];
  description: string;
  sources: SourceKey[];
  existing?: boolean;

  /** How the view is rendered (views only). */
  renderMode?: RenderMode;
  /** Human-readable name of the reused engine/collection that backs this view, e.g. "engine.star". */
  dataSource?: string;

  /* cross-references */
  relatedKeys?: string[]; // full ids of REUSED or new entities (associated_with)

  /* display */
  symbolLabel?: string;
  definition?: string;
  highlights?: string[];
}
