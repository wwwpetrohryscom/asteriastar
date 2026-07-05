# Astrochemistry & the Molecular Universe Encyclopedia (Program BB)

How chemistry builds stars, planets, and the ingredients of life — the rich chemistry of the cold
clouds between the stars, inherited by every new world.

This layer **reuses** the spectroscopy method, ALMA and APEX, the James Webb Space Telescope, the
Orion Nebula, the origins-of-life topic, the Murchison and Allende meteorites, and the infrared,
radio, submillimetre, and ultraviolet bands already in the graph. The new entities are the
interstellar environments, the interstellar molecules, and the astrochemical processes.

## Data model

`ChemistryRecord` is a discriminated record over `ChemistryKind`:

| kind | entity type | meaning |
| --- | --- | --- |
| `environment` | `interstellar_environment` | an interstellar environment / phase of the ISM |
| `molecule` | `interstellar_molecule` | an interstellar molecule or molecule class (carries its `formula`) |
| `process` | `astrochemical_process` | an astrochemical process |

Cross-references: `relatedKeys` (→ `associated_with` the reused telescopes, methods, meteorites, the
Orion Nebula, and bands, and the sibling BB entities). A molecule carries its chemical `formula`
(e.g. H₂O, CO, CH₃OH; "—" for a class such as PAHs).

## Contents

- **5 interstellar environments** — the diffuse interstellar medium, molecular clouds, star-forming
  regions, protoplanetary disks, and interstellar dust.
- **8 molecules** — water, carbon monoxide, carbon dioxide, ammonia, hydrogen cyanide, methanol,
  polycyclic aromatic hydrocarbons, and amino-acid precursors.
- **7 astrochemical processes** — gas-phase chemistry, grain-surface chemistry, photochemistry,
  shock chemistry, prebiotic chemistry, planet-formation chemistry, and cometary & meteoritic
  chemistry.

## Reuse & the graph

Each entity links to the real telescopes and objects that reveal it: molecular clouds and CO to
ALMA; PAHs and water to the James Webb Space Telescope; star-forming regions to the Orion Nebula;
amino-acid precursors and cometary/meteoritic chemistry to the Murchison and Allende meteorites and
the origins-of-life topic. Every emitted relation is deduped against `LEGACY_RELATION_IDS`, and any
relation whose endpoint does not resolve is dropped.

## Honesty

Molecular formulae are given where they are simple and well-established; molecule classes such as
PAHs carry no single formula. No abundances, temperatures, or reaction rates are invented.

## Engine (`engine.astrochemistry`)

`ResolvedChemistry` resolves an entry to the reused entities it uses (`related`) and the other BB
entities that reference it (`usedBy`). Query surface: `environments()`, `molecules()`,
`processes()` (each sorted by name), and `resolveEntry(slug)`.

## Pages

- `/astrochemistry` — the hub: the molecules of space, discovery hubs, and provenance.
- `/astrochemistry/{slug}` — an adaptive entry for an interstellar environment, molecule, or
  astrochemical process.
- `/astrochemistry/discover/{slug}` — interstellar environments, molecules, and astrochemical
  processes.

## Provenance

Curated from NASA, ESO/ALMA, and the astrochemistry community. Nothing is fabricated; unknown values
are left empty.
