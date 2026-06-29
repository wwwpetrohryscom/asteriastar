# Knowledge Graph Schema

The schema is defined in [`src/knowledge-graph/schema.ts`](../src/knowledge-graph/schema.ts)
and versioned (see [VERSIONING_STRATEGY.md](./VERSIONING_STRATEGY.md)). It is
the typed contract every system reads from. The live, browsable schema registry
is at `/registry`.

## Entity

```ts
GraphEntity {
  id: string            // stable `type:slug`
  type: EntityType
  name: string
  domain: "science" | "culture" | "astrology"
  description?: string
  entryPath?: string    // canonical content-entry path, if any
  aliases?: string[]
  sources?: SourceKey[]
  // optional intelligence fields (empty when unknown, never invented):
  scientificName?: string
  catalogNumbers?: string[]
  crossReferences?: string[]
  importance?: number
}
```

**Entity types** (25): star, planet, dwarf_planet, exoplanet, moon, galaxy,
nebula, constellation, star_cluster, black_hole, asteroid, comet, meteor_shower,
eclipse, catalog, space_mission, spacecraft, launch_vehicle, satellite,
space_telescope, observatory, astronomer, mythology_figure, mythology_story,
astrology_sign, astrology_planet, astrology_house, astrology_aspect, calculator,
glossary_term, guide, article, image_asset, observation_event, location,
organization.

## Relation

```ts
GraphRelation {
  id: string            // `from|type|to`
  from: string          // entity id
  to: string            // entity id
  type: RelationType
  confidence: "confirmed" | "likely" | "interpretive"
  domain: "science" | "culture" | "astrology" | "editorial"
  sources?: SourceKey[]
  note?: string
}
```

**Relation types** (23): belongs_to, part_of, located_in, visible_from,
observed_by, discovered_by, named_after, associated_with,
mythologically_linked_to, astrologically_associated_with,
scientifically_related_to, mission_target, operated_by, launched_by, studies,
explains, references, has_calculator, has_gallery, has_timeline, related_to,
parent_of, child_of.

## Invariants (enforced by `validateGraph()`)

- Unique, well-formed entity ids; valid types/domains/confidence.
- Relation endpoints must exist.
- **No isolated nodes** — every entity has ≥ 1 relation.
- **Domain boundary**: astrology relations are `interpretive`-only; science
  relations are never `interpretive`; `astrologically_associated_with` is
  astrology-only; `mythologically_linked_to` is culture-only; science-only
  relation types must be `domain: "science"`.

See also [KNOWLEDGE_GRAPH.md](./KNOWLEDGE_GRAPH.md) for the rationale and helpers.
