# Planet Visibility & Rise/Set v1 (Program S)

Program S upgrades `/sky/planet-visibility` from architecture-only to **real
computed, location-aware naked-eye planet visibility**: for Mercury, Venus, Mars,
Jupiter, and Saturn (and Uranus/Neptune on request) it computes **rise, set,
transit, altitude, azimuth, elongation, approximate magnitude, and honest
observing rules** for an explicit location and date — without a paid API, without
scraping, without inventing any value, and **without ever guessing, geolocating,
IP-locating, or storing the user's location**.

It reuses **Program Q/R's** privacy-first location model, the sidereal-time and
alt/az machinery from **Program R**, and the same sampling rise/set approach.

See also: [SUN_AND_TWILIGHT.md](./SUN_AND_TWILIGHT.md),
[MOONRISE_MOONSET_LUNAR_POSITION.md](./MOONRISE_MOONSET_LUNAR_POSITION.md),
[SKY.md](./SKY.md), [OPEN_DATA.md](./OPEN_DATA.md).

## Method: computed, not fetched

`method: "computed"`, data status `computed`, envelope `source ["jpl", "usno"]` —
not a live provider feed. Positions come from the public-domain **NASA/JPL
"Approximate Positions of the Planets"** Keplerian elements (Standish; the
1800–2050 table); the two-body Kepler solution and the ecliptic→equatorial
rotation follow the Astronomical Almanac, with Jean Meeus as a methodology
reference only (no copyrighted text reproduced). Approximate magnitudes use the
standard `H(1,0)` + phase-angle coefficients of the Astronomical Almanac (USNO).

Implemented in [`providers/planetary-position.ts`](../src/platform/live-sky/providers/planetary-position.ts):
heliocentric → geocentric equatorial position, the Sun's geocentric position (for
elongation and the darkness test), elongation, phase angle, and approximate
magnitude. [`planet-visibility.ts`](../src/platform/live-sky/planet-visibility.ts)
samples each planet's altitude across the local day for rise/set/transit and
applies the visibility rules.

**Validated:** against Meeus's worked example (Venus 1992-12-20) and — decisively
— the 2025 sky: Venus at 47° evening elongation on 2025-01-01, Mars and Jupiter
near opposition (all-night), Mercury a morning object, Saturn an evening object.

**Accuracy:** planetary position ~a few arcminutes to ~0.1°, rise/set/transit
~1–2 min, magnitude ~±0.3–0.5 (Saturn's rings not modelled). **For observing
guidance — NOT for high-precision astrometry, occultation predictions, spacecraft
navigation, or legal/almanac-grade use.** The visibility rules are deliberately
conservative approximations, not a guarantee (shown on the page and in every
response's `accuracyNotes`).

## Planet coverage

Default response: the five naked-eye planets — **Mercury, Venus, Mars, Jupiter,
Saturn**. **Uranus and Neptune** are available via `?planet=uranus|neptune`
(they are telescopic; their magnitudes are noted as requiring optical aid).

## The data contract

`PlanetVisibilityData` ([`models.ts`](../src/platform/live-sky/models.ts)):
`input` (lat/lon/date/timezone/utcOffsetMinutes), `referenceTimeIso`, and a
`planets[]` array. Each entry:

- `objectEntityId` (`planet:*`), `planetName`;
- `events`: `rise`, `set`, `transit` — each `{iso, local}`, **null where it does
  not occur**;
- `position`: `altitudeDeg`, `azimuthDeg`, `rightAscensionDeg`, `declinationDeg`,
  `distanceAu`, `elongationDeg`, `apparentMagnitude`;
- `visibility`: `aboveHorizonAtReferenceTime`, `visibleTonight`,
  `visibilityWindow` (human), `morningOrEvening`, `bestTimeIso`,
  `observingSummary`, `limitingFactors[]`;
- `status[]`: any of `normal`, `not_visible`, `above_horizon_all_day`,
  `below_horizon_all_day`, `no_rise`, `no_set`, `near_sun_glare`, `low_altitude`.

Plus `method`, `calculationNotes`, `accuracyNotes`, and the honesty envelope.
**No field without a source or calculation basis.**

## Visibility rules (conservative, documented)

A planet counts as **visibleTonight** only when, during the local **dark** window
(the Sun more than **6° below the horizon** — the end of civil twilight, so bright
dawn/dusk does not count), it reaches at least **10° altitude**
(`MIN_VISIBLE_ALTITUDE_DEG`), is more than **15° from the Sun**
(`MIN_ELONGATION_DEG`, else it is lost in glare), **and** is bright enough for the
naked eye (magnitude ≤ **6**, `NAKED_EYE_MAGNITUDE_LIMIT`). A well-placed but
too-faint planet (e.g. Neptune) is reported **not visible** with a
"needs binoculars or a telescope" limiting factor, rather than a bare "visible".
The **morning/evening** split uses **solar noon** (a civil day's two dark periods
are separated by daytime, not by midnight): up in the morning-half → `morning`;
the evening-half → `evening`; both → `all-night`. When a planet is not comfortably
visible, `limitingFactors` says why (below the horizon, in the Sun's glare, never
high enough, the sky never darkens, or too faint). These are conservative
approximations, not a guarantee — never overpromised.

## API endpoint

`GET /api/v0/live-sky/planets` — a **dynamic** handler.

- **Required:** `latitude`, `longitude`. **Optional:** `date` (defaults to today),
  `timezone` (IANA; defaults to UTC), `planet` (one of
  mercury|venus|mars|jupiter|saturn|uranus|neptune; default = the five naked-eye
  planets).
- Missing coordinates, out-of-range lat/lon, an invalid date, an invalid IANA
  timezone, or an unknown planet return a **structured `apiError` (HTTP 400)**.
- Standard Open Data envelope (`count` = number of planets). Registered in
  [`endpoints.ts`](../src/platform/open-data/endpoints.ts).
- **Reference time:** no `date` → positions at **now** (short window, stale-aware);
  explicit `date` → at **local noon** (immutable point value). **Cache:** immutable
  date `max-age=86400`; current `max-age=3600`.

## Edge cases — handled honestly

Never forced: a planet that does not rise or set on the local date → null event +
`no_rise`/`no_set`; **circumpolar** → `above_horizon_all_day`; **never up** →
`below_horizon_all_day` + not visible; **too close to the Sun** → `near_sun_glare`;
**never high enough** → `low_altitude`; the **Sun never sets** (polar summer) → a
limiting factor. Transit is reported only when the culmination genuinely falls in
the local day (hour angle ≈ 0). High latitude, the International Date Line
(UTC+13/+14, UTC−12), and DST transitions are handled by sampling the local day
directly with per-sample DST-correct offsets.

## UI

`/sky/planet-visibility` renders a **Planet Visibility calculator**
([`PlanetVisibilityPanel.tsx`](../src/components/sky/PlanetVisibilityPanel.tsx)):
explicit lat/lon/date/timezone inputs, an **honest empty state** (nothing shown
until you enter a location), a per-planet card (name, magnitude, a visible/not-
visible + morning/evening badge, an observing summary, rise/transit/set, current
altitude & compass direction, and limiting factors), an **Accuracy** card, the
real computed-at timestamp, the "deterministic calculation (not a live provider
feed)" label, a `role="alert"` structured error, and the privacy note. The page
emits a `SoftwareApplication` + `WebPage` + `BreadcrumbList` JSON-LD. `/sky`,
`/sky/night-sky-tonight`, and `/sky/observing-calendar` reference it honestly.

## Privacy

Location is only ever what the caller passes in — **never inferred, geolocated,
IP-located, stored, logged, or tracked**; no cookies. UI copy: *"Location is used
only for this calculation and is not stored."*

## Citations

- **JPL — Approximate Positions of the Planets** — `ssd.jpl.nasa.gov/planets/approx_pos.html`
  (the orbital elements; public domain).
- **USNO Astronomical Applications** — the Astronomical Almanac methodology and
  magnitude coefficients.
- **NASA — Planets** — `science.nasa.gov/planets/` (planet facts, a reference).

No DOIs or publication metadata invented; no copyrighted formula text quoted.

## Validation results

`npm run validate`, `tsc --noEmit`, `npm run lint`, and `npm run build` pass.
`validatePlanets()` checks invalid-input 400s, coordinate/elongation/magnitude/
distance ranges, horizon & visibility consistency (visibleTonight ⇔ a `normal`
status; below-all-day ⇒ null rise/set), the transit-is-a-culmination guard, polar
and date-line handling, and numeric anchors (Venus's 2025-01-01 elongation ≈ 47°;
Jupiter all-night). Runtime smoke covers Prague, Quito, Sydney, Tromsø,
Longyearbyen, UTC+14/−12, a single-planet query, and invalid planet/lat/lon/date/
timezone.

## Honest gaps (v1)

- **Computed, not provider-fetched** — clearly labelled.
- **Observing-guidance accuracy** (~0.1°, ~1–2 min, magnitude ±~0.3–0.5); Saturn's
  ring tilt is not modelled.
- The **visibility rules are conservative approximations** (fixed 10° / 15° / mag-6
  thresholds, "dark" = Sun more than 6° below the horizon), not a guarantee; a
  genuinely-visible bright planet low in bright twilight may be reported not
  visible (the conservative direction), and faint Uranus/Neptune are reported not
  naked-eye-visible with a note to use optical aid.
- **Constellation is not computed** in v1 (it needs IAU boundary data) and is
  deliberately omitted rather than guessed.
