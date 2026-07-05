# Galactic Astronomy & the Milky Way Encyclopedia (Program BG)

We live inside the object we most want to understand. This layer maps the anatomy of the Milky Way —
its discs, bulge, bar, halo, and spiral arms, and the black hole at its heart — and tells the story
of how it turns, how it remembers its past in the motions of its stars, and how it will one day
merge with Andromeda.

This layer **reuses** the **Milky Way** galaxy, **Sagittarius A***, the **Local Group**, the
**Large and Small Magellanic Clouds**, **Andromeda** and **Triangulum**, the **dark-matter halo**
class and the **dark-matter** concept, the **galaxy-rotation-curve** method, the **galaxy-merger**
and **galaxy-evolution** processes, **Gaia** and its **DR3** survey, the **diffuse interstellar
medium**, and the **stellar-populations** concept (from Program BF) already in the graph. The new
entities are the structural components of the Galaxy and its dynamical and archaeological phenomena.
**No existing galaxy, black hole, or process is re-minted.**

## Data model

`GalacticRecord` is a discriminated record over `GalacticKind`:

| kind | entity type | meaning |
| --- | --- | --- |
| `structure` | `galactic_structure` | a structural component of the Galaxy |
| `dynamics` | `galactic_dynamics` | a dynamical, archaeological, or environmental phenomenon |

Cross-references: `relatedKeys` (→ `associated_with` the reused Galaxy, objects, methods, and
processes, and the sibling BG entities). An entry may carry a `symbolLabel` (e.g. "~26,000 ly away",
"in ~4–5 billion years") and `highlights`.

## Contents

- **11 galactic structures** — the thin disk, the thick disk, the bulge, the bar, the stellar halo,
  the spiral arms, the galactic warp, the Galactic Centre, the central molecular zone, the galactic
  corona, and the solar neighbourhood.
- **9 dynamical & archaeological phenomena** — galactic rotation, stellar streams, galactic
  archaeology, radial migration, the galactic magnetic field, the galactic habitable zone, satellite
  galaxies & accretion, the Milky Way–Andromeda collision, and the galactic fountain.

## Reuse & the graph

Each entity links to the Galaxy and objects that give it meaning: the Galactic Centre to Sagittarius
A* and the central molecular zone; the thick disk and stellar halo to the stellar-populations
concept; galactic rotation to the rotation-curve method and dark matter; stellar streams and
galactic archaeology to Gaia; satellite accretion to the Magellanic Clouds and the Local Group; the
Milky Way–Andromeda collision to Andromeda, the galaxy-merger process, and the Local Group; the
galactic fountain and magnetic field to the interstellar medium. Every emitted relation is deduped
against `LEGACY_RELATION_IDS`, and any relation whose endpoint does not resolve is dropped.

## Honesty

Only well-established galactic astronomy is stated — the ~26,000-light-year distance to the Galactic
Centre, the four-million-solar-mass Sagittarius A*, the flat rotation curve as evidence for dark
matter, the ~230-million-year galactic year, the barred-spiral classification of the Milky Way. The
galactic habitable zone is described as **proposed and debated**, and the Milky Way–Andromeda
collision as **predicted in roughly four to five billion years with uncertain timing**. No distances,
masses, or dates are invented; unknown values are left empty.

## Engine (`engine.galacticAstronomy`)

`ResolvedGalacticAstronomy` resolves an entry to the reused entities it uses (`related`) and the
other BG entities that reference it (`usedBy`). Query surface: `structure()`, `dynamics()` (each
sorted by name), and `resolveEntry(slug)`.

## Pages

- `/galactic-astronomy` — the hub: the anatomy of the Galaxy, discovery hubs, and provenance.
- `/galactic-astronomy/{slug}` — an adaptive entry for a galactic structure or dynamical phenomenon.
- `/galactic-astronomy/discover/{slug}` — the anatomy of the Galaxy, and its dynamics, archaeology &
  fate.

## Provenance

Curated from NASA, ESO, and the galactic-astronomy literature. Nothing is fabricated; unknown values
are left empty.
