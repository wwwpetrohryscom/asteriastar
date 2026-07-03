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

The graph is also the platform's **intelligence layer** — recommendations,
comparisons (`/compare`), learning paths (`/learn`), timelines (`/timelines`),
and universal search (`/search`), all graph-derived with no fabricated data. See
[docs/INTELLIGENCE.md](docs/INTELLIGENCE.md) and
[docs/KNOWLEDGE_GRAPH.md](docs/KNOWLEDGE_GRAPH.md).

Underneath sits **Asteria Platform Core** ([`src/platform/`](src/platform)): a
layered, registry-driven foundation where the website is just one client. Seven
acyclic layers (enforced by `npm run check:arch`), an **entity runtime**
(`resolveEntity`), a **universal registry** of registries, generated metadata,
localization, extension points, and a reusable component family — all browsable
at [`/platform`](src/app/platform/page.tsx). See
[docs/PLATFORM_ARCHITECTURE.md](docs/PLATFORM_ARCHITECTURE.md).

All of this is reached through the **Scientific Data Engine**
([`src/platform/data-engine/`](src/platform/data-engine)) — 27 pure,
framework-independent modules (entity resolver, relationship resolver, graph
traversal, scientific query, recommendation, comparison, timeline, learning,
discovery, metadata, source, citation, dataset, authority, localization, **star**, **solar**,
and a single validation engine). Every consumer resolves reality through `engine.*`;
nothing reads the graph directly. See [docs/SCIENTIFIC_DATA_ENGINE.md](docs/SCIENTIFIC_DATA_ENGINE.md).

On top of that, a **scientific authority layer**
([`src/platform/authority/`](src/platform/authority)) makes trust a product
feature: a typed provenance model, a standardized evidence framework, review and
versioning architecture, a citation engine (APA/Chicago/MLA/Harvard/BibTeX/RIS),
and data-quality indicators derived from real data — surfaced on the
[authority dashboard](src/app/authority/page.tsx) and the
[transparency pages](src/app/transparency/page.tsx). Provenance and review
registries ship empty; nothing fabricates certainty. See
[docs/SCIENTIFIC_AUTHORITY.md](docs/SCIENTIFIC_AUTHORITY.md).

Adding a section, category, or entry is a data-only change: navigation, hub,
category and entry pages, `sitemap.xml`, and `llms.txt` all update
automatically.

## Documentation

- [Positioning — Everything Above Earth](docs/POSITIONING_EVERYTHING_ABOVE_EARTH.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Content Model](docs/CONTENT_MODEL.md)
- [Phase 2 — Entry Layer](docs/PHASE_2_ENTRY_LAYER.md)
- [Knowledge Graph](docs/KNOWLEDGE_GRAPH.md) · [Schema](docs/KNOWLEDGE_GRAPH_SCHEMA.md)
- [Intelligence Layer](docs/INTELLIGENCE.md)
- [Community Architecture](docs/COMMUNITY_ARCHITECTURE.md)
- [Image Platform](docs/IMAGE_PLATFORM.md)
- [SEO Strategy](docs/SEO_STRATEGY.md)
- [Future Social Network](docs/FUTURE_SOCIAL_NETWORK.md)
- [Editorial Policy](docs/EDITORIAL_POLICY.md)
- [Sources Policy](docs/SOURCES_POLICY.md)

**Constellation Encyclopedia (Program W)**

- [Constellations](docs/CONSTELLATIONS.md) — all 88 IAU constellations as first-class graph entities, connected to their stars, deep-sky objects, exoplanets, meteor showers, mythology, families, and seasonal sky (reuses existing entities; no fabricated data)

**Rockets & Launch Vehicles Encyclopedia (Program V)**

- [Rockets & Launch Vehicles](docs/ROCKETS.md) — launch vehicles, rocket families, booster/upper stages, engines, propellants, launch providers, programs, and pads, source-backed with unknown specifications left blank (never invented)

**Satellite Encyclopedia (Program X)**

- [Satellites](docs/SATELLITES.md) — artificial satellites, satellite constellations, orbit types, operators, and tracking networks as first-class graph entities, reusing existing agencies, rockets, and launch sites (no real-time tracking; unknown specifications left blank, never invented)

**Solar System Encyclopedia (Program B)**

- [Solar System](docs/SOLAR_SYSTEM.md) — the Sun, planets, moons, asteroids, comets, missions, and spacecraft from real NASA/JPL data

**Star Encyclopedia (Program A)**

- [Star Encyclopedia](docs/STAR_ENCYCLOPEDIA.md) — 2,944 real stars from the open HYG database (CC BY-SA 4.0), as first-class graph entities

**Scientific Data Engine (Phase 10)**

- [Scientific Data Engine](docs/SCIENTIFIC_DATA_ENGINE.md) — the 18-module execution layer every consumer reads through

**Scientific Authority (Phase 9)**

- [Scientific Authority](docs/SCIENTIFIC_AUTHORITY.md) — provenance, evidence, review, quality, transparency
- [Evidence Framework](docs/EVIDENCE_FRAMEWORK.md) · [Provenance Model](docs/PROVENANCE_MODEL.md)
- [Editorial Process](docs/EDITORIAL_PROCESS.md) · [Citation Engine](docs/CITATION_ENGINE.md)
- [Versioning (object-level)](docs/VERSIONING.md) · [Data Quality](docs/DATA_QUALITY.md) · [Transparency](docs/TRANSPARENCY.md)

**Platform Core (Phase 8)**

- [Platform Architecture](docs/PLATFORM_ARCHITECTURE.md) — layers, entity runtime, registries, metadata
- [Localization](docs/LOCALIZATION.md)
- [Extensions](docs/EXTENSIONS.md)

**Open Celestial Data Platform (Phase 7)**

- [Open Data](docs/OPEN_DATA.md)
- [API Overview](docs/API_OVERVIEW.md)
- [Dataset Catalog](docs/DATASET_CATALOG.md)
- [Entity Identifiers](docs/ENTITY_IDENTIFIERS.md)
- [Versioning Strategy](docs/VERSIONING_STRATEGY.md)
- [Scientific Sources](docs/SCIENTIFIC_SOURCES.md)
- [Licensing Policy](docs/LICENSING_POLICY.md)
- [Contribution Standards](docs/CONTRIBUTION_STANDARDS.md)

## Principles

No fabricated facts, statistics, or astronomical data. Astrology content is
always labeled as interpretive tradition and never mixed with scientific
astronomy. See the [editorial policy](docs/EDITORIAL_POLICY.md).
