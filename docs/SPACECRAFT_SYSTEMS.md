# Spacecraft Systems & Engineering Encyclopedia (Program AG)

The engineering layer of spacecraft — the subsystems and the components that make them up.
Reuses the platform's docking systems, life-support systems (ECLSS), antennas (Program AD),
and attitude sensors (star trackers, IMUs — Program AD); adds the subsystem and component
entities.

## Data model
Two new entity types, no new relations (reuse `part_of`, `associated_with`):

| Kind | Graph type | Count |
| --- | --- | --- |
| Spacecraft subsystem | `spacecraft_subsystem` | 10 |
| Spacecraft component | `spacecraft_component` | 25 |

**35 new entities, 31 relations.** Components are `part_of` their subsystem; subsystems and
components `associated_with` the reused docking systems, life-support systems, antennas, and
attitude sensors.

## Pages, data, validation
`/spacecraft-systems` hub, adaptive `/spacecraft-systems/{slug}` (subsystems and components
share one route), and 6 discovery hubs. Two datasets (`spacecraft-subsystems`,
`spacecraft-components`); the `understanding-spacecraft-systems` 12-lesson learning path.
`validateSpacecraftSystems()` checks duplicate ids, cross-kind slug uniqueness, component→
subsystem resolution, no subsystem-with-parent, and no isolated nodes — plus a graph-endpoint
check.

## Reuse & scope
The attitude sensors (star trackers, IMUs) are the reused `navigation_system` entities from
Program AD; the spacecraft antennas are reused from AD; ECLSS and docking systems are the
reused `life_support_system` / `docking_system` entities from Human Spaceflight. Payloads and
scientific instruments are Program AH; this program covers the engineering bus.
