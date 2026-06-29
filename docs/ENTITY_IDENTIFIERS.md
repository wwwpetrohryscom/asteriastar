# Entity Identifier Guide

Every entity in the knowledge graph has a **permanent global identifier**.

## Scheme

```
type:slug
```

- `type` — the entity type (snake_case), e.g. `star`, `planet`, `dwarf_planet`,
  `moon`, `galaxy`, `nebula`, `constellation`, `star_cluster`, `black_hole`,
  `asteroid`, `comet`, `meteor_shower`, `catalog`, `space_mission`,
  `launch_vehicle`, `satellite`, `space_telescope`, `observatory`, `astronomer`,
  `organization`, `mythology_figure`, `astrology_sign`, `astrology_planet`,
  `exoplanet`.
- `slug` — a lowercase, kebab-case slug derived from the name.

Examples: `star:sirius`, `planet:mars`, `moon:europa`,
`galaxy:andromeda-galaxy`, `black_hole:sagittarius-a-star`,
`space_mission:apollo-11`, `space_telescope:james-webb-space-telescope`,
`organization:nasa`, `astronomer:galileo-galilei`.

## Rules

1. **Permanent.** Once published, an id never changes.
2. **Never recycled.** An id is never reused for a different entity.
3. **Validated.** `validateGraph()` enforces the `^[a-z_]+:[a-z0-9-]+$` format
   and global uniqueness; the build fails otherwise.
4. **Separation by design.** Science and astrology counterparts are distinct
   entities (e.g. `planet:mars` vs `astrology_planet:mars`).

## Why prefixes differ from some shorthands

Public shorthands like "mission:apollo-11" or "agency:nasa" map to the canonical
ids `space_mission:apollo-11` and `organization:nasa`. The canonical ids use the
full type name and are the stable, machine-readable identifiers used everywhere
(graph, exports, JSON-LD `identifier`, future API).

## Resolvability

Each entity resolves to a page — its content entry if it has one, otherwise a
standalone graph page at `/explore/entity/{type}/{slug}`. The JSON-LD export uses
the resolvable URL as the node `@id` and carries the bare id as `identifier`.
