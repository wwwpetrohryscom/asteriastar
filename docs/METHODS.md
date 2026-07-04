# Astronomy Methods, Measurements & Scientific Techniques Encyclopedia (Program AO)

How astronomy actually works — the methods, measurements, and techniques behind the science,
and the honest treatment of uncertainty that makes a measurement science.

This layer **reuses** the exoplanet-detection methods, the cosmology concepts (redshift, the
Hubble–Lemaître law, the CMB, the baryon acoustic oscillations, dark matter, gravitational
waves), the observing bands (gravitational waves, neutrinos, multi-messenger), the Gaia
telescope, and the Harvard classification already in the graph. The new entities are the
*method categories* and the *techniques* not yet modelled.

## Data model

`MethodRecord` is a discriminated record over `MethodKind`:

| kind | entity type | meaning |
| --- | --- | --- |
| `category` | `method_category` | a family of techniques (the grouping) |
| `method` | `astronomy_method` | a measurement or observation technique |

Cross-references: `categorySlug` (→ `member_of_group` its category), `relatedKeys`
(→ `associated_with` the reused concepts, bands, telescopes, and catalogues it builds on), and
a short `measures` label ("what it measures / how it works").

## Reuse

The graph already models eight exoplanet-detection methods (transit, radial velocity, direct
imaging, microlensing, transit/eclipse timing variations, astrometry, pulsar timing). Program
AO **reuses** these via `REUSED_METHODS` (in `index.ts`) — enriching each into a method
category (`member_of_group`) rather than re-minting it; they keep their canonical
`/exoplanets` pages. Methods that measure cosmic distances or observe in other channels link
by `associated_with` to the reused `cosmology_concept:*`, `wavelength_band:*`,
`space_telescope:gaia`, `historical_discovery:cepheid-period-luminosity`, and
`catalog:harvard-classification`. Every emitted relation is deduped against
`LEGACY_RELATION_IDS`.

## Honesty about uncertainty

Uncertainty is treated as part of the method, not hidden. The `error-analysis-and-calibration`
technique makes the point explicit — *a measurement without an error bar is not a
measurement* — and the distance-ladder methods surface the Hubble tension as a live
disagreement between rungs rather than papering over it.

## Engine (`engine.astronomyMethods`)

`ResolvedMethod` resolves an entry to its category, the reused entities it builds on, and (for
a category) its member techniques plus the reused detection methods in it. Query surface:
`categories()`, `methodsList()`, `byCategory(slug)`, `memberSet(slug)`, and `resolveEntry(slug)`.

## Pages

- `/methods` — the hub: method categories, discovery hubs, and provenance.
- `/methods/{slug}` — an adaptive entry for a category or a technique (with what it measures).
- `/methods/discover/{slug}` — measuring distances, light & spectra, finding exoplanets, and
  beyond light; each surfaces the reused detection methods alongside the new techniques.

## Provenance

Curated from NASA and ESA. Nothing is fabricated; uncertainty is measured, not hidden.
