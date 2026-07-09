import { physics, type PhysicsRecord } from "@/knowledge-graph/data/fundamental-physics-catalog/types";

/** Quantum-mechanics concepts (physics_concept), each framed by where it matters for astronomy. */
export const quantum: PhysicsRecord[] = [
  physics("quantum", {
    slug: "wave-function",
    name: "The Wave Function",
    symbolLabel: "ψ",
    description:
      "The mathematical object that captures everything knowable about a quantum system; its squared magnitude gives the probability of finding a particle in a given state. Wave functions underlie the discrete energy levels of atoms — and therefore the spectral lines that let astronomers read the composition, temperature, and motion of distant stars and gas.",
    relatedKeys: ["physics_concept:quantum-superposition", "physics_concept:wave-particle-duality", "physics_concept:heisenberg-uncertainty-principle"],
    highlights: ["Behind the spectral lines that reveal the cosmos"],
  }),
  physics("quantum", {
    slug: "quantum-superposition",
    name: "Quantum Superposition",
    description:
      "The principle that a quantum system can exist in a combination of states at once until it is measured, when a single outcome is realised. It is the heart of quantum weirdness and of quantum computing, and it is the reason atomic transitions and particle interactions must be described in probabilities rather than certainties.",
    relatedKeys: ["physics_concept:wave-function", "physics_concept:quantum-entanglement", "physics_concept:quantum-decoherence"],
    highlights: ["A system in many states at once — until measured"],
  }),
  physics("quantum", {
    slug: "quantum-entanglement",
    name: "Quantum Entanglement",
    description:
      "A deep correlation between quantum particles such that measuring one instantly fixes the state of the other, however far apart they are — what Einstein called 'spooky action at a distance.' Confirmed in ever-more-stringent experiments, it does not allow faster-than-light signalling and is a foundation of quantum information science.",
    relatedKeys: ["physics_concept:quantum-superposition", "cosmology_concept:special-relativity"],
    highlights: ["Correlations Einstein called 'spooky action at a distance'"],
  }),
  physics("quantum", {
    slug: "heisenberg-uncertainty-principle",
    name: "The Heisenberg Uncertainty Principle",
    altNames: ["Uncertainty principle"],
    symbolLabel: "Δx · Δp ≥ ħ/2",
    description:
      "The fundamental limit that a particle's position and momentum cannot both be known with arbitrary precision — a property of quantum nature itself, not of imperfect instruments. Together with the Pauli exclusion principle it sets the scale of the degeneracy pressure — the resistance of fermions such as electrons and neutrons to being crowded together — that holds up white dwarfs and neutron stars against gravity.",
    relatedKeys: ["physics_concept:wave-function", "physics_concept:quantum-spin", "stellar_physics_concept:neutron-degeneracy-pressure", "philosophy_of_science:measurement-uncertainty"],
    highlights: ["The quantum limit that supports white dwarfs and neutron stars"],
  }),
  physics("quantum", {
    slug: "wave-particle-duality",
    name: "Wave–Particle Duality",
    description:
      "The finding that light and matter each behave as both waves and particles depending on how they are observed — light as photons in the photoelectric effect, electrons as interfering waves in a double slit. It reconciled centuries of debate about the nature of light and underlies how detectors count the photons that carry astronomy's information.",
    relatedKeys: ["physics_concept:wave-function", "physics_concept:quantum-superposition"],
    highlights: ["Light and matter as both wave and particle"],
  }),
  physics("quantum", {
    slug: "quantum-spin",
    name: "Quantum Spin",
    description:
      "An intrinsic form of angular momentum carried by particles, quantised in units of the reduced Planck constant and unrelated to any literal spinning. Spin divides particles into fermions and bosons and, through the Pauli exclusion principle, into the electron shells of atoms; the spin-flip of hydrogen produces the 21-centimetre radio line that maps neutral gas across the Galaxy.",
    relatedKeys: ["physics_concept:heisenberg-uncertainty-principle", "physics_concept:elementary-particle", "cosmology_concept:standard-model-of-particle-physics"],
    highlights: ["Behind the Pauli principle and the 21-cm hydrogen line"],
  }),
  physics("quantum", {
    slug: "quantum-tunneling",
    name: "Quantum Tunneling",
    description:
      "The quantum ability of a particle to cross an energy barrier it classically could not surmount. Tunnelling lets protons in the Sun's core fuse despite their electrical repulsion — without it the Sun could not shine — and it is central to the theory of how radiation escapes a black hole.",
    relatedKeys: ["physics_concept:wave-function", "solar_region:solar-core", "cosmology_concept:hawking-radiation"],
    highlights: ["Lets the Sun's core fuse — without it, no starlight"],
  }),
  physics("quantum", {
    slug: "zero-point-energy",
    name: "Zero-Point Energy",
    description:
      "The lowest possible energy of a quantum system, which is never zero — even empty space seethes with quantum fluctuations. This vacuum energy is a real, measured effect (the Casimir force), and its possible connection to the accelerating expansion of the Universe is one of the deepest open problems in physics.",
    relatedKeys: ["physics_concept:vacuum-energy", "physics_concept:heisenberg-uncertainty-principle", "cosmology_concept:dark-energy", "cosmology_concept:cosmological-constant"],
    highlights: ["Even empty space is never truly empty"],
  }),
  physics("quantum", {
    slug: "quantum-decoherence",
    name: "Quantum Decoherence",
    description:
      "The process by which a quantum system loses its delicate superposition through unavoidable interaction with its environment, giving rise to the definite, classical world we observe. Decoherence explains why quantum weirdness is hard to see at everyday scales and is a central challenge for building quantum computers.",
    relatedKeys: ["physics_concept:quantum-superposition", "physics_concept:quantum-entanglement"],
    highlights: ["Why the quantum world looks classical to us"],
  }),
];
