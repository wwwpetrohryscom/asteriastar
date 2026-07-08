# Black Holes, Neutron Stars & Compact Objects (Program BZ)

The end-states of gravity — where matter is crushed past every limit into a black hole or a neutron
star. Built on the platform's honesty envelope: only well-established astrophysics is stated, open
questions are flagged, and masses and distances appear only where firmly measured.

## Reuse-first

BZ reuses the large compact-object base already in the graph and adds only the physics and objects that
were missing:

- The **black-hole classes** (black hole, supermassive, intermediate-mass, stellar, primordial) and the
  **neutron-star and magnetar classes** (`astrophysical_object_class`); **Sgr A\*** and **M87\***
  (`black_hole`); the **event horizon, Hawking radiation, accretion disk, Schwarzschild radius**
  (`cosmology_concept`); the **merger, kilonova and tidal-disruption transients** (`transient_class`);
  the **Event Horizon Telescope**; the **gravitational-wave** and **black-hole-mass** methods; and the
  **Crab Nebula** — all referenced, none duplicated.

## New entities (reusing existing types; one new type)

- **Black-hole physics & processes** — `cosmology_concept` (matching the existing event horizon):
  ergosphere, photon sphere, ISCO, gravitational singularity, no-hair theorem, frame-dragging,
  gravitational redshift, spaghettification, relativistic jet, Blandford–Znajek mechanism,
  quasi-periodic oscillation, Bondi accretion.
- **Neutron-star physics** — `stellar_physics_concept`: neutron degeneracy pressure, the equation of
  state, the pulsar mechanism, pulsar glitches, the magnetar field.
- **Pulsar sub-type classes** — `astrophysical_object_class` (siblings of the neutron-star class):
  pulsar, millisecond pulsar, X-ray pulsar, rotation-powered pulsar.
- **Black-hole objects** — `black_hole` (like Sgr A\*/M87\*): Cygnus X-1 (~21 M☉, the first widely
  accepted black hole), V404 Cygni (~9 M☉).
- **Neutron-star objects** — the one **new type `neutron_star`** (mirroring `black_hole`): the Crab
  Pulsar (SN 1054), the glitching Vela Pulsar, the first pulsar PSR B1919+21 (1967), and the ~2.08 M☉
  PSR J0740+6620.

## Honesty

- Firmly-measured masses and distances are given (Cygnus X-1 ~21 M☉; V404 Cygni ~9 M☉; PSR J0740+6620
  ~2.08 M☉; Crab ~33 ms, Vela ~89 ms, PSR B1919+21 ~1.337 s); nothing is invented.
- Open problems are stated as open: the **neutron-star equation of state**, **how jets are launched**,
  the physics at the **singularity** (a full description needs quantum gravity), and the origin of QPOs.
- The validator checks that every `relatedKey` resolves to a real entity, and that no new id collides
  with an existing one — so nothing is duplicated or fabricated.

## Engine & pages

`engine.compactObjects` (black-hole physics / neutron-star physics / objects queries + `resolveEntry`).
Pages `/compact-objects` (hub, with a reused-objects section for Sgr A\*/M87\* and the classes),
`/compact-objects/[slug]` (rich detail: provenance, quality, sources, related entities, knowledge
connections, JSON-LD, breadcrumbs), and `/compact-objects/discover/[slug]` (black-hole physics, neutron
stars & pulsars, named objects).
