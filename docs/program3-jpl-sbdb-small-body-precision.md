# Program 3 — JPL SBDB asteroid & comet orbital data

_Source-level enrichment with field-level provenance. Honest by construction: every element is transcribed verbatim from the JPL orbit solution, carries its own uncertainty and osculating epoch, and unknown stays empty._

## Objective

Give the asteroid and comet catalogues their (previously empty) authoritative orbital elements, physical parameters and NEO/PHA classification — each with exact provenance, epoch and uncertainty — from the JPL Small-Body Database.

## Source & method

`npm run precision:small-bodies` queries the **JPL SBDB** (`sbdb.api`, `full-prec=1`) once per body and writes a committed snapshot stamped with a retrieval date. For each body it records, verbatim:

- **orbit**: semi-major axis, eccentricity, inclination, longitude of ascending node, argument of perihelion, perihelion & aphelion distance, period — each with its **1-σ uncertainty** and referred to the body's **osculating epoch** (heliocentric ecliptic J2000); plus Earth MOID, condition code, observation arc, N obs and the JPL solution author;
- **physical**: absolute magnitude H, geometric albedo, diameter, rotation period, density (with uncertainties);
- **classification**: SBDB's authoritative orbit class, and the **NEO** and **PHA** flags.

Bodies are matched by their formal designation (`4`, `67P`, `C/1995 O1`). Only records with a designation are queried — classes, families, reservoirs and space missions have none, which prevents a mission ("Giotto", "Hera") from wrongly resolving to a same-named asteroid.

## Coverage (of the 62 designated bodies)

| Field | Count | % |
| --- | ---: | ---: |
| bodies with an orbit solution | 59 | 95 % |
| orbital elements (a, e, i, q) | 59 | 100 % |
| aphelion / period (bound orbits) | 57 | 96.6 % |
| semi-major axis **with uncertainty** | 57 | 96.6 % |
| diameter | 47 | 79.7 % |
| albedo | 38 | 64.4 % |
| rotation period | 44 | 74.6 % |

**21 NEO, 9 PHA** — SBDB's authoritative flags. Verified: Ceres a = 2.766 au (±1×10⁻¹¹, MBA), Vesta a = 2.361 au, Halley a = 17.93 au / e = 0.968 (Halley-type), C/2006 P1 McNaught e = 1.00002 / a = −9074 au (hyperbolic).

## Honesty rules enforced

- **Status is truthful.** Orbital elements are `calculated` (a JPL orbit-determination fit); physical parameters H / diameter / rotation are `catalogued` — SBDB adopts them from photometric fits, radiometric models (IRAS/WISE) and lightcurve databases, so none is claimed as a direct `measured` observation; albedo/density are `estimated`; classification is `catalogued`. Nothing is dressed up as a direct observation.
- **One epoch per body, preserved.** Every element of a body shares that body's osculating epoch (shown), and epochs are never mixed across bodies (Ceres 2026, Halley 1968, McNaught 2006).
- **Hyperbolic orbits kept honest.** A comet with e ≥ 1 legitimately has a **negative** semi-major axis and **no** aphelion; it is never forced into a bound-orbit shape, and the page says so.
- **Satellites excluded.** Dimorphos (moon of Didymos) has no independent heliocentric orbit — its designation resolves to the primary's SBDB entry, so it is excluded rather than shown the primary's orbit under its own name.
- **No fabricated derivation.** SBDB already provides aphelion and period directly, so nothing is re-derived; every displayed value is source-backed.

## Visible rendering

Asteroid and comet pages (and the universal entity page) gain an **Orbit & physical parameters** section (reusable `ProvenanceStatTable`, existing styling — no redesign): each element with its uncertainty and a `JPL SBDB · status` chip, the orbit class / NEO / PHA / epoch / MOID in the subtitle, and progressive-disclosure full provenance (SPK-ID, column, epoch, solution author, retrieval date).

## Permanent validator

`npm run validate` → **Small-body precision**: structural honesty of every value; **Keplerian ordering** (q ≤ a ≤ Q) for bound orbits while **allowing hyperbolic** comets (e ≥ 1, a < 0, no aphelion); physical-range sanity; **NEO/PHA consistency** (PHA ⊆ NEO; NEO ⇒ q < 1.3 au); and **unique SPK-IDs**. Result: **0 violations across 59 bodies.**

## Adversarial review (independently verified, fixed before merge)

A five-lens multi-agent review confirmed four findings (0 refuted), fixed here: (1) the shared table formatter rounded a near-parabolic hyperbolic eccentricity (McNaught 1.00002) to a bare "1", hiding the unbound orbit — now preserves enough significant figures that a non-integer never collapses onto an integer; (2–3) H / diameter / rotation were labelled `measured` though SBDB adopts them from photometric/radiometric/lightcurve sources — corrected to `catalogued` (with the docstring reconciled); (4) the snapshot sort was locale-sensitive — replaced with a code-point-stable, byte-deterministic order.

## Remaining gaps (honest)

Two comets (73P — a fragmented object; C/1965 S1 Ikeya-Seki) did not resolve to a single SBDB key and are left empty; the 5 dwarf planets route to the Solar-System pages (which already show their orbits) with the SBDB overlay available in the data layer. Spin-pole orientation, taxonomic spectra and detailed shape models are not ingested here — flagged, not fabricated.

## Commands

- `npm run precision:small-bodies` — refresh the SBDB snapshot
- `npm run precision:report` — coverage report (stars + deep-sky + small bodies)
- `npm run validate` — includes the small-body-precision gate
