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

## Sources are enforced for factual entries

From Phase 2, the entry registry **fails the build** if any factual entry
(`kind: "science" | "historical" | "tool"`) does not declare at least one
source slot (see `validateEntries()` in `src/content/entries/index.ts` and
`npm run validate`). Interpretive (astrology) and cultural (mythology) entries
are not required to carry science sources and are never cited as scientific
evidence.

## Adding a source

1. Add an entry to `SOURCES` in `src/lib/sources.ts` (extend the `SourceKey`
   union).
2. Reference its key from the relevant categories and entries (`sources: [...]`).
3. It appears in `SourceList` / `EntrySourceList` and on `/sources-policy`
   automatically.

## Source hierarchy for citations (Program O)

Citations (`src/lib/citations/`) prefer primary and institutional sources over
weaker ones, in this order:

1. **Peer-reviewed papers** (with a verified DOI) — the strongest reference.
2. **Primary institutions / datasets / catalogues** — NASA, JPL, ESA, ESO, IAU,
   STScI, LIGO, EHT, NASA Exoplanet Archive, Planck, SIMBAD, NED, Gaia, Minor
   Planet Center, HYG, OpenNGC.
3. **Secondary / background** — Encyclopaedia Britannica, only for historical or
   biographical context and only typed `historical_reference`. A secondary source
   never replaces an available primary source for a factual value.

DOIs are included only where verified; URLs are always a real canonical URL for
the stated organization (never a fabricated deep link). Some publisher sites
(e.g. Britannica) block automated fetchers, so an automated 403 does not mean a
URL is wrong — it is verified for human access. See `CITATION_COVERAGE.md`.
