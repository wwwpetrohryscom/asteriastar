# Data Quality

Quality is **not an invented score** — it is structured completeness derived from
what actually exists for an entity
([`src/platform/authority/quality.ts`](../src/platform/authority/quality.ts)).
Shown on every entity page (the "Scientific quality" panel) and aggregated on the
[authority dashboard](../src/app/authority/page.tsx).

## Dimensions

Each entity exposes a coverage level — **complete / partial / none / not
applicable** — for:

- **Description** (has a description)
- **Source coverage** (source slots present)
- **Citation coverage** (field-level provenance records)
- **Relationship coverage** (number of typed relations)
- **Review coverage** (a real review record exists)
- **Image coverage** (provenance-first imagery)
- **Timeline coverage** (appears in a curated timeline)

## Applicability, and why it matters

A dimension is **not applicable** when the thing it measures cannot exist for
that entity, and such dimensions are excluded from the overall band entirely.

- No resolved photograph exists of any exoplanet, and none exists for the
  overwhelming majority of catalogue stars. Image coverage is therefore not
  applicable to those types unless an image actually exists, in which case it
  counts as complete. A record is never marked deficient for an observation
  nobody can make.
- A spectral class or a coordinate system is not a dated event, so timeline
  coverage does not apply to it.
- A concept page has no catalogued measurement for a field-level citation to
  attach to, so citation coverage does not apply to it.

Every "not applicable" carries a stated reason, shown to readers on hover.

## Overall: a band, not a percentage

`band` is one of **early / partial / substantial / complete**, derived
deterministically from the *applicable* dimensions only:

- `complete` — every applicable dimension is complete.
- `substantial` — score ≥ 0.6, where score = (complete + 0.5 × partial) / applicable.
- `partial` — score ≥ 0.3.
- `early` — below that.

The panel also states the raw counts the band came from ("3 of 5 applicable
dimensions complete"), so the reader sees the evidence rather than a summary
number.

### Why the old percentage was removed

An earlier version averaged eight dimensions into `completenessPercent`,
producing readings such as "13% complete". Three defects made that
indefensible:

1. **False precision.** Averaging eight three-valued dimensions yields only 17
   distinct outcomes. Rendering one of them as "13%" implied a resolution the
   model never had.
2. **Penalising legitimate absence.** Entities were scored down for missing
   imagery and timeline entries that cannot exist for them.
3. **A uniform dimension carrying zero information.** Localization coverage was
   `none` for all 7,000+ entities, because the translation registry ships empty
   by design. It subtracted an identical amount from every entity while
   distinguishing nothing, so it has been removed from the entity model rather
   than left in to depress every score equally. Platform localization status
   belongs on a platform page.

The dimension formerly called "Completeness" is now "Description", because that
is all it measured. A dimension named Completeness reading "Complete" beside an
overall "13% complete" was an internal contradiction visible to readers.

## Honesty

Because the review, image and citation registries are sparse, those dimensions
are honestly **none** for many entities today — the platform shows the gap
rather than inflating it, and never marks an entity reviewed because an editor
touched it. As real data is added, the indicators rise automatically (they read
live registry data). See [TRANSPARENCY.md](./TRANSPARENCY.md).
