# Intelligence Layer (Phase 5)

Phase 5 makes the knowledge graph the *operating system* of the platform.
Articles are one representation of knowledge; the graph drives discovery,
comparison, recommendation, learning, search, and timelines. Everything below is
graph- or content-derived — **no random suggestions, no fabricated values, no
AI hallucination**.

## Recommendations

`getRecommendations(entityId)` (in `src/knowledge-graph/helpers.ts`) scores
candidate entities by **shared connections** (distance-2 neighbours) and
**shared type**, and returns each with an honest, graph-derived reason
("Linked through Orion", "Also a star"). Surfaced on entity and entry pages via
`EntityRecommendations`. There are no dead ends.

## Comparison engine — `/compare`

`src/lib/compare.ts` defines comparisons whose sides are graph entities, content
entries, or clearly-labeled concepts. Each page shows side-by-side facts,
**shared characteristics** (the intersection of both entities' graph
connections), related entities, and a union of sources. No fabricated metrics.
Seeded: Mars vs Venus, Saturn vs Jupiter, JWST vs Hubble, Betelgeuse vs Rigel,
Galaxy vs Nebula, and Astronomy vs Astrology (the platform's defining boundary).

## Learning paths — `/learn`

`src/lib/learn.ts` defines structured journeys (Beginner / Intermediate /
Advanced) whose steps link to real entries, guides, topics, and connection
pages, plus related graph entities and recommended next paths. **Infrastructure
only** — no user accounts or saved progress yet.

## Timeline engine — `/timelines`

`src/lib/timelines.ts` + the reusable `TimelineList` component render curated,
**sourced** chronologies (Space Missions, Telescope Launches, Planet
Discoveries, History of Astronomy). Events link into the graph where an
entity/entry exists. Every date is a documented historical fact. Entry timelines
share the same component.

## Universal search — `/search`

Global search is available from every page — a header trigger, `Cmd/Ctrl+K`
from anywhere, and a full results page at `/search`.

`scripts/search/build-docs.ts` builds the index at build time from the canonical
registries — **entities, articles, hubs, topics, learning paths, timelines,
comparisons, datasets and platform destinations** — enriched with catalogue
identifiers the graph does not mirror (HIP/HD/HR/Gliese, Messier/NGC/IC/
Caldwell, small-body designations, IAU constellation abbreviations). It emits
deterministic shards to `public/search-index/`: `core` answers immediately and
`catalogue` streams in behind it.

The client-safe core is `src/lib/search/{types,match,query,groups}.ts`, and it
never imports the data layer — `npm run search:validate` fails the build if it
does. Ranking is a fixed tier ladder (exact title → exact alias/identifier →
title prefix → alias prefix → word prefix → all tokens → substring → close
spelling), so every result can be explained by the tier it matched. Typo
tolerance runs only as a second pass when the strict pass found almost nothing.
No AI, no chat, nothing learned — every result is a real record.

Commands: `npm run search:index`, `npm run search:validate`, `npm run search:test`.

## Graph intelligence fields

`GraphEntity` gained optional, never-fabricated fields: `scientificName`,
`catalogNumbers`, `crossReferences`, `importance` (plus existing `aliases`).
Left empty when a value is unknown.

## Extension points for the future product layer

Nothing user-facing (auth, profiles, collections, posts) is built. But the
intelligence layer is the substrate it will attach to: saved entities, learning
progress, and personalized recommendations all key off stable **graph entity
ids** and learning-path/timeline slugs. See
[FUTURE_SOCIAL_NETWORK.md](./FUTURE_SOCIAL_NETWORK.md).
