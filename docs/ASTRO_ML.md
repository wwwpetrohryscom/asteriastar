# Data Science, AI & Machine Learning in Astronomy Encyclopedia (Program AX)

The computational layer of modern astronomy — how data science, artificial intelligence, and
machine learning turn the flood of survey data into discovery.

This layer **reuses** the Rubin Observatory and its alert stream, the Transient Name Server, the
photometry, gravitational-lensing and spectral-classification methods, the spiral and elliptical
galaxy morphologies, the transit exoplanet method, the Type Ia supernova class, the
cosmological-redshift concept, and the reproducibility, data-pipeline and cross-matching
open-science practices already in the graph. The
new entities are the machine-learning methods, the astronomical applications, and the
data-engineering workflows; the community alert brokers are created with the existing alert-system
type.

## Data model

`MlRecord` is a discriminated record over `MlKind`:

| kind | entity type | meaning |
| --- | --- | --- |
| `method` | `ml_method` | a machine-learning method / technique |
| `application` | `ml_application` | an astronomical application of ML |
| `workflow` | `ml_workflow` | a data-engineering workflow step |
| `broker` | `alert_system` | a community alert broker — a **new entity of the existing type** (which already holds GCN, VOEvent, TNS, ATel, and the Rubin alert stream) |

Cross-references: `relatedKeys` (→ `associated_with` the reused Rubin/alert/method/morphology/
transient/redshift/practice entities and the sibling AX entities). A method carries a
`paradigmLabel` (Supervised / Unsupervised / Self-supervised).

### Reusing the alert-system type for the brokers

ALeRCE, ANTARES, Fink, and Lasair are created as `alert_system:` entities — the **same type** as
the Rubin alert stream and VOEvent they process — rather than a parallel broker type. Only the ML
methods, applications, and workflows are genuinely new types.

## Contents

- **7 ML methods** — classification, regression, clustering, representation learning,
  self-supervised learning, foundation models, anomaly detection.
- **7 applications** — galaxy morphology classification, supernova classification, photometric
  redshifts, transit detection, strong-lens finding, source extraction, real-time alert
  classification.
- **4 data-engineering workflows** — training datasets, benchmark datasets, feature extraction,
  model evaluation.
- **4 community alert brokers** — ALeRCE, ANTARES, Fink, Lasair.

## Reuse & the graph

Each entity links to the real methods, data, and targets it acts on: galaxy morphology
classification to the spiral and elliptical morphologies; photometric redshifts to the redshift
concept and photometry; supernova classification to the Type Ia class and the Transient Name Server;
strong-lens finding to gravitational lensing; transit detection to the transit method; real-time
alert classification and the brokers to the Rubin Observatory and its alert stream. Every emitted
relation is deduped against `LEGACY_RELATION_IDS`, and any relation whose endpoint does not resolve
is dropped.

## Honesty

Methods and applications are described in general terms, without invented performance numbers.
Benchmark datasets (Galaxy Zoo, PLAsTiCC) and brokers (ALeRCE, ANTARES, Fink, Lasair) are named only
where real.

## Engine (`engine.astroMl`)

`ResolvedAstroMl` resolves an entry to the reused entities it uses (`related`) and the other AX
entities that reference it (`usedBy`). Query surface: `methods()`, `applications()`, `workflows()`,
`brokers()` (each sorted by name), and `resolveEntry(slug)`.

## Pages

- `/astro-ml` — the hub: the applications, discovery hubs, and provenance.
- `/astro-ml/{slug}` — an adaptive entry for an ML method, application, workflow, or alert broker.
- `/astro-ml/discover/{slug}` — ML methods, applications, alert brokers, and data engineering.

## Provenance

Curated from NASA, NOIRLab, and the Rubin/LSST community. Nothing is fabricated; unknown values are
left empty.
