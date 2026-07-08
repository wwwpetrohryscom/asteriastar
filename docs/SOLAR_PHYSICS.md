# Solar Physics, Heliosphere & Solar Observatory (Program BY)

The nearest star, modelled from the inside out — from the fusion core to the bow wave at the edge of the
heliosphere. Built on the platform's honesty envelope: only well-established solar physics is stated,
open questions are flagged, and measured values appear only where they are firmly known.

## Reuse-first

BY reuses everything the graph already knows about the Sun and adds only what was missing:

- **The Sun** (`star:sun`), the **space-weather phenomena** (solar wind, flare, CME, sunspot, coronal
  hole, active region, solar cycle, heliosphere, heliopause), **helioseismology**
  (`astronomy_method:helioseismology`), the **solar observatories** (SOHO, SDO, Hinode, Parker Solar
  Probe, Solar Orbiter, DKIST), the **Voyagers**, and the operating organisations — all referenced, none
  duplicated.

## New entity types (no existing type fit these concepts)

- **`solar_region`** — the concentric structure: interior zones (core, radiative zone, convection zone,
  tachocline) and atmosphere layers (photosphere, chromosphere, transition region, corona).
- **`solar_feature`** — surface and atmospheric features: granulation, supergranulation, prominence,
  filament, plage, spicule, coronal loop, coronal streamer, polar coronal plume.
- **`heliosphere_structure`** — Parker spiral, termination shock, heliosheath, heliospheric bow wave.

The **solar-physics processes, cycle concepts, and wind regimes** reuse the existing
`stellar_physics_concept` type (the Sun is a star): the dynamo, magnetic reconnection, differential
rotation, the coronal-heating problem, nanoflare heating, the butterfly diagram, the Maunder and Dalton
minima, irradiance variation, and the fast and slow solar wind.

## Honesty

- Firmly-known measured values are given (core ~15 million K; photosphere ~5,772 K; termination shock
  ~85–95 AU; irradiance variation ~0.1% over a cycle); nothing is invented.
- Open questions are stated as open: **coronal heating** (nanoflares vs waves, still unresolved) and the
  **heliospheric boundary** (IBEX and the Voyagers suggest a gentle bow wave rather than a strong bow
  shock).
- The validator checks that every `relatedKey` resolves to a real entity, so no reference to a
  non-existent Sun, observatory, or phenomenon can slip in.

## Engine & pages

`engine.solarPhysics` (regions / features / dynamics / heliosphere queries + `resolveEntry`). Pages
`/solar-physics` (hub, with a reused-observatories section), `/solar-physics/[slug]` (rich detail with
provenance, quality, sources, related entities, knowledge connections, JSON-LD, breadcrumbs), and
`/solar-physics/discover/[slug]` (four discovery groups: inside the Sun, the atmosphere, activity & the
cycle, and the wind & heliosphere).
