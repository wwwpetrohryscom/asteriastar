import { engine } from "@/platform/data-engine";
import type { DistanceRecord } from "@/knowledge-graph/data/distance-ladder-catalog/types";

/** Engine-driven discovery hubs for the Cosmic Distance Ladder & Cosmological Tensions Encyclopedia. */
export interface AvDiscovery {
  slug: string;
  title: string;
  description: string;
  get: () => DistanceRecord[];
}

const e = engine.distanceLadder;

export const AV_DISCOVERIES: AvDiscovery[] = [
  { slug: "the-distance-ladder", title: "The Distance Ladder", description: "How the universe is measured, rung by rung — RR Lyrae, the tip of the red giant branch, surface brightness fluctuations, the Tully–Fisher and Faber–Jackson relations, water megamasers, and standard sirens.", get: () => e.indicators() },
  { slug: "cosmological-parameters", title: "Cosmological Parameters", description: "The numbers that describe the whole universe — the matter and dark-energy densities, the amplitude of fluctuations, and the spectral tilt.", get: () => e.parameters() },
  { slug: "the-hubble-tension", title: "The Hubble Tension", description: "The disagreement between the local and early-universe measurements of the expansion rate — the SH0ES programme and the proposed resolutions.", get: () => [...e.programs(), ...e.concepts()] },
];

const BY_SLUG = new Map(AV_DISCOVERIES.map((d) => [d.slug, d]));
export function getAvDiscovery(slug: string): AvDiscovery | undefined {
  return BY_SLUG.get(slug);
}
