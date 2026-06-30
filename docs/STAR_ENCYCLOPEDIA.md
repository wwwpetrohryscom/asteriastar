# Star Encyclopedia

The star encyclopedia turns every star into a first-class entity in the knowledge
graph, served through the Scientific Data Engine. It is built **entirely from real,
openly-licensed catalogue data** — no fabricated stars, measurements, or
identifiers.

Browsable at [`/stars`](../src/app/stars/page.tsx).

## Data source & attribution

Stars are generated from the open **HYG database** (a compilation of the ESA
**Hipparcos** catalogue, the **Yale Bright Star Catalogue**, and the **Gliese**
Catalogue of Nearby Stars), by David Nash / astronexus —
<https://www.astronexus.com/hyg>. The HYG database is licensed
**CC BY-SA 4.0**, which matches this platform's own license.

Per CC BY-SA, this derived dataset is shared under the same terms, with
attribution to HYG and its underlying surveys. The raw catalogue is **not**
committed; only the typed, selected subset is (see below).

## Selection (iteration 1)

From ~119,000 catalogue stars, this iteration selects **every star to apparent
magnitude 5.5 (naked-eye) plus all stars with proper names** — **2,944 stars**
across all 88 constellations. Quality over count: brighter stars are the
best-studied and carry the most reliable data. The architecture scales to
100,000+ by raising the magnitude limit and re-running the ingest.

## Pipeline (never hardcoded)

```
HYG CSV  →  scripts/ingest-stars.ts  →  typed StarRecord shards
         (real values only; missing fields omitted, never invented)
              ↓
  src/knowledge-graph/data/star-catalog/  →  graph entities + relations
              ↓
  src/platform/data-engine/star-engine.ts  →  resolve / brightest / nearest / by-constellation / by-type / visibility
              ↓
  /stars, /stars/[slug], /stars/discover/[slug], /stars/constellations/[slug], /stars/type/[slug]
```

## Entity model

Each [`StarRecord`](../src/knowledge-graph/data/star-catalog/types.ts) carries the
real catalogue fields it has: catalog identifiers (HIP, HD, HR, Gliese, Bayer,
Flamsteed), constellation, spectral type, apparent/absolute magnitude, distance,
luminosity, colour index, coordinates, variability, and multiplicity. **Every
field is optional and omitted when the catalogue has no reliable value.**

`category`, `spectralClass`, and `luminosityClass` are **classified** from the
real spectral type by standard definition (e.g. an M-type main-sequence star is a
red dwarf) — a derivation, never a guess. Where a type cannot be classified, the
category is left empty.

## Graph integration

- 2,944 star entities + 57 newly-created constellation entities (joining the 31
  existing) → all 88 IAU constellations are present.
- Relations: `belongs_to_constellation` (every star) and `part_of_star_system`
  (catalogued multiple systems). New star relation types were added to the schema.
- No isolated nodes; the science/interpretive boundary holds; `validateGraph`
  and `validateStarCatalog` pass.

## Honesty

Rankings that would require data the catalogue does not hold — largest, most
massive, oldest, youngest — are **declared unsupported** rather than fabricated
(see [`discovery.ts`](../src/app/stars/discovery.ts)). Surface temperatures are
described per spectral class (a definition), not invented per star.

See [SCIENTIFIC_DATA_ENGINE.md](./SCIENTIFIC_DATA_ENGINE.md) and
[SCIENTIFIC_SOURCES.md](./SCIENTIFIC_SOURCES.md).
