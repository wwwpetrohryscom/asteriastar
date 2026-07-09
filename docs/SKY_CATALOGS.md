# Astronomical Catalogs & Professional Sky Databases (Program CD)

The professional catalogue layer — the reference databases and designation systems by which astronomers
name and index the sky. Built on the platform's honesty envelope: only well-established catalogue facts
are stated, uncertain object counts and epochs are left empty rather than invented, and nothing is
fabricated.

## Reuse-first

CD adds no duplicate. It reuses the catalogue infrastructure already in the graph and adds only what was
missing:

- The **eleven existing `catalog` entities** (Messier, NGC, IC, Henry Draper, Hipparcos, Gaia, the
  Harvard & Yerkes classifications, and the historical star catalogues), the **sky surveys**
  (`sky_survey:*` — SDSS, 2MASS, WISE, Gaia DR3, Pan-STARRS, LSST…), the **data archives**
  (`data_archive:*` — CDS, SIMBAD, VizieR, NED, MAST…), the **compiling astronomers**
  (`astronomer:charles-messier`, `henry-draper`, `william-herschel`, `tycho-brahe`), **ESA**, and the
  **Gaia telescope** — all referenced via `relatedKeys`, none duplicated.

## New entities (one reused type + two new types)

- **Professional catalogues** (14) — `catalog` (the existing type): Caldwell, Barnard, Sharpless (Sh2),
  Abell, PGC, UGC, Gliese, Tycho-2, SAO, GCVS, WDS, LHS, Wolf, and the Bonner Durchmusterung. These were
  previously carried only as designation *fields* on object entities; CD promotes them to first-class
  catalogues.
- **Catalog families** (7) — new `catalog_family` type: deep-sky visual, Dreyer's general catalogues,
  nebula, galaxy, astrometric star, nearby-star, and variable & double star catalogues.
- **Designation systems** (3) — new `designation_system` type: Bayer designations, Flamsteed
  designations, and variable-star designations.

Each new catalogue links to its family, the archives/surveys that distribute it, and the existing
catalogues it complements, producing `associated_with` edges deduped against every existing relation.

## Surfaces

- Hub `/sky-catalogs`, entry pages `/sky-catalogs/[slug]`, and three discovery hubs
  `/sky-catalogs/discover/{professional-catalogues,catalog-families,designation-systems}`.
- Resolved through the Scientific Data Engine (`engine.skyCatalogs`), which adds a `search()` method over
  catalogue names, alt-names, and designation abbreviations, and reuses the shared quality, review,
  provenance, connections, breadcrumb, and JSON-LD (`DataCatalog` / `DefinedTerm`) infrastructure.
  Accent: halo.
- A `astronomical-catalogs` dataset and a "How the Sky Is Catalogued" learning path surface the layer in
  `/datasets`, `/learn`, and `/llms.txt`.

## Honesty

Object counts and epochs are given only where firmly established (Caldwell's 109 objects, UGC's 12,921
galaxies, SAO's 258,997 stars, the BD's ~325,000); where a count is uncertain it is described rather than
invented. The compiling astronomers who are not yet in the graph (Dreyer, Barnard, Argelander, Gliese,
Luyten, Wolf, Sharpless, Abell) are named in prose but not linked to fabricated entities. Nothing is
fabricated.
