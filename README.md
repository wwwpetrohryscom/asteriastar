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

**Celestial Mechanics & Timekeeping Encyclopedia (Program BE)**

- [Celestial Mechanics & Timekeeping](docs/CELESTIAL_MECHANICS.md) — the exacting mathematics beneath every orbit, eclipse and star chart: the orbital-mechanics concepts (the restricted three-body problem, N-body dynamics, Lagrange points, the Hill sphere, the Roche limit, orbital perturbations, mean-motion & secular resonances, tidal evolution, spin-orbit coupling, orbital elements), the reference frames & epochs (the ICRS, BCRS, GCRS, the ecliptic, J2000, B1950), the ephemeris systems (the JPL Development Ephemeris, the SPICE toolkit, JPL Horizons), and the time standards (Terrestrial Time, Barycentric Dynamical Time, UT1, the leap second, sidereal time, apparent solar time). Reuses universal gravitation, Kepler's laws, Kepler & Newton, the JPL organization, the Jupiter orbital resonances, the TAI & UTC standards, the precession discovery, the planets & JWST; nothing duplicated or fabricated

**History & Philosophy of Astronomical Discovery Encyclopedia (Program BD)**

- [History & Philosophy of Discovery](docs/DISCOVERY_HISTORY.md) — how astronomy became modern science, and how it knows what it knows: the thematic histories of discovery (the Copernican Revolution and the histories of the telescope, spectroscopy, radio astronomy, cosmology, exoplanets, gravitational waves & black holes), the methodologies of discovery (the scientific method, paradigm shifts & revolutions, instrumentation-driven discovery, observational bias, theory & observation, Big Science, the data & AI revolution), and the philosophy of science (realism, falsifiability, evidence, measurement uncertainty, replication, open science). Reuses the platform's astronomers, the astronomy eras, the spectroscopy/GW/error-analysis methods, the transit method, the Hubble tension, Sagittarius A*, the radio band & the reproducibility practice; nothing duplicated or fabricated

**Space Policy, Sustainability & Space Economy Encyclopedia (Program BC)**

- [Space Policy](docs/SPACE_POLICY.md) — the institutional and operational layer of modern space activity: the space-law treaties (the Outer Space Treaty and the Liability, Registration & Moon agreements, and the Artemis Accords), the policy & sustainability topics (orbital debris, the Kessler syndrome, situational awareness & traffic management, debris mitigation, mega-constellations, launch licensing, spectrum allocation, export control, space-resource & planetary-protection policy), the space-economy topics (commercial launch, the satellite economy, insurance, the space economy), and the governing bodies (UNOOSA, COSPAR, ITU, IAF). Reuses the platform's on-orbit-servicing process, the ISRU domain, the planetary-protection topic & contamination measures, the satellite impact, and NASA; nothing duplicated or fabricated

**Astrochemistry & the Molecular Universe Encyclopedia (Program BB)**

- [Astrochemistry](docs/ASTROCHEMISTRY.md) — how chemistry builds stars, planets, and the ingredients of life: the interstellar environments (the diffuse medium, molecular clouds, star-forming regions, protoplanetary disks, interstellar dust), the molecules of space (water, CO, CO₂, ammonia, HCN, methanol, PAHs, amino-acid precursors), and the astrochemical processes (gas-phase & grain-surface chemistry, photochemistry, shocks, prebiotic, planet-formation, cometary & meteoritic chemistry). Reuses the platform's spectroscopy method, ALMA & APEX, the JWST, the Orion Nebula, the origins-of-life topic, the Murchison & Allende meteorites, and the infrared/radio/submillimetre/ultraviolet bands; nothing duplicated or fabricated

**Comparative Planetology & Planetary Atmospheres Encyclopedia (Program BA)**

- [Comparative Planetology](docs/COMPARATIVE_PLANETOLOGY.md) — how planets and moons evolve, compared across the Solar System and beyond: the interior layers (core, mantle, crust), the planetary processes (differentiation, plate tectonics, volcanism & cryovolcanism, atmospheric escape, climate evolution, the greenhouse effect, atmospheric circulation, magnetospheric shielding, impact cratering), and the world-types (ocean worlds, lava worlds, and the proposed hycean planets). Reuses the platform's planets (Mercury–Neptune), moons (Titan, Europa, Enceladus, Io, Triton), Pluto, the super-Earth/mini-Neptune/hot-Jupiter classes, the magnetosphere, the cryovolcano feature, the habitable zone, and the ocean-worlds theme; hypothetical world-types labelled as proposed; nothing duplicated or fabricated

**Multi-Messenger & Gravitational-Wave Operations Encyclopedia (Program AZ)**

- [Multi-Messenger Astronomy](docs/MULTI_MESSENGER.md) — the knowledge layer of the new astronomy: the gravitational-wave detectors new to the graph (the operating GEO600 testbed, the proposed next-generation Einstein Telescope & Cosmic Explorer, and the space missions DECIGO, Taiji, TianQin), the detection methods (ground & space laser interferometry, pulsar timing arrays), the compact-binary-merger source classes (binary black hole, binary neutron star, black hole–neutron star), the alert systems (LVK public alerts, SCiMMA), the multi-messenger channels (GW with light, neutrinos, gamma rays, radio, optical), the follow-up workflow, and the data products (skymaps, waveforms, parameter estimation, the GWTC catalog). Reuses the platform's LIGO/Virgo/KAGRA detectors & the LISA concept, the GW/multi-messenger/neutrino methods, the transient classes, the alert systems, the standard-siren indicator, and the bands; nothing duplicated or fabricated

**Citizen Science, Amateur Astronomy & Public Observing Encyclopedia (Program AY)**

- [Citizen & Amateur Astronomy](docs/CITIZEN_ASTRONOMY.md) — the public participation layer of astronomy: the citizen-science projects (Zooniverse, Galaxy Zoo, Planet Hunters, Globe at Night, Aurorasaurus, Stardust@home), the amateur observing activities (backyard, variable-star, asteroid & comet observing, occultation timing, meteor observing), the equipment (binoculars, Dobsonian, equatorial mount, star tracker, camera, filters), the public outreach (star parties, public observatories, dark-sky parks, education), and the amateur organisations (AAVSO, IMO, ALPO). Reuses the platform's aurora, the occultation & photometry methods, the meteor showers & constellations, the eruptive-variable-star class, the Stardust mission, the transit method, the galaxy-morphology-classification application, the Rubin Observatory, and the MAST archive; nothing duplicated or fabricated

**Data Science, AI & Machine Learning in Astronomy Encyclopedia (Program AX)**

- [Astronomy & Machine Learning](docs/ASTRO_ML.md) — the computational layer of modern astronomy: the machine-learning methods (classification, regression, clustering, representation & self-supervised learning, foundation models, anomaly detection), the applications (galaxy morphology, supernova classification, photometric redshifts, transit & lens finding, source extraction, real-time alert classification), the community alert brokers (ALeRCE, ANTARES, Fink, Lasair), and the data engineering (training & benchmark datasets, feature extraction, model evaluation). Reuses the platform's Rubin Observatory & alert stream, the alert systems, the photometry & lensing methods, the galaxy morphologies, the transit method, the Type Ia supernova class, the redshift concept, and the reproducibility & data-pipeline practices; nothing duplicated or fabricated

**Heliophysics & Space Weather Operations Encyclopedia (Program AW)**

- [Heliophysics](docs/HELIOPHYSICS.md) — the operational layer of heliophysics: how the Sun drives space weather and how it reaches technology and people. The solar sources (the solar cycle, sunspots, active regions, coronal holes, the ionosphere), the operational impacts (satellites, GPS & navigation, aviation, human spaceflight, power grids, radio communications), and the forecasting (ESA's Space Weather Service Network, the counterpart to NOAA's SWPC). Reuses the platform's space-weather phenomena, the NOAA G/S/R scales, the SEP & Van Allen radiation environments, the Parker Solar Probe, Solar Orbiter, DSCOVR & ACE missions, and the SWPC; nothing duplicated or fabricated

**Cosmic Distance Ladder & Cosmological Tensions Encyclopedia (Program AV)**

- [Distance Ladder](docs/DISTANCE_LADDER.md) — the complete distance-measurement layer of modern cosmology and the tension it revealed: the distance indicators (RR Lyrae, the tip of the red giant branch, surface brightness fluctuations, the Tully–Fisher and Faber–Jackson relations, water megamasers, standard sirens), the cosmological parameters (Ωm, ΩΛ, σ8, ns), the SH0ES programme, and early dark energy. Reuses parallax, the Cepheid scale, Type Ia supernovae, BAO, the CMB, the Hubble constant & tension, dark energy & dark matter, and the Planck, Gaia, Hubble, JWST & DESI facilities; measured values are not invented; proposed resolutions are labelled unconfirmed; nothing duplicated or fabricated

**Ground-Based Observatories & Instrumentation Frontier Encyclopedia (Program AU)**

- [Observatory Frontier](docs/OBSERVATORY_FRONTIER.md) — the modern frontier of professional ground-based astronomy: the next-generation facilities still rising (the Giant Magellan Telescope, the ngVLA, and the Cherenkov Telescope Array), the adaptive-optics chain (laser guide stars, wavefront sensors, deformable mirrors), the spectrographs, coronagraphs and starshades, the detectors from the CCD to superconducting MKIDs and bolometers, the interferometry (radio, optical, VLBI, aperture synthesis), and the ground observing techniques (lucky imaging, speckle imaging, stacking, fringe tracking). Reuses the platform's ground observatories, the adaptive-optics/interferometry/spectroscopy methods, the SPHERE, MUSE & HIRES instruments, and the wavelength bands; facilities under construction stated as such; nothing duplicated or fabricated

**Space Data Archives & Open Science Infrastructure Encyclopedia (Program AT)**

- [Space Data Archives](docs/DATA_ARCHIVES.md) — where astronomy's data lives and how it is shared: the great science archives (MAST, the ESA archives, IRSA, HEASARC, NED, and the Strasbourg CDS with SIMBAD and VizieR, plus ESO and ALMA), the data standards astronomy is built on (FITS, VOTable, ASDF), the Virtual Observatory protocols that make the world's archives searchable as one (TAP, Cone Search, SIA, SSA), and the open-science practices — data pipelines and calibration, cross-matching, the ADS literature service, persistent identifiers, and FAIR reproducibility. Reuses the platform's operating organisations, the telescopes and surveys whose data the archives hold, the calibration method, the Harvard classification, and VOEvent; nothing duplicated or fabricated

**Planetary Defense & NEO Operations Encyclopedia (Program AS)**

- [Planetary Defense](docs/PLANETARY_DEFENSE.md) — the operational system that finds, tracks, assesses, and could deflect a hazardous near-Earth object: the NEO pipeline (discovery → orbit determination → characterization → impact monitoring → risk assessment & communication → decision → deflection), the Torino and Palermo risk scales, and the deflection methods from the DART-demonstrated kinetic impactor to theoretical nuclear concepts. Reuses the platform's survey telescopes, the Minor Planet Center & CNEOS, the DART & Hera missions, and the near-Earth objects; deflection maturity stated honestly; nothing duplicated or fabricated

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
