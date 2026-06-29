# Content Model

The content model is the backbone of Asteria Star. It is intentionally simple
so it can scale from this foundation to hundreds of thousands of pages without
structural change.

## Three levels

```
Section  (hub)          e.g. Astronomy
  └─ Category (topic)    e.g. Stars
       └─ Entry          e.g. Sirius        ← implemented in Phase 2
```

- **Sections** are the seven top-level hubs. Fixed, ordered, curated.
- **Categories** are topic areas within a hub (e.g. Stars, Black Holes).
- **Entries** — individual objects, people, missions, signs, terms — are the
  third level, added in Phase 2. They live *under* a category
  (`/[section]/[category]/[entry]`) and are where the page count scales into the
  thousands and beyond. The section/category taxonomy does **not** change when
  entries are added. The entry model, registry, and validation are documented in
  [PHASE_2_ENTRY_LAYER.md](./PHASE_2_ENTRY_LAYER.md); types are in
  `src/lib/content/entry-types.ts` and data in `src/content/entries/`.

## Types

Defined in [`src/lib/content/types.ts`](../src/lib/content/types.ts).

```ts
Section {
  slug, name, kind, tagline, description, intro, accent, categories[]
}
Category {
  slug, name, summary, overview, plannedTopics[],
  sources?, interpretive?, disclaimer?, keywords?
}
```

Key fields:

- **`kind`** — `science | interpretive | tools | reference | media | learning`.
  Drives styling and the interpretive disclaimer.
- **`summary`** — one line; used on cards and as the meta-description seed.
- **`overview`** — a short, accurate, definitional paragraph shown on the
  category page. Astronomy overviews are textbook-level fact; astrology
  overviews are framed as tradition. No statistics are asserted without a cited
  source.
- **`plannedTopics`** — clearly future-facing subtopics, rendered under "What
  this topic will cover" with an "In progress" badge. This is how we keep
  foundation pages honest and non-thin without fabricating content.
- **`sources`** — keys into the [source registry](../src/lib/sources.ts).
- **`interpretive` / `disclaimer`** — mark a non-astrology category (e.g.
  numerology calculators) as interpretive and optionally override the
  disclaimer wording.

Entries additionally carry optional **knowledge-graph links** (`graphEntityId`,
`relatedGraphEntityIds`, `relationIds`, `entityType`, `entityDomain`). Most
entries link to their graph entity implicitly by canonical path; the explicit
fields are available for authoring and are validated to resolve. See
[KNOWLEDGE_GRAPH.md](./KNOWLEDGE_GRAPH.md).

## Where the data lives

One file per hub in [`src/lib/content/sections/`](../src/lib/content/sections/),
aggregated by [`registry.ts`](../src/lib/content/registry.ts), which also
exposes query helpers (`getSection`, `getCategory`, `getAllCategories`,
`getAllCategoryParams`, `getSiblingCategories`, …) and `REGISTRY_STATS`.

## Adding content

- **New category:** add an object to the relevant `sections/*.ts` file. The
  hub page, a static category page, sitemap, and `llms.txt` all pick it up.
- **New section:** add a `sections/<slug>.ts` file and register it in
  `registry.ts` (`SECTIONS` array) and the `SectionSlug` union in `types.ts`.
- **New source:** add it to `sources.ts` and reference its key from categories.

## Content rules

These are enforced editorially (see [EDITORIAL_POLICY.md](./EDITORIAL_POLICY.md))
and reflected in the model:

- No fabricated facts, statistics, dates, or measurements.
- Astronomy = sourced science; astrology = labeled tradition; never mixed.
- Placeholders only where future content is *clearly* marked as planned.
- Every category must be source-ready (declare `sources` where factual).

## Why typed modules, not a CMS or MDX (yet)

For a foundation of this size, typed TypeScript modules give compile-time
safety, trivial refactors, and zero runtime/content-fetch cost — every page is
static. When per-entry content volume grows, individual entries can move to MDX
or a headless source behind the same `Category`/`Entry` types without changing
routing or components.
