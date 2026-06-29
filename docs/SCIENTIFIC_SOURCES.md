# Scientific Sources

Asteria Star is **source-ready by design**: scientific facts cite authoritative
organizations and, in time, peer-reviewed publications. The source registry is
[`src/lib/sources.ts`](../src/lib/sources.ts); the citation model is
[`src/lib/citations.ts`](../src/lib/citations.ts). See also the on-site
[Sources Policy](../src/app/sources-policy/page.tsx) and
[SOURCES_POLICY.md](./SOURCES_POLICY.md).

## Source organizations

NASA, NASA JPL, ESA, **CSA**, **JAXA**, **Roscosmos**, **ISRO**, IAU, IAU Minor
Planet Center (MPC), US Naval Observatory, International Meteor Organization
(IMO), NSF NOIRLab, ESO, SIMBAD (CDS), NASA/IPAC NED, **NASA ADS**, Encyclopaedia
Britannica, and Wikimedia Commons (for openly-licensed imagery) — 18 sources in
all. Each exposes a stable `SourceKey`, organization name, canonical URL, scope,
**country**, **authority type** (space-agency, observatory, database, union,
literature, reference, media), and a **reliability** note; `validateSources()`
enforces the required fields.

## Citation model

A `Citation` carries: `title`, `authors`, `organization`, `publication`, `url`,
`date`, `license`, `notes`, and an optional `source` key. The citation registry
ships **empty** — **no fabricated references**. Real citations (with verified
authors, URLs, and dates) are added over time; until then, entities cite the
authoritative source organizations above. `validateCitations()` checks that
every citation has a title, organization, and URL.

## Rules

- **Verify before publishing** any specific fact, figure, or date.
- **No scraping**; reference and link.
- **No unverified or fabricated claims** — including fake citations.
- **Science only for astronomy**; astrology references are cultural/historical
  and never cited as scientific evidence.
