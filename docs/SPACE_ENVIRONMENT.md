# Space Environment & Hazards Encyclopedia (Program AE)

The scientific layer describing the hazards of space — space weather, radiation, and the
physical hazards that threaten spacecraft and astronauts. Reuses the Sun, planets, moons,
and solar missions; adds the hazard-layer entities and the space-weather monitors.

See also: [DEEP_SPACE_COMMUNICATIONS](./DEEP_SPACE_COMMUNICATIONS.md), [SCIENTIFIC_DATA_ENGINE.md](./SCIENTIFIC_DATA_ENGINE.md).

## Reuse & honesty
The Sun (`star:sun`), planets and moons, the solar missions (Parker Solar Probe, Solar
Orbiter), and NASA/NOAA are REUSED. SOHO, SDO, ACE, and DSCOVR are created as `space_mission`
entities (the type is reused); NOAA's Space Weather Prediction Center is created as an
`organization`. This encyclopedia states **no live conditions or forecasts** — NOAA SWPC is
the operational source; every quantitative value is optional and omitted when not known.

## Data model
Four new entity types + one new relation (`affects`):

| Kind | Graph type | Count |
| --- | --- | --- |
| Space-weather phenomenon | `space_weather_phenomenon` | 8 |
| Radiation environment | `radiation_environment` | 4 |
| Space hazard | `space_hazard` | 5 |
| Geomagnetic index / scale | `geomagnetic_index` | 5 |
| Monitor (reused type) | `space_mission` / `organization` | 5 |

**27 new entities, 60 relations.** Relations: `affects` (hazard → a body or spacecraft, NEW),
`observed_by` (phenomenon → a monitoring mission/organization), `part_of` (belt/boundary
structure), and `associated_with` (origin at the Sun, cross-links, index ↔ phenomenon).

## Pages
`/space-environment` (hub), `/space-environment/{slug}` (adaptive — phenomena, radiation,
hazards, indices share one route), and `/space-environment/discover/{slug}` (space weather,
radiation, hazards, indices). Monitoring missions resolve to their graph pages.

## Validation
`validateSpaceEnvironment()` checks duplicate ids, per-kind slug uniqueness, id ↔ kind match,
sources, description, reference-type integrity (an `affects` target must be a body or
spacecraft; a monitor must be a mission/organization), cross-kind slug uniqueness across the
four route-sharing kinds, and no isolated new entity — plus a graph-endpoint check.

## Open Data, Learning
Four datasets (`space-weather-phenomena`, `radiation-environments`, `space-hazards`,
`geomagnetic-indices`) and the `understanding-space-environment` 12-lesson learning path.

## Scope decisions
The magnetosphere, heliosphere, and heliopause are modelled as `space_weather_phenomenon`
entities; human hazards are described in prose (no "human" entity); live space-weather data
is deliberately not modelled — the platform links to NOAA SWPC instead.
