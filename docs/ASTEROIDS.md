# Asteroids & Minor Planets Encyclopedia (Program Y)

A comprehensive, source-backed, graph-driven encyclopedia of asteroids and minor
planets — the **main belt**, **near-Earth objects**, **Trojans**, **Centaurs**, and
the **trans-Neptunian** populations, plus **dwarf planets**, collisional
**families**, orbital **resonances**, the **missions** that explore them,
**impact** history, and **planetary defense**.

See also: [SOLAR_SYSTEM](./SOLAR_SYSTEM.md) (parent domain),
[SPACE_EXPLORATION](./SPACE_EXPLORATION.md),
[SCIENTIFIC_DATA_ENGINE.md](./SCIENTIFIC_DATA_ENGINE.md), [OPEN_DATA](./OPEN_DATA.md).

## Data & sourcing — no fabrication
Every technical field is curated from authoritative public sources — the IAU Minor
Planet Center (MPC), the NASA/JPL Small-Body Database and CNEOS, and agency mission
pages. **Every specification field is optional and omitted when not reliably
known**: orbits, sizes, masses, rotation periods, taxonomy, discovery dates,
discoverers, families, and missions are NEVER invented. Sizes are given only where
well-established (the large main-belt asteroids and the sampled near-Earth
asteroids); elongated bodies carry a `dimensions` label instead of a single
diameter; most orbital elements are deliberately left blank.

## Reuse first — never duplicate
The **five dwarf planets** (Ceres, Pluto, Haumea, Makemake, Eris) and the **ten
asteroids** already in the graph (Vesta, Pallas, Hygiea, Psyche, Bennu, Ryugu,
Apophis, Eros, Itokawa, Ida) are marked `existing: true` and ENRICHED — linked into
families, populations, resonances, and missions — never recreated. Their canonical
pages are unchanged (dwarf planets in the Solar System encyclopedia; the existing
asteroids at their graph pages). The **nine small-body missions** already present
(Dawn, Hayabusa, Hayabusa2, OSIRIS-REx, DART, Psyche, Lucy, Rosetta, New Horizons)
and the planets/observatories are all reused. Only **Hera** and **NEAR Shoemaker**,
absent from the graph, are created (as reused-type `space_mission` entities without
a dedicated page) so Didymos and Eros can be connected.

## Scale
| Kind | Graph type | New / reused | Count |
| --- | --- | --- | --- |
| Asteroid | `asteroid` (existing type) | 10 reused + 23 new | 33 |
| Dwarf planet | `dwarf_planet` (existing) | 5 reused | 5 |
| Asteroid family | `asteroid_family` (new) | new | 7 |
| Minor-planet group | `minor_planet_group` (new) | new | 8 |
| Near-Earth class | `near_earth_object` (new) | new | 4 |
| Trojan group | `trojan_group` (new) | new | 4 |
| Orbital resonance | `orbital_resonance` (new) | new | 4 |
| Impact event | `impact_event` (new) | new | 3 |
| Mission | `space_mission` (existing) | 2 new (Hera, NEAR) | 2 |

**55 new graph entities and 80 new relations.** The full graph validates at
6,000 entities / 9,664 relations with zero issues.

## Pipeline
```
curated data (src/knowledge-graph/data/asteroids-catalog/data/*)
  → asteroids-catalog/index.ts   (entities + relations + validateAsteroids + ASTEROIDS_STATS)
  → knowledge-graph/{entities,relations}.ts   (appended last)
  → asteroid-engine.ts           (engine.asteroids — pure, framework-free)
  → app/asteroids/**             (hub, /asteroids/[slug], family/group/near-earth/trojans/resonance/impact, discover, planetary-defense)
```

## Relations
One new relation type: `shares_orbital_resonance` (asteroid/group/Trojan →
`orbital_resonance`). Everything else reuses existing types: `member_of_family`
(→ family), `member_of_group` (→ group / near-Earth class / Trojan group),
`orbits` (a moonlet → its primary), `visited_by` (→ mission), `returned_samples_from`
(mission → asteroid), `target_of_mission` (mission → asteroid), and `associated_with`
(resonance → planet; impact → Earth). Cross-references resolve **against the map for
the target kind**. Mission/planet targets are reused entities addressed by id and
validated at the graph level; edges that duplicate an existing graph edge (e.g. a
mission target already emitted by the exploration catalog) are dropped via
`legacy-relations.ts`.

## Taxonomy
Spectral taxonomy (C/S/M/V/…) is stored as a `spectralType` field plus a broad
`taxonomyClass` (carbonaceous / silicaceous / metallic / basaltic / other) that
drives the composition discovery hubs — it is a property, not a separate entity, so
no taxonomy entities or `classified_as` edges are invented.

## Pages
`/asteroids` (hub), `/asteroids/{slug}` (the 23 NEW asteroids; reused bodies keep
their canonical pages), and the population routes `family/{slug}`, `group/{slug}`,
`near-earth/{slug}`, `trojans/{slug}`, `resonance/{slug}`, plus `impact/{slug}`,
`discover/{slug}` (20 discovery hubs), and `planetary-defense`. Each entity page
emits BreadcrumbList + a schema.org `Thing`/`CollectionPage`/`Event` JSON-LD, a
quick-facts panel, mission/population/connection sections, an EntityProvenancePanel,
a quality/authority panel, and a Sources list. `dynamicParams = false`.

## Planetary defense
A dedicated, **non-sensational** knowledge layer (`/asteroids/planetary-defense`):
how NEOs are found (Pan-STARRS, Catalina, ATLAS, Rubin, NEO Surveyor, Spaceguard),
the Torino and Palermo hazard scales (described as communication tools, not
predictions), coordination (PDCO, ESA Space Safety, IAWN, MPC/CNEOS), and deflection
techniques — kinetic impact (demonstrated by DART), gravity tractor (a concept), and
nuclear deflection (clearly labelled theoretical, never tested). Potentially
Hazardous Asteroids use the objective MPC/CNEOS `pha` criterion — a monitoring
category, not an impact prediction.

## Open Data
The existing `asteroids` dataset auto-includes the new asteroid entities. Four new
datasets are added — `asteroid-families`, `near-earth-objects`,
`minor-planet-populations` (groups + Trojans + resonances), and `impact-events` —
each exported as JSON / CSV / JSON-LD and served at `/api/v0/datasets/{slug}`.

## Validation
`validateAsteroids()` runs in `npm run validate` and `engine.validation`. It checks
duplicate ids, per-kind slug uniqueness, id ↔ kind/slug match, non-empty sources and
description, in-range numerics (eccentricity/albedo 0–1, inclination 0–180°,
plausible diameter — no fabricated numbers), type-aware cross-reference resolution,
and **no isolated new entity**. The entry gate additionally asserts every emitted
relation endpoint resolves in the assembled graph; the master `validateGraph`
enforces unique ids, resolvable endpoints, the science boundary, and no duplicate
relations.

## Learning
The `understanding-asteroids` learning path — 12 lessons across what asteroids are,
the belt, dwarf planets, near-Earth objects, taxonomy, families, Trojans/resonances,
trans-Neptunian objects, exploration, sample return, and planetary defense — every
step a real `/asteroids` route.

## Honest gaps
- **Reused bodies keep their existing pages**: the famous dwarf planets and the ten
  previously-modelled asteroids are linked from the encyclopedia to their canonical
  pages rather than given duplicate `/asteroids/{slug}` pages — no duplicate content.
- **Surveys and hazard scales** on the planetary-defense page are described in prose
  (with Pan-STARRS and Rubin linked as existing entities) rather than modelled as new
  entities — a stated scope limit.
- **Individual satellites of multiple systems** (Ida's Dactyl, Sylvia's Romulus/Remus)
  are described via `systemType`/`moons` fields rather than modelled as separate
  bodies; only Dimorphos, itself a mission target, is a first-class entity.
- Close-approach distances and rotation periods are not asserted, so the "closest
  approaches" and "fast rotators" hubs are deliberately not built.
