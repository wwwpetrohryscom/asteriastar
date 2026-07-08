import { compact, type CompactRecord } from "@/knowledge-graph/data/compact-objects-catalog/types";

/** Specific compact objects — black holes (black_hole) and neutron stars (neutron_star). Sgr A* and M87*
 *  already exist and are reused elsewhere; these fill in the classic stellar-mass black holes and pulsars.
 *  Masses and distances are the firmly measured ones; nothing is invented. */
export const objects: CompactRecord[] = [
  // ---- Black holes ----
  compact("bh-object", {
    slug: "cygnus-x-1",
    name: "Cygnus X-1 (black hole)",
    altNames: ["Cygnus X-1", "Cyg X-1"],
    symbolLabel: "~21 M☉",
    description:
      "The compact object of Cygnus X-1 — the first widely accepted black hole. A bright X-ray source in Cygnus discovered in 1964, it is a stellar-mass black hole of roughly twenty-one solar masses pulling gas from its blue-supergiant donor star (HD 226868). It was the subject of a famous bet between Stephen Hawking and Kip Thorne, which Hawking conceded in 1990.",
    relatedKeys: ["astrophysical_object_class:stellar-black-hole", "astrophysical_object_class:black-hole", "star:cygnus-x-1", "cosmology_concept:accretion-disk", "cosmology_concept:relativistic-jet", "astronomy_method:black-hole-mass-measurement", "constellation:cygnus"],
    highlights: ["The first widely accepted black hole, ~21 M☉"],
  }),
  compact("bh-object", {
    slug: "v404-cygni",
    name: "V404 Cygni",
    symbolLabel: "~9 M☉",
    description:
      "A stellar-mass black hole of about nine solar masses in a binary system in Cygnus, and one of the nearest black holes with a precisely measured distance from radio parallax. Normally quiet, it erupted in a dramatic X-ray and radio outburst in June 2015 — a nearby microquasar caught devouring gas from its companion.",
    relatedKeys: ["astrophysical_object_class:stellar-black-hole", "astrophysical_object_class:black-hole", "cosmology_concept:accretion-disk", "cosmology_concept:relativistic-jet", "constellation:cygnus"],
    highlights: ["A nearby ~9 M☉ black hole; dramatic 2015 outburst"],
  }),

  // ---- Neutron stars ----
  compact("ns-object", {
    slug: "crab-pulsar",
    name: "The Crab Pulsar",
    altNames: ["PSR B0531+21"],
    symbolLabel: "~33 ms period",
    description:
      "The young neutron star at the heart of the Crab Nebula, formed in the supernova recorded by observers in 1054. It spins about thirty times a second and is the archetypal rotation-powered pulsar, its wind lighting up the surrounding nebula across the spectrum, from radio to gamma rays.",
    relatedKeys: ["astrophysical_object_class:pulsar", "astrophysical_object_class:rotation-powered-pulsar", "astrophysical_object_class:neutron-star", "nebula:crab-nebula", "stellar_physics_concept:pulsar-mechanism"],
    highlights: ["Born in the supernova of 1054; ~30 spins per second"],
  }),
  compact("ns-object", {
    slug: "vela-pulsar",
    name: "The Vela Pulsar",
    altNames: ["PSR B0833−45"],
    symbolLabel: "~89 ms period",
    description:
      "A young, bright pulsar in the Vela supernova remnant, spinning about eleven times a second. It is the classic glitching pulsar — famous for sudden small speed-ups in its rotation that reveal the superfluid interior of a neutron star — and one of the brightest gamma-ray sources in the sky.",
    relatedKeys: ["astrophysical_object_class:pulsar", "astrophysical_object_class:rotation-powered-pulsar", "astrophysical_object_class:neutron-star", "stellar_physics_concept:pulsar-glitch"],
    highlights: ["The classic glitching pulsar, in the Vela remnant"],
  }),
  compact("ns-object", {
    slug: "psr-b1919-21",
    name: "PSR B1919+21",
    altNames: ["The first pulsar", "CP 1919"],
    symbolLabel: "~1.337 s period",
    description:
      "The first pulsar ever discovered, found by Jocelyn Bell Burnell and Antony Hewish in 1967 as a startlingly regular radio signal once labelled 'LGM-1' for Little Green Men. Its 1.337-second pulses opened the study of neutron stars; the discovery is commemorated on the cover of Joy Division's album Unknown Pleasures.",
    relatedKeys: ["astrophysical_object_class:pulsar", "astrophysical_object_class:neutron-star", "historical_discovery:pulsars", "stellar_physics_concept:pulsar-mechanism"],
    highlights: ["The very first pulsar, discovered in 1967"],
  }),
  compact("ns-object", {
    slug: "psr-j0740-6620",
    name: "PSR J0740+6620",
    symbolLabel: "~2.08 M☉",
    description:
      "One of the most massive neutron stars known, at about 2.08 solar masses, weighed through the Shapiro delay of its pulses. Its radius has been measured by NASA's NICER X-ray telescope, and together the mass and radius are among the tightest constraints on the neutron-star equation of state and how dense matter behaves.",
    relatedKeys: ["astrophysical_object_class:neutron-star", "astrophysical_object_class:millisecond-pulsar", "stellar_physics_concept:neutron-star-equation-of-state", "stellar_physics_concept:neutron-degeneracy-pressure"],
    highlights: ["Among the most massive neutron stars, ~2.08 M☉"],
  }),
];
