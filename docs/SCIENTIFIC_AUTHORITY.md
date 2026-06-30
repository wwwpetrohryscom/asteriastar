# Scientific Authority

Phase 9 makes **trust a product feature**. The knowledge graph remains the single
source of truth; authority is built on **provenance, evidence, editorial quality,
and transparency** — every fact, relationship, dataset, and entity is meant to be
transparent, traceable, reviewable, and trustworthy.

The authority layer lives in [`src/platform/authority/`](../src/platform/authority)
(Registry layer) and is surfaced at [`/authority`](../src/app/authority/page.tsx)
and [`/transparency`](../src/app/transparency/page.tsx).

## Principles

- Science first; evidence before opinion.
- Every fact must have provenance; every relationship, evidence.
- **Never fabricate certainty** — unknown stays unknown, disputed stays disputed.
- Interpretive domains (astrology, mythology) are **always** separated from
  scientific domains and never classified as scientific evidence.

## What ships in this phase

Everything is **architecture-first and honest**: the provenance, review, and
version registries ship EMPTY (no fabricated facts, no fake review history), and
quality/authority numbers are **derived from real data** (no invented scores).

| Module | File | Doc |
| --- | --- | --- |
| Evidence framework | `authority/evidence.ts` | [EVIDENCE_FRAMEWORK.md](./EVIDENCE_FRAMEWORK.md) |
| Provenance system | `authority/provenance.ts` | [PROVENANCE_MODEL.md](./PROVENANCE_MODEL.md) |
| Review model | `authority/review.ts` | [EDITORIAL_PROCESS.md](./EDITORIAL_PROCESS.md) |
| Editorial status | `authority/editorial.ts` | [EDITORIAL_PROCESS.md](./EDITORIAL_PROCESS.md) |
| Versioning + change log | `authority/versioning.ts` | [VERSIONING.md](./VERSIONING.md) |
| Data quality | `authority/quality.ts` | [DATA_QUALITY.md](./DATA_QUALITY.md) |
| Authority snapshot | `authority/authority.ts` | this page |
| Citation engine | `lib/citations.ts` | [CITATION_ENGINE.md](./CITATION_ENGINE.md) |
| Source registry | `lib/sources.ts` | [SCIENTIFIC_SOURCES.md](./SCIENTIFIC_SOURCES.md) |

## Integrity

`validateAuthority()` (run inside `npm run validate`) rejects: duplicate
provenance / review / version ids, missing evidence levels, invalid review
states, scientific facts without a source placeholder, interpretive facts marked
scientific, and broken citation / version / provenance references. See
[TRANSPARENCY.md](./TRANSPARENCY.md) and [PLATFORM_ARCHITECTURE.md](./PLATFORM_ARCHITECTURE.md).
