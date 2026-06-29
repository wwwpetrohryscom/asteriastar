# Evidence Framework

A standardized vocabulary for how strongly a statement is supported
([`src/platform/authority/evidence.ts`](../src/platform/authority/evidence.ts)).
Browsable at [`/transparency/evidence-framework`](../src/app/transparency).

## Levels

| Level | Use |
| --- | --- |
| **High** | Strongly supported by current peer-reviewed science and primary sources. |
| **Moderate** | Good evidence; some details open or model-dependent. |
| **Limited** | Limited or preliminary evidence; treat with caution. |
| **Historical** | Established historical fact (events, dates, discoveries). |
| **Interpretive** | Cultural or symbolic tradition — not a scientific claim. |
| **Unknown** | Not yet determined; the honest answer is "unknown". |

## Domain rules (enforced)

- Scientific domains may use: **High, Moderate, Limited, Historical, Unknown**.
- Astrology and mythology must **always** use **Interpretive**.
- `validateEvidenceAssignment(level, domain)` rejects a scientific domain marked
  `interpretive`, and an interpretive domain marked with a scientific level.

This is how "never classify interpretive traditions as scientific evidence"
becomes a build-enforced rule rather than a guideline. See
[SCIENTIFIC_AUTHORITY.md](./SCIENTIFIC_AUTHORITY.md).
