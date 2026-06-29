# Dataset Catalog

Datasets are **views over the canonical knowledge graph** — generated from real,
typed entities, never fabricated, and never duplicating the graph (they
reference the same entities). Defined in [`src/lib/datasets.ts`](../src/lib/datasets.ts);
browsable at `/datasets`.

## Each dataset provides

- description, version (dataset v1.0.0), **live entity count**, last generated,
  license (CC BY-SA 4.0), and source references;
- download formats: **JSON** (`/datasets/{slug}/json`) and **CSV**
  (`/datasets/{slug}/csv`) — available now; **JSON-LD** via the full graph
  export; **RDF/Turtle** and **GraphQL** — planned;
- a **checksum placeholder** ("—", published at release — never fabricated).

## Datasets

Stars, Planets, Dwarf Planets, Moons, Exoplanets, Galaxies, Nebulae, Deep-Sky
Objects, Constellations, Comets, Asteroids, Meteor Showers, Space Missions,
Space Telescopes, Observatories, Launch Vehicles, Space Agencies, Astronomers.

Each maps to one or more entity types; counts are computed from the live graph,
so they always match (the validator checks declared vs recomputed counts).

## Integrity

`npm run validate` checks: unique dataset slugs, and that each dataset's declared
`entityCount` equals a fresh recomputation from the graph. Datasets are derived,
not stored, so they cannot drift from the graph.

## Full-graph exports

- `/data/graph.json` — entities + relations + version metadata.
- `/data/graph.jsonld` — JSON-LD (RDF-compatible) with resolvable `@id`s.
