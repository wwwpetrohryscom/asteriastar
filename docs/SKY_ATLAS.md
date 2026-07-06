# Interactive Sky Atlas & 3D Universe Platform (Program BO)

The visual layer over the AsteriaStar knowledge graph. Where the encyclopedia catalogs objects, the
atlas lets you **see** them — a sky you can navigate, drawn from the same measured data. This program
marks the platform's transition from a static encyclopedia toward an interactive scientific platform.

**Honesty first.** Every positional map is rendered as scalable vector graphics directly from the
**real right ascension and declination** already stored in the star and deep-sky catalogs. A star or
deep-sky object appears only where the data places it. Object counts are computed from the live
collections at render time, never hard-coded. Three-dimensional views are described as
**architecture-ready** — their data model is prepared for a future WebGL scene — not as fabricated
3D geometry. Nothing is invented.

## Data model

`AtlasRecord` is a discriminated record over `AtlasKind`:

| kind | entity type | meaning |
| --- | --- | --- |
| `view` | `atlas_view` | an atlas map or explorer |
| `overlay` | `atlas_overlay` | a data overlay drawn on top of a view |

Each view carries a `renderMode` — `sky-chart` (server-rendered SVG from real coordinates),
`collection` (a browsable index of real objects), or `three-d-ready` (an explorer prepared for a
future 3D scene) — and a `dataSource` naming the reused engine (e.g. `engine.star`). `relatedKeys`
link each view/overlay to the REUSED real objects and facilities it draws on.

## Contents

- **14 atlas views** — the all-sky star atlas, the constellation atlas, the Messier atlas, the
  deep-sky atlas, the bright-star map, and the Solar System, Milky Way, Local Group, galaxy, planet,
  moon, exoplanet, NGC, and distance-&-scale explorers.
- **6 data overlays** — constellation lines, observation conditions, and the JWST, Hubble, Gaia, and
  telescope-field-of-view overlays.

## Rendering pipeline

The projection helpers in `src/lib/sky-atlas/projection.ts` transform measured coordinates into SVG
pixels — nothing more. `projectEquirectangular(raDeg, decDeg, w, h)` places a point on an all-sky
grid (RA increasing to the left, the planetarium convention); `magnitudeToRadius(mag)` scales a dot
by apparent brightness. The pure mappers in `src/lib/sky-atlas/chart-data.ts` read only the
coordinate fields already on the records (stars store RA/Dec in degrees; deep-sky objects store RA in
hours, Dec in degrees) and drop any record without coordinates, so nothing is ever plotted at a
made-up position. The `SkyChart` component renders the result server-side.

## Engine (`engine.skyAtlas`)

`ResolvedAtlas` resolves an entry to the reused entities it draws on (`related`) and the other BO
entities that reference it (`usedBy`). Query surface: `views()`, `overlays()`, `skyCharts()` (each
sorted by name), and `resolveEntry(slug)`.

## Pages

- `/sky-atlas` — the hub: a real all-sky preview of the naked-eye stars, the view catalog, and
  provenance.
- `/sky-atlas/{slug}` — an adaptive entry for a view or overlay; sky-chart views render the real SVG
  map from measured coordinates.
- `/sky-atlas/discover/{slug}` — maps of the sky, explorers of the universe, and data overlays.

## Provenance

Positions are drawn from the star catalog (HYG / Hipparcos / Gaia astrometry) and the deep-sky
catalog (OpenNGC); constellation boundaries from the IAU. Nothing is fabricated; objects without
measured coordinates are omitted rather than placed.
