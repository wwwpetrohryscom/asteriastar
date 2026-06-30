# Space Exploration Encyclopedia (Program D)

Program D turns the history of human space exploration into first-class
knowledge-graph entities: every **mission, spacecraft, launch vehicle, launch
site, space agency, mission program, astronaut, and scientific instrument**.
Everything is graph-driven and built from authoritative public sources.

## Data & sourcing

Unlike the Star, Solar System, and Deep Sky encyclopedias — each built from a
single open dataset (HYG, NASA fact sheets, OpenNGC) — space-exploration history
has no single canonical machine-readable catalogue. The dataset is therefore
**hand-curated** from authoritative public sources (NASA, ESA, JPL, and the
national space agencies). The governing rule is strict: **only well-established
public facts** (launch dates, operating agency, launch vehicle, target, outcome)
are recorded, and any uncertain field is **omitted, never invented**. The dataset
is then put through an adversarial fact-check (see below).

## Scale (first iteration)

178 records — **129 new graph entities** and 49 enriching existing ones:

| Kind | Count |
|------|------:|
| Space missions | 65 |
| Mission programs | 23 |
| Launch vehicles | 20 |
| Astronauts / cosmonauts / taikonauts | 19 |
| Space agencies & providers | 16 |
| Launch sites | 15 |
| Spacecraft | 10 |
| Scientific instruments | 10 |

The architecture scales toward thousands of missions; this iteration prioritises
quality and connectivity over count.

## Pipeline

```
curated data (data/agencies|programs|vehicles|sites|missions|spacecraft|astronauts|instruments.ts)
  → src/knowledge-graph/data/exploration-catalog/index.ts   (resolve slugs → entities + relations)
  → src/platform/data-engine/exploration-engine.ts          (engine.exploration)
  → src/app/exploration/**                                  (hub, object pages, discovery)
```

### Enrichment vs creation

The platform already held 19 missions, 10 launch vehicles, 7 telescopes, and
several agencies. Records flagged `existing: true` reuse those ids and only
**enrich** them (adding structured fields and new relations); everything else is
created. The catalog dedupes its derived relations against **every** existing
graph relation (`legacy-relations.ts`, including the extracted `core-relations`
module) so it never duplicates an edge.

### Relations

The schema gains exploration relation types: `part_of_program`, `launched_from`,
`carried_by`, `orbited`, `visited`, `returned_samples_from`, `captured_image_of`,
`contains_instrument`, `used_instrument`, `performed_experiment`,
`supports_science`, `preceded_by`, `followed_by` — alongside the existing
`operated_by`, `launched_by`, `mission_target`, and `part_of_mission`. Missions
link to their agency, program, vehicle, site, targets, spacecraft, crew, and
instruments; every relation carries provenance.

## Pages

- `/exploration` — hub: landmark missions, discovery, browse by agency.
- `/exploration/{slug}` — an adaptive page serving all eight kinds: hero, quick
  facts, overview, objectives, outcome & discoveries, mission profile (vehicle /
  site / target), spacecraft, crew, instruments, knowledge connections, related
  missions, sources, and a quality/authority panel.
- `/exploration/discover/{slug}` — 20 generated discovery lists (all missions,
  human spaceflight, Moon/Mars/Jupiter/Saturn/Solar/deep-space missions,
  orbiters/landers/rovers, sample return, historic, programs, vehicles, sites,
  agencies, astronauts, spacecraft, instruments).

## Validation

`validateExploration()` checks duplicate ids/slugs, id format, kind/prefix
agreement, sources, and — crucially — that **every new entity carries at least
one relation** (no isolated nodes). The whole catalog passes the standard graph,
architecture, build, lint, and link gates.
