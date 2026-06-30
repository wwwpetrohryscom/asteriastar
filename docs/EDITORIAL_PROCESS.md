# Editorial Process

Covers the **review model** ([`authority/review.ts`](../src/platform/authority/review.ts))
and the **editorial lifecycle** ([`authority/editorial.ts`](../src/platform/authority/editorial.ts)).
Architecture only — there is no backend and no authentication. Browsable at
[`/transparency/review-process`](../src/app/transparency) and
[`/transparency/editorial-standards`](../src/app/transparency).

## Review model

Every entity can carry an `EntityReview`: review status, reviewer, date, version,
notes, separate **scientific** and **editorial** accuracy, verification level,
and review cycle.

- **Review status**: unreviewed · in-review · reviewed · verified · needs-update
- **Accuracy**: unverified · accurate · needs-correction · disputed
- **Verification**: none · basic · sourced · peer-aligned

The `REVIEWS` registry ships **empty** — no fabricated review history. An entity
with no record is honestly **Unreviewed** (this is what the entity quality panel
and authority dashboard show today).

## Editorial lifecycle

Every page/object can carry an `EditorialStatus`: draft · in-review · reviewed ·
verified · archived · superseded · deprecated. There is no workflow
implementation; this types the states a future editorial workflow will use.

## Integrity

`validateReviews()` rejects duplicate reviews, invalid status/accuracy/
verification values, and reviews referencing unknown entities. See
[SCIENTIFIC_AUTHORITY.md](./SCIENTIFIC_AUTHORITY.md).
