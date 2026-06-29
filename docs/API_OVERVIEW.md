# API Overview

> **Contracts, not a live API.** No live API endpoints are implemented in this
> phase. This documents the planned, versioned, typed contracts. Open data is
> available today as static exports (see [OPEN_DATA.md](./OPEN_DATA.md)). The
> browsable contracts page is `/developers`.

All contracts are versioned (`v0`) and typed against the
[schema](./KNOWLEDGE_GRAPH_SCHEMA.md). Every response references entities by
their stable [identifier](./ENTITY_IDENTIFIERS.md); nothing duplicates the graph.

## Planned contracts

| API | Purpose | Example endpoints |
| --- | --- | --- |
| Entity | Fetch an entity + metadata by id | `GET /api/v0/entities/{id}`, `GET /api/v0/entities?type={type}` |
| Relationship | Traverse typed relations, grouped by domain | `GET /api/v0/entities/{id}/relations` |
| Search | Search entities, articles, topics | `GET /api/v0/search?q={query}` |
| Discovery | Graph-derived recommendations | `GET /api/v0/entities/{id}/recommendations` |
| Timeline | Sourced chronologies | `GET /api/v0/timelines/{slug}` |
| Comparison | Compare entities/concepts | `GET /api/v0/compare/{slug}` |
| Image Metadata | Provenance-first image metadata (no media bundled) | `GET /api/v0/entities/{id}/images` |
| Dataset | List datasets + exports | `GET /api/v0/datasets/{slug}` |
| Learning Path | Structured journeys | `GET /api/v0/learn/{slug}` |

## Available today (static)

- `GET /data/graph.json`, `GET /data/graph.jsonld`
- `GET /datasets/{slug}/json`, `GET /datasets/{slug}/csv`

These are generated at build time from the real graph — not a live service.

## Future

GraphQL and a SPARQL endpoint are anticipated; the JSON-LD export already
provides an RDF-compatible representation to build on. Versioning and migration
are covered in [VERSIONING_STRATEGY.md](./VERSIONING_STRATEGY.md).
