# Versioning Strategy

Long-term compatibility is a first-class concern: the graph is meant to be
consumed by future apps, researchers, and AI for years. Version metadata lives
in [`src/knowledge-graph/version.ts`](../src/knowledge-graph/version.ts) and is
embedded in every export (`/data/graph.json`, `/data/graph.jsonld`) and shown on
`/open-data` and `/registry`.

## Versions

- **Schema version** (`SCHEMA_VERSION`, currently `1.0.0`) — bump on a breaking
  change to entity/relation shape.
- **Graph version** (`GRAPH_VERSION`, `1.0.0`) — bump on any data change.
- **Dataset version** (`DATASET_VERSION`, `1.0.0`) — bump on a published dataset
  snapshot.

Semantic versioning (`major.minor.patch`): major = breaking, minor = additive,
patch = corrections.

## Stable identifiers

Entity ids (`type:slug`) are **permanent across all versions** — never changed,
never recycled. This is the contract that lets external references stay valid as
the graph evolves. See [ENTITY_IDENTIFIERS.md](./ENTITY_IDENTIFIERS.md).

## Migration (prepared)

- New entity types / relation types are additive (minor bump) — consumers
  ignore unknown types gracefully.
- A removed or renamed type would be a major bump with a documented migration;
  ids of surviving entities never change.
- Exports always carry `version` metadata so consumers can pin or migrate.
