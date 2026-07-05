# Planetary Defense & NEO Operations Encyclopedia (Program AS)

The operational planetary-defense layer — the end-to-end system that finds, tracks, assesses,
and could deflect a hazardous near-Earth object.

This layer **reuses** the survey telescopes (Catalina, Pan-STARRS, ATLAS, LSST), the Rubin
Observatory, the Minor Planet Center and CNEOS, the DART and Hera missions and the NEO Surveyor
concept, the near-Earth-object classes (Apollo, Aten, Amor, Atira), and the asteroids Apophis and
Bennu already in the graph. The new entities are the NEO-operations pipeline stages, the impact-risk
scales, and the deflection methods.

## Data model

`DefenseRecord` is a discriminated record over `DefenseKind`:

| kind | entity type | meaning |
| --- | --- | --- |
| `stage` | `defense_stage` | a stage of the NEO discovery-to-deflection pipeline |
| `scale` | `risk_scale` | an impact-risk communication scale |
| `method` | `deflection_method` | a deflection method or concept |

Cross-references: `relatedKeys` (→ `associated_with` the reused surveys, organisations, missions,
and objects) and `nextStageSlug` (→ `followed_by`, chaining the pipeline). A deflection method
carries an honest `maturity`.

## Honesty: deflection-method maturity

The deflection methods are labelled with a maturity, and speculation is never presented as fact:
the **kinetic impactor** is `demonstrated` (DART measurably moved Dimorphos in 2022), the **gravity
tractor** and **ion-beam** are `concept`, and **nuclear deflection** is `theoretical` — studied only
as a last resort, and stated plainly to have never been tested.

## Reuse & the pipeline

The eight pipeline stages chain `followed_by` from discovery to deflection, each linking to the real
facilities it uses: discovery reuses the survey telescopes and Rubin; orbit determination the Minor
Planet Center; impact monitoring CNEOS and Apophis; deflection the DART mission and the deflection
methods. Every emitted relation is deduped against `LEGACY_RELATION_IDS`, and any relation whose
endpoint does not resolve is dropped.

## Engine (`engine.planetaryDefense`)

`ResolvedDefense` resolves an entry to the reused entities it uses and (for a stage) its previous and
next stages. Query surface: `stages()` (in pipeline order), `scales()`, `methods()`, and
`resolveEntry(slug)`.

## Pages

- `/planetary-defense` — the hub: the NEO pipeline, discovery hubs, and provenance.
- `/planetary-defense/{slug}` — an adaptive entry for a pipeline stage, risk scale, or deflection
  method (with previous/next stage navigation).
- `/planetary-defense/discover/{slug}` — the NEO pipeline, impact-risk scales, and deflection methods.

## Provenance

Curated from NASA, ESA, and the Minor Planet Center. Nothing is fabricated; nuclear concepts are
marked theoretical.
