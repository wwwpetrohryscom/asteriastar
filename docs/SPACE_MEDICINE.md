# Life Support, Space Biology & Space Medicine Encyclopedia (Program AL)

The human-in-space scientific layer — how spaceflight changes the body, the technologies that
keep a crew alive, and the countermeasures that protect crew health on the way to the Moon and
Mars.

This layer **reuses** the ECLSS life-support system, the radiation environments, the space
stations, the crew-systems subsystem, and the astronauts already in the graph. The new
entities are the *disciplines*, the *physiological effects*, the *life-support technologies*,
and the *countermeasures*.

## Data model

`MedRecord` is a discriminated record over `MedKind`:

| kind | entity type | meaning |
| --- | --- | --- |
| `topic` | `space_biology_topic` | a discipline of space life science (the grouping) |
| `effect` | `physiological_effect` | a physiological effect of spaceflight on the body |
| `technology` | `life_support_technology` | a life-support technology (part of ECLSS) |
| `countermeasure` | `countermeasure` | a countermeasure that protects crew health |

Cross-references: `topicSlug` (→ `member_of_group` its discipline), `partOfEclss`
(technology → `part_of life_support_system:eclss`), `mitigatesSlugs` (countermeasure → the
effects it mitigates, via the new **`mitigates`** relation), and `relatedKeys`
(→ `associated_with` the reused radiation environments, stations, and astronauts).

## The `mitigates` relation

Program AL introduces one new relation type, `mitigates` (label "Mitigates", inverse
"Mitigated by"), linking a countermeasure to the physiological effect it counters — e.g.
`countermeasure:resistive-exercise` **mitigates** `physiological_effect:bone-density-loss`.
Everything else reuses `member_of_group`, `part_of`, and `associated_with`.

## Reuse

- The graph already models `bone-density-loss`, `muscle-atrophy`, `fluid-shift` (with vision
  changes), and `space-radiation` as `space_medicine_topic` entities (from the
  human-spaceflight catalog). Program AL **reuses** these — enriching each into a discipline
  and letting countermeasures mitigate them (`REUSED_EFFECTS` in `index.ts`) — rather than
  minting duplicate `physiological_effect` nodes; they keep their canonical
  `/human-spaceflight` pages. Only the effects with no existing equivalent are created new.
- Technologies are `part_of` the existing `life_support_system:eclss` — the ECLSS entity is
  enriched, never duplicated.
- Radiation effects and shielding link to the reused `radiation_environment` entities
  (galactic cosmic rays, solar energetic particles).
- Effects and countermeasures link to the reused stations (the ISS is
  `satellite:international-space-station`) and astronauts where relevant.

Every emitted relation is deduped against `LEGACY_RELATION_IDS`; any relation whose endpoint
does not resolve is dropped.

## Engine (`engine.spaceMedicine`)

`ResolvedMed` resolves an entry to its discipline, the ECLSS system (for a technology), the
effects it mitigates or the countermeasures that mitigate it, the reused entities it concerns,
and (for a discipline) its members. Query surface: `topics()`, `effects()`, `technologies()`,
`countermeasuresList()`, `byTopic(slug)`, and `resolveEntry(slug)`.

## Pages

- `/space-medicine` — the hub: disciplines, discovery hubs, and provenance.
- `/space-medicine/{slug}` — an adaptive entry for a discipline, effect, technology, or
  countermeasure (an effect lists its countermeasures; a countermeasure lists what it mitigates).
- `/space-medicine/discover/{slug}` — disciplines, physiological effects, countermeasures, and
  life-support technologies.

## Provenance

Curated from NASA and ESA human-research sources. Quantitative figures (exact loss rates,
doses) are omitted unless well established. Nothing is fabricated.
