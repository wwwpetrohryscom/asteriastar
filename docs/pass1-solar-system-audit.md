# Pass 1 — Solar System & Planetary Bodies: Enrichment Audit

_Scientific characteristics enrichment, Pass 1. Honest by construction: no fabricated values; unknowns stay empty; derived values are computed only from source-backed inputs with a documented, standard method and are labelled `· derived`._

## Scope audited

`engine.solar.all()` — **89 bodies**: 8 planets, 5 dwarf planets, 24 moons, the Sun, 10 asteroids, 10 comets, 19 missions, 6 spacecraft, 6 surface features. **All 89 carry a `sources` reference** (every catalogued value is already source-backed).

## Characteristic coverage (populated fields, of 89)

| Field | Populated | Field | Populated |
| --- | ---: | --- | ---: |
| mass | 34 | semi-major axis | 9 |
| radius | 35 | distance from Sun | 9 |
| diameter | (planets/dwarfs) | perihelion / aphelion | 9 / 9 |
| density | 33 | orbital period | 24 |
| **surface gravity** | **9 → 34** | eccentricity | 9 |
| **escape velocity** | **9 → 34** | inclination | 9 |
| rotation period | 9 | axial tilt | 9 |
| mean temperature | 10 | albedo | 24 |
| discovery year | 24 | magnitude | 24 |
| classification | 65 | designation | 25 |

`atmosphere`, `surface`, `composition` are essentially unpopulated (0 / 0 / 1) — that absence is legitimate; filling them requires a dedicated authoritative-text ingestion and is **not** fabricated here.

## Enrichment applied (this pass)

**Derived surface gravity + escape velocity — 25 bodies** (major moons and dwarf planets that carry source-backed **mass + radius** but no separately-catalogued gravity/escape). Computed with the standard relations and **labelled `· derived`** on the page, with a visible method note:

- surface gravity `g = GM / r²`
- escape velocity `v = √(2GM / r)` &nbsp;(`G = 6.674×10⁻¹¹ m³ kg⁻¹ s⁻²`)

Inputs are the body's own source-backed mass and mean radius; the values are computed at render time (the catalogue stays measurement-only) and clearly distinguished from catalogued measurements. Verified against Earth (g ≈ 9.82 m/s², v ≈ 11.2 km/s) — correct.

Before → after: catalogued **9** bodies with gravity/escape; now **34** display gravity/escape (9 catalogued + 25 derived-and-labelled).

## Integrity validator (new permanent gate)

`npm run validate` now checks every solar body for **impossible or contradictory** values (never for absence):

- positive-only: mass, radius, diameter, density, gravity, escape velocity, semi-major axis, orbital period;
- eccentricity ≥ 0; albedo ≥ 0; inclination ∈ [0,180]°; axial tilt ∈ [0,360]°;
- density ≤ 30 g/cm³; temperature ≥ −273.15 °C; perihelion ≤ aphelion;
- discovery year ≤ current year + 1 and ≥ −3000; rotation period ≠ 0.

Result: **0 violations** across 89 bodies.

## Adversarial review — false positive caught

An initial naive check flagged `moon:enceladus` (albedo 1.375) and `moon:tethys` (1.229) as "albedo > 1". Independent verification: these are **geometric albedos**, which legitimately exceed 1 for high-backscatter icy surfaces (Enceladus ≈ 1.375 is the accepted value). The check was corrected to `albedo ≥ 0` only — **no upper bound** — so correct data is not rejected. Retrograde rotation (negative period) is likewise allowed.

## Data-integrity finding (caught by the new validator)

The validator also surfaced `moon:phobos`, `moon:deimos` and `moon:amalthea` carrying `mass1e24Kg: 0`. Verified: their true masses (~10¹⁵–10¹⁸ kg) **underflow the coarse ×10²⁴ kg unit** and were stored as `0`. Displaying "0 ×10²⁴ kg" would be a false claim, so a coarse-unit `0` is now treated as **not representable / unknown** — the page shows an honest empty state (no mass, no derived gravity for those three), and the validator rejects only a *negative* mass. Their real masses are a follow-up once the mass field supports sub-10²⁴ kg values.

## Remaining gaps (honest, not fabricated)

- Moon **mass/orbital elements** for bodies that currently lack them, and **atmosphere / surface / composition** text — require a dedicated authoritative ingestion (NASA Planetary Fact Sheet, JPL Planetary Satellite Physical/Orbital Parameters, USGS). Flagged for a follow-up ingestion; not invented here.
- Where a value is genuinely unknown, the page shows an honest empty state rather than a placeholder.
