# Comparative Planetology & Planetary Atmospheres Encyclopedia (Program BA)

How planets and moons evolve, compared across the Solar System and beyond — planetary science as a
comparative discipline, from the cores of planets to the oceans of icy moons.

This layer **reuses** the planets (Mercury–Neptune), the moons (Titan, Europa, Enceladus, Io,
Triton), Pluto, the super-Earth, mini-Neptune, and hot-Jupiter classes, the magnetosphere, the
cryovolcano feature, the habitable zone, and the ocean-worlds theme already in the graph. The new
entities are the planetary interior layers, the planetary processes, and three exoplanet
world-types.

## Data model

`PlanetologyRecord` is a discriminated record over `PlanetologyKind`:

| kind | entity type | meaning |
| --- | --- | --- |
| `interior` | `planetary_interior` | a planetary interior layer |
| `process` | `planetary_process` | a planetary process |
| `worldtype` | `planetary_class` | an exoplanet world-type — a **new entity of the existing type** (which holds super-Earths, mini-Neptunes, hot Jupiters) |

Cross-references: `relatedKeys` (→ `associated_with` the reused planets, moons, classes,
magnetosphere, cryovolcano feature, habitable zone, and ocean-worlds theme, and the sibling BA
entities). Each record may carry a `domainLabel` (Terrestrial / Icy world / Proposed / …).

### Reusing the planetary-class type

Ocean worlds, lava worlds, and hycean planets are created as `planetary_class:` entities — the
**same type** as the super-Earths and hot Jupiters they sit beside — rather than a parallel type.
Only the interior layers and processes are genuinely new types.

## Contents

- **3 interior layers** — core, mantle, crust.
- **10 planetary processes** — planetary differentiation, plate tectonics, volcanism,
  cryovolcanism, atmospheric escape, climate evolution, the greenhouse effect, atmospheric
  circulation, magnetospheric shielding, and impact cratering history.
- **3 world-types** — ocean worlds, lava worlds, and the proposed hycean planets.

## Reuse & the graph

Each entity links to the real worlds it compares: volcanism to Io; cryovolcanism to Enceladus and
Triton; atmospheric escape and magnetospheric shielding to Mars and Earth; the greenhouse effect to
Venus; ocean worlds to Europa and Enceladus. Every emitted relation is deduped against
`LEGACY_RELATION_IDS`, and any relation whose endpoint does not resolve is dropped.

## Honesty

Plate tectonics is stated to be confirmed only on Earth; hycean planets are labelled a proposed,
unconfirmed class; and no interior compositions, temperatures, or ages are invented.

## Engine (`engine.comparativePlanetology`)

`ResolvedPlanetology` resolves an entry to the reused entities it uses (`related`) and the other BA
entities that reference it (`usedBy`). Query surface: `interiors()`, `processes()`, `worldtypes()`
(each sorted by name), and `resolveEntry(slug)`.

## Pages

- `/comparative-planetology` — the hub: the planetary processes, discovery hubs, and provenance.
- `/comparative-planetology/{slug}` — an adaptive entry for an interior layer, planetary process, or
  world-type.
- `/comparative-planetology/discover/{slug}` — planetary interiors, planetary processes, and world
  types.

## Provenance

Curated from NASA and the planetary-science community. Hypothetical world-types are labelled as
proposed; nothing is fabricated; unknown values are left empty.
