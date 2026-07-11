# Pass 2 — Stars & Stellar Systems: Enrichment Audit

_Honest by construction: no fabricated values; unknowns stay empty; nothing inferred from likelihood._

## Scope audited

`engine.star.all()` — **2,944 stars** (HYG database, CC BY-SA 4.0), all carrying `sources`.

## Characteristic coverage (already populated & rendered)

The catalogue is already rich and the star page already renders it via the approved components: **apparent magnitude (2,944), absolute magnitude, distance (ly + pc, 2,887), spectral type/class (2,942), luminosity class, luminosity (L☉), colour index (B−V), constellation, multiplicity, and cross-identifiers** (HIP / HD / HR / Bayer / Flamsteed / Gliese). No values needed deriving — absolute magnitude is already catalogued.

Genuinely absent (require SIMBAD/Gaia ingestion, **not** fabricated here): effective temperature, radius, mass, parallax, proper motion, radial velocity, metallicity, age, rotation, variable type.

## Data-integrity fixes (verified upstream HYG artifacts)

Independent verification found two real, physically-impossible patterns in the source data — both fixed at the catalogue-assembly layer (`sanitizeStarPhotometry`), so the page, validator and graph all see corrected values while the generated chunks stay pure:

1. **54 stars with impossible luminosity / absolute magnitude** — e.g. `star:beta-phoenix` had `luminositySolar ≈ 4.09×10⁸ L☉` → `absMag ≈ −16.68` and **no distance**. No Milky-Way star approaches this (the most luminous known reach ≈ 10⁶ L☉, M ≈ −12); these are HYG bad-parallax artifacts. `luminositySolar > 5×10⁶` and `absMag < −12.5` are now nulled — an honest empty state (the star keeps its apparent magnitude, spectral type, constellation, etc.).
2. **7 stars with `luminositySolar: 0`** (Barnard's Star, Ross 128, Ross 248, …) — an **underflow** of a very faint red-dwarf luminosity (~10⁻³ L☉). Treated as unknown, not displayed as "0 ☉".

Before → after: displayed luminosity/absMag now contain **0 impossible values** (was 61 across 2,944 stars).

## New permanent validator (fails on dishonesty, not absence)

`npm run validate` → **Star integrity**: luminosity > 0 and ≤ 5×10⁶ L☉; absolute magnitude ∈ [−12.5, 25]; apparent magnitude ∈ [−30, 30]; distance > 0 (ly & pc); colour index ∈ [−1, 6]; **distance ly/pc unit consistency** (`ly ≈ 3.2616 × pc`, ≤ 3 %). Result on the sanitized catalogue: **0 violations across 2,944 stars**.

## Adversarial review — findings independently verified

- **Distance-modulus cross-check** (`absMag ≈ appMag − 5·log₁₀(pc/10)`, ±2 mag) — **0 mismatches**: the catalogue is internally self-consistent (the impossible values were self-consistently wrong, which is why the visible artifact was the *magnitude* of the value, not an internal contradiction).
- **Alias-collision scan** flagged ~173 shared identifiers, but manual verification showed the large majority are **legitimate component/system overlaps** (e.g. `Gl 559A` shares identifiers with the α Cen system; Γ Vir / Porrima are a binary's designations). A naive collision gate would be a false positive, so it is **not** enforced — matching the Pass 1 lesson (don't reject correct data). Genuine duplicate-entity detection needs component/system-aware logic and is flagged for a dedicated pass.
- **Never invented star imagery** — star imagery uses only real survey/sky-field/chart sources (unchanged this pass).

## Remaining gaps (honest)

Temperature / radius / mass / parallax / proper motion / age / metallicity for the catalogue require an authoritative SIMBAD/Gaia/VizieR ingestion (flagged, not fabricated). Component-vs-system duplicate reconciliation is a separate, alias-aware task.
