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
