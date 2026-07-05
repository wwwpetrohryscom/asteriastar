# History & Philosophy of Astronomical Discovery Encyclopedia (Program BD)

How astronomy became modern science, and how it knows what it knows — the revolutions that remade
our picture of the cosmos, the instruments that opened each new window, and the philosophy that
tells us when a claim about the sky is really knowledge.

This layer **reuses** the astronomers (Copernicus, Galileo, Kepler, Newton, Herschel, Hubble), the
astronomy eras (Greek, Renaissance, the Scientific Revolution, contemporary), the spectroscopy,
gravitational-wave, and error-analysis-and-calibration methods, the transit exoplanet method, the
Hubble tension, Sagittarius A*, the radio band, and the reproducibility-and-FAIR practice already in
the graph. The new entities are the discovery methodologies, the philosophy-of-science concepts, and
the thematic histories.

## Data model

`HistoryRecord` is a discriminated record over `HistoryKind`:

| kind | entity type | meaning |
| --- | --- | --- |
| `methodology` | `discovery_methodology` | a methodology of discovery |
| `philosophy` | `philosophy_of_science` | a philosophy-of-science concept |
| `theme` | `history_theme` | a thematic history of discovery |

Cross-references: `relatedKeys` (→ `associated_with` the reused astronomers, eras, methods, objects,
and reproducibility practice, and the sibling BD entities). A theme may carry an `eraLabel`
(e.g. "16th–17th century").

## Contents

- **8 thematic histories** — the Copernican Revolution, and the histories of the telescope,
  spectroscopy, radio astronomy, cosmology, exoplanets, gravitational waves, and black holes.
- **8 discovery methodologies** — the scientific method, paradigm shifts, scientific revolutions,
  instrumentation-driven discovery, observational bias, theory & observation, Big Science, and the
  data & AI revolution.
- **6 philosophy-of-science concepts** — scientific realism, falsifiability, the nature of evidence,
  measurement uncertainty, replication & reproducibility, and open science.

## Reuse & the graph

Each entity links to the people and ideas that made the story: the Copernican Revolution to
Copernicus, Galileo, Kepler, and the Scientific-Revolution era; the history of the telescope to
Galileo and Herschel; the history of cosmology to Hubble and the Hubble tension; the history of
gravitational waves to the GW-detection method and the binary-black-hole merger; measurement
uncertainty to the error-analysis method; open science and replication to the reproducibility
practice. Every emitted relation is deduped against `LEGACY_RELATION_IDS`, and any relation whose
endpoint does not resolve is dropped.

## Honesty

Historical attributions (Kuhn on paradigms, Popper on falsifiability, Jansky on radio astronomy,
Einstein's 1916 prediction and the 2015 detection, Galileo's 1609 telescope) are given as the
historical record has them; no dates or discoveries are invented.

## Engine (`engine.discoveryHistory`)

`ResolvedHistory` resolves an entry to the reused entities it uses (`related`) and the other BD
entities that reference it (`usedBy`). Query surface: `themes()`, `methodology()`, `philosophy()`
(each sorted by name), and `resolveEntry(slug)`.

## Pages

- `/discovery-history` — the hub: the great arcs of discovery, discovery hubs, and provenance.
- `/discovery-history/{slug}` — an adaptive entry for a thematic history, discovery methodology, or
  philosophy concept.
- `/discovery-history/discover/{slug}` — histories of discovery, how discovery works, and the
  philosophy of science.

## Provenance

Curated from the history and philosophy of science and NASA. Nothing is fabricated; unknown values
are left empty.
