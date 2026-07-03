# Rockets & Launch Vehicles Encyclopedia (Program V)

A comprehensive, source-backed encyclopedia of rockets and launch vehicles — the
families, vehicles, booster and upper **stages**, **engines**, **propellants**,
launch **providers**, launch **programs**, and launch **pads** that reach orbit —
connected to the missions, spacecraft, and crews they carry.

See also: [SPACE_EXPLORATION](./SPACE_EXPLORATION.md) (parent domain),
[HUMAN_SPACEFLIGHT](./HUMAN_SPACEFLIGHT.md), [SCIENTIFIC_DATA_ENGINE](./SCIENTIFIC_DATA_ENGINE.md).

## Data & sourcing — no fabrication
Every technical field is curated from authoritative public sources (agency user's
manuals and documentation from NASA, ESA, JAXA, ISRO, and Roscosmos; manufacturer
specifications from SpaceX, ULA, Arianespace, Rocket Lab, and Blue Origin; and the
Gunter's Space Page reference compilation). **Every specification field is
optional and omitted when not reliably known** — payloads, thrusts, specific
impulses, dimensions, masses, and dates are never invented, and volatile figures
like launch counts are deliberately not asserted. Performance figures are included
only where iconic and unambiguous (e.g. the F-1's ~6,770 kN sea-level thrust, the
Saturn V's 140 t to LEO); everything uncertain stays blank.

## Scale
| Kind | Graph type | New / reused | Count |
| --- | --- | --- | --- |
| Launch vehicle | `launch_vehicle` (existing) | 20 reused + 35 new | 55 |
| Rocket family | `rocket_family` (new) | new | 10 |
| Rocket stage | `rocket_stage` (new) | new | 10 |
| Rocket engine | `rocket_engine` (new) | new | 25 |
| Propellant | `propellant` (new) | new | 7 |
| Launch pad | `launch_pad` (new) | new | 23 |
| Launch provider | `organization` (existing) | 11 reused + 6 new | 17 |
| Launch program | `mission_program` (existing) | reused | 5 |

**116 new graph entities and 255 new relations.** Existing `launch_vehicle:*`,
`organization:*`, `launch_site:*`, and `mission_program:*` entities are ENRICHED
(`existing: true`), never recreated — the graph's duplicate-id gate enforces this.

## Pipeline
```
curated data (src/knowledge-graph/data/rockets-catalog/data/*)
  → rockets-catalog/index.ts   (entities + relations + validateRockets + ROCKETS_STATS)
  → knowledge-graph/{entities,relations}.ts   (appended last)
  → launch-vehicle-engine.ts   (engine.launchVehicles — pure, framework-free)
  → app/rockets/**             (hub, /rockets/[slug], /rockets/discover/[slug])
```

## Enrichment vs creation
A record with `existing: true` is filtered out of new-entity creation (its
canonical `entryPath` is untouched) but still resolves for cross-references and
still gets a `/rockets/{slug}` page. New entities are created with
`entryPath: /rockets/{slug}`, `domain: "science"`, `confidence: "confirmed"`.

## Relations
New relation types: `member_of_family`, `has_stage`, `powered_by`,
`uses_propellant`. Reused where they already fit: `operated_by` (→ provider),
`built_by` (→ manufacturer), `launched_from` (→ pad), `part_of_program`,
`part_of` (pad → site), `derived_from`, `replaced_by`. Cross-catalog edges already
emitted by the exploration/human-spaceflight catalogs (e.g. `falcon-9 operated_by
spacex`) are deduped against via `legacy-relations.ts`.

## Discovery hubs (19)
All / active / retired / future launch vehicles; rocket families / stages /
engines; propellants; launch providers / programs / pads; reusable / expendable;
super-heavy / heavy / small lift; human-rated; cryogenic and staged-combustion
engines — every hub a pure engine query (`app/rockets/discovery.ts`). Filters are
honest: a vehicle with an unknown payload is simply not classified into a
lift-class hub rather than being assigned an invented figure.

## Pages
`/rockets` (hub), `/rockets/{slug}` (adaptive by kind), and
`/rockets/discover/{slug}`. Each entity page emits BreadcrumbList + a schema.org
`Product`/`Organization`/`Place` JSON-LD, an adaptive quick-facts panel, component
ref grids (family/stages/engines/propellants/pads/powers), a Knowledge-connections
list over the graph, an `EntityProvenancePanel`, a Quality & authority panel, and
a Sources list. `dynamicParams = false`; every slug is enumerated at build.

## Validation
`validateRockets()` runs in `npm run validate` and the `engine.validation` surface.
It checks: duplicate id, duplicate slug, id regex, kind validity, id-prefix ↔ kind
match (for non-existing records), non-empty sources and description, finite/
non-negative numeric specs (no fabricated numbers), and **no isolated new entity**
(every created entity carries ≥1 relation). The master graph's `validateGraph`
additionally enforces unique ids, resolvable relation endpoints (no dangling), the
science-domain boundary, and no duplicate relations.

## Learning
The `understanding-launch-vehicles` learning path — twelve steps across
fundamentals, stages, engines, propellants, human-rating, reusability, heavy and
deep-space lift, and future transportation, every step a real `/rockets` route.

## Honest gaps
- Depth over breadth on specs: many vehicles carry status/country/first-flight and
  family/provider/pad links, but numeric performance is populated only where
  well-documented — the rest is intentionally blank.
- Stages are modeled as first-class entities for flagship vehicles; other vehicles
  link engines directly.
- Launch counts and success rates are deliberately not asserted (too volatile).
