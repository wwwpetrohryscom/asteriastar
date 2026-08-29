# Program CJ — Live space weather & solar activity

_The first genuinely live external scientific data on AsteriaStar. Two providers connected end-to-end, fifteen products, and an honesty model that makes a fabricated value structurally impossible to render._

## What changed, in one sentence

NOAA's Space Weather Prediction Center and NASA CCMC's DONKI are now **CONNECTED**: real measurements, with the provider's own timestamps, are fetched at request time and shown at `/space-weather` — and every claim elsewhere on the platform that said "no provider is connected" has been corrected, because it is no longer true.

## The live-provider runtime (`src/platform/live-providers/`)

A shared layer that Programs CK–CN build on rather than reinvent.

| Module | Responsibility |
| --- | --- |
| `envelope.ts` | The honesty model: `LiveDataStatus`, `LiveEnvelope`, `FreshnessPolicy`, `classifyFreshness`, `refreshStatus`. Pure and deterministic. |
| `fetch.ts` | The guarded fetch: HTTPS-only host allowlist, `redirect: "error"`, timeout, byte ceiling enforced **while streaming**, JSON-only parsing. Never throws. |
| `cache.ts` | Process-local operational cache. Nothing is written to disk or to git. |
| `health.ts` | Per-product request record for this runtime instance. No uptime percentage, no reliability score. |
| `normalise.ts` | Everything from a provider passes through here: bounded strings, control characters stripped, finite numbers only, zoneless timestamps read as UTC. |
| `registry.ts` | Provider descriptors and product definitions — terms, cadence, cache window, stale threshold, byte ceiling, verification date. |
| `client.ts` | `loadProduct()` — the single path from a provider to a page. Cannot fail; returns an envelope in every case. |

### The status vocabulary

`live · recent · delayed · forecast · computed · historical · stale · unavailable · provider_error`

**"Live" means an observation inside the provider's own publication cadence, and nothing else.** A six-hour-old reading is `delayed` or `stale`, and says so. `CURRENT_STATUSES` is the set a page may show in a "conditions now" position; `forecast`, `historical`, `stale`, `unavailable` and `provider_error` are excluded from it, and the gate checks that.

### Freshness is judged twice

Once on the server, and again in the browser. A rendered page is cached — by ISR, by a CDN, and by a tab left open overnight — so a status computed at render time is a claim about the past. `FreshnessWatch` (the only client component in this program) re-runs the *same pure function* against the browser clock every minute, so a reading that was live when generated correctly reads as delayed and then stale without a reload. It announces the change once, politely, and not on every tick.

### Freshness basis: observation vs fetch

A continuously-sampled measurement is aged by **the provider's newest timestamp** — an old newest-value means the feed has gone quiet. An *event feed* (alerts, flare catalogues) is aged by **our fetch time**, because "the newest alert is four days old" means four quiet days, not a broken provider. Reading it the other way round would mark a calm Sun as a system failure.

## Providers

### NOAA SWPC — connected, verified 2026-08-29

No API key, no scraping. Public-domain US Government work (17 U.S.C. §105); §403 asks that a work built predominantly on federal material identify it as such, which is what the provenance line on every value does.

Eleven products: real-time solar wind speed and IMF summaries; the propagated solar-wind series; observed Kp; the observed/estimated/predicted Kp forecast; the R/S/G scales; the watch/warning/alert stream; the GOES X-ray flare state; the daily active-region report; F10.7; and the OVATION aurora grid.

### NASA CCMC DONKI — connected, verified 2026-08-29

Through the **documented, key-less CCMC web service** (`kauai.ccmc.gsfc.nasa.gov/DONKI/WS/get/…`), which CCMC publishes on the DONKI page itself. The `api.nasa.gov` mirror of the same catalogue requires a key; the key-less documented service does not, so that is what is used.

CCMC states that DONKI's real-time contents *"should be considered only as prototyping quality and in research context"*. That caveat is carried on every page where DONKI events appear, and DONKI is never presented as an operational alert service — that role is SWPC's.

Four catalogues: flares, CMEs, geomagnetic storms, solar energetic particle events.

## What was deliberately NOT done

- **No composite "space weather score".** The agencies publish scales; a single number invented on top of them would be AsteriaStar's opinion wearing NOAA's authority.
- **No city-level aurora visibility.** OVATION gives a probability on a grid. Cloud, moonlight, light pollution and the observer's northern horizon are not in that dataset, and no weather provider is connected, so no claim is made about what anyone will see.
- **No operational time series in git.** The repository holds reviewed scientific data. Turning it into a store of solar-wind readings would weaken every guarantee it makes. The cache is in memory and retains a superseded value for at most six hours, purely so a failed refresh can show the last real value *marked stale*.
- **No uptime percentage or reliability score.** No operational history is retained, and a serverless instance may be seconds old.

## Pages

`/space-weather` (evergreen hub) · `/live` · `/solar-wind` · `/geomagnetic` · `/solar-activity` · `/aurora` · `/events`

Seven stable, evergreen URLs and **no query parameters at all** — there is no coordinate, date or provider parameter anywhere in the family, so there is nothing a crawler could expand into a combinatorial URL space. ISR windows match the products behind each page: 1 min (solar wind, current conditions), 5 min (hub, geomagnetic, solar activity), 10 min (aurora), 15 min (events).

A compact live strip was added to `/sky/space-weather`, `/heliophysics` and `/solar-physics`. It reads four small products, not eleven, and if all four fail it says so in one line and leaves the host page intact.

## API

| Endpoint | Contents |
| --- | --- |
| `GET /api/v0/live/space-weather` | All eleven SWPC products, each in its own envelope |
| `GET /api/v0/live/space-weather/solar` | X-ray state, active regions, F10.7, DONKI flares and CMEs |
| `GET /api/v0/live/space-weather/geomagnetic` | Kp observed and forecast, the scales, the alert stream |
| `GET /api/v0/live/space-weather/events` | The four DONKI catalogues |
| `GET /api/v0/live/providers` | Registry, terms, and this instance's real request record |

Each product is serialised with `status`, `stale`, `kind`, `fetchedAt`, `generatedAt`, `sourceUrl`, `cacheSeconds`, `staleAfterSeconds`, `provenance` and `limitations`. **A product that could not be read is present with a status and a reason and no `data` key at all** — there is deliberately nothing a consumer could mistake for a measurement of zero.

Every handler is `force-dynamic`. Without it a parameterless GET handler is prerendered at build time, and the endpoint would serve whatever the Sun was doing on deploy day.

## Cache policy

| Class | Window | Why |
| --- | --- | --- |
| Real-time L1 streams | 60 s | The spacecraft cadence is one minute; a shorter window cannot surface a value any sooner. |
| Kp, scales, alerts | 5 min | Kp is defined over three-hour intervals — two orders of magnitude coarser. |
| OVATION aurora | 10 min | ~1 MB, regenerated every 5 min for a forecast valid ~1 h ahead. |
| Daily products | 60 min | F10.7 and the region report are once-daily. |
| DONKI catalogues | 15 min | Analyst-curated; entries appear hours after the events they describe. |

Every window is shorter than its product's own stale threshold, and the gate enforces it: a cache may never outlive the validity of the data in it.

## Failure behaviour

A provider failure costs the reader a value. It may never give them a wrong one, and it may never take down the page.

- Refresh fails, a real earlier value is retained → shown **flagged stale and served-from-cache, with its original fetch time**, never restamped.
- Refresh fails, nothing retained → the envelope carries **no `data` at all**. There is nothing for a page to render.
- Provider answers with HTML, malformed JSON, or a shape the parser does not recognise → recorded as a **schema change**, not a transport failure, because the two mean different things: the provider is up and the integration is out of date.

## Gates

`npm run validate` now also runs:

- **`live:validate`** — 15 offline, deterministic invariants: the freshness ladder (executed, not inspected), future/unparseable timestamp rejection, re-ageing actually downgrading, cache windows shorter than stale thresholds, every product URL passing the fetch guard, no domain client calling `fetch` directly, no query parameters in the sitemap, no committed provider response, and the registry / live-sky / knowledge-graph views agreeing on who is connected.
- **`live:test`** — 40 failure-mode cases with a stubbed network: provider down, HTTP 503, HTML answer, malformed JSON, renamed field, oversized response, future timestamp, the stale-cache fallback, no-substitution, and seven unsafe URLs refused.

`npm run live:probe` is **not** in `validate`, deliberately: a gate that fails when a government website is briefly unreachable trains everyone to ignore it, and a build must never depend on a third party being up. It makes a real request to all fifteen products and is what earns a provider its `verifiedAt` date.

### One gate was rewritten rather than relaxed

`validate-entries.ts` contained a blanket rule: a catalogue record may not claim `connected`, *because nothing is connected in this build*. That premise expired the moment SWPC was connected. A gate whose premise can silently expire is worse than no gate — it either blocks honest work or, once relaxed, stops checking anything. It now checks what it was always for: a connection claim must be backed by a real client in the runtime **and** a recorded end-to-end verification. Typing the word into a data file is no longer enough.

## Data Health

`/authority/data-health/live-providers` (`noindex`, absent from the sitemap) **probes every provider as it renders** rather than reading a stored history, because there is no stored history to read. Descriptive columns come from the provider's documentation; operational columns are measurements taken by that request.

## Consistency corrections

Connecting a provider makes prior honest statements false. These were corrected in the same change: the live-sky provider registry, the live-data catalogue records, `buildStatusReport()`'s note (now **computed** from the counts rather than written by hand, so it cannot drift again), `/live`, `/live/data-status`, `/sky/space-weather`, `llms.txt`, the datasets registry, the endpoint registry, and the navigation model.
