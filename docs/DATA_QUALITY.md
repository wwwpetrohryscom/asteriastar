# Data Quality

Quality is **not an invented score** — it is structured completeness derived from
what actually exists for an entity
([`src/platform/authority/quality.ts`](../src/platform/authority/quality.ts)).
Shown on every entity page (the "Scientific quality" panel) and aggregated on the
[authority dashboard](../src/app/authority/page.tsx).

## Dimensions

Each entity exposes a coverage level — **complete / partial / none** — for:

- **Completeness** (has a description)
- **Source coverage** (source slots present)
- **Citation coverage** (provenance / citation records)
- **Relationship coverage** (number of typed relations)
- **Review coverage** (review status)
- **Image coverage** (provenance-first imagery)
- **Timeline coverage** (appears in a curated timeline)
- **Localization coverage** (verified translations)

## Overall

`completenessPercent` is a deterministic average of the indicators (complete = 1,
partial = 0.5, none = 0); `overall` is complete / partial / none derived from it.

## Honesty

Because the review, image, citation, and localization registries ship empty,
those dimensions are honestly **none** for most entities today — the platform
shows the gap rather than inflating it. As real data is added, the indicators
rise automatically (they read live registry data). See
[TRANSPARENCY.md](./TRANSPARENCY.md).
