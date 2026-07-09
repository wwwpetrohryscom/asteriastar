import { engine } from "@/platform/data-engine";
import type { PhysicsRecord } from "@/knowledge-graph/data/fundamental-physics-catalog/types";

/** Engine-driven discovery hubs for the Quantum & Fundamental Physics for Astronomy Encyclopedia. */
export interface CaDiscovery {
  slug: string;
  title: string;
  description: string;
  get: () => PhysicsRecord[];
}

const e = engine.fundamentalPhysics;

export const CA_DISCOVERIES: CaDiscovery[] = [
  { slug: "quantum-physics", title: "Quantum Physics", description: "The rules of the very small that echo across the cosmos — the wave function and superposition, entanglement, the Heisenberg uncertainty principle that holds up white dwarfs and neutron stars, wave–particle duality, quantum spin and the 21-cm line, tunnelling that lets the Sun shine, zero-point energy, and decoherence.", get: () => e.quantum() },
  { slug: "particle-physics", title: "Particle Physics", description: "The particles and forces that build everything — elementary particles and the four fundamental forces, the Higgs boson, the ghostly neutrino and its flavour oscillations, antimatter, and the unsolved matter–antimatter asymmetry that let a Universe of matter survive.", get: () => e.particle() },
  { slug: "relativity", title: "Relativity", description: "Einstein's physics of space, time, and gravity — mass–energy equivalence as the source of starlight, time dilation and length contraction, and the equivalence principle that recast gravity as curved spacetime.", get: () => e.relativity() },
  { slug: "quantum-cosmology", title: "Quantum Cosmology", description: "Where the very small meets the whole Universe — quantum fluctuations stretched into the seeds of galaxies, vacuum energy and the cosmological-constant problem, the relic cosmic neutrino background, and the GZK limit on cosmic-ray energies.", get: () => e.cosmo() },
];

const BY_SLUG = new Map(CA_DISCOVERIES.map((d) => [d.slug, d]));
export function getCaDiscovery(slug: string): CaDiscovery | undefined {
  return BY_SLUG.get(slug);
}
