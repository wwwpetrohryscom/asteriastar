# Constellation Encyclopedia (Program W)

A graph-driven encyclopedia of all **88 official IAU constellations** — one of the
core navigation hubs of Asteria Star. Each constellation is connected to its
stars, deep-sky objects, exoplanet hosts, meteor-shower radiants, mythology,
family, neighbours, and seasonal visibility through the Knowledge Graph.

This is a **Knowledge Graph expansion, not a standalone content project**: the 88
constellation entities already existed, and their connections to stars, deep-sky
objects, and meteor showers already existed as graph relations. Program W
**enriches and surfaces** them — it fabricates and duplicates nothing.

See also: [STAR_ENCYCLOPEDIA](./STAR_ENCYCLOPEDIA.md),
[SCIENTIFIC_DATA_ENGINE](./SCIENTIFIC_DATA_ENGINE.md),
[KNOWLEDGE_GRAPH](./KNOWLEDGE_GRAPH.md).

## Reuse, never duplicate
- The **88 `constellation:*` entities already exist** — Program W does not recreate
  them; it enriches them with IAU reference data and repoints their `entryPath` to
  `/constellations/{slug}` (the new canonical home). The old
  `/stars/constellations/{slug}` star-table pages remain as sub-views and
  canonicalize up.
- **Stars → constellation** connections already exist as `belongs_to_constellation`
  edges (2,944), **deep-sky → constellation** as `located_in_constellation`,
  **meteor showers → constellation** as `associated_with`, and **constellation →
  mythology** as `mythologically_linked_to`. The engine SURFACES these — no
  `contains_star` / `radiant_of` / `related_mythology` duplicates are added.
- Stars, Messier/NGC/IC/Caldwell objects, exoplanets, meteor showers, and mythology
  figures are all **reused by id** — this program creates none of them.

## New graph content
- **3 new entity types:** `constellation_family`, `asterism`, `seasonal_sky`.
- **24 new entities:** 8 traditional constellation families (after Menzel), 12
  named asterisms (Big Dipper, Summer Triangle, Winter Hexagon, …), 4 seasonal
  skies (winter/spring/summer/autumn).
- **2 new relation types:** `belongs_to_family` (constellation → family),
  `best_observed_in` (constellation → seasonal sky). Plus **`neighbor_of` edges**
  (the type existed but had no constellation adjacency) from curated IAU-boundary
  adjacency, and asterism `associated_with` links.
- **317 new relations** in total; nothing duplicated (deduped against every prior
  catalog via `legacy-relations.ts`).

## Data & sourcing — no fabrication
Every rich field on a `ConstellationRecord` is optional and omitted when not
reliably known. Official IAU **areas** (square degrees) are provided for all 88 and
**rank-by-area is derived** from them (single source of truth). Hemisphere, family,
season, zodiac/Ptolemaic flags, brightest star (reused star id), mythology (reused
figure id), neighbours, and highlights are curated from standard references;
coordinates and other fields are left blank where uncertain. No boundaries, stars,
visibility, seasons, distances, or historical facts are invented.

## Pipeline
```
IAU reference data (constellations-catalog/data/*)
  → constellations-catalog/index.ts  (family/asterism/season entities + derived
                                       relations + validateConstellations + STATS)
  → knowledge-graph/{entities,relations}.ts   (appended last)
  → constellation-engine.ts  (engine.constellations — pure, reuses star/deep-sky/
                               meteor maps and existing graph relations)
  → app/constellations/**   (hub, /{slug}, /discover/{slug}, /family, /season, /region)
```

## Engine — `engine.constellations`
`resolveConstellation(slug)` returns the record plus its brightest star, all
catalogued stars, deep-sky objects, host-resolvable exoplanets, meteor-shower
radiants, neighbours, family, season, mythology, graph connections, quality, and
review status — all by reusing the prebuilt star/deep-sky maps and the existing
graph edges. Also: `resolveConstellationFamily`, `resolveSeason`, `resolveSkyRegion`,
plus query helpers for the discovery hubs (zodiac, hemispheres, largest/smallest,
seasons, Messier/galaxy/nebula-rich, meteor radiants, exoplanets, …).

## Discovery hubs (19)
All 88 · zodiac · northern/southern/equatorial · largest/smallest · winter/spring/
summer/autumn sky · beginner · with-bright-stars · best-telescope · Milky Way ·
Messier-rich · galaxy-rich · nebula-rich · exoplanet · meteor-shower radiants.
Honest filters — a constellation with an unknown value is excluded from a hub, not
assigned an invented one.

## Live Sky integration (Phase 9)
Every constellation page LINKS to the computed Live Sky tools — the Tonight
dashboard, Planet Visibility, Moon Position, and Meteor Showers — but states **no
live constellation visibility itself**. Seasons are labelled for the northern
mid-latitudes with an explicit southern-hemisphere caveat; the computed tools give
the real sky for a user's location and date.

## Validation
`validateConstellations()` runs in `npm run validate` and `engine.validation`. It
checks: exactly 88 constellations; id/slug format and match to the IAU slug set
(guarding irregular slugs like `cetus-constellation`, `bootes`, `canes-venatici`,
and the single `serpens`); non-empty sources/description/abbr/genitive; numeric
sanity (area, RA, dec, rank ranges); exactly 12 zodiac; derived rank is a 1..88
permutation; family/season/neighbour cross-references resolve; unique family/
asterism/season slugs; and no isolated new entity. The master graph's
`validateGraph` additionally enforces unique ids, resolvable relation endpoints,
and the science↔culture domain boundary (mythology links are `culture`).

## Honest gaps
- **Exoplanets** are surfaced only for systems whose host is a catalogued `star:*`
  (host-resolvable); computing membership from RA/Dec against boundary polygons is
  not attempted (it would be new machinery and a fabrication risk).
- **Central coordinates (RA/Dec)** are left blank rather than approximated.
- **Brightest-star** is curated for the well-known constellations and otherwise
  falls back to the brightest catalogued star; some obscure constellations show the
  catalogue's brightest rather than a curated value.
