# Comets & Small-Body Reservoirs Encyclopedia (Program Z)

A comprehensive, source-backed, graph-driven encyclopedia of comets and their source
reservoirs — periodic and long-period comets, the great comets, sungrazers, the
Jupiter-family and Halley-type dynamical classes, genetic families such as the Kreutz
sungrazers, the Oort cloud, the comet missions, the parent bodies of the meteor
showers, and the transition objects that blur the asteroid–comet line.

The direct companion to [ASTEROIDS](./ASTEROIDS.md) (Program Y), which it reuses.
See also: [SOLAR_SYSTEM](./SOLAR_SYSTEM.md), [SCIENTIFIC_DATA_ENGINE.md](./SCIENTIFIC_DATA_ENGINE.md).

## Data & sourcing — no fabrication
Every technical field is curated from authoritative public sources — the IAU Minor
Planet Center and the NASA/JPL Small-Body Database. **Every field is optional and
omitted when not reliably known**: designations, orbital periods, perihelion dates,
discoverers, meteor-shower links, and mission targets are NEVER invented. Perihelion
dates are given only for well-documented apparitions; nucleus sizes only where
established.

## Reuse first — never duplicate
The **ten comets** already in the graph (Halley, Swift–Tuttle, 67P, Tempel 1, Wild 2,
Borrelly, Hale–Bopp, Hyakutake, NEOWISE, Shoemaker–Levy 9) are marked `existing: true`
and ENRICHED here — linked into classes, families, reservoirs, meteor showers, and
missions — never recreated. The **six meteor showers**, **Rosetta**, and Program Y's
dynamical reservoirs (`minor_planet_group:kuiper-belt` / `scattered-disc` /
`centaurs`) and **Sedna** are all reused. Only the five comet missions absent from the
graph (Giotto, Deep Impact, Stardust, Deep Space 1, EPOXI) are created — as reused-type
`space_mission` entities without a dedicated page — so the comets they explored can be
connected.

## Scale
| Kind | Graph type | New / reused | Count |
| --- | --- | --- | --- |
| Comet | `comet` (existing type) | 10 reused + 11 new | 21 |
| Comet class | `comet_class` (new) | new | 5 |
| Comet family | `comet_family` (new) | new | 1 |
| Small-body reservoir | `small_body_reservoir` (new) | new | 2 |
| Active asteroid | `active_asteroid` (new) | new | 2 |
| Dormant comet | `dormant_comet` (new) | new | 2 |
| Mission | `space_mission` (existing) | 5 new | 5 |

**28 new graph entities and 61 new relations.** The full graph (built on Programs
X + Y) validates at 6,090 entities / 9,817 relations with zero issues.

## Pipeline
```
curated data (src/knowledge-graph/data/comets-catalog/data/*)
  → comets-catalog/index.ts   (entities + relations + validateComets + COMETS_STATS)
  → knowledge-graph/{entities,relations}.ts   (appended last)
  → comet-engine.ts           (engine.comets — pure, framework-free)
  → app/comets/**             (hub, /comets/[slug], class/family/reservoir/active/dormant, discover)
```

## Relations
Two new relation types: `belongs_to_reservoir` (comet → its source reservoir, which
may be a new `small_body_reservoir` or a REUSED `minor_planet_group`) and
`source_of_meteor_shower` (parent body → an existing `meteor_shower`). Everything else
reuses existing types: `member_of_family` (→ comet_family), `member_of_group`
(→ comet_class), `visited_by` / `returned_samples_from` / `target_of_mission` (missions),
`observed_by`, `associated_with`, and `part_of` (inner Oort cloud → Oort cloud).
`belongs_to_reservoir` is deliberately distinct from `member_of_group`: a comet
*originated from* a reservoir but does not currently reside in it. Cross-references
resolve against the map for the target kind; edges that duplicate an existing graph
edge (e.g. a mission target already emitted by the exploration catalog) are dropped via
`legacy-relations.ts`.

## Meteor-shower parent bodies
Parent-body links are emitted as `source_of_meteor_shower` to the **existing** Live Sky
`meteor_shower` entities where they are modelled — Swift–Tuttle → Perseids, Halley →
Orionids, Encke → Taurids, Tempel–Tuttle → Leonids, Phaethon → Geminids, 2003 EH1 →
Quadrantids. Where the shower is not yet a graph entity (Lyrids, Eta Aquariids,
Draconids), the parentage is recorded as a labelled note rather than a fabricated
entity or a dangling edge.

## Pages
`/comets` (hub), `/comets/{slug}` (the 11 NEW comets; reused comets keep their canonical
pages), and the routes `class/{slug}`, `family/{slug}`, `reservoir/{slug}`,
`active/{slug}` (active asteroids), `dormant/{slug}` (dormant comets), plus
`discover/{slug}` (18 discovery hubs). Each entity page emits BreadcrumbList + a
schema.org `Thing`/`CollectionPage` JSON-LD, a quick-facts panel, exploration and
classification sections, a Knowledge-connections list, EntityProvenancePanel, a
quality/authority panel, and Sources.

## Live Sky — architecture, not fabrication
This encyclopedia computes **no live comet visibility** and states **no current
brightness or "visible tonight"** claim. Each comet page links to the computed Live Sky
tools — `/sky/comets`, `/sky/meteor-showers`, `/sky/observing-calendar` — for what is
genuinely observable.

## Open Data
The existing `comets` dataset auto-includes the new comet entities. Four new datasets
are added — `comet-classes`, `comet-families`, `small-body-reservoirs`, and
`comet-transition-objects` — each exported as JSON / CSV / JSON-LD at
`/api/v0/datasets/{slug}`.

## Validation
`validateComets()` runs in `npm run validate` and `engine.validation`. It checks
duplicate ids, per-kind slug uniqueness, id ↔ kind/slug match, sources and description,
in-range numerics (eccentricity 0–1, inclination 0–180°, plausible period), type-aware
cross-reference resolution, well-formed reused-reservoir and meteor-shower ids, and
**no isolated new entity**. The entry gate additionally asserts every emitted relation
endpoint resolves in the assembled graph; `validateGraph` enforces unique ids,
resolvable endpoints, the science boundary, and no duplicate relations.

## Learning
The `understanding-comets` learning path — 12 lessons across what a comet is, comet
anatomy and orbits, periodic vs long-period comets, the Kuiper Belt / scattered disc
and Oort cloud, meteor showers, sungrazers, main-belt comets, comet missions, impact
risk, and what pristine comets reveal — every step a real `/comets` (or reused
`/asteroids`) route.

## Honest gaps (documented scope decisions)
- **`meteor_stream`** is not a separate type: the observed shower and its debris stream
  are one phenomenon, already modelled as `meteor_shower` — reused, never duplicated.
- **`comet_apparition`** is represented by comet fields (`perihelionDate`,
  `nextPerihelion`) rather than separate apparition entities.
- **`comet_fragment` / `split_from`** fragmentation is captured by a `fragmented` field
  and prose (73P, Shoemaker–Levy 9) rather than modelling individual fragments.
- **Kuiper Belt / scattered disc / Centaurs** reservoirs are REUSED from Program Y's
  `minor_planet_group` entities via `belongs_to_reservoir`; the hub links to Y's pages
  rather than creating parallel comet-side entities.
- **Depends on Program Y**: this branch is built on `program-y-asteroids-encyclopedia`
  and reuses its reservoir types and `asteroid:chiron`; it must be merged after Y.
