# Transparency

Trust is built on transparency, not assertion. The platform publishes how it
works and a live, honest view of its coverage.

## Public pages

[`/transparency`](../src/app/transparency/page.tsx) hosts ten pages
([`content.tsx`](../src/app/transparency/content.tsx)):

Scientific Methodology · Editorial Standards · Evidence Framework · Review
Process · Source Quality · Version Policy · Data Provenance · Scientific Scope ·
Interpretive Scope · Transparency Report.

Each explains how the platform works and embeds **live** reference data (evidence
levels, the source registry, review/editorial states, version object kinds, the
provenance model, or the authority snapshot).

## Authority dashboard

[`/authority`](../src/app/authority/page.tsx) shows a fully-derived snapshot —
entities, relationships, datasets, sources (primary vs secondary), reviewed vs
awaiting review, coverage percentages, and a quality distribution. **Every number
is computed from real registry data (`computeAuthoritySnapshot`); there are no
fabricated statistics and no fake review history.**

## Honest gaps

Review, image, and localization coverage are currently low because those
registries are architecture-ready and ship empty. The platform surfaces the gap
rather than faking coverage — that honesty is the point of the authority layer.

See [SCIENTIFIC_AUTHORITY.md](./SCIENTIFIC_AUTHORITY.md) and
[DATA_QUALITY.md](./DATA_QUALITY.md).
