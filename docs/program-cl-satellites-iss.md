# Program CL — Satellites, the ISS & orbital passes

_One satellite tracked live, from its operator's own trajectory file, with the coordinate maths verified to a metre against that operator's own published numbers — and an honest account of why it is one and not thousands._

## The provider decision, which is most of the program

The obvious route was CelesTrak's two-line elements plus SGP4. It was evaluated and rejected, for two independent reasons.

**CelesTrak refused automated access.** After a handful of requests the host stopped answering at the TCP level, from this environment, and its usage-policy page became unreachable with it. That is entirely its operator's prerogative. What it means here is that an integration could neither be established nor its terms verified — so none is claimed, nothing is scraped, and the catalogue record says exactly that rather than "architecture-ready".

**NASA publishes something better.** Johnson Space Center's Flight Operations Directorate publishes the ISS's *operational* trajectory openly, in the CCSDS Orbit Ephemeris Message format that NASA's own Spot the Station pages document: state vectors every four minutes in the mean equator and equinox of J2000, spanning fifteen days, with the station's mass and its ascending-node crossings. That is the trajectory the flight controllers use. A two-line element set is a set of *mean* elements carrying kilometre-level error by construction; this is the real thing, and it needs no propagator at all.

So the integration uses NASA, and CelesTrak stays PLANNED with the specific reason recorded. **No new dependency was added** — with state vectors rather than mean elements, there is no SGP4 to implement or import.

## Verified to a metre, not asserted

Converting J2000 state vectors into a position over the Earth needs precession (IAU 1976), nutation (IAU 1980) and Earth rotation through Greenwich apparent sidereal time. Getting any of it wrong does not produce nonsense — it produces a ground track displaced by a fraction of a degree, which looks entirely plausible.

Every NASA ephemeris states the Earth-fixed longitude of the station's first and last ascending nodes, computed by NASA. Running our transform on the same file at those epochs gives:

| Node | NASA | Computed here | Latitude | Disagreement |
| --- | --- | --- | --- | --- |
| first | 98.81658° | 98.81657° | −0.00001° | **1.2 m** |
| last | 21.83003° | 21.83001° | −0.00002° | **1.9 m** |

The two are fifteen days apart, so agreement at both rules out a wrong rotation *rate* as well as a wrong offset — and the latitude column is the independent half, since an ascending node is by definition at zero. This comparison is in `live:probe`, against the live file, with a twenty-metre threshold.

It found a real bug while being written: the precession rotations were composed in the inverse order, which displaced the track by 0.68° — exactly twice the accumulated precession since J2000, and completely invisible without something to check against.

Deliberately not modelled, and named rather than hidden: polar motion (~10 m) and the UT1−UTC offset (under 0.9 s, so up to ~400 m of longitude). Both are far below what a visible pass needs.

## Passes computed on the reader's device

The pass page ships a 36-hour window of NASA's state vectors to the browser and does the arithmetic there. **A reader's coordinates are never transmitted** — not to AsteriaStar, not to NASA, not into the URL. That is a stronger guarantee than a promise not to log them, because there is nothing to receive, and a reader can confirm it by watching their own network tab.

Nothing asks the browser for a position, nothing inspects the request's network address, and nothing is remembered between visits — no cookie, no stored value, no query parameter.

The API endpoint exists as well, for people writing their own software who are deliberately choosing to send coordinates to a server. It documents that they are used to evaluate a pure function and are not logged, stored, counted or transmitted; omitting them returns an error rather than a guess.

A pass is reported **visible** only when three things hold together: above 10° elevation, satellite sunlit, and the Sun more than 6° below the observer's horizon. The other outcomes name which condition failed — `daylight`, `eclipsed`, `not-visible` — because a list of times when nothing can be seen is worse than no list. **No weather is modelled**, and the page says so: a visible pass is geometrically and astronomically visible, not forecast to be seen.

## Nothing is extrapolated

The published ephemeris ends fifteen days after NASA generates it, and the station manoeuvres. Asking for a position or a pass beyond that returns nothing at all rather than a propagated guess — which would look exactly like a real answer.

## Surface

`/satellites/live` · `/iss` · `/passes` · `/bright` · `/constellations/live`

Five stable URLs, no query parameters. Two of them exist to be honest about absence: `/satellites/bright` carries the one satellite whose position is known and explains what determines visibility for the rest, rather than publishing a table of magnitudes that cannot be turned into a sighting; `/satellites/constellations/live` reports **AsteriaStar's own integration state** for each constellation — which is live information, and is labelled as that rather than as orbital data.

### API

`GET /api/v0/live/satellites` · `/{id}` · `/{id}/passes`

`/{id}` returns `frameVerification`: the measured disagreement between our transformation and NASA's own node longitudes. A consumer relying on these positions is entitled to see how far they can be trusted, measured rather than claimed. An unknown id returns 404 with an explicit statement of coverage, so "not found" cannot be read as "this satellite does not exist".

## Gates

`live:validate` gained frame invariants that need no network: sidereal time against its defining value at J2000 *and* closure over one sidereal day (which catches a wrong rate, invisible to a single-epoch check), geodetic round-trips at four latitudes, look angles against the **analytic great-circle bearing** at five directions plus zenith and antipode, and a fixed inertial direction sweeping longitude at 15.041°/hour.

Writing that bearing test caught a mistake in the test rather than the code: a point at the same latitude is *not* due east on a sphere, and asserting 90° would have passed only if the implementation were also wrong. The analytic formula is checked instead.

`live:probe` adds the node-longitude comparison and physical bounds on the derived quantities — altitude in the station's operating band, orbital speed, nodal period, latitude within the 51.6° inclination, and pass durations, elevations and ranges that are physically possible.

## Adversarial review (independently verified, fixed before merge)

Two independent reviews — orbital mechanics and numerics; privacy, security, failure, accessibility and SEO. The mechanics review independently reproduced the node-longitude verification (−1.23 m and −1.91 m) and confirmed the nutation series, the sidereal-time formula, the topocentric rotation, the interpolation window, the binary search, the nodal period against NASA's own node epochs (92.899352 vs 92.899598 min), and that the refinement loops genuinely refine — matched against a two-second brute-force scan over 260 passes at four sites with identical pass counts, rise times, set times and peak elevations.

**The privacy claim was false in one place, and it was the one place it mattered.** The passes API echoes the caller's coordinates in its body, and it inherited the shared cache policy every other live route uses — `public, s-maxage=21600` with the full URL as the cache key. A reader's location would have been written into a CDN's storage and its request logs for six hours, while the route's own docblock said the coordinates were "discarded when the response is written". A promise the response headers contradict is not a promise. That endpoint is now `private, no-store`, and it is the only one in the family that is not cacheable, for the stated reason: it is the only one whose response differs per caller.

**A window boundary invented data.** A pass straddling the end of a requested window was dropped entirely; one straddling the start was returned with its rise clamped to the window edge — naming a compass direction the station never rose from, formatted identically to a measurement. Demonstrated on the live file: a real pass rising at 277.3° (W) over 384 s was reported as rising at 231.9° (SW) over 222 s. The scan now reaches fifteen minutes past both edges, clamped to the ephemeris, and reports a pass if it *peaks* inside the requested window — half-open, so consecutive windows contain each pass exactly once. Only the ephemeris can truncate a pass now, and when it does the pass says so.

Also confirmed and fixed:

- **The 30-second scan could miss a pass**, and its justifying comment reasoned about the wrong quantity: what must be bracketed is time above the *ten-degree threshold*, not above the horizon. A real pass peaking at 10.03° with 22 s above threshold was missed. The step is ten seconds, and the guarantee is now stated exactly rather than overclaimed.
- **The precession rotations were composed in the reverse of the standard order.** Invisible — ζ and z agree through first order and differ by 0.79·T² arcseconds, about three micrometres on the ground — but the file's own docstring makes a claim about that order.
- **A multi-segment OEM would have passed the frame check it exists to perform**: the header map is global, so the check read the last declaration while every segment's vectors were merged. A file mixing TEME and EME2000 segments would have been displaced by exactly the 0.68° the node check was built to catch, and could not have caught, because it samples two epochs. Such files are now refused.
- **`NODE_RE` backtracked quadratically** — 195 ms on 32,000 characters, extrapolating to minutes at the two-megabyte product ceiling, from a single long comment line. The scan is bounded before the regex runs, not after: 2 ms on 200,000 characters.
- **`ecefToGeodetic` returned NaN on the polar axis** — an ordinary point, in an exported general-purpose function.
- **`solarDirectionEci`'s docstring named the wrong frame.** It is the *true* equator of date, not the mean one, which is precisely why the consumer must rotate by apparent rather than mean sidereal time; a maintainer trusting the comment would have introduced a 17-arcsecond error.
- **The Sun's direction was computed twice per sample** in a loop that runs on the reader's device.
- **`/satellites/bright` hid its static reference text behind live-data availability**, so a NASA outage would have deleted a paragraph that does not depend on NASA and the only route onward to the pass calculator — which has its own cache and would still have been working.
- **The results live region wrapped the entire list**, so a screen reader announced several hundred words with no way to skip, on every submission. Only the one-line summary is a live region now.
- **A repeated identical validation error was never announced** (React re-rendered the same text into the same node, mutating nothing), and neither field carried `aria-invalid` or pointed at the error.
- **The ground track announced its summary twice** and described only the current position rather than the track, and its inclination limits were distinguished from the predicted path by opacity alone.
- **The new NASA catalogue record was attributed to CelesTrak** — the exact conflation the runtime registry's own comment says was deliberately avoided. NASA's ephemeris now has its own entry in the live-sky provider registry.
- **`/sky/iss-tracker` still told readers the feature does not exist.** An indexed page whose provenance asserted that no ISS position or pass prediction is shown, competing for the same queries as the pages that now show them.
- **`/satellites/constellations` was a 404** — the parent of a URL in the sitemap and in a breadcrumb. It is now the constellation index those singular `/satellites/constellation/[slug]` pages belong to.
- **`X-Content-Type-Options: nosniff`** was absent site-wide, which is what would have turned a reflected 404 body into something worse.

The gate gained pass-boundary and OEM invariants — a synthetic circular orbit proves a straddling pass appears in exactly one window with its own rise, and the parser is shown to refuse mixed frames, wrong frames and wrong time systems while bounding its comment scan.
