import { getAllSections } from "@/lib/content/registry";
import { LEARNING_PATHS } from "@/lib/learn";
import { sectionPath, learnPath, ROUTES } from "@/lib/routes";

/**
 * Platform navigation model.
 *
 * Drives the premium grouped mega-menu and the mobile menu from one source. The
 * eight platform areas (Explore, Knowledge, Observatory, Learning, Datasets,
 * Community, Developers, Platform) are organized into a small set of header
 * groups so the header stays uncluttered.
 */

export interface NavLink {
  name: string;
  href: string;
  description?: string;
}

export interface NavColumn {
  title: string;
  links: NavLink[];
}

export interface NavGroup {
  id: string;
  label: string;
  /** A direct link (no panel) when set; otherwise a mega-menu with columns. */
  href?: string;
  columns?: NavColumn[];
}

export function getNavGroups(): NavGroup[] {
  const sections = getAllSections();
  const hubLinks: NavLink[] = sections.map((s) => ({
    name: s.name,
    href: sectionPath(s),
    description: s.tagline,
  }));
  const half = Math.ceil(hubLinks.length / 2);
  const featuredPaths: NavLink[] = LEARNING_PATHS.slice(0, 3).map((p) => ({
    name: p.title,
    href: learnPath(p.slug),
  }));

  return [
    {
      id: "explore",
      label: "Explore",
      columns: [
        {
          title: "Traverse the graph",
          links: [
            { name: "Star Encyclopedia", href: ROUTES.stars, description: "Thousands of real stars" },
            { name: "Solar System", href: ROUTES.solarSystem, description: "Planets, moons, missions" },
            { name: "Deep Sky", href: ROUTES.deepSky, description: "Galaxies, nebulae, clusters" },
            { name: "Exploration", href: ROUTES.exploration, description: "Missions, spacecraft, agencies" },
            { name: "Rockets & Launch Vehicles", href: ROUTES.rockets, description: "Rockets, engines, stages, propellants, pads" },
            { name: "Constellations", href: ROUTES.constellations, description: "The 88 IAU constellations, their stars & deep-sky objects" },
            { name: "Satellites", href: ROUTES.satellites, description: "Communications, navigation, Earth-observation & weather satellites" },
            { name: "Asteroids & Minor Planets", href: ROUTES.asteroids, description: "Asteroids, near-Earth objects, families, resonances & planetary defense" },
            { name: "Comets & Small Bodies", href: ROUTES.comets, description: "Comets, families, classes, the Oort cloud & meteor-shower parents" },
            { name: "Meteorites & Fireballs", href: ROUTES.meteorites, description: "Meteorites, classes, fireballs, impact structures & recovery sites" },
            { name: "Interstellar & Hyperbolic Objects", href: ROUTES.interstellarObjects, description: "ʻOumuamua, Borisov, ATLAS, hyperbolic comets, trajectory classes & detection" },
            { name: "Small-Body Missions", href: ROUTES.smallBodyMissions, description: "Sample return, flybys, orbiters, impactors & planetary defense — Hayabusa, OSIRIS-REx, Rosetta, DART" },
            { name: "Deep Space Network", href: ROUTES.deepSpaceNetwork, description: "Communication & navigation infrastructure — antennas, tracking stations, signal bands, DSN & Estrack" },
            { name: "Space Environment & Hazards", href: ROUTES.spaceEnvironment, description: "Space weather, radiation belts, cosmic rays, orbital debris & the missions that monitor them" },
            { name: "Mission Operations", href: ROUTES.missionOperations, description: "Ground segment: operations centres, flight dynamics, navigation ops, command & control" },
            { name: "Spacecraft Systems & Engineering", href: ROUTES.spacecraftSystems, description: "Subsystems & components: power, propulsion, avionics, thermal, attitude control, EDL" },
            { name: "Scientific Instruments & Payloads", href: ROUTES.instruments, description: "Cameras, spectrometers, magnetometers, radars, altimeters & seismometers by class" },
            { name: "Planetary Geology & Surface Features", href: ROUTES.planetaryGeology, description: "Craters, volcanoes, canyons, dunes & ice plains across Mars, the Moon, Venus, Titan & Pluto" },
            { name: "Space Agencies, Institutions & Laboratories", href: ROUTES.institutions, description: "Agencies, field centers, laboratories & commercial companies — NASA, ESA, JAXA, JPL, APL, SpaceX" },
            { name: "Space Missions Timeline & Historical Events", href: ROUTES.spaceflightTimeline, description: "The chronological history of spaceflight — Sputnik, Apollo, Shuttle, ISS, Voyager, Artemis; eras, firsts & records" },
            { name: "Life Support, Space Biology & Space Medicine", href: ROUTES.spaceMedicine, description: "The human-in-space layer — microgravity effects, radiation biology, ECLSS life support & countermeasures" },
            { name: "Space Manufacturing & In-Space Infrastructure", href: ROUTES.spaceInfrastructure, description: "The future engineering layer — ISRU, orbital manufacturing, depots, habitats, power & logistics" },
            { name: "Future Space Exploration & Mission Concepts", href: ROUTES.futureExploration, description: "Planned missions & concepts — Artemis, Mars Sample Return, Dragonfly, the Venus fleet, Roman, HWO, LISA" },
            { name: "Astronomy Methods, Measurements & Techniques", href: ROUTES.methods, description: "How astronomy works — parallax, spectroscopy, the distance ladder, lensing, gravitational waves & measurement" },
            { name: "Multi-Wavelength & Time-Domain Astronomy", href: ROUTES.timeDomain, description: "The dynamic universe — supernovae, gamma-ray bursts, kilonovae, FRBs, multi-messenger events & alert networks" },
            { name: "Galaxies, AGN & the Extragalactic Universe", href: ROUTES.galaxies, description: "Galaxy morphology, active galactic nuclei, mergers & starbursts, clusters, superclusters & the cosmic web" },
            { name: "Astrobiology, Biosignatures & the Search for Life", href: ROUTES.astrobiology, description: "Habitability, ocean worlds, biosignatures & false positives, technosignatures & SETI, planetary protection" },
            { name: "Planetary Defense & NEO Operations", href: ROUTES.planetaryDefense, description: "The NEO pipeline — discovery, tracking, impact risk (Torino/Palermo), DART & deflection methods" },
            { name: "Space Data Archives & Open Science", href: ROUTES.dataArchives, description: "Where the data lives — MAST, CDS, SIMBAD & VizieR, FITS, the Virtual Observatory & FAIR open science" },
            { name: "Observatories & Instrumentation Frontier", href: ROUTES.observatoryFrontier, description: "The giant telescopes of the coming decade — GMT, ngVLA, CTA, adaptive optics, detectors, interferometry & VLBI" },
            { name: "Cosmic Distance Ladder & Tensions", href: ROUTES.distanceLadder, description: "How the universe is measured — RR Lyrae, TRGB, standard sirens, the cosmological parameters & the Hubble tension" },
            { name: "Heliophysics & Space Weather", href: ROUTES.heliophysics, description: "The Sun's weather and its impacts — the solar cycle, coronal holes, satellites, GPS, power grids & forecasting" },
            { name: "Data Science, AI & ML in Astronomy", href: ROUTES.astroMl, description: "Computational astronomy — classification, anomaly detection, photo-z, alert brokers (ALeRCE, Fink) & benchmarks" },
            { name: "Human Spaceflight", href: ROUTES.humanSpaceflight, description: "Stations, crews, spacewalks" },
            { name: "Observatories", href: ROUTES.observatories, description: "Telescopes, surveys, bands" },
            { name: "Exoplanets", href: ROUTES.exoplanets, description: "Worlds beyond the Sun" },
            { name: "History of Astronomy", href: ROUTES.history, description: "How we discovered the universe" },
            { name: "Cosmology & Universe", href: ROUTES.cosmology, description: "The scientific model of the cosmos" },
            { name: "Night Sky", href: ROUTES.sky, description: "What to observe — meteor showers, eclipses, the Moon" },
            { name: "Image Archive", href: ROUTES.images, description: "Scientific imagery with verified provenance" },
            { name: "Explore", href: ROUTES.explore, description: "Topics, entities, and connections" },
            { name: "Discover", href: ROUTES.discover, description: "Curated entry points" },
            { name: "Entity Index", href: ROUTES.entityIndex, description: "Every entity, A–Z" },
            { name: "Topic Index", href: ROUTES.topicIndex, description: "Browse by topic" },
          ],
        },
        {
          title: "Tools",
          links: [
            { name: "Compare", href: ROUTES.compare, description: "Side-by-side entities" },
            { name: "Search", href: ROUTES.search, description: "The whole knowledge graph" },
          ],
        },
      ],
    },
    {
      id: "knowledge",
      label: "Knowledge",
      columns: [
        { title: "Hubs", links: hubLinks.slice(0, half) },
        { title: "More hubs", links: hubLinks.slice(half) },
      ],
    },
    {
      id: "learn",
      label: "Learn",
      columns: [
        {
          title: "Guided",
          links: [
            { name: "Learning Paths", href: ROUTES.learn, description: "Structured journeys" },
            { name: "Timelines", href: ROUTES.timelines, description: "Sourced chronologies" },
          ],
        },
        { title: "Featured paths", links: featuredPaths },
      ],
    },
    {
      id: "data",
      label: "Data & API",
      columns: [
        {
          title: "Open data",
          links: [
            { name: "Data Portal", href: ROUTES.data, description: "Datasets, exports & API" },
            { name: "Open Data", href: ROUTES.openData, description: "Standards & access" },
            { name: "Datasets", href: ROUTES.datasets, description: "JSON, CSV, JSON-LD" },
            { name: "Exports", href: "/data/exports", description: "Checksummed downloads" },
          ],
        },
        {
          title: "API",
          links: [
            { name: "API Reference", href: ROUTES.developersApi, description: "Read-only v0 endpoints" },
            { name: "OpenAPI", href: "/api/v0/openapi.json", description: "Machine-readable spec" },
            { name: "API Status", href: "/developers/status", description: "Implemented vs planned" },
          ],
        },
        {
          title: "Reference",
          links: [
            { name: "Developers", href: ROUTES.developers, description: "Build on the platform" },
            { name: "Registry", href: ROUTES.registry, description: "Schema & identifiers" },
            { name: "Licensing", href: "/data/licensing", description: "Terms & attribution" },
          ],
        },
      ],
    },
    {
      id: "platform",
      label: "Platform",
      columns: [
        {
          title: "Platform",
          links: [
            { name: "Platform Core", href: ROUTES.platform, description: "Architecture & registries" },
            { name: "Authority", href: ROUTES.authority, description: "Coverage & quality" },
            { name: "Transparency", href: ROUTES.transparency, description: "How it works" },
            { name: "Observatory", href: ROUTES.observatory, description: "Celestial data platform" },
          ],
        },
        {
          title: "Contribute",
          links: [
            { name: "Contribute", href: ROUTES.contribute, description: "Review-first workflow" },
            { name: "How it works", href: "/contribute/how-it-works", description: "The review lifecycle" },
            { name: "Guidelines", href: "/contribute/guidelines", description: "What makes a good proposal" },
            { name: "Proposal templates", href: "/contribute/templates", description: "Copyable, non-submitting" },
          ],
        },
        {
          title: "About",
          links: [
            { name: "Community", href: ROUTES.community },
            { name: "About", href: ROUTES.about },
            { name: "Editorial Policy", href: ROUTES.editorialPolicy },
            { name: "Sources", href: ROUTES.sourcesPolicy },
          ],
        },
      ],
    },
  ];
}

/** A flat list of all nav links, for the mobile menu and link audits. */
export function getNavLinks(): NavLink[] {
  return getNavGroups().flatMap((g) => (g.href ? [{ name: g.label, href: g.href }] : g.columns?.flatMap((c) => c.links) ?? []));
}
