# Cosmology & Universe Encyclopedia (Program I)

Program I turns the complete scientific model of the Universe into first-class
knowledge-graph entities: **cosmological and physical concepts, cosmological
models, astrophysical object classes, and observational programs** — connected
to the theories, discoveries, scientists, black holes, missions, and
observatories already in the platform. Everything is graph-driven.

## The consensus classification (the defining feature)

Every topic carries an explicit, visible **consensus level**, and established
science is never conflated with speculation:

- **Established Science** — observationally confirmed and consistent across all leading models.
- **Strong Evidence** — strongly supported by multiple independent observations; some details open.
- **Active Research** — a leading paradigm or an area of intense study, not yet settled.
- **Scientific Debate** — competing interpretations of the current evidence.
- **Speculative Hypothesis** — a theoretical possibility with limited or no direct observational support.

The level appears as a colored badge in the hero, an inline callout stating the
honest scientific status, a sidebar card, and on every collection card.

## Scope

- **37 concepts** — the Big Bang, cosmic inflation, recombination, the CMB,
  dark matter, dark energy, redshift, the Hubble–Lemaître law, the Hubble
  constant and tension, baryon acoustic oscillations, the cosmic web,
  spacetime, special relativity, event horizons, singularities, Hawking
  radiation, gravitational waves, and more — spanning epochs, phenomena,
  physical concepts, laws, and measured quantities.
- **4 cosmological models** — ΛCDM (standard), MOND (alternative), the
  multiverse and cyclic cosmologies (speculative).
- **17 astrophysical object classes** — black holes (general, supermassive,
  intermediate, stellar, primordial), neutron stars, magnetars, white and
  brown dwarfs, quasars, blazars, AGN, dark-matter halos, galaxy clusters,
  superclusters, filaments, and voids.
- **5 observational programs** created (COBE, WMAP, DESI, KAGRA, the Event
  Horizon Telescope); Planck, Hubble, JWST, Euclid, Gaia, WISE, LIGO, Virgo,
  ALMA, the Vera Rubin Observatory, SDSS, and the Dark Energy Survey are reused.
- **Albert Einstein** is added (the one essential physicist missing from the
  graph), linked as the developer of general and special relativity.

## Reuse (never duplicate)

Program I reuses ~40 existing entities by id: the theories general relativity
and the Big Bang, the discoveries of the CMB, dark matter, cosmic expansion,
the accelerating universe, gravitational waves, and the first black-hole image;
the scientists Hubble, Lemaître, Rubin, Zwicky, Chandrasekhar, Hawking, Penzias,
Wilson, Perlmutter, Riess, Schmidt, Genzel, and Ghez; the black holes
Sagittarius A* and M87*; and the major missions and observatories. Concepts
link to these via `confirmed_by`, `related_to`, `studied_by`, and `measured_by`.

## Entity & relation model

New entity types: `cosmology_concept`, `cosmological_model`,
`astrophysical_object_class`, `observational_program`.

New relation types: `supports`, `predicts`, `confirmed_by`, `measured_by`,
`derived_from`, `depends_on`, `part_of_model`, `contradicted_by`, `requires`,
`contains`, `formed_from`, `evolved_into` — all science-domain, provenance-
bearing, and deduped against every edge defined by earlier catalogs.

## Pipeline

```
src/knowledge-graph/data/cosmology-catalog/data/*.ts   (curated concepts, models, objects, programs, timeline)
  → src/knowledge-graph/data/cosmology-catalog/index.ts   (derives entities + relations; validates; no orphans)
  → src/platform/data-engine/cosmology-engine.ts          (engine.cosmology — the 25th module)
  → src/components/cosmology/Consensus.tsx                 (ConsensusBadge / Legend / Callout / Card)
  → src/app/cosmology/**                                   (hub, adaptive object pages, discovery collections)
  → src/lib/timelines.ts                                   (graph-generated Universe timeline)
```

## Pages

- `/cosmology` — hub: consensus legend, featured topics, discovery collections, the Universe timeline.
- `/cosmology/{slug}` — an adaptive page serving concepts, models, object
  classes, observational programs, and physicists (hero with consensus badge,
  consensus callout, definition, scientific overview, historical development,
  evidence, current research, open questions, measurements, knowledge
  connections, related scientists/discoveries/missions, sources, consensus
  card, quality).
- `/cosmology/discover/{slug}` — 16 curated collections (Cosmology, Big Bang,
  Dark Matter, Dark Energy, Black Holes, Neutron Stars, Relativity,
  Gravitational Waves, Structure Formation, Galaxy Evolution, the CMB, Universe
  Timeline, Cosmological Models, Scientific Debates, Open Questions, Future
  Cosmology Missions).
- `/timelines/universe-timeline` — the cosmic chronology, generated from graph
  data, with scientific uncertainty stated honestly.

## Sources & integrity

Cosmological parameters and measurements cite their source (Planck, NASA, ESA,
ESO, LIGO, EHT, DESI, SDSS). **Nothing is fabricated**: measurements carry a
source, the Hubble constant is shown with both discordant values (the Hubble
tension), and far-future timeline entries are flagged as model-dependent
projections, not certainties.

## Validation

`validateCosmology()` checks duplicate ids, id format, `/cosmology` slug
uniqueness, that every topic carries a valid consensus level, referential
integrity of internal links, timeline-slug resolution, and **no orphan
entities**. The catalog passes the standard graph, architecture, build, lint,
and link gates.
