# Open Data

Asteria Star is being built as **open infrastructure for structured celestial
knowledge**. The website is one interface; the **knowledge graph is the
product**. Everything is generated from the same typed, versioned graph.

## Principles

- **Knowledge first** — the graph is the single source of truth.
- **Stable identifiers** — every entity has a permanent `type:slug` id that
  never changes or is recycled (see [ENTITY_IDENTIFIERS.md](./ENTITY_IDENTIFIERS.md)).
- **Open standards** — JSON and JSON-LD today; RDF/SPARQL-ready; GraphQL and
  REST contracts documented (see [API_OVERVIEW.md](./API_OVERVIEW.md)).
- **Machine- and human-readable** — structured for search engines, LLMs,
  researchers, and developers, and clear for people.
- **Versioned** — graph, schema, and dataset versions (see
  [VERSIONING_STRATEGY.md](./VERSIONING_STRATEGY.md)).
- **Sourced, never invented** — facts cite authoritative sources; datasets and
  exports are generated from real entities, never fabricated.

## Access

Available today (real, static, generated from the graph):

- **Full graph** — `/data/graph.json` (JSON) and `/data/graph.jsonld` (JSON-LD,
  RDF-compatible). Each export carries graph/schema/dataset version metadata.
- **Datasets** — `/datasets` and per-dataset `JSON` (`/datasets/{slug}/json`)
  and `CSV` (`/datasets/{slug}/csv`). See [DATASET_CATALOG.md](./DATASET_CATALOG.md).
- **Registries** — `/registry` (schema, identifiers, relationships) and
  `/entity-index`.
- **Developers** — `/developers` (versioned, typed API contracts; the live API
  is planned, not implemented).

## License

The knowledge graph and datasets are offered under **CC BY-SA 4.0** (see
[LICENSING_POLICY.md](./LICENSING_POLICY.md)). Imagery is governed separately by
its own license metadata (see [IMAGE_PLATFORM.md](./IMAGE_PLATFORM.md)).

## What is NOT here

No live API, no fabricated download files, no fake checksums (checksums are
placeholders, published at release), and no invented scientific data.

## Citation API (Program O)

The citation registry is exposed read-only through the Open Data API:

- `GET /api/v0/citations` — the full registry, filterable by `type`, `source`,
  `entity`, or `dataset`, paginated. Every record is real and source-backed.
- `GET /api/v0/citations/{id}` — one citation with its formatted references
  (APA / Chicago / MLA / Harvard / BibTeX / RIS) from the Citation Engine.

Both are GET-only, wrapped in the standard provenance envelope, and listed in the
OpenAPI document (implemented endpoints only). No write endpoints; no fabricated
citations or DOIs. The `citation-registry` dataset in the catalogue reports the
real record count and links to `/api/v0/citations`.
