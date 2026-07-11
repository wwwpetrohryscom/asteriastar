# Program 5 — Field-level provenance system

_The capstone: one model, one registry, one gate for every source-traced value on the platform. Honest by construction — a value can only exist if it names a real source, and its status can never be silently upgraded._

## The model

`src/lib/provenance/scientific-value.ts` defines **`ScientificValue<T>`** — a value plus everything needed to answer *where did this come from, and how sure are we?*:

`value · unit · uncertainty · status · method · sourceRef · sourceDataset · sourceTable · sourceField · sourceRowId · objectIdentifier · epoch · referenceFrame · bibcode · doi · retrievedAt · verifiedAt · notes`

`status` is one of **measured · catalogued · estimated · modeled · calculated · derived · disputed · upper_limit · lower_limit · planned · historical** and is never silently upgraded (a modeled Teff is never shown as measured; a Bailer-Jones distance is `estimated`, not `measured`; an orbit-fit element is `calculated`). `validateScientificValue` enforces the structural contract (a real source, a well-formed bibcode/DOI, a documented method for derived/calculated values, non-negative uncertainty).

## The registry

`src/lib/provenance/registry.ts` unifies the four precision domains into one queryable surface:

| Domain | Source | Values |
| --- | --- | ---: |
| Stars | SIMBAD · Gaia DR3 | 29,242 |
| Deep sky | SIMBAD · NED | 3,100 |
| Small bodies | JPL SBDB | 650 |
| Missions | Wikidata | 161 |
| **Total** | | **33,153 across 3,661 entities** |

- **484 distinct bibcodes** referenced; **6,935** values carry an uncertainty; **7,546** carry an epoch.
- By status: measured 19,309 · catalogued 6,115 · modeled 4,368 · estimated 2,216 · derived 677 · calculated 468.

`collectProvenance()`, `provenanceForEntity(id)` and `provenanceStats()` expose it; `validateAllProvenance()` is the cross-domain gate.

## The gate

`npm run provenance:validate` (also wired into `npm run validate`) runs the structural honesty check on **every one of the 33,153 values** plus registry-level invariants: a known source; a valid bibcode; a `derived`/`calculated` value documents its method; a bare Wikidata QID is never shown as a value. Result: **0 violations.**

## Visible source disclosure

The reusable **`ProvenanceStatTable`** renders any value with its unit and uncertainty inline, a `source · status` chip, and a progressive-disclosure "Full field-level provenance" list (organization · dataset · table · column · bibcode · row id · method · status · retrieval date). It is used by the **deep-sky, small-body and mission** precision sections; the **star** section uses the equivalent pre-existing `PrecisionMeasurements` component (which renders the same fields and disclosure). Both share the same model — no page-specific provenance UI, no new design language.

## API / Open Data

Full per-entity provenance is served by **`GET /api/v0/entities/{id}/provenance`** — every source-traced `ScientificValue` for the entity, schema-versioned. `npm run exports:generate` additionally emits `public/exports/field-provenance.json` (`provenanceSchemaVersion 1.0.0`) carrying the **schema**, the aggregate **summary**, and a representative **sample**, keeping the bulk export small and matching the graph-export convention. Both additions are backward-compatible (a new route + a new file; the manifest tracks the file's checksum).

## Citation integration

Every paper-backed value carries an ADS **bibcode** (484 distinct), and Wikidata-sourced values carry their **QID** — so a field value resolves to a citation, reusing the shared `SOURCES` registry rather than duplicating source records.

## Migration status & plan

- **Migrated (full ScientificValue provenance):** all four precision domains above — the highest-value, externally-sourced fields.
- **Entity-level provenance only (a documented follow-up):** the inline *derived* values added in the earlier enrichment passes — Solar-System surface gravity/escape velocity, exoplanet bulk density, deep-sky axis ratio, mission duration — are rendered with a visible "· derived" label and method note but are computed at render time rather than carried as `ScientificValue`s. They are honest today; promoting them into the registry is the next migration step (priority order: solar gravity/escape → exoplanet density → deep-sky axis ratio → mission duration).

## Versioning & backward-compatibility

The provenance export is versioned (`provenanceSchemaVersion`) independently of the graph schema; new optional fields are additive; existing exports and the entity API are unchanged. No consumer of the prior exports breaks.

## Commands

- `npm run provenance:validate` — cross-domain field-provenance gate + coverage
- `npm run precision:report` — full coverage report across all five programs
- `npm run exports:generate` — regenerate the Open Data exports (incl. field-provenance)
- `npm run validate` — includes the unified provenance gate
