# Space Policy, Sustainability & Space Economy Encyclopedia (Program BC)

The institutional and operational layer of modern space activity — the law, the sustainability, and
the economy that govern what happens above the atmosphere.

This layer **reuses** the on-orbit-servicing process, the in-situ-resource-utilisation domain, the
planetary-protection topic and its forward-/backward-contamination measures, the space-weather
satellite-impact, and NASA already in the graph. The new entities are the space-law treaties, the
policy and sustainability topics, and the space-economy topics; the governing organisations join as
`organization` entities.

## Data model

`PolicyRecord` is a discriminated record over `PolicyKind`:

| kind | entity type | meaning |
| --- | --- | --- |
| `treaty` | `space_treaty` | a space-law treaty or accord |
| `topic` | `space_policy_topic` | a space-policy / sustainability topic |
| `economy` | `space_economy_topic` | a space-economy topic |
| `organization` | `organization` | a governing organisation — a **new entity of the existing type** (like NASA and ESA) |

Cross-references: `relatedKeys` (→ `associated_with` the reused on-orbit-servicing, ISRU,
planetary-protection, and satellite entities, and the sibling BC entities). Each record carries a
`tagLabel` (e.g. "1967 treaty", "Sustainability", "UN body").

### Reusing the organization type

UNOOSA, COSPAR, the ITU, and the IAF are created as `organization:` entities — the **same type** as
NASA and ESA — rather than a parallel governing-body type. Only the treaties, policy topics, and
economy topics are genuinely new types.

## Contents

- **5 treaties & accords** — the Outer Space Treaty (1967), the Liability Convention (1972), the
  Registration Convention (1975), the Moon Agreement (1979), and the Artemis Accords (2020).
- **11 policy & sustainability topics** — orbital debris, the Kessler syndrome, space situational
  awareness, space traffic management, debris mitigation, mega-constellations, launch licensing,
  spectrum & orbital-slot allocation, export control & dual-use, space-resource policy, and
  planetary-protection policy.
- **4 space-economy topics** — commercial launch, the satellite economy, space insurance, and the
  space economy.
- **4 organisations** — UNOOSA, COSPAR, the ITU, and the IAF.

## Reuse & the graph

Each entity links to the parts of the graph it governs: the space-resource policy and the Moon
Agreement to the ISRU domain; the planetary-protection policy to the planetary-protection topic and
the forward-contamination measure and COSPAR; orbital debris and the satellite economy to the
space-weather satellite impact; the space economy to on-orbit servicing. Every emitted relation is
deduped against `LEGACY_RELATION_IDS`, and any relation whose endpoint does not resolve is dropped.

## Honesty

Treaty adoption years are historical facts. No treaty membership counts, market sizes, or debris
statistics are invented; where numbers would be needed they are described qualitatively.

## Engine (`engine.spacePolicy`)

`ResolvedPolicy` resolves an entry to the reused entities it uses (`related`) and the other BC
entities that reference it (`usedBy`). Query surface: `treaties()`, `topics()`, `economy()`,
`organizations()` (each sorted by name), and `resolveEntry(slug)`.

## Pages

- `/space-policy` — the hub: the policy & sustainability topics, discovery hubs, and provenance.
- `/space-policy/{slug}` — an adaptive entry for a treaty, policy topic, economy topic, or
  organisation.
- `/space-policy/discover/{slug}` — space law, policy & sustainability, the space economy, and
  governing bodies.

## Provenance

Curated from the UN space treaties, UNOOSA, COSPAR, and NASA. Treaty years are historical facts;
nothing is fabricated; unknown values are left empty.
