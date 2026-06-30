# Deep Sky & Galaxy Encyclopedia (Program C)

The Deep Sky encyclopedia turns the universe beyond the Solar System — galaxies,
nebulae, and star clusters — into first-class knowledge-graph entities. Like the
Star and Solar System encyclopedias, **nothing is hand-authored into the graph**:
every object is generated from a real, openly-licensed catalogue.

## Data source

All objects come from the **OpenNGC database** (`mattiaverga/OpenNGC`), a curated
compilation of the **NGC/IC, Messier, and Caldwell** catalogues, licensed
**CC BY-SA 4.0**. The underlying measurements derive from professional surveys
(NED, HyperLEDA, SIMBAD). We do not invent objects, identifiers, or values; any
field without reliable data is simply omitted.

## Selection (first iteration)

From OpenNGC's ~14,000 rows we select a quality subset of **619 objects**:

- the complete **Messier** catalogue (105 objects present in OpenNGC; M24, M40, M45, M73, and the disputed M102 are star clouds, asterisms, double stars, or simply absent from the source),
- the complete **Caldwell** catalogue (105 objects),
- every object with a recorded **common name**, and
- all objects **brighter than magnitude 10**.

Object types are restricted to genuine deep-sky classes (galaxies, galaxy groups,
open/globular clusters, and the nebula family); stars, double stars, duplicate
entries, and non-existent objects are excluded. **503** objects are new graph
entities; the remaining **116** enrich entities that already existed (e.g.
`galaxy:messier-31`) by id. Matching is by catalogue designation, name, or alias — so objects already curated under a name slug (e.g. Omega Centauri, the Magellanic Clouds) are enriched, never duplicated.

## Pipeline

```
OpenNGC NGC.csv
  → scripts/ingest-deep-sky.ts        (parse, select, classify, extract ids)
  → src/knowledge-graph/data/deep-sky-catalog/records/chunk-*.ts   (typed, committed)
  → src/knowledge-graph/data/deep-sky-catalog/index.ts             (entities + relations)
  → src/platform/data-engine/deepsky-engine.ts                     (engine.deepSky)
  → src/app/deep-sky/**                                            (pages)
```

### Classification

- **Object type** maps from OpenNGC's `Type` code (`G`→galaxy, `OCl`→open cluster,
  `GCl`→globular cluster, `PN`→planetary nebula, `SNR`→supernova remnant, …).
- **Galaxy morphology** is derived from the Hubble-type string and is
  **case-sensitive**: `SB…` is a barred spiral, while `Sb`/`Sc` is the spiral
  subtype — a case-insensitive match would mislabel every spiral as "barred".
- **Observation difficulty** is derived from apparent magnitude using standard
  observing rules of thumb (naked-eye ≤ 5, binoculars ≤ 7, small telescope ≤ 9.5, …).
- **Visibility** (hemisphere, season) reuses the Star Encyclopedia's
  position-based classifiers over the object's real RA/Dec.

## Identifiers

Each object carries every catalogue id present in the source: **Messier, Caldwell,
NGC, IC, UGC, PGC**. The model also reserves slots for Barnard, Sharpless, Abell,
and ESO for future ingests. Identifiers are never fabricated.

## Graph integration

- New objects become `galaxy:`, `nebula:`, or `star_cluster:` entities.
- Each new object gets a `located_in_constellation` relation to its IAU
  constellation (all 88 already exist from the Star Encyclopedia), so there are
  no isolated nodes.
- The schema reserves `member_of_group`, `neighbor_of`, `photographed_by`, and
  `related_survey` for future relationship ingests.

## Pages

- `/deep-sky` — hub: brightest objects, discovery lists, browse by type and
  constellation, provenance.
- `/deep-sky/{slug}` — a rich object page: hero, quick facts, scientific overview,
  observation guide, location in the sky, catalogue cross-references, neighbours,
  sources, and a quality/authority panel.
- `/deep-sky/discover/{slug}` — 16 generated discovery lists (all galaxies, all
  nebulae, open/globular clusters, planetary nebulae, supernova remnants, Messier,
  Caldwell, bright, largest galaxies, beginner/advanced, by season, by hemisphere).

Every page is generated from `engine.deepSky`; every list is a query over real
data. Distance and discovery metadata are intentionally omitted where OpenNGC
carries no reliable value — quality over count.
