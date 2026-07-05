# Astrobiology, Biosignatures & the Search for Life Encyclopedia (Program AR)

The science of life beyond Earth — how life might begin, where it could survive, how we would
recognise its signs, and how the search is kept honest.

This layer **reuses** the ocean-world moons (Europa, Enceladus, Titan), Mars, the habitable-zone
concept, the SETI Institute, the life-search missions (Europa Clipper, Dragonfly, Perseverance),
the ocean-worlds exploration theme, spectroscopy, and the Enceladus tiger-stripes already in the
graph. The new entities are the astrobiology disciplines, the biosignatures, the habitability
factors, and the planetary-protection measures.

## Data model

`AstrobiologyRecord` is a discriminated record over `AstrobiologyKind`:

| kind | entity type | meaning |
| --- | --- | --- |
| `topic` | `astrobiology_topic` | a discipline of astrobiology (the grouping) |
| `biosignature` | `biosignature` | a class of biosignature or technosignature |
| `factor` | `habitability_factor` | a factor of planetary habitability |
| `protection` | `planetary_protection` | a planetary-protection measure |

Cross-references: `topicSlug` (→ `member_of_group` its discipline) and `relatedKeys`
(→ `associated_with` the reused moons, Mars, the habitable-zone concept, SETI, the life-search
missions, and spectroscopy).

## Honesty first

The search for life is presented as science, never as a claim. **No detection of extraterrestrial
life is asserted.** Biosignatures are *potential* signs, and the `biosignature-false-positive`
entity is a first-class part of the catalog — ruling out false positives (abiotic oxygen,
geological methane, the Venus phosphine debate) is presented as the hardest and most important
part of any claim. Technosignatures/SETI are kept distinct from the search for microbial life.

## Reuse

Habitability factors point at the ocean worlds and the habitable-zone concept; biosignatures point
at spectroscopy and the Mars rover missions; the ocean-worlds discipline reuses Europa/Enceladus/
Titan, the ocean-worlds theme, and the Europa Clipper and Dragonfly missions; technosignatures
reuse the SETI Institute. Every emitted relation is deduped against `LEGACY_RELATION_IDS`, and any
relation whose endpoint does not resolve is dropped.

## Engine (`engine.astrobiology`)

`ResolvedAstrobiology` resolves an entry to its discipline, the reused entities it concerns, and
(for a discipline) its members. Query surface: `topics()`, `biosignatures()`, `factors()`,
`protection()`, `byTopic(slug)`, and `resolveEntry(slug)`.

## Pages

- `/astrobiology` — the hub: disciplines, discovery hubs, and provenance.
- `/astrobiology/{slug}` — an adaptive entry for a discipline, biosignature, habitability factor,
  or planetary-protection measure.
- `/astrobiology/discover/{slug}` — disciplines, biosignatures, habitability, and planetary
  protection.

## Provenance

Curated from NASA and ESA. No claim of extraterrestrial life is asserted; nothing is fabricated.
