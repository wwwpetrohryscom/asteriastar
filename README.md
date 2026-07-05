# Asteria Star

**Everything Above Earth.** A serious, source-ready knowledge platform for
everything above our planet â astronomy, space exploration, the night sky,
celestial events, mythology, and **astrology as a clearly separate cultural
tradition** â with science and symbolism kept clearly apart.

> Astronomy is presented as scientific, evidence-based, and sourced. Astrology
> is presented as cultural, symbolic, and interpretive â never as proven
> science.

This repository contains the **foundation** of the platform: a static-first,
SEO-first Next.js site with a typed content registry, a cosmic design system,
full SEO/structured-data infrastructure, and an architecture ready to grow into
tools, galleries, and (eventually) a community product.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, React Server Components)
- TypeScript (strict)
- Tailwind CSS v4
- Static generation â no database, no auth, no client data fetching (yet)

## Getting started

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # production build (statically prerenders all routes)
npm run lint      # ESLint
npm run validate  # validate the entry registry (boundary, sources, links)
```

Set the canonical origin for metadata/sitemap in production:

```bash
# .env (optional; defaults to https://asteriastar.com)
NEXT_PUBLIC_SITE_URL=https://asteriastar.com
```

## Structure

Seven knowledge hubs â Astronomy, Sky Guide, Astrology, Calculators,
Encyclopedia, Observatory, and Guides â each with many topic categories, all
driven by the content registry in [`src/lib/content/`](src/lib/content).

A third level, **entries** (`/[section]/[category]/[entry]`), holds individual
pages â stars, planets, missions, zodiac signs, glossary terms, and more â
typed and validated in [`src/content/entries/`](src/content/entries). See
[docs/PHASE_2_ENTRY_LAYER.md](docs/PHASE_2_ENTRY_LAYER.md).

A **knowledge graph** ([`src/knowledge-graph/`](src/knowledge-graph)) of **400
entities and 424 relations** connects everything â with scientific, cultural,
and astrological links kept strictly separate and no isolated nodes â and powers
a static **discovery** layer at `/explore`, `/entity-index`, `/discover`, and
graph-driven `/connections/*` pages. The **Observatory** (`/observatory`) is a
Celestial Data Platform hub with an honest, provenance-first
[image architecture](docs/IMAGE_PLATFORM.md) (no bundled or fabricated imagery).

The graph is also the platform's **intelligence layer** â recommendations,
comparisons (`/compare`), learning paths (`/learn`), timelines (`/timelines`),
and universal search (`/search`), all graph-derived with no fabricated data. See
[docs/INTELLIGENCE.md](docs/INTELLIGENCE.md) and
[docs/KNOWLEDGE_GRAPH.md](docs/KNOWLEDGE_GRAPH.md).

Underneath sits **Asteria Platform Core** ([`src/platform/`](src/platform)): a
layered, registry-driven foundation where the website is just one client. Seven
acyclic layers (enforced by `npm run check:arch`), an **entity runtime**
(`resolveEntity`), a **universal registry** of registries, generated metadata,
localization, extension points, and a reusable component family â all browsable
at [`/platform`](src/app/platform/page.tsx). See
[docs/PLATFORM_ARCHITECTURE.md](docs/PLATFORM_ARCHITECTURE.md).

All of this is reached through the **Scientific Data Engine**
([`src/platform/data-engine/`](src/platform/data-engine)) â 27 pure,
framework-independent modules (entity resolver, relationship resolver, graph
traversal, scientific query, recommendation, comparison, timeline, learning,
discovery, metadata, source, citation, dataset, authority, localization, **star**, **solar**,
and a single validation engine). Every consumer resolves reality through `engine.*`;
nothing reads the graph directly. See [docs/SCIENTIFIC_DATA_ENGINE.md](docs/SCIENTIFIC_DATA_ENGINE.md).

On top of that, a **scientific authority layer**
([`src/platform/authority/`](src/platform/authority)) makes trust a product
feature: a typed provenance model, a standardized evidence framework, review and
versioning architecture, a citation engine (APA/Chicago/MLA/Harvard/BibTeX/RIS),
and data-quality indicators derived from real data â surfaced on the
[authority dashboard](src/app/authority/page.tsx) and the
[transparency pages](src/app/transparency/page.tsx). Provenance and review
registries ship empty; nothing fabricates certainty. See
[docs/SCIENTIFIC_AUTHORITY.md](docs/SCIENTIFIC_AUTHORITY.md).

Adding a section, category, or entry is a data-only change: navigation, hub,
category and entry pages, `sitemap.xml`, and `llms.txt` all update
automatically.

## Documentation

- [Positioning â Everything Above Earth](docs/POSITIONING_EVERYTHING_ABOVE_EARTH.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Content Model](docs/CONTENT_MODEL.md)
- [Phase 2 â Entry Layer](docs/PHASE_2_ENTRY_LAYER.md)
- [Knowledge Graph](docs/KNOWLEDGE_GRAPH.md) Â· [Schema](docs/KNOWLEDGE_GRAPH_SCHEMA.md)
- [Intelligence Layer](docs/INTELLIGENCE.md)
- [Community Architecture](docs/COMMUNITY_ARCHITECTURE.md)
- [Image Platform](docs/IMAGE_PLATFORM.md)
- [SEO Strategy](docs/SEO_STRATEGY.md)
- [Future Social Network](docs/FUTURE_SOCIAL_NETWORK.md)
- [Editorial Policy](docs/EDITORIAL_POLICY.md)
- [Sources Policy](docs/SOURCES_POLICY.md)

**Astrobiology, Biosignatures & the Search for Life Encyclopedia (Program AR)**

- [Astrobiology](docs/ASTROBIOLOGY.md) — the science of life beyond Earth: origins of life, planetary habitability (liquid water, energy, chemical building blocks, extremophiles, subsurface oceans), the ocean worlds (Europa, Enceladus, Titan), biosignatures (atmospheric, surface, chemical, geological) and the false positives that must be ruled out, technosignatures & SETI, and planetary protection. Reuses the platform's ocean-world moons, Mars, the habitable-zone concept, the SETI Institute, and the life-search missions; no claim of extraterrestrial life is asserted; nothing duplicated or fabricated

**Galaxies, AGN & the Extragalactic Universe Encyclopedia (Program AQ)**

- [Galaxies](docs/GALAXIES.md) — the extragalactic universe: galaxy morphology (spiral, barred, elliptical, lenticular, irregular, ring, dwarf, peculiar), active galactic nuclei (Seyfert, LINER, radio galaxy, BL Lac, and the unified model), galaxy-evolution processes (mergers, interactions, starbursts, black-hole feedback, quenching), and named large-scale structures (the Local Group, the Virgo & Coma clusters, Laniakea, the Sloan Great Wall, the Boötes Void). Reuses the platform's galaxies, astrophysical object classes, and cosmology concepts; nothing duplicated or fabricated

**Multi-Wavelength & Time-Domain Astronomy Atlas (Program AP)**

- [Time-Domain Astronomy](docs/TIME_DOMAIN.md) — how the dynamic universe is observed across every wavelength (radio → gamma-ray) and messenger (gravitational waves, neutrinos, cosmic rays): the transient classes (Type Ia and core-collapse supernovae, hypernovae, novae, gamma-ray bursts, magnetar flares, kilonovae, compact-binary mergers, tidal disruption events, fast radio bursts, variables), the alert infrastructure (GCN, VOEvent, TNS, ATel, the Rubin stream), and the discovery→publication workflow. Reuses the platform's observing bands, multi-messenger methods, surveys, and observatories; nothing duplicated or fabricated

**Astronomy Methods, Measurements & Scientific Techniques Encyclopedia (Program AO)**

- [Astronomy Methods](docs/METHODS.md) — how astronomy actually works: astrometry and parallax, photometry and the magnitude system, spectroscopy and spectral classification, interferometry and adaptive optics, the cosmic distance ladder (Cepheids, standard candles, redshift), helioseismology and asteroseismology, gravitational lensing, gravitational-wave detection, neutrino and multi-messenger astronomy, CMB measurements, galaxy rotation curves and black-hole masses, and the error analysis, calibration, and honest uncertainty that make a measurement science. Reuses the platform's exoplanet-detection methods, cosmology concepts, observing bands, and the Gaia telescope; nothing duplicated or fabricated

**Future Space Exploration & Mission Concepts Encyclopedia (Program AN)**

- [Future Exploration](docs/FUTURE_EXPLORATION.md) — a future-exploration authority of official and credible planned missions and concepts: the Artemis return to the Moon, Mars Sample Return, the Venus fleet (DAVINCI, VERITAS, EnVision), the ocean worlds (Dragonfly, Europa Clipper, JUICE), the next great observatories (Roman, Habitable Worlds Observatory, LISA, Athena), planetary defence (NEO Surveyor), and the outer Solar System. Each concept states its status, agency, timeline, goals, target, technology, and uncertainties honestly. Reuses the platform's in-development missions and agencies; nothing duplicated or fabricated

**Space Manufacturing & In-Space Infrastructure Encyclopedia (Program AM)**

- [Space Infrastructure](docs/SPACE_INFRASTRUCTURE.md) — the future engineering layer: in-situ resource utilisation (water, oxygen, metals, and propellant from the Moon, Mars, and asteroids), in-space manufacturing (3D printing, assembly, servicing, autonomous construction), and the infrastructure of a spacefaring economy (propellant depots, commercial & inflatable habitats, lunar bases, solar-power satellites, surface fission power, space tugs, orbital refuelling, and megastructure concepts). Reuses the platform's worlds, commercial/inflatable stations, propellants, and components; each technology's maturity is stated honestly, from operational to theoretical; no fabricated data

**Life Support, Space Biology & Space Medicine Encyclopedia (Program AL)**

- [Space Medicine](docs/SPACE_MEDICINE.md) — the human-in-space scientific layer: the disciplines (space medicine, radiation biology, psychology & human factors, life support), the physiological effects of spaceflight (bone and muscle loss, fluid shift, SANS vision changes, immune and radiation effects), the ECLSS life-support technologies (oxygen, CO₂ removal, water recovery, food, closed ecosystems), and the countermeasures that mitigate them. Reuses the platform's ECLSS system, radiation environments, stations, and astronauts; no fabricated data

**Space Missions Timeline & Historical Events Encyclopedia (Program AK)**

- [Space Missions Timeline](docs/SPACEFLIGHT_TIMELINE.md) — the chronological history of spaceflight: the eras (Space Race, golden age of planetary exploration, Shuttle, ISS, commercial, Artemis), the dated timeline events (Sputnik, Gagarin, Apollo 11, the Voyagers, Cassini, New Horizons, JWST, DART, Chandrayaan-3), the milestone firsts, and the standing records. Reuses the platform's missions, mission programs, astronauts, agencies, stations, telescopes, and worlds, linking every event to what it concerns; no fabricated events or dates

**Space Agencies, Institutions & Laboratories Encyclopedia (Program AJ)**

- [Space Agencies, Institutions & Laboratories](docs/INSTITUTIONS.md) — the institutional layer of spaceflight: the classes of institution (space agency, field center, research laboratory, science institute, commercial company, observatory operator) and the field centers and laboratories that were missing from the graph (Goddard, Johnson, Marshall, Kennedy, ESTEC, ESAC, Tsukuba, APL, SwRI, and more), each linked part_of its parent agency. Reuses and enriches the platform's existing organizations (the agencies, commercial companies, and observatory operators), never duplicating them; no fabricated data

**Planetary Geology & Surface Features Encyclopedia (Program AI)**

- [Planetary Geology](docs/PLANETARY_GEOLOGY.md) — the geology of the Solar System's surfaces: the classes of geological feature (impact craters and basins, shield volcanoes and cryovolcanoes, canyons, dunes, chaos terrain, ice plains, hydrocarbon lakes) and named features (Tharsis, Hellas, Caloris, Maxwell Montes, Occator, Sputnik Planitia, and more) across Mars, the Moon, Mercury, Venus, Ceres, Vesta, the icy moons, and Pluto. Reuses the platform's planets, moons, and surface features; no fabricated data

**Scientific Instruments & Payloads Encyclopedia (Program AH)**

- [Scientific Instruments](docs/INSTRUMENTS.md) — the science-payload layer: the classes of instrument (cameras, spectrometers, magnetometers, particle and dust detectors, radars, laser altimeters, seismometers, radio science) and notable instruments (LORRI, JunoCam, SEIS, Magellan SAR, and more), linked to their host missions. Reuses and enriches the platform's existing instruments (Mars, JWST, Hubble, Juno, ground telescopes), never duplicating them; no fabricated data

**Spacecraft Systems & Engineering Encyclopedia (Program AG)**

- [Spacecraft Systems](docs/SPACECRAFT_SYSTEMS.md) — the engineering layer of spacecraft: the subsystems (structure, thermal, power, propulsion, attitude control, avionics, telecommunications, entry-descent-and-landing, robotics) and their components (solar arrays, RTGs, ion thrusters, reaction wheels, flight computers, heat shields, and more). Reuses the platform's docking systems, life-support systems, antennas, and attitude sensors; no fabricated data

**Ground Segment & Mission Operations Encyclopedia (Program AF)**

- [Mission Operations](docs/MISSION_OPERATIONS.md) — the operational infrastructure behind every mission: the mission-control and operations centres (JPL's SFOF, ESA's ESOC, Houston's Mission Control) and the operational functions that fly spacecraft (mission control, flight dynamics, orbit determination, navigation, telemetry, fault protection, and the operations lifecycle). Reuses the agencies, tracking networks, and missions; no fabricated data

**Space Environment & Hazards Encyclopedia (Program AE)**

- [Space Environment](docs/SPACE_ENVIRONMENT.md) — the hazards of space: space weather (solar wind, flares, CMEs, geomagnetic storms, auroras), the radiation environment (Van Allen belts, cosmic rays, solar energetic particles), spacecraft hazards (orbital debris, micrometeoroids, charging, atomic oxygen), and the indices and monitoring missions that track them. Reuses the Sun, planets, and solar missions; states no live conditions (links to NOAA SWPC); no fabricated data

**Deep Space Communications & Navigation Encyclopedia (Program AD)**

- [Deep Space Communications](docs/DEEP_SPACE_COMMUNICATIONS.md) â the infrastructure that lets us talk to and navigate spacecraft across the Solar System: NASA's Deep Space Network, ESA's Estrack, the tracking and ground stations, giant antennas, signal bands (S/X/Ka/optical), and radiometric, Delta-DOR, optical, and autonomous navigation â the layer beneath nearly every space program. The DSN, Estrack, and Near Space Network are reused and enriched (never duplicated); signal light-time is real physics, not a fabricated delay; no fabricated capabilities, antenna sizes, or coverage

**Small-Body Missions & Sample Return Encyclopedia (Program AC)**

- [Small-Body Missions](docs/SMALL_BODY_MISSIONS.md) â the flybys, orbiters, landers, impactors, and sample-return missions that explored asteroids and comets (Hayabusa, OSIRIS-REx, Rosetta, DART, Lucyâ¦), with their mission classes, returned samples, capsules, lifecycle phases, and the AIDA campaign â the engineering bridge across the small-body arc. Existing missions, rockets, asteroids, and comets are reused and enriched (never duplicated); reused missions keep their canonical page; planned missions assert no results they have not achieved; no fabricated data

**Interstellar & Hyperbolic Objects Encyclopedia (Program AB)**

- [Interstellar Objects](docs/INTERSTELLAR_OBJECTS.md) â the confirmed visitors from beyond the Solar System (1I/Ê»Oumuamua, 2I/Borisov, 3I/ATLAS), debated candidates, hyperbolic Solar-System comets, and the detection methods, trajectory classes, and surveys used to tell them apart â the coda to the small-body arc. Confirmed, candidate, and Solar-System objects are typed and displayed separately; an interstellar origin is asserted only for the confirmed objects; no "alien"/artificial-origin claims and no fabricated data (reuses the comet class, Pan-STARRS/LSST, and NASA/JPL)

**Meteors, Meteorites & Fireballs Encyclopedia (Program AA)**

- [Meteorites](docs/METEORITES.md) â meteorites, their classes and groups, fireballs and bolides, terrestrial impact structures, and recovery sites, traced to their parent bodies (Vesta, Mars, the Moon) â the capstone of the small-bodies trilogy (reuses existing asteroids, impact events, and meteor showers; no fabricated data)

**Comets & Small-Body Reservoirs Encyclopedia (Program Z)**

- [Comets](docs/COMETS.md) â comets, dynamical classes, genetic families, the Oort cloud and (reused) trans-Neptunian reservoirs, comet missions, and the meteor-shower parent bodies, plus active-asteroid/dormant-comet transition objects (reuses existing comets, meteor showers, missions, and Program Y's reservoirs; no fabricated data)

**Asteroids & Minor Planets Encyclopedia (Program Y)**

- [Asteroids](docs/ASTEROIDS.md) â asteroids, near-Earth objects, Trojans, Centaurs, and trans-Neptunian objects as first-class graph entities, with collisional families, orbital resonances, impact events, and a planetary-defense knowledge layer (reuses existing dwarf planets, asteroids, and missions; no fabricated data)

**Constellation Encyclopedia (Program W)**

- [Constellations](docs/CONSTELLATIONS.md) â all 88 IAU constellations as first-class graph entities, connected to their stars, deep-sky objects, exoplanets, meteor showers, mythology, families, and seasonal sky (reuses existing entities; no fabricated data)

**Rockets & Launch Vehicles Encyclopedia (Program V)**

- [Rockets & Launch Vehicles](docs/ROCKETS.md) â launch vehicles, rocket families, booster/upper stages, engines, propellants, launch providers, programs, and pads, source-backed with unknown specifications left blank (never invented)

**Satellite Encyclopedia (Program X)**

- [Satellites](docs/SATELLITES.md) â artificial satellites, satellite constellations, orbit types, operators, and tracking networks as first-class graph entities, reusing existing agencies, rockets, and launch sites (no real-time tracking; unknown specifications left blank, never invented)

**Solar System Encyclopedia (Program B)**

- [Solar System](docs/SOLAR_SYSTEM.md) â the Sun, planets, moons, asteroids, comets, missions, and spacecraft from real NASA/JPL data

**Star Encyclopedia (Program A)**

- [Star Encyclopedia](docs/STAR_ENCYCLOPEDIA.md) â 2,944 real stars from the open HYG database (CC BY-SA 4.0), as first-class graph entities

**Scientific Data Engine (Phase 10)**

- [Scientific Data Engine](docs/SCIENTIFIC_DATA_ENGINE.md) â the 18-module execution layer every consumer reads through

**Scientific Authority (Phase 9)**

- [Scientific Authority](docs/SCIENTIFIC_AUTHORITY.md) â provenance, evidence, review, quality, transparency
- [Evidence Framework](docs/EVIDENCE_FRAMEWORK.md) Â· [Provenance Model](docs/PROVENANCE_MODEL.md)
- [Editorial Process](docs/EDITORIAL_PROCESS.md) Â· [Citation Engine](docs/CITATION_ENGINE.md)
- [Versioning (object-level)](docs/VERSIONING.md) Â· [Data Quality](docs/DATA_QUALITY.md) Â· [Transparency](docs/TRANSPARENCY.md)

**Platform Core (Phase 8)**

- [Platform Architecture](docs/PLATFORM_ARCHITECTURE.md) â layers, entity runtime, registries, metadata
- [Localization](docs/LOCALIZATION.md)
- [Extensions](docs/EXTENSIONS.md)

**Open Celestial Data Platform (Phase 7)**

- [Open Data](docs/OPEN_DATA.md)
- [API Overview](docs/API_OVERVIEW.md)
- [Dataset Catalog](docs/DATASET_CATALOG.md)
- [Entity Identifiers](docs/ENTITY_IDENTIFIERS.md)
- [Versioning Strategy](docs/VERSIONING_STRATEGY.md)
- [Scientific Sources](docs/SCIENTIFIC_SOURCES.md)
- [Licensing Policy](docs/LICENSING_POLICY.md)
- [Contribution Standards](docs/CONTRIBUTION_STANDARDS.md)

## Principles

No fabricated facts, statistics, or astronomical data. Astrology content is
always labeled as interpretive tradition and never mixed with scientific
astronomy. See the [editorial policy](docs/EDITORIAL_POLICY.md).
