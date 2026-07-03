# Tonight Observing Dashboard v1 (Program T)

Program T is **not a new astronomy program** — it is an **aggregation and
presentation** layer. It builds the first real *"What can I observe tonight?"*
dashboard by **composing the already-computed engines**: Sun & Twilight
(Program Q), Moon phase/rise/set/position (Programs P/R), and Planet Visibility
(Program S). It adds no new astronomical algorithms; it classifies the night,
ranks the planets with a documented score, and works out the Moon's impact —
honestly, with every limitation stated, and inventing **no** weather, cloud,
seeing, transparency, light-pollution, ISS, aurora, meteor, or comet data.

See also: [SUN_AND_TWILIGHT.md](./SUN_AND_TWILIGHT.md),
[MOONRISE_MOONSET_LUNAR_POSITION.md](./MOONRISE_MOONSET_LUNAR_POSITION.md),
[PLANET_VISIBILITY.md](./PLANET_VISIBILITY.md), [SKY.md](./SKY.md),
[OPEN_DATA.md](./OPEN_DATA.md).

## Method used
`method: "computed_composite"`, data status `computed`, envelope
`source ["noaa", "usno", "jpl"]` (the union of the three engines' sources) — not a
live provider feed. [`tonight.ts`](../src/platform/live-sky/tonight.ts) calls the
engine surfaces and only those:

```
engine.liveSky.sun.forLocationDate(...)      // Program Q
engine.liveSky.moon.forLocationDate(...)     // Programs P/R
engine.liveSky.planets.forLocationDate(...)  // Program S
```

It **does not** duplicate their calculations or read the raw calculators
(`solar-calculator`, `lunar-position`, `planetary-position`). The composition
correctness is enforced by `validateTonight()`, which asserts the dashboard's
sun/moon/planet figures equal the underlying engines'.

## Composed engines
Sun & Twilight, Moon (phase + position), and Planet Visibility — plus two small,
pure derivation helpers that consume their outputs:
[`observing-windows.ts`](../src/platform/live-sky/observing-windows.ts) (night
classification + Moon/dark-window overlap) and
[`observability-score.ts`](../src/platform/live-sky/observability-score.ts) (the
planet score + moonlight rule).

## Data fields
`input`, `referenceTimeIso`; `summary` (`observingDate`, `locationStatus`,
`darknessAvailable`, `darknessMinutes`, `nightType`, `bestOverallWindow`,
`limitations`); `sun` (sunrise/sunset/solarNoon, civil/nautical/astronomical
twilight, `daylightMinutes`, `darknessWindows`) or null; `moon` (`phaseName`,
`illuminationPercent`, moonrise/moonset/lunarTransit, current altitude/azimuth,
`moonlightImpact`, `limitations`) or null; `planets[]` (per planet: visible,
`bestTimeIso`, altitude/azimuth, magnitude, `limitingFactors`, `visibilityScore`);
`recommendations` (`topPlanets`, `bestMoonObservingWindow`, `bestDarkSkyWindow`,
`notAvailable`); `method`, `calculationNotes`, `accuracyNotes`, envelope. **No
field without a source or calculation basis.**

## API endpoint behaviour
`GET /api/v0/live-sky/tonight` — a **dynamic** handler. Required `latitude`,
`longitude`; optional `date` (defaults to today), `timezone` (IANA; defaults to
UTC). Missing coordinates, out-of-range lat/lon, an invalid date, or an invalid
IANA timezone return a **structured `apiError` (HTTP 400)**. Standard Open Data
envelope. Reference time = now (short window, stale-aware) for a current query,
else local noon of the requested date (immutable point value). Cache: immutable
date `max-age=86400`; current `max-age=3600`.

## Location / privacy model
Reuses the shared privacy-first `location.ts` — validated-only
latitude/longitude/date/IANA-timezone. It **never infers, guesses, geolocates,
IP-locates, stores, logs, or tracks** a location; no cookies. UI copy: *"Location
is used only for this calculation and is not stored."*

## Observability rules (deterministic, documented)
- **`nightType`** from the Sun's astronomical-darkness minutes (below −18°):
  `polar_day` / `polar_night` (from the Sun status), `no_darkness` (0 min dark),
  `short_night` (< 120 min dark), else `normal_night`.
- **`darknessAvailable`** = `darknessMinutes > 0`; `bestOverallWindow` = the
  astronomical-dark window (dusk → dawn, crossing midnight).
- **Moonlight impact** — `low` if illumination < 35% **or** the Moon is below the
  horizon during the dark window; `high` if > 70% **and** the Moon is up during
  it; else `moderate`; `unknown` if there is no dark window to assess against.
  The Moon/dark overlap is computed from the Moon's rise/set and the Sun's
  astronomical-dark window — no astronomy is recomputed.
- **Planet observability score (0–100)** — a documented weighting of three
  factors from the planet engine: altitude-in-darkness (0.5, saturating at 60°),
  brightness (0.3, magnitude +3→0, −5→1), and Sun elongation (0.2, saturating at
  90°). Only for planets the engine already reports visible. Planets are ranked by
  this score. **No hidden factors.**
- All rankings are **computed guidance, not a guarantee**, and deliberately
  exclude weather, cloud cover, seeing, transparency, and light pollution.

## Edge-case handling
Never forced: polar day → `no night`, no planets ranked, a stated limitation;
polar night → darkness present, planets rankable; no-astronomical-twilight
summers → `no_darkness`; a sub-engine failure → that section is **null** plus a
clear limitation (never fabricated or silently hidden). High latitude, the
International Date Line (UTC+13/+14, UTC−12), and DST transitions are inherited
correct from the sub-engines and the shared time helper.

## UI pages updated
`/sky/night-sky-tonight` is now a real **Tonight Observing Dashboard**
([`TonightDashboardPanel.tsx`](../src/components/sky/TonightDashboardPanel.tsx)):
explicit lat/lon/date/timezone inputs, an honest empty state, a summary card (night
type + darkness), a Sun & twilight table, a Moon card with a moonlight-impact
badge, a planet ranking with score bars, a "Best tonight" recommendations panel, a
**Limitations & not-included** panel (weather/cloud/seeing/ISS/aurora/meteors/
comets are explicitly *not* included), the source/method/timestamp footer, a
`role="alert"` structured error, and the privacy note. It emits a
`SoftwareApplication` + `WebPage` + `BreadcrumbList` JSON-LD. `/sky`,
`/sky/observing-calendar`, and each computed tool page (`/sky/sun`, `/sky/moon`,
`/sky/planet-visibility`, `/sky/twilight`) link to it honestly.

## Validation results
`npm run validate`, `tsc --noEmit`, `npm run lint`, and `npm run build` pass.
`validateTonight()` checks invalid-input 400s, the composite contract, night
classification and `darknessAvailable` consistency, the moonlight-impact enum and
its < 35% rule, planet score ranges and descending-order ranking (top planets are
all visible), **composition** (the dashboard's sun/moon/planet figures equal the
underlying engines'), and polar/date-line handling across Prague, Quito, Sydney,
Tromsø, Longyearbyen, and the date-line extremes. Runtime smoke covers those plus
invalid lat/lon/date/timezone and the page.

## Honest gaps (v1)
- **A composite, not new astronomy** — it inherits the sub-engines' accuracy
  (~1–2 min rise/set, ~0.1° positions, ±~0.3–0.5 mag) and their conservative
  visibility rules.
- **No weather, cloud, seeing, transparency, or light pollution** — the biggest
  real-world factors in whether you can actually observe are out of scope and are
  stated as such.
- **No ISS/satellite passes, aurora, meteor showers, or comets** — deliberately
  excluded rather than faked.
- The observing night is the **continuous dusk→dawn** window that begins on the
  requested date's evening: it composes the next day's Sun and Moon to close the
  window at the following morning's astronomical dawn, so the moonless-dark figure
  and moonlight impact describe exactly the window shown. `darknessMinutes` and
  `nightType` are from the requested date's durations (≈ the same night length).
