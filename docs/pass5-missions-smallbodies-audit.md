# Pass 5 — Missions, Rockets, Spacecraft, Observatories, Asteroids & Comets: Enrichment Audit

_Honest by construction: no fabricated values; unknowns stay empty; derived values are computed only from source-backed inputs with a documented, standard method and are labelled `· derived`._

## Scope audited

| Catalogue | Records | Notes |
| --- | ---: | --- |
| `exploration-catalog` (missions/spacecraft/agencies/programs/vehicles/sites/astronauts/instruments) | 178 | **65 missions**, all with a launch date; 19 Active + 4 en route (44 Active records catalog-wide) |
| `rockets-catalog` (vehicles/stages/engines/propellants/pads/sites) | 155 | 55 launch vehicles; 51 with a first-flight year |
| `asteroids-catalog` (minor bodies + families/groups/NEO classes/Trojans/resonances/impacts) | 70 | 38 minor planets; 5 PHA, 11 near-Earth-class, 34 taxonomies, 25 diameters |
| `comets-catalog` (comets + classes/families/reservoirs/active-asteroids/dormant-comets) | 38 | 21 comets; 13 orbital periods, 7 perihelion dates |
| `observatory-catalog` | — | already validated (id/slug/relation integrity) |

Every record carries a `sources` reference.

## Characteristic coverage (already populated & rendered)

The mission/rocket pages already render agency, program, mission type, destination, **launch date, end date, status**, launch vehicle and site (`/exploration/[slug]`); rockets render provider, family, stages, engines, propellants, first flight and payload. The small-body catalogues are **curated taxonomy/relationship hubs** — they carry designation, discoverer, discovery year, taxonomy/spectral type, diameter, family, NEO/Trojan class and mission links, but (by design) **not** full orbital elements: semi-major axis, eccentricity, inclination and period are essentially unpopulated (0 of 70 asteroids; comets carry only 13 periods). Full orbital elements would require a JPL SBDB / MPC ingestion and are **not** invented here.

## Enrichment applied (this pass)

**Derived mission span — 24 missions.** On `/exploration/[slug]`, a mission's span is computed from its source-backed ISO dates and **labelled `· derived`**:

- both launch **and** end date known → **Mission duration** = end − launch (e.g. Apollo 11 → *8 days*);
- launch known, mission still under way (status Active / En route) → **Time since launch** = today − launch (e.g. Voyager 1 → *48.8 years*, Mars Express → *23.1 years*).

Both inputs are catalogued dates; the value is computed at render time and never stored. It is withheld (honest empty state) when it cannot be formed — no launch date, a not-yet-launched mission, or a concluded mission with no recorded end date.

No orbital elements were derived for small bodies: the catalogues carry no semi-major axis / apsides to derive a period from, and inventing them would be fabrication.

## New permanent validators (fail on dishonesty, not absence)

`npm run validate` now additionally enforces, on top of each catalogue's existing id/slug/relation integrity:

**Missions (`validateExploration`) — status & tense honesty**
- status ∈ a known vocabulary (Completed / Active / Retired / En route / Failed / Lost / Planned / In development / Cancelled);
- a **flown/ongoing** status (Completed/Active/Retired/En route/Failed/Lost) may **not** sit on a launch date still in the future;
- a craft that has **already launched** may not be labelled "Planned";
- an **end date may not precede** its launch date.

**Rockets (`validateRockets`)**
- status ∈ {Active, Retired, In development, Planned, Cancelled};
- a **first-flight year** cannot be in the future or predate rocketry (< 1942).

**Asteroids (`validateAsteroids`)**
- orbital ordering **perihelion ≤ semi-major axis ≤ aphelion** (future-proofs a later orbital ingestion);
- **NEO/PHA consistency**: a Potentially Hazardous Asteroid must carry a near-Earth orbit class, and a near-Earth class implies **perihelion < 1.3 AU** (the NEO definition) when a perihelion is known;
- discovery year ∈ [1750, current year].

**Comets (`validateComets`)**
- **perihelion ≤ aphelion** when both apsides are known (only fires for bound comets — hyperbolic comets have no aphelion);
- a 4-digit discovery year cannot be in the future (antiquity/BC years are skipped).

Result: **0 violations** across all four catalogues (178 + 155 + 70 + 38 records).

## Adversarial review — findings independently verified, false positives avoided

- **Hyperbolic comets kept legal.** The comet catalogue's existing eccentricity gate already allows e ∈ [0, 5] — comets are exactly the bodies that reach and exceed e ≈ 1 (near-parabolic / interstellar). The new ordering check only compares apsides *when both are present*, so a hyperbolic comet with no aphelion is never flagged.
- **Status tense uses run-time "now".** The future/past distinction is evaluated against the real current date, so a Planned mission correctly becomes a contradiction only once its launch date has actually passed — the permanent, self-updating "stale status" guard the roadmap asks for. Verified: 0 contradictions today (0 future-dated flown missions; 0 past-dated Planned missions).
- **NEO/PHA logic checked against data.** All 5 PHAs carry a near-Earth class; all 11 near-Earth-class asteroids are consistent. The perihelion sub-check carries a 1 % slack so a body sitting exactly at the 1.3 AU boundary is not falsely flagged.
- **Derived span never overstates.** "Time since launch" is used (not "operating time") so no operational claim is made about a cruising spacecraft; a concluded mission with no recorded end date shows nothing rather than a guessed duration. Verified against Voyager 1/2 (48.8/48.9 yr — V2 launched 16 days earlier, so its elapsed span is larger), Apollo 11 (8 days), New Horizons (20.5 yr).
- **No fabricated small-body orbital data.** Rather than transcribe JPL/MPC orbital elements (a fabrication risk), the absent elements are left empty and flagged for a dedicated ingestion.

## Remaining gaps (honest, not fabricated)

Full small-body orbital elements (semi-major axis, eccentricity, inclination, node/argument, period), rotation, mass and albedo require an authoritative JPL SBDB / MPC ingestion; mission end dates, cost, mass and instrument payloads require a per-mission authoritative pass. All are flagged for follow-up, not invented here. Where a value is genuinely unknown, the page shows an honest empty state.
