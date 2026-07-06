# Live Scientific Data Platform (Program BT)

The Sun does not wait, and neither do the asteroids. This program is AsteriaStar's first connection to
the real, changing sky — space weather, solar activity, and near-Earth objects from the agencies that
measure them — modelled with the full **honesty envelope**.

**Honesty first.** Every provider is a first-class graph node that exposes its endpoint, licence, data
kinds, status, and limitations. **No provider is connected in this deployment**, so no live value,
timestamp, or provider response is shown — every provider reports its real status (`planned` /
architecture-ready). Nothing is fabricated: there is no fake live dashboard and no silent fallback to
invented data. The integration **reuses the existing live-sky provider registry** as its source of
truth and the NASA / NOAA / SWPC / JPL / MPC organisations already in the graph.

## Data model

`LiveSourceRecord` (single entity type `live_data_source`) carries a `category`, a `providerKey`
(matching a real entry in the live-sky provider registry), an `endpoint`, a `licenseNote`, the
`dataKinds` served, a `status` (from the honesty status enum), and honest `limitations`.

The **honesty status enum** (`LiveStatus`): `connected` · `computed` · `cached` · `stale` ·
`unavailable` · `planned`. The runtime `ProviderEnvelope` type carries `provider`, `endpoint`,
`license`, `status`, `fetchedAt`, `generatedAt`, `validFrom`, `validUntil`, `stale`, `provenance`,
`limitations`, `error`, and (only on a real fetch) `data` — populated only when a real fetch occurs,
never fabricated.

## Contents — 6 providers

- **NOAA Space Weather Prediction Center** (space weather) — solar wind, Kp, the G/S/R scales, alerts.
- **NASA DONKI** (solar activity) — flares, CMEs, SEP events, geomagnetic storms.
- **IAU Minor Planet Center** (near-Earth objects) — designations & close approaches.
- **JPL / CNEOS** (near-Earth objects) — close-approach tables & impact-risk summaries.
- **CelesTrak** (orbital) — ISS/satellite TLEs & SGP4 passes (architecture-ready, not wired).
- **Atmospheric conditions** — weather, seeing, transparency, cloud, Bortle (awaiting a licence-safe
  provider).

## Honest status & the envelope (`src/lib/live/status.ts`)

`plannedEnvelope(source)` builds the honesty envelope for a provider that has not been fetched — status
carried from the catalogue, **no data and no invented timestamps**. `buildStatusReport()` returns a
truthful summary of every provider's status; it never claims a provider is connected when it is not.
The validator additionally checks that every `providerKey` matches a real live-sky provider and that
no source falsely claims `connected`.

## Engine (`engine.liveScientificData`)

`ResolvedLiveSource` resolves a provider to its reused organisation and phenomena (`related`) and
carries its honest envelope. Query surface: `all()`, `byCategory(c)`, `categories()`,
`statusReport()`, and `resolveEntry(slug)`.

## Pages & API

- `/live` — the hub: the live provider-status panel, the categories, and the providers.
- `/live/{slug}` — a provider, with its full status envelope, data kinds, and limitations.
- `/live/discover/{slug}` — the categories (space weather, solar activity, near-Earth objects, orbital,
  atmospheric).
- `/live/data-status` — the honest data-status dashboard.
- `/api/v0/live/status` — the machine-readable provider status (static, honest, no live value).

## Provenance

Provider metadata (names, endpoints, licences) is real. Status is read from the live-data catalogue
and the live-sky registry; no provider is connected in this deployment, and no live value is
fabricated. Connecting a provider is future work (a real fetch would populate the envelope's `data`,
`fetchedAt`, and validity window).
