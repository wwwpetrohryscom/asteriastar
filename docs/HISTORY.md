# History of Astronomy Encyclopedia (Program H)

Program H turns the history of astronomy — the people, discoveries, publications,
theories, catalogues, and eras that built our understanding of the universe —
into first-class knowledge-graph entities, connected to the observatories,
telescopes, missions, and objects already in the platform. It is not simply a
collection of biographies; it is the history of humanity discovering the cosmos,
and everything is graph-driven.

## Scope

- **47 astronomers** — from Hipparchus and Aryabhata to Mayor, Ghez, and Genzel.
  **16 are reused** from the existing graph (Galileo, Copernicus, Kepler, Newton
  is new, Hubble, the Herschels, Ptolemy, …) and **31 are new**. Reused
  astronomers are enriched and made canonical at `/history/{slug}` — never
  duplicated.
- **22 discoveries** — the Galilean moons, the phases of Venus, Uranus, the
  prediction of Neptune, the expanding universe, the cosmic microwave
  background, pulsars, the first exoplanet, gravitational waves, the first
  black-hole image, and more.
- **11 publications** — the Almagest, De revolutionibus, Sidereus Nuncius,
  the Principia, Cosmos, A Brief History of Time, and others.
- **6 theories** — geocentrism, heliocentrism, Kepler's laws, universal
  gravitation, general relativity, and the Big Bang.
- **11 catalogues** — the Almagest catalogue, Zij-i-Sultani, the Messier and
  NGC catalogues (reused), the Henry Draper and Harvard/Yerkes classifications,
  and the Hipparcos and Gaia catalogues.
- **14 eras and traditions** — Babylonian, Egyptian, Greek, Roman, Islamic,
  Chinese, Indian, and Mayan astronomy, plus the Renaissance, the Scientific
  Revolution, the Modern, Space Age, and Contemporary periods.
- **4 events** and **2 awards** (the Nobel Prize in Physics and the Breakthrough
  Prize).

## Sources & integrity

Every biography, date, discovery, publication, attribution, and award is drawn
from authoritative reference sources — the **IAU, NASA, ESA, ESO, NASA ADS, the
Nobel Foundation, and Encyclopaedia Britannica**. **Nothing is fabricated.**
Attributions are handled carefully: collaborative discoveries with no single
credited astronomer (LIGO's gravitational waves, the Event Horizon Telescope's
black-hole image) are attributed to the facility and described in prose; the
famous pulsar Nobel omission is represented honestly (Bell Burnell is linked to
the Breakthrough Prize, not the Nobel).

## Entity & relation model

New entity types: `historical_discovery`, `publication`, `astronomical_theory`,
`astronomy_era`, `historical_event`, `scientific_award` (astronomers reuse the
existing `astronomer` type; catalogues reuse `catalog`).

New relation types: `discovered`, `predicted`, `published`, `developed`,
`observed`, `worked_at`, `collaborated_with`, `influenced`, `student_of`,
`teacher_of`, `received_award`, `introduced`, `invented`, `first_observed`,
`confirmed`, `refuted` — all in the science domain, all carrying provenance, and
deduped against every edge defined by earlier catalogs.

## Pipeline

```
src/knowledge-graph/data/history-catalog/data/*.ts   (curated records: astronomers, discoveries, …)
  → src/knowledge-graph/data/history-catalog/index.ts   (derives entities + relations; validates; no orphans)
  → src/platform/data-engine/history-engine.ts          (engine.history — the 24th module)
  → src/app/history/**                                   (hub, adaptive object pages, discovery collections)
  → src/lib/timelines.ts                                 (graph-generated History of Astronomy timeline)
```

## Pages

- `/history` — hub: eras, featured astronomers, discovery collections, timeline.
- `/history/{slug}` — an adaptive page serving astronomers, discoveries,
  publications, theories, catalogues, eras, events, and awards (hero, quick
  facts, biography/overview, contributions, discoveries, publications, related
  scientists, observatories/objects, knowledge connections, sources, quality).
- `/history/discover/{slug}` — 16 curated collections (Ancient / Greek / Islamic
  / Renaissance / Modern Astronomy, Women in Astronomy, Astronomers A–Z,
  Scientific Discoveries, Historic Publications, History of Telescopes /
  Observatories / Space Exploration / Cosmology / Exoplanets / Black Holes, and
  Nobel Prize in Astronomy).
- `/timelines/history-of-astronomy` — the full chronology, generated from graph
  data.

## Validation

`validateHistory()` checks duplicate ids, id format, `/history` slug uniqueness,
referential integrity (every referenced astronomer/theory/discovery/era slug
exists), **no orphan entities**, and that **every astronomer — reused or new —
connects to the history graph**. The catalog passes the standard graph,
architecture, build, lint, and link gates.
