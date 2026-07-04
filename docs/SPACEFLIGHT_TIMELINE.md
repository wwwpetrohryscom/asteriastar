# Space Missions Timeline & Historical Events Encyclopedia (Program AK)

The chronological history of spaceflight — told as a connected timeline of eras, dated events,
milestone firsts, and standing records, each a first-class knowledge-graph entity.

This layer adds **no parallel knowledge**. The missions, mission programs, astronauts, space
agencies, stations, telescopes, and worlds already in the graph are **reused**; the new
entities are the *chronology* that ties them together — what happened, when, and why it
mattered.

## Data model

`TimelineRecord` is a discriminated record over `TimelineKind`:

| kind | entity type | meaning |
| --- | --- | --- |
| `era` | `historic_space_event` | a historic period of spaceflight (the events belong to it) |
| `event` | `timeline_event` | a specific dated event |
| `milestone` | `mission_milestone` | a "first" — a milestone achievement |
| `record` | `record` | a standing superlative (most distant, fastest, longest, …) |

Each dated record carries a `year` (for deterministic sorting) and a human `dateLabel`
(given only to the precision that is well established). Cross-references: `eraSlug`
(→ `part_of` its era), `relatedKeys` and `bodyKey` (→ `associated_with` the reused missions,
people, agencies, stations, telescopes, and worlds it concerns).

## Reuse

Every event links out to entities that already exist — `space_mission:apollo-11`,
`astronaut:yuri-gagarin`, `mission_program:space-shuttle`, `space_station:salyut-1`,
`space_telescope:hubble-space-telescope`, `satellite:international-space-station`,
`dwarf_planet:pluto`, `comet:churyumov-gerasimenko`, and so on. Nothing is duplicated. Every
emitted relation is deduped against `LEGACY_RELATION_IDS` (every relation defined by every
other catalog), and any relation whose endpoint does not resolve is dropped.

## Engine (`engine.spaceflightHistory`)

`ResolvedTimeline` resolves an entry to its era, the reused entities it concerns, and (for an
era) its member events in chronological order. Query surface: `eras()`, `timeline()` (all
dated events + milestones, chronological), `events()`, `milestones()`, `recordsList()`,
`byEra(slug)`, `byCategory(cat)`, and `resolveEntry(slug)`.

## Pages

- `/timeline` — the hub: eras, discovery hubs, and provenance.
- `/timeline/{slug}` — an adaptive entry for an era, event, milestone, or record.
- `/timeline/discover/{slug}` — the master timeline, eras, firsts & milestones, records, and
  the human- and robotic-exploration histories; chronological hubs render as a timeline rail.

## Provenance

Curated from NASA, ESA, and national space-agency records. Dates are given only to the
precision that is well established; unknown values are omitted. Historic failures (Challenger,
Columbia) are recorded factually and respectfully. Nothing is fabricated.
