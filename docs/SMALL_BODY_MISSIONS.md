# Small-Body Missions & Sample Return Encyclopedia (Program AC)

The engineering bridge across the small-body arc — it connects **Space Exploration (D)**,
**Launch Vehicles (V)**, **Asteroids (Y)**, **Comets (Z)**, **Meteorites (AA)**, and
**Interstellar objects (AB)** through the missions that flew, orbited, landed, impacted,
and returned samples from asteroids and comets.

This is a **mission encyclopedia**, not another asteroid catalogue. Its emphasis is
mission history, engineering, science return, and graph connectivity.

See also: [ASTEROIDS](./ASTEROIDS.md), [COMETS](./COMETS.md), [ROCKETS](./ROCKETS.md),
[SCIENTIFIC_DATA_ENGINE.md](./SCIENTIFIC_DATA_ENGINE.md).

## Reuse first — never duplicate
Most of these missions **already exist** in the graph as `space_mission` entities
(Hayabusa, OSIRIS-REx, Rosetta, DART, Lucy, Dawn, NEAR…). This program **enriches** them
(`existing: true`) — adding mission-class membership, sample links, and target relations —
rather than duplicating them. Their targets (asteroids/comets), rockets (Program V), and
agencies are likewise reused. Only genuinely-new concept/planned missions (MMX, Comet
Interceptor, DESTINY+, CAESAR, Don Quijote, Janus, AIM) are created, plus the new
mission-layer entities.

## Catalog policy
- **Missions** are `space_mission` entities. Existing ones keep their canonical home
  (`/exploration/…` or `/solar-system/…`); their `/small-body-missions/{slug}` page is a
  themed view whose canonical points back to the main page, and it is **excluded from the
  sitemap** to avoid duplicate content (the same pattern as Program V's rockets). New
  missions are canonical at `/small-body-missions/{slug}`.
- **Every field is optional** and omitted when not reliably known: launch dates, launch
  vehicles, targets, sample masses, discoveries, and outcomes are never invented. A launch
  vehicle not yet in the graph (M-V, Epsilon S) is stated as a label, not a fabricated
  entity; a target not yet modelled (the Lucy Trojans, Phaethon) is described in prose.

## Sample-return model
Returned material is a first-class `returned_sample` entity linked to its source body
(`associated_with`) and collected by its mission (`collected_sample`); the reentry
hardware is a `sample_return_capsule` (`part_of_mission`). Masses are stated only where
verified — Itokawa's sub-milligram grains, Ryugu's 5.4 g, Bennu's 121.6 g; Stardust's
cometary dust is a particle count in aerogel, not a meaningful mass.

## Honest tense — never fabricate outcomes
An operational relation (`visited`, `orbited`, `landed_on`, `impacted`,
`returned_samples_from`) is asserted **only** for an encounter that has actually happened.
A planned, concept, or cancelled mission uses `target_of_mission` (future-safe) and never
claims a past-tense encounter or a returned sample — the validator enforces this, so
Hera/Psyche/Lucy/MMX are shown as *targeting* their bodies, not as having reached them.

## Mission lifecycle
Five generic `mission_phase` entities model the lifecycle in sequence (`followed_by`):
Launch & Cruise → Approach & Characterization → Proximity Operations → Surface Operations
& Sampling → Return & Reentry. They are reference concepts with exemplar missions, not
per-mission dated timelines (no fabricated dates).

## Scale
| Kind | Graph type | Count |
| --- | --- | --- |
| Mission | `space_mission` (reused) | 22 (15 reused + 7 new) |
| Mission class | `mission_class` (new) | 6 |
| Returned sample | `returned_sample` (new) | 4 |
| Sample-return capsule | `sample_return_capsule` (new) | 4 |
| Mission phase | `mission_phase` (new) | 5 |
| Science campaign | `science_campaign` (new) | 1 |

**27 new graph entities and 109 new relations.** Two new relation types (`impacted`,
`collected_sample`); everything else reuses `visited` / `orbited` / `landed_on` /
`returned_samples_from` / `member_of_group` / `launched_by` / `operated_by` /
`part_of_mission` / `followed_by` / `associated_with` / `target_of_mission`.

## Graph relationships
Cross-references resolve against the map for the target kind; edges that duplicate an
existing graph edge (e.g. Hayabusa ↔ Itokawa sample return, already emitted by the
exploration catalog) are dropped via `legacy-relations.ts`. Missions link to their classes
(`member_of_group`), targets (operational or `target_of_mission`), rockets (`launched_by`),
agencies (`operated_by`), and returned samples (`collected_sample`); AIDA links DART and
Hera (`associated_with`).

## Pages
`/small-body-missions` (hub), `/small-body-missions/{slug}` (each mission — adaptive,
status-badged, reused missions link back to their main page), `/small-body-missions/type/{slug}`
(the six mission classes), `/small-body-missions/sample/{slug}` (returned samples), and
`/small-body-missions/discover/{slug}` (discovery hubs: sample-return, comet, asteroid,
planetary-defense, future, historic, active, timeline, NASA, ESA, Japanese/JAXA). Capsules,
phases, and the campaign are standalone graph entities under `/explore`.

## Validation
`validateSmallBodyMissions()` runs in `npm run validate` and `engine.validation`. Beyond
the usual checks (duplicate ids, per-kind slug uniqueness, id ↔ kind/slug match, sources,
description, well-formed launch dates, cross-reference resolution, no isolated new entity),
it enforces the honesty rules: a planned/concept/cancelled mission must not assert a
past-tense encounter or a returned sample, a returned sample must come from a completed/
extended mission, and launch-vehicle/agency references must point at the expected graph
type. The entry gate additionally asserts every emitted relation endpoint resolves.

## Open Data
Five new datasets over the new entity types — `mission-classes`, `returned-samples`,
`sample-return-capsules`, `mission-phases`, and `science-campaigns` — each exported as
JSON / CSV / JSON-LD at `/api/v0/datasets/{slug}`. The missions themselves are reused
`space_mission` entities and remain part of the existing **space-missions** dataset.

## Learning
The `understanding-small-body-missions` learning path — 12 lessons across why we explore
small bodies, the mission classes (flyby / rendezvous / orbiter / lander / impactor /
sample return), the Hayabusa line, OSIRIS-REx, comet missions, planetary defense, what the
returned samples reveal, and future missions.

## Honest gaps (documented scope decisions)
- **Mission "types"** (sample-return / flyby / rendezvous / orbiter / lander / impactor)
  are modelled as one `mission_class` type with six members, because a single mission is
  usually several at once — a `member_of_group` link, not a forced single bucket.
- **Planetary defense** is a mission `category` and a discovery hub, not a fake entity type
  (there is no `planetary_defense` entity in the graph).
- **Instruments** are described in prose; the graph's instrument entities are Mars-focused
  and are not force-linked.
- **A "small-body-missions" dataset** is not created, because the missions are reused
  `space_mission` entities and a type-filtered dataset would leak every space mission; the
  new datasets cover only the genuinely-new entity types.

## Future expansion
- New missions as they launch and return (OSIRIS-APEX at Apophis, MMX's Phobos sample) —
  enriching the reused `space_mission` entities or adding new ones.
- Deeper instrument modelling once a small-body instrument layer exists.
- Linking returned samples to the meteorite classes (Program AA) they help calibrate.
