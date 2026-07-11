# Pass 3 — Exoplanets & Planetary Systems: Enrichment Audit

_Honest by construction: no fabricated values; unknowns stay empty; derived values are computed only from source-backed inputs with a documented, standard method and are labelled `· derived`._

## Scope audited

`engine.exoplanet` / `EXOPLANET_RECORDS` — **849 exoplanets** generated from the **NASA Exoplanet Archive** Planetary Systems Composite Parameters table (187 systems, 333 new host stars + 131 reused existing stars). Every record carries a `sources` reference.

## Characteristic coverage (already populated & rendered)

The catalogue is already rich and the exoplanet page renders it through the approved components (Quick facts, ExoplanetTable, host/system/method cards):

| Field | Populated | Field | Populated |
| --- | ---: | --- | ---: |
| discovery method | 849 | mass (M⊕) | 846 |
| discovery year | 848 | radius (R⊕) | 820 |
| discovery facility | 849 | equilibrium temp (K) | 801 |
| orbital period (d) | 771 | insolation (S⊕) | ~760 |
| semi-major axis (AU) | 820 | host Teff / radius / mass | 824 / 806 / 841 |
| eccentricity | 733 | host distance (pc) | 841 |
| classification (radius scheme) | 849 | host spectral type | (most) |

Genuinely absent (require a dedicated authoritative ingestion, **not** fabricated here): measured bulk density, atmospheric composition, obliquity, true (vs minimum) mass for RV-only planets, age.

## Enrichment applied (this pass)

**Derived bulk density — 799 planets.** The archive stores no density; where a planet carries source-backed **mass + radius** it is computed with the standard relation and **labelled `· derived`** with a visible method note:

- `ρ = M / (4⁄3·π·r³)`, from the planet's own Earth-mass and Earth-radius (M⊕ = 5.972×10²⁴ kg, R⊕ = 6.371×10⁶ m).

Verified against Earth (M⊕ = 1, R⊕ = 1 → **5.51 g/cm³**, the known value). Computed at render time — the catalogue stays measurement-only.

Of the 820 planets with both inputs, **21 are withheld**: their derivation exceeds **30 g/cm³**, which no planetary composition (even a compressed pure-iron world) can reach. Those rows pair a loosely-constrained mass (typically a TTV mass upper limit, e.g. `kepler-80-f` at 4 460 M⊕ / 1.21 R⊕ → 13 879 g/cm³) with a transit radius; the two come from inconsistent measurements, so no honest density can be formed and none is shown.

## Data-integrity fixes (verified archive artefacts)

1. **Insolation underflow — 86 planets with `insolationFlux: 0`.** Very wide, faintly-lit directly-imaged companions receive S⊕ ≪ 0.001, which underflows the archive's stored precision to `0`. Treated as **unknown** (not "0 S⊕"): the page suppresses a non-positive insolation and the validator rejects only a *negative* flux.
2. **Sub-CMB equilibrium temperature — 2 planets** (`gj-900-b` 1 K, `ucac3-113-933-b` 2 K). An insolation-set equilibrium temperature cannot fall below the cosmic-microwave-background floor (**2.725 K**); these are archive artefacts, now shown as an honest empty state rather than an impossible measurement.

## New permanent validator (fails on dishonesty, not absence)

`npm run validate` → **Exoplanets** now additionally checks every record for impossible or contradictory values (bounds kept generous so real, source-backed extremes — wide imaged companions, inflated young radii, brown-dwarf-mass objects, hot hosts — are never rejected):

- positive-only: orbital period, semi-major axis, radius, mass, equilibrium temp, host Teff / radius / mass / distance;
- **eccentricity ∈ [0, 1)** for a bound planet;
- **discovery year ∈ [1988, current year + 1]** (predates exoplanet detection ⇒ fail; future ⇒ fail);
- **host id resolves** to a `star:` or `host_star:` entity;
- **insolation** rejects only a negative flux (0 = underflow = unknown);
- **wrong-host-linkage guard**: planets sharing one host may not disagree on host Teff by > 30 % (a larger gap implies a different spectral type).

Result: **0 violations across 849 planets** (the insolation-underflow handling above is what brought it to zero from an initial 88).

## Adversarial review — findings independently verified, false positives caught

- **Kepler's third law cross-check** (`P_yr² ≈ a_AU³ / M☉`): **98.7 %** internally consistent (733/743 within ±43 %). The 10 outliers (e.g. `hd-145675-c`, `oph-11-b`) are **heterogeneous composite-parameter rows** — semi-major axis and period drawn from different references, or wide imaged orbits with poorly-constrained host mass — not fabrication. A hard gate here would reject correct archive data, so it is **reported, not enforced** (the Pass 1 albedo / Pass 2 alias lesson).
- **Host-parameter scatter**: planets sharing a host can carry slightly different host mass/radius fits across their per-planet composite rows (e.g. `hip-57274`: host mass 0.29 vs 0.73 M☉, yet Teff 4510–4640 K and spectral type **K4 V agree**). This is measurement heterogeneity for the *same real star*, not a wrong-host linkage, so mass/radius/distance are **not** gated; only a gross **Teff** contradiction (> 30 %, which would flip the spectral type) is — and that passes clean (worst real spread 12.8 %).
- **Density ceiling** (see above) prevents presenting an impossible derived value from inconsistent inputs.
- **Habitability language reviewed and left intact** — it is already exemplary: a `Habitable-zone candidate` badge and a "Habitability notes" section that states plainly that lying in the habitable zone is **not** evidence the planet is habitable or inhabited. No "Earth-like" or life claims exist; the 21 flagged planets are habitable-**zone** candidates only, each source-backed. Nothing was added or softened.

## Remaining gaps (honest, not fabricated)

Measured bulk density, atmospheric composition, true masses for RV-only planets, obliquity and age require a dedicated authoritative ingestion (NASA Exoplanet Archive extended tables / individual discovery papers) and are flagged for a follow-up, not invented here. Where a value is genuinely unknown, the page shows an honest empty state.
