# Knowledge Graph

The knowledge graph is core infrastructure for Asteria Star, not a feature.
Everything above Earth is connected — a star belongs to a constellation, a
constellation is named for a myth, a zodiac sign is *traditionally* associated
with a planet — and the graph models those connections **with the
science/culture/astrology boundary built into the data**.

It lives in [`src/knowledge-graph/`](../src/knowledge-graph):

```
schema.ts     entity/relation types, domains, confidence, label maps, rules, rel()
entities.ts   aggregates the core seed + data modules
relations.ts  aggregates the core seed + data modules
data/         per-area modules (solar-system, stars-constellations, deep-sky,
              missions-telescopes, sky-events-mythology, cross-links)
helpers.ts    query/listing helpers (build maps once, no entry dependency)
validate.ts   validateGraph() — the boundary rules
index.ts      aggregates + validates at import (hard gate) + re-exports
```

Data is split into per-area modules under `data/` so the graph can grow (and
be authored) in cohesive chunks; `entities.ts`/`relations.ts` simply spread them.

## Why a graph is core

- **Connections are the product.** A reference platform is far more useful when
  a reader can move from Sirius → Canis Major → the myth of Orion, or from Leo →
  the Sun *in astrology* — while always knowing which kind of connection they're
  following.
- **The boundary must be structural.** Rather than hoping authors phrase things
  carefully, the graph types every relation by `domain` and `confidence`, and
  the validator refuses to let astrology or interpretive links pose as confirmed
  science.
- **It is the substrate for the future.** Saved entities, collections,
  recommended learning paths, and topic-following all reference graph entities
  (see [FUTURE_SOCIAL_NETWORK.md](./FUTURE_SOCIAL_NETWORK.md)).

## Model

```ts
GraphEntity  { id, type, name, domain, description?, entryPath?, aliases?, sources? }
GraphRelation{ id, from, to, type, confidence, domain, sources?, note? }
```

- **Entity types** (31): star, planet, dwarf_planet, moon, galaxy, nebula,
  constellation, black_hole, asteroid, comet, meteor_shower, eclipse,
  space_mission, spacecraft, space_telescope, observatory, astronomer,
  mythology_figure, mythology_story, astrology_sign, astrology_planet,
  astrology_house, astrology_aspect, calculator, glossary_term, guide, article,
  image_asset, observation_event, location, organization.
- **Relation types** (23): belongs_to, part_of, located_in, visible_from,
  observed_by, discovered_by, named_after, associated_with,
  mythologically_linked_to, astrologically_associated_with,
  scientifically_related_to, mission_target, operated_by, launched_by, studies,
  explains, references, has_calculator, has_gallery, has_timeline, related_to,
  parent_of, child_of.
- **Domain** (relation): `science | culture | astrology | editorial`.
- **Entity domain**: `science | culture | astrology`.
- **Confidence**: `confirmed | likely | interpretive`.

Entity ids follow `type:slug` (e.g. `star:sirius`, `constellation:canis-major`).
Crucially, astronomy and astrology "planets" are **separate entities**:
`planet:mars` (science) vs `astrology_planet:mars` (astrology). The boundary is
not a label on one entity — it is two entities.

## The boundary rules (enforced by `validateGraph`)

- No duplicate entity ids; no duplicate relation ids; relation endpoints must
  exist.
- `domain` and `confidence` must be valid values.
- **Astrology relations** (`domain: "astrology"`) must be `confidence:
  "interpretive"`. The relation type `astrologically_associated_with` must be
  `domain: "astrology"`.
- **Science relations** (`domain: "science"`) can never be `interpretive` —
  interpretive links cannot appear as confirmed science.
- Science-only relation types (`belongs_to`, `part_of`, `operated_by`,
  `discovered_by`, …) must be `domain: "science"`; `mythologically_linked_to`
  must be `domain: "culture"`.

Examples (from the seed):

| From | Relation | To | domain | confidence |
| --- | --- | --- | --- | --- |
| `star:sirius` | belongs_to | `constellation:canis-major` | science | confirmed |
| `constellation:orion` | mythologically_linked_to | `mythology_figure:orion` | culture | confirmed |
| `astrology_sign:leo` | astrologically_associated_with | `astrology_planet:sun` | astrology | interpretive |

## Size

As of Phase 3 the graph holds **157 entities** (120 science, 15 culture,
22 astrology) and **126 relations** (98 science, 13 culture, 15 astrology) —
the Solar System, stars and constellations, deep-sky objects, missions,
telescopes, observatories, organizations, astronomers, meteor showers, comets,
and sky mythology. Every fact is well-established; uncertain details are
omitted rather than asserted.

## Discovery & standalone pages

The graph powers a static discovery layer (see [ARCHITECTURE.md](./ARCHITECTURE.md)):
`/explore` and per-topic A–Z indexes, `/entity-index`, `/topic-index`,
`/discover`, and graph-driven `/connections/[slug]` relationship pages. Every
entity is browsable: those with a content entry link to it; those without get a
non-thin standalone page at `/explore/entity/[type]/[slug]` (connections +
sibling entities). Connection labels are **direction-aware**
(`relationLabel(type, outgoing)`), so incoming relations read correctly.

## Entry ↔ graph linkage

Linkage is primarily by **path**: a graph entity carries `entryPath` (the
canonical path of its content entry, if one exists), which is the single source
of truth. Entries may *also* set `graphEntityId` (plus `entityType` /
`entityDomain`) to be explicit — `getEntityForEntry()` prefers the explicit id
and falls back to a path match.

Helpers:

- Graph (no entry dependency): `getEntityById`, `getEntityForPath`,
  `getEntityCanonicalPath`, `getRelationsForEntity`, `getRelatedEntities`,
  `getScienceRelations`, `getCulturalRelations`, `getAstrologyRelations`,
  `getConnections`, `getConnectionsByDomain`.
- Bridge (in `src/content/entries`): `getEntityForEntry`, `getEntriesForEntity`.

## UI: "Knowledge connections"

The `KnowledgeConnections` component renders an entry's connections in **three
strictly separate groups** — Scientific, Cultural & mythological, and Astrology
/ symbolic — never mixed. The astrology group carries an interpretive note. The
section renders nothing when an entry has no graph entity or no connections.

## Adding to the graph

1. Add entities to `entities.ts` (set `entryPath` if a content entry exists).
2. Add relations to `relations.ts` via the `rel()` helper, choosing the correct
   `domain` and `confidence`.
3. Run `npm run validate` — it validates the graph and the entry↔graph links.
