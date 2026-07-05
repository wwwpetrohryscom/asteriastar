# Space Data Archives & Open Science Infrastructure Encyclopedia (Program AT)

Where astronomy's data lives and how it is shared — the open-science infrastructure beneath every
result on the platform.

This layer **reuses** the archive-operating organisations (STScI, ESO, Caltech/IPAC, NASA, NRAO,
NAOJ, and SAO), the space telescopes and surveys whose data the archives hold (Hubble, JWST, Chandra,
the Sloan survey, the Very Large Telescope), the calibration method (`error-analysis-and-calibration`),
the Harvard classification, and the VOEvent alert standard already in the graph. The new entities are
the science data archives, the data standards, the Virtual Observatory protocols, and the
open-science practices.

## Data model

`ArchiveRecord` is a discriminated record over `ArchiveKind`:

| kind | entity type | meaning |
| --- | --- | --- |
| `archive` | `data_archive` | a science data archive |
| `standard` | `data_standard` | a data format / standard |
| `framework` | `vo_framework` | the Virtual Observatory interoperability framework (parent of the access protocols) |
| `protocol` | `vo_protocol` | a Virtual Observatory access protocol |
| `practice` | `open_science_practice` | an open-science practice (pipelines, identifiers, citation, reproducibility) |

Cross-references: `relatedKeys` (→ `associated_with` the reused organisations, telescopes, surveys,
methods, and catalogues, and the sibling AT entities). An archive may carry an `operatorLabel`
(e.g. "Operated by STScI") only where it is well established.

## Contents

- **10 archives** — MAST, the ESA science archives, IRSA, HEASARC, NED, the Strasbourg CDS with
  SIMBAD and VizieR, and the ESO and ALMA archives.
- **3 data standards** — FITS, VOTable, ASDF.
- **The Virtual Observatory** — the IVOA interoperability framework and its 4 access protocols:
  TAP, Cone Search, Simple Image Access, and Simple Spectral Access.
- **5 open-science practices** — data pipelines & calibration, cross-matching, the ADS literature
  service, persistent identifiers, and reproducibility & FAIR data.

## Reuse & the graph

Each entity links to the real organisations and instruments it depends on: MAST reuses STScI, Hubble,
and JWST; HEASARC reuses NASA and Chandra; SIMBAD and VizieR reuse the CDS (and VizieR the Harvard
classification); FITS reuses Hubble; VOTable reuses VOEvent and the Virtual Observatory; the ADS
reuses SAO and NASA; data pipelines reuse the calibration method. Every emitted relation is deduped
against `LEGACY_RELATION_IDS`, and any relation whose endpoint does not resolve is dropped, so the
catalog enriches the graph without ever duplicating an existing edge.

## Engine (`engine.dataArchives`)

`ResolvedArchive` resolves an entry to the reused entities it uses (`related`) and the other AT
entities that reference it (`usedBy`). Query surface: `archives()`, `standards()`, `protocols()`,
`practices()` (each sorted by name), and `resolveEntry(slug)`.

## Pages

- `/data-archives` — the hub: the science archives, discovery hubs, and provenance.
- `/data-archives/{slug}` — an adaptive entry for an archive, data standard, VO protocol, or
  open-science practice.
- `/data-archives/discover/{slug}` — the archives, the data standards, the Virtual Observatory, and
  open science.

## Provenance

Curated from NASA, ESA, ESO, and the archive operators themselves. Nothing is fabricated; unknown
values are left empty.
