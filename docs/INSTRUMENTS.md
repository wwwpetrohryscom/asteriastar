# Scientific Instruments & Payloads Encyclopedia (Program AH)

The science-payload layer — the classes of scientific instrument and the instruments
themselves. Reuses and enriches the existing `scientific_instrument` entities (Mars, JWST,
Hubble, Juno, and ground-telescope instruments) by linking each to its instrument class,
and creates notable new instruments linked to their reused host missions.

## Data model
One new entity type (`instrument_class`), reusing `scientific_instrument`; no new relations
(reuse `member_of_group`, `contains_instrument`):

| Kind | Graph type | Count |
| --- | --- | --- |
| Instrument class | `instrument_class` (new) | 12 |
| Instrument (new) | `scientific_instrument` (reused type) | 15 |
| Instrument (existing, enriched) | `scientific_instrument` | 16 |

**27 new entities, 48 relations.** New instruments are `member_of_group` their class and
`contains_instrument`ed by their host mission; the 16 existing instruments are enriched with
a `member_of_group` link to their class (never recreated).

## Pages, data, validation
`/instruments` hub, adaptive `/instruments/{slug}` (classes and new instruments share one
route), and 5 discovery hubs. Two datasets (`instrument-classes`, `scientific-instruments`);
the `understanding-scientific-instruments` 12-lesson learning path. `validateInstruments()`
checks duplicate ids, cross-kind slug uniqueness, instrument→class resolution, host-id type,
the reused-enrichment mapping (each id a scientific_instrument resolving to its class), and
no isolated nodes — plus a graph-endpoint check.

## Scope
Instrument→discovery and instrument→dataset links surface through the graph and the Open
Data layer; this program reuses the host missions and the existing instruments aggressively
rather than duplicating them.
