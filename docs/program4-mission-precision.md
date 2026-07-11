# Program 4 — Mission identity & engineering data (Wikidata, type-verified)

_Source-level enrichment with field-level provenance. Honest by construction: every value comes from a TYPE-VERIFIED, UNAMBIGUOUS Wikidata entity; unknown stays empty; a crowd-sourced value is never allowed to override the curated catalogue._

## Objective & source choice

Official mission fact sheets are HTML/PDF pages with no reliable machine interface, and transcribing engineering specs from memory would be fabrication. The honest, queryable, referenced structured source is **Wikidata**, which carries mission facts (international designator, operator, manufacturer, launch mass, launch date) that themselves cite primary agency sources. It is used transparently — labelled as Wikidata, with the exact QID on every value — and only where a match is **type-safe and unambiguous**.

## Method — homonym-proof matching

`npm run precision:missions` resolves each mission/spacecraft name through the Wikidata search API, then keeps only candidates that are an instance/subclass of **spacecraft (Q40218)** or **spaceflight (Q5916)** — so "Voyager 1" the music EP, "Juno" the goddess and "Hera" the asteroid are all rejected. Among the type-verified candidates it takes the one whose label **exactly matches** the record name (the mission itself, not its orbiter/lander); a name with no such match is skipped (honest empty). A committed snapshot is stamped with the retrieval date.

## Coverage (of 75 mission/spacecraft records)

- **63** resolved type-safely and unambiguously (84 %); the other 12 had no unique spacecraft-typed match and are left empty.
- **51** international designators (COSPAR), **31** launch masses (SI-normalised to kg), operators/manufacturers where unambiguous.
- **52** launch dates **cross-confirmed** against the catalogue; **1** discrepancy.

## Honesty rules enforced

- **The catalogue stays authoritative.** Wikidata's launch date is used **only to cross-check**, never to override — and Wikidata is demonstrably wrong for some missions: it lists **Pioneer 10** launching 1973-03-03, but the true (and catalogued) date is **1972-03-02**. That value is **not shown**; the discrepancy is recorded and the catalogue's date kept. A launch date is displayed as a confirmation only when the two agree.
- **Conflicts are omitted, not guessed.** A launch mass with several conflicting Wikidata statements (12 missions) is dropped rather than arbitrarily resolved; only a single unambiguous value is shown.
- **Transparent provenance.** Every value is labelled `catalogued · Wikidata` and carries its QID; the subtitle links the exact Wikidata entity. Nothing claims to be a direct NASA/ESA fact-sheet read.
- **No homonyms.** Type-verification + exact-label matching prevents a same-named non-spacecraft (or a component) from being ingested.

## Visible rendering

The mission page gains a **Mission data** section (reusable `ProvenanceStatTable`, existing styling — no redesign): international designator, operator, manufacturer and launch mass, each with a `Wikidata · catalogued` chip and full provenance (QID, property, retrieval date). A green "launch date confirmed" note appears when Wikidata agrees; a discrepancy is surfaced in amber with the catalogue value kept.

## Permanent validator

`npm run validate` → **Mission precision**: structural honesty of every value; a positive, plausible launch mass; a unique QID per record (a wrong resolve would map two missions to one entity); and that any displayed launch-date confirmation truly equals the catalogue's. Result: **0 violations across 42 missions.** (Launch-date disagreements are surfaced in metadata but do not fail the gate — the catalogue is authoritative and Wikidata's disagreeing value is never shown.)

## Adversarial review (independently verified, fixed before merge)

A five-lens multi-agent review confirmed eleven findings (0 refuted), fixed here: (1) Wikidata's label service emits a **bare QID** for a label-less entity (Hubble's operator ingested as "Q52152") — now the label service falls back `en → mul` and any residual `Q\d+` value is dropped, with a validator guard as backstop; (2) **operator/manufacturer/COSPAR took the first of several conflicting values** (Solar Orbiter → "NASA" for an ESA-led probe) — now omitted on conflict like mass; (3) **launch mass unit was assumed kg** — now read as the SI-normalised quantity (always kilograms); (4) **a blocker**: ~21 of the "unmatched" missions were actually **transient fetch failures silently treated as no-matches** — the ingest now retries failures and aborts rather than write a silently-incomplete snapshot, lifting coverage from 42 to **63**; (5) the footnote/source scope no longer over-claims verified primary-agency provenance; (6) the search limit was raised to 50 for high-homonym names.

## Remaining gaps (honest)

Deeper engineering specs (dry mass, power, propulsion, per-instrument detail) are not reliably structured in Wikidata and would require a curated per-mission fact-sheet pass — flagged, not fabricated. The 33 unmatched missions and the 12 mass-conflict cases are left empty. This program builds on the mission status/chronology validators added in the earlier "Pass 5", which remain in force.

## Commands

- `npm run precision:missions` — refresh the Wikidata mission snapshot
- `npm run precision:report` — coverage report (all four precision domains)
- `npm run validate` — includes the mission-precision gate
