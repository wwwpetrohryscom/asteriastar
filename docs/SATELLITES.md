# Satellite Encyclopedia (Program X)

A comprehensive, source-backed, graph-driven encyclopedia of artificial
satellites — the individual **satellites**, satellite **constellations**, the
**orbit types** they occupy, the agency and commercial **operators** that run
them, and the ground **tracking networks** that communicate with them —
connected to the agencies, rockets, and launch sites already in the graph.

See also: [ROCKETS](./ROCKETS.md), [SPACE_EXPLORATION](./SPACE_EXPLORATION.md),
[CONSTELLATIONS](./CONSTELLATIONS.md) (a different sense of "constellation"),
[SCIENTIFIC_DATA_ENGINE](./SCIENTIFIC_DATA_ENGINE.md), [OPEN_DATA](./OPEN_DATA.md).

## Data & sourcing — no fabrication
Every technical field is curated from authoritative public sources (agency
mission pages and documentation from NASA, ESA, NOAA, EUMETSAT, JAXA, ISRO, and
Roscosmos, and the Gunter's Space Page reference compilation). **Every
specification field is optional and omitted when not reliably known** — launch
dates, operators, orbital parameters (altitude, inclination, period), status, and
masses are never invented. Orbital figures are given only where iconic and
unambiguous (e.g. the 35,786 km geostationary altitude); everything uncertain
stays blank. Constellation sizes are qualitative for fast-changing systems
(Starlink is "thousands", not an invented number).

## Reuse first — never duplicate
The astronomy satellites already modelled as **space telescopes** (Hubble, JWST,
Gaia, TESS, Kepler, Euclid, Planck, Herschel, WISE…) and the historic **Sputnik 1**
(a `space_mission`) are REUSED via links, never recreated. Space agencies are
reused as operators (`existing: true`); the rockets that launched a satellite
(`launched_by`) and its launch site (`launched_from`) are the platform's existing
`launch_vehicle:*` and `launch_site:*` entities. The graph's duplicate-id gate
enforces this.

## Scale
| Kind | Graph type | New / reused | Count |
| --- | --- | --- | --- |
| Satellite | `satellite` (existing type) | new | 30 |
| Satellite constellation | `satellite_constellation` (new) | new | 11 |
| Orbit type | `orbit_type` (new) | new | 7 |
| Operator | `organization` (existing) | 7 reused + 11 new | 18 |
| Tracking network | `tracking_network` (new) | new | 3 |

**62 new graph entities and 92 new relations.** Existing `organization:*`,
`launch_vehicle:*`, `launch_site:*`, and `space_mission:*` entities are ENRICHED
or reused, never recreated.

## Pipeline
```
curated data (src/knowledge-graph/data/satellites-catalog/data/*)
  → satellites-catalog/index.ts   (entities + relations + validateSatellites + SATELLITES_STATS)
  → knowledge-graph/{entities,relations}.ts   (appended last)
  → satellite-engine.ts           (engine.satellites — pure, framework-free)
  → app/satellites/**             (hub, /satellites/[slug], constellation/operator/orbit/network, discover)
```

## Relations
New relation type: `has_orbit` (satellite/constellation → `orbit_type`). Reused
where they already fit: `operated_by` (→ operator organization), `launched_by`
(→ reused launch vehicle), `launched_from` (→ reused launch site),
`belongs_to_constellation`, `contains_instrument`, `part_of_program`,
`replaced_by`, and `associated_with` (→ reused entities such as Sputnik 1). Tracking
networks are `operated_by` their agency. Cross-references resolve **against the map
for the target kind** — a satellite slug and a constellation slug may collide
("oneweb" is both an operator and a constellation), so resolution is type-aware.
Edges that duplicate an existing graph edge or whose endpoints don't resolve are
dropped, deduped via `legacy-relations.ts`.

## Discovery hubs (18)
All satellites; constellations; by application (communications, navigation,
Earth observation, weather, science, astronomy, commercial, technology); active
vs historic; satellite firsts; and by orbit (LEO, MEO, GEO, sun-synchronous,
polar) — every hub a pure engine query (`app/satellites/discovery.ts`). Filters are
honest: a satellite with an unknown value is simply excluded from a hub rather than
assigned an invented one.

## Pages
`/satellites` (hub), `/satellites/{slug}` (satellite), and the sub-entity routes
`/satellites/constellation/{slug}`, `/satellites/operator/{slug}` (a fleet view,
generated for every operator including reused agencies), `/satellites/orbit/{slug}`,
`/satellites/network/{slug}`, plus `/satellites/discover/{slug}`. Each entity page
emits BreadcrumbList + a schema.org `Product`/`Organization`/`DefinedTerm` JSON-LD,
an adaptive quick-facts panel, ref grids (operator/orbit/launch/instruments/related),
a Knowledge-connections list over the graph, an `EntityProvenancePanel`, a Quality &
authority panel, and a Sources list. `dynamicParams = false`; every slug is
enumerated at build.

## Live Sky — architecture, not fabrication
This encyclopedia performs **no real-time tracking** and states **no pass times or
live positions**. Where a satellite or constellation is observable, its page links
to the computed [Live Sky](../src/app/sky) tools (Tonight's dashboard, Planet
visibility, Moon) rather than inventing a position.

## Open Data
Four datasets via the existing framework — `satellites`, `satellite-constellations`,
`orbit-types`, and `tracking-networks` — each exported as JSON / CSV / JSON-LD and
served at `/api/v0/datasets/{slug}`. Operators are `organization` entities already
exported by the `space-agencies` dataset.

## Validation
`validateSatellites()` runs in `npm run validate` and the `engine.validation`
surface. It checks: duplicate id, per-kind duplicate slug, id regex, kind validity,
id ↔ kind/slug match, non-empty sources and description, finite/in-range numeric
specs (inclination 0–180°, plausible altitude — no fabricated numbers), type-aware
cross-reference resolution (operator → organization, orbit → orbit_type, etc.), and
**no isolated new entity** (every created entity carries ≥1 relation). The entry
gate additionally asserts every emitted relation endpoint resolves in the assembled
graph. The master graph's `validateGraph` enforces unique ids, resolvable relation
endpoints (no dangling), the science-domain boundary, and no duplicate relations.

## Learning
The `understanding-satellites` learning path — twelve steps across what a satellite
is, orbits, the first satellites, communications / navigation / Earth-observation /
weather satellites, constellations, scientific satellites, operators, and observing
— every step a real `/satellites` (or Live Sky) route.

## Honest gaps
- **Satellite programs** (Landsat, Copernicus, GOES-R) and **ground segments** are
  described via operators, constellations, and categories rather than modelled as
  separate entities — a stated scope limit, not fabricated data. `engine.satellites
  .resolveProgram()` resolves an existing `mission_program:*` entity when a
  satellite declares `part_of_program` to it.
- Individual members of large, fast-changing constellations (Starlink, Planet Dove)
  are not enumerated — their rosters change continually and no fixed list is invented.
- Depth over breadth on specs: most satellites carry category / operator / orbit /
  launch date / status and launch-vehicle/site links, but numeric performance is
  populated only where well-documented — the rest is intentionally blank.
