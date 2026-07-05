# Celestial Mechanics & Timekeeping Encyclopedia (Program BE)

The exacting mathematics beneath every predicted eclipse, spacecraft trajectory, and star chart —
the laws of how bodies fall around one another, the coordinate systems that pin down *where* a thing
is, and the standards that pin down *when*.

This layer **reuses** universal gravitation and the concept of gravity, **Kepler's laws of planetary
motion** (the existing `astronomical_theory:keplers-laws`), the astronomers Kepler and Newton, the
JPL organization, the Jupiter orbital resonances, the TAI and UTC time standards, the
precession-of-the-equinoxes discovery, the planets (Mercury, Earth, Saturn), the Sun, and JWST
already in the graph. The new entities are the orbital-mechanics concepts, the reference frames, and
the ephemeris systems; the time standards are created with the platform's **existing**
`time_standard` type. Kepler's laws are **not** re-minted — the orbital-elements concept links to the
existing theory node.

## Data model

`MechanicsRecord` is a discriminated record over `MechanicsKind`:

| kind | entity type | meaning |
| --- | --- | --- |
| `dynamics` | `orbital_mechanics_concept` | a law or phenomenon of orbital dynamics |
| `frame` | `reference_frame` | a coordinate reference frame or epoch |
| `ephemeris` | `ephemeris_system` | a system for computing Solar System positions |
| `timekeeping` | `time_standard` | an astronomical time standard (reuses the existing type) |

Cross-references: `relatedKeys` (→ `associated_with` the reused laws, people, organizations,
resonances, standards, discoveries, and bodies, and the sibling BE entities). An entry may carry a
`symbolLabel` (e.g. "L1–L5", "TT = TAI + 32.184 s") and `highlights`.

## Contents

- **11 orbital-mechanics concepts** — the restricted three-body problem, N-body dynamics, Lagrange
  points, the Hill sphere, the Roche limit, orbital perturbations, mean-motion resonance, secular
  resonance, tidal evolution, spin-orbit coupling, and orbital elements. (Kepler's laws are reused
  from the existing theory node, not duplicated.)
- **6 reference frames & epochs** — the ICRS, BCRS, GCRS, the ecliptic, J2000, and B1950.
- **3 ephemeris systems** — the JPL Development Ephemeris, the SPICE toolkit, and JPL Horizons.
- **6 time standards** — Terrestrial Time, Barycentric Dynamical Time, UT1, the leap second,
  sidereal time, and apparent solar time.

## Reuse & the graph

Each entity links to the physics and bodies that give it meaning: the orbital-elements concept to the
existing Kepler's-laws theory node and the J2000 epoch; the Lagrange points to the restricted
three-body problem and to JWST at Sun–Earth L2; the Roche limit to Saturn and its rings; mean-motion resonance to the Jupiter orbital
resonances; tidal evolution to the Earth–Moon system; spin-orbit coupling to Mercury's 3:2 rotation;
the JPL Development Ephemeris and Horizons to the JPL organization; Terrestrial Time to TAI; the leap
second to UTC; apparent solar time to the Sun; the ecliptic to the precession discovery. Every
emitted relation is deduped against `LEGACY_RELATION_IDS`, and any relation whose endpoint does not
resolve is dropped.

## Honesty

Only well-established constants and definitions are stated — the TT–TAI offset of exactly 32.184 s,
Mercury's 3:2 spin-orbit resonance, the five Lagrange points, the J2000 and B1950 epochs. Where a
value is uncertain or convention-dependent it is described, not invented; no ephemeris coefficients,
leap-second dates, or numerical parameters are fabricated.

## Engine (`engine.celestialMechanics`)

`ResolvedMechanics` resolves an entry to the reused entities it uses (`related`) and the other BE
entities that reference it (`usedBy`). Query surface: `dynamics()`, `frames()`, `ephemerides()`,
`timekeeping()` (each sorted by name), and `resolveEntry(slug)`.

## Pages

- `/celestial-mechanics` — the hub: the mathematics of the moving sky, discovery hubs, and
  provenance.
- `/celestial-mechanics/{slug}` — an adaptive entry for an orbital-mechanics concept, reference
  frame, ephemeris system, or time standard.
- `/celestial-mechanics/discover/{slug}` — orbital mechanics, reference frames, ephemerides, and
  timekeeping.

## Provenance

Curated from JPL, the IAU, and the US Naval Observatory. Nothing is fabricated; unknown values are
left empty.
