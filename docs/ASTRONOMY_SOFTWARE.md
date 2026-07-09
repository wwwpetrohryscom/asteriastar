# Astronomical Software Ecosystem (Program CH)

The software that astronomers and astrophotographers actually use — from the desktop to the telescope to
the terminal. Built on the platform's honesty envelope: only well-established facts (purpose, platforms)
are stated, version numbers are omitted, and nothing is fabricated.

## Reuse-first

The scientific-software half of this domain is already partly built, so CH reuses it and adds only the
missing packages:

- The **Astropy ecosystem** (`research_software:astropy`, `astroquery`), the **ephemeris
  software/services** (`ephemeris_system:spice-toolkit`, `jpl-horizons`, `jpl-development-ephemeris`),
  the **data archives** (`data_archive:vizier`, `simbad`, `mast`, `cds`, `ned`), the **data standards and
  Virtual Observatory** (`data_standard:fits`, `votable`, `vo_framework:the-virtual-observatory`), the
  **observing techniques** (`observing_technique:*` from Program CG), the **observatories** (ALMA, the
  VLA), and the **equipment** — all referenced via `relatedKeys`, none duplicated. SPICE and JPL Horizons
  stay `ephemeris_system` entities and are linked, not re-created as software.

## New entities (one new type + additive records to `research_software`)

- **Desktop / planetarium** (5) — new `astronomy_software` type: Stellarium, KStars, Celestia, Cartes du
  Ciel, SkySafari.
- **Imaging software** (3) — `astronomy_software`: PixInsight, Siril, DeepSkyStacker.
- **Acquisition & control** (5) — `astronomy_software`: N.I.N.A., PHD2, ASCOM, INDI, Ekos.
- **Scientific tools** (7) — existing `research_software` type (beside Astropy): IRAF, CASA, TOPCAT,
  SAOImage DS9, Aladin, AstroImageJ, Montage.
- **Libraries** (3) — `research_software`: Skyfield, poliastro, Orekit.

Each package links to the observing techniques it drives, the archives and standards it reads, the
observatories whose data it processes, the ephemerides it computes from, and the sibling software it
works with, producing `associated_with` edges deduped against every existing relation.

## Surfaces

- Hub `/astronomy-software`, entry pages `/astronomy-software/[slug]`, and four discovery hubs
  (`desktop-planetariums`, `imaging-and-acquisition`, `scientific-tools`, `libraries`).
- Resolved through the Scientific Data Engine (`engine.astronomySoftware`), reusing the shared quality,
  review, provenance, connections, breadcrumb, and JSON-LD (`SoftwareApplication`) infrastructure.
  Accent: plasma.
- An `astronomy-software` dataset and a "The Astronomer's Toolkit" learning path surface the ecosystem in
  `/datasets`, `/learn`, and `/llms.txt`.

## Honesty

Only purpose and supported platforms are stated; version numbers and release dates are deliberately
omitted to avoid staleness. Status changes are noted where firm and relevant (IRAF is community-maintained
rather than actively developed by its origin observatory; poliastro's active development is archived).
SPICE and JPL Horizons are reused, not duplicated. Nothing is fabricated.
