# Cosmic Distance Ladder & Cosmological Tensions Encyclopedia (Program AV)

The complete distance-measurement layer of modern cosmology — how the universe is measured, rung by
rung, and the tension that measurement has revealed.

This layer **reuses** the rungs already in the graph (parallax, the Cepheid distance scale, Type Ia
supernovae, baryon acoustic oscillations, and the cosmic microwave background), the
cosmic-distance-ladder, standard-candles, galaxy-rotation-curve, and gravitational-wave-detection
methods, the Hubble constant and Hubble tension, dark energy, dark matter and the cosmological
constant, and the Planck, Gaia, Hubble and JWST facilities and the DESI programme. The new entities
are the distance indicators still missing from the graph, the cosmological parameters, the SH0ES
programme, and early dark energy.

## Data model

`DistanceRecord` is a discriminated record over `DistanceKind`:

| kind | entity type | meaning |
| --- | --- | --- |
| `indicator` | `distance_indicator` | a distance indicator / rung of the ladder |
| `parameter` | `cosmological_parameter` | a cosmological parameter (carries its `symbol`, never an invented value) |
| `program` | `observational_program` | a measurement programme — a **new entity of the existing type** (like DESI) |
| `concept` | `cosmology_concept` | a cosmology concept — a **new entity of the existing type** |

Cross-references: `relatedKeys` (→ `associated_with` the reused rungs, methods, facilities, and
concepts, and the sibling AV entities). An indicator carries a `rungLabel` (Geometric / Primary /
Secondary); a parameter carries its `symbol` (Ωm, ΩΛ, σ8, ns).

### Reusing existing types for the programme and the concept

SH0ES is created as an `observational_program:` entity — the **same type** as DESI — and early dark
energy as a `cosmology_concept:` entity — the **same type** as the Hubble tension it relates to —
rather than duplicating those concepts as new types. The Hubble constant, Hubble tension, dark
energy, dark matter, and the reused rungs are never recreated.

## Contents

- **7 distance indicators** — RR Lyrae, the tip of the red giant branch, surface brightness
  fluctuations, the Tully–Fisher relation, the Faber–Jackson relation, water megamaser distances,
  and standard sirens.
- **4 cosmological parameters** — the matter density (Ωm), the dark-energy density (ΩΛ), the
  amplitude of fluctuations (σ8), and the scalar spectral index (ns). The Hubble constant (H0) is
  reused.
- **The SH0ES programme** — the local-ladder measurement at the heart of the Hubble tension.
- **Early dark energy** — one proposed, unconfirmed resolution of the Hubble tension.

## Honesty: measured values and open questions

No measured value is invented. The parameters carry their symbols and meanings, not fabricated
numbers; the Hubble tension is described as an open disagreement, not a settled result; and early
dark energy is stated plainly to be one of several competing, unconfirmed proposals.

## Engine (`engine.distanceLadder`)

`ResolvedDistance` resolves an entry to the reused entities it uses (`related`) and the other AV
entities that reference it (`usedBy`). Query surface: `indicators()`, `parameters()`, `programs()`,
`concepts()` (each sorted by name), and `resolveEntry(slug)`.

## Pages

- `/distance-ladder` — the hub: the rungs of the ladder, discovery hubs, and provenance.
- `/distance-ladder/{slug}` — an adaptive entry for a distance indicator, cosmological parameter,
  measurement programme, or concept.
- `/distance-ladder/discover/{slug}` — the distance ladder, the cosmological parameters, and the
  Hubble tension.

## Provenance

Curated from Planck, the SH0ES programme, and the gravitational-wave observatories. Measured values
are not invented; proposed resolutions are labelled unconfirmed; unknown values are left empty.
