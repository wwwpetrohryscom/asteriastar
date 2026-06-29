# Citation Engine

A reusable engine that formats a structured `Citation` into standard reference
styles ([`src/lib/citations.ts`](../src/lib/citations.ts)). It **never fabricates
fields** — if authors or a date are absent, the output omits them (or uses the
organization / "n.d."). A live demo runs on [`/developers`](../src/app/developers/page.tsx).

## Supported styles

**APA**, **Chicago**, **MLA**, **Harvard**, **BibTeX**, and **RIS**.

```ts
formatCitation(citation, "apa");   // one style
formatCitationAll(citation);       // [{ style, name, text }, …]
```

## Source

A `Citation` carries: `id`, `title`, `authors?`, `organization`, `publication?`,
`url`, `date?`, `license?`, `notes?`, and an optional `source` key into the
source registry. The `CITATIONS` registry ships **empty** (no fabricated
references); the engine formats any structured record passed to it.

Example — one real NASA reference, rendered in BibTeX:

```bibtex
@misc{nasa-mars-fact-sheet,
  title        = {Mars Fact Sheet},
  organization = {NASA Goddard Space Flight Center},
  year         = {2024},
  url          = {https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html}
}
```

See [SCIENTIFIC_SOURCES.md](./SCIENTIFIC_SOURCES.md) and
[PROVENANCE_MODEL.md](./PROVENANCE_MODEL.md).
