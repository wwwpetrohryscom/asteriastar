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
