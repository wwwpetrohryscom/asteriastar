# Asteria Star

A serious, source-ready knowledge platform for **astronomy and the night sky**,
alongside the cultural tradition of **astrology** — with science and symbolism
kept clearly apart.

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
npm run dev      # http://localhost:3000
npm run build    # production build (statically prerenders all routes)
npm run lint     # ESLint
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

Adding a section or category is a data-only change: navigation, hub and
category pages, `sitemap.xml`, and `llms.txt` all update automatically.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Content Model](docs/CONTENT_MODEL.md)
- [SEO Strategy](docs/SEO_STRATEGY.md)
- [Future Social Network](docs/FUTURE_SOCIAL_NETWORK.md)
- [Editorial Policy](docs/EDITORIAL_POLICY.md)
- [Sources Policy](docs/SOURCES_POLICY.md)

## Principles

No fabricated facts, statistics, or astronomical data. Astrology content is
always labeled as interpretive tradition and never mixed with scientific
astronomy. See the [editorial policy](docs/EDITORIAL_POLICY.md).
