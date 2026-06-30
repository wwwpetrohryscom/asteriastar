# Space Stations & Human Spaceflight (Program E)

Program E turns the human presence in space into first-class knowledge-graph
entities: **space stations, station modules, crewed and cargo spacecraft, human
spaceflight programs, astronauts, expeditions, spacewalks (EVAs), docking and
life-support systems, experiments, and space-medicine topics**. Everything is
graph-driven and built from authoritative public sources.

## Data & sourcing

The dataset is hand-curated from NASA, ESA, Roscosmos, JAXA, CSA, CNSA, and
Smithsonian public records. The no-fabrication rule is strict: crew rosters,
launch and landing dates, EVA durations, station modules, and operational status
are only recorded when well-established; uncertain fields are **omitted, never
invented**. **Planned stations (Axiom, Lunar Gateway) are clearly marked and are
never presented as operational.** The dataset is then put through an adversarial
fact-check.

## Scale (first iteration)

89 records — **80 new graph entities** and 9 enriching existing ones:

| Kind | Count | | Kind | Count |
|------|------:|---|------|------:|
| Station modules | 17 | | Expeditions | 10 |
| Crewed spacecraft | 11 | | EVAs / spacewalks | 6 |
| Human spaceflight programs | 14 | | Astronauts (new) | 5 |
| Space stations | 12 | | Cargo spacecraft | 5 |
| Docking systems | 3 | | Space-medicine topics | 4 |
| Space experiments | 1 | | Life-support systems | 1 |

## Pipeline

```
curated data (data/stations|modules|spacecraft|programs|astronauts|expeditions|evas|systems.ts)
  → src/knowledge-graph/data/human-spaceflight-catalog/index.ts   (resolve slugs → entities + relations)
  → src/platform/data-engine/human-spaceflight-engine.ts          (engine.humanSpaceflight)
  → src/app/human-spaceflight/**                                  (hub, object pages, discovery)
```

### Enrichment vs creation

The ISS (already a `satellite` entity), the eight reused human-spaceflight
programs (Vostok, Voskhod, Mercury, Gemini, Apollo, Skylab, Space Shuttle,
Artemis as `mission_program` entities), and the astronauts created in Program D
(Gagarin, Armstrong, Leonov, Whitson, …) are **reused by id and enriched**;
everything else is created. The catalog dedupes its derived relations against
every existing graph edge (the exploration catalog's dedupe set plus its derived
relations), so it never duplicates an edge.

### Relations

New relation types model the human presence in space: `part_of_station`,
`attached_to`, `docked_with`, `visited_station`, `served_on_expedition`,
`commanded_expedition`, `performed_eva`, `launched_aboard`, `returned_aboard`,
`crewed_by`, `carried_crew`, `carried_cargo`, `supported_by`, `replaced_by`, and
`built_by` — alongside reused `operated_by`, `part_of_program`, `launched_by`,
and `part_of_mission`. Modules link to their station, expeditions to the station
and their crew, EVAs to their participants and mission, and so on.

## Pages

- `/human-spaceflight` — hub: space stations, discovery, provenance.
- `/human-spaceflight/{slug}` — an adaptive page serving all kinds (stations,
  modules, spacecraft, programs, astronauts, expeditions, EVAs, systems): hero,
  quick facts, overview, highlights, modules/crew/participants, knowledge
  connections, sources, and a quality/authority panel.
- `/human-spaceflight/discover/{slug}` — 17 generated discovery lists (all/
  operational/historical/planned stations, ISS modules, programs, crewed and
  cargo spacecraft, astronauts/cosmonauts/taikonauts, expeditions, EVAs and
  milestones, commercial crew, lunar human spaceflight, station science).

## Validation

`validateHumanSpaceflight()` checks duplicate ids/slugs, id format, kind/prefix
agreement, sources, and that **every new entity carries at least one relation**
(no isolated nodes). The catalog passes the standard graph, architecture, build,
lint, and link gates.
