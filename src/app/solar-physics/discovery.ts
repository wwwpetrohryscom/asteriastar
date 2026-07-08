import { engine } from "@/platform/data-engine";
import type { SolarRecord } from "@/knowledge-graph/data/solar-physics-catalog/types";

/** Engine-driven discovery hubs for the Solar Physics, Heliosphere & Solar Observatory Encyclopedia. */
export interface BySolarDiscovery {
  slug: string;
  title: string;
  description: string;
  get: () => SolarRecord[];
}

const e = engine.solarPhysics;

export const BY_DISCOVERIES: BySolarDiscovery[] = [
  { slug: "solar-interior", title: "Inside the Sun", description: "The concentric structure of the solar interior — the fusion core, the radiative zone through which energy diffuses for a hundred thousand years, the convecting outer third, and the tachocline shear layer where the magnetic dynamo is thought to live.", get: () => e.interior() },
  { slug: "solar-atmosphere", title: "The Solar Atmosphere", description: "The layers above the surface — photosphere, chromosphere, transition region, and the million-degree corona — and the features that live in them: granulation, prominences, filaments, plages, spicules, coronal loops, and streamers.", get: () => [...e.atmosphere(), ...e.features()] },
  { slug: "solar-activity", title: "Solar Activity & the Cycle", description: "The physics that makes the Sun active — the dynamo, magnetic reconnection, differential rotation, and the coronal-heating problem — and the roughly eleven-year cycle, its butterfly diagram, grand minima, and irradiance variation.", get: () => [...e.physics(), ...e.cycle()] },
  { slug: "solar-wind-and-heliosphere", title: "The Solar Wind & Heliosphere", description: "The Sun's outflow and the bubble it carves in interstellar space — the fast and slow solar wind, the Parker spiral, and the termination shock, heliosheath, and bow wave crossed and mapped by the Voyagers.", get: () => [...e.wind(), ...e.heliosphere()] },
];

const BY_SLUG = new Map(BY_DISCOVERIES.map((d) => [d.slug, d]));
export function getBySolarDiscovery(slug: string): BySolarDiscovery | undefined {
  return BY_SLUG.get(slug);
}
