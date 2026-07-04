# Ground Segment & Mission Operations Encyclopedia (Program AF)

The operational infrastructure behind every mission — the control centres and the
operational functions that fly spacecraft. Reuses the agencies, the tracking networks
(DSN, Estrack), and the missions; adds the operations-centre and operations-function
entities.

## Data model
Two new entity types, no new relations (reuse `operated_by`, `associated_with`):

| Kind | Graph type | Count |
| --- | --- | --- |
| Mission operations centre | `mission_operations_center` | 8 |
| Operations function | `operations_function` | 16 |

**24 new entities, 41 relations.** Centres are `operated_by` a reused agency and
`associated_with` the reused tracking networks and the operational functions; functions
cross-link to centres and to each other.

## Pages, data, validation
`/mission-operations` (hub), adaptive `/mission-operations/{slug}`, and 5 discovery hubs
(centres, command & control, flight dynamics, spacecraft health, mission lifecycle). Two
datasets (`operations-centers`, `operations-functions`); the `understanding-mission-operations`
12-lesson learning path. `validateMissionOperations()` checks duplicate ids, cross-kind slug
uniqueness (centres and functions share one route), reference-type integrity (operator →
organization, network → tracking_network), a centre must have an operator, and no isolated
nodes — plus a graph-endpoint check.

## Reuse & scope
DSN and Estrack operations are the reused networks; agencies (NASA, ESA, JAXA, ISRO,
Roscosmos, CNSA) and JPL are reused. The operations lifecycle phases (launch/cruise/science/
end-of-mission) are modelled as `operations_function` entities with a `lifecycle` category,
distinct from the encounter-focused `mission_phase` entities of Program AC.
