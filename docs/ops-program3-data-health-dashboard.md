# Ops Program 3 — Source & provenance health dashboard

_A truthful operator‑facing view of scientific‑data health. Every number is computed from the live registries and committed snapshots — no hard‑coded totals, no fabricated provider status, and no arbitrary "trust score"._

## Metrics engine

`src/lib/data-health/metrics.ts` computes everything from the real sources:

- **Coverage** — total source‑traced values (34,232), entities (4,487), distinct bibcodes (484), and how many carry an exact source row, bibcode, DOI, epoch, reference frame and uncertainty; distributions by domain, status and source.
- **Quality** — values without uncertainty, secondary‑sourced (Wikidata) count, by‑authority‑type breakdown, disputed / upper‑ / lower‑limit counts, real **source conflicts** (Wikidata launch dates that disagree with the catalogue), and missions still unverified by a primary source.
- **Derived** — every derived/calculated value by formula and domain, with its uncertainty state.
- **Freshness** — each snapshot's retrieval date vs its cadence: `age`, `next due`, a content **signature**, and an honest status (`healthy` within one cadence period, `warning` up to 1.5×, `stale` beyond, `unverified` for a future date).
- **Provider health** — per provider: snapshots, rows, last retrieved, worst‑case status.

`src/lib/data-health/snapshots-meta.ts` reads each snapshot's own `*_RETRIEVED_AT` constant and row array — the freshness/provider figures are the snapshots' real facts.

## Honest status model

Statuses are explicit: `healthy · warning(aging) · stale · failed · unavailable · unverified · conflict · planned`. Green is used **only** for genuinely healthy/verified states; stale/failed/conflict are red/amber. There is **no** composite score.

## Pages (`/authority/data-health/*`)

`data-health` (overview) · `sources` · `freshness` · `provenance` · `conflicts` · `derived-values` · `refresh-history`. All are **real‑time** (`force-dynamic`) so freshness is evaluated against the current instant, labelled "as of {date}". Built only from the existing card/table styling and status pills — no redesign. The `refresh-history` page honestly shows each snapshot's real last‑generation and next‑scheduled date, and states that automated refresh runs appear as the reviewed PRs of Ops Program 2 (no run is fabricated). The `conflicts` page lists the actual Wikidata‑vs‑catalogue launch‑date discrepancies, with the catalogue value kept authoritative.

## API

`GET /api/v0/authority/data-health` returns the full health snapshot (coverage · quality · derived · freshness · providers), `force-dynamic`, wrapped in the standard provenance envelope.

## Permanent validator

`npm run datahealth:validate` (wired into `npm run validate`) proves the dashboard tells the truth:

- coverage totals **equal** `collectProvenance().length` / distinct entities / registry sums (no hard‑coded totals; a drift fails the build);
- derived total equals `DERIVED_STATS`; the conflict count equals the real mission discrepancies;
- freshness thresholds are correct — tested relative to each snapshot's own date (half a cadence → healthy, 2× → stale, a future date → unverified);
- the dashboard's snapshot metadata **does not drift** from the refresh config (provider, cadence and count must agree).

Result: **0 issues** across 34,232 values / 6 snapshots.

## Adversarial review (independently verified, fixed before merge)

A five-lens review confirmed eight findings (one refuted), fixed here: (major) the derived-values "in registry" metric filtered *all* derived/calculated-status registry values (2,224) instead of the derived engine's own outputs — now scoped by `formulaId` to the true 1,079; (major) `daysBetween` used `Math.round`, so a future-dated snapshot could round to `-0` and read "healthy" — now floored, so any future date is `unverified` and age is never inflated; (major/minor) the validator asserted only totals/sums — now it independently recomputes **every** displayed coverage/quality/derived metric and checks the by-domain/status/source distributions **bucket-by-bucket**, plus a sub-day future-date freshness test; (minor) the freshness "content signature" was renamed the honest "meta signature" (id · date · row count), with content-change detection left to the refresh diff.

## Remaining gaps (honest)

Provider "last successful refresh" is the snapshot's own generation date until the scheduled refresh workflows have run in production; once they do, their PRs become the refresh history. Content signatures are a fast FNV change‑detector (not a cryptographic checksum); the export manifest carries SHA‑256 for the Open Data files.

## Commands

- `npm run datahealth:validate` — dashboard‑equals‑registry‑truth gate
- `npm run validate` — includes the data‑health gate
