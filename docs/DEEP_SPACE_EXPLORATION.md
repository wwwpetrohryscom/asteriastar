# Deep-Space Human Exploration & Habitation Encyclopedia (Program BI)

Sending people to the Moon to stay, and one day to Mars, is less a rocketry problem than a habitation
problem. This layer maps the architecture of living beyond Earth — the bases, transit habitats,
power and propulsion — and the hard human challenges of radiation, isolation, and self-sufficiency
that only sharpen the farther a crew travels from home.

Because this domain is already richly served by the platform's human-spaceflight, space-medicine,
space-infrastructure, and spacecraft-systems catalogs, this layer is deliberately an **architecture
and integrative-challenge layer built on top of the existing primitives**. It **reuses** the
**Artemis program**, the **Lunar Gateway**, **in-situ resource utilisation** and **regolith
processing**, the **ECLSS**, **closed-loop** and **bioregenerative life support** and **space
agriculture**, the **countermeasures** (radiation shielding, artificial gravity, exercise,
psychological support, telemedicine), the **inflatable habitat** and the **lunar surface base**, the
**surface-operations** phase,
**nuclear-thermal propulsion**, the **additive-manufacturing** and **autonomous-construction**
processes, **planetary protection**, the **Deep Space Network**, and the **space-medicine** and
**human-factors** topics already in the graph. The new entities are the deep-space mission and
habitation architectures and the integrative human challenges. **No existing life-support,
countermeasure, ISRU, habitat, or medicine entity is re-minted.**

## Data model

`DeepExplorationRecord` is a discriminated record over `DeepExplorationKind`:

| kind | entity type | meaning |
| --- | --- | --- |
| `architecture` | `exploration_architecture` | a deep-space mission or habitation architecture |
| `challenge` | `deep_space_challenge` | an integrative human challenge of deep-space flight |

Cross-references: `relatedKeys` (→ `associated_with` the reused programs, systems, countermeasures,
and topics, and the sibling BI entities). An entry may carry a `symbolLabel` (e.g. "up to ~20 min
each way") and `highlights`.

## Contents

- **8 exploration architectures** — the Moon-to-Mars architecture, the Mars surface base, the
  deep-space transit habitat, surface power systems, planetary surface mobility, space construction
  for habitats, crewed deep-space propulsion, and Mars entry, descent & landing. (The lunar surface
  base is reused from the existing `space_infrastructure:lunar-surface-base`, not duplicated.)
- **7 deep-space challenges** — the deep-space radiation challenge, the communication time delay,
  Earth independence & crew autonomy, long-duration life support, behavioural health & crew cohesion,
  planetary protection for crewed missions, and the planetary dust challenge.

## Reuse & the graph

Each entity links to the programs and systems that make it real: the Moon-to-Mars architecture to
the Artemis program and the Lunar Gateway; surface power, mobility, and the dust challenge to the
existing lunar surface base; the transit habitat to closed-loop life support,
radiation shielding, and artificial gravity; long-duration life support to the ECLSS, closed-loop and
bioregenerative life support; the radiation challenge to the space-radiation topic and radiation
shielding; behavioural health to the space-psychology topic and psychological support; planetary
protection to the astrobiology planetary-protection topic and forward contamination; the
communication delay to the Deep Space Network. Every emitted relation is deduped against
`LEGACY_RELATION_IDS`, and any relation whose endpoint does not resolve is dropped.

## Honesty

Only well-established plans and physics are stated — the Moon-to-Mars proving-ground strategy, the
lunar-south-pole siting for water ice, the up-to-~20-minute one-way light-time delay to Mars, the
galactic-cosmic-ray and solar-particle radiation environment beyond the magnetosphere, the toxic
perchlorates in Martian soil, the thin Martian atmosphere that complicates landing. Nothing about
crew sizes, launch dates, mission costs, or reactor power levels is invented; unknown values are left
empty.

## Engine (`engine.deepSpaceExploration`)

`ResolvedDeepSpaceExploration` resolves an entry to the reused entities it uses (`related`) and the
other BI entities that reference it (`usedBy`). Query surface: `architecture()`, `challenges()`
(each sorted by name), and `resolveEntry(slug)`.

## Pages

- `/deep-space-exploration` — the hub: the architecture of living beyond Earth, discovery hubs, and
  provenance.
- `/deep-space-exploration/{slug}` — an adaptive entry for an exploration architecture or deep-space
  challenge.
- `/deep-space-exploration/discover/{slug}` — the architectures of exploration and the challenges of
  deep space.

## Provenance

Curated from NASA and the human-exploration literature. Nothing is fabricated; unknown values are
left empty.
