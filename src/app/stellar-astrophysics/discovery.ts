import { engine } from "@/platform/data-engine";
import type { StellarRecord } from "@/knowledge-graph/data/stellar-astrophysics-catalog/types";

/** Engine-driven discovery hubs for the Stellar Astrophysics Deep-Dive Encyclopedia. */
export interface BfDiscovery {
  slug: string;
  title: string;
  description: string;
  get: () => StellarRecord[];
}

const e = engine.stellarAstrophysics;

export const BF_DISCOVERIES: BfDiscovery[] = [
  { slug: "stellar-lives", title: "The Lives of Stars", description: "The phases a star passes through — from the collapse of a molecular cloud through the main sequence, the giant branches, and mass loss, to the ejection of a planetary nebula or the collapse of a massive core.", get: () => e.processes() },
  { slug: "nucleosynthesis", title: "Forging the Elements", description: "How stars build the periodic table — the proton–proton chain and CNO cycle, the triple-alpha process, the slow and rapid neutron-capture processes, and the advanced burning stages that end in iron.", get: () => e.nucleosynthesis() },
  { slug: "stellar-physics", title: "The Physics of Stars", description: "The ideas that make sense of stars — the Hertzsprung–Russell diagram, stellar structure, electron degeneracy pressure, the initial mass function, metallicity, stellar populations, luminosity classes, and binary systems.", get: () => e.concepts() },
];

const BY_SLUG = new Map(BF_DISCOVERIES.map((d) => [d.slug, d]));
export function getBfDiscovery(slug: string): BfDiscovery | undefined {
  return BY_SLUG.get(slug);
}
