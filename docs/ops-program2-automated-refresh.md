# Ops Program 2 — Automated scientific snapshot refresh

_Turns the committed snapshots into a maintainable, refreshable system: scheduled workflows regenerate each dataset from its authoritative source, diff it semantically, and propose changes through a reviewed PR. The production site never depends on a live science API, and a fetch failure can never lose or empty data._

## Architecture

| Piece | File | Role |
| --- | --- | --- |
| Snapshot registry | `scripts/refresh/snapshots.ts` | Declares each refreshable snapshot: provider, file, ingest script, key field, cadence, and the field classification used for the diff. |
| Diff engine | `scripts/refresh/diff-snapshot.ts` | Row‑by‑row semantic diff (by key) into an honest change taxonomy; machine + human report. |
| Anomaly thresholds | `scripts/refresh/anomaly-config.ts` | Transparent, documented thresholds — no arbitrary "trust score". |
| Orchestrator | `scripts/refresh/refresh.ts` | Backup → regenerate → validate identity → diff → decide, with strict failure‑safety. |
| Config gate | `scripts/refresh/validate-config.ts` | Proves the registry is truthful (files, ingest scripts, key fields, columns all real); wired into `npm run validate`. |
| Tests | `scripts/refresh/refresh.test.ts` | Diff classification + failure‑safety (runnable assertion harness). |
| Workflows | `.github/workflows/refresh-*.yml` | Scheduled + manual, provider‑isolated, PR‑proposing. |

## Cadence (UTC)

| Snapshot | Provider | Cadence | Cron |
| --- | --- | --- | --- |
| `sbdb-small-bodies` | JPL SBDB | weekly | `7 6 * * 1` |
| `wikidata-missions` | Wikidata | weekly | `7 6 * * 1` |
| `simbad-stars` | SIMBAD | monthly | `23 5 3 * *` |
| `simbad-deep-sky` | SIMBAD | monthly | `23 5 3 * *` |
| `ned-deep-sky` | NED | monthly | `23 5 3 * *` |
| `gaia-stars` | Gaia DR3 | quarterly | `41 4 5 1,4,7,10 *` |

Small bodies (NEO/PHA/high‑interest comets) refresh weekly; stars/deep‑sky monthly–quarterly; missions weekly. Every workflow can also be run manually (`workflow_dispatch`), and any snapshot can be refreshed locally with `npm run refresh -- --provider <id>`.

## Diff classification

Each changed row/field is classified into: `added · source_metadata_only · uncertainty_update · precision_improvement · value_change · classification_change · status_change · identifier_change · source_removed · anomaly` (plus `conflict_detected`). A row's class is the most severe of its field changes. A numeric change is a `precision_improvement` (≤ 2 %), a `value_change`, or an `anomaly` (≥ the per‑snapshot threshold: 10 % for SBDB orbits, 20 % Gaia, 30 % SIMBAD, 50 % default). The classification is derived only from the two real row sets — no change is invented.

## Review policy (documented thresholds only)

A refresh opens a PR **only when the data meaningfully changes** (a retrieval‑date‑only churn is reverted → no empty PR). The PR is labelled `review-required` unless the diff is within safe thresholds — i.e. it contains **no** `classification_change`, `status_change`, `identifier_change`, `source_removed`, `conflict_detected` or `anomaly`, and **≤ 25 % of all rows change** (additions, removals and modifications are all counted, against the larger dataset — so a large influx of new, unvetted rows also requires review). Mission state transitions, NEO/PHA flips, identifier changes, source removals and large parameter swings therefore always require review.

**The workflow never merges scientific‑data changes itself** — a red build must never ship, so every refresh opens a PR for merge under branch protection / human review. (Auto‑merge for within‑thresholds refreshes can be enabled later by adding `gh pr merge --auto` to the reusable workflow **only once required status checks are configured**, so a failing check blocks the merge; without that guarantee, auto‑merge is deliberately omitted.)

Nested measurement fields (e.g. SBDB orbital elements stored as `{value, sigma, unit}`) are compared on their numeric `value`, so a gross orbit change is correctly flagged as an `anomaly` — the anomaly gate is not limited to flat top‑level numbers.

## Failure‑safety (the core guarantee)

The orchestrator backs up the committed snapshot before regenerating it. On **any** failure — the ingest throwing, an empty/malformed candidate, or a missing key field — it **restores the backup**, marks the run `failed`, and reports "committed snapshot preserved; this run did NOT refresh the dataset." It never empties data, never deletes rows, and never turns a fetch failure into "no matches" (the ingests already write their snapshot only once, atomically, at the end; a mid‑run failure leaves the old file intact). The failure‑safety test asserts that an empty candidate exits code 2 and leaves the snapshot **byte‑identical**.

## Security

Least‑privilege permissions (`contents: write`, `pull-requests: write`); the reusable workflow commits **only** the regenerated snapshot file; PR bodies come from the generated report file (no unsanitised interpolation of provider data into shell); labels are created idempotently; `github.token` only, no external secrets; pinned major action versions (`@v4`, matching the repo convention); provider‑isolated jobs; no scheduled push to `main`.

## Adversarial review (independently verified, fixed before merge)

A five‑lens review confirmed seven findings (seven refuted), fixed here: (blocker) the anomaly gate only inspected flat top‑level numbers, so a gross SBDB orbit change — stored as a nested `{value, sigma, unit}` — was mislabelled a plain `value_change` and could auto‑merge; now the nested `value` is compared. (major) the blast‑radius gate excluded added rows, so a mass row‑add bypassed the 25 % threshold; now all changes are counted against the larger dataset. (major) auto‑merge relied on branch‑protection checks that can't be assumed; auto‑merge is removed so a red build can never ship. (minor) `validate-config` now unions keys across all rows and asserts every anomaly‑threshold key is a real snapshot id.

## Tests & gates

- `npm run refresh:test` — 17 assertions: every change class classifies correctly (including **nested measurement objects** and a **mass row‑add**), a retrieval‑date‑only change is not meaningful, and an empty/failed refresh leaves committed data byte‑identical.
- `npm run refresh:validate` (in `npm run validate`) — the registry is truthful.
- `validate · tsc · lint · build` all green.

## Commands

- `npm run refresh -- --provider <id>` — refresh one snapshot locally
- `npm run refresh:test` — diff + failure‑safety tests
- `npm run refresh:validate` — refresh‑config integrity gate

## Remaining gaps (honest)

Auto‑merge relies on the repo's branch‑protection status checks being configured so a red build blocks the merge (the workflow requests `--auto` but does not bypass gates). Mission‑status change detection is diff‑based here; Ops Program 4 adds primary‑source verification on top.
