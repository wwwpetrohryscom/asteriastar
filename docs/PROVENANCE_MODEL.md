# Provenance Model

The typed model for "where a scientific fact comes from"
([`src/platform/authority/provenance.ts`](../src/platform/authority/provenance.ts)).
Browsable at [`/transparency/data-provenance`](../src/app/transparency).

## ProvenanceRecord

```ts
ProvenanceRecord {
  id: string;                 // permanent, e.g. "prov:planet-mars-radius"
  entityId: string;
  relationshipId?: string;
  statement: string;          // the scientific statement
  evidenceLevel: EvidenceLevel;
  confidence?: Confidence;
  primarySource?: ProvenanceReference;
  secondarySources?: ProvenanceReference[];
  citationIds?: string[];     // into the citation registry
  reviewDate?: string;
  reviewer?: string;
  editorialNote?: string;
  version: string;
  changeHistory?: ProvenanceChange[];
}
```

A `ProvenanceReference` carries organization, publication, authors, publication
date, DOI, url, license, and an optional link to the source registry.

## Rules

- **Nothing hardcoded; everything typed.** The registry (`PROVENANCE`) ships
  **empty** — records are added only when backed by real, verified sources. No
  fabricated facts, no invented certainty.
- `validateProvenance()` rejects: duplicate ids, missing statement/version/
  evidence level, unknown entity or relationship references, broken citation
  references, a scientific fact with no source placeholder, and any
  evidence/domain violation (interpretive marked scientific).

See [EVIDENCE_FRAMEWORK.md](./EVIDENCE_FRAMEWORK.md) and
[CITATION_ENGINE.md](./CITATION_ENGINE.md).

## Provenance ↔ citation links (Program O)

Provenance records reference the citation registry via `citationIds`, and
citations reference provenance via `provenanceIds` — a two-way link validated by
`validateAuthority()` (every id must resolve; no broken links). Program O added
151 real citations, many of which back the provenance statements seeded in
Program N (e.g. the Mayor & Queloz 1995 paper backs the 51 Pegasi b record). See
`CITATION_COVERAGE.md` and `PROVENANCE_SEEDING.md`.
