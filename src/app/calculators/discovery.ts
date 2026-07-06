import { engine } from "@/platform/data-engine";
import type { CalculatorRecord } from "@/knowledge-graph/data/scientific-calculators-catalog/types";

/** Engine-driven discovery hubs for the Scientific Calculators Encyclopedia. */
export interface BpDiscovery {
  slug: string;
  title: string;
  description: string;
  get: () => CalculatorRecord[];
}

const e = engine.scientificCalculators;

export const BP_DISCOVERIES: BpDiscovery[] = [
  { slug: "orbital-and-gravity", title: "Orbits & Gravity", description: "The mechanics of motion and gravity — escape and orbital velocity, orbital periods by Kepler's third law, surface gravity, density, the Schwarzschild radius, and the Hill and Roche limits.", get: () => e.byCategory("orbital") },
  { slug: "stars-and-cosmos", title: "Stars & the Cosmos", description: "The physics of stars and the wider universe — luminosity and blackbody radiation, the mass–luminosity relation and stellar lifetimes, magnitudes and distances, exoplanet temperatures and habitability, and cosmological redshift and distance.", get: () => [...e.byCategory("stellar"), ...e.byCategory("observational"), ...e.byCategory("exoplanet"), ...e.byCategory("cosmology")] },
  { slug: "telescopes-and-observing", title: "Telescopes & Observing", description: "The optics of observing — angular resolution and the diffraction limit, magnification, image scale and field of view, limiting magnitude, and the photon shot-noise limit on signal-to-noise.", get: () => e.byCategory("instrument") },
];

const BY_SLUG = new Map(BP_DISCOVERIES.map((d) => [d.slug, d]));
export function getBpDiscovery(slug: string): BpDiscovery | undefined {
  return BY_SLUG.get(slug);
}
