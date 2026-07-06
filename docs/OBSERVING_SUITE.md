# Professional Observatory Planning Suite (Program BQ)

From catalogue to eyepiece. This suite turns the platform's computed live-sky data into a night's
observing plan — what to see, when it is highest, and when the sky is truly dark — organising the
existing computations and observing entities into a professional planning workflow.

**Honesty first.** The planners **reuse** the platform's real live-sky computations (twilight, the
Moon, the planets — `engine.liveSky`) and the existing observing equipment, sites, and techniques;
**no ephemeris is re-implemented and no observing conditions are invented.** The external conditions
that observing depends on — weather, seeing, transparency, cloud cover, and Bortle sky brightness —
are modelled as **architecture-ready integrations**: their interfaces are defined and wired into the
planners, but each awaits a connected provider and shows nothing until one is connected, following
the same honesty envelope the live-sky providers already use. **Privacy-first:** an observer's
location stays on their device.

## Data model

`ObservingRecord` is a discriminated record over `ObservingKind`:

| kind | entity type | meaning |
| --- | --- | --- |
| `planner` | `observing_planner` | a planner backed by real computation and reused entities |
| `integration` | `observing_integration` | an architecture-ready external-data integration |

Each planner carries a `computeStatus` (`computed` — functional today on real platform data — vs
`architecture`) and a `dataSource` naming the reused engine capability (e.g. `engine.liveSky.twilight`).
`relatedKeys` link each entity to the reused live-sky capability, equipment, site, technique, or
object.

## Contents

- **14 planners** — tonight, visibility, target, Moon, planet, deep-sky, season, twilight, darkness,
  altitude-chart, meridian-transit, equipment, astrophotography, and session.
- **5 architecture-ready integrations** — weather, seeing, transparency, cloud cover, and Bortle
  sky-brightness.

## Reuse & the graph

Each planner reuses the real computation it needs: the tonight planner draws the computed twilight,
Moon, and planet data; the Moon planner the computed lunar phase; the twilight and darkness planners
the computed Sun position; the planet planner the computed planetary positions; the equipment and
astrophotography planners the real observing-equipment and technique entities; the season planner the
meteor showers and seasonal skies. The integrations link to the planners they feed and to real
observing sites. Every emitted relation is deduped against `LEGACY_RELATION_IDS`.

## Export & privacy

Session plans are designed to export as an **ICS calendar** or a **printable observing plan**, and to
generate observing reports. All planning runs against the observer's own location and clock, which
never leave the device.

## Engine (`engine.observingSuite`)

`ResolvedObserving` resolves an entry to the computations and entities it reuses (`related`) and the
other BQ entities that reference it (`usedBy`). Query surface: `planners()`, `integrations()` (each
sorted by name), and `resolveEntry(slug)`.

## Pages

- `/observing` — the hub: the planners, the discovery hubs, and provenance.
- `/observing/{slug}` — an adaptive entry for a planner or integration; integrations carry an explicit
  architecture-ready notice.
- `/observing/discover/{slug}` — the planners and the data integrations.

## Provenance

The planners reuse the platform's live-sky computations (see the Live Sky layer) and its observing
equipment, sites, and techniques. Observing conditions come only from connected providers; nothing is
fabricated, and unknown values are left empty.
