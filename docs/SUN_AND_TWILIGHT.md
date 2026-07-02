# Sun & Twilight v1 (Program Q)

Program Q adds the platform's **first location-aware computed sky feature**:
deterministic **sunrise, sunset, solar noon, day length, and civil / nautical /
astronomical twilight** for any explicit location and date — **without a paid
API, without scraping, without ever guessing, geolocating, IP-locating, or
storing the user's location, and without calling a computed value "live"**.

It also introduces the **privacy-first explicit location model** that future
location-aware features (moonrise/moonset, planet visibility, ISS passes) will
reuse.

See also: [SKY.md](./SKY.md), [NIGHT_SKY_PROVIDER_INTEGRATION.md](./NIGHT_SKY_PROVIDER_INTEGRATION.md)
(the computed-Moon precedent), [OPEN_DATA.md](./OPEN_DATA.md),
[LICENSING_POLICY.md](./LICENSING_POLICY.md).

## Method: computed, not fetched

The times are a **deterministic calculation** labelled `method: "computed"` and
data status `computed` — explicitly **not** a live provider feed. The algorithm
is the public-domain **NOAA Solar Calculator** (NOAA Global Monitoring
Laboratory), which implements the low-precision solar formulae of the
**Astronomical Almanac** (US Naval Observatory / HM Nautical Almanac Office). The
envelope `source` is `["noaa", "usno"]` — both genuinely underpin the math (NOAA
publishes the calculator; USNO/HMNAO publishes the formulae's origin and is the
platform's designated Sun/Moon rise-set authority).

Implemented in [`providers/solar-calculator.ts`](../src/platform/live-sky/providers/solar-calculator.ts):

- Solar **declination** `δ` and the **equation of time** from the NOAA series
  (geometric mean longitude, mean anomaly, equation of centre, obliquity).
- **Solar noon** (UTC) `= 720 − 4·longitude − eqTime`, refined once at noon.
- **Hour angle** for an event at Sun altitude `h0`:
  `cos H = (sin h0 − sinφ·sinδ) / (cosφ·cosδ)`. A value outside `[−1, 1]` means
  that altitude is never crossed that day (the basis of honest polar handling).
- Altitude thresholds: **−0.833°** for sunrise/sunset (34′ refraction + 16′
  semidiameter), **−6° / −12° / −18°** for civil / nautical / astronomical
  twilight.

**Accuracy** ~1 minute for years 1901–2099. It models the Sun's centre at a
flat, sea-level horizon; local refraction, horizon height, and terrain are not
modelled. Validated against known city values (Prague, Quito, New York, Sydney,
Reykjavik, Tromsø, Longyearbyen) in CI.

## Privacy-first location model

[`location.ts`](../src/platform/live-sky/location.ts) is the explicit,
validated-only location model:

- **Inputs:** `latitude` (−90..90), `longitude` (−180..180), `date`
  (YYYY-MM-DD / ISO, years 1901–2099), and an optional **IANA `timezone`**.
- **Never** infers, geolocates, IP-locates, stores, logs, or tracks a location.
  Coordinates exist only in the query for one request.
- **Timezone** is validated with `Intl` and resolved to a DST-correct offset
  deterministically (`timezoneOffsetMinutes` via `Intl.DateTimeFormat`); when
  omitted, times are **UTC** (documented, not guessed).
- UI copy states: *"Location is used only for this calculation and is not
  stored."*

## The data contract

Every response (see `SunData` in [`models.ts`](../src/platform/live-sky/models.ts)):

| Field | Meaning |
| --- | --- |
| `objectEntityId` | `star:sun` |
| `input` | echoed `latitude`, `longitude`, `date`, resolved `timezone`, `utcOffsetMinutes` |
| `events.*` | `sunrise`, `sunset`, `solarNoon`, `civilDawn/Dusk`, `nauticalDawn/Dusk`, `astronomicalDawn/Dusk` — each `{ iso (UTC), local (HH:mm) }`, **null where the event does not occur** |
| `duration` | `daylightMinutes`, `civilTwilightMinutes`, `nauticalTwilightMinutes`, `astronomicalTwilightMinutes` |
| `solar` | `declinationDeg`, `equationOfTimeMinutes`, `noonElevationDeg` |
| `status` | `["normal"]`, or `polar_day` / `polar_night` / `no_civil_twilight` / `no_nautical_twilight` / `no_astronomical_twilight` as applicable |
| `method` | `"computed"` |
| `calculationNotes` | formula basis, horizon convention, accuracy caveat |
| envelope | status `computed`, real `generatedAt`, `validFrom`/`validUntil` (the civil date), `source ["noaa","usno"]`, `confidence modeled`, `stale false`, provenance, licenseNotes |

**No field without a source or calculation basis.**

## Polar & high-latitude handling

Handled honestly — never forced:

- **polar_day** — the Sun never sinks to −0.833° (`cos H < −1`): `sunrise`/
  `sunset` are **null**, `daylightMinutes = 1440`.
- **polar_night** — the Sun never rises to −0.833° (`cos H > 1`): `sunrise`/
  `sunset` are **null**, `daylightMinutes = 0`. A real **midday** nautical/
  astronomical dawn/dusk is still reported when the Sun briefly clears that
  depression (e.g. Longyearbyen in December).
- **no_civil / no_nautical / no_astronomical_twilight** — the Sun never sinks
  below −6 / −12 / −18° (high-latitude "white nights", e.g. Reykjavik at the
  solstice): the corresponding boundary events are **null** and the condition is
  flagged.

Durations use `minutesAboveThreshold`, which returns the correct 0 / 1440 for the
never-crossed cases, so day length and twilight totals are always well-defined.

## API endpoint

`GET /api/v0/live-sky/sun` — a **dynamic** route
([`route.ts`](../src/app/api/v0/live-sky/sun/route.ts)).

- **Required:** `latitude`, `longitude`. **Optional:** `date` (defaults to today,
  UTC), `timezone` (IANA; defaults to UTC).
- Missing coordinates, out-of-range lat/lon, an invalid date, or an invalid IANA
  timezone return a **structured `apiError` (HTTP 400)** — never guessed values.
- Response uses the standard Open Data envelope; registered in
  [`endpoints.ts`](../src/platform/open-data/endpoints.ts) and surfaced on
  `/developers` and in `/api/v0/openapi.json`.
- **Cache:** deterministic and immutable for a given date + location →
  `Cache-Control: public, max-age=86400, stale-while-revalidate=86400`;
  `stale` is always `false` (a fixed date's times never decay).

## UI

- [`/sky/sun`](../src/app/sky/[slug]/page.tsx) and `/sky/twilight` render a real
  **Sun & Twilight calculator**
  ([`SunCalculatorPanel.tsx`](../src/components/sky/SunCalculatorPanel.tsx)):
  explicit lat/lon/date/timezone inputs, an **honest empty state** (nothing shown
  until you enter a location), a structured error on failure (no fabricated
  value), a results grid (sunrise/sunset/solar noon/day length), a twilight
  table, a solar summary, polar/no-twilight messages, the real computed-at
  timestamp, the source, the method label *"deterministic calculation (not a live
  provider feed)"*, and the privacy note.
- **No browser geolocation, no IP lookup, no stored location.** The timezone
  field is pre-filled from the browser's own IANA zone purely as an editable
  convenience default; nothing is submitted until you press **Calculate**.
- `/sky`, `/sky/night-sky-tonight`, and `/sky/observing-calendar` reference the
  Sun & Twilight page honestly.

## SEO

Titles/leads use careful wording — *"Sun & Twilight Calculator"*,
*"source-backed computed solar times"*, *"privacy-first location-aware sky
data"*. No *"live sunrise now"* claim, no fake local snippets, no fabricated
location pages. Each page carries a canonical URL, `BreadcrumbList`, `WebPage`,
and a `SoftwareApplication` JSON-LD, related sky pages, related entities, and
source/provenance notes.

## Citations

- **NOAA Solar Calculator** — `https://gml.noaa.gov/grad/solcalc/` (the algorithm).
- **USNO Astronomical Applications** — `https://aa.usno.navy.mil/` (the formulae's
  Almanac origin; rise/set/twilight authority).
- **NASA — The Sun** — `https://science.nasa.gov/sun/` (Sun facts, a reference).

No DOIs or publication metadata are invented.

## Validation results

`npm run validate`, `tsc --noEmit`, `npm run lint`, and `npm run build` all pass.
`validateSun()` checks lat/lon bounds, date parsing, IANA validation, event
ordering, durations, polar day/night + null handling, the method/source/stale
fields, the envelope, invalid-input 400s, and a numeric anchor (New York solstice
sunrise), across eight city/date fixtures. Runtime smoke tests confirm the
endpoint (Prague, Quito, polar day, polar night, and the four 400 cases) and the
`/sky/sun` + `/sky/twilight` pages.

## Honest gaps (v1)

- **Computed, not provider-fetched** — clearly labelled as such.
- **~1-minute accuracy**, flat sea-level horizon — no terrain, elevation, or
  local-refraction modelling.
- **Moonrise/moonset are still not available** — they need this location model
  plus a lunar rise/set computation (a natural Program R).
- The `date` is interpreted as the civil date at the location; near the
  international date line the UTC/local date can differ, though the UTC instants
  remain correct.
