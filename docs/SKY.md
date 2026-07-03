# Live Sky & Observatory Platform (Program J)

Program J turns Asteria Star from a static encyclopedia into the foundation of a
daily-use astronomy platform — **without fabricating any live data**. The Live
Sky layer is a set of typed data *clients* built on top of the Knowledge Graph
and the Scientific Data Engine. Static knowledge remains the foundation; the sky
modules sit on top of it.

## The honesty principle

The single most important rule is that the platform never invents current sky
conditions, positions, visibility, ISS locations, solar activity, forecasts, or
eclipse dates. Every datum carries a **`SkyEnvelope`** recording its status,
source, timestamps, confidence, staleness, provenance, and licensing. There are,
deliberately, **no connected live providers yet**. Data is one of:

- **`reference`** — timeless, source-backed facts (e.g. the annual meteor-shower
  parameters from the IMO, the Moon's phases, the Kp scale, the A–X flare
  classes). Carries a fixed compilation date, never "now".
- **`prepared`** — architecture ready for a named provider, with **no values
  shown** and **no timestamp**. Pages display a clear "prepared for integration"
  panel naming the provider that would supply the data.
- **`computed`** *(added in Program P)* — a deterministic, source-backed
  **calculation**, timestamped and stale-aware, and clearly **not** a live
  provider feed. The first such datum is the current Moon phase and illumination
  (see [NIGHT_SKY_PROVIDER_INTEGRATION.md](./NIGHT_SKY_PROVIDER_INTEGRATION.md)).
  Program Q extends this to the first **location-aware** computed feature —
  sunrise, sunset, solar noon, and civil/nautical/astronomical twilight for an
  explicit latitude/longitude/date — on a privacy-first location model that never
  guesses, geolocates, or stores a location (see
  [SUN_AND_TWILIGHT.md](./SUN_AND_TWILIGHT.md)). Program R adds location-aware
  **moonrise, moonset, transit, and the Moon's position** (altitude, azimuth,
  distance), reusing that location model and extending the Moon endpoint without
  breaking its phase-only behaviour (see
  [MOONRISE_MOONSET_LUNAR_POSITION.md](./MOONRISE_MOONSET_LUNAR_POSITION.md)).
  Program S adds computed, location-aware **naked-eye planet visibility** — rise,
  set, transit, position, approximate magnitude, and conservative observing rules
  from public-domain NASA/JPL planetary elements (see
  [PLANET_VISIBILITY.md](./PLANET_VISIBILITY.md)). Program T composes the Sun,
  Moon, and Planet engines into the **Tonight Observing Dashboard** — a
  `computed_composite` that classifies the night, ranks the planets, and rates
  moonlight, inventing no weather or event data (see
  [TONIGHT_OBSERVING_DASHBOARD.md](./TONIGHT_OBSERVING_DASHBOARD.md)).

The `live` status still describes **no datum** — no live provider is connected.
`computed` readings are stale-aware: the current Moon reading flips to `stale`
once it is past its validity window. The `stale` status exists in the schema from
day one, and the validator still enforces that nothing is ever falsely marked
`live`.

## The platform layer — `src/platform/live-sky/`

- `schema.ts` — `SkyEnvelope`, `DataStatus`, `ProviderKey`, `Enveloped<T>`, and
  the `reference`/`prepared`/`withStaleness` envelope builders.
- `providers.ts` — typed provider interfaces (Ephemeris, Eclipse, SmallBody,
  Satellite, SpaceWeather) plus a registry of 9 providers (JPL Horizons, USNO,
  NASA DONKI, NOAA SWPC, CelesTrak, Minor Planet Center, IMO, NASA APIs, NASA
  eclipse predictions) — all `planned`, none connected, no paid or scraped APIs.
- `models.ts` — typed models for moon phase, rise/set, planet visibility, meteor
  showers, eclipses, comets, asteroid close approaches, ISS passes, aurora,
  solar flares, geomagnetic storms, alerts, observing events, location,
  timezone, and an observer-profile placeholder. Each links to graph entity ids.
- `moon.ts`, `planets.ts`, `meteorShowers.ts`, `eclipses.ts`, `comets.ts`,
  `asteroids.ts`, `iss.ts`, `aurora.ts`, `spaceWeather.ts`, `observingCalendar.ts`
  — the domain modules: reference facts plus honest `prepared` states.
- `validation.ts` — `validateLiveSky()`, the honesty gate.
- `index.ts` — assembly, the `SKY_PAGES` registry, stats, and the `liveSky` surface.

Exposed through the Scientific Data Engine as **`engine.liveSky`** (the 26th
module), which resolves the graph entity ids that live-sky records reference into
renderable `{id, name, href}` refs.

## Seeded data (safe, timeless, source-backed)

The one dataset it is safe to seed is the **eight major annual meteor showers**
(Quadrantids, Lyrids, Eta Aquariids, Perseids, Orionids, Leonids, Geminids,
Taurids), with activity windows, peak nights, ZHR, entry speed, radiant, and
parent body from the IMO Meteor Shower Calendar working list. ZHR is an
ideal-condition maximum, not a live count; peaks are annual, not a specific
year's date. Six of the eight already exist as `meteor_shower:*` graph entities
and are **reused**; all link to their radiant constellation and, where an entity
exists, their parent comet/asteroid.

## Knowledge Graph integration (no orphan live data)

Every sky module links to real graph entities: the Moon (`moon:the-moon`), the
Sun (`star:sun`), Earth (`planet:earth`), the planets, the ISS
(`satellite:international-space-station`), notable comets and asteroids, meteor
showers, and their radiant constellations. `validateLiveSky()` verifies that
every linked id resolves — nothing live is isolated.

## Pages (`/sky`)

- `/sky` — the platform hub: modules, meteor-shower previews, and the provider
  architecture.
- `/sky/{slug}` — eight reference/prepared modules (night-sky-tonight, moon,
  planet-visibility, comets, asteroid-close-approaches, iss-tracker, aurora,
  observing-calendar).
- `/sky/meteor-showers` and `/sky/meteor-showers/{slug}` — the meteor-shower guide.
- `/sky/eclipses`, `/sky/eclipses/solar`, `/sky/eclipses/lunar` — eclipse guides + safety.
- `/sky/space-weather`, `/sky/space-weather/solar-flares`, `/sky/space-weather/geomagnetic-storms`.
- `/sky/events`, `/sky/this-month` — the observing year and a planning aid.
- `/timelines` is unchanged; the observing year is a perennial guide, not a dated timeline.

Every page shows a data-status badge, a "prepared for integration" panel where
applicable, source labels, and an honest location placeholder — no fake live
widgets, and titles avoid implying live data exists before it does.

## Validation

`validateLiveSky()` checks: no orphan links (every graph id resolves), every
meteor shower connects to at least one entity, reference envelopes carry a
compilation date, **prepared data has null values and no timestamp** (no fake
"live now"), and **no datum is falsely marked `live`/`stale`** while no provider
is connected. The layer passes the standard architecture, engine, graph, build,
lint, and link gates.
