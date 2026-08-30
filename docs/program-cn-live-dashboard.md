# Program CN — Live Astronomy Dashboard & Personal Observing Intelligence

The last of the five live programs, and the one where they meet: a dashboard that answers *what is
happening right now*, and a planner that answers *what is worth going outside for tonight* — without
ever learning where the reader is.

## What was built

| Route | What it is |
| --- | --- |
| `/live` | The operational board: the current value from every connected domain, then the provider catalogue behind them |
| `/live/tonight` | A personal observing plan for coordinates the reader types, computed in their browser |
| `/live/space-weather` | The solar wind, Bz and Kp right now — and the one thing they decide for an observer |
| `/live/neo` | What is passing and what is watched, with the honest note that none of it is a sight |
| `/live/satellites` | Where the Space Station is this second |
| `/live/events` | The dated events of the next seven days |

`/live` already existed as a catalogue of providers. It answered *who do you get data from* and never
*what does it say*, so it now answers the second question first and keeps the catalogue below —
because a reader deciding how much to trust a number should be one scroll from its licence and its
failure record.

The five `/live/*` segments resolve before `/live/[slug]`, the provider pages, and no provider slug
collides with one. The gate checks that on every build, because a collision would make a provider's
page disappear with no error anywhere.

## The privacy architecture, and what it cost to make true

The promise is that the observer's location is used in their own browser and never reaches this site.
Program CL established it for ISS passes. CN extends it to everything.

`tonight.forLocationDate` — the composition of the Sun, Moon and planet engines behind the existing
dashboard — is a pure function with no framework imports, so it runs unchanged in a browser. The
server component fetches only what is identical for every reader on Earth (a window of NASA's ISS
state vectors, the planetary K index, the week's events) and the island does the rest.

**Writing the gate found that five existing pages did not honour the promise at all.** The Sun, Moon,
Moon-position, planet-visibility and Tonight panels each posted the reader's coordinates to
`/api/v0/live-sky/*` **in a query string** — which puts an observing location in every access log
between the browser and the server, and, because those responses were `public, max-age=86400`, in a
CDN keyed by it. All five now compute in the browser. The four routes that take coordinates are
`private, no-store`; the global Moon phase, which takes none, is still publicly cacheable. The
website no longer calls any of them, and they remain for people writing their own software.

The cost of shipping an astronomy engine to the browser turned out to be about 48 KB uncompressed
over the page that already ships the pass calculator. That is the entire price of the guarantee.

## The weather investigation

The roadmap asked for a weather provider only if one could be used legally and honestly. Two were
evaluated:

**Open-Meteo — refused.** Technically ideal: global, free, no key, cloud cover at three levels. Its
free tier is licensed for **non-commercial use only** ("private or non-profit websites or apps that
do not have subscriptions or advertising"). Whether this platform qualifies is not a judgement this
code is entitled to make, so it is not made.

**MET Norway — connected.** The Norwegian Meteorological Institute publishes a global forecast under
NLOD 2.0 and CC BY 4.0 with **no non-commercial restriction**, no key, and terms that explicitly
contemplate cross-origin requests from a browser. Verified end-to-end by `npm run live:probe`.

Three things make the integration defensible:

- **It is cloud cover and nothing else.** `cloud_area_fraction` is a general meteorological forecast
  of total cloud. It is not astronomical seeing, which is turbulence forecast from entirely different
  model output; it is not transparency; it is not sky brightness. A clear forecast and terrible
  seeing are an ordinary combination. Nothing derives those quantities, and the gate refuses to let
  the module assign anything by their names.
- **It is separate from the verdict.** The deep-sky band is derived from darkness and moonlight only.
  Cloud is reported alongside it and never folded in — a clear sky does not make a full Moon dark, and
  an overcast one does not change the geometry. The gate reads the band's function body, with string
  literals stripped, and fails if it touches a cloud value.
- **It runs in the reader's browser, on an explicit press.** The coordinates go to the institute and
  to nobody else, this platform included. They are rounded to two decimals — about a kilometre, far
  finer than cloud cover resolves and deliberately coarser than the reader typed — and the exact URL
  is printed on the page before and after. No forecast is fetched for a reader who does not ask.

This is the only provider on the platform with `runtime: "browser"`, a field added for it. A browser
provider has no entry in `LIVE_PRODUCTS` because there is no server product to load; the guards the
server loader supplies — constant host, byte ceiling, abort timeout, opaque failure string — are
rebuilt in its own client, and the gate refuses a provider that has neither products nor a declared
browser runtime, so "no products" can never be the silent result of forgetting to register one.

Seeing, transparency and sky brightness remain unconnected, and the catalogue record says so in the
same breath as it says cloud cover is connected.

## The observing plan

A composition, and nothing more. The darkness windows, the Moon and the ranked planets all come from
engines that already existed; the plan turns them into the sentences an observer acts on.

The deep-sky verdict is a **band with stated criteria**, not a score. A number out of a hundred for
"how good is tonight" would be an authoritative-looking summary of a judgement nobody made, and would
silently absorb everything missing. The band comes from exactly two inputs — how much astronomical
darkness there is, and how much of it the Moon spoils — and every rendering says so.

What it does not know is listed on the page, not buried: seeing, transparency, light pollution, and
the reader's own horizon. When no forecast has been requested, cloud cover is on that list too, and
it leaves the list only when a real forecast has arrived.

Aurora is handled the way Program CJ established: the current Kp is stated, and whether it reaches a
particular sky is not. Geomagnetic latitude is not geographic latitude, and NOAA publishes the
viewline.

## The gate

`npm run observing:validate`, in `validate` and in every build. It exists because an architectural
promise decays the moment somebody adds a convenient server call, and a promise written in a
paragraph cannot notice.

- No `navigator.geolocation`, `localStorage`, `sessionStorage`, `indexedDB`, `document.cookie`, or IP
  lookup anywhere in the observing surfaces — with comments stripped first, so a rule can be
  *described* in the file it governs.
- No `fetch(` from any observing client component except the sanctioned cloud forecast.
- No coordinate-bearing response cached in a shared cache.
- No dashboard slug colliding with a provider slug.
- Cloud cover never renamed; the unit check on the provider's own published units still present;
  coordinates still rounded before they are sent.
- An observing plan built for five locations from the pole to the equator, each of which must state
  its exclusions and must not claim a dark-sky band where there is no darkness.

Two of its rules were verified by reintroducing the defect they exist for, rather than by assuming
they work.

## Adversarial review (independently verified, fixed before merge)

Two independent reviews ran against the finished branch — one on privacy, security and failure
behaviour, one on honesty, the weather boundary, duplication and accessibility. Between them they
found twenty findings, and **four of them were defeats of the gate this program had just written**,
which is the most useful thing either of them did.

### The gate was wrong in four ways, and each was demonstrated

- **The cache rule was a substring test, not a test of a response.** It searched each route file for
  the string `private, no-store`. The Moon route contained that string — in a branch that could never
  execute, because the guard above it returns first whenever coordinates are supplied. So the
  location-aware Moon response went on being served `public, max-age=86400` while the gate reported
  success and every reading of the diff saw the right words. The reviewer proved the rule vacuous by
  reverting a route to `public` and leaving the phrase in a comment: the gate passed. The policy is
  now a single shared function, `locationCacheControl`, which the gate executes and which all four
  routes must call — one place to get right, one place to test, and a rule that fails if a route
  writes a policy of its own.
- **The outbound-call rule exempted a whole file, and the file it exempted was the one holding the
  reader's coordinates.** Because `TonightPlanner.tsx` imports `fetchCloudForecast`, *every* `fetch(`
  in it was permitted forever. A `fetch` to a collector, injected there, passed. The exemption is now
  for the sanctioned call, which is excised from the text before the search runs.
- **It only knew about `fetch`.** `navigator.sendBeacon` — precisely the "sent to analytics" case the
  promise names — passed, as did an image beacon, `XMLHttpRequest`, `WebSocket`, `EventSource` and a
  dynamic `import()` from a URL. All are covered now.
- **It was scoped to five hand-listed directories.** A client component in a sixth, combining a
  `localStorage` write, a third-party fetch and `getCurrentPosition`, passed cleanly. It now scans
  every file under `src/`. Widening it that far required scoping the *persistence* rules to files
  that actually handle coordinates — the Workspace deliberately keeps notes in `localStorage`, and
  that is its whole point — and stripping string literals, so that a page describing the Workspace's
  storage in one paragraph and observing coordinates in another does not trip a rule about doing
  both.
- And **the route rule could not fire at all**: it tested a five-element array of plain words for `?`
  and `&`, which a route segment can never contain. A real `/live/tonight/[lat]/[lon]/page.tsx`
  reading coordinates out of the path passed it. It now walks the route tree on disk.

All seven attacks were replayed against the rewritten gate and all seven are caught.

### Real defects behind the gate

The location-aware Moon response was **cached publicly for a day**, keyed on a URL containing the
observer's coordinates — the exact retention the code's own comment claimed to prevent, in the one
route of four where the fix had landed in dead code.

The four migrated panels still rendered a "Programmatic access" **link** built from the coordinates
the reader had just typed. Nothing fired it automatically, but it was one click from doing precisely
what the migration was for — and combined with the Moon defect, that click parked a location in a
shared cache for a day. They are now templates with placeholders.

The MET client's byte ceiling was applied **after** the whole body was in memory, and the comment
claimed the opposite. Measured: against a server streaming as fast as the client drained, resident
memory went from 71 MB to 869 MB before the timeout ended it; a single 286 MB body reached 1.4 GB.
The real bound was the timeout multiplied by the bandwidth. The body is now read with a running byte
count and abandoned the moment it exceeds the cap.

The unit guard **failed open on exactly the scenario it was written for**. It fired only when the
unit was present and wrong, so a response that dropped or relocated the `units` block — the same kind
of change that would alter the unit — sailed through, and 90 % overcast expressed as a fraction
rendered as *"Mostly clear in the forecast"*. An absent declaration is now a refusal.

A successful cloud fetch could **vanish silently**: for any date beyond MET's nine-day horizon the
summary was undefined, the section collapsed to a bare heading, and cloud quietly left the list of
things the plan does not know — after the reader's coordinates had already been sent. It now says
which, and puts cloud back on the list.

### Claims that outran the code, again

The Tonight page said *"There is no request to send it anywhere"* ninety lines above a button that
makes one. **Eight surfaces still said no weather provider was connected**, including a discovery
page rendering "Awaiting a licence-safe open provider" directly above a card reading "Atmospheric
Conditions — Connected", and a navigation description shown on every page of the site. The reviewer's
observation about this is the important one: the gate had been written to guard the observing
surfaces and would have caught none of them, because they live in blurbs, a nav string, an aurora
page and `llms.txt`.

So the rule was inverted rather than extended. Instead of listing the places to check — the same
mistake in a different form — it takes the phrases that *claim absence* and forbids them across the
whole source tree for as long as `met-norway` is actually `IMPLEMENTED`. Disconnect the provider and
the phrases become legal again, automatically. It found a ninth surface the reviewer had missed.

### Smaller fixes

`Math.min(...points)` throws past a couple of hundred thousand arguments and was kept safe only by an
undocumented coupling to a byte limit in another function — now a reduce. An unparseable provider
timestamp reached the attribution line and printed `Invalid Date`. The MET request now sends
`referrerPolicy: "no-referrer"`, because the page prints the exact request so that what was sent is
never a matter of trust, and the referrer was part of what was sent. `/live/tonight` skipped from
`h1` to `h3`; the cloud result had no live region while its failure did, which is the wrong way round
to be inconsistent; a rejected date marked no field invalid; and `/sky/night-sky-tonight` mentioned
its counterpart in plain text rather than linking to it.

### Verified clean, and worth recording

No coordinate reaches AsteriaStar or any third party but MET Norway — checked by grepping every
client component in the repository for every network and storage primitive, and by inspecting the
built client chunks. The form has no `action`, no `method` and no named inputs, so a submit before
hydration serialises nothing. `metForecastUrl` cannot be steered off `api.met.no` with any input,
including `NaN` and `1e308`. The timeout is real, measured at 6,005 ms against a server that goes
silent. Every one of the six new routes rendered without throwing under three provider failure modes
— eighteen of eighteen. And the migration is faithful: `sun`, `moon` and `planets` are **byte-identical**
to the API responses they replaced across eleven cases including polar, equatorial and invalid input,
with all five error strings preserved.
