# Astroinformatics & Virtual Research Ecosystem Encyclopedia (Program BH)

Astronomy has become a data-intensive science. Behind every survey result is a stack of open-source
software, elastic computing, and shared data infrastructure. This layer maps that ecosystem — the
tools astronomers compute with, the machines that do the heavy lifting, and the concepts that
organise data-intensive research.

This layer **reuses** the **Virtual Observatory** and its **Table Access Protocol**, the **FITS** and
**VOTable** standards, the **MAST**, **VizieR**, and **SIMBAD** archives, the
**reproducibility-and-FAIR**, **persistent-identifiers**, **data-pipelines-and-calibration**, and
**cross-matching** open-science practices, the **machine-learning** methods and workflows, the
**Vera C. Rubin Observatory**, and the **LSST**, **SKA**, and **Gaia** facilities already in the
graph. The new entities are the research-software packages, the research-computing infrastructure,
and the astroinformatics concepts — which **complement rather than duplicate** the existing
open-science and Virtual-Observatory entities.

## Data model

`AstroinformaticsRecord` is a discriminated record over `AstroinformaticsKind`:

| kind | entity type | meaning |
| --- | --- | --- |
| `software` | `research_software` | a research-software package or ecosystem |
| `computing` | `research_computing` | a research-computing infrastructure |
| `concept` | `astroinformatics_concept` | an astroinformatics concept or practice |

Cross-references: `relatedKeys` (→ `associated_with` the reused VO, standards, archives, practices,
ML methods, and facilities, and the sibling BH entities). An entry may carry a `symbolLabel`
(e.g. "Python") and `highlights`.

## Contents

- **6 research-software packages** — the scientific Python ecosystem, Astropy, SunPy, Jupyter
  notebooks, Astroquery, and scientific visualisation.
- **6 research-computing infrastructures** — high-performance computing, GPU computing, cloud
  computing, distributed computing, science platforms, and containerisation.
- **6 astroinformatics concepts** — scientific workflows, data provenance, the astronomical query
  languages, big-data astronomy, the virtual research environment, and research software engineering
  (a practice, filed with the concepts rather than the software packages).

## Reuse & the graph, and the reuse boundary

Each entity links to the tools and facilities that give it meaning: Astropy to the FITS standard;
Astroquery to the MAST and VizieR archives and the TAP protocol; science platforms to the Rubin
Observatory and LSST; big-data astronomy to LSST, the SKA, and Gaia; the query-languages concept to
the TAP protocol; the virtual research environment to the Virtual Observatory. The concept entities
are deliberately drawn to **complement** the existing open-science practices, not shadow them: *data
provenance* (lineage) is distinct from the reused *persistent-identifiers* (naming); *scientific
workflows* (orchestration) is distinct from the reused *data-pipelines-and-calibration*; the
*astronomical query languages* (ADQL, the language) is distinct from the reused *Table Access
Protocol* (the protocol that serves it). Every emitted relation is deduped against
`LEGACY_RELATION_IDS`, and any relation whose endpoint does not resolve is dropped.

## Honesty

Only well-established practice is stated — Astropy as the community core package, ADQL as an
SQL dialect with sky geometry served by TAP, the Rubin Science Platform as a cloud science platform,
Gaia's billion-plus stars. Nothing about version numbers, benchmark figures, or release dates is
invented; unknown values are left empty.

## Engine (`engine.astroinformatics`)

`ResolvedAstroinformatics` resolves an entry to the reused entities it uses (`related`) and the other
BH entities that reference it (`usedBy`). Query surface: `software()`, `computing()`, `concepts()`
(each sorted by name), and `resolveEntry(slug)`.

## Pages

- `/astroinformatics` — the hub: the software astronomers compute with, discovery hubs, and
  provenance.
- `/astroinformatics/{slug}` — an adaptive entry for a software package, computing infrastructure, or
  concept.
- `/astroinformatics/discover/{slug}` — research software, research computing, and data-intensive
  astronomy.

## Provenance

Curated from NASA, STScI, and NOIRLab. Nothing is fabricated; unknown values are left empty.
