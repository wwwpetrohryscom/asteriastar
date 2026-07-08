import { compact, type CompactRecord } from "@/knowledge-graph/data/compact-objects-catalog/types";

/** Black-hole and general-relativity physics concepts and processes (created with the existing
 *  cosmology_concept type, alongside the event horizon). Each reuses the black-hole classes, the event
 *  horizon, accretion disk and Schwarzschild radius, and real black holes already in the graph. */
export const blackHoles: CompactRecord[] = [
  // ---- Black-hole physics / structure ----
  compact("bh-physics", {
    slug: "ergosphere",
    name: "The Ergosphere",
    description:
      "The region just outside the event horizon of a rotating (Kerr) black hole where spacetime itself is dragged around so fast that nothing can stay still relative to the distant stars. Energy can, in principle, be extracted from a black hole's rotation here through the Penrose process. A non-rotating black hole has no ergosphere.",
    relatedKeys: ["astrophysical_object_class:black-hole", "cosmology_concept:event-horizon", "cosmology_concept:frame-dragging"],
    highlights: ["Where spacetime is dragged around a spinning black hole"],
  }),
  compact("bh-physics", {
    slug: "photon-sphere",
    name: "The Photon Sphere",
    symbolLabel: "1.5 Schwarzschild radii",
    description:
      "The radius around a non-rotating black hole — one and a half Schwarzschild radii — at which gravity bends light so strongly that photons can orbit in unstable circles. It sets the size of the black hole's 'shadow' and the bright ring seen in the Event Horizon Telescope images of M87* and Sgr A*.",
    relatedKeys: ["astrophysical_object_class:black-hole", "cosmology_concept:event-horizon", "cosmology_concept:schwarzschild-radius", "observational_program:event-horizon-telescope", "black_hole:m87-star"],
    highlights: ["Where light orbits — defining the black-hole shadow"],
  }),
  compact("bh-physics", {
    slug: "innermost-stable-circular-orbit",
    name: "The Innermost Stable Circular Orbit",
    altNames: ["ISCO"],
    symbolLabel: "3 Schwarzschild radii (non-spinning)",
    description:
      "The closest orbit around a black hole in which matter can circle stably — at three Schwarzschild radii for a non-spinning black hole, and closer for a rapidly spinning one. Inside it, matter spirals inevitably inward. The ISCO sets the inner edge of an accretion disk and thus how much energy accretion can release.",
    relatedKeys: ["astrophysical_object_class:black-hole", "cosmology_concept:accretion-disk", "cosmology_concept:schwarzschild-radius", "astronomy_method:black-hole-mass-measurement"],
    highlights: ["The inner edge of an accretion disk"],
  }),
  compact("bh-physics", {
    slug: "no-hair-theorem",
    name: "The No-Hair Theorem",
    description:
      "The result that a black hole in equilibrium is fully described by just three numbers — its mass, its spin, and its electric charge — and retains no other detail of whatever formed it. All the complexity of the collapsing matter is lost to the outside universe, hidden behind the event horizon with the central singularity, giving black holes a remarkable simplicity.",
    relatedKeys: ["astrophysical_object_class:black-hole", "cosmology_concept:event-horizon", "cosmology_concept:singularity"],
    highlights: ["A black hole is just mass, spin, and charge"],
  }),
  compact("bh-physics", {
    slug: "frame-dragging",
    name: "Frame-Dragging",
    altNames: ["Lense–Thirring effect"],
    description:
      "The twisting of spacetime by a rotating mass, which drags nearby matter and light around with it. Extreme near a spinning black hole, it creates the ergosphere; it is tiny near the Earth, where it was measured by the Gravity Probe B and LAGEOS satellite experiments — a direct confirmation of a subtle prediction of general relativity.",
    relatedKeys: ["astrophysical_object_class:black-hole", "cosmology_concept:event-horizon", "cosmology_concept:gravitational-waves"],
    highlights: ["A spinning mass drags spacetime — measured near Earth"],
  }),
  compact("bh-physics", {
    slug: "gravitational-redshift",
    name: "Gravitational Redshift",
    description:
      "The stretching of light to longer wavelengths as it climbs out of a gravitational well, a prediction of general relativity. It is extreme near a black hole's event horizon, where light is redshifted without limit, and has been measured for the Sun, for white dwarfs, and even for atomic clocks at different heights on Earth.",
    relatedKeys: ["astrophysical_object_class:black-hole", "cosmology_concept:event-horizon", "black_hole:sagittarius-a-star"],
    highlights: ["Light reddens as it climbs out of gravity"],
  }),
  compact("bh-physics", {
    slug: "spaghettification",
    name: "Spaghettification",
    altNames: ["Tidal stretching"],
    description:
      "The stretching of an object into a long, thin shape by the difference in a black hole's gravity between its near and far sides. Around a small stellar black hole the tidal force is lethal well outside the horizon; around a supermassive black hole it is gentle at the horizon, so an infalling object could cross without being torn apart.",
    relatedKeys: ["astrophysical_object_class:black-hole", "astrophysical_object_class:stellar-black-hole", "transient_class:tidal-disruption-event"],
    highlights: ["Tidal forces stretch infalling matter thin"],
  }),

  // ---- Black-hole processes ----
  compact("bh-process", {
    slug: "relativistic-jet",
    name: "Relativistic Jet",
    description:
      "A narrow beam of plasma launched at nearly the speed of light from the vicinity of an accreting black hole — from stellar black holes in binaries and from the supermassive black holes powering active galaxies. Jets can span from light-years to millions of light-years and are thought to be powered by the black hole's spin and magnetic fields.",
    relatedKeys: ["astrophysical_object_class:black-hole", "cosmology_concept:accretion-disk", "astrophysical_object_class:active-galactic-nucleus", "astrophysical_object_class:blazar", "cosmology_concept:blandford-znajek-mechanism"],
    highlights: ["Plasma beamed at near light speed from an accreting black hole"],
  }),
  compact("bh-process", {
    slug: "blandford-znajek-mechanism",
    name: "The Blandford–Znajek Mechanism",
    description:
      "The leading explanation for how relativistic jets are powered: magnetic field lines threading a spinning black hole extract its rotational energy and fling plasma outward. Proposed by Roger Blandford and Roman Znajek in 1977, it lets a black hole act as a cosmic engine, converting spin into the enormous power of a jet.",
    relatedKeys: ["astrophysical_object_class:black-hole", "cosmology_concept:relativistic-jet", "astrophysical_object_class:active-galactic-nucleus"],
    highlights: ["Tapping a black hole's spin to power a jet"],
  }),
  compact("bh-process", {
    slug: "quasi-periodic-oscillation",
    name: "Quasi-Periodic Oscillation",
    altNames: ["QPO"],
    description:
      "A near-regular flickering in the X-ray brightness of matter orbiting a black hole or neutron star, revealed in the power spectrum as a broad peak rather than a sharp tone. QPOs probe the innermost accretion flow, close to the innermost stable circular orbit, and are used to study strong gravity — though their exact origin is still debated.",
    relatedKeys: ["astrophysical_object_class:black-hole", "cosmology_concept:accretion-disk", "cosmology_concept:innermost-stable-circular-orbit"],
    highlights: ["X-ray flickering that probes the inner accretion flow"],
  }),
  compact("bh-process", {
    slug: "bondi-accretion",
    name: "Bondi Accretion",
    description:
      "The idealised, spherically symmetric capture of surrounding gas by a compact object, worked out by Hermann Bondi in 1952. It sets a benchmark rate at which a black hole or neutron star can swallow the gas around it, and underlies estimates of how quiescent supermassive black holes such as Sgr A* are fed.",
    relatedKeys: ["astrophysical_object_class:black-hole", "cosmology_concept:accretion-disk", "black_hole:sagittarius-a-star"],
    highlights: ["The benchmark rate for swallowing surrounding gas"],
  }),
];
