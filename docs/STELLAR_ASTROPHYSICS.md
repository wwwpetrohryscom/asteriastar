# Stellar Astrophysics Deep-Dive Encyclopedia (Program BF)

How stars form, live, forge the elements, and die — the phases a star passes through from a
collapsing cloud to its end state, the nuclear reactions that build the periodic table in stellar
cores, and the physics that lets us read a star's mass, age, and fate from its light.

This layer **reuses** the stellar end-states already in the graph — the **white dwarf**, **neutron
star**, **magnetar**, **brown dwarf**, and **stellar-mass black hole** under `astrophysical_object_class`,
and the **supernovae**, **kilonova**, **novae**, and **variable-star** classes under `transient_class`
— together with the **spectral-classification** and **asteroseismology** methods, the **Harvard
classification**, **Big Bang nucleosynthesis**, the **molecular-cloud** environment, the **Roche
limit** (from Program BE), **Chandrasekhar**, and real example stars (the Sun, Betelgeuse, Sirius),
clusters (the Pleiades, Omega Centauri), and nebulae (the Helix). The new entities are the
evolutionary processes, the nucleosynthesis pathways, and the physics concepts. **No stellar
end-state or transient class is re-minted.**

## Data model

`StellarRecord` is a discriminated record over `StellarKind`:

| kind | entity type | meaning |
| --- | --- | --- |
| `process` | `stellar_process` | a formation or evolution process / phase |
| `nucleosynthesis` | `nucleosynthesis_process` | a nucleosynthesis pathway |
| `concept` | `stellar_physics_concept` | a stellar-physics concept |

Cross-references: `relatedKeys` (→ `associated_with` the reused end-states, transients, methods,
example objects, and the sibling BF entities). An entry may carry a `symbolLabel`
(e.g. "4 ¹H → ⁴He", "[Fe/H]", "≈ 1.4 M☉ limit") and `highlights`.

## Contents

- **12 stellar processes** — star formation, pre-main-sequence evolution, main-sequence evolution,
  the red-giant branch, the helium flash, the horizontal branch, the asymptotic giant branch,
  planetary-nebula ejection, stellar mass loss, massive-star core collapse, stellar rotation, and
  stellar magnetic activity.
- **6 nucleosynthesis pathways** — the proton–proton chain, the CNO cycle, the triple-alpha process,
  the s-process, the r-process, and the advanced burning stages.
- **8 physics concepts** — the Hertzsprung–Russell diagram, stellar structure, electron degeneracy
  pressure, the initial mass function, stellar metallicity, stellar populations & clusters,
  luminosity classification, and binary star systems.

## Reuse & the graph

Each entity links to the objects and ideas that give it meaning: main-sequence evolution to the
proton–proton chain and the Sun; the helium flash to electron degeneracy pressure and the
triple-alpha process; the asymptotic giant branch to the s-process, mass loss, and planetary-nebula
ejection; planetary-nebula ejection to the Helix Nebula and the white dwarf; massive-star core
collapse to the advanced burning stages, the core-collapse supernova, the neutron star, and the
stellar-mass black hole; the r-process to the kilonova and the neutron-star merger; electron
degeneracy pressure to Chandrasekhar, the white dwarf, and the neutron star; binary star systems to
the Roche limit, the Type Ia supernova, and Sirius; stellar populations to the Pleiades and Omega
Centauri. Every emitted relation is deduped against `LEGACY_RELATION_IDS`, and any relation whose
endpoint does not resolve is dropped.

## Honesty

Only well-established astrophysics is stated — the ≈1.4-solar-mass Chandrasekhar limit, the ~10⁸ K
threshold of the triple-alpha process, the ~1.3-solar-mass crossover where the CNO cycle overtakes
the pp chain, the confirmation of the r-process in the GW170817 kilonova, the Sun as a G2V star.
Population III stars are described as hypothesised and **not yet directly observed**. No masses,
temperatures, rates, or dates are invented; unknown values are left empty.

## Engine (`engine.stellarAstrophysics`)

`ResolvedStellarPhysics` resolves an entry to the reused entities it uses (`related`) and the other
BF entities that reference it (`usedBy`). Query surface: `processes()`, `nucleosynthesis()`,
`concepts()` (each sorted by name), and `resolveEntry(slug)`.

## Pages

- `/stellar-astrophysics` — the hub: the lives of stars, discovery hubs, and provenance.
- `/stellar-astrophysics/{slug}` — an adaptive entry for a stellar process, nucleosynthesis pathway,
  or physics concept.
- `/stellar-astrophysics/discover/{slug}` — the lives of stars, forging the elements, and the
  physics of stars.

## Provenance

Curated from NASA, ESO, and the astrophysics literature. Nothing is fabricated; unknown values are
left empty.
