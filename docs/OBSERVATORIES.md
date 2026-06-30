# Observatories & Telescopes (Program F)

Program F turns the instruments and places humans use to observe the universe
into first-class knowledge-graph entities: **observatories, ground and space
telescopes, instruments, sky surveys, observing bands, and observing sites**.
Everything is graph-driven and built from authoritative public sources.

## Data & sourcing

The dataset is hand-curated from NASA, ESA, ESO, NOIRLab, NSF, NRAO, NAOJ,
STScI, Caltech/IPAC, and observatory pages. The no-fabrication rule is strict:
apertures, altitudes, first-light dates, operators, instruments, survey
coverage, and discoveries are only recorded when well-established; uncertain
fields are **omitted, never invented**. **Future facilities (ELT, TMT, SKA, the
Roman Space Telescope) are clearly marked and never presented as operational.**
The dataset is then put through an adversarial fact-check.

## Scale (first iteration)

108 records — **86 new graph entities** and 22 enriching existing ones:

| Kind | Count | | Kind | Count |
|------|------:|---|------|------:|
| Telescopes (ground) | 25 | | Instruments | 11 |
| Observatories | 18 | | Sky surveys | 10 |
| Space telescopes | 18 | | Organizations | 11 |
| Observing bands | 12 | | Observing sites | 3 |

## Pipeline

```
curated data (data/bands|sites-orgs|observatories|telescopes|spacetelescopes|instruments|surveys.ts)
  → src/knowledge-graph/data/observatory-catalog/index.ts   (resolve slugs → entities + relations)
  → src/platform/data-engine/observatory-engine.ts          (engine.observatories)
  → src/app/observatories/**                                (hub, object pages, discovery)
```

### Enrichment vs creation

The ten existing observatory entities (Mauna Kea, Keck, VLA, ALMA, Palomar,
Gemini, Rubin, plus the VLT, GBT, and FAST — which existed as `observatory`
entities), the eight existing space telescopes (Hubble, JWST, Spitzer, Chandra,
Kepler, TESS, Gaia, Roman), and the four JWST/Hubble instruments (NIRCam, MIRI,
NIRSpec, WFC3) created in Program D are **reused by id and enriched**; everything
else is created. The catalog dedupes its derived relations against every existing
graph edge (the human-spaceflight catalog's dedupe set plus its derived
relations), so it never duplicates an edge.

### Relations

New relation types model how we observe: `located_at`, `part_of_observatory`,
`hosts_telescope`, `uses_instrument`, `has_instrument`, `observes_band`,
`observed_object`, `conducts_survey`, `part_of_survey`, `surveyed_by`,
`related_discovery`, `predecessor_of`, and `successor_of` — alongside reused
`operated_by` and `built_by`. Observatories link to their site, operator, and
observing bands; telescopes to their observatory; instruments to their host;
surveys to the facility that conducts them and the bands they cover.

## Pages

- `/observatories` — hub: largest telescopes, discovery, provenance.
- `/observatories/{slug}` — an adaptive page serving all kinds (observatory,
  telescope, space telescope, instrument, survey, band, site, organization):
  hero, quick facts, overview, technical characteristics, telescopes,
  instruments, observing bands, surveys, discoveries, knowledge connections,
  sources, and a quality/authority panel.
- `/observatories/discover/{slug}` — 18 generated discovery lists (all/ground/
  space observatories, optical/radio/infrared/X-ray/gamma-ray telescopes, solar,
  survey telescopes, sky surveys, instruments, largest, historic, future,
  gravitational-wave, neutrino, and multi-messenger).

## Validation

`validateObservatories()` checks duplicate ids/slugs, id format, kind/prefix
agreement, sources, and that **every new entity carries at least one relation**
(no isolated nodes). The catalog passes the standard graph, architecture, build,
lint, and link gates.
