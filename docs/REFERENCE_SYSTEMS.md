# Astronomical Coordinates, Time & Reference Systems (Program CF)

The astrometry and time foundation — how astronomers say exactly where and when. Built on the platform's
honesty envelope: only well-established, standard definitions are stated, values appear only where firm,
and nothing is fabricated.

## Reuse-first

The domain is already substantially built, so CF reuses it and adds only the missing pieces:

- The **reference frames** (`reference_frame:icrs`, `bcrs`, `gcrs`, `j2000`, `b1950`, `the-ecliptic`),
  the **time scales** (`time_standard:tai`, `utc`, `ut1`, `terrestrial-time`, `barycentric-dynamical-time`,
  `sidereal-time`, `gps-time`, `leap-second`), the **astrometry methods** (`astronomy_method:parallax`,
  `proper-motion`, `space-astrometry`), the **ephemeris systems**, and **Gaia / Hipparcos** and the
  **astrometric catalogues** — all referenced via `relatedKeys`, none duplicated.

## New entities (two new types + additive records to existing types)

- **Coordinate systems** (8) — new `coordinate_system` type: right ascension, declination, and the
  equatorial, galactic, ecliptic, horizontal (altazimuth), and supergalactic systems, and the celestial
  sphere. This was the clear structural gap — coordinates existed only as prose and numeric fields.
- **Astrometric effects** (6) — new `astrometric_effect` type: precession, nutation, the aberration of
  light, atmospheric refraction, light-time correction, and the Earth orientation parameters. (Parallax
  and proper motion already exist as `astronomy_method` and are reused, not re-created.)
- **Reference frames** (3) — existing `reference_frame` type: FK4, FK5, and the quasar-based ICRF3.
- **Time scale** (1) — existing `time_standard` type: the Julian date.
- **Defining bodies** (2) — existing `organization` type: the IAU and the IERS, previously only source
  keys, now linkable anchors.

Each entity links to the frames, time scales, methods, and bodies it depends on, producing
`associated_with` edges deduped against every existing relation.

## Surfaces

- Hub `/reference-systems`, entry pages `/reference-systems/[slug]`, and four discovery hubs
  (`coordinate-systems`, `reference-frames`, `astrometric-effects`, `defining-bodies`).
- Resolved through the Scientific Data Engine (`engine.referenceSystems`), reusing the shared quality,
  review, provenance, connections, breadcrumb, and JSON-LD (`DefinedTerm`) infrastructure. Accent: comet.
- A `coordinate-and-time-systems` dataset and a "Where & When in the Sky" learning path surface the
  foundation in `/datasets`, `/learn`, and `/llms.txt`.

## Honesty

Standard values are given where firm (the ~25,772-year precession period, the ~18.6-year nutation term,
the ~20.5″ aberration constant, the ~0.5° horizon refraction, JD's 4713 BC origin). Concepts already in
the graph (ICRS, the time scales, parallax, proper motion) are reused rather than re-created. Nothing is
fabricated.
