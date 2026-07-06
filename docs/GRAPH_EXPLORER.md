# Scientific Knowledge Graph Explorer (Program BR)

Everything AsteriaStar knows is one connected graph — over 7,000 entities joined by more than 11,000
relations. This explorer opens it up: count its parts, walk an entity's neighbourhood, or trace the
shortest chain of relations between any two things in the cosmos.

**Honesty first.** The computed views run **real graph algorithms over the actual graph**
(`src/lib/graph-explorer/algorithms.ts`) — breadth-first neighbourhoods and shortest paths, live
counts, and degree statistics. Every number is *counted* from the real entities and relations, and
every path is a *genuine* chain of relations. Nothing is fabricated. The rendering views
(force-directed, hierarchical, cluster) are visualisation modes over the same real data, and the
graph API is an architecture-ready interface.

## Data model

`GraphViewRecord` (single entity type `graph_view`) carries a `backing`
(`computed` — a live algorithm, `rendering` — a visualisation mode, or `architecture` — an interface),
a `capability` (a short label), and `relatedKeys` linking each view to the example entities it
demonstrates and its sibling views.

## The algorithms (`src/lib/graph-explorer/algorithms.ts`)

Adjacency over the real relations is built once at module load. On top of it:

- `getStatistics()` — entity, relation, and type counts; the domain split; the largest entity types;
  the average degree; and the most-connected hubs — all counted live.
- `getNeighborhood(id, depth)` — a breadth-first neighbourhood of any entity, grouped by hop distance.
- `getShortestPath(a, b)` — a breadth-first shortest path: the real chain of relations linking two
  entities (e.g. Sirius → the Winter Hexagon → Taurus → the Crab Nebula → the Deep-Sky Atlas →
  Andromeda).
- `searchEntities(q)` — a direct name search across every entity.

## Contents — 17 views

- **Computed (13)** — graph statistics, knowledge metrics, entity explorer, relation explorer,
  neighbourhood explorer, shortest-path finder, taxonomy explorer, cross-domain explorer, graph
  search, and the mission, institution, discovery, and scientific-lineage graphs.
- **Rendering (3)** — force-directed graph, hierarchical graph, cluster visualisation.
- **Architecture (1)** — the graph API.

## Engine (`engine.graphExplorer`)

`ResolvedGraphView` resolves a view to the example entities it demonstrates (`related`) and its
sibling views. The engine also exposes the real algorithms directly: `statistics()`,
`neighborhood(id, depth)`, `shortestPath(a, b)`, `search(q)`, plus `all()`, `computedViews()`, and
`resolveEntry(slug)`.

## Pages

- `/graph` — the hub: the graph's live statistics, the discovery hubs, and the full view catalogue.
- `/graph/{slug}` — a view; computed views render a real, live demo (statistics; a real neighbourhood;
  a real shortest path).
- `/graph/discover/{slug}` — the live tools, and the lenses & visualisations.

## Provenance

The explorer adds only the view definitions; the data it explores is the entire existing knowledge
graph, with all its own provenance. Every figure is counted live and every path is a real chain of
relations; nothing is fabricated.
