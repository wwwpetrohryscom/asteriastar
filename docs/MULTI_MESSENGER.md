# Multi-Messenger & Gravitational-Wave Operations Encyclopedia (Program AZ)

The knowledge layer of modern multi-messenger astronomy — how the universe is now observed in
gravitational waves, neutrinos, and light at once.

This layer **reuses** the LIGO (Hanford and Livingston), Virgo, and KAGRA detectors and the LISA
concept, the gravitational-wave-detection, multi-messenger, and neutrino methods and interferometry,
the kilonova, gamma-ray-burst, fast-radio-burst, tidal-disruption-event, and core-collapse-supernova
transient classes, the GCN, VOEvent, and Transient Name Server alert systems, the standard-siren
distance indicator, and the gravitational-wave and multi-messenger bands already in the graph. The
new entities are the gravitational-wave detectors, the gravitational-wave detection methods, the
compact-binary-merger source classes, the SCiMMA and LVK alert systems, the multi-messenger
channels, the follow-up stages, and the scientific data products.

## Data model

`MmRecord` is a discriminated record over `MmKind`:

| kind | entity type | meaning |
| --- | --- | --- |
| `facility` | `observatory` / `mission_concept` | a gravitational-wave detector — a **new entity of the existing type**, resolved from `facilityType` |
| `detection` | `gw_detection_method` | a gravitational-wave detection method |
| `source` | `transient_class` | a compact-binary-merger source class — a **new entity of the existing type** (which holds kilonovae, GRBs, …) |
| `alert` | `alert_system` | an alert system — a **new entity of the existing type** (which holds GCN, VOEvent, TNS) |
| `channel` | `mm_channel` | a multi-messenger observation channel |
| `stage` | `gw_followup_stage` | a follow-up / observation-campaign stage |
| `product` | `gw_data_product` | a gravitational-wave scientific data product |

Cross-references: `relatedKeys` (→ `associated_with` the reused detectors, methods, transient
classes, alert systems, and bands, and the sibling AZ entities). A facility carries a `statusLabel`
(Operating / Proposed).

### Reusing existing types

The ground detectors (GEO600, the Einstein Telescope, Cosmic Explorer) are created as `observatory:`
entities — the **same type** as LIGO and Virgo — and the space detectors (DECIGO, Taiji, TianQin) as
`mission_concept:` entities — the **same type** as LISA. The three compact-binary-merger classes
reuse the `transient_class` type, and the LVK and SCiMMA alerts reuse the `alert_system` type, rather
than minting parallel types. Only the detection methods, channels, follow-up stages, and data
products are genuinely new types.

## Contents

- **6 gravitational-wave detectors** — GEO600 (operating testbed), the Einstein Telescope and Cosmic
  Explorer (proposed next-generation ground), DECIGO, Taiji, and TianQin (proposed space).
- **3 detection methods** — laser interferometry, space interferometry, pulsar timing arrays.
- **3 source classes** — binary black hole, binary neutron star, and black hole–neutron star
  mergers.
- **2 alert systems** — the LVK public alerts and SCiMMA.
- **5 multi-messenger channels** — gravitational waves with light, neutrinos, gamma rays, radio, and
  optical.
- **3 follow-up stages** — localization, counterpart search, rapid response.
- **4 data products** — the sky-localization map, the waveform, parameter estimation, and the GWTC
  catalog.

## Reuse & the graph

Each entity links to the real detectors and phenomena it involves: laser interferometry to LIGO;
space interferometry to LISA; the binary-neutron-star merger to the kilonova and gamma-ray-burst
classes; the GW+light channel to the multi-messenger method; the counterpart search to the Rubin
Observatory; parameter estimation to the standard-siren indicator. Every emitted relation is deduped
against `LEGACY_RELATION_IDS`, and any relation whose endpoint does not resolve is dropped.

## Honesty

Proposed detectors are stated as such. Real events (GW150914, GW170817) are named where relevant, but
no masses, distances, or event counts are invented.

## Engine (`engine.multiMessenger`)

`ResolvedMultiMessenger` resolves an entry to the reused entities it uses (`related`) and the other
AZ entities that reference it (`usedBy`). Query surface: `facilities()`, `detectionMethods()`,
`sources()`, `alerts()`, `channels()`, `followupStages()`, `dataProducts()` (each sorted by name),
and `resolveEntry(slug)`.

## Pages

- `/multi-messenger` — the hub: the source classes, discovery hubs, and provenance.
- `/multi-messenger/{slug}` — an adaptive entry for a detector, method, source class, alert system,
  channel, stage, or product.
- `/multi-messenger/discover/{slug}` — observatories, detection methods, source classes,
  multi-messenger channels, follow-up, and alert systems.

## Provenance

Curated from the LIGO–Virgo–KAGRA collaboration, NASA, and ESA. Proposed detectors are stated as
such; nothing is fabricated; unknown values are left empty.
