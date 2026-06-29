# Asteria Star

**Everything Above Earth.** A serious, source-ready knowledge platform for
everything above our planet — astronomy, space exploration, the night sky,
celestial events, mythology, and **astrology as a clearly separate cultural
tradition** — with science and symbolism kept clearly apart.

> Astronomy is presented as scientific, evidence-based, and sourced. Astrology
> is presented as cultural, symbolic, and interpretive — never as proven
> science.

This repository contains the **foundation** of the platform: a static-first,
SEO-first Next.js site with a typed content registry, a cosmic design system,
full SEO/structured-data infrastructure, and an architecture ready to grow into
tools, galleries, and (eventually) a community product.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, React Server Components)
- TypeScript (strict)
- Tailwind CSS v4
- Static generation — no database, no auth, no client data fetching (yet)

## Getting started

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # production build (statically prerenders all routes)
npm run lint      # ESLint
npm run validate  # validate the entry registry (boundary, sources, links)
```

Set the canonical origin for metadata/sitemap in production:

```bash
# .env (optional; defaults to https://asteriastar.com)
NEXT_PUBLIC_SITE_URL=https://asteriastar.com
```

## Structure

Seven knowledge hubs — Astronomy, Sky Guide, Astrology, Calculators,
Encyclopedia, Observatory, and Guides — each with many topic categories, all
driven by the content registry in [`src/lib/content/`](src/lib/content).

A third level, **entries** (`/[section]/[category]/[entry]`), holds individual
pages — stars, planets, missions, zodiac signs, glossary terms, and more —
typed and validated in [`src/content/entries/`](src/content/entries). See
[docs/PHASE_2_ENTRY_LAYER.md](docs/PHASE_2_ENTRY_LAYER.md).

A **knowledge graph** ([`src/knowledge-graph/`](src/knowledge-graph)) of **400
entities and 424 relations** connects everything — with scientific, cultural,
and astrological links kept strictly separate and no isolated nodes — and powers
a static **discovery** layer at `/explore`, `/entity-index`, `/discover`, and
graph-driven `/connections/*` pages. The **Observatory** (`/observatory`) is a
Celestial Data Platform hub with an honest, provenance-first
[image architecture](docs/IMAGE_PLATFORM.md) (no bundled or fabricated imagery).
See [docs/KNOWLEDGE_GRAPH.md](docs/KNOWLEDGE_GRAPH.md).

Adding a section, category, or entry is a data-only change: navigation, hub,
category and entry pages, `sitemap.xml`, and `llms.txt` all update
automatically.

## Documentation

- [Positioning — Everything Above Earth](docs/POSITIONING_EVERYTHING_ABOVE_EARTH.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Content Model](docs/CONTENT_MODEL.md)
- [Phase 2 — Entry Layer](docs/PHASE_2_ENTRY_LAYER.md)
- [Knowledge Graph](docs/KNOWLEDGE_GRAPH.md)
- [Image Platform](docs/IMAGE_PLATFORM.md)
- [SEO Strategy](docs/SEO_STRATEGY.md)
- [Future Social Network](docs/FUTURE_SOCIAL_NETWORK.md)
- [Editorial Policy](docs/EDITORIAL_POLICY.md)
- [Sources Policy](docs/SOURCES_POLICY.md)

## Principles

No fabricated facts, statistics, or astronomical data. Astrology content is
always labeled as interpretive tradition and never mixed with scientific
astronomy. See the [editorial policy](docs/EDITORIAL_POLICY.md).
