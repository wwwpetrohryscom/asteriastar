# Galaxies, AGN & the Extragalactic Universe Encyclopedia (Program AQ)

The extragalactic universe — the forms of galaxies, the active nuclei at their hearts, the
processes that shape them, and the great structures they build.

This layer **reuses** the galaxies (Andromeda, M87, M82, Centaurus A, the Antennae, the
Magellanic Clouds, and 140+ more), the astrophysical object classes (active galactic nucleus,
quasar, blazar, galaxy cluster, supercluster, cosmic filament, void, dark-matter halo,
supermassive black hole), and the cosmology concepts (the cosmic web, large-scale structure,
dark matter) already in the graph. The new entities are the galaxy morphologies, AGN types,
galactic processes, and named cosmic structures.

## Data model

`ExtragalacticRecord` is a discriminated record over `ExtragalacticKind`:

| kind | entity type | meaning |
| --- | --- | --- |
| `morphology` | `galaxy_morphology` | a class of galaxy morphology (the Hubble sequence and beyond) |
| `agn` | `agn_type` | a type of active galactic nucleus |
| `process` | `galactic_process` | a galaxy-evolution process or phenomenon |
| `structure` | `cosmic_structure` | a named large-scale structure (group, cluster, supercluster, wall, void) |

Cross-references: `relatedKeys` (→ `associated_with` the reused galaxies, object classes,
cosmology concepts, and the new entities it concerns). A morphology carries a `hubbleType`
label; a structure carries a `scaleLabel`.

## Reuse, not duplication

The AGN/quasar/blazar/cluster/supercluster/void object classes and the cosmic-web concepts
already exist — Program AQ links to them rather than re-minting them. Morphologies point at
exemplar galaxies (spiral → Andromeda/Whirlpool/Triangulum, barred spiral → Milky Way,
elliptical → M87, irregular → the Magellanic Clouds/M82, peculiar → the Antennae); AGN types
link to `astrophysical_object_class:active-galactic-nucleus`, `quasar`, `blazar`, and
`supermassive-black-hole`; structures link to `galaxy-cluster`, `supercluster`, `void`, and the
`cosmic-web`. Every emitted relation is deduped against `LEGACY_RELATION_IDS`, and any relation
whose endpoint does not resolve is dropped.

## Engine (`engine.galaxies`)

`ResolvedExtragalactic` resolves an entry to the reused/new entities it is associated with and
its graph connections. Query surface: `morphologies()`, `agnTypes()`, `processes()`,
`structures()`, and `resolveEntry(slug)`.

## Pages

- `/galaxies` — the hub: galaxy morphology, discovery hubs, and provenance.
- `/galaxies/{slug}` — an adaptive entry for a morphology, AGN type, process, or structure.
- `/galaxies/discover/{slug}` — galaxy morphology, active galactic nuclei, galaxy evolution, and
  cosmic structures.

## Provenance

Curated from NASA and ESA. Nothing is fabricated; galaxies and object classes are reused from
the graph.
