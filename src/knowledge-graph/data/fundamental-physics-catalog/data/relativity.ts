import { physics, type PhysicsRecord } from "@/knowledge-graph/data/fundamental-physics-catalog/types";

/** Relativity concepts (physics_concept) that extend the reused special/general relativity entities. */
export const relativity: PhysicsRecord[] = [
  physics("relativity", {
    slug: "mass-energy-equivalence",
    name: "Mass–Energy Equivalence",
    symbolLabel: "E = mc²",
    description:
      "Einstein's result that mass and energy are two forms of the same thing, related by the speed of light squared. It is the accounting behind starlight: fusing hydrogen into helium in the Sun's core converts about four million tonnes of mass into energy every second, and it governs the annihilation of matter with antimatter.",
    relatedKeys: ["cosmology_concept:special-relativity", "star:sun", "solar_region:solar-core", "physics_concept:antimatter"],
    highlights: ["E = mc² — the source of every star's light"],
  }),
  physics("relativity", {
    slug: "time-dilation",
    name: "Time Dilation",
    description:
      "The relativistic effect by which time runs slower for fast-moving observers and deeper in a gravitational field. It is measured every day — GPS satellites must correct for it — and it steepens near neutron stars and black holes, where clocks near the horizon crawl relative to distant ones. Even distant supernovae are seen to fade in slow motion as the Universe expands.",
    relatedKeys: ["cosmology_concept:special-relativity", "astronomical_theory:general-relativity", "physics_concept:length-contraction", "cosmology_concept:spacetime"],
    highlights: ["Clocks slow near mass and at high speed — measured, not theory"],
  }),
  physics("relativity", {
    slug: "length-contraction",
    name: "Length Contraction",
    description:
      "The relativistic shortening of an object along its direction of motion as seen by an observer it moves past, becoming dramatic near the speed of light. It is the companion of time dilation, and it explains how short-lived muons created high in the atmosphere by cosmic rays still reach the ground.",
    relatedKeys: ["cosmology_concept:special-relativity", "physics_concept:time-dilation", "radiation_environment:cosmic-rays"],
    highlights: ["Fast-moving objects shrink along their motion"],
  }),
  physics("relativity", {
    slug: "equivalence-principle",
    name: "The Equivalence Principle",
    description:
      "The principle that gravitational and inertial mass are identical, so that being in free fall is locally indistinguishable from floating in empty space. This insight led Einstein from special to general relativity, recasting gravity as the curvature of spacetime; it is tested to extraordinary precision by lunar laser ranging and dedicated satellites.",
    relatedKeys: ["astronomical_theory:general-relativity", "cosmology_concept:spacetime", "physics_concept:mass-energy-equivalence", "physics_concept:fundamental-forces"],
    highlights: ["Free fall feels like empty space — the seed of general relativity"],
  }),
];
