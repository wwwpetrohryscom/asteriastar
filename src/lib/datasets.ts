import {
  getGraphEntitiesByType,
  type EntityType,
  type GraphEntity,
} from "@/knowledge-graph";
import { DATASET_VERSION, GRAPH_RELEASED } from "@/knowledge-graph/version";
import type { SourceKey } from "@/lib/sources";

/**
 * Public dataset registry.
 *
 * Datasets are VIEWS over the canonical knowledge graph — they are generated
 * from real typed entities, never fabricated, and never duplicate the graph
 * (they reference the same entities). Entity counts are computed live; checksums
 * are placeholders (published at release), not fabricated.
 */

export interface DatasetDef {
  slug: string;
  title: string;
  description: string;
  entityTypes: EntityType[];
  sources: SourceKey[];
  /** Optional narrowing: restrict the type-resolved entities to a specific subset (by entity id),
   *  when a dataset describes a named subset of a shared entity type rather than the whole type. */
  entityIds?: string[];
}

const DATASET_DEFS: DatasetDef[] = [
  { slug: "stars", title: "Stars", description: "Named stars in the knowledge graph, with their constellations and connections.", entityTypes: ["star"], sources: ["iau", "nasa", "simbad"] },
  { slug: "planets", title: "Planets", description: "The eight planets of the Solar System.", entityTypes: ["planet"], sources: ["nasa", "jpl"] },
  { slug: "dwarf-planets", title: "Dwarf Planets", description: "Recognized dwarf planets.", entityTypes: ["dwarf_planet"], sources: ["nasa", "iau", "jpl"] },
  { slug: "moons", title: "Moons", description: "Natural satellites of the planets and dwarf planets.", entityTypes: ["moon"], sources: ["nasa", "jpl"] },
  { slug: "exoplanets", title: "Exoplanets", description: "Worlds orbiting other stars, and their host systems.", entityTypes: ["exoplanet"], sources: ["nasa", "esa"] },
  { slug: "galaxies", title: "Galaxies", description: "Galaxies in the knowledge graph.", entityTypes: ["galaxy"], sources: ["nasa", "esa", "ned"] },
  { slug: "nebulae", title: "Nebulae", description: "Interstellar clouds — emission, planetary, and supernova remnants.", entityTypes: ["nebula"], sources: ["nasa", "esa"] },
  { slug: "deep-sky-objects", title: "Deep-Sky Objects", description: "Galaxies, nebulae, clusters, and black holes beyond the Solar System.", entityTypes: ["galaxy", "nebula", "star_cluster", "black_hole"], sources: ["nasa", "esa", "noirlab", "ned"] },
  { slug: "constellations", title: "Constellations", description: "Constellations referenced across the graph.", entityTypes: ["constellation"], sources: ["iau"] },
  { slug: "comets", title: "Comets", description: "Comets of the Solar System.", entityTypes: ["comet"], sources: ["nasa", "mpc"] },
  { slug: "asteroids", title: "Asteroids", description: "Notable asteroids and small bodies.", entityTypes: ["asteroid"], sources: ["jpl", "mpc"] },
  { slug: "meteor-showers", title: "Meteor Showers", description: "Annual meteor showers and their radiants.", entityTypes: ["meteor_shower"], sources: ["imo", "nasa"] },
  { slug: "missions", title: "Space Missions", description: "Crewed and robotic missions of exploration.", entityTypes: ["space_mission"], sources: ["nasa", "esa", "jpl"] },
  { slug: "telescopes", title: "Space Telescopes", description: "Orbiting observatories.", entityTypes: ["space_telescope"], sources: ["nasa", "esa"] },
  { slug: "observatories", title: "Observatories", description: "Ground-based observatories.", entityTypes: ["observatory"], sources: ["noirlab", "eso", "nasa"] },
  { slug: "launch-vehicles", title: "Launch Vehicles", description: "Rockets that carry missions to orbit and beyond.", entityTypes: ["launch_vehicle"], sources: ["nasa", "esa"] },
  { slug: "rocket-families", title: "Rocket Families", description: "Multi-generation launch-vehicle lineages — Saturn, Atlas, Delta, Falcon, Ariane, Long March, and more.", entityTypes: ["rocket_family"], sources: ["nasa", "esa"] },
  { slug: "rocket-engines", title: "Rocket Engines", description: "The engines that power the world's rockets, by combustion cycle and propellant.", entityTypes: ["rocket_engine"], sources: ["nasa", "esa"] },
  { slug: "rocket-stages", title: "Rocket Stages", description: "First-class booster, core, and upper stages of flagship launch vehicles.", entityTypes: ["rocket_stage"], sources: ["nasa"] },
  { slug: "propellants", title: "Rocket Propellants", description: "Fuel and oxidizer combinations — kerolox, hydrolox, methalox, hypergolics, and solids.", entityTypes: ["propellant"], sources: ["nasa"] },
  { slug: "launch-pads", title: "Launch Pads", description: "The pads and complexes where rockets lift off, under their launch sites.", entityTypes: ["launch_pad"], sources: ["nasa"] },
  { slug: "space-agencies", title: "Space Agencies", description: "Agencies and institutions of spaceflight and astronomy.", entityTypes: ["organization"], sources: ["nasa", "esa"] },
  { slug: "astronomers", title: "Astronomers", description: "Astronomers whose work shaped our understanding of the sky.", entityTypes: ["astronomer"], sources: ["britannica", "iau"] },
  { slug: "satellites", title: "Satellites", description: "Individual artificial satellites — communications, navigation, Earth-observation, weather, and science.", entityTypes: ["satellite"], sources: ["nasa", "esa", "noaa"] },
  { slug: "satellite-constellations", title: "Satellite Constellations", description: "Multi-satellite systems, from GPS and Galileo to Starlink and OneWeb.", entityTypes: ["satellite_constellation"], sources: ["nasa", "esa", "gunters"] },
  { slug: "orbit-types", title: "Orbit Types", description: "The orbital regimes satellites use — LEO, MEO, GEO, sun-synchronous, polar, and highly elliptical.", entityTypes: ["orbit_type"], sources: ["nasa", "esa"] },
  { slug: "tracking-networks", title: "Tracking Networks", description: "Ground networks that communicate with satellites and deep-space missions.", entityTypes: ["tracking_network"], sources: ["nasa", "esa"] },
  { slug: "asteroid-families", title: "Asteroid Families", description: "Collisional families of asteroids sharing a common parent body.", entityTypes: ["asteroid_family"], sources: ["nasa", "jpl"] },
  { slug: "near-earth-objects", title: "Near-Earth Object Classes", description: "The Apollo, Aten, Amor, and Atira near-Earth orbital classes.", entityTypes: ["near_earth_object"], sources: ["nasa", "jpl"] },
  { slug: "minor-planet-populations", title: "Minor-Planet Populations", description: "Dynamical populations and orbital resonances — main belt, Hilda, Trojans, Kuiper Belt, and more.", entityTypes: ["minor_planet_group", "trojan_group", "orbital_resonance"], sources: ["nasa", "jpl"] },
  { slug: "impact-events", title: "Impact Events", description: "Well-studied terrestrial asteroid and meteoroid impact events.", entityTypes: ["impact_event"], sources: ["nasa"] },
  { slug: "comet-classes", title: "Comet Classes", description: "Dynamical classes of comets — Jupiter-family, Halley-type, long-period, sungrazing, and main-belt.", entityTypes: ["comet_class"], sources: ["nasa", "jpl"] },
  { slug: "comet-families", title: "Comet Families", description: "Genetic comet families, such as the Kreutz sungrazers.", entityTypes: ["comet_family"], sources: ["nasa"] },
  { slug: "small-body-reservoirs", title: "Small-Body Reservoirs", description: "Comet source reservoirs — the Oort cloud and inner Oort cloud.", entityTypes: ["small_body_reservoir"], sources: ["nasa"] },
  { slug: "comet-transition-objects", title: "Comet Transition Objects", description: "Objects blurring the asteroid–comet boundary: active asteroids and dormant comets.", entityTypes: ["active_asteroid", "dormant_comet"], sources: ["nasa", "jpl"] },
  { slug: "meteorites", title: "Meteorites", description: "Individual meteorites — chondrites, achondrites, irons, and stony-irons.", entityTypes: ["meteorite"], sources: ["nasa"] },
  { slug: "meteorite-classes", title: "Meteorite Classes", description: "The classes and groups of meteorites — chondrites, HED, martian, lunar, pallasites, and more.", entityTypes: ["meteorite_class", "meteorite_group"], sources: ["nasa"] },
  { slug: "fireballs", title: "Fireballs", description: "Bright meteors and bolides that entered the atmosphere.", entityTypes: ["fireball"], sources: ["nasa"] },
  { slug: "impact-structures", title: "Impact Structures", description: "Terrestrial impact craters left by past impacts.", entityTypes: ["impact_structure"], sources: ["nasa"] },
  { slug: "recovery-sites", title: "Recovery Sites", description: "Strewn fields where meteorite fragments are recovered.", entityTypes: ["recovery_site"], sources: ["nasa"] },
  { slug: "interstellar-objects", title: "Interstellar Objects", description: "Confirmed interstellar objects — 1I/ʻOumuamua, 2I/Borisov, and 3I/ATLAS — with their hyperbolic orbits.", entityTypes: ["interstellar_object"], sources: ["mpc", "jpl"] },
  { slug: "interstellar-candidates", title: "Interstellar Candidates", description: "Debated and unconfirmed interstellar claims, kept separate from the confirmed objects.", entityTypes: ["interstellar_candidate"], sources: ["nasa", "jpl"] },
  { slug: "hyperbolic-comets", title: "Hyperbolic Comets", description: "Solar-System comets on hyperbolic or near-parabolic orbits — not interstellar.", entityTypes: ["hyperbolic_comet"], sources: ["mpc", "jpl"] },
  { slug: "trajectory-classes", title: "Trajectory Classes", description: "Orbital-trajectory classes by eccentricity — bound, near-parabolic, hyperbolic, and interstellar.", entityTypes: ["trajectory_class"], sources: ["jpl", "nasa"] },
  { slug: "interstellar-detection-methods", title: "Interstellar Detection Methods", description: "The methods used to identify objects originating beyond the Solar System.", entityTypes: ["interstellar_detection_method"], sources: ["jpl", "nasa"] },
  { slug: "mission-classes", title: "Mission Classes", description: "The classes of small-body mission — flyby, rendezvous, orbiter, lander, impactor, and sample return.", entityTypes: ["mission_class"], sources: ["nasa", "esa"] },
  { slug: "returned-samples", title: "Returned Samples", description: "Material returned to Earth from asteroids and comets — Itokawa, Ryugu, Bennu, and Wild 2.", entityTypes: ["returned_sample"], sources: ["nasa", "jaxa"] },
  { slug: "sample-return-capsules", title: "Sample-Return Capsules", description: "The reentry capsules that carried returned small-body samples back through the atmosphere.", entityTypes: ["sample_return_capsule"], sources: ["nasa", "jaxa"] },
  { slug: "mission-phases", title: "Mission Phases", description: "The generic lifecycle stages of a small-body mission, from launch and cruise to return and reentry.", entityTypes: ["mission_phase"], sources: ["nasa", "esa"] },
  { slug: "science-campaigns", title: "Science Campaigns", description: "Joint multi-mission science campaigns, such as the AIDA asteroid-deflection collaboration.", entityTypes: ["science_campaign"], sources: ["nasa", "esa"] },
  { slug: "tracking-stations", title: "Deep-Space Tracking Stations", description: "The ground complexes with giant antennas that track deep-space missions — Goldstone, Madrid, Canberra, and more.", entityTypes: ["tracking_station"], sources: ["nasa", "jpl", "esa"] },
  { slug: "ground-stations", title: "Ground Stations", description: "Near-Earth network ground terminals, including the TDRS gateway at White Sands.", entityTypes: ["ground_station"], sources: ["nasa"] },
  { slug: "antennas", title: "Antennas", description: "Ground and spacecraft antennas used for deep-space communication, from 70 m dishes to laser terminals.", entityTypes: ["antenna"], sources: ["nasa", "jpl"] },
  { slug: "signal-bands", title: "Signal Bands", description: "Communication signal bands — S, X, Ka, UHF, and optical (laser).", entityTypes: ["signal_band"], sources: ["nasa", "jpl"] },
  { slug: "navigation-methods", title: "Navigation Methods", description: "Deep-space navigation systems — radiometric tracking, Delta-DOR, optical, and autonomous navigation.", entityTypes: ["navigation_system"], sources: ["nasa", "jpl"] },
  { slug: "communication-technologies", title: "Communication Technologies", description: "Communication and timing systems — optical relays, TDRS, telemetry/tracking/command, and time standards.", entityTypes: ["communication_system", "time_standard"], sources: ["nasa", "jpl"] },
  { slug: "space-weather-phenomena", title: "Space-Weather Phenomena", description: "Solar wind, flares, coronal mass ejections, geomagnetic storms, and auroras.", entityTypes: ["space_weather_phenomenon"], sources: ["nasa", "noaa"] },
  { slug: "radiation-environments", title: "Radiation Environments", description: "The Van Allen belts, galactic cosmic rays, and solar energetic particles.", entityTypes: ["radiation_environment"], sources: ["nasa"] },
  { slug: "space-hazards", title: "Space Hazards", description: "Physical hazards to spacecraft — orbital debris, micrometeoroids, charging, and atomic oxygen.", entityTypes: ["space_hazard"], sources: ["nasa", "esa"] },
  { slug: "geomagnetic-indices", title: "Geomagnetic Indices", description: "Space-weather indices and scales — Kp, Dst, and the NOAA G/S/R scales.", entityTypes: ["geomagnetic_index"], sources: ["noaa"] },
  { slug: "operations-centers", title: "Mission Operations Centres", description: "The control centres that fly spacecraft — JPL's SFOF, ESA's ESOC, Houston's Mission Control, and more.", entityTypes: ["mission_operations_center"], sources: ["nasa", "esa"] },
  { slug: "operations-functions", title: "Operations Functions", description: "The functions of mission operations — mission control, flight dynamics, navigation, telemetry, fault protection, and the operations lifecycle.", entityTypes: ["operations_function"], sources: ["nasa", "esa"] },
  { slug: "spacecraft-subsystems", title: "Spacecraft Subsystems", description: "The major spacecraft subsystems — structure, thermal, power, propulsion, attitude control, avionics, and more.", entityTypes: ["spacecraft_subsystem"], sources: ["nasa", "esa"] },
  { slug: "spacecraft-components", title: "Spacecraft Components", description: "Components within spacecraft subsystems — solar arrays, RTGs, ion thrusters, reaction wheels, flight computers, heat shields, and more.", entityTypes: ["spacecraft_component"], sources: ["nasa", "esa"] },
  { slug: "instrument-classes", title: "Instrument Classes", description: "The classes of scientific instrument — cameras, spectrometers, magnetometers, radars, altimeters, seismometers, and more.", entityTypes: ["instrument_class"], sources: ["nasa", "esa"] },
  { slug: "scientific-instruments", title: "Scientific Instruments", description: "Scientific instruments and payloads across missions and telescopes.", entityTypes: ["scientific_instrument"], sources: ["nasa", "esa"] },
  { slug: "geological-feature-types", title: "Geological Feature Types", description: "The classes of geological feature — craters, volcanoes, canyons, dunes, chaos terrain, and more.", entityTypes: ["geological_feature_type"], sources: ["nasa"] },
  { slug: "surface-features", title: "Surface Features", description: "Named surface features across the planets, moons, and dwarf planets.", entityTypes: ["surface_feature"], sources: ["nasa", "jpl"] },
  { slug: "institution-types", title: "Institution Types", description: "The classes of space institution — space agencies, field centers, research laboratories, science institutes, commercial companies, and observatory operators.", entityTypes: ["institution_type"], sources: ["nasa", "esa"] },
  { slug: "space-institutions", title: "Space Agencies & Institutions", description: "Space agencies, field centers, laboratories, commercial companies, and observatory operators as first-class organizations.", entityTypes: ["organization"], sources: ["nasa", "esa"] },
  { slug: "spaceflight-eras", title: "Eras of Spaceflight", description: "The great historic periods of the space age, from the Space Race to the Artemis era.", entityTypes: ["historic_space_event"], sources: ["nasa"] },
  { slug: "spaceflight-timeline-events", title: "Spaceflight Timeline Events", description: "Dated landmark events in the history of spaceflight, from Sputnik to Artemis.", entityTypes: ["timeline_event"], sources: ["nasa", "esa"] },
  { slug: "spaceflight-milestones", title: "Spaceflight Milestones & Records", description: "Milestone firsts and standing records of spaceflight — first satellite, first human in space, most distant spacecraft, and more.", entityTypes: ["mission_milestone", "record"], sources: ["nasa"] },
  { slug: "space-physiological-effects", title: "Physiological Effects of Spaceflight", description: "How spaceflight changes the human body — bone and muscle loss, fluid shift, vision changes, radiation effects, and more.", entityTypes: ["physiological_effect"], sources: ["nasa"] },
  { slug: "life-support-technologies", title: "Life-Support Technologies & Countermeasures", description: "The ECLSS technologies and health countermeasures that keep crews alive and well in space.", entityTypes: ["life_support_technology", "countermeasure"], sources: ["nasa", "esa"] },
  { slug: "isru-and-manufacturing", title: "ISRU & In-Space Manufacturing", description: "In-situ resource-utilisation techniques and in-space manufacturing and construction processes.", entityTypes: ["isru_technique", "space_manufacturing_process"], sources: ["nasa"] },
  { slug: "space-infrastructure", title: "Space Infrastructure", description: "The infrastructure of a spacefaring economy — depots, habitats, power stations, tugs, and megastructure concepts.", entityTypes: ["space_infrastructure"], sources: ["nasa"] },
  { slug: "exploration-themes", title: "Future Exploration Themes", description: "The themes of future exploration — the Moon, Mars, Venus, ocean worlds, small bodies, observatories, and the outer Solar System.", entityTypes: ["exploration_theme"], sources: ["nasa"] },
  { slug: "mission-concepts", title: "Mission Concepts", description: "Official and credible planned missions and mission concepts, each with its status, goals, target, and uncertainties.", entityTypes: ["mission_concept"], sources: ["nasa", "esa"] },
  { slug: "method-categories", title: "Astronomy Method Categories", description: "The families of astronomical technique — astrometry, photometry, spectroscopy, the distance ladder, exoplanet detection, and more.", entityTypes: ["method_category"], sources: ["nasa"] },
  { slug: "astronomy-methods", title: "Astronomy Methods & Techniques", description: "The measurement and observation techniques of astronomy — parallax, spectroscopy, standard candles, gravitational lensing, and more.", entityTypes: ["astronomy_method"], sources: ["nasa", "esa"] },
  { slug: "transient-classes", title: "Transient & Time-Domain Classes", description: "The classes of transient phenomenon — supernovae, gamma-ray bursts, kilonovae, fast radio bursts, tidal disruption events, and more.", entityTypes: ["transient_class"], sources: ["nasa", "esa"] },
  { slug: "alert-infrastructure", title: "Transient Alert Infrastructure", description: "The alert systems and observation-workflow stages that turn a transient discovery into science — GCN, VOEvent, TNS, ATel, and the Rubin stream.", entityTypes: ["alert_system", "observation_stage"], sources: ["nasa"] },
  { slug: "galaxy-morphology-and-agn", title: "Galaxy Morphology & AGN", description: "The forms of galaxies, the types of active galactic nucleus, and the AGN unification model — spiral, elliptical, Seyfert, radio galaxy, blazar, and more.", entityTypes: ["galaxy_morphology", "agn_type", "agn_model"], sources: ["nasa", "esa"] },
  { slug: "extragalactic-structures", title: "Galactic Processes & Cosmic Structures", description: "The processes that shape galaxies and the large-scale structures they build — mergers, starbursts, feedback, the Local Group, clusters, superclusters, and voids.", entityTypes: ["galactic_process", "cosmic_structure"], sources: ["nasa"] },
  { slug: "biosignatures-and-habitability", title: "Biosignatures & Habitability", description: "The signs of life and the factors of planetary habitability — atmospheric, surface, chemical, and geological biosignatures, technosignatures, liquid water, energy, and extremophiles.", entityTypes: ["biosignature", "habitability_factor"], sources: ["nasa", "esa"] },
  { slug: "astrobiology-disciplines", title: "Astrobiology & Planetary Protection", description: "The disciplines of astrobiology and the planetary-protection measures that keep the search for life honest.", entityTypes: ["astrobiology_topic", "planetary_protection"], sources: ["nasa"] },
  { slug: "neo-operations", title: "NEO Operations & Risk Scales", description: "The near-Earth-object operations pipeline — discovery, orbit determination, characterization, impact monitoring, risk assessment — and the Torino and Palermo risk scales.", entityTypes: ["defense_stage", "risk_scale"], sources: ["nasa"] },
  { slug: "deflection-methods", title: "Asteroid Deflection Methods", description: "The methods of changing an asteroid's orbit — from the demonstrated kinetic impactor to theoretical nuclear concepts.", entityTypes: ["deflection_method"], sources: ["nasa"] },
  { slug: "science-data-archives", title: "Science Data Archives & Standards", description: "The archives that hold astronomy's data — MAST, the ESA archives, IRSA, HEASARC, NED, CDS with SIMBAD and VizieR — and the data standards astronomy is built on: FITS, VOTable, and ASDF.", entityTypes: ["data_archive", "data_standard"], sources: ["nasa", "esa", "eso"] },
  { slug: "virtual-observatory-open-science", title: "Virtual Observatory & Open Science", description: "The Virtual Observatory interoperability framework and the access protocols that make the world's archives searchable as one (TAP, Cone Search, SIA, SSA), plus the open-science practices — pipelines, cross-matching, the ADS, persistent identifiers, and FAIR reproducibility.", entityTypes: ["vo_framework", "vo_protocol", "open_science_practice"], sources: ["nasa"] },
  { slug: "observatory-instrumentation", title: "Observatory Instrumentation & Detectors", description: "The instrumentation frontier of ground-based astronomy — the adaptive-optics chain (laser guide stars, wavefront sensors, deformable mirrors), spectrographs, coronagraphs and starshades, and the detectors from CCDs to superconducting MKIDs and bolometers.", entityTypes: ["instrument_technique", "detector_technology"], sources: ["eso", "noirlab"] },
  { slug: "interferometry-observing-techniques", title: "Interferometry & Observing Techniques", description: "Combining separated apertures for the sharpest vision in astronomy (radio, optical, and continent-spanning VLBI, plus aperture synthesis) and the ground techniques that beat the atmosphere — lucky imaging, speckle imaging, stacking, and fringe tracking.", entityTypes: ["interferometry_technique", "observing_technique"], sources: ["eso", "noirlab"] },
  { slug: "distance-indicators", title: "Cosmic Distance Indicators", description: "The rungs of the distance ladder — RR Lyrae, the tip of the red giant branch, surface brightness fluctuations, the Tully–Fisher and Faber–Jackson relations, water megamasers, and standard sirens.", entityTypes: ["distance_indicator"], sources: ["nasa", "ligo"] },
  { slug: "cosmological-parameters", title: "Cosmological Parameters", description: "The numbers that describe the universe as a whole — the matter density (Ωm), the dark-energy density (ΩΛ), the amplitude of fluctuations (σ8), and the scalar spectral index (ns).", entityTypes: ["cosmological_parameter"], sources: ["planck"] },
  { slug: "space-weather-impacts", title: "Space Weather Operational Impacts", description: "How solar activity reaches technology and people — the impacts on satellites, GPS and navigation, aviation, human spaceflight, power grids, and radio communications.", entityTypes: ["space_weather_impact"], sources: ["swpc", "noaa"] },
  { slug: "astronomy-machine-learning", title: "Machine Learning in Astronomy", description: "The computational layer of astronomy — the machine-learning methods, the astronomical applications (galaxy morphology, photometric redshifts, real-time alert classification), and the data-engineering workflows.", entityTypes: ["ml_method", "ml_application", "ml_workflow"], sources: ["nasa", "noirlab"] },
  { slug: "citizen-science-and-amateur-astronomy", title: "Citizen Science & Amateur Astronomy", description: "The public participation layer of astronomy — the citizen-science projects, the amateur observing activities, the observing equipment, and the public-outreach activities.", entityTypes: ["citizen_science_project", "amateur_activity", "observing_equipment", "outreach_activity"], sources: ["nasa"] },
  { slug: "gravitational-wave-operations", title: "Gravitational-Wave Operations", description: "The operational layer of multi-messenger astronomy — the gravitational-wave detection methods, the multi-messenger channels, the follow-up stages, and the scientific data products (skymaps, waveforms, parameter estimation, the GWTC catalog).", entityTypes: ["gw_detection_method", "mm_channel", "gw_followup_stage", "gw_data_product"], sources: ["ligo"] },
  { slug: "planetary-interiors-and-processes", title: "Planetary Interiors & Processes", description: "How worlds are built and shaped — the interior layers (core, mantle, crust) and the planetary processes (differentiation, plate tectonics, volcanism, cryovolcanism, atmospheric escape, climate evolution, the greenhouse effect, atmospheric circulation, magnetospheric shielding, impact cratering).", entityTypes: ["planetary_interior", "planetary_process"], sources: ["nasa"] },
  { slug: "astrochemistry-and-molecules", title: "Astrochemistry & the Molecular Universe", description: "The chemistry of space — the interstellar environments, the interstellar molecules (water, CO, ammonia, methanol, PAHs, prebiotic precursors), and the astrochemical processes that build and destroy them.", entityTypes: ["interstellar_environment", "interstellar_molecule", "astrochemical_process"], sources: ["nasa", "eso"] },
  { slug: "space-policy-and-economy", title: "Space Policy, Sustainability & Economy", description: "The institutional layer of space activity — the space-law treaties (Outer Space Treaty, Liability, Registration, Moon, Artemis Accords), the policy and sustainability topics (orbital debris, Kessler syndrome, traffic management, mega-constellations), and the space-economy topics.", entityTypes: ["space_treaty", "space_policy_topic", "space_economy_topic"], sources: ["nasa"] },
  { slug: "history-and-philosophy-of-discovery", title: "History & Philosophy of Discovery", description: "How astronomy became modern science — the thematic histories of discovery, the methodologies of discovery (the scientific method, paradigm shifts, instrumentation-driven discovery), and the philosophy of science (realism, falsifiability, evidence, reproducibility).", entityTypes: ["history_theme", "discovery_methodology", "philosophy_of_science"], sources: ["nasa"] },
  { slug: "celestial-mechanics-and-frames", title: "Celestial Mechanics & Reference Frames", description: "The mathematical foundation of motion and time — the orbital-mechanics concepts (Kepler's laws, Lagrange points, resonances, tidal evolution), the reference frames and epochs (ICRS, J2000), and the ephemeris systems (JPL DE, SPICE, Horizons).", entityTypes: ["orbital_mechanics_concept", "reference_frame", "ephemeris_system"], sources: ["jpl", "iau"] },
  { slug: "stellar-astrophysics", title: "Stellar Astrophysics", description: "How stars form, live, forge the elements and die — the stellar processes (formation, main sequence, giant branches, mass loss, core collapse), the nucleosynthesis pathways (pp chain, CNO cycle, triple-alpha, s- and r-process), and the physics concepts (HR diagram, degeneracy pressure, IMF, metallicity, populations, binaries).", entityTypes: ["stellar_process", "nucleosynthesis_process", "stellar_physics_concept"], sources: ["nasa", "eso"] },
  { slug: "galactic-astronomy", title: "Galactic Astronomy & the Milky Way", description: "The anatomy and life of our Galaxy — the structural components (thin & thick discs, bulge, bar, stellar halo, spiral arms, warp, Galactic Centre, central molecular zone, corona) and the dynamical & archaeological phenomena (rotation & dark matter, stellar streams, radial migration, galactic archaeology, magnetic field, satellite accretion, the Andromeda collision).", entityTypes: ["galactic_structure", "galactic_dynamics"], sources: ["nasa", "eso"] },
  { slug: "astroinformatics", title: "Astroinformatics & the Virtual Research Ecosystem", description: "The software, computing, and data practices of data-intensive astronomy — the research software (scientific Python, Astropy, SunPy, Jupyter, Astroquery, visualisation), the research computing (HPC, GPU, cloud, distributed, science platforms, containers), and the concepts (workflows, provenance, query languages, big-data astronomy, the virtual research environment).", entityTypes: ["research_software", "research_computing", "astroinformatics_concept"], sources: ["nasa", "stsci", "noirlab"] },
  { slug: "deep-space-exploration", title: "Deep-Space Human Exploration & Habitation", description: "The architecture of sending humans beyond low Earth orbit to stay — the exploration architectures (Moon-to-Mars, lunar & Mars surface bases, transit habitats, surface power & mobility, construction, propulsion, Mars EDL) and the integrative human challenges (deep-space radiation, communication delay, Earth independence, long-duration life support, behavioural health, planetary protection, dust).", entityTypes: ["exploration_architecture", "deep_space_challenge"], sources: ["nasa"] },
  { slug: "sky-atlas", title: "Interactive Sky Atlas & 3D Universe", description: "The visual layer over the graph — the atlas views (all-sky star atlas, constellation, Messier & deep-sky maps, plus Solar System, Milky Way, Local Group, galaxy, planet, moon, exoplanet & distance-scale explorers) and the data overlays (constellation lines, observing conditions, JWST, Hubble, Gaia & telescope-field). Positional maps are rendered from the real measured coordinates in the star and deep-sky catalogues.", entityTypes: ["atlas_view", "atlas_overlay"], sources: ["hyg", "openngc", "iau"] },
  { slug: "scientific-calculators", title: "Scientific Calculators & Simulation Platform", description: "Interactive astronomy calculators, each carrying its published formula and a pure compute function over the CODATA 2018 and IAU 2015 constants: orbital mechanics (escape/orbital velocity, Kepler period, surface gravity, Schwarzschild radius, Hill & Roche limits, density, synodic period), stellar physics (luminosity, blackbody flux, Wien peak, mass–luminosity, main-sequence lifetime), photometry & distance (absolute magnitude, distance modulus, parallax, angular diameter & separation), exoplanets (equilibrium temperature, equal-insolation distance, transit probability), cosmology (redshift velocity, Hubble distance), and instruments (angular resolution, magnification, image scale, field of view, limiting magnitude, shot-noise SNR).", entityTypes: ["scientific_calculator"], sources: ["nasa"] },
  { slug: "observing-suite", title: "Professional Observatory Planning Suite", description: "The observing planners (tonight, visibility, target, Moon, planet, deep-sky, season, twilight, darkness, altitude, meridian-transit, equipment, astrophotography, session) built on the platform's real computed live-sky data and its observing equipment, sites and techniques, and the architecture-ready data integrations (weather, seeing, transparency, cloud cover, Bortle sky brightness) that await connected providers.", entityTypes: ["observing_planner", "observing_integration"], sources: ["nasa"] },
  { slug: "graph-explorer", title: "Scientific Knowledge Graph Explorer", description: "The graph-explorer views (statistics, knowledge metrics, entity & relation explorers, neighbourhood expansion, shortest-path finder, taxonomy explorer, cross-domain explorer, graph search, mission/institution/discovery/scientific-lineage graphs, force-directed/hierarchical/cluster visualisations, and the graph API). The computed views run real breadth-first algorithms over the actual knowledge graph.", entityTypes: ["graph_view"], sources: ["nasa"] },
  { slug: "scientific-assistant", title: "Scientific AI Research Assistant Platform", description: "The assistant capabilities — grounded (scientific search, object explanation, concept comparison, relationship explanation, evidence chains, provenance- & citation-aware answers, related concepts, reading recommendations, scientific summaries, learning-path generation, cross-domain reasoning, the no-hallucination layer) and architecture-ready (answer modes, RAG interfaces, prompt orchestration, conversation memory, LLM integration). The grounded capabilities run real retrieval over the actual graph and surface only real facts.", entityTypes: ["assistant_capability"], sources: ["nasa"] },
  { slug: "live-provider-registry", title: "Live Provider Registry", description: "The registry of real external scientific-data providers modelled with the honesty envelope — NOAA SWPC (space weather), NASA DONKI (solar activity), the Minor Planet Center and JPL/CNEOS (near-Earth objects), CelesTrak (orbital elements), and atmospheric conditions — each with its endpoint, licence, data kinds, and honest connection status.", entityTypes: ["live_data_source"], sources: ["nasa", "noaa"] },
  { slug: "space-weather-provider-status", title: "Space-Weather Provider Status", description: "The honest connection status of the space-weather and solar-activity providers (NOAA SWPC, NASA DONKI). No provider is connected in this deployment, so no solar-wind, Kp, flare, or CME value is served — every provider reports its real status and limitations.", entityTypes: ["live_data_source"], entityIds: ["live_data_source:noaa-swpc", "live_data_source:nasa-donki"], sources: ["nasa", "noaa"] },
  { slug: "near-earth-object-provider-status", title: "Near-Earth-Object Provider Status", description: "The honest connection status of the near-Earth-object providers (IAU Minor Planet Center, JPL/CNEOS). No provider is connected in this deployment, so no close-approach distance or date is served — every provider reports its real status and limitations.", entityTypes: ["live_data_source"], entityIds: ["live_data_source:minor-planet-center", "live_data_source:jpl-cneos"], sources: ["nasa", "jpl"] },
  { slug: "live-data-limitations", title: "Live-Data Limitations", description: "The stated limitations of every live-data integration — which are architecture-ready, which await a licence-safe provider, and what would be required to connect each. A transparency record: no live value, timestamp, or provider response is ever fabricated.", entityTypes: ["live_data_source"], sources: ["nasa"] },
];

export interface Dataset extends DatasetDef {
  entityCount: number;
  version: string;
  lastGenerated: string;
  license: string;
  /** Placeholder — checksums are published at release, never fabricated. */
  checksum: string;
  formats: { format: string; href?: string; status: "available" | "planned" }[];
}

function build(def: DatasetDef): Dataset {
  return {
    ...def,
    entityCount: getDatasetEntities(def).length,
    version: DATASET_VERSION,
    lastGenerated: GRAPH_RELEASED,
    license: "CC BY-SA 4.0",
    checksum: "—", // placeholder; published at release
    formats: [
      { format: "JSON", href: `/datasets/${def.slug}/json`, status: "available" },
      { format: "CSV", href: `/datasets/${def.slug}/csv`, status: "available" },
      { format: "JSON-LD", href: `/data/graph.jsonld`, status: "available" },
      { format: "RDF / Turtle", status: "planned" },
      { format: "GraphQL", status: "planned" },
    ],
  };
}

export const DATASETS: Dataset[] = DATASET_DEFS.map(build);

const BY_SLUG = new Map(DATASETS.map((d) => [d.slug, d]));
export function getDataset(slug: string): Dataset | undefined {
  return BY_SLUG.get(slug);
}

export function getDatasetEntities(def: DatasetDef): GraphEntity[] {
  const resolved = def.entityTypes.flatMap((t) => getGraphEntitiesByType(t));
  const narrowed = def.entityIds
    ? resolved.filter((e) => def.entityIds!.includes(e.id))
    : resolved;
  return narrowed.sort((a, b) => a.name.localeCompare(b.name));
}

/** Plain-object rows for export (no graph data duplicated beyond this view). */
export function datasetRows(def: DatasetDef) {
  return getDatasetEntities(def).map((e) => ({
    id: e.id,
    name: e.name,
    type: e.type,
    domain: e.domain,
    description: e.description ?? "",
    entryPath: e.entryPath ?? "",
  }));
}

/** Serialize dataset rows to CSV (RFC-4180-ish escaping). */
export function datasetToCsv(def: DatasetDef): string {
  const rows = datasetRows(def);
  const headers = ["id", "name", "type", "domain", "description", "entryPath"];
  const escape = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
  const lines = [headers.join(",")];
  for (const r of rows) {
    lines.push(headers.map((h) => escape((r as Record<string, string>)[h])).join(","));
  }
  return lines.join("\n");
}
