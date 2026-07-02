# Night Sky Provider Integration v1 (Program P)

Program P connects the **first real, source-backed live-sky data flow** through
the Live Sky Engine: the **current Moon phase and illuminated fraction**. It is
the platform's first datum whose value changes with time — and it is delivered
**without fabricating anything, without a paid API, without scraping, and without
ever requesting the user's location**.

See also: [SKY.md](./SKY.md) (Program J foundation), [OPEN_DATA.md](./OPEN_DATA.md)
(the API envelope), [SCIENTIFIC_SOURCES.md](./SCIENTIFIC_SOURCES.md),
[LICENSING_POLICY.md](./LICENSING_POLICY.md).

## Provider decision: computed, not fetched

The mission preferred an authoritative public provider (USNO / JPL Horizons /
NASA). We evaluated those and chose the mission's **explicit fallback** — a
**deterministic calculation from public-domain formulae** — for v1, because:

- **No free, authoritative, stable, documented live endpoint** returns *just*
  Moon phase + illumination without a location, an API key, rate limits, or
  redistribution constraints. JPL Horizons is authoritative but is a batch
  ephemeris service, not a phase API; the USNO Astronomical Applications API has
  had availability gaps. Building v1 on a fragile or key-gated endpoint would
  contradict "narrow, reliable, cacheable".
- Moon phase and illumination are **global** (no location needed) and follow
  well-established public-domain geometry. A deterministic computation is
  reliable, cacheable, offline, reproducible, and **fully validatable** — we can
  and do check it against known phases in CI.

So the value is labelled **`method: "computed"`** and carries the **`computed`**
data status everywhere — a deterministic, source-backed calculation valid within
its window, **explicitly NOT a live provider feed**. This is the honest label,
not "live".

> There are still **zero connected live providers**. `computed` is a distinct,
> honest third status alongside `reference` and `prepared`.

## Method, formulae & constants (all public domain)

Implemented in [`src/platform/live-sky/providers/computed-moon.ts`](../src/platform/live-sky/providers/computed-moon.ts).

- **Solar ecliptic longitude** — USNO *"Approximate Solar Coordinates"*
  (aa.usno.navy.mil): mean anomaly `g = 357.529 + 0.98560028·d`, mean longitude
  `q = 280.459 + 0.98564736·d`, and `λ☉ = q + 1.915·sin g + 0.020·sin 2g`, with
  `d` = days since J2000.0 (JD − 2451545.0).
- **Lunar ecliptic longitude** — standard low-precision lunar theory: the mean
  elements (`L′, M′, D, F`) and the **seven dominant periodic terms** of the
  Moon's longitude, as tabulated in Jean Meeus, *Astronomical Algorithms*, and
  the *Astronomical Almanac*. Only the **mean elements and largest terms** are
  used — these are **public-domain astronomical quantities, not copyrighted
  text**. Meeus is cited as a **methodology reference only**; no tables or prose
  are copied.
- **Illuminated fraction** — `k = (1 − cos ψ) / 2`, where `ψ` is the Sun–Moon
  elongation (`λ☾ − λ☉`). This gives `k = 0` at new, `1` at full, `0.5` at the
  quarters.
- **Phase name** — binned by elongation into the eight principal phases
  (new → waxing crescent → first quarter → … → waning crescent).
- **Synodic age** — `(ψ / 360) · SYNODIC_MONTH`, with
  `SYNODIC_MONTH = 29.530588853 days` (mean value, IAU/almanac constant).

**Accuracy:** illuminated fraction is good to ~1% and the phase name is reliable
— ample for observing guidance. It is **not** a substitute for a full ephemeris
(JPL Horizons / USNO almanac) for rise/set or high-precision work, and
**moonrise/moonset are deliberately not provided** in v1 (they require an
observer location and a fuller ephemeris).

## Engine integration

The engine stays pure, provider-isolated, source-aware, timestamp-aware,
cache-ready, stale-aware, and framework-independent. No network calls live in the
platform layer.

- [`schema.ts`](../src/platform/live-sky/schema.ts) — adds the `computed`
  `DataStatus`, the `computedEnvelope(...)` builder, and extends `withStaleness`
  so a `computed` reading past its `validUntil` flips to `stale`.
- [`models.ts`](../src/platform/live-sky/models.ts) — the `MoonData` contract.
- [`moon.ts`](../src/platform/live-sky/moon.ts) — `moon.current(now)` and
  `moon.at(instant, now)`; the caller injects `now` so the contract is pure and
  testable. Exposed as **`engine.liveSky.moon`**.
- [`providers/computed-moon.ts`](../src/platform/live-sky/providers/computed-moon.ts)
  — the pure, deterministic calculator (`computeMoon(at)`).
- [`validation.ts`](../src/platform/live-sky/validation.ts) — `validateMoon()`
  checks envelope honesty, the data contract, and the calculation against known
  reference phases; it runs inside `validateLiveSky()` and `npm run validate`.

## The data contract

Every Moon response carries (see `MoonData` + its `SkyEnvelope`):

| Field | Meaning |
| --- | --- |
| `objectEntityId` | `moon:the-moon` (resolves in the Knowledge Graph) |
| `phase` / `phaseName` | one of the eight principal phases |
| `phaseAngleDeg` | Sun–Moon elongation, 0–360° |
| `illuminationFraction` / `illuminationPercent` | 0–1 / 0–100, consistent |
| `synodicAgeDays` | age since the previous new moon (0 … ~29.53) |
| `waxing` | true 0–180°, false 180–360° |
| `method` | `"computed"` (never `"provider"` in v1) |
| `atIso` | the instant the phase is computed *for* |
| `calculationNotes` | the formula basis and accuracy caveat |
| envelope `status` | `computed` (or `stale`) — never `live` |
| envelope `generatedAt` | the **real** computation time |
| envelope `validFrom` / `validUntil` | validity window (see below) |
| envelope `source` | `["usno"]` — the one source key the math draws on (approximate solar coordinates); the lunar series is public-domain Meeus/Almanac, named in `provenance`. NASA is a Moon-facts *citation*, not a computation source, so it is deliberately not listed here. |
| envelope `confidence` | `modeled` |
| envelope `stale` | boolean, honestly derived |
| envelope `provenance` / `licenseNotes` | computed-not-fetched; PD formulae |

**No value without a source or calculation basis.**

## API endpoint

`GET /api/v0/live-sky/moon` — a **dynamic** route handler
([`route.ts`](../src/app/api/v0/live-sky/moon/route.ts)) that reads the **real
server time**.

- **Params:** `date=YYYY-MM-DD` or ISO 8601 (optional). Only genuinely-supported
  params are advertised. `latitude` / `longitude` / `timezone` are **not**
  implemented for phase/illumination (they are global) and are **ignored with an
  honest note** — never silently pretended.
- **Response:** the standard Open Data envelope (`meta` with
  `apiVersion/schemaVersion/dataVersion/generatedAt/source/license/attribution/provenance/docs/stale`,
  `count`, `data`). `data` is the `MoonData` plus its `envelope`.
- **Errors:** an invalid `date`, or a year outside 1900–2100, returns a
  **structured `apiError` (HTTP 400)** — never fabricated data, never a silent
  fallback.

Registered in [`endpoints.ts`](../src/platform/open-data/endpoints.ts) and
surfaced on `/developers` and in `/api/v0/openapi.json`.

## Cache & staleness

- **Current reading** (`moon.current`): `validFrom = now`,
  `validUntil = now + 3h`; `Cache-Control: public, max-age=3600,
  stale-while-revalidate=3600`. When `now > validUntil`, `withStaleness` flips
  the status to `stale` and sets `stale: true` — a cached value is **labelled
  stale, never shown as live**.
- **Explicit-date reading** (`moon.at`): the value is an **exact, reproducible
  computation for that single instant**, so it is a **point value**
  (`validFrom == validUntil == instant`) and is honestly **never "stale"** — it
  does not decay. `generatedAt` is still the real computation time.
- On any failure the UI shows a **structured error and no value** — it never
  invents one.

## UI

`/sky/moon` renders a real **Moon data panel**
([`MoonDataPanel.tsx`](../src/components/sky/MoonDataPanel.tsx)) that fetches the
endpoint client-side (`cache: "no-store"`) and shows the phase, illumination,
Moon age, Sun–Moon angle, the **real computed-at and valid-until timestamps**,
the source, the confidence, the calculation notes, and a `computed`/`stale`
badge. The method is labelled **"Deterministic calculation (not a live provider
feed)"**. A **privacy note** states that phase and illumination are global — no
location is requested, inferred, or used. `/sky`, `/sky/night-sky-tonight`, and
`/sky/observing-calendar` reference the Moon page honestly without implying the
whole platform is live.

## Privacy & location

- **No geolocation.** The browser Geolocation API is never called.
- Phase and illumination need **no location**, so none is requested.
- `latitude`/`longitude`/`timezone` query params are **not** honoured for v1 and
  are disclosed as ignored; if moonrise/moonset are added later they will require
  **explicit, validated, user-provided** coordinates — never a guess or a
  browser lookup.

## Sources & citations

Added to [`records.ts`](../src/lib/citations/records.ts), each linked to
`moon:the-moon`:

- **USNO Astronomical Applications** — `https://aa.usno.navy.mil/` (solar/lunar
  approximate-coordinate formulae).
- **JPL Horizons** — `https://ssd.jpl.nasa.gov/horizons/` (authoritative
  ephemeris, cited as the higher-precision reference).
- **NASA — Moon** — `https://science.nasa.gov/moon/` (Moon facts).

Meeus, *Astronomical Algorithms*, is used **only as a methodology reference** for
the low-precision series; no copyrighted text or tables are reproduced.

## Validation results

`npm run validate`, `tsc --noEmit`, `npm run lint`, and `npm run build` all pass.
`validateMoon()` confirms envelope honesty (status `computed`/`stale`, real
timestamps, no falsely-claimed provider), the data contract (ranges, enums,
`method`), and the calculation against known reference phases. Runtime smoke
tests confirm the endpoint (current, `?date=`, and 400 on invalid input) and the
`/sky/moon` panel.

## Honest gaps (v1)

- **Computed, not provider-fetched** — clearly labelled as such.
- **No moonrise/moonset** — needs a location model + fuller ephemeris.
- **~1% illumination accuracy** — low-precision series, sufficient for observing,
  not for high-precision work.
- Still **zero connected live external providers**; `computed` is deliberately
  distinct from `live`.
