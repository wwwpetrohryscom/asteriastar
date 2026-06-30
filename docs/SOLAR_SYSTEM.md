# Solar System Encyclopedia

A reference-quality encyclopedia of the Solar System: the Sun, planets, dwarf
planets, moons, asteroids, comets, missions, spacecraft, and surface features —
each a first-class knowledge-graph entity, served through the Scientific Data
Engine. Built **entirely on real data**; nothing is fabricated.

Browsable at [`/solar-system`](../src/app/solar-system/page.tsx).

## Data sources & attribution

- **Planets & moons** — the **NASA Planetary Fact Sheet** and JPL satellite
  data (US-government, public domain): mass, diameter, density, gravity, escape
  velocity, rotation, orbit, temperature, and more. Ingested by
  [`scripts/ingest-solar-system.ts`](../scripts/ingest-solar-system.ts).
- **Smaller bodies, missions, spacecraft, surface features** — curated from
  established NASA / JPL / IAU facts (classification, discovery, agency, launch,
  type, targets). See [`curated.ts`](../src/knowledge-graph/data/solar-system-catalog/curated.ts).

Moon masses are computed from the published GM (mass = GM·10⁹ / G) — a physical
relation, not an estimate. Every field is optional and omitted when no
authoritative value exists.

## Coverage (Program B)

**89 bodies / 27 new entities**: the Sun, all 8 planets, 5 dwarf planets, 24
major moons, 10 asteroids, 10 comets, 19 missions, 6 spacecraft, and 6 surface
features. Existing graph entities (planets, moons, dwarf planets, asteroids,
comets, missions) are **enriched** with typed scientific data rather than
duplicated; missions/spacecraft/features and a few small bodies are **created**.
Architecture supports scaling to all known moons and MPC small-body datasets.

## Architecture

```
NASA Fact Sheet + JPL CSV  →  ingest-solar-system.ts  →  generated BodyRecords
established facts            →  curated.ts             →  curated BodyRecords
              ↓ merge by id
  src/knowledge-graph/data/solar-system-catalog/  →  graph entities + relations
              ↓
  src/platform/data-engine/solar-engine.ts  →  resolve / planets / moons / missions / by-kind
              ↓
  /solar-system, /solar-system/[slug], /solar-system/discover/[slug]
```

New schema: the `surface_feature` entity type (used for the 6 features), plus a
`ring_system` type reserved for future ring entities. Five relation types are
instantiated — `orbits`, `target_of_mission`, `part_of_mission`, `landed_on`,
and `located_on` — with `belongs_to_planet` and `visited_by` also added to the
schema and reserved for future expansion (moons currently use the existing
`child_of`).

## Relations

Missions link to their targets (`target_of_mission`); spacecraft to their mission
(`part_of_mission`) and the worlds they reached (`landed_on` / `located_on`);
surface features to their parent body (`located_on`); small bodies to the Sun
(`orbits`). Moons already carry `child_of` their planet from the existing graph.

## Validation

`validateSolarSystem()` (run inside `npm run validate`) checks unique ids/slugs,
id format, and source presence; `validateGraph` confirms no duplicate ids and no
isolated nodes. See [SCIENTIFIC_DATA_ENGINE.md](./SCIENTIFIC_DATA_ENGINE.md) and
[STAR_ENCYCLOPEDIA.md](./STAR_ENCYCLOPEDIA.md).
