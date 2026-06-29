# Phase 2 — Entry Layer

Phase 2 adds the **entry layer**: the third level of the content taxonomy, at
`/[section]/[category]/[entry]`. This is where the site scales from ~100
category pages into thousands (and eventually hundreds of thousands) of
individual, source-ready pages — without changing the section/category
structure or the routing model.

```
Section  (hub)        Astronomy
  └─ Category (topic)  Stars
       └─ Entry        Sirius        ← Phase 2
```

## What an entry is

An entry is a single, self-contained page: a star, a planet, a mission, a
telescope, a zodiac sign, a glossary term, a myth, or a calculator landing
page. Every entry is **typed**, **validated**, and **statically generated**.

## The model

Types live in [`src/lib/content/entry-types.ts`](../src/lib/content/entry-types.ts).
Authors write the lean `EntryInput` shape; the registry normalizes each into a
fully-resolved `Entry` (filling canonical URL, SEO fields, and the derived
disclaimer flag).

Key fields:

| Field | Purpose |
| --- | --- |
| `section`, `category`, `slug` | Position in the taxonomy → URL `/section/category/slug` |
| `title`, `shortTitle`, `description`, `excerpt` | Display + meta-description seeds |
| `kind` | `science \| interpretive \| cultural \| tool \| historical` — drives sourcing and the disclaimer |
| `status` | `published \| planned` — only `published` entries get pages/sitemap URLs |
| `difficulty` | `beginner \| intermediate \| advanced` |
| `tags`, `heroSummary` | Discovery + hero copy |
| `facts` | Label/value "fast facts" |
| `keyPoints` | Takeaways |
| `body` | The article body — **≥ 3** headed sections (paragraphs and/or lists) |
| `sources` | Source slots (keys into [`src/lib/sources.ts`](../src/lib/sources.ts)) |
| `relatedEntries`, `relatedCategories` | Internal links (validated to resolve) |
| `seoTitle`, `seoDescription`, `jsonLdType` | SEO overrides (default to title/description/`Article`) |
| `disclaimer`, `disclaimerRequired` | Interpretive disclaimer (derived from `kind`) |

## The registry

Data modules live in [`src/content/entries/`](../src/content/entries) — one file
per section+category group — and are aggregated by
[`index.ts`](../src/content/entries/index.ts), which exposes:

- `getAllEntries(includeUnpublished?)`
- `getEntry(section, category, entry)`
- `getEntriesByCategory(section, category)`
- `getRelatedEntries(entry)`
- `getEntryPath(entry)`
- `getAllEntryParams()` (for `generateStaticParams`)
- `validateEntries()` and `ENTRY_STATS`

### Validation is a hard gate

`validateEntries()` runs **at import time and throws** on any violation. Because
the registry is imported by the route, sitemap, and category pages, an invalid
entry **fails `next build`**. The same function powers `npm run validate`
([`scripts/validate-entries.ts`](../scripts/validate-entries.ts)) for fast,
readable feedback. It enforces:

- section/category existence;
- no duplicate slugs / canonical URLs;
- no duplicate SEO titles or descriptions;
- **science/historical/tool entries declare at least one source**;
- **interpretive entries carry the disclaimer; factual entries never do**;
- related entries/categories resolve (no broken internal links);
- non-thin content (≥ 3 body sections, each with real content);
- no `lorem ipsum`.

## Adding an entry

1. Open (or create) the relevant file in `src/content/entries/`, e.g.
   `astronomy-stars.ts`.
2. Add an object to its `defineEntries([...])` array with at least
   `section`, `category`, `slug`, `title`, `description`, `kind`, and a `body`
   of ≥ 3 sections.
3. For factual entries (`science`/`historical`/`tool`), add `sources`. For
   astrology, set `kind: "interpretive"` (the disclaimer is automatic).
4. Run `npm run validate`. Fix anything it reports.
5. The page, sitemap URL, `llms.txt` entry, and category listing appear
   automatically.

To add a whole new file, create it and import its export into
`src/content/entries/index.ts`.

## Science vs. astrology boundary

This boundary is enforced by the type system **and** the validator:

- `kind: "science" | "historical"` → factual; **must** cite sources; **must
  not** carry the astrology disclaimer.
- `kind: "interpretive"` → astrology; carries the disclaimer automatically;
  framed as tradition, never as proven science.
- `kind: "cultural"` → mythology/heritage; presented as culture, not science or
  astrology; no disclaimer.
- `kind: "tool"` → calculator landing pages; factual basis, sourced; **no fake
  computed results** in this phase.

Astronomy entries never link to astrology entries, and astrology entries never
make astronomical claims or link to astronomy pages. The validator fails the
build if an astronomy entry is ever marked as requiring the disclaimer.

## Routing, components, and pages

- Route: [`src/app/[section]/[category]/[entry]/page.tsx`](../src/app/%5Bsection%5D/%5Bcategory%5D/%5Bentry%5D/page.tsx)
  — `generateStaticParams()` + `dynamicParams = false` (unknown/planned slugs
  return the custom 404). Emits BreadcrumbList + Article (or CollectionPage)
  JSON-LD, unique metadata, and a canonical URL.
- Components ([`src/components/entry/`](../src/components/entry)): `EntryHeader`,
  `EntryMetaBadges`, `EntryFacts`, `EntryBody`, `EntryKeyPoints`,
  `EntrySourceList`, `EntryRelatedGrid`, `EntryDisclaimer`, `EntryNavigation`.
- Category pages now **list their published entries** ("Explore …") and fall
  back to a high-quality *planned knowledge area* state (overview + clearly
  labeled upcoming topics) when a category has none — never fabricating links.

## The seed

A conservative, high-quality seed (not mass-generated):

| Group | Count |
| --- | --- |
| Astronomy / Stars | 12 |
| Astronomy / Planets | 8 |
| Astronomy / Dwarf Planets | 5 |
| Astronomy / Space Missions | 10 |
| Astronomy / Space Telescopes | 6 |
| Astrology / Zodiac Signs | 12 |
| Astrology / Planet Meanings | 10 |
| Encyclopedia / Glossary | 12 |
| Encyclopedia / Greek Mythology | 6 |
| Calculators / Physics | 6 |
| **Total** | **87** |

Hubble and JWST appear under both Space Missions (the *mission/programme*) and
Space Telescopes (the *observatory*), with distinct SEO titles and cross-links
to avoid duplicate intent. The six physics-calculator categories from Phase 1
were consolidated into a single **Calculators / Physics** category whose tools
now live as entries.

## How this prepares for the future (without building it)

The entry layer is the foundation the future social/product layer will build
on (see [FUTURE_SOCIAL_NETWORK.md](./FUTURE_SOCIAL_NETWORK.md)):

- **Stable identifiers.** Every entry has a stable `path`/`canonicalUrl`, so a
  future "save this entry", "add to collection", or "share" action has a
  durable reference.
- **Typed artifacts.** Entries (and later, calculator results) are typed, so
  persisting a user's saved charts or saved entries is additive, not a rewrite.
- **Clean separation.** Public, statically-generated knowledge stays in
  `src/app/**`; the reserved `(product)` route group remains empty.

**Not built in this phase:** no auth, no database, no user profiles, no feeds,
no posting, no comments, no likes, no collections, and no calculators that
compute results. Phase 2 is scalable entry *architecture* plus a high-quality
seed layer — nothing more.
