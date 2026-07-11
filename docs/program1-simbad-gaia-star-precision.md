# Program 1 — SIMBAD + Gaia priority star parameters

_Source-level enrichment with field-level provenance. Honest by construction: every value is transcribed verbatim from a real authoritative source row; a field a source did not provide stays empty; nothing is inferred or fabricated._

## Objective

Attach authoritative astrometry, photometry and astrophysical parameters — with exact, per-field provenance — to the star catalogue, without touching the generated HYG data.

## Sources & method

| Source | Dataset / table | What we read |
| --- | --- | --- |
| **SIMBAD** | `basic` (TAP) | ICRS coordinates, parallax, proper motion, radial velocity, spectral type — each with SIMBAD's own **per-field bibcode** |
| **Gaia DR3** | `gaia_source` ⨝ `astrophysical_parameters` ⨝ `external.gaiaedr3_distance`, crossmatched via `hipparcos2_best_neighbour` | DR3 `source_id`, Bailer-Jones (2021) geometric distance, GSP-Phot Teff / radius / log g / [M/H], RUWE |

Ingestion is deterministic, resumable and **snapshot-based**: `npm run precision:stars` queries the live TAP services once and writes committed `.ts` snapshots (`precision/snapshots/`), each stamped with a retrieval date. Nothing depends on a live science API at build or run time. Stars are matched by their **HIP** identifier (2,924 of 2,944 carry one).

The overlay (`star-catalog/precision/`) normalises each snapshot value into a `ScientificValue<T>` (value · unit · uncertainty · status · sourceRef · dataset · table · column · row id · epoch · frame · bibcode · retrievedAt · method), keyed by star id — the generated catalogue stays untouched.

## Coverage (of 2,944 catalogue stars)

| Field | Count | % | Status classification |
| --- | ---: | ---: | --- |
| precision overlay present | 2,924 | 99.3 % | — |
| parallax (+ uncertainty on 99.9 %) | 2,921 | 99.2 % | **measured** (SIMBAD) |
| proper motion | 2,924 | 99.3 % | measured |
| radial velocity | 2,923 | 99.3 % | measured |
| spectral type | 2,919 | 99.2 % | catalogued |
| Gaia DR3 source id | 2,247 | 76.3 % | catalogued |
| distance | 2,164 | 73.5 % | **estimated** (Bailer-Jones 2021) |
| effective temperature | 1,090 | 37.0 % | **modeled** (Gaia GSP-Phot) |
| radius / metallicity | 1,090 | 37.0 % | modeled |

**294 distinct source bibcodes** are referenced across the parallax/RV/spectral fields — real, diverse provenance, not a single default.

## Honesty rules enforced

- **Status is never upgraded.** A SIMBAD parallax is `measured`; a Bailer-Jones distance is `estimated` (a Bayesian inference, method documented); a Gaia GSP-Phot Teff/radius is `modeled` — never presented as a measurement.
- **Parallax is not blindly inverted.** Only positive SIMBAD parallaxes become values; distance uses the Bailer-Jones geometric estimate (which already handles the low-SNR prior), not a naive `1/parallax`. Gaia's 2 negative parallaxes are left with no distance.
- **64-bit ids preserved exactly.** Gaia `source_id` (~2×10¹⁸, above JS's 2⁵³ safe integer) is cast to text in the ADQL (`CAST(source_id AS VARCHAR)`) so it never passes through a JS float64 — every stored id resolves to the real Gaia object.
- **Component/system confusion guard.** If two stars ever resolved to one Gaia `source_id`, the Gaia overlay would be dropped for both (SIMBAD resolves them). With exact ids there are **0** such collisions.
- **Astrometric quality surfaced, not hidden.** 717 stars with Gaia RUWE > 1.4 carry a visible "elevated RUWE" note (often an unresolved companion).
- **No derived absolute magnitude** was added: an honest derivation needs an explicit extinction treatment, which we do not have per star, so none is claimed.
- Gaia-sourced values carry the exact `source_id` and table/column as provenance but **no hand-typed bibcode** — only SIMBAD's machine-supplied bibcodes are recorded, so no publication metadata is invented.

## Visible rendering

The star page gains a **Precision measurements** section (`PrecisionMeasurements`, built from existing table/card styling — no redesign): each value shows inline with unit and uncertainty, a per-row `source · status` chip, and a progressive-disclosure "Full field-level provenance" list (organization · dataset · table · column · bibcode · row id · status · retrieval date). A footnote defines measured / estimated / modeled.

## Permanent validator

`npm run validate` → **Star precision**: every `ScientificValue` is structurally checked (real source, well-formed bibcode/DOI, derived-needs-method, non-negative uncertainty); plus a **SIMBAD↔catalogue coordinate cross-check** (a > 30″ separation flags a wrong match), impossible-range guards (parallax, distance, Teff, radius), and **duplicate `source_id` / SIMBAD-id** detection (one physical object mapped onto two stars). Result: **0 violations across 2,924 overlays.**

## Adversarial findings (independently verified, fixed before merge)

A five-lens multi-agent review confirmed five findings (0 refuted), which collapsed to three real defects — all fixed:

1. **Gaia `source_id` corrupted by float64 rounding (blocker).** The TAP JSON response returned `source_id` as a bare number literal; `JSON.parse` rounded these ~19-digit ids past JS's 2⁵³ safe range, so 2,246 of 2,249 stored ids ended in a rounding artefact and did **not** resolve to a real Gaia object — a fabricated identifier. Fixed by casting `source_id` to text in the ADQL and re-ingesting; verified the ids now resolve live (e.g. Barnard's Star → `4472832130942575872`).
2. **The Struve 2398 A/B "shared crossmatch" was an artefact of that bug.** The two components have distinct real ids (`…131840` and `…131712`) that both rounded to the same double; once ids are exact the collision disappears and both components correctly keep their own Gaia data.
3. **A too-strict bibcode regex** rejected the real SIMBAD bibcode `1971PW&SO...1a...1S` — relaxed to accept genuine ADS bibcodes while still catching corruption.
4. **`--resume` never resumed** (the anchor matched the `SimbadStarRow[]` type annotation, not the data array) — fixed to anchor on the assignment.

## Remaining gaps (honest)

Age, rotation period, v sin i, mass, and mode-resolved multiplicity are not in the SIMBAD `basic` / Gaia GSP-Phot fields ingested here and would require dedicated VizieR/primary-paper queries — flagged, not fabricated. 20 stars lack a HIP id and so have no overlay; 675 (mostly the brightest, saturated in Gaia) have SIMBAD only. GSP-Phot parameters exist for 37 % of stars; the rest keep an honest empty state.

## Commands

- `npm run precision:stars` — refresh SIMBAD + Gaia snapshots
- `npm run precision:report` — coverage report
- `npm run validate` — includes the star-precision gate
