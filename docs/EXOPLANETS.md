# Exoplanets Encyclopedia (Program G)

Program G turns confirmed exoplanets and their planetary systems into first-class
knowledge-graph entities: **exoplanets, host stars, planetary systems, detection
methods, and planetary classes**, connected to the existing Star Encyclopedia,
missions, and telescopes. Everything is graph-driven and built from a real,
authoritative dataset.

## Data source

All planets come from the **NASA Exoplanet Archive** Planetary Systems Composite
Parameters table (`pscomppars`), the authoritative catalogue of confirmed
exoplanets. Every value — orbital period, radius, mass, equilibrium temperature,
host-star properties, distance, discovery method, year, and facility — is real
archive data. **Nothing is inferred or synthesised**; fields are omitted when the
archive has no reliable value. Habitability is **never asserted as certainty**.

## Selection (first iteration)

From ~6,300 confirmed planets the catalogue selects a quality subset of **849**
by a transparent score that prioritises famous planets, multi-planet systems,
nearby and well-characterised planets, directly imaged planets, host stars that
already exist in the Star Encyclopedia, and source-backed habitable-zone
candidates — then completes every selected system and guarantees each detection
method is represented. **835** planets become new entities; **14** enrich the
exoplanet entities that already existed (TRAPPIST-1 b–h, Proxima Cen b, 51 Peg b,
HD 209458 b, …).

## Host-star integration

Host stars are matched against the existing Star Encyclopedia (by name, catalogue
number, and a small alias map for abbreviated Bayer names). **131** planets reuse
an existing star entity (Proxima Centauri, Helvetios/51 Peg, Copernicus/55 Cnc,
TRAPPIST-1, …); the remaining **333** hosts are created as `host_star` entities
with only source-backed stellar fields. **Every planet orbits a host — there are
no orphans.** Binary-component hosts ("55 Cnc B") are slug-disambiguated from
planet designations ("55 Cnc b").

## Pipeline

```
NASA Exoplanet Archive (pscomppars CSV)
  → scripts/ingest-exoplanets.ts        (parse, score, select, classify, resolve hosts)
  → src/knowledge-graph/data/exoplanet-catalog/records/chunk-*.ts   (typed, committed)
  → src/knowledge-graph/data/exoplanet-catalog/index.ts             (planets + hosts + systems + methods + classes + relations)
  → src/platform/data-engine/exoplanet-engine.ts                    (engine.exoplanets)
  → src/app/exoplanets/**                                           (hub, object pages, discovery)
```

### Classification

Planets are classified by radius into terrestrial, super-Earth, mini-Neptune,
gas giant, and hot Jupiter (a gas giant with a short orbital period) — a standard
radius-based scheme derived from the real archive radius, not invented.

### Relations

`orbits_star` (planet → host), `member_of_planetary_system`, `discovered_by_method`,
`discovered_by_mission`/`discovered_by_facility` (to existing Kepler/TESS/Hubble/
VLT/Keck entities), `part_of_catalogue`, `candidate_for_habitable_zone`, and
`similar_to` (class archetypes) — every relation carries provenance and is
deduped against every existing graph edge.

## Pages

- `/exoplanets` — hub: famous planets, discovery, detection methods, classes.
- `/exoplanets/{slug}` — an adaptive page serving planets, host stars, systems,
  detection methods, and classes (hero, quick facts, overview, host star, system,
  discovery, habitability notes where source-backed, knowledge connections,
  sources, quality). Habitability is presented with care, never as certainty.
- `/exoplanets/discover/{slug}` — 17 generated discovery lists (all/nearby/famous/
  potentially-habitable, super-Earths, mini-Neptunes, hot Jupiters, gas giants,
  terrestrial, directly imaged, transit, radial-velocity, microlensing,
  multi-planet systems, Kepler, TESS, TRAPPIST-1).

## Validation

`validateExoplanets()` checks duplicate ids, id format, slug uniqueness across
all routable `/exoplanets` entities, **no orphan planets** (every planet orbits a
host), and **no isolated new entities**. The catalog passes the standard graph,
architecture, build, lint, and link gates.
