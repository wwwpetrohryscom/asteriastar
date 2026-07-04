import { engine } from "@/platform/data-engine";
import type { GeoRecord } from "@/knowledge-graph/data/planetary-geology-catalog/types";

/** Engine-driven discovery hubs for the Planetary Geology & Surface Features Encyclopedia. */
export interface GeoDiscovery {
  slug: string;
  title: string;
  description: string;
  get: () => GeoRecord[];
}

const e = engine.planetaryGeology;

export const GEO_DISCOVERIES: GeoDiscovery[] = [
  { slug: "feature-types", title: "Feature Types", description: "The classes of geological feature — craters, volcanoes, canyons, dunes, chaos terrain, and more.", get: () => e.featureTypes() },
  { slug: "impact", title: "Impact Features", description: "Craters and basins blasted out by asteroid and comet impacts across the Solar System.", get: () => e.byCategory("impact") },
  { slug: "volcanic", title: "Volcanic Features", description: "Volcanoes, lava plains, and the ice volcanoes of the outer worlds.", get: () => e.byCategory("volcanic") },
  { slug: "tectonic", title: "Tectonic Features", description: "Canyons, mountains, faults, and the deformed terrains built by a world's crust.", get: () => e.byCategory("tectonic") },
  { slug: "icy", title: "Icy & Fluvial Features", description: "Ice plains, glaciers, chaos terrain, hydrocarbon lakes, and ancient river channels.", get: () => [...e.byCategory("icy"), ...e.byCategory("fluvial")] },
];

const BY_SLUG = new Map(GEO_DISCOVERIES.map((d) => [d.slug, d]));
export function getGeoDiscovery(slug: string): GeoDiscovery | undefined {
  return BY_SLUG.get(slug);
}
