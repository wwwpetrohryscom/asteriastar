import { engine } from "@/platform/data-engine";
import type { ExtragalacticRecord } from "@/knowledge-graph/data/galaxies-catalog/types";

/** Engine-driven discovery hubs for the Galaxies, AGN & Extragalactic Universe Encyclopedia. */
export interface GxDiscovery {
  slug: string;
  title: string;
  description: string;
  get: () => ExtragalacticRecord[];
}

const e = engine.galaxies;

export const GX_DISCOVERIES: GxDiscovery[] = [
  { slug: "galaxy-morphology", title: "Galaxy Morphology", description: "The forms of galaxies — spiral, barred, elliptical, lenticular, irregular, ring, dwarf, and peculiar.", get: () => e.morphologies() },
  { slug: "active-galactic-nuclei", title: "Active Galactic Nuclei", description: "The energetic hearts of galaxies — Seyferts, LINERs, radio galaxies, blazars, and the unified model that ties them together.", get: () => [...e.agnTypes(), ...e.agnModels()] },
  { slug: "galaxy-evolution", title: "Galaxy Evolution", description: "How galaxies grow and change — mergers, interactions, starbursts, black-hole feedback, and quenching.", get: () => e.processes() },
  { slug: "cosmic-structures", title: "Cosmic Structures", description: "The large-scale universe — the Local Group, the Virgo and Coma clusters, Laniakea, great walls, and voids.", get: () => e.structures() },
];

const BY_SLUG = new Map(GX_DISCOVERIES.map((d) => [d.slug, d]));
export function getGxDiscovery(slug: string): GxDiscovery | undefined {
  return BY_SLUG.get(slug);
}
