# Sources Policy (Contributor Guide)

The public-facing version lives at [`/sources-policy`](../src/app/sources-policy/page.tsx).
This companion explains how sourcing works in the codebase.

## Source registry

All authoritative sources live in [`src/lib/sources.ts`](../src/lib/sources.ts)
as typed entries with a stable `key`, display name, organization, canonical
URL, the `scope` we rely on them for, and an optional `usage` (licensing) note.

Categories reference sources by key (`sources: ["nasa", "iau"]`). The
`SourceList` component renders them, and the `/sources-policy` page lists the
whole library automatically.

## Current sources

NASA, NASA JPL (Solar System Dynamics), ESA, the IAU, the IAU Minor Planet
Center, the US Naval Observatory, the International Meteor Organization,
Encyclopaedia Britannica, and Wikimedia Commons (for openly licensed imagery).

These are **source slots**: they declare where verified information will come
from. Specific claims still need specific citations.

## Rules

- **Verify before publishing** any specific fact, figure, or date against a
  source.
- **Do not scrape.** Reference and link; don't bulk-harvest.
- **Do not assert unverified claims.** When in doubt, leave it out or mark it
  planned.
- **Science only for astronomy.** Astrology references are cultural/historical
  and are never cited as scientific evidence.

## Imagery & licensing

Use only public-domain or openly licensed media. For every image record:

- the source and a link to the original,
- the license (public domain or the specific Creative Commons license),
- any required credit/attribution.

No image ships without this provenance recorded.

## Adding a source

1. Add an entry to `SOURCES` in `src/lib/sources.ts` (extend the `SourceKey`
   union).
2. Reference its key from the relevant categories.
3. It appears in `SourceList` and on `/sources-policy` automatically.
