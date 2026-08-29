# Program CK — Near-Earth objects & planetary defence

_Live close approaches, impact-risk monitoring, new discoveries and unconfirmed candidates — from NASA/JPL and the IAU Minor Planet Center, with every hazard figure the issuing agency's own._

## What changed

Two more providers connected end-to-end, taking the platform to **four providers and 19 products**, and a new `/neo` section built on them. `npm run live:probe` returns **19/19 with usable, correctly-labelled data**.

### NASA/JPL SSD & CNEOS — connected, verified 2026-08-29

Close approaches (`cad.api`), the Sentry impact-risk table (`sentry.api`), and recent database entries (`sbdb_query.api`). No key.

JPL's Fair Use Policy shaped the architecture rather than being noted and ignored:

- **"You agree to submit only one API request at a time (no simultaneous requests)."** The service composes products with `Promise.all` because that is the natural shape; the loader now enforces a **per-provider concurrency gate**, and JPL's is one. A caller cannot violate the term by forgetting it.
- **"Automated processes must... back off or reducing request rates" on errors.** After three consecutive failures a provider is left alone for a cool-down, returning whatever is cached — honestly stale — or nothing. This also removes the request-storm risk a serverless deployment otherwise has, where every cold instance retries independently.
- **"You may not embed these APIs in your website (per NASA CORS policy)."** No browser on this site ever contacts `ssd-api.jpl.nasa.gov`. Every request is server-side and the result is re-served from AsteriaStar's own origin, cached and attributed — which is also what the Fair Use Policy asks for.

### IAU Minor Planet Center — connected, verified 2026-08-29

The **NEO Confirmation Page** as published JSON, ~6 KB. Not scraped: the MPC publishes this file for machine consumption. Its bulk orbit files are not ingested.

The provider's own caveat travels with every entry: these are **candidates, not discoveries**. One may prove to be an already-known object, not near-Earth at all, or an artefact, and most leave the page within days.

## Three semantics that are easy to get wrong, and are not

**Close-approach times are TDB, not UTC.** JPL computes in barycentric dynamical time, currently ~69 seconds ahead of UTC. AsteriaStar labels them TDB and does **not** convert: at the one-minute resolution these are published, a conversion would imply a precision the source does not claim. The probe asserts that no TDB string ever carries a zone designator, because appending `Z` would silently assert UTC.

**A nominal distance is a prediction with error bars.** Every approach carries the provider's 3-sigma minimum and maximum alongside its nominal distance, and the 3-sigma uncertainty in the approach time. For a well-observed object the range is a rounding error; for one found last week it can span an order of magnitude. The probe asserts the nominal value lies inside its own bracket.

**A size is almost never measured.** Absolute magnitude is a brightness; converting it to a diameter requires assuming an albedo, and plausible albedos span a factor of five. So a size is either a real measurement or a **range** with the assumption stated — `D = 1329/√albedo × 10^(−H/5)` across albedo 0.25–0.05, the same pair CNEOS uses. A size filter *excludes* objects with no published size rather than assuming them small.

## Graph reconciliation: what a live record is not

A live provider record is **never silently minted into a permanent entity**. It either matches something catalogued — and says what it matched on, a designation or a name — or it is shown as a provider record labelled *not yet catalogued in AsteriaStar*.

The match is made against the committed JPL Small-Body Database snapshot, the one place in the repository that already carries both a JPL identifier and an AsteriaStar entity id. Of the objects currently approaching, essentially none match, and that is the correct answer: CNEOS tracks every object whose orbit is known well enough to project, and most are metres-wide rocks with provisional designations that will never warrant an entry. `/neo/objects` shows that ratio plainly rather than padding the catalogue or hiding the records.

## Tone

No impact probability is computed anywhere in this program. Sentry publishes them, with JPL's own statement that they "can easily be inaccurate by a factor of a few, and occasionally by a factor of ten or more", and that caveat appears wherever the numbers do. Nothing is called dangerous unless a published scale says so, and the scales are quoted as they define themselves — Palermo −2 is the threshold the scale itself calls no cause for public concern.

Objects **leave** the Sentry table, and the pages say so: more observations shrink an orbit's uncertainty until every possible impact falls outside it. A disappearance is the system working, not data going missing.

Close approaches are described by distance and uncertainty, never by an adjective. Ten lunar distances is four million kilometres, and the word for that is routine.

## Surface

`/neo` · `close-approaches` · `objects` · `risk` · `recently-discovered` · `planetary-defense`

Six stable URLs, **no query parameters**. The close-approach filters (distance, size, catalogued, monitored) run **in the browser** over data the server already rendered — a filtered view as `?dist=1&pha=true` would multiply one honest page into a combinatorial space of near-identical crawlable URLs whose content changes hourly. The server renders the full unfiltered table first, so a reader without JavaScript gets every row.

`/neo/planetary-defense` is the *operational* view and deliberately does not restate the existing `/planetary-defense` encyclopedia — two accounts of one subject drift apart.

### API

`GET /api/v0/live/neo` · `/close-approaches` · `/{designation}`

The designation endpoint **does not proxy the provider**. No value from a request is ever placed into a provider URL — that is the rule the fetch guard exists to enforce and it is not weakened for convenience. The four feeds are loaded from their own constant URLs and the designation is matched locally, so a "not found" means *absent from these four feeds*, not *unknown to JPL* — and the response says exactly that.

## Gates

`live:validate` grew to **20 invariants**, now covering every route family rather than only space weather, and asserting that each provider declares a concurrency limit and a failure back-off — terms of use, not tuning values. `live:test` grew to **52 cases**, adding: a single-request provider is never asked twice at once, and a failing provider is backed off rather than stormed. `live:probe` adds NEO semantic checks a shape check cannot see — TDB strings carrying no zone designator, nominal distances inside their own 3-sigma brackets, probabilities in (0, 1], Torino ratings in 0–10, and estimated size ranges that are actually ranges.
