import { compact, type CompactRecord } from "@/knowledge-graph/data/compact-objects-catalog/types";

/** Neutron-star physics concepts (stellar_physics_concept) and pulsar sub-type classes
 *  (astrophysical_object_class). Each reuses the neutron-star and magnetar classes already in the graph. */
export const neutronStars: CompactRecord[] = [
  // ---- Neutron-star physics ----
  compact("ns-physics", {
    slug: "neutron-degeneracy-pressure",
    name: "Neutron Degeneracy Pressure",
    description:
      "The quantum pressure — arising from the Pauli exclusion principle acting on densely packed neutrons — that holds a neutron star up against its own gravity. It is far stronger than the electron degeneracy pressure that supports a white dwarf, but it too has a limit: above roughly two to three solar masses, no known pressure can prevent collapse into a black hole.",
    relatedKeys: ["astrophysical_object_class:neutron-star", "stellar_physics_concept:neutron-star-equation-of-state", "astrophysical_object_class:black-hole"],
    highlights: ["Quantum pressure that supports a neutron star"],
  }),
  compact("ns-physics", {
    slug: "neutron-star-equation-of-state",
    name: "The Neutron-Star Equation of State",
    description:
      "The still-uncertain relationship between pressure and density inside a neutron star, which decides how compressible its ultra-dense matter is and therefore the star's radius and maximum mass. Pinning it down — from radius measurements by NICER, from massive pulsars, and from the tidal signature in neutron-star mergers — is a central goal of modern astrophysics.",
    relatedKeys: ["astrophysical_object_class:neutron-star", "stellar_physics_concept:neutron-degeneracy-pressure", "transient_class:binary-neutron-star-merger", "neutron_star:psr-j0740-6620"],
    highlights: ["The uncertain physics that sets a neutron star's size"],
  }),
  compact("ns-physics", {
    slug: "pulsar-mechanism",
    name: "The Pulsar Mechanism",
    altNames: ["Lighthouse effect"],
    description:
      "How a pulsar pulses: a rapidly rotating, strongly magnetised neutron star beams radiation from its magnetic poles, and if a beam sweeps across the Earth we see a regular pulse once per rotation, like a lighthouse. The precise physics of how the beam is generated in the star's magnetosphere is still not fully understood.",
    relatedKeys: ["astrophysical_object_class:neutron-star", "astrophysical_object_class:pulsar", "neutron_star:crab-pulsar"],
    highlights: ["A magnetised, spinning neutron star as a cosmic lighthouse"],
  }),
  compact("ns-physics", {
    slug: "pulsar-glitch",
    name: "Pulsar Glitch",
    description:
      "A sudden, tiny speed-up in a pulsar's otherwise steadily slowing rotation, followed by a gradual relaxation. Glitches are thought to be caused by the sudden transfer of angular momentum from a superfluid deep inside the neutron star to its solid crust, giving a rare window onto matter at supernuclear density.",
    relatedKeys: ["astrophysical_object_class:neutron-star", "astrophysical_object_class:pulsar", "neutron_star:vela-pulsar", "stellar_physics_concept:neutron-star-equation-of-state"],
    highlights: ["A sudden spin-up revealing the star's superfluid interior"],
  }),
  compact("ns-physics", {
    slug: "magnetar-magnetic-field",
    name: "The Magnetar Magnetic Field",
    symbolLabel: "~10¹⁴–10¹⁵ gauss",
    description:
      "The most powerful magnetic fields known in the Universe — around a hundred trillion to a quadrillion gauss — carried by magnetars, a class of young neutron star. The decay of this colossal field powers their X-ray and gamma-ray flares, including the giant flares bright enough to be detected across the Galaxy and beyond.",
    relatedKeys: ["astrophysical_object_class:magnetar", "astrophysical_object_class:neutron-star", "transient_class:magnetar-flare"],
    highlights: ["The strongest magnetic fields in the Universe"],
  }),

  // ---- Pulsar sub-type classes ----
  compact("ns-class", {
    slug: "pulsar",
    name: "Pulsar",
    description:
      "A rapidly rotating, magnetised neutron star observed as a source of regular pulses of radiation, usually in radio. The first was found in 1967 by Jocelyn Bell Burnell and Antony Hewish; thousands are now known, with periods from milliseconds to seconds. Pulsars are precise cosmic clocks used to test gravity and to search for gravitational waves.",
    relatedKeys: ["astrophysical_object_class:neutron-star", "astrophysical_object_class:millisecond-pulsar", "astrophysical_object_class:rotation-powered-pulsar", "stellar_physics_concept:pulsar-mechanism", "gw_detection_method:pulsar-timing-array", "neutron_star:crab-pulsar"],
    highlights: ["A neutron star seen as a pulsing cosmic clock"],
  }),
  compact("ns-class", {
    slug: "millisecond-pulsar",
    name: "Millisecond Pulsar",
    symbolLabel: "~1–10 ms period",
    description:
      "An old pulsar spun up to hundreds of rotations per second by accreting matter from a companion star — 'recycled' to spin periods of only a few milliseconds. Their extraordinary rotational stability makes them the most precise clocks known and the basis of pulsar-timing arrays searching for low-frequency gravitational waves.",
    relatedKeys: ["astrophysical_object_class:pulsar", "astrophysical_object_class:neutron-star", "astrophysical_object_class:x-ray-pulsar", "gw_detection_method:pulsar-timing-array"],
    highlights: ["Recycled by accretion — the most precise clocks known"],
  }),
  compact("ns-class", {
    slug: "x-ray-pulsar",
    name: "X-ray Pulsar",
    description:
      "A neutron star in a binary system that pulls gas from its companion; the gas is funnelled by the star's magnetic field onto its poles, where it heats up and shines in pulsed X-rays as the star rotates. X-ray pulsars are how many neutron stars are weighed, and how millisecond pulsars are recycled.",
    relatedKeys: ["astrophysical_object_class:neutron-star", "astrophysical_object_class:pulsar", "astrophysical_object_class:millisecond-pulsar", "cosmology_concept:accretion-disk"],
    highlights: ["Accretion-powered pulses from a neutron-star binary"],
  }),
  compact("ns-class", {
    slug: "rotation-powered-pulsar",
    name: "Rotation-Powered Pulsar",
    description:
      "A pulsar whose radiation is powered by the gradual loss of its rotational energy as it slowly spins down — the classic young pulsar, of which the Crab is the archetype. This is distinct from an accretion-powered X-ray pulsar, which draws its energy from infalling matter rather than from its own spin.",
    relatedKeys: ["astrophysical_object_class:pulsar", "astrophysical_object_class:neutron-star", "neutron_star:crab-pulsar", "astrophysical_object_class:x-ray-pulsar"],
    highlights: ["Powered by its own slowing spin — the Crab is the archetype"],
  }),
];
