# SEO Strategy

Asteria Star is SEO-first. The goal is a large, genuinely useful encyclopedia
where every page earns its place — no thin or duplicate pages, clean structured
data, and an internal link graph that scales.

## Foundations (implemented)

- **Unique title + description per page.** Produced by `buildMetadata()`
  ([`src/lib/seo/metadata.ts`](../src/lib/seo/metadata.ts)). The root layout
  sets the title template `"%s · Asteria Star"` and `metadataBase`.
- **Canonical URLs.** Every page sets `alternates.canonical` to its absolute
  URL via the `routes.ts` helpers — one source of truth for URLs.
- **Open Graph + Twitter.** Set on every page; a build-time branded card
  (`opengraph-image.tsx`) is the default image sitewide.
- **Structured data (JSON-LD).** Built in
  [`src/lib/seo/jsonld.ts`](../src/lib/seo/jsonld.ts):
  - `WebSite` + `Organization` — sitewide, in the root layout.
  - `BreadcrumbList` — every hub, category, and editorial page.
  - `CollectionPage` — hubs and categories.
  - `FAQPage` — category pages (the FAQs are also rendered visibly, as Google
    requires).
  - `Article` — editorial pages (about, policies) and **entry pages** (Phase 2).
    Entries may instead use `CollectionPage` via their `jsonLdType` field.
- **sitemap.xml** — generated from the registry (`sitemap.ts`); includes the
  homepage, all hubs, all categories, **all published entries**, and editorial
  pages.
- **robots.txt** — crawlable everywhere except the reserved `/app/` and `/api/`
  namespaces; points to the sitemap.
- **llms.txt** — an LLM-friendly map of the site, generated from the registry,
  now listing published entries nested under their category.
- **Breadcrumbs** — visible on every deep page, matching the JSON-LD.

## Internal linking

A deliberate graph, not an afterthought:

- The header links every hub; the footer links every hub plus its top
  categories.
- Hub pages link all their categories **and** cross-link to the other six hubs.
- Category pages link sibling categories ("More in {hub}").
- The homepage features a curated cross-hub set of topics.

This keeps every page within a few clicks of the homepage and spreads link
equity as the registry grows.

## Avoiding duplicate intent

Some topics could overlap; the registry keeps them distinct on purpose, e.g.:

- Astronomy → **Astronomers** (structured directory) vs. Encyclopedia →
  **Famous Astronomers** (narrative history).
- Astronomy → **Space Missions / Spacecraft** (catalog) vs. Encyclopedia →
  **Space Exploration** (history).
- Astrology → **Birth Chart** (the concept) vs. **Natal Chart** (the
  interpretive craft).
- Sky Guide → **Night Sky Tonight** (what's visible now) vs. Observatory →
  **Star Maps** (reference charts).

Each has a distinct `summary`/`overview`, and the pages cross-link rather than
compete.

## Avoiding thin pages

Foundation category pages are not stubs: each has an accurate overview, a
clearly-labeled "planned topics" list, two content-matched FAQs, a sources
panel (where factual), and related links. As entries are added, depth grows
without changing structure.

## Scaling to many pages

- The registry-driven dynamic routes generate one static page per item. The
  third level (`/[section]/[category]/[entry]`) is now implemented (Phase 2) and
  is where page count scales into the thousands; the same pattern extends to a
  future fourth level if ever needed.
- Entry pages enrich internal linking: each links sibling entries, related
  entries across categories, and back to its category, while category pages list
  their entries — deepening the link graph as the seed grows.
- `sitemap.ts` can be split with `generateSitemaps()` once it approaches
  Google's 50,000-URL limit — without changing the data source.

## Integrity guardrails (also SEO)

No fabricated facts, statistics, or astronomical data; astrology is always
labeled interpretive and never presented as science. Trustworthy, accurate
content is the durable SEO strategy. See
[EDITORIAL_POLICY.md](./EDITORIAL_POLICY.md) and
[SOURCES_POLICY.md](./SOURCES_POLICY.md).
