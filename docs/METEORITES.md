# Meteors, Meteorites & Fireballs Encyclopedia (Program AA)

The capstone of the small-bodies trilogy — **Program Y (Asteroids)** → **Program Z
(Comets)** → **Program AA (Meteorites)** — a comprehensive, source-backed, graph-driven
encyclopedia of the small bodies that reach the ground: meteorites, their classes and
groups, fireballs and bolides, terrestrial impact structures, and recovery sites.

See also: [ASTEROIDS](./ASTEROIDS.md), [COMETS](./COMETS.md),
[SCIENTIFIC_DATA_ENGINE.md](./SCIENTIFIC_DATA_ENGINE.md).

## Data & sourcing — no fabrication
Every field is curated from authoritative public sources — the Meteoritical Society's
Meteoritical Bulletin Database, NASA/JPL, and NASA CNEOS fireball data. **Every field
is optional and omitted when not reliably known**: classifications, fall dates,
recovery locations, masses, parent-body links, and impact energies are NEVER invented.

## Reuse first — never duplicate
Parent-body links point at REUSED graph entities: the asteroid **Vesta** (Program Y)
for the HED meteorites, **Mars** for the Martian meteorites, and the **Moon** for the
lunar meteorites (`parent_body`). The **impact events** (Chicxulub, Tunguska,
Chelyabinsk — Program Y), the **meteor showers** (Live Sky), and **Earth** are all
reused. Nothing is duplicated.

## Scale
| Kind | Graph type (new) | Count |
| --- | --- | --- |
| Meteorite | `meteorite` | 20 |
| Meteorite class | `meteorite_class` | 4 |
| Meteorite group | `meteorite_group` | 8 |
| Fireball | `fireball` | 2 |
| Impact structure | `impact_structure` | 4 |
| Recovery site | `recovery_site` | 2 |

**40 new graph entities and 47 new relations.** The full graph (built on Programs
X + Y + Z) validates at 6,130 entities / 9,864 relations with zero issues.

## Pipeline
```
curated data (src/knowledge-graph/data/meteorites-catalog/data/*)
  → meteorites-catalog/index.ts   (entities + relations + validateMeteorites + METEORITES_STATS)
  → knowledge-graph/{entities,relations}.ts   (appended last)
  → meteorite-engine.ts           (engine.meteorites — pure, framework-free)
  → app/meteorites/**             (hub, /meteorites/[slug], class/group/fireball/impact-structure/site, discover)
```

## Relations
One new relation type: `parent_body` (a meteorite or meteorite group → the reused
asteroid / planet / moon it came from). Everything else reuses existing types:
`member_of_group` (meteorite → group, or an iron → its class), `part_of` (group →
class), `located_at` (meteorite → recovery site), and `associated_with` (meteorite →
its fireball / impact event; fireball and impact structure → Earth). Cross-references
resolve against the map for the target kind; edges that duplicate an existing graph
edge are dropped via `legacy-relations.ts`.

## Falls, finds & bolides
Whether a meteorite was an observed **fall** or a later **find** is a `fallType` field
(driving the Falls / Finds hubs) rather than a separate entity type; a **bolide** is a
`bolide` flag on a fireball. This keeps the taxonomy honest without inventing
event-entities. The Chicxulub, Tunguska, and Chelyabinsk *events* remain the reused
`impact_event` entities; only impact *structures* not already modelled (Barringer,
Vredefort, Sudbury, Ries) are created here.

## Pages
`/meteorites` (hub), `/meteorites/{slug}` (each meteorite), and the routes
`class/{slug}`, `group/{slug}`, `fireball/{slug}`, `impact-structure/{slug}`,
`site/{slug}`, plus `discover/{slug}` (16 discovery hubs). Each entity page emits
BreadcrumbList + a schema.org `Thing`/`CollectionPage`/`Event`/`Place` JSON-LD, a
quick-facts panel, origin/links sections, a Knowledge-connections list,
EntityProvenancePanel, a quality/authority panel, and Sources.

## Live Sky — architecture, not fabrication
This encyclopedia detects **no live fireballs** and states no live events. Meteorite and
fireball pages link to the computed Live Sky tools — `/sky/meteor-showers`,
`/sky/observing-calendar` — for what is genuinely observable.

## Open Data
Five new datasets — `meteorites`, `meteorite-classes` (classes + groups), `fireballs`,
`impact-structures`, and `recovery-sites` — each exported as JSON / CSV / JSON-LD at
`/api/v0/datasets/{slug}`.

## Validation
`validateMeteorites()` runs in `npm run validate` and `engine.validation`. It checks
duplicate ids, per-kind slug uniqueness, id ↔ kind/slug match, sources and description,
type-aware cross-reference resolution (group/class/recovery-site), that every meteorite
attaches to exactly one taxonomy node, well-formed parent-body ids, and **no isolated
new entity**. The entry gate additionally asserts every emitted relation endpoint
resolves in the assembled graph.

## Learning
The `understanding-meteorites` learning path — 12 lessons across meteors vs meteorites,
falls and finds, classification, carbonaceous chondrites, meteorites from Vesta / Mars /
the Moon, iron meteorites, fireballs, impact structures, meteor showers, and impact
hazard — every step a real `/meteorites` or Live Sky route.

## Honest gaps (documented scope decisions)
- **`meteorite_fall` / `meteorite_find`** are a `fallType` field, not separate entity
  types (the event of a fall, where notable, is the reused `impact_event` or the
  fireball).
- **`bolide`** is a flag on the fireball type.
- Individual ground coordinates of recovery sites are described rather than modelled.
- **Depends on Programs Y and Z**: this branch is built on the Program Z branch (which
  is built on Y) and reuses Vesta and the impact events; it must be merged after them.
