import { physics, type PhysicsRecord } from "@/knowledge-graph/data/fundamental-physics-catalog/types";

/** Particle-physics concepts (physics_concept), framed by their astronomical relevance. */
export const particle: PhysicsRecord[] = [
  physics("particle", {
    slug: "elementary-particle",
    name: "Elementary Particles",
    description:
      "The fundamental constituents of matter and force in the Standard Model — the quarks and leptons that make up matter, and the force-carrying bosons. Everything from a star to a galaxy is built from a handful of these particles, and understanding them connects the physics of the very small to the structure of the whole Universe.",
    relatedKeys: ["cosmology_concept:standard-model-of-particle-physics", "physics_concept:fundamental-forces", "physics_concept:quantum-spin", "physics_concept:neutrino"],
    highlights: ["The building blocks of matter and force"],
  }),
  physics("particle", {
    slug: "fundamental-forces",
    name: "The Fundamental Forces",
    altNames: ["The four fundamental interactions"],
    description:
      "The four basic interactions of nature — gravity, electromagnetism, and the strong and weak nuclear forces. Together they govern everything from the fusion that powers stars to the collapse of a massive core, and unifying them, especially gravity with the quantum forces, remains a central goal of physics.",
    relatedKeys: ["cosmology_concept:standard-model-of-particle-physics", "cosmology_concept:quantum-gravity", "astronomical_theory:general-relativity", "physics_concept:higgs-boson"],
    highlights: ["Gravity, electromagnetism, and the strong and weak forces"],
  }),
  physics("particle", {
    slug: "higgs-boson",
    name: "The Higgs Boson",
    symbolLabel: "discovered 2012, CERN",
    description:
      "The particle associated with the Higgs field, which gives many elementary particles their mass. Predicted in the 1960s and discovered at CERN's Large Hadron Collider in 2012, it completed the Standard Model; the origin of mass it explains is fundamental to why matter — and therefore stars and galaxies — exists as it does.",
    relatedKeys: ["cosmology_concept:standard-model-of-particle-physics", "physics_concept:elementary-particle", "physics_concept:fundamental-forces"],
    highlights: ["Gives particles their mass — found at the LHC in 2012"],
  }),
  physics("particle", {
    slug: "neutrino",
    name: "The Neutrino",
    description:
      "A tiny, electrically neutral particle that interacts only very weakly and so streams almost unimpeded through matter — trillions pass through you each second. Neutrinos are produced in the Sun's core, in supernovae, and by cosmic rays, and detecting them opens a window onto processes hidden from light, a pillar of multi-messenger astronomy.",
    relatedKeys: ["cosmology_concept:standard-model-of-particle-physics", "physics_concept:neutrino-oscillation", "astronomy_method:neutrino-astronomy", "observatory:icecube", "wavelength_band:neutrinos"],
    highlights: ["A ghostly particle that sees where light cannot"],
  }),
  physics("particle", {
    slug: "neutrino-oscillation",
    name: "Neutrino Oscillation",
    description:
      "The quantum phenomenon in which a neutrino changes flavour — electron, muon, or tau — as it travels. Its discovery proved that neutrinos have a small mass, resolved the decades-old 'solar neutrino problem' of the Sun apparently producing too few, and was recognised with the 2015 Nobel Prize in Physics.",
    relatedKeys: ["physics_concept:neutrino", "physics_concept:quantum-superposition", "star:sun", "astronomy_method:neutrino-astronomy"],
    highlights: ["Neutrinos change flavour — proving they have mass"],
  }),
  physics("particle", {
    slug: "antimatter",
    name: "Antimatter",
    description:
      "Matter's mirror image — particles with the same mass but opposite charge, such as the positron discovered in cosmic rays in 1932. When matter and antimatter meet they annihilate into pure energy. Antiparticles are produced in high-energy astrophysical environments and are detected in cosmic rays reaching the Earth.",
    relatedKeys: ["physics_concept:elementary-particle", "physics_concept:matter-antimatter-asymmetry", "radiation_environment:cosmic-rays", "physics_concept:mass-energy-equivalence"],
    highlights: ["Matter's mirror image — annihilates on contact"],
  }),
  physics("particle", {
    slug: "matter-antimatter-asymmetry",
    name: "Matter–Antimatter Asymmetry",
    altNames: ["Baryon asymmetry"],
    description:
      "The unexplained fact that the Universe is made almost entirely of matter, even though the Big Bang should have produced matter and antimatter in equal amounts, which would have annihilated completely. Why a tiny excess of matter survived — the problem of baryogenesis — is one of the great open questions in physics and cosmology.",
    relatedKeys: ["physics_concept:antimatter", "cosmology_concept:standard-model-of-particle-physics", "physics_concept:fundamental-forces"],
    highlights: ["Why is the Universe made of matter, not antimatter? Open"],
  }),
];
