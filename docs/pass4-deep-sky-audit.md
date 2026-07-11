# Pass 4 — Deep Sky, Galaxies, Nebulae & Clusters: Enrichment Audit

_Honest by construction: no fabricated values; unknowns stay empty; derived values are computed only from source-backed inputs with a documented, standard method and are labelled `· derived`._

## Scope audited

`engine.deepSky` / `DEEP_SKY_RECORDS` — **619 deep-sky objects** generated from the open **OpenNGC** database (NGC/IC + Messier + Caldwell, CC BY-SA 4.0): 135 galaxies (+1 galaxy group), 282 open clusters, 87 globular clusters, 33 planetary nebulae, plus emission / reflection / dark nebulae, H II regions, supernova remnants and clusters-with-nebulosity. Every record carries a `sources` reference.

## Characteristic coverage (already populated & rendered)

The catalogue is already rich and the deep-sky page renders it through the approved components (Quick facts, catalog table, observation panel):

| Field | Populated | Field | Populated |
| --- | ---: | --- | ---: |
| angular size — major (′) | 619 | RA / Dec | 619 / 619 |
| angular size — minor (′) | 212 | Hubble morphology (galaxies) | 135 |
| apparent magnitude | 601 | classified type / galaxy morphology | 619 / 135 |
| observation difficulty | 601 | catalogue ids (M/NGC/IC/Caldwell/UGC/PGC) | (as available) |

The classified galaxy morphology (e.g. "Barred spiral galaxy") is already surfaced as the object's **Type** via `deepSkyClassLabel`; the raw Hubble string is shown as **Morphology**.

## Enrichment applied (this pass)

**Derived projected axis ratio (b/a) — 212 objects.** Where a record carries both source-backed angular diameters, the sky-projected elongation is computed and **labelled `· derived`**:

- `b/a = minor axis ÷ major axis` (both from the OpenNGC isophotal diameters).

This is a standard catalogue quantity (elongation on the sky; for disk galaxies it relates to inclination). Computed at render time — the catalogue stays measurement-only.

### Physical (true) size — deliberately **not** derived

The roadmap notes physical size is derivable from *angular size + distance*. Audit finding: **the deep-sky catalogue carries no distance or redshift for any object** (confirmed across `deep-sky-catalog`, `deep-sky-encyclopedia-catalog`, `deep-sky-extra`, `galaxies-catalog`). Deriving a physical size would require inventing distances, so **none is produced** — an honest empty state. Physical size is flagged for a follow-up that first ingests distances from an authoritative source (NED / SIMBAD / HyperLeda); it is not fabricated here.

## New permanent validator (fails on dishonesty, not absence)

`npm run validate` → **Deep Sky** already rejected duplicate ids / slugs and **designation collisions** (one catalogue number → one object). Pass 4 adds observation & classification integrity:

- **angular size** major/minor > 0, and **minor axis ≤ major axis** (an ellipse's minor cannot exceed its major);
- **coordinates**: RA ∈ [0, 24) h, Dec ∈ [−90, 90]°;
- **apparent magnitude** ∈ [−30, 25] (generous — brightest DSO ≈ −4, faintest catalogued ≈ 20);
- **classification contradiction**: the object's type family must match its graph entity type (galaxy types → `galaxy`, nebula types → `nebula`, cluster types → `star_cluster`), and galaxy-only morphology (`galaxyType` / `hubbleType`) may not appear on a non-galaxy.

Result: **0 violations across 619 objects.**

## Adversarial review — findings independently verified

- **Angular-size sanity**: 0 non-positive diameters; 0 cases of a minor axis exceeding the major — the isophotal ellipses are internally consistent.
- **Coordinate sanity**: 0 out-of-range RA/Dec.
- **Classification consistency**: 0 contradictions — every galaxy-morphology field sits on a galaxy, and every type family resolves to the correct entity type. (The single galaxy without a Hubble string is a legitimate absence, not an error.)
- **Redshift / radial-velocity confusion** — not applicable: the catalogue stores neither, so there is no velocity field to mislabel as a distance (and none was invented).
- **Never invented deep-sky imagery** — imagery continues to use only real survey/observatory sources (unchanged this pass).

## Remaining gaps (honest, not fabricated)

Distance, redshift, physical diameter, luminosity, and stellar-population age for these objects require an authoritative distance/redshift ingestion (NED / SIMBAD / HyperLeda) and are flagged for a follow-up — not invented here. Where a value is genuinely unknown, the page shows an honest empty state.
