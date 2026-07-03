# Scientific Data Engine

Phase 10 introduces the **Scientific Data Engine** — the execution layer of
Asteria Star ([`src/platform/data-engine/`](../src/platform/data-engine)). The
website is only one consumer; mobile, desktop, a public API, an SDK, AI
assistants, research and educational tools, and planetarium software all read
through the same engine. **Nothing reads raw graph files directly.**

```ts
import { engine } from "@/platform/data-engine";
const mars  = engine.entity.resolve("planet:mars");
const walk  = engine.traversal.traverse("star:sirius", { maxDepth: 2 });
const moons = engine.query.run("moons-of-jupiter");
```

## Principles

- **Pure & deterministic** — same input, same output; BFS in stable order.
- **Composable & cacheable** — small modules; entity resolution is memoized.
- **Framework-independent** — no React, no Next.js, no UI imports (enforced by
  `npm run check:arch`). Future CLI- and API-compatible.
- **No duplicated logic** — facade engines delegate to the existing subsystems;
  only the traversal and query engines add new logic.

## Modules

| Engine | Responsibility | Input → Output |
| --- | --- | --- |
| `entity` | Resolve everything about an entity | id → `ResolvedEntity` (identity, metadata, relationships, sources, evidence, quality, timeline, images, datasets, learning, recommendations, localization, authority) |
| `relationship` | Typed relation access | id → `Connection[]` / grouped / by type / by domain |
| `traversal` | Walk the graph (NEW) | startId + options → `TraversalResult` (nodes, edges, paths) |
| `query` | Graph-derived scientific queries (NEW) | query id → `QueryResult` (entities, count, derivation) |
| `recommendation` | Graph-derived suggestions | id → `Recommendation[]` / shared-via / same-type |
| `timeline` | Curated chronologies | slug/path → `Timeline[]` |
| `comparison` | Rule-produced comparisons | slug → `Comparison` + resolved sides |
| `learning` | Structured learning (no AI) | topic/level → `LearningPath[]` / sequence |
| `discovery` | Topics + exploration paths | startId → `TraversalNode[]` |
| `metadata` | All metadata facets | `RuntimeEntity` → `EntityMetadata` |
| `source` | Source registry access | key(s) → `Source[]` |
| `citation` | Citation formatting | `Citation` + style → text |
| `dataset` | Dataset views & exports | slug → JSON / CSV |
| `authority` | Evidence/review/quality/version/provenance | id → authority data |
| `localization` | Localized text (id never localized) | id + locale → `LocalizedEntity` |
| `star` | Star encyclopedia resolver & queries | slug → `ResolvedStar`; brightest / nearest / by-constellation / by-type / visibility |
| `solar` | Solar System resolver & queries | slug → `ResolvedBody`; planets / moons / missions / by-kind |
| `launchVehicles` | Rockets & launch vehicles resolver & queries | slug → `ResolvedLaunchVehicle`; vehicles / families / engines / stages / propellants / providers / pads (see [ROCKETS.md](./ROCKETS.md)) |
| `validation` | The single validator | () → `ValidationReport[]` |

The `star` engine powers the [Star Encyclopedia](./STAR_ENCYCLOPEDIA.md) — it
resolves stars from the typed catalogue with lightweight, index-driven lookups so
it scales across thousands of pages.

## Dependency graph

```
UI / API / CLI consumers
        │  (only)
        ▼
   data-engine  ──delegates──▶ runtime · metadata · authority · localization
        │                      lib/{datasets,sources,citations,compare,learn,
        ▼                            timelines,discovery,media}
   knowledge-graph (entities + relations)
        ▼
   lib/sources (leaf)
```

The engine sits in the **Registry layer**; it may depend on Graph, Knowledge,
Explorer, Data, and Source — never on Presentation. Acyclic and enforced.

## Entity Resolver — example

```ts
const e = engine.entity.resolve("planet:mars");
e.name;              // "Mars"
e.relationCount;     // 4
e.quality.overall;   // "partial"
e.reviewStatus;      // "unreviewed"
e.evidenceLevels;    // ["high","moderate","limited","historical","unknown"]
```

## Graph Traversal — example

```ts
engine.traversal.traverse("space_telescope:james-webb-space-telescope", {
  maxDepth: 2, domain: "scientific",
});
// nodes reach NASA/ESA/CSA and the nebulae JWST studies, then Hubble at depth 2.
engine.traversal.path("space_telescope:james-webb-space-telescope", "planet:mars");
// JWST → NASA → Mars Science Laboratory → Mars
```

Options: `maxDepth`, `maxNodes`, `relationTypes`, `domain`
(`scientific` | `interpretive` | `mixed`). Cycle protection via a visited set;
`maxNodes` caps the walk (`truncated: true`).

## Scientific Query — honesty

Queries are derived from the live graph (no hardcoded lists). Queries that would
require measurement data the graph does not hold (brightness, distance, size,
rings, nationality) are declared in `UNSUPPORTED_QUERIES` rather than fabricated.

## Extension points

- **New query** — add a `ScientificQuery` to `QUERIES` (a `run()` that reads the
  graph). Validated for unique ids and runnability.
- **New facade** — wrap a subsystem in a new `*-engine.ts` and add it to the
  `engine` object in `index.ts`.
- Plugins register via the platform [extension points](./EXTENSIONS.md).

## Failure modes

- Unknown id → resolvers/queries return `null` (never throw).
- Traversal from an unknown start → `null`; cycles are bounded by the visited set
  and `maxNodes`.
- The validation engine returns issue lists; it never throws on data problems.

## Performance

- Entity resolution is memoized by `id@locale` (results are immutable).
- Traversal/query are O(edges visited); `maxNodes`/`maxDepth` bound the cost.
- The authority snapshot resolves quality for all entities — fine at build scale;
  memoize if the graph grows much larger.

See [PLATFORM_ARCHITECTURE.md](./PLATFORM_ARCHITECTURE.md) and
[SCIENTIFIC_AUTHORITY.md](./SCIENTIFIC_AUTHORITY.md).
