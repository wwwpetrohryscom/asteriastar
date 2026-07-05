import { engine } from "@/platform/data-engine";
import type { PlanetologyRecord } from "@/knowledge-graph/data/comparative-planetology-catalog/types";

/** Engine-driven discovery hubs for the Comparative Planetology & Planetary Atmospheres Encyclopedia. */
export interface BaDiscovery {
  slug: string;
  title: string;
  description: string;
  get: () => PlanetologyRecord[];
}

const e = engine.comparativePlanetology;

export const BA_DISCOVERIES: BaDiscovery[] = [
  { slug: "planetary-interiors", title: "Planetary Interiors", description: "The structure beneath the surface — core, mantle, and crust — and how differentiation builds it.", get: () => e.interiors() },
  { slug: "planetary-processes", title: "Planetary Processes", description: "The mechanisms that shape worlds — tectonics, volcanism and cryovolcanism, atmospheric escape, climate evolution, and the greenhouse effect.", get: () => e.processes() },
  { slug: "world-types", title: "World Types", description: "Categories of world beyond the familiar — ocean worlds, lava worlds, and the proposed hycean planets.", get: () => e.worldtypes() },
];

const BY_SLUG = new Map(BA_DISCOVERIES.map((d) => [d.slug, d]));
export function getBaDiscovery(slug: string): BaDiscovery | undefined {
  return BY_SLUG.get(slug);
}
