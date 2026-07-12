# Ops Program 1 — Derived values → field-level provenance

_Migrates every value the platform previously derived inline in a page component into the unified provenance registry, each carrying its formula, versioned implementation, source-backed inputs and a fixed reference instant. Honest by construction: a derived value is never presented as an observation, and no input is missing or a zero-underflow._

## Migration audit (repository-wide)

Every derived/calculated value that rendered outside the provenance system is now registry‑backed. No other inline derivations were found beyond these:

| Domain | Field | Formula | Count |
| --- | --- | --- | ---: |
| Solar System | surface gravity | `g = GM / r²` | 22 |
| Solar System | escape velocity | `v = √(2GM / r)` | 22 |
| Exoplanets | bulk density | `ρ = M / (4⁄3·π·r³)` | 799 |
| Deep sky | projected axis ratio | `b/a = minor ÷ major` | 212 |
| Missions | mission duration | `Δt = end − launch` (calculated) | 1 |
| Missions | time since launch | `Δt = reference − launch` (calculated) | 23 |
| **Total** | | | **1,079** |

(The deep‑sky *physical size* derivation was already a `derived` `ScientificValue` in the precision layer; it remains there — 677 values.)

## Data model

- **`DerivedScientificValue<T>`** (`src/lib/provenance/derived-value.ts`) extends `ScientificValue` (so it flows through the registry, API and export) with the full derivation record: `formulaId · formulaVersion · formula · calcImplVersion · calculatedAt · inputs[] · uncertainty · uncertaintyMethod · assumptions · limitations`. Each input carries its `value · unit · uncertainty · provenanceRef · sourceRef`.
- **Formula registry** (`src/lib/provenance/formulas.ts`) — six identified, versioned formulae with their constants (`G` = 6.674×10⁻¹¹ CODATA 2018; `M⊕`/`R⊕` IAU 2015 B3 nominal) and references; `deriveValue()` builds a `DerivedScientificValue`.
- **Derived catalogue** (`knowledge-graph/data/derived-values/`) — the single source of truth: `collectDerived()`, `derivedForEntity(id)`, `derivedField(id, field)`, `DERIVED_STATS`, `validateDerivedValues()`.
- New source key **`asteriastar-derived`** (authorityType `reference`) — transparently marks a value as computed by the platform from cited inputs, never an observation.

## Honesty rules enforced

- **No missing / zero‑underflow inputs.** A body with `mass1e24Kg = 0` (a coarse‑unit underflow) or a planet with a non‑positive mass/radius is skipped, exactly as before.
- **Physically‑impossible results withheld.** Exoplanet density > 30 g/cm³ (inconsistent mass/radius) is not produced.
- **Time‑dependent values are never "timeless".** *Time since launch* is `calculated` against a **fixed reference instant** (the data‑release date), labelled "as of {date}", and distinguished from an actual (fixed) *mission duration*. Planned/primary/extended durations are called out as not modelled.
- **Uncertainty is never invented.** The source catalogues store mass/radius/dates without uncertainty, so none is propagated; each value is explicitly labelled "not propagated (inputs carry no catalogued uncertainty)".
- **Constants are versioned and cited** (CODATA/IAU); the formula and implementation both carry a version.

## Visible rendering

Each migrated page (`solar-system`, `exoplanets`, `deep-sky`, `exploration`) now shows the value with a `· derived` label sourced from the registry, plus a **Derived values** panel (`DerivedValuesPanel`, existing card styling — no redesign) exposing, through progressive disclosure: the formula + versions, every source‑backed input with its source, assumptions, limitations, uncertainty state and the reference instant.

## Permanent validators

- **`validateDerivedValues`** (wired into `npm run validate` and `npm run provenance:validate`): rejects a derivation without a formula/versions, without input provenance, with a missing input value/unit, with an uncertainty but no method, a non‑physical output, a duplicate derived field, or — crucially — an **output inconsistent with an independent recomputation** from the stored inputs (> 0.5 % drift). Result: **0 violations across 1,079 values.**
- All derived values also pass the base `validateAllProvenance` gate.

## API / export

Derived provenance flows through the existing surfaces automatically:
- **`GET /api/v0/entities/{id}/provenance`** now returns the entity's derived values with their formula, inputs and reference instant;
- the **field‑provenance export** and **registry stats** include them (registry total **34,232** across **4,487** entities; derived `status` values 1,732; `calculated` 492).

## Adversarial review (independently verified, fixed before merge)

A five-lens multi-agent review confirmed eight findings (one refuted), fixed here: (1) the migrated mission-**duration** branch had dropped the *not-yet-launched* guard the old inline code enforced (a latent regression that would show a duration for a future/planned mission) — restored against the fixed reference instant; (2) mission date **inputs hardcoded `sourceRef: "nasa"`**, mis-attributing ESA/JPL missions (BepiColombo, Europa Clipper, …) — now use each record's real source; (3) the panel's number formatting stripped trailing zeros, diverging from the inline rows — aligned to the same fixed-decimal formatting.

## Remaining gaps (honest)

Input uncertainties (exoplanet mass/radius, small‑body physical params) exist upstream but are not stored in the in‑repo catalogue records, so no uncertainty is propagated yet — promoting those inputs to `ScientificValue`s with uncertainty is the next migration step and would let gravity/escape/density carry a propagated error.

## Commands

- `npm run provenance:validate` — derived‑value + cross‑domain provenance gate
- `npm run validate` — includes the derived‑value gate
