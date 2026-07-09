import { physics, type PhysicsRecord } from "@/knowledge-graph/data/fundamental-physics-catalog/types";

/** Quantum-cosmology and high-energy concepts (physics_concept) at the meeting point of the very small and the whole cosmos. */
export const cosmo: PhysicsRecord[] = [
  physics("cosmo", {
    slug: "quantum-fluctuations",
    name: "Quantum Fluctuations",
    description:
      "Fleeting, unavoidable variations in the energy of a field, permitted by the uncertainty principle. Stretched to astronomical size during cosmic inflation, tiny quantum fluctuations are believed to have seeded the density variations we now see imprinted on the cosmic microwave background and grown into galaxies and clusters.",
    relatedKeys: ["physics_concept:heisenberg-uncertainty-principle", "cosmology_concept:cosmic-inflation", "cosmology_concept:cosmic-microwave-background", "physics_concept:vacuum-energy"],
    highlights: ["The quantum seeds of galaxies, imprinted on the CMB"],
  }),
  physics("cosmo", {
    slug: "vacuum-energy",
    name: "Vacuum Energy",
    description:
      "The energy that fills empty space even in the absence of matter or radiation, arising from quantum fields in their lowest state. Vacuum energy is a leading candidate for the dark energy driving cosmic acceleration and is closely tied to the cosmological constant in Einstein's equations.",
    relatedKeys: ["physics_concept:zero-point-energy", "cosmology_concept:dark-energy", "cosmology_concept:cosmological-constant", "physics_concept:cosmological-constant-problem"],
    highlights: ["The energy of empty space — a candidate for dark energy"],
  }),
  physics("cosmo", {
    slug: "cosmological-constant-problem",
    name: "The Cosmological Constant Problem",
    description:
      "The vast mismatch between the tiny dark-energy density measured in the Universe and the enormous vacuum energy that naive quantum theory predicts — a discrepancy of many tens of orders of magnitude. Often called the worst prediction in physics, it remains one of the deepest unsolved problems where quantum theory meets gravity.",
    relatedKeys: ["physics_concept:vacuum-energy", "cosmology_concept:dark-energy", "cosmology_concept:cosmological-constant", "cosmology_concept:quantum-gravity"],
    highlights: ["Quantum theory over-predicts dark energy by ~120 orders of magnitude"],
  }),
  physics("cosmo", {
    slug: "cosmic-neutrino-background",
    name: "The Cosmic Neutrino Background",
    altNames: ["Relic neutrinos", "CνB"],
    description:
      "A sea of relic neutrinos released about one second after the Big Bang, when the young Universe became transparent to them — the neutrino analogue of the cosmic microwave background. Its existence is strongly supported by its imprint on primordial element abundances and the microwave background, though the neutrinos themselves are far too low in energy to have been detected directly.",
    relatedKeys: ["physics_concept:neutrino", "cosmology_concept:cosmic-microwave-background", "cosmology_concept:big-bang-nucleosynthesis", "astronomy_method:neutrino-astronomy"],
    highlights: ["Relic neutrinos from one second after the Big Bang"],
  }),
  physics("cosmo", {
    slug: "gzk-limit",
    name: "The GZK Limit",
    altNames: ["Greisen–Zatsepin–Kuzmin cutoff"],
    description:
      "A theoretical ceiling on the energy of cosmic-ray protons that reach us from far away: above roughly 5×10¹⁹ electronvolts they collide with cosmic-microwave-background photons and lose energy, so the highest-energy cosmic rays must originate relatively nearby. Observatories studying the ultra-high-energy sky test this predicted cutoff.",
    relatedKeys: ["radiation_environment:cosmic-rays", "cosmology_concept:cosmic-microwave-background", "physics_concept:mass-energy-equivalence"],
    highlights: ["A cosmic-ray energy ceiling set by the microwave background"],
  }),
];
