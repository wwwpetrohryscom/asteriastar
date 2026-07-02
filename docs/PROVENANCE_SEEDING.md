# Provenance Seeding & Review Policy (Program N)

Program N moves Asteria Star from an architecture-only authority layer to the
first batch of **real, source-backed** scientific authority records for the
platform's flagship entities. Trust becomes visible at the entity level.

Nothing in this batch is fabricated. Every statement, source, URL, DOI, review,
and evidence level is real and honestly labelled. Where certainty is limited or a
claim is contested, that is stated — never hidden behind a confident label.

See also: `SCIENTIFIC_AUTHORITY.md`, `PROVENANCE_MODEL.md`, `SCIENTIFIC_SOURCES.md`.

## What was seeded

- **56 provenance records** — one per flagship entity, in
  `src/platform/authority/data/flagship-provenance.ts`. Each carries a true,
  well-established statement, an evidence level, a confidence, a primary source
  (real organization + verified canonical URL), and — where a paper exists — a
  citation.
- **56 entity reviews** — in `src/platform/authority/data/flagship-reviews.ts`,
  derived from the same entity set so review and provenance coverage stay in
  lock-step (no review of an un-sourced entity).
- **8 citations** — in `src/lib/citations.ts`, four carrying a verified DOI.
- **0 new sources** — the existing registry (`src/lib/sources.ts`) already covers
  every authority used (NASA, JPL, ESA, IAU, STScI, ESO, SIMBAD, LIGO, EHT,
  Planck, Nobel, Britannica, …).

Flagship coverage spans the Solar System (Sun, planets, dwarf planet, major
moons), stars, deep-sky objects, missions and telescopes, exoplanets, cosmology
concepts, and historical figures — ~56 entities in total.

## Evidence-level policy

| Level | Used for |
| --- | --- |
| `high` | Well-established NASA / ESA / IAU / JPL factual data (physical & orbital facts, confirmed classifications). |
| `historical` | Dated historical events and discoveries (mission launches/landings, the first black-hole image, discovery milestones). |
| `moderate` | Well-evidenced phenomena whose **underlying nature is unknown or model-dependent** — dark matter and dark energy (strong evidence for existence / acceleration; unknown nature), and confirmed-but-contested cases (K2-18 b). |

Rules enforced:

- **Speculative or debated claims are never marked `high`.** The *existence* of
  dark matter and the *acceleration* of expansion are strongly evidenced, but
  their underlying nature is unknown — so those records are `moderate`.
- **K2-18 b biosignatures are not asserted.** The record states the planet's
  confirmed status and notes that claimed biosignatures are contested and
  unconfirmed.
- Interpretive claims are never marked scientific (`validateEvidenceAssignment`).

## Source & citation policy

- Every URL is a **real, verified canonical URL** for the stated organization.
  No URL is fabricated. Where a specific document sits behind an authentication
  wall (e.g. the IAU 2006 Resolution B5 PDF), the citation points to the verified
  organizational URL and names the resolution precisely in its metadata rather
  than guessing an unverifiable deep link.
- **DOIs are included only for four iconic, verified papers:**
  - Planck 2018 VI (A&A 641, A6) — `10.1051/0004-6361/201833910`
  - LIGO GW150914 (PRL 116, 061102) — `10.1103/PhysRevLett.116.061102`
  - EHT M87 Paper I (ApJL 875, L1) — `10.3847/2041-8213/ab0ec7`
  - Mayor & Queloz 1995, 51 Peg b (Nature 378, 355) — `10.1038/378355a0`
- Data resources (fact sheets, NASA Exoplanet Archive, the IAU resolution) are
  cited **without a DOI** — none is invented. Any DOI is syntactically validated
  and must match the record's `doi.org` URL.

## Review policy — honesty first

Reviews are performed by the **internal Asteria Scientific Review Process** — an
in-house editorial and scientific check against authoritative sources. It is
**not** an external institutional or peer review, and the records say so:

- `reviewedBy` may only be a recognised internal identity
  (`INTERNAL_REVIEW_IDENTITIES`); a fabricated external reviewer cannot pass
  validation.
- `verificationLevel` is `sourced`, never `peer-aligned` (which would falsely
  imply external peer review).
- **No fabricated dates.** Reviews carry a deterministic `reviewVersion`
  (`2026.1`) instead of an invented per-entity review date. Any `reviewDate`, if
  ever added, must not postdate the graph release (validated).

## Validation

`validateAuthority()` (run by `npm run validate`) enforces: no provenance/review
referencing a non-existent entity, relationship, or citation; no duplicate ids;
scientific facts carry a source; interpretive is never marked scientific; DOIs
are syntactically valid and match their `doi.org` URL; no future dates on
citations, provenance sources, or reviews; and reviews name a recognised internal
reviewer identity with a review version.

## Quality impact

Seeding is reflected only in **deterministic completeness indicators**, never
invented scores. A seeded entity gains `reviewCoverage` (via its review) and
`citationCoverage` (via its provenance) in `computeEntityQuality`. The
`/authority` dashboard shows the real counts — reviewed entities (56), provenance
records (56), and citations (8) — and remains honest that coverage across the
full graph is still low. Entity pages render an `EntityProvenancePanel` with the
sourced statements, evidence levels, primary sources, citations (with DOIs), the
internal-review disclaimer, and any stated limitations — and render nothing when
an entity has no provenance yet (honest gaps stay invisible, not faked).

## Extending

Add real records to the seed files, keeping every statement source-backed and
honestly levelled. Reviews should stay in lock-step with provenance. Never add a
DOI, date, reviewer, or URL that cannot be verified.
