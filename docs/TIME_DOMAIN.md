# Multi-Wavelength & Time-Domain Astronomy Atlas (Program AP)

How the dynamic universe is observed — across every wavelength of light and through
gravitational waves, neutrinos, and cosmic rays — and the transients, alert networks, and
workflows that turn a flicker in the sky into science within hours.

This layer **reuses** the existing wavelength/messenger bands (the multi-wavelength axis, at
`/observatories/{band}`), the multi-messenger methods (from AO), the surveys (LSST,
Pan-STARRS, ATLAS, Catalina), the observatories (Rubin), the Minor Planet Center, and the
magnetar object class. The new entities are the transient classes, the alert-infrastructure
systems, and the observation-workflow stages.

## Data model

`TimeDomainRecord` is a discriminated record over `TimeDomainKind`:

| kind | entity type | meaning |
| --- | --- | --- |
| `transient` | `transient_class` | a class of transient / time-domain phenomenon |
| `alert` | `alert_system` | an alert-infrastructure system or broker |
| `stage` | `observation_stage` | a stage of the transient observation workflow |

Cross-references: `relatedKeys` (→ `associated_with` the reused bands, methods, surveys, and
objects each involves) and `nextStageSlug` (→ `followed_by`, chaining the workflow from
discovery to publication). A transient carries a `category` and a `messenger` label.

## The multi-wavelength axis is reused, not rebuilt

The bands radio → gamma-ray plus gravitational waves, neutrinos, and multi-messenger already
exist as `wavelength_band` entities. Program AP does **not** create parallel "radio astronomy"
/ "X-ray astronomy" entities; instead every transient links to the bands it appears in, and
the hub surfaces the existing bands directly (`engine.timeDomain.spectrumBands()`). This keeps
the multi-wavelength axis single-sourced.

## Reuse & connections

Kilonovae and compact-binary mergers link to `astronomy_method:multi-messenger-astronomy` and
`gravitational-wave-detection`; magnetar flares and fast radio bursts link to
`astrophysical_object_class:magnetar`; Type Ia supernovae link to
`astronomy_method:standard-candles`; the Rubin alert stream links to
`observatory:vera-rubin-observatory` and `sky_survey:lsst`. Every emitted relation is deduped
against `LEGACY_RELATION_IDS`, and any relation whose endpoint does not resolve is dropped.

## Engine (`engine.timeDomain`)

`ResolvedTimeDomain` resolves an entry to the reused entities it involves and (for a stage) its
previous and next stages. Query surface: `transients()`, `alerts()`, `stages()` (in workflow
order), `byCategory(cat)`, `spectrumBands()`, and `resolveEntry(slug)`.

## Pages

- `/time-domain` — the hub: the reused spectrum bands, discovery hubs, and transient classes.
- `/time-domain/{slug}` — an adaptive entry for a transient class, alert system, or workflow
  stage (with previous/next stage navigation).
- `/time-domain/discover/{slug}` — explosive transients, relativistic events & mergers, tidal/
  radio/variable, alert infrastructure, and the observation workflow.

## Provenance

Curated from NASA and ESA. Nothing is fabricated; the multi-wavelength axis is the existing set
of bands.
