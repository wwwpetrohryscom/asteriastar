import type { SourceKey } from "@/lib/sources";

/**
 * Universe Engine data model (Program BU) — the interactive 3D/Canvas layer over the knowledge graph.
 * Each scene is a first-class entity describing what it renders, which REAL engine backs it, and — most
 * importantly — the honest `coverageMode`: whether it shows true measured 3D positions, real relative
 * scale, direction only on the celestial sphere, or (where no numeric geometry exists in the catalogue)
 * descriptive content with no fabricated scene. It REUSES the star, solar-system, constellation, galaxy
 * and galactic-structure data already in the graph and completes the "3D-ready" Sky Atlas views. No
 * position, distance, or coordinate is invented; where a body has no measured distance it is never
 * placed in a distance-true scene. Unknown values are left empty.
 */

export type SceneCategory = "solar-system" | "stellar" | "galactic" | "extragalactic";

export const CATEGORY_LABEL: Record<SceneCategory, string> = {
  "solar-system": "Solar System",
  stellar: "Stars & constellations",
  galactic: "The Milky Way",
  extragalactic: "Beyond the Galaxy",
};

/**
 * How honest the geometry of a scene is — the core of the honesty envelope for 3D:
 *  - to-scale: real relative distances/sizes (e.g. planetary orbit radii), drawn to scale.
 *  - distance-true: real measured 3D positions (RA/Dec + measured distance).
 *  - direction-only: real directions on the unit celestial sphere; no distance is claimed.
 *  - descriptive: no numeric geometry exists in the catalogue, so no scene is fabricated — the page
 *    presents the real descriptive structure and states the limitation honestly.
 */
export type CoverageMode = "to-scale" | "distance-true" | "direction-only" | "descriptive";

export const COVERAGE_LABEL: Record<CoverageMode, string> = {
  "to-scale": "To scale — real relative distances",
  "distance-true": "Distance-true — real measured 3D positions",
  "direction-only": "Direction only — the celestial sphere",
  descriptive: "Descriptive — no numeric geometry available",
};

export interface UniverseSceneRecord {
  /** Stable graph id, "universe_scene:<slug>". */
  id: string;
  slug: string;
  name: string;
  category: SceneCategory;
  altNames?: string[];
  /** Required plain-language description of the scene. */
  description: string;
  sources: SourceKey[];
  existing?: boolean;

  /** Human-readable name of the reused engine(s) that back this scene, e.g. "engine.star". */
  dataSource: string;
  /** The honesty mode of the scene's geometry. */
  coverageMode: CoverageMode;
  /** Honest statement of exactly which measured fields drive the geometry (or why none can). */
  coordinateBasis: string;
  /** Whether a real interactive 3D viewer is rendered (true) or the page is descriptive only (false). */
  interactive: boolean;
  /** The Sky Atlas view this scene builds on — completing a 3D-ready explorer, or rendering an existing
   *  2D sky-chart view in three dimensions. */
  completesAtlasView?: string;
  /** Toggleable layers offered by the viewer (a layer is a filter over real points, never a position). */
  layers?: string[];
  /** Camera controls offered. */
  controls?: string[];
  /** The static/accessible fallback shown with JavaScript off or reduced motion. */
  fallback?: string;
  /** Honest limitations (e.g. undistanced stars excluded; no line topology; no numeric galaxy distances). */
  limitations?: string;

  /* cross-references */
  relatedKeys?: string[]; // full ids of REUSED entities (associated_with)

  /* display */
  highlights?: string[];
}
