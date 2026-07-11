# Program 2 — NED + SIMBAD deep-sky distances, redshift & physical size

_Source-level enrichment with field-level provenance. Honest by construction: every value is transcribed verbatim from a real authoritative row; unknown stays empty; derived values are labelled and their inputs named._

## Objective

Give the deep-sky catalogue authoritative distances, redshifts/velocities and — for the first time — **physical sizes**, each with exact provenance, filling the Pass 4 gap (the catalogue itself carries no distance).

## Sources & method

| Source | Dataset / table | What we read |
| --- | --- | --- |
| **SIMBAD** | `basic` (TAP) | ICRS coordinates, redshift **and** radial velocity with a measurement-type flag (`rvz_type`) and bibcode |
| **SIMBAD** | `mesDistance` (TAP) | best (`mespos = 1`) distance measurement — value, unit, **determination method**, quality, bibcode |
| **NED** | ObjectLookup | authoritative extragalactic **redshift** (value, uncertainty, quality, bibcode) — galaxies only |

Ingestion is snapshot-based (`npm run precision:deep-sky`): committed `.ts` snapshots stamped with a retrieval date; no runtime dependence on the live services. Objects are matched by their canonical catalogue id (`M 31`, `NGC 224`, …); SIMBAD returns ids space-padded, so whitespace is normalised on both sides.

## Coverage (of 619 catalogue objects)

| Field | Count | % | Status |
| --- | ---: | ---: | --- |
| precision overlay present | 616 | 99.5 % | — |
| distance (light-years) | 519 | 83.8 % | **catalogued** (method named) |
| **physical size (major/minor axis)** | 519 | 83.8 % | **derived** |
| radial velocity | 539 | 87.1 % | measured |
| redshift (galaxies) | 135 | 21.8 % | catalogued (NED) |

Verified: M31 → 2.48 Mly, ~128,000 ly across; Orion Nebula → 1,592 ly, ~42 ly across; M104 → 14.5 Mpc (Tully-Fisher).

## Honesty rules enforced

- **Redshift ≠ radial velocity.** A redshift is attached **only** to extragalactic objects (`entityType = galaxy`, NED-authoritative). Every Galactic cluster/nebula (403 objects) shows a **radial velocity** instead — a Doppler shift, never labelled a redshift. The gate rejects any redshift on a non-galaxy (0 found).
- **Sign honesty.** Velocity is always labelled **"radial velocity"** (never "recession velocity"): 14 nearby galaxies (M31, M33, M81, M32, M110, …) are **blueshifted / approaching** (negative velocity, negative z), and a negative redshift is a blueshift dominated by local motion — never a cosmological recession.
- **Uncertainty of the right nature.** SIMBAD's `rvz_err` is only shown as a `± km/s` velocity error when the measurement type is a velocity (`rvz_type = 'v'`); for a redshift-type measurement it is a *dimensionless* redshift error and is attached to the redshift, not fabricated as a velocity error.
- **NED is extragalactic only** — Galactic objects are never sent to it, so no bogus redshift-distance is produced for a Milky-Way nebula.
- **Distance is `catalogued`, not "measured"**, and always carries its determination `method` (Tully-Fisher, TRGB, kinematic, …) so a model-dependent distance is never dressed up as a direct measurement.
- **Physical size is `derived`** from OpenNGC angular size × the catalogued distance (small-angle `size = angle × distance`), labelled and with both inputs named — never presented as an observation.
- **No coordinate-based exclusion.** Objects are matched by **exact catalogue designation**, so SIMBAD cannot return a different-designation object; a large SIMBAD↔catalogue offset for an extended cluster/nebula is a centroid-convention difference, not a wrong match. The validator flags only a **gross** offset (> 3°, a genuine coordinate data error).
- **Non-ADS reference codes** (e.g. NED's `2005SDSS4.C...0000:`) are preserved as a note, never stored as a bibcode.

## Visible rendering

The deep-sky page gains a **Precision measurements** section (reusable `ProvenanceStatTable`, existing styling — no redesign): distance, derived physical size (major/minor), redshift (galaxies) or radial velocity, and coordinates — each with a `source · status` chip and progressive-disclosure full provenance. A footnote states the physical-size derivation and the redshift-vs-velocity distinction.

## Permanent validator

`npm run validate` → **Deep-sky precision**: structural honesty of every value; the **redshift/velocity distinction**; a gross-error **coordinate cross-check** (> 3°); and physical-size consistency (positive, minor ≤ major). Result: **0 violations across 616 overlays.**

## Adversarial review (independently verified, fixed before merge)

A five-lens multi-agent review confirmed four findings (one refuted), fixed here: (1) 14 blueshifted galaxies were mislabelled "recession velocity" / "cosmological redshift" — now sign-neutral "radial velocity" with sign-aware wording; (2) SIMBAD's `rvz_err` was shown as a `± km/s` velocity error even for redshift-type measurements — now attached with the correct nature; (3) the size-aware coordinate exclusion false-positived on extended objects (IC 2944, NGC 3247, …) that are correctly identified by designation — removed in favour of a gross-error-only gate, restoring 4 objects; (4) a validator-reachability critique addressed by the same restructuring.

## Remaining gaps (honest)

Surface brightness, morphological detail, star-formation rate and black-hole mass are not in the SIMBAD `basic` / NED ObjectLookup fields ingested here; redshift-independent distances for the ~16 % of objects without a `mesDistance` entry require a dedicated NED-D / literature pass — flagged, not fabricated.

## Commands

- `npm run precision:deep-sky` — refresh SIMBAD + NED snapshots
- `npm run precision:report` — coverage report (stars + deep-sky)
- `npm run validate` — includes the deep-sky-precision gate
