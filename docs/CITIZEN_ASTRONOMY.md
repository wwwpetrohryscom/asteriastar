# Citizen Science, Amateur Astronomy & Public Observing Encyclopedia (Program AY)

The public participation layer of astronomy — how anyone can take part, and how amateurs still do
real science.

This layer **reuses** the aurora, the stellar-occultation and photometry methods, the meteor
showers and the constellations, the eruptive-variable-star class, the Stardust mission, the transit
exoplanet method, the galaxy-morphology-classification ML application, the Rubin Observatory, and
the MAST archive already in the graph. The new entities are the citizen-science projects, the
amateur observing activities, the observing equipment, and the public-outreach activities; the
amateur organisations are created with the existing organization type.

## Data model

`CitizenRecord` is a discriminated record over `CitizenKind`:

| kind | entity type | meaning |
| --- | --- | --- |
| `project` | `citizen_science_project` | a citizen-science project |
| `activity` | `amateur_activity` | an amateur observing activity |
| `equipment` | `observing_equipment` | a piece of observing equipment |
| `outreach` | `outreach_activity` | a public-outreach activity |
| `organization` | `organization` | an amateur-astronomy organisation — a **new entity of the existing type** |

Cross-references: `relatedKeys` (→ `associated_with` the reused phenomena, methods, showers,
constellations, missions, and applications, and the sibling AY entities). Each record may carry a
`platformLabel` (e.g. "On Zooniverse", "Naked-eye to modest aperture").

### Reusing the organization type

The AAVSO, the International Meteor Organization, and ALPO are created as `organization:` entities —
the **same type** as the professional agencies and institutions already in the graph — rather than a
parallel amateur-organisation type. Only the projects, activities, equipment, and outreach are
genuinely new types.

## Contents

- **6 citizen-science projects** — Zooniverse, Galaxy Zoo, Planet Hunters, Globe at Night,
  Aurorasaurus, Stardust@home.
- **6 amateur activities** — backyard observing, variable-star observing, asteroid observing, comet
  observing, occultation timing, meteor observing.
- **6 pieces of equipment** — binoculars, the Dobsonian telescope, the equatorial mount, the star
  tracker, the camera, the astronomical filter.
- **4 public-outreach activities** — the star party, the public observatory, the dark-sky park,
  astronomy education.
- **3 amateur organisations** — the AAVSO, the International Meteor Organization, ALPO.

## Reuse & the graph

Each entity links to the real phenomena, methods, and objects it involves: Galaxy Zoo to the
galaxy-morphology-classification application; Aurorasaurus to the aurora; Stardust@home to the
Stardust mission; Planet Hunters to the transit method; variable-star observing to the AAVSO,
photometry, and the eruptive-variable-star class; occultation and asteroid observing to the
stellar-occultation method; meteor observing to the Perseids and the IMO; astronomy education to the
Rubin Observatory and the MAST archive. Every emitted relation is deduped against
`LEGACY_RELATION_IDS`, and any relation whose endpoint does not resolve is dropped.

## Honesty

Projects, organisations, and equipment are named only where real (Zooniverse, Galaxy Zoo, the AAVSO,
DarkSky International, and so on). No participation numbers or outcomes are invented.

## Engine (`engine.citizenAstronomy`)

`ResolvedCitizen` resolves an entry to the reused entities it uses (`related`) and the other AY
entities that reference it (`usedBy`). Query surface: `projects()`, `activities()`, `equipment()`,
`outreach()`, `organizations()` (each sorted by name), and `resolveEntry(slug)`.

## Pages

- `/citizen-astronomy` — the hub: the citizen-science projects, discovery hubs, and provenance.
- `/citizen-astronomy/{slug}` — an adaptive entry for a project, activity, piece of equipment,
  outreach effort, or organisation.
- `/citizen-astronomy/discover/{slug}` — citizen science, amateur observing, equipment, outreach,
  and organisations.

## Provenance

Curated from NASA and the citizen-science and amateur-astronomy communities. Nothing is fabricated;
unknown values are left empty.
