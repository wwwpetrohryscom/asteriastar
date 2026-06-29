# Architecture

Asteria Star is a static-first, SEO-first knowledge platform for **everything
above Earth** (see
[POSITIONING_EVERYTHING_ABOVE_EARTH.md](./POSITIONING_EVERYTHING_ABOVE_EARTH.md)),
built on the Next.js App Router. This document explains how the codebase is
organized and the decisions behind it.

## Stack

- **Next.js 16 (App Router)** — file-based routing, React Server Components,
  static generation by default.
- **TypeScript** (strict) — the content model is fully typed.
- **Tailwind CSS v4** — CSS-first config via `@theme` in `src/app/globals.css`.
- **No database, no auth, no client data fetching** in this phase. Pages are
  rendered from a typed, in-repo content registry and statically generated.

## Directory layout

```
src/
  app/                      App Router root (static-first public site)
    layout.tsx              Root layout: fonts, metadata, header/footer, site JSON-LD
    page.tsx                Homepage
    not-found.tsx           Custom 404
    sitemap.ts              sitemap.xml (from registry)
    robots.ts               robots.txt
    llms.txt/route.ts       /llms.txt (from registry)
    opengraph-image.tsx     Default social card (build-time)
    icon.svg                Favicon
    [section]/page.tsx                Hub pages (7, registry-driven)
    [section]/[category]/page.tsx     Category pages (registry-driven)
    [section]/[category]/[entry]/page.tsx   Entry pages (Phase 2, registry-driven)
    about/ editorial-policy/ sources-policy/   Editorial pages
    (product)/              RESERVED future authenticated area (empty route group)
  components/
    site/                   SiteHeader, SiteFooter, Logo, MobileNav
    sections/               HeroSection, SectionGrid, CTASection, EditorialPage
    ui/                     TopicCard, Breadcrumbs, DisclaimerBox, SourceList,
                            RelatedLinks, Button, Badge, Container
    entry/                  EntryHeader, EntryFacts, EntryBody, EntryKeyPoints,
                            EntrySourceList, EntryRelatedGrid, EntryMetaBadges,
                            EntryDisclaimer, EntryNavigation, KnowledgeConnections
    seo/                    JsonLd
  lib/
    site.ts                 Site identity + the astrology disclaimer
    sources.ts              Authoritative source registry (source slots)
    routes.ts               The only place URLs are constructed
    theme.ts                Accent palette + CSS-var helpers
    content/
      types.ts              Section / Category types
      entry-types.ts        Entry types + resolveEntry() (Phase 2)
      sections/*.ts         One file per hub (the actual content)
      registry.ts           Aggregates sections + lookup/query helpers
    seo/
      metadata.ts           buildMetadata() — title, canonical, OG, Twitter
      jsonld.ts             Schema.org builders
  content/
    entries/                Entry data modules + validating registry (Phase 2)
  knowledge-graph/          Entity/relation graph + helpers + validation (Phase 2.5)
scripts/
  validate-entries.ts       Entry + graph quality gate (npm run validate)
docs/                       This documentation
```

## Routing model

Routing is **registry-driven**. Three dynamic segments cover the whole
knowledge site:

- `/[section]` — the seven hubs.
- `/[section]/[category]` — every topic area.
- `/[section]/[category]/[entry]` — individual entries (Phase 2; see
  [PHASE_2_ENTRY_LAYER.md](./PHASE_2_ENTRY_LAYER.md)).

All three export `generateStaticParams()` (so all pages are statically generated
at build time) and `export const dynamicParams = false` (so any slug not in the
registry returns the custom 404 — there are no broken or thin auto-generated
routes, and `planned` entries get no page). Static routes (`/about`,
`/editorial-policy`, …) take precedence over the dynamic `[section]` segment, so
there is no collision.

This means adding a section or category is a **data-only** change in
`src/lib/content/` — navigation, hubs, category pages, the sitemap, and
`llms.txt` all update automatically. See [CONTENT_MODEL.md](./CONTENT_MODEL.md).

## Rendering & performance

- Server Components by default; the only Client Component is `MobileNav`
  (it needs `useState`/`usePathname`).
- Everything is statically prerendered. There are no request-time data
  dependencies, so the site can be served from a CDN.
- The cosmic background and starfield are pure CSS — no images, no JS, no
  hydration mismatch risk.

## Styling system

Tokens (colors, fonts, radii) are declared once in `globals.css` under
`@theme` and consumed as Tailwind utilities (`bg-bg`, `text-muted`,
`font-display`, …). Per-section **accents** can't be generated as dynamic
Tailwind classes, so `lib/theme.ts` exposes them as CSS custom properties
(`--accent`, `--accent-from`, `--accent-to`) applied inline and read via
arbitrary-value utilities. Fonts: Space Grotesk (display) + Inter (body) via
`next/font`.

## SEO architecture

Centralized so it can't drift:

- `buildMetadata()` produces a unique title, description, canonical URL, and
  Open Graph / Twitter tags for every page. The root layout sets
  `metadataBase` and the title template.
- `lib/seo/jsonld.ts` builds WebSite, Organization, BreadcrumbList,
  CollectionPage, Article, and FAQPage schemas; `<JsonLd>` renders them.
- `sitemap.ts`, `robots.ts`, and `llms.txt` are all derived from the registry.

See [SEO_STRATEGY.md](./SEO_STRATEGY.md).

## The science / tradition boundary

A first-class architectural constraint, not a content guideline:

- Each `Section` has a `kind` (`science | interpretive | tools | reference |
  media | learning`) and each `Category` can be flagged `interpretive`.
- `kind: "interpretive"` (astrology) and any `interpretive` category force the
  `DisclaimerBox`. Astronomy content never carries astrology framing, and vice
  versa. See [EDITORIAL_POLICY.md](./EDITORIAL_POLICY.md).

## Knowledge graph

`src/knowledge-graph/` models entities (stars, planets, missions, myths,
symbols…) and typed relations between them. It is core infrastructure: the
science/culture/astrology boundary is encoded in each relation's `domain` and
`confidence`, and `validateGraph()` (run at import and via `npm run validate`)
refuses to let astrology or interpretive links pose as confirmed science.
Entries link to graph entities by canonical path (or an explicit
`graphEntityId`), and entry pages render grouped, never-mixed "Knowledge
connections". See [KNOWLEDGE_GRAPH.md](./KNOWLEDGE_GRAPH.md).

## Future-readiness

The `(product)` route group reserves the authenticated product namespace
without implementing anything. The knowledge graph gives future social features
(saved entities, collections, learning paths) stable things to reference. See
[FUTURE_SOCIAL_NETWORK.md](./FUTURE_SOCIAL_NETWORK.md).
