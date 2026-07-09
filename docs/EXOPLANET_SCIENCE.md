# Exoplanet Science & Characterization (Program CC)

How other worlds are found and studied — the methods and physics of exoplanet science, layered on the
large exoplanet base already in the graph. Built on the platform's honesty envelope: only
well-established science is stated, missions that have not yet launched are flagged as such, and nothing
is fabricated.

## Reuse-first

CC reuses the large exoplanet base already in the graph and adds only what was missing:

- The **849 planets**, the **eight detection methods** (`exoplanet_detection_method:*` — transit, radial
  velocity, direct imaging, microlensing, TTV, ETV, astrometry, pulsar timing), the **planetary classes**
  (`planetary_class:*` — terrestrial, super-Earth, mini-Neptune, gas giant, hot Jupiter, hycean, ocean,
  lava), the **habitable zone** (`habitable_zone_candidate:habitable-zone`), the **biosignatures**
  (`biosignature:*`), the **atmospheric processes** (`planetary_process:*` — atmospheric escape,
  greenhouse, circulation), the **protoplanetary disk** (`interstellar_environment:protoplanetary-disk`),
  the **spectroscopy / coronagraph / starshade** techniques, and **JWST, Kepler, TESS, Roman, HWO, ELT,
  GMT and TMT** — all referenced via `relatedKeys`, none duplicated. The full-graph name scan found no
  duplication of an existing concept.

## New entities (one new concept type + two missions)

- **Characterization methods** (7) — `exoplanet_science_concept`: transmission spectroscopy, emission
  spectroscopy, the secondary eclipse, phase curves, atmospheric retrieval, high-resolution
  cross-correlation spectroscopy, and the Rossiter–McLaughlin effect.
- **Atmosphere concepts** (4) — `exoplanet_science_concept`: clouds & hazes, thermal inversion,
  equilibrium temperature, and atmospheric metallicity & the C/O ratio.
- **Planet-formation concepts** (5) — `exoplanet_science_concept`: core accretion, disk instability,
  planetary migration, the snow line, and pebble accretion.
- **Missions** (2) — `space_telescope`: **Ariel** (ESA, the atmosphere survey) and **PLATO** (ESA, the
  habitable-zone transit hunt) — the two dedicated exoplanet missions that were absent from the graph,
  added as proper space telescopes.

Each new concept links to the reused detection methods, planetary classes, facilities, and processes it
depends on, producing `associated_with` edges that are deduped against every existing relation.

## Surfaces

- Hub `/exoplanet-science`, entry pages `/exoplanet-science/[slug]`, and four discovery hubs
  `/exoplanet-science/discover/{characterization-methods,exoplanet-atmospheres,planet-formation,exoplanet-missions}`.
- Resolved through the Scientific Data Engine (`engine.exoplanetScience`), reusing the shared quality,
  review, provenance, connections, breadcrumb, and JSON-LD (`DefinedTerm`) infrastructure. Accent: aurora.

## Honesty

Missions that have not launched are stated as such — Ariel (planned 2029) and PLATO (planned 2026) are
both flagged as approved-but-not-yet-flown. Techniques still maturing (high-resolution cross-correlation
on the extremely large telescopes) are described as forthcoming science cases. Nothing is fabricated.
