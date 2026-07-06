# Scientific Data Engine

Phase 10 introduces the **Scientific Data Engine** â the execution layer of
Asteria Star ([`src/platform/data-engine/`](../src/platform/data-engine)). The
website is only one consumer; mobile, desktop, a public API, an SDK, AI
assistants, research and educational tools, and planetarium software all read
through the same engine. **Nothing reads raw graph files directly.**

```ts
import { engine } from "@/platform/data-engine";
const mars  = engine.entity.resolve("planet:mars");
const walk  = engine.traversal.traverse("star:sirius", { maxDepth: 2 });
const moons = engine.query.run("moons-of-jupiter");
```

## Principles

- **Pure & deterministic** â same input, same output; BFS in stable order.
- **Composable & cacheable** â small modules; entity resolution is memoized.
- **Framework-independent** â no React, no Next.js, no UI imports (enforced by
  `npm run check:arch`). Future CLI- and API-compatible.
- **No duplicated logic** â facade engines delegate to the existing subsystems;
  only the traversal and query engines add new logic.

## Modules

| Engine | Responsibility | Input â Output |
| --- | --- | --- |
| `entity` | Resolve everything about an entity | id â `ResolvedEntity` (identity, metadata, relationships, sources, evidence, quality, timeline, images, datasets, learning, recommendations, localization, authority) |
| `relationship` | Typed relation access | id â `Connection[]` / grouped / by type / by domain |
| `traversal` | Walk the graph (NEW) | startId + options â `TraversalResult` (nodes, edges, paths) |
| `query` | Graph-derived scientific queries (NEW) | query id â `QueryResult` (entities, count, derivation) |
| `recommendation` | Graph-derived suggestions | id â `Recommendation[]` / shared-via / same-type |
| `timeline` | Curated chronologies | slug/path â `Timeline[]` |
| `comparison` | Rule-produced comparisons | slug â `Comparison` + resolved sides |
| `learning` | Structured learning (no AI) | topic/level â `LearningPath[]` / sequence |
| `discovery` | Topics + exploration paths | startId â `TraversalNode[]` |
| `metadata` | All metadata facets | `RuntimeEntity` â `EntityMetadata` |
| `source` | Source registry access | key(s) â `Source[]` |
| `citation` | Citation formatting | `Citation` + style â text |
| `dataset` | Dataset views & exports | slug â JSON / CSV |
| `authority` | Evidence/review/quality/version/provenance | id â authority data |
| `localization` | Localized text (id never localized) | id + locale â `LocalizedEntity` |
| `star` | Star encyclopedia resolver & queries | slug â `ResolvedStar`; brightest / nearest / by-constellation / by-type / visibility |
| `solar` | Solar System resolver & queries | slug â `ResolvedBody`; planets / moons / missions / by-kind |
| `launchVehicles` | Rockets & launch vehicles resolver & queries | slug â `ResolvedLaunchVehicle`; vehicles / families / engines / stages / propellants / providers / pads (see [ROCKETS.md](./ROCKETS.md)) |
| `constellations` | Constellation encyclopedia resolver & queries | slug â `ResolvedConstellation`; stars / deep-sky / exoplanets / meteor radiants / neighbours / family / season (see [CONSTELLATIONS.md](./CONSTELLATIONS.md)) |
| `satellites` | Satellite encyclopedia resolver & queries | slug â `ResolvedSatellite`; satellites / constellations / orbits / operators / networks; by category / orbit / operator (see [SATELLITES.md](./SATELLITES.md)) |
| `asteroids` | Asteroids & minor planets resolver & queries | slug â `ResolvedAsteroid`; families / groups / near-Earth classes / Trojans / resonances / impacts / planetary defense (see [ASTEROIDS.md](./ASTEROIDS.md)) |
| `comets` | Comets & small-body reservoirs resolver & queries | slug â `ResolvedComet`; classes / families / reservoirs / meteor-shower parents / mission targets / transition objects (see [COMETS.md](./COMETS.md)) |
| `meteorites` | Meteorites, fireballs & impact structures resolver & queries | slug â `ResolvedMeteorite`; classes / groups / falls / finds / martian / lunar / iron / fireballs / impact structures (see [METEORITES.md](./METEORITES.md)) |
| `interstellarObjects` | Interstellar & hyperbolic objects resolver & queries | slug â `ResolvedInterstellar`; confirmed / candidate / debated / hyperbolic comets / detection methods / trajectory classes / detection surveys â confirmed and candidate kept strictly separate (see [INTERSTELLAR_OBJECTS.md](./INTERSTELLAR_OBJECTS.md)) |
| `smallBodyMissions` | Small-body missions & sample return resolver & queries | slug â `ResolvedMission`; sample-return / comet / asteroid / planetary-defense / active / completed / future missions / returned samples / mission classes / timeline â reuses existing space missions (enriched, not duplicated); planned missions assert no past-tense outcomes (see [SMALL_BODY_MISSIONS.md](./SMALL_BODY_MISSIONS.md)) |
| `deepSpaceCommunications` | Deep-space communication & navigation infrastructure resolver & queries | slug â `ResolvedDSNetwork` / `ResolvedStation` / `ResolvedInfra`; networks / tracking + ground stations / antennas / signal bands / navigation / laser comms / mission support â reuses the DSN, Estrack & Near Space Network (enriched, not duplicated); signal light-time is real physics, never a fixed delay (see [DEEP_SPACE_COMMUNICATIONS.md](./DEEP_SPACE_COMMUNICATIONS.md)) |
| `spaceEnvironment` | Space environment & hazards resolver & queries | slug → `ResolvedEnv`; space-weather phenomena / radiation environments / hazards / indices / monitors — reuses the Sun, planets, and solar missions; states no live conditions (see [SPACE_ENVIRONMENT.md](./SPACE_ENVIRONMENT.md)) |
| `missionOperations` | Ground segment & mission operations resolver & queries | slug → `ResolvedOps`; operations centres / functions by category (control / dynamics / planning / health / lifecycle) — reuses the agencies, tracking networks, and missions (see [MISSION_OPERATIONS.md](./MISSION_OPERATIONS.md)) |
| `spacecraftSystems` | Spacecraft systems & engineering resolver & queries | slug → `ResolvedSys`; subsystems / components by category (power / propulsion / attitude / avionics / thermal / EDL) — reuses docking systems, life support, antennas, and attitude sensors (see [SPACECRAFT_SYSTEMS.md](./SPACECRAFT_SYSTEMS.md)) |
| `instruments` | Scientific instruments & payloads resolver & queries | slug → `ResolvedInstrument`; instrument classes / instruments by class / category (imaging / spectroscopy / fields-particles / active-sensing) — reuses and enriches existing instruments and their host missions (see [INSTRUMENTS.md](./INSTRUMENTS.md)) |
| `planetaryGeology` | Planetary geology & surface features resolver & queries | slug → `ResolvedGeo`; feature types / features by type / body / category (impact / volcanic / tectonic / icy / …) — reuses the planets, moons, and existing surface features (see [PLANETARY_GEOLOGY.md](./PLANETARY_GEOLOGY.md)) |
| `institutions` | Space agencies, institutions & laboratories resolver & queries | slug → `ResolvedInstitution`; institution types / orgs by type / member sets (agencies / field centers / laboratories / commercial / observatories) — reuses and enriches the existing agencies, companies, and observatory operators, wiring them part_of their parent agency (see [INSTITUTIONS.md](./INSTITUTIONS.md)) |
| `spaceflightHistory` | Space missions timeline & historical events resolver & queries | slug → `ResolvedTimeline`; eras / chronological timeline / events by era / by category / milestones / records — reuses the missions, programs, astronauts, stations, telescopes, and worlds, linking each event to what it concerns (see [SPACEFLIGHT_TIMELINE.md](./SPACEFLIGHT_TIMELINE.md)) |
| `spaceMedicine` | Life support, space biology & space medicine resolver & queries | slug → `ResolvedMed`; disciplines / physiological effects / life-support technologies / countermeasures (with the effects each mitigates) — reuses the ECLSS system, the radiation environments, the stations, and the astronauts (see [SPACE_MEDICINE.md](./SPACE_MEDICINE.md)) |
| `spaceInfrastructure` | Space manufacturing & in-space infrastructure resolver & queries | slug → `ResolvedInfra`; domains / ISRU techniques / manufacturing processes / infrastructure systems / by maturity — reuses the Moon, Mars, metal asteroids, commercial & inflatable stations, propellants, and components; maturity stated honestly (see [SPACE_INFRASTRUCTURE.md](./SPACE_INFRASTRUCTURE.md)) |
| `futureMissions` | Future space exploration & mission concepts resolver & queries | slug → `ResolvedConcept`; themes / concepts / by theme / by status / member sets — reuses the in-development missions (Europa Clipper, MMX, Comet Interceptor, JUICE, MSR, Roman), agencies, and target bodies; status/goals/uncertainties stated honestly (see [FUTURE_EXPLORATION.md](./FUTURE_EXPLORATION.md)) |
| `astronomyMethods` | Astronomy methods, measurements & techniques resolver & queries | slug → `ResolvedMethod`; categories / techniques / by category / member sets — reuses the exoplanet-detection methods, cosmology concepts, observing bands, Gaia, and the Harvard classification; uncertainty stated as part of the method (see [METHODS.md](./METHODS.md)) |
| `timeDomain` | Multi-wavelength & time-domain astronomy resolver & queries | slug → `ResolvedTimeDomain`; transient classes / alert systems / workflow stages / by category / spectrum bands — reuses the wavelength & messenger bands (the multi-wavelength axis), multi-messenger methods, surveys, and observatories (see [TIME_DOMAIN.md](./TIME_DOMAIN.md)) |
| `galaxies` | Galaxies, AGN & extragalactic universe resolver & queries | slug → `ResolvedExtragalactic`; galaxy morphologies / AGN types / galactic processes / cosmic structures — reuses the galaxies, the astrophysical object classes (AGN, quasar, blazar, clusters, voids), and the cosmology concepts (see [GALAXIES.md](./GALAXIES.md)) |
| `astrobiology` | Astrobiology, biosignatures & search for life resolver & queries | slug → `ResolvedAstrobiology`; disciplines / biosignatures / habitability factors / planetary-protection measures — reuses the ocean-world moons, Mars, the habitable-zone concept, SETI, and the life-search missions; no claim of life asserted (see [ASTROBIOLOGY.md](./ASTROBIOLOGY.md)) |
| `planetaryDefense` | Planetary defense & NEO operations resolver & queries | slug → `ResolvedDefense`; the NEO pipeline stages / risk scales / deflection methods — reuses the survey telescopes, the Minor Planet Center & CNEOS, the DART & Hera missions, and the near-Earth-object classes; deflection-method maturity stated honestly (see [PLANETARY_DEFENSE.md](./PLANETARY_DEFENSE.md)) |
| `dataArchives` | Space data archives & open-science infrastructure resolver & queries | slug → `ResolvedArchive`; the science archives / data standards / Virtual Observatory protocols / open-science practices — reuses the operating organisations (STScI, ESO, Caltech/IPAC, NASA, NRAO, NAOJ), the telescopes and surveys whose data the archives hold, the calibration method, the Harvard classification, and VOEvent; nothing fabricated (see [DATA_ARCHIVES.md](./DATA_ARCHIVES.md)) |
| `observatoryFrontier` | Ground-based observatories & instrumentation frontier resolver & queries | slug → `ResolvedFrontier`; the next-generation facilities (GMT, ngVLA, CTA — created with the reused telescope/observatory types) / instrumentation / detectors / interferometry / observing techniques — reuses the ground observatories, the adaptive-optics/interferometry/spectroscopy methods, the SPHERE/MUSE/HIRES instruments, and the wavelength bands; construction status stated honestly (see [OBSERVATORY_FRONTIER.md](./OBSERVATORY_FRONTIER.md)) |
| `distanceLadder` | Cosmic distance ladder & cosmological tensions resolver & queries | slug → `ResolvedDistance`; the distance indicators / cosmological parameters / the SH0ES programme (reused observational-programme type) / early dark energy (reused cosmology-concept type) — reuses parallax, the Cepheid scale, Type Ia supernovae, BAO, the CMB, the Hubble constant and tension, dark energy and dark matter, and the Planck/Gaia/HST/JWST/DESI facilities; measured values not invented (see [DISTANCE_LADDER.md](./DISTANCE_LADDER.md)) |
| `heliophysics` | Heliophysics & space weather operations resolver & queries | slug → `ResolvedHeliophysics`; the solar-source phenomena (reused space-weather-phenomenon type) / operational impacts / ESA's forecasting service (reused organization type, matching NOAA SWPC) — reuses the space-weather phenomena, the NOAA G/S/R scales, the SEP and Van Allen radiation environments, the Parker/Solar Orbiter/DSCOVR/ACE missions, and the SWPC; nothing fabricated (see [HELIOPHYSICS.md](./HELIOPHYSICS.md)) |
| `astroMl` | Data science, AI & machine learning in astronomy resolver & queries | slug → `ResolvedAstroMl`; the ML methods / astronomical applications / data-engineering workflows / community alert brokers (reused alert-system type) — reuses the Rubin Observatory and alert stream, the alert systems, the photometry/lensing methods, the galaxy morphologies, the transit method, the Type Ia supernova class, the redshift concept, and the open-science practices; nothing fabricated (see [ASTRO_ML.md](./ASTRO_ML.md)) |
| `citizenAstronomy` | Citizen science, amateur astronomy & public observing resolver & queries | slug → `ResolvedCitizen`; the citizen-science projects / amateur activities / observing equipment / public-outreach activities / amateur organisations (reused organization type) — reuses the aurora, the occultation and photometry methods, the meteor showers and constellations, the eruptive-variable-star class, the Stardust mission, the transit method, the galaxy-morphology-classification application, the Rubin Observatory, and the MAST archive; nothing fabricated (see [CITIZEN_ASTRONOMY.md](./CITIZEN_ASTRONOMY.md)) |
| `multiMessenger` | Multi-messenger & gravitational-wave operations resolver & queries | slug → `ResolvedMultiMessenger`; the gravitational-wave detectors (observatory/mission-concept types) / detection methods / merger source classes (transient-class type) / alert systems (alert-system type) / multi-messenger channels / follow-up stages / data products — reuses the LIGO/Virgo/KAGRA detectors and LISA concept, the gravitational-wave/multi-messenger/neutrino methods, the transient classes, the alert systems, the standard-siren indicator, and the bands; proposed detectors stated honestly (see [MULTI_MESSENGER.md](./MULTI_MESSENGER.md)) |
| `comparativePlanetology` | Comparative planetology & planetary atmospheres resolver & queries | slug → `ResolvedPlanetology`; the interior layers / planetary processes / exoplanet world-types (reused planetary-class type) — reuses the planets, moons, Pluto, the planetary classes, the magnetosphere, the cryovolcano feature, the habitable zone, and the ocean-worlds theme; hypothetical world-types stated as proposed (see [COMPARATIVE_PLANETOLOGY.md](./COMPARATIVE_PLANETOLOGY.md)) |
| `astrochemistry` | Astrochemistry & the molecular universe resolver & queries | slug → `ResolvedChemistry`; the interstellar environments / interstellar molecules / astrochemical processes — reuses the spectroscopy method, ALMA/APEX, JWST, the Orion Nebula, the origins-of-life topic, the Murchison/Allende meteorites, and the infrared/radio/submillimetre/ultraviolet bands; nothing fabricated (see [ASTROCHEMISTRY.md](./ASTROCHEMISTRY.md)) |
| `spacePolicy` | Space policy, sustainability & space economy resolver & queries | slug → `ResolvedPolicy`; the space-law treaties / policy & sustainability topics / space-economy topics / governing organisations (reused organization type) — reuses the on-orbit-servicing process, the ISRU domain, the planetary-protection topic and contamination measures, the satellite-impact, and NASA; nothing fabricated (see [SPACE_POLICY.md](./SPACE_POLICY.md)) |
| `discoveryHistory` | History & philosophy of astronomical discovery resolver & queries | slug → `ResolvedHistory`; the thematic histories / discovery methodologies / philosophy-of-science concepts — reuses the astronomers, the astronomy eras, the spectroscopy/gravitational-wave/error-analysis methods, the transit method, the Hubble tension, Sagittarius A*, the radio band, and the reproducibility practice; nothing fabricated (see [DISCOVERY_HISTORY.md](./DISCOVERY_HISTORY.md)) |
| `celestialMechanics` | Celestial mechanics & timekeeping resolver & queries | slug → `ResolvedMechanics`; the orbital-mechanics concepts / reference frames / ephemeris systems / time standards — reuses universal gravitation, Kepler & Newton, the JPL organization, the Jupiter orbital resonances, the TAI & UTC standards, the precession discovery, the planets & JWST; nothing fabricated (see [CELESTIAL_MECHANICS.md](./CELESTIAL_MECHANICS.md)) |
| `stellarAstrophysics` | Stellar astrophysics deep-dive resolver & queries | slug → `ResolvedStellarPhysics`; the stellar processes / nucleosynthesis pathways / physics concepts — reuses the white-dwarf, neutron-star, magnetar & black-hole classes, the supernova, kilonova & variable classes, the spectral-classification & asteroseismology methods, Big Bang nucleosynthesis, the molecular cloud, the Roche limit, Chandrasekhar & example stars/clusters/nebulae; nothing fabricated (see [STELLAR_ASTROPHYSICS.md](./STELLAR_ASTROPHYSICS.md)) |
| `galacticAstronomy` | Galactic astronomy & the Milky Way resolver & queries | slug → `ResolvedGalacticAstronomy`; the galactic structures / dynamical & archaeological phenomena — reuses the Milky Way, Sagittarius A*, the Local Group, the Magellanic Clouds, Andromeda & Triangulum, the dark-matter halo, the galaxy-rotation-curve method, the galaxy-merger process, Gaia & DR3, the interstellar medium & the stellar-populations concept; nothing fabricated (see [GALACTIC_ASTRONOMY.md](./GALACTIC_ASTRONOMY.md)) |
| `astroinformatics` | Astroinformatics & virtual research ecosystem resolver & queries | slug → `ResolvedAstroinformatics`; the research software / research computing / astroinformatics concepts — reuses the Virtual Observatory & TAP, the FITS & VOTable standards, the MAST/VizieR/SIMBAD archives, the reproducibility/persistent-identifier/data-pipeline practices, the ML methods, the Rubin Observatory & the LSST/SKA/Gaia facilities; nothing fabricated (see [ASTROINFORMATICS.md](./ASTROINFORMATICS.md)) |
| `deepSpaceExploration` | Deep-space human exploration & habitation resolver & queries | slug → `ResolvedDeepSpaceExploration`; the exploration architectures / deep-space challenges — reuses the Artemis program, the Lunar Gateway, in-situ resource utilisation & regolith processing, the ECLSS, closed-loop & bioregenerative life support, the countermeasures, the inflatable habitat, nuclear-thermal propulsion, the construction processes, planetary protection, the Deep Space Network & the space-medicine topics; nothing fabricated (see [DEEP_SPACE_EXPLORATION.md](./DEEP_SPACE_EXPLORATION.md)) |
| `skyAtlas` | Interactive sky atlas & 3D universe resolver & queries | slug → `ResolvedAtlas`; the atlas views / overlays — renders positional maps as SVG from the REAL measured RA/Dec in the star & deep-sky catalogs, and reuses the planets, moons, galaxies, exoplanets, constellations & the JWST/Hubble/Gaia facilities; no position fabricated (see [SKY_ATLAS.md](./SKY_ATLAS.md)) |
| `scientificCalculators` | Scientific calculators resolver, queries & evaluation | slug → `ResolvedCalculator`; also `compute(slug, inputs)`. 30 calculators across orbital / stellar / photometry / exoplanet / cosmology / instrument categories, each with a published formula + pure compute over CODATA 2018 & IAU 2015 constants; reuses gravitation, Kepler, Roche/Hill, the HR diagram, parallax, redshift, the transit method & the habitable zone. Every formula is validated against a known value; nothing fabricated (see [SCIENTIFIC_CALCULATORS.md](./SCIENTIFIC_CALCULATORS.md)) |
| `validation` | The single validator | () â `ValidationReport[]` |

The `star` engine powers the [Star Encyclopedia](./STAR_ENCYCLOPEDIA.md) â it
resolves stars from the typed catalogue with lightweight, index-driven lookups so
it scales across thousands of pages.

## Dependency graph

```
UI / API / CLI consumers
        â  (only)
        â¼
   data-engine  ââdelegatesâââ¶ runtime Â· metadata Â· authority Â· localization
        â                      lib/{datasets,sources,citations,compare,learn,
        â¼                            timelines,discovery,media}
   knowledge-graph (entities + relations)
        â¼
   lib/sources (leaf)
```

The engine sits in the **Registry layer**; it may depend on Graph, Knowledge,
Explorer, Data, and Source â never on Presentation. Acyclic and enforced.

## Entity Resolver â example

```ts
const e = engine.entity.resolve("planet:mars");
e.name;              // "Mars"
e.relationCount;     // 4
e.quality.overall;   // "partial"
e.reviewStatus;      // "unreviewed"
e.evidenceLevels;    // ["high","moderate","limited","historical","unknown"]
```

## Graph Traversal â example

```ts
engine.traversal.traverse("space_telescope:james-webb-space-telescope", {
  maxDepth: 2, domain: "scientific",
});
// nodes reach NASA/ESA/CSA and the nebulae JWST studies, then Hubble at depth 2.
engine.traversal.path("space_telescope:james-webb-space-telescope", "planet:mars");
// JWST â NASA â Mars Science Laboratory â Mars
```

Options: `maxDepth`, `maxNodes`, `relationTypes`, `domain`
(`scientific` | `interpretive` | `mixed`). Cycle protection via a visited set;
`maxNodes` caps the walk (`truncated: true`).

## Scientific Query â honesty

Queries are derived from the live graph (no hardcoded lists). Queries that would
require measurement data the graph does not hold (brightness, distance, size,
rings, nationality) are declared in `UNSUPPORTED_QUERIES` rather than fabricated.

## Extension points

- **New query** â add a `ScientificQuery` to `QUERIES` (a `run()` that reads the
  graph). Validated for unique ids and runnability.
- **New facade** â wrap a subsystem in a new `*-engine.ts` and add it to the
  `engine` object in `index.ts`.
- Plugins register via the platform [extension points](./EXTENSIONS.md).

## Failure modes

- Unknown id â resolvers/queries return `null` (never throw).
- Traversal from an unknown start â `null`; cycles are bounded by the visited set
  and `maxNodes`.
- The validation engine returns issue lists; it never throws on data problems.

## Performance

- Entity resolution is memoized by `id@locale` (results are immutable).
- Traversal/query are O(edges visited); `maxNodes`/`maxDepth` bound the cost.
- The authority snapshot resolves quality for all entities â fine at build scale;
  memoize if the graph grows much larger.

See [PLATFORM_ARCHITECTURE.md](./PLATFORM_ARCHITECTURE.md) and
[SCIENTIFIC_AUTHORITY.md](./SCIENTIFIC_AUTHORITY.md).
