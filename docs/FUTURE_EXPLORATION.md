# Future Space Exploration & Mission Concepts Encyclopedia (Program AN)

A future-exploration authority — official and highly-credible planned missions and mission
concepts, each with its status and open questions stated honestly.

This layer **reuses** the missions already in the graph that are in development or en route
(Europa Clipper, MMX, Comet Interceptor, JUICE, Mars Sample Return, the Roman telescope), the
agencies, and the target bodies. The new entities are the *exploration themes* and the
*mission concepts* not yet modelled.

## Data model

`ConceptRecord` is a discriminated record over `ConceptKind`:

| kind | entity type | meaning |
| --- | --- | --- |
| `theme` | `exploration_theme` | a theme of future exploration (the grouping) |
| `concept` | `mission_concept` | a planned mission or mission concept |

Per the mission spec, every concept carries the required fields: **status** (an honest
`ConceptStatus` from `concept` → `en-route`), **agencyKey** (a reused organization),
**timelineLabel** (only when publicly stated), **goals**, **targetKey** (a reused body),
**technology**, and **uncertainties**. Cross-references emit `member_of_group` (concept →
theme) and `associated_with` (concept → agency, target, and related reused entities).

## Honesty

Only official or credible concepts are included. Status is never overstated: Artemis II/III
and Mars Sample Return are `planned`; DAVINCI, NEO Surveyor, LISA, and Dragonfly are
`selected`/`in-development`; the Habitable Worlds Observatory is `under-study`; the Uranus
Orbiter and Probe is `proposed`; the Interstellar Probe is a `concept`. Launch dates are given
only when publicly stated, and each concept's `uncertainties` field states plainly what is not
yet settled.

## Reuse

`REUSED_CONCEPTS` (in `index.ts`) enriches the existing in-development / en-route missions
into a theme via `member_of_group`, so they appear alongside the new concepts without being
duplicated — they keep their canonical pages. Every emitted relation is deduped against
`LEGACY_RELATION_IDS`, and any relation whose endpoint does not resolve is dropped.

## Engine (`engine.futureMissions`)

`ResolvedConcept` resolves an entry to its theme, agency, target, the reused entities it
concerns, and (for a theme) its member concepts plus the reused missions in it. Query surface:
`themes()`, `conceptsList()`, `byTheme(slug)`, `byStatus(s)`, `memberSet(themeSlug)`, and
`resolveEntry(slug)`.

## Pages

- `/future-exploration` — the hub: themes, discovery hubs, and provenance.
- `/future-exploration/{slug}` — an adaptive entry for a theme or a mission concept (with its
  status, timeline, goals, technology, and uncertainties).
- `/future-exploration/discover/{slug}` — themes, human & lunar, planetary missions, and future
  observatories.

## Provenance

Curated from NASA and ESA. Only official or credible concepts; nothing is fabricated.
