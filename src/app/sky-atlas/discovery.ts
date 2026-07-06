import { engine } from "@/platform/data-engine";
import type { AtlasRecord } from "@/knowledge-graph/data/sky-atlas-catalog/types";

/** Engine-driven discovery hubs for the Interactive Sky Atlas Encyclopedia. */
export interface BoDiscovery {
  slug: string;
  title: string;
  description: string;
  get: () => AtlasRecord[];
}

const e = engine.skyAtlas;

export const BO_DISCOVERIES: BoDiscovery[] = [
  { slug: "sky-maps", title: "Maps of the Sky", description: "The positional charts — the all-sky star atlas, the constellation atlas, the Messier and deep-sky atlases, and the bright-star map — each drawn as scalable vector graphics from the real measured coordinates of the stars and deep-sky objects.", get: () => e.views().filter((v) => v.renderMode === "sky-chart") },
  { slug: "universe-explorers", title: "Explorers of the Universe", description: "The interactive and three-dimensional-ready explorers — the Solar System, the Milky Way, the Local Group, the galaxy atlas, and the planet, moon, exoplanet, and distance-scale explorers — that browse the real object collections of the graph.", get: () => e.views().filter((v) => v.renderMode !== "sky-chart") },
  { slug: "overlays", title: "Data Overlays", description: "The layers drawn on top of the maps — constellation lines, observing conditions, and the JWST, Hubble, Gaia, and telescope field-of-view overlays — that add context without ever inventing a position.", get: () => e.overlays() },
];

const BY_SLUG = new Map(BO_DISCOVERIES.map((d) => [d.slug, d]));
export function getBoDiscovery(slug: string): BoDiscovery | undefined {
  return BY_SLUG.get(slug);
}
