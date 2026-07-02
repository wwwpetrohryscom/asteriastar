# Moonrise, Moonset & Lunar Position v1 (Program R)

Program R gives the Night Sky platform its **first real location-aware Moon
module**: deterministic **moonrise, moonset, lunar transit, altitude, azimuth,
distance, phase, illumination, age, and above/below-horizon status** for an
explicit location and date. It completes the Moon page's deferred
moonrise/moonset gap — **without a paid API, without scraping, without inventing
any value, and without ever guessing, geolocating, IP-locating, or storing the
user's location**.

It reuses **Program P's** computed Moon phase (`computeMoon`) and **Program Q's**
privacy-first location model, and it **extends** — without breaking — the
existing `GET /api/v0/live-sky/moon` endpoint.

See also: [NIGHT_SKY_PROVIDER_INTEGRATION.md](./NIGHT_SKY_PROVIDER_INTEGRATION.md)
(Program P), [SUN_AND_TWILIGHT.md](./SUN_AND_TWILIGHT.md) (Program Q — the
location model), [SKY.md](./SKY.md), [OPEN_DATA.md](./OPEN_DATA.md).

## Method: computed, not fetched

`method: "computed"`, data status `computed`, envelope `source ["usno"]` — not a
live provider feed. The Moon's position is derived from **public-domain
low-precision lunar theory** — the mean elements and the principal periodic terms
of the Moon's ecliptic longitude, latitude, and distance, as tabulated in the
**Astronomical Almanac** (US Naval Observatory / HM Nautical Almanac Office), with
**Jean Meeus, *Astronomical Algorithms*, as a methodology reference only** (no
copyrighted tables or prose are reproduced). This extends the same series the
Program P Moon phase already uses.

Implemented in [`providers/lunar-position.ts`](../src/platform/live-sky/providers/lunar-position.ts):

- `moonEcliptic` — the Moon's geocentric ecliptic longitude, latitude, and
  distance (validated against Meeus's worked example 47.a to within the
  low-precision tolerance: longitude 0.05°, latitude 0.03°, distance ~90 km).
- `moonEquatorial` — the ecliptic→equatorial rotation (obliquity → RA, Dec) and
  the horizontal parallax.
- `greenwichMeanSiderealTimeDeg` — GMST for the hour angle.
- `moonTopocentric` — the observer's **topocentric** altitude (parallax-corrected;
  the Moon's ~1° parallax matters) and azimuth (from north, increasing eastward).

[`moonrise.ts`](../src/platform/live-sky/moonrise.ts) finds the events by
**sampling** the Moon's topocentric altitude across the local civil day (the Moon
moves too fast for the Sun's closed-form hour-angle solution) and refining the
horizon crossings (threshold **−0.833°** — the refracted upper limb at a flat
sea-level horizon) by bisection, and the upper transit by an hour-angle-zero
search.

**Accuracy:** geocentric position ~0.05–0.2°, moonrise/moonset/transit ~1–2
minutes, topocentric altitude ~0.1°. **Ample for observing guidance — NOT for
occultations, grazes, spacecraft navigation, high-precision astrometry, or
legal/almanac-grade use.** This limitation is shown on the page (an "Accuracy"
card) and in every response (`accuracyNotes`).

## The data contract

Every location-aware response (`MoonPositionData` in [`models.ts`](../src/platform/live-sky/models.ts)):

| Block | Fields |
| --- | --- |
| `input` | echoed `latitude`, `longitude`, `date`, resolved `timezone`, `utcOffsetMinutes` |
| `referenceTimeIso` | the instant `position`/`phase`/`horizon` are evaluated at |
| `events` | `moonrise` `{iso, local, azimuthDeg}`, `moonset` `{iso, local, azimuthDeg}`, `lunarTransit` `{iso, local, altitudeDeg}` (upper culmination), `lunarLowerTransit` `{iso, local}` — **null where the event does not occur** |
| `position` | `altitudeDeg`, `azimuthDeg`, `rightAscensionDeg`, `declinationDeg`, `distanceKm`, `hourAngleDeg` (topocentric, at the reference time) |
| `phase` | `phase`, `phaseName`, `phaseAngleDeg`, `illuminationFraction`, `illuminationPercent`, `synodicAgeDays`, `waxing` (reuses Program P) |
| `horizon` | `aboveHorizonAtReferenceTime`, `alwaysAboveHorizon`, `alwaysBelowHorizon`, `noMoonrise`, `noMoonset` |
| `method` | `"computed"` |
| envelope | `computed` status, real `generatedAt`, `validFrom`/`validUntil`, `source ["usno"]`, `confidence`, `stale`, provenance, licenseNotes |
| notes | `calculationNotes`, `accuracyNotes` |

**No field without a source or calculation basis.**

## Reference time: current vs explicit date

- **No `date`** (the default) → a **current** reading: `position`/`phase`/`horizon`
  are evaluated at **now**; the events are for today's local date; the envelope
  has a short validity window (`now → now + 1h`) and is **stale-aware** (the
  Moon's position drifts).
- **Explicit `date`** → the reference time is **local noon** of that date; the
  events are for that local date; the envelope is an **immutable point value**
  (`validFrom == validUntil`) and is never stale.

## API endpoint (extended, backward-compatible)

`GET /api/v0/live-sky/moon` — a **dynamic** handler with two modes:

- **Without `latitude`/`longitude`** → the **unchanged Program P** global Moon
  phase and illumination (optional `?date=` computes for that instant). Existing
  clients are unaffected.
- **With `latitude` and `longitude`** (both required) → location-aware moonrise,
  moonset, transit, position, phase, and horizon status. Optional `date`
  (defaults to now) and IANA `timezone` (defaults to UTC).
- One coordinate alone, out-of-range lat/lon, an invalid date, or an invalid IANA
  timezone return a **structured `apiError` (HTTP 400)** — never guessed values.
- **Cache:** a specific date is immutable (`max-age=86400`); a current-position
  response drifts (`max-age=3600, stale-while-revalidate=3600`).

## Edge cases — handled honestly

- **No moonrise / no moonset on the local date** → that event is `null`, with the
  matching `noMoonrise` / `noMoonset` flag.
- **Circumpolar** (the Moon never sets) → `alwaysAboveHorizon`, both events null.
- **Never rises** (the Moon stays below the horizon) → `alwaysBelowHorizon`, both
  events null (verified at Tromsø, Longyearbyen in winter, and near the pole).
- **High latitude, International Date Line (UTC+13/+14, UTC−12), and DST
  transitions** — the local civil day is sampled directly with per-sample
  DST-correct offsets, so events land on the requested local date.
- **Transit only when it genuinely happens in-day** — the upper transit is the
  Moon's meridian passage (hour angle = 0). If the culmination falls just outside
  the local day, `lunarTransit` is **null** (mirroring USNO), never a
  boundary-sample artifact. `validateMoonPosition()` asserts any reported transit
  has hour angle ≈ 0.
- **Two moonrises or two moonsets in one day** (possible at high latitude) — the
  first of each is reported (the calendar-day convention) and
  `horizon.multipleEventsSameDay` is set, so a second crossing is flagged, never
  silently dropped.

Never is an event forced when it does not occur.

## UI

`/sky/moon` keeps the global phase panel (Program P) and adds a **location-aware
Moon panel** ([`MoonPositionPanel.tsx`](../src/components/sky/MoonPositionPanel.tsx)):
explicit lat/lon/date/timezone inputs, an **honest empty state** (the global
phase stays visible; nothing location-dependent until you enter coordinates), a
horizon status badge, a moonrise/transit/moonset timeline with azimuths and
transit altitude, a position & phase grid (altitude, azimuth, illumination,
distance, age, waxing/waning, declination), an **Accuracy** card, the real
computed-at timestamp, the source, the "deterministic calculation (not a live
provider feed)" label, a `role="alert"` structured error, and the privacy note.
No browser geolocation, no IP lookup, no stored location. `/sky`,
`/sky/night-sky-tonight`, and `/sky/observing-calendar` reference it honestly.

## Privacy

Location is only ever what the caller passes in — **never inferred, geolocated,
IP-located, stored, logged, or tracked**. No cookies. UI copy: *"Location is used
only for this calculation and is not stored."* The timezone field is prefilled
from the browser's own IANA zone purely as an editable convenience default;
nothing is submitted until Calculate.

## Citations

Reuses the Program P/Q citations: **USNO Astronomical Applications**
(`aa.usno.navy.mil`, the Astronomical Almanac methodology — its note now covers
lunar position and rise/set/transit), **NASA — Moon** facts, and **JPL Horizons**
as the high-precision reference (not fetched). No DOIs invented; no copyrighted
formula text quoted.

## Validation results

`npm run validate`, `tsc --noEmit`, `npm run lint`, and `npm run build` all pass.
`validateMoonPosition()` checks backward compatibility (the phase-only path never
carries position), invalid-input 400s, coordinate ranges (altitude −90..90,
azimuth 0..360, RA/Dec, distance plausibility), illumination consistency, phase
enum, **horizon-flag consistency** (always-above ⇒ no rise/set; flags match the
events and the reference-time altitude), polar handling near the pole, date-line
extremes, and numeric anchors (the London 2025-03-14 full-moon rises due east at
~18:28). Runtime smoke tests cover phase-only, Prague/Quito/Sydney/Tromsø/
Longyearbyen, UTC+14/−12, and the four 400 cases.

## Honest gaps (v1)

- **Computed, not provider-fetched** — clearly labelled.
- **Observing-guidance accuracy** (~1–2 min, ~0.1–0.2°), flat sea-level horizon —
  not for occultations, grazes, astrometry, or almanac-grade use.
- Grazing rise/set at extreme latitudes (the Moon skimming the horizon for a few
  minutes) is at the edge of the sampling resolution.
- The `date` is the local civil date; the current-mode position drifts, so it
  carries a short validity window and is stale-aware.
