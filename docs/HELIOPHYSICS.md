# Heliophysics & Space Weather Operations Encyclopedia (Program AW)

The operational layer of heliophysics — how the Sun drives space weather, and how that weather
reaches technology and people.

This layer **reuses** the space-weather phenomena already in the graph (solar flares, coronal mass
ejections, the solar wind, the heliosphere, geomagnetic storms, the magnetosphere, and the aurora),
the NOAA G/S/R scales, the solar-energetic-particle and Van Allen radiation environments, the Parker
Solar Probe, Solar Orbiter, DSCOVR and ACE missions, the SWPC, NOAA and ESA organisations, and the
Sun. The new entities are the solar-source phenomena still missing from the graph, the operational
impacts, and ESA's space-weather service.

## Data model

`HelioRecord` is a discriminated record over `HelioKind`:

| kind | entity type | meaning |
| --- | --- | --- |
| `phenomenon` | `space_weather_phenomenon` | a solar-source or space-weather phenomenon — a **new entity of the existing type** (which already holds solar flares, CMEs, the magnetosphere and the aurora) |
| `impact` | `space_weather_impact` | an operational impact of space weather |
| `service` | `organization` | a forecasting service — a **new entity of the existing type**, matching the reused NOAA SWPC (`organization:swpc`, not recreated) |

Cross-references: `relatedKeys` (→ `associated_with` the reused phenomena, radiation environments,
NOAA scales, missions, and organisations, and the sibling AW entities). Each record carries a
`sectorLabel` (Solar source / Space infrastructure / Ground infrastructure / …).

### Reusing existing types for the phenomena and the service

The solar cycle, sunspots, active regions, coronal holes, and the ionosphere are created as
`space_weather_phenomenon:` entities — the **same type** as the solar flares and CMEs they drive —
and ESA's Space Weather Service Network as an `organization:` entity — the **same type** as its
reused counterpart NOAA SWPC (`organization:swpc`) — rather than duplicating those concepts as new
types. Only the operational-impact layer is genuinely new.

## Contents

- **5 solar-source phenomena** — the solar cycle, sunspots, active regions, coronal holes, and the
  ionosphere.
- **6 operational impacts** — satellites, GPS & navigation, aviation, human spaceflight, power
  grids, and radio communications.
- **ESA's Space Weather Service Network** — Europe's operational space-weather service.

## Reuse & the graph

Each entity links to the real drivers and assets it depends on: the solar cycle to the Sun,
sunspots, flares and CMEs; active regions to Solar Orbiter; coronal holes to the solar wind and the
Parker Solar Probe; the impacts to the SEP and Van Allen radiation environments, the geomagnetic
storm and the NOAA G/S/R scales, DSCOVR, and the SWPC. Every emitted relation is deduped against
`LEGACY_RELATION_IDS`, and any relation whose endpoint does not resolve is dropped.

## Engine (`engine.heliophysics`)

`ResolvedHeliophysics` resolves an entry to the reused entities it uses (`related`) and the other AW
entities that reference it (`usedBy`). Query surface: `phenomena()`, `impacts()`, `services()`
(each sorted by name), and `resolveEntry(slug)`.

## Pages

- `/heliophysics` — the hub: the operational impacts, discovery hubs, and provenance.
- `/heliophysics/{slug}` — an adaptive entry for a solar phenomenon, operational impact, or
  forecasting service.
- `/heliophysics/discover/{slug}` — solar sources, operational impacts, and forecasting.

## Provenance

Curated from NOAA SWPC, NASA, and ESA. Operational impacts are described from documented effects;
nothing is fabricated; unknown values are left empty.
