# Deep Space Communications & Navigation Encyclopedia (Program AD)

The infrastructure layer that connects nearly every previous program — the communication,
tracking, timing, and navigation systems that make robotic and human spaceflight possible.
It depends on and links to Space Exploration (D), Human Spaceflight (E), Observatories (F),
Live Sky (J), Launch Vehicles (V), and Small-Body Missions (AC).

See also: [SMALL_BODY_MISSIONS](./SMALL_BODY_MISSIONS.md), [SATELLITES](./SATELLITES.md),
[SCIENTIFIC_DATA_ENGINE.md](./SCIENTIFIC_DATA_ENGINE.md).

## Reuse first — never duplicate
The three flagship networks — NASA's **Deep Space Network**, ESA's **Estrack**, and NASA's
**Near Space Network** — already exist in the graph as `tracking_network` entities. This
program **reuses and enriches** them (`existing: true`), rather than creating a duplicate
`deep_space_network` type. The national and commercial networks are created as
`tracking_network` entities too. The supported missions (Voyager, Cassini, New Horizons,
Juno, Parker, JWST, Rosetta, Hayabusa, OSIRIS-REx, Lucy, Psyche, DART, Hera, MMX) and the
operating agencies are all reused.

## Catalog policy
- **Networks** are `tracking_network` entities. Reused networks keep their canonical home
  (under `/satellites/network/…`); their `/deep-space-network/network/{slug}` page is a
  themed view whose canonical points back to the existing page, and it is **excluded from
  the sitemap** (the Program V/AC pattern). New networks are canonical here.
- **Every capability, antenna size, coverage figure, and timeline is optional** and omitted
  when not reliably known — never invented. A station whose exact antenna size is uncertain
  (Ussuriysk) simply omits it.

## Signal light-time — physics, not fabrication
Signal latency is a property of **distance**, not of a band: one-way light-time is the
distance divided by the speed of light (about 1.3 s to the Moon, 3–22 minutes to Mars, and
over 22 hours to Voyager 1). These are real, derivable values, described honestly on the
X-band page — never a fabricated fixed delay.

## Data model
Networks reuse `tracking_network`; the genuinely-new infrastructure types are created:

| Kind | Graph type (new) | Count |
| --- | --- | --- |
| Network | `tracking_network` (reused) | 8 (3 reused + 5 new) |
| Tracking station | `tracking_station` | 12 |
| Ground station | `ground_station` | 4 |
| Antenna | `antenna` | 8 |
| Signal band | `signal_band` | 5 |
| Navigation system | `navigation_system` | 7 |
| Time standard | `time_standard` | 4 |
| Communication system | `communication_system` | 4 |

**49 new graph entities and 151 new relations.** Two new relation types (`tracks`,
`uses_band`); everything else reuses `part_of` (station → network), `operated_by`,
`located_at` (antenna → station), and `associated_with`.

## Graph relationships
Stations are `part_of` their network and `operated_by` an agency; networks `track` the
missions they support and (with stations and antennas) `use_band` the signal bands they
operate in; antennas are `located_at` a station; navigation, timing, and communication
systems link via `uses_band` and `associated_with`. Cross-references resolve against the
map for the target kind; edges that duplicate an existing graph edge are dropped via
`legacy-relations.ts`.

## Pages
`/deep-space-network` (hub), `/deep-space-network/network/{slug}` (networks — adaptive,
reused ones link back to their existing page), `/deep-space-network/station/{slug}`
(tracking + ground stations), `/deep-space-network/antenna/{slug}`,
`/deep-space-network/band/{slug}`, `/deep-space-network/navigation/{slug}`, and
`/deep-space-network/discover/{slug}` (discovery hubs: networks, tracking stations, ground
stations, antennas, signal bands, navigation, laser communications, future communications).
Time standards and communication systems are standalone graph entities under `/explore`.

## Validation
`validateDeepSpaceCommunications()` runs in `npm run validate` and `engine.validation`. It
checks duplicate ids, per-kind slug uniqueness, id ↔ kind/slug match, sources, description,
reference-type integrity (network membership must point at a `tracking_network`, antenna
location at a station, mission-support at a `space_mission`/`space_telescope`), signal-band
validity (every band slug resolves), station-without-network, cross-kind station slug
uniqueness, and no isolated new entity. The entry gate additionally asserts every emitted
relation endpoint resolves in the assembled graph.

## Open Data
Six new datasets over the new entity types — `tracking-stations`, `ground-stations`,
`antennas`, `signal-bands`, `navigation-methods`, and `communication-technologies`
(communication systems + time standards) — each exported as JSON / CSV / JSON-LD at
`/api/v0/datasets/{slug}`. The networks are reused `tracking_network` entities and remain
part of the existing tracking-networks data.

## Learning
The `understanding-deep-space-communications` learning path — 12 lessons across why
deep-space communication is hard, the Deep Space Network, tracking stations, antennas,
signal bands, light-time, radiometric and Delta-DOR navigation, optical and autonomous
navigation, onboard clocks, and laser communications.

## Honest gaps (documented scope decisions)
- **`deep_space_network`** is not created as a new type: the networks already exist as
  `tracking_network` entities and are reused, avoiding a duplicate.
- **`telemetry_system`** is folded into the communication systems (TT&C); **uplink/downlink**
  are directions described on the signal-band pages, not separate entities; **`tracking_campaign`**
  is modelled as the `tracks` mission-support relation rather than a separate entity.

## Future expansion
- New optical-communication terminals and relays as they fly.
- Antenna arraying and next-generation deep-space antennas.
- Deeper links from tracking campaigns to specific mission phases (Program AC).
