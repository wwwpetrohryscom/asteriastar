import { getAllSections } from "@/lib/content/registry";
import { getEntriesByCategory, ENTRY_STATS } from "@/content/entries";
import { GRAPH_STATS, GRAPH_VERSION_INFO } from "@/knowledge-graph";
import { engine } from "@/platform/data-engine";
import { TOPICS, RELATIONSHIP_PAGES } from "@/lib/discovery";
import { DATASETS } from "@/lib/datasets";
import { IMPLEMENTED_ENDPOINTS, EXPORT_MANIFEST } from "@/platform/open-data";
import { contributionsEngine as CONTRIB, ALL_CONTRIBUTE_SECTIONS } from "@/platform/contributions";
import { COMPARISONS } from "@/lib/compare";
import { LEARNING_PATHS } from "@/lib/learn";
import { TIMELINES } from "@/lib/timelines";
import {
  absoluteUrl,
  categoryPath,
  sectionPath,
  topicPath,
  connectionPath,
  comparePath,
  learnPath,
  timelinePath,
  datasetPath,
  contributePath,
  ROUTES,
} from "@/lib/routes";
import { SITE } from "@/lib/site";

/**
 * Serves /llms.txt â an LLM-friendly map of the site, generated from the
 * content registry (see https://llmstxt.org). Kept in sync with the sitemap
 * automatically. Statically rendered at build time.
 */
export const dynamic = "force-static";

export function GET(): Response {
  const lines: string[] = [];

  lines.push(`# ${SITE.name}`);
  lines.push("");
  lines.push(`> ${SITE.tagline} ${SITE.positioning}`);
  lines.push("");
  lines.push(SITE.principle);
  lines.push("");
  lines.push(
    "Astronomy and the Sky Guide are scientific and source-backed. Astrology is presented as cultural and interpretive tradition, never as proven science.",
  );
  lines.push("");
  lines.push(
    `Content is organized in three levels: sections (hubs) â categories (topics) â entries (individual pages, e.g. a specific star, planet, mission, or zodiac sign). There are currently ${ENTRY_STATS.total} published entries at /[section]/[category]/[entry]. Entries are listed under their category below.`,
  );
  lines.push("");

  for (const section of getAllSections()) {
    lines.push(`## ${section.name} â ${section.tagline}`);
    lines.push(`${absoluteUrl(sectionPath(section))}`);
    lines.push("");
    for (const category of section.categories) {
      lines.push(
        `- [${category.name}](${absoluteUrl(categoryPath(section, category))}): ${category.summary}`,
      );
      for (const entry of getEntriesByCategory(section.slug, category.slug)) {
        lines.push(`  - [${entry.title}](${entry.canonicalUrl}): ${entry.excerpt}`);
      }
    }
    lines.push("");
  }

  lines.push("## Explore (knowledge graph)");
  lines.push(
    `A knowledge graph of ${GRAPH_STATS.entityCount} entities and ${GRAPH_STATS.relationCount} relations powers static discovery pages. Scientific, cultural, and astrological connections are kept separate.`,
  );
  lines.push(`- [Explore](${absoluteUrl(ROUTES.explore)})`);
  lines.push(`- [Entity index](${absoluteUrl(ROUTES.entityIndex)})`);
  lines.push(`- [Topic index](${absoluteUrl(ROUTES.topicIndex)})`);
  lines.push(`- [Discover](${absoluteUrl(ROUTES.discover)})`);
  for (const topic of TOPICS) {
    lines.push(`- [${topic.title}](${absoluteUrl(topicPath(topic.slug))}): ${topic.description}`);
  }
  for (const page of RELATIONSHIP_PAGES) {
    lines.push(`- [${page.title}](${absoluteUrl(connectionPath(page.slug))}): ${page.description}`);
  }
  lines.push("");

  lines.push("## Learn (learning paths)");
  for (const p of LEARNING_PATHS) {
    lines.push(`- [${p.title}](${absoluteUrl(learnPath(p.slug))}): ${p.description}`);
  }
  lines.push("");

  lines.push("## Compare");
  for (const c of COMPARISONS) {
    lines.push(`- [${c.title}](${absoluteUrl(comparePath(c.slug))}): ${c.description}`);
  }
  lines.push("");

  lines.push("## Timelines");
  for (const t of TIMELINES) {
    lines.push(`- [${t.title}](${absoluteUrl(timelinePath(t.slug))}): ${t.description}`);
  }
  lines.push("");
  lines.push(`Universal search: ${absoluteUrl(ROUTES.search)}`);
  lines.push("");

  lines.push("## Community (architecture preview)");
  lines.push(
    "Knowledge-first community architecture â no accounts, profiles, posts, feeds, or user data yet. User contributions will attach to graph entities; the graph stays the source of truth.",
  );
  lines.push(`- [Community](${absoluteUrl(ROUTES.community)})`);
  lines.push(`- [Observations](${absoluteUrl("/community/observations")})`);
  lines.push(`- [Astrophotography](${absoluteUrl("/community/astrophotography")})`);
  lines.push(`- [Collections](${absoluteUrl("/community/collections")})`);
  lines.push(`- [Contributors](${absoluteUrl("/community/contributors")})`);
  lines.push(`- [Learn Together](${absoluteUrl("/community/learning")})`);
  lines.push(`- [Explore Together](${absoluteUrl("/community/explore-together")})`);
  lines.push("");

  lines.push("## Star Encyclopedia");
  lines.push(
    `An open encyclopedia of ${engine.star.count.toLocaleString()} real stars across all 88 constellations, generated from the open HYG database (Hipparcos + Yale Bright Star + Gliese), CC BY-SA 4.0. No fabricated stars, measurements, or catalog identifiers.`,
  );
  lines.push(`- [Star Encyclopedia](${absoluteUrl("/stars")})`);
  lines.push(`- Brightest: ${absoluteUrl("/stars/discover/brightest")} Â· Nearest: ${absoluteUrl("/stars/discover/nearest")} Â· Variable: ${absoluteUrl("/stars/discover/variable")}`);
  lines.push(`- Every star resolves through the Scientific Data Engine; pages at /stars/{slug} and /stars/type/{slug}. Full constellation entries live at /constellations/{slug}.`);
  lines.push("");

  lines.push("## Solar System Encyclopedia");
  lines.push(
    `A reference encyclopedia of the Solar System â ${engine.solar.count} bodies (the Sun, 8 planets, dwarf planets, moons, asteroids, comets, missions, spacecraft, and surface features) as first-class entities, built on real NASA Planetary Fact Sheet + JPL data (public domain). No fabricated bodies or measurements.`,
  );
  lines.push(`- [Solar System Encyclopedia](${absoluteUrl("/solar-system")})`);
  lines.push(`- Planets: ${absoluteUrl("/solar-system/discover/all-planets")} Â· Moons: ${absoluteUrl("/solar-system/discover/natural-satellites")} Â· Missions: ${absoluteUrl("/solar-system/discover/planetary-missions")}`);
  lines.push(`- Every body resolves through the Scientific Data Engine; pages at /solar-system/{slug}.`);
  lines.push("");

  lines.push("## Deep Sky & Galaxy Encyclopedia");
  lines.push(
    `An encyclopedia of ${engine.deepSky.count} real deep-sky objects â galaxies, nebulae, and star clusters â as first-class entities, built on the open OpenNGC database (NGC/IC, Messier, and Caldwell catalogues; CC BY-SA 4.0). The Messier and Caldwell catalogues are complete. No fabricated objects, identifiers, or measurements.`,
  );
  lines.push(`- [Deep Sky Encyclopedia](${absoluteUrl("/deep-sky")})`);
  lines.push(`- Galaxies: ${absoluteUrl("/deep-sky/discover/all-galaxies")} Â· Nebulae: ${absoluteUrl("/deep-sky/discover/all-nebulae")} Â· Messier: ${absoluteUrl("/deep-sky/discover/messier-objects")} Â· Caldwell: ${absoluteUrl("/deep-sky/discover/caldwell-objects")}`);
  lines.push(`- Every object resolves through the Scientific Data Engine; pages at /deep-sky/{slug}.`);
  lines.push("");

  lines.push("## Space Exploration Encyclopedia");
  lines.push(
    `The history of human space exploration as a knowledge graph: ${engine.exploration.missionCount} missions plus space agencies, mission programs, launch vehicles, launch sites, spacecraft, astronauts, and scientific instruments â ${engine.exploration.count} interconnected entities. Curated from authoritative public sources (NASA, ESA, JPL, national agencies). No fabricated missions, launch dates, or discoveries.`,
  );
  lines.push(`- [Space Exploration Encyclopedia](${absoluteUrl("/exploration")})`);
  lines.push(`- Missions: ${absoluteUrl("/exploration/discover/all-missions")} Â· Human spaceflight: ${absoluteUrl("/exploration/discover/human-spaceflight")} Â· Launch vehicles: ${absoluteUrl("/exploration/discover/launch-vehicles")} Â· Agencies: ${absoluteUrl("/exploration/discover/space-agencies")}`);
  lines.push(`- Every mission, spacecraft, and agency resolves through the Scientific Data Engine; pages at /exploration/{slug}.`);
  lines.push("");

  lines.push("## Rockets & Launch Vehicles Encyclopedia");
  lines.push(
    `A source-backed encyclopedia of ${engine.launchVehicles.byKind("vehicle").length} launch vehicles plus rocket families, booster and upper stages, engines, propellants, launch providers, programs, and pads â ${engine.launchVehicles.count} records resolving through the Scientific Data Engine (engine.launchVehicles). Curated from agency user's manuals and manufacturer documentation (NASA, ESA, JAXA, ISRO, Roscosmos, SpaceX, ULA, Arianespace, Rocket Lab, Blue Origin). Specifications that are not reliably known are left blank â never invented; no fabricated payloads, thrusts, specific impulses, or launch counts.`,
  );
  lines.push(`- [Rockets & Launch Vehicles](${absoluteUrl("/rockets")})`);
  lines.push(`- Launch vehicles: ${absoluteUrl("/rockets/discover/all-launch-vehicles")} Â· Engines: ${absoluteUrl("/rockets/discover/rocket-engines")} Â· Families: ${absoluteUrl("/rockets/discover/rocket-families")} Â· Providers: ${absoluteUrl("/rockets/discover/launch-providers")}`);
  lines.push(`- Every rocket, engine, stage, and propellant resolves through the Scientific Data Engine; pages at /rockets/{slug}.`);
  lines.push("");

  lines.push("## Constellation Encyclopedia");
  lines.push(
    `All ${engine.constellations.count} official IAU constellations as first-class knowledge-graph entities (engine.constellations), each connected to its brightest stars, deep-sky objects, exoplanet hosts, meteor-shower radiants, mythology, family, and seasonal visibility. Boundaries, areas, and designations follow the International Astronomical Union; stars, deep-sky objects, exoplanets, and meteor showers are the platform's existing source-backed entities â reused, never duplicated. Unknown values are left blank; constellation visibility is not fabricated (the computed Live Sky tools are linked instead).`,
  );
  lines.push(`- [Constellations](${absoluteUrl("/constellations")})`);
  lines.push(`- All 88: ${absoluteUrl("/constellations/discover/all-constellations")} Â· Zodiac: ${absoluteUrl("/constellations/discover/zodiac")} Â· Families: ${absoluteUrl("/constellations/family/zodiacal")} Â· Seasonal sky: ${absoluteUrl("/constellations/season/winter")}`);
  lines.push(`- Every constellation resolves through the Scientific Data Engine; pages at /constellations/{slug}, with family/season/region and discover sub-hubs.`);
  lines.push("");

  lines.push("## Satellite Encyclopedia");
  lines.push(
    `${engine.satellites.count} individual artificial satellites plus ${engine.satellites.constellations().length} constellations, ${engine.satellites.orbits().length} orbit types, ${engine.satellites.operators().length} operators, and ${engine.satellites.networks().length} tracking networks as first-class knowledge-graph entities (engine.satellites) â spanning communications, navigation, Earth observation, weather, and science. Agencies, launch vehicles, and launch sites are the platform's existing source-backed entities â reused, never duplicated. Specifications, launch dates, operators, and orbital parameters are never fabricated; unknown values are left blank. No real-time tracking is performed and no pass times are stated â the computed Live Sky tools are linked instead.`,
  );
  lines.push(`- [Satellites](${absoluteUrl("/satellites")})`);
  lines.push(`- All satellites: ${absoluteUrl("/satellites/discover/all-satellites")} Â· Constellations: ${absoluteUrl("/satellites/discover/constellations")} Â· Earth observation: ${absoluteUrl("/satellites/discover/earth-observation")} Â· Orbits: ${absoluteUrl("/satellites/orbit/leo")}`);
  lines.push(`- Every satellite, constellation, orbit type, operator, and tracking network resolves through the Scientific Data Engine; pages at /satellites/{slug}, /satellites/constellation/{slug}, /satellites/orbit/{slug}, /satellites/operator/{slug}, and /satellites/network/{slug}.`);
  lines.push("## Asteroids & Minor Planets Encyclopedia");
  lines.push(
    `${engine.asteroids.count} minor planets (asteroids and dwarf planets) plus ${engine.asteroids.families().length} collisional families, ${engine.asteroids.groups().length} dynamical populations, ${engine.asteroids.neoClasses().length} near-Earth classes, ${engine.asteroids.trojans().length} Trojan groups, ${engine.asteroids.resonances().length} orbital resonances, and ${engine.asteroids.impacts().length} impact events as first-class knowledge-graph entities (engine.asteroids). Designations follow the IAU Minor Planet Center; orbits and sizes come from the NASA/JPL Small-Body Database. The five dwarf planets, the previously-modelled asteroids, and the small-body missions (Dawn, Hayabusa/2, OSIRIS-REx, DART, Psyche, Lucyâ¦) are REUSED and never duplicated; reused bodies keep their canonical pages. A planetary-defense knowledge layer covers hazard scales, surveys, and deflection â factual and non-sensational. Sizes/orbits/discovery data are never fabricated; unknown values are left blank.`,
  );
  lines.push(`- [Asteroids & Minor Planets](${absoluteUrl("/asteroids")})`);
  lines.push(`- Largest: ${absoluteUrl("/asteroids/discover/largest")} Â· Near-Earth: ${absoluteUrl("/asteroids/discover/near-earth-objects")} Â· Trojans: ${absoluteUrl("/asteroids/discover/trojans")} Â· Planetary defense: ${absoluteUrl("/asteroids/planetary-defense")}`);
  lines.push(`- New asteroids resolve at /asteroids/{slug}; families/groups/near-Earth classes/Trojans/resonances/impacts at /asteroids/{family,group,near-earth,trojans,resonance,impact}/{slug}.`);
  lines.push("");

  lines.push("## Comets & Small-Body Reservoirs Encyclopedia");
  lines.push(
    `${engine.comets.count} comets and transition objects plus ${engine.comets.classes().length} dynamical classes, ${engine.comets.families().length} genetic families, and ${engine.comets.reservoirs().length} source reservoirs as first-class knowledge-graph entities (engine.comets). Designations and orbits come from the IAU Minor Planet Center and the NASA/JPL Small-Body Database. The ten comets already modelled, the meteor showers, the missions (Rosetta, Giotto, Stardust, Deep Impactâ¦), and Program Y's trans-Neptunian reservoirs (Kuiper Belt, scattered disc, Centaurs) are REUSED and never duplicated; reused comets keep their canonical pages. Comets are linked to the meteor showers they parent (source_of_meteor_shower) and to their source reservoirs (belongs_to_reservoir). No live comet visibility or brightness is computed or fabricated â the Live Sky tools are linked instead.`,
  );
  lines.push(`- [Comets & Small-Body Reservoirs](${absoluteUrl("/comets")})`);
  lines.push(`- Periodic: ${absoluteUrl("/comets/discover/periodic-comets")} Â· Great comets: ${absoluteUrl("/comets/discover/great-comets")} Â· Meteor-shower parents: ${absoluteUrl("/comets/discover/meteor-shower-parents")} Â· Oort cloud: ${absoluteUrl("/comets/reservoir/oort-cloud")}`);
  lines.push(`- New comets resolve at /comets/{slug}; classes/families/reservoirs at /comets/{class,family,reservoir}/{slug}; transition objects at /comets/{active,dormant}/{slug}.`);
  lines.push("");

  lines.push("## Meteors, Meteorites & Fireballs Encyclopedia");
  lines.push(
    `${engine.meteorites.count} meteorites plus ${engine.meteorites.classes().length} classes, ${engine.meteorites.groups().length} groups, ${engine.meteorites.fireballs().length} fireballs, ${engine.meteorites.structures().length} impact structures, and ${engine.meteorites.sites().length} recovery sites as first-class knowledge-graph entities (engine.meteorites) â the capstone of the small-bodies trilogy (asteroids â comets â meteorites). Classifications and fall data come from the Meteoritical Bulletin Database. The parent bodies are REUSED graph entities: the asteroid Vesta (Program Y) for the HED meteorites, Mars for the Martian meteorites, and the Moon for the lunar meteorites (parent_body); the impact events and meteor showers are likewise reused, never duplicated. No live fireball detection is performed or fabricated â the Live Sky meteor-shower tools are linked instead.`,
  );
  lines.push(`- [Meteors, Meteorites & Fireballs](${absoluteUrl("/meteorites")})`);
  lines.push(`- Falls: ${absoluteUrl("/meteorites/discover/falls")} Â· Carbonaceous: ${absoluteUrl("/meteorites/discover/carbonaceous")} Â· Martian: ${absoluteUrl("/meteorites/discover/martian")} Â· Impact structures: ${absoluteUrl("/meteorites/discover/impact-structures")}`);
  lines.push(`- Meteorites resolve at /meteorites/{slug}; classes/groups at /meteorites/{class,group}/{slug}; fireballs, impact structures, and recovery sites at /meteorites/{fireball,impact-structure,site}/{slug}.`);
  lines.push("");

  lines.push("## Interstellar & Hyperbolic Objects Encyclopedia");
  lines.push(
    `${engine.interstellarObjects.count} confirmed interstellar objects (1I/Ê»Oumuamua, 2I/Borisov, 3I/ATLAS) plus ${engine.interstellarObjects.candidateInterstellarObjects().length} debated candidate, ${engine.interstellarObjects.hyperbolicComets().length} hyperbolic Solar-System comets, ${engine.interstellarObjects.detectionMethods().length} detection methods, and ${engine.interstellarObjects.trajectoryClasses().length} trajectory classes as first-class knowledge-graph entities (engine.interstellarObjects) â the coda to the small-body arc (asteroids â comets â meteorites â interstellar). Orbits and designations come from the IAU Minor Planet Center and the NASA/JPL Small-Body Database. HONEST STATUS is the governing rule: confirmed interstellar objects, unconfirmed candidates, and hyperbolic Solar-System comets are typed and displayed separately, and an interstellar origin (has_trajectory_class â interstellar-hyperbolic) is asserted ONLY for the confirmed objects; candidates such as the CNEOS 2014-01-08 bolide carry explicit uncertainty notes and are NEVER labelled confirmed. The reused comet class, Pan-STARRS / LSST, and NASA/JPL are never duplicated; new ATLAS/Catalina/Minor Planet Center/CNEOS entities are created. No "alien" or artificial-origin claims are made; no live visibility is computed or fabricated.`,
  );
  lines.push(`- [Interstellar & Hyperbolic Objects](${absoluteUrl("/interstellar-objects")})`);
  lines.push(`- Confirmed: ${absoluteUrl("/interstellar-objects/discover/confirmed")} Â· Debated: ${absoluteUrl("/interstellar-objects/discover/debated")} Â· Hyperbolic comets: ${absoluteUrl("/interstellar-objects/discover/hyperbolic-comets")} Â· Detection: ${absoluteUrl("/interstellar-objects/detection/excess-hyperbolic-velocity")}`);
  lines.push(`- Objects/comets resolve at /interstellar-objects/{slug}; detection methods at /interstellar-objects/detection/{slug}; trajectory classes at /interstellar-objects/trajectory/{slug}.`);
  lines.push("");

  lines.push("## Small-Body Missions & Sample Return Encyclopedia");
  lines.push(
    `${engine.smallBodyMissions.count} small-body missions (${engine.smallBodyMissions.completedMissions().length} completed/extended, ${engine.smallBodyMissions.activeSmallBodyMissions().length} active, ${engine.smallBodyMissions.futureMissions().length} planned/concept) plus ${engine.smallBodyMissions.classes().length} mission classes, ${engine.smallBodyMissions.returnedSamples().length} returned samples, ${engine.smallBodyMissions.capsules().length} sample-return capsules, ${engine.smallBodyMissions.phases().length} lifecycle phases, and 1 science campaign (engine.smallBodyMissions) â the engineering bridge across the small-body arc (asteroids/comets/meteorites/interstellar). Timelines, targets, launch vehicles, and sample masses come from NASA/JPL, ESA, and JAXA. The existing space missions (Hayabusa, OSIRIS-REx, Rosetta, DART, Lucyâ¦), their rockets (Program V), and target asteroids/comets (Programs Y/Z) are REUSED and enriched, never duplicated â reused missions keep their canonical page, so their /small-body-missions view is excluded from the sitemap. HONEST TENSE: a planned/concept/cancelled mission asserts no past-tense encounter and no returned sample. No fabricated timelines, targets, or outcomes.`,
  );
  lines.push(`- [Small-Body Missions & Sample Return](${absoluteUrl("/small-body-missions")})`);
  lines.push(`- Sample return: ${absoluteUrl("/small-body-missions/discover/sample-return")} Â· Planetary defense: ${absoluteUrl("/small-body-missions/discover/planetary-defense")} Â· Comet missions: ${absoluteUrl("/small-body-missions/discover/comet-missions")} Â· Timeline: ${absoluteUrl("/small-body-missions/discover/mission-timeline")}`);
  lines.push(`- Missions resolve at /small-body-missions/{slug} (reused ones canonical to their main page); mission classes at /small-body-missions/type/{slug}; returned samples at /small-body-missions/sample/{slug}.`);
  lines.push("");

  lines.push("## Deep Space Communications & Navigation Encyclopedia");
  lines.push(
    `${engine.deepSpaceCommunications.count} communication networks, ${engine.deepSpaceCommunications.trackingStations().length} deep-space tracking stations, ${engine.deepSpaceCommunications.groundStations().length} near-Earth ground stations, ${engine.deepSpaceCommunications.antennas().length} antennas, ${engine.deepSpaceCommunications.signalBands().length} signal bands, ${engine.deepSpaceCommunications.navigationMethods().length} navigation systems, and timing/communication systems (engine.deepSpaceCommunications) â the infrastructure layer beneath nearly every space program. Capabilities and antenna sizes come from NASA/JPL, ESA, and JAXA. The Deep Space Network, Estrack, and Near Space Network already exist as tracking_network entities and are REUSED and enriched (never duplicated) â reused networks keep their canonical page, so their /deep-space-network view is excluded from the sitemap; mission-support links reuse the existing spacecraft (Voyager, Cassini, JWST, Rosetta, Hayabusa, Psycheâ¦). Signal light-time is real physics (distance Ã· the speed of light), never a fabricated fixed delay. No fabricated capabilities, antenna sizes, or coverage.`,
  );
  lines.push(`- [Deep Space Communications & Navigation](${absoluteUrl("/deep-space-network")})`);
  lines.push(`- Tracking stations: ${absoluteUrl("/deep-space-network/discover/tracking-stations")} Â· Signal bands: ${absoluteUrl("/deep-space-network/band/x-band")} Â· Navigation: ${absoluteUrl("/deep-space-network/discover/navigation")} Â· Laser comms: ${absoluteUrl("/deep-space-network/discover/laser-communications")}`);
  lines.push(`- Networks resolve at /deep-space-network/network/{slug} (reused ones canonical to their existing page); stations at /deep-space-network/station/{slug}; antennas, bands, and navigation at /deep-space-network/{antenna,band,navigation}/{slug}.`);
  lines.push("");

  lines.push("## Space Environment & Hazards Encyclopedia");
  lines.push(`${engine.spaceEnvironment.count} space-weather phenomena, radiation environments, hazards, and indices (engine.spaceEnvironment) — the scientific layer of the hazards of space. Curated from NASA and NOAA. The Sun, planets, moons, and solar missions (Parker, Solar Orbiter) are REUSED; SOHO/SDO/ACE/DSCOVR and NOAA SWPC are added. No live conditions or forecasts are stated — NOAA SWPC is the operational source. No fabricated values.`);
  lines.push(`- [Space Environment & Hazards](${absoluteUrl("/space-environment")})`);
  lines.push(`- Space weather: ${absoluteUrl("/space-environment/discover/space-weather")} · Radiation: ${absoluteUrl("/space-environment/discover/radiation")} · Hazards: ${absoluteUrl("/space-environment/discover/hazards")}`);
  lines.push("");

  lines.push("## Ground Segment & Mission Operations Encyclopedia");
  lines.push(
    `${engine.missionOperations.centers().length} mission operations centres and ${engine.missionOperations.functions().length} operational functions (engine.missionOperations) — the operational infrastructure behind every mission. Curated from NASA, ESA, JAXA, ISRO, Roscosmos, and CNSA. The agencies, the tracking networks (DSN, Estrack), and the missions are REUSED, never duplicated. No fabricated data.`,
  );
  lines.push(`- [Ground Segment & Mission Operations](${absoluteUrl("/mission-operations")})`);
  lines.push(`- Centres: ${absoluteUrl("/mission-operations/discover/operations-centers")} · Flight dynamics: ${absoluteUrl("/mission-operations/discover/flight-dynamics")} · Lifecycle: ${absoluteUrl("/mission-operations/discover/mission-lifecycle")}`);
  lines.push("");

  lines.push("## Spacecraft Systems & Engineering Encyclopedia");
  lines.push(
    `${engine.spacecraftSystems.subsystems().length} spacecraft subsystems and ${engine.spacecraftSystems.components().length} components (engine.spacecraftSystems) — the engineering layer of spacecraft: structure, thermal, power, propulsion, attitude control, avionics, telecommunications, EDL, and robotics. Curated from NASA, ESA, and engineering references. The docking systems, life-support systems (ECLSS), antennas, and attitude sensors are REUSED, never duplicated. No fabricated data.`,
  );
  lines.push(`- [Spacecraft Systems & Engineering](${absoluteUrl("/spacecraft-systems")})`);
  lines.push(`- Power: ${absoluteUrl("/spacecraft-systems/discover/power")} · Propulsion: ${absoluteUrl("/spacecraft-systems/discover/propulsion")} · Avionics: ${absoluteUrl("/spacecraft-systems/discover/avionics")}`);
  lines.push("");

  lines.push("## Scientific Instruments & Payloads Encyclopedia");
  lines.push(
    `${engine.instruments.classes().length} instrument classes and ${engine.instruments.newInstrumentCount} notable instruments (engine.instruments) — the science-payload layer: cameras, spectrometers, magnetometers, particle/dust detectors, radar, laser altimeters, seismometers, and radio science. Curated from NASA and ESA. The many scientific_instrument entities already in the graph (Mars, JWST, Hubble, Juno, ground telescopes) are REUSED and enriched with their class, never duplicated; new instruments link to their reused host missions. No fabricated data.`,
  );
  lines.push(`- [Scientific Instruments & Payloads](${absoluteUrl("/instruments")})`);
  lines.push(`- Classes: ${absoluteUrl("/instruments/discover/classes")} · Imaging: ${absoluteUrl("/instruments/discover/imaging")} · Spectroscopy: ${absoluteUrl("/instruments/discover/spectroscopy")}`);
  lines.push("");

  lines.push("## Planetary Geology & Surface Features Encyclopedia");
  lines.push(
    `${engine.planetaryGeology.featureTypes().length} geological feature types and ${engine.planetaryGeology.featureCount} named surface features (engine.planetaryGeology) — the geology of the Solar System: impact craters and basins, volcanoes and cryovolcanoes, canyons, dunes, chaos terrain, ice plains, and hydrocarbon lakes across Mars, the Moon, Mercury, Venus, Ceres, Vesta, the icy moons, and Pluto. Curated from NASA/JPL. The planets, moons, dwarf planets, and existing surface_feature entities are REUSED and enriched, never duplicated. No fabricated data.`,
  );
  lines.push(`- [Planetary Geology & Surface Features](${absoluteUrl("/planetary-geology")})`);
  lines.push(`- Impact: ${absoluteUrl("/planetary-geology/discover/impact")} · Volcanic: ${absoluteUrl("/planetary-geology/discover/volcanic")} · Icy: ${absoluteUrl("/planetary-geology/discover/icy")}`);
  lines.push("");

  lines.push("## Space Missions Timeline & Historical Events Encyclopedia");
  lines.push(
    `${engine.spaceflightHistory.eras().length} eras and ${engine.spaceflightHistory.eventCount} dated events plus milestone firsts and standing records (engine.spaceflightHistory) — the chronological history of spaceflight, from Sputnik and Gagarin through Apollo, the Space Shuttle, the ISS, Voyager, Cassini, and New Horizons to Artemis. Curated from NASA, ESA, and national space-agency records. Every era, event, milestone, and record links to the REUSED missions, mission programs, astronauts, agencies, stations, telescopes, and worlds it concerns; those entities are never duplicated. Dates are given only to the precision that is well established. No fabricated events or dates.`,
  );
  lines.push(`- [Space Missions Timeline & Historical Events](${absoluteUrl("/timeline")})`);
  lines.push(`- Master timeline: ${absoluteUrl("/timeline/discover/master-timeline")} · Firsts: ${absoluteUrl("/timeline/discover/firsts-and-milestones")} · Records: ${absoluteUrl("/timeline/discover/records")}`);
  lines.push("");

  lines.push("## Life Support, Space Biology & Space Medicine Encyclopedia");
  lines.push(
    `${engine.spaceMedicine.topics().length} disciplines and ${engine.spaceMedicine.effectCount} physiological effects plus life-support technologies and countermeasures (engine.spaceMedicine) — the human-in-space layer: how microgravity and radiation change the body (bone and muscle loss, fluid shift, SANS vision changes, immune and radiation effects), the ECLSS technologies that keep a crew alive (oxygen, CO2 removal, water recovery, food, closed ecosystems), and the countermeasures (exercise, nutrition, shielding, lighting, psychological support). Curated from NASA and ESA human-research sources. Reuses the ECLSS life-support system, the radiation environments, the space stations, and the astronauts already in the graph; countermeasures link to the effects they mitigate. Quantitative figures are omitted unless well established. No fabricated data.`,
  );
  lines.push(`- [Life Support, Space Biology & Space Medicine](${absoluteUrl("/space-medicine")})`);
  lines.push(`- Effects: ${absoluteUrl("/space-medicine/discover/physiological-effects")} · Countermeasures: ${absoluteUrl("/space-medicine/discover/countermeasures")} · Life support: ${absoluteUrl("/space-medicine/discover/life-support-technologies")}`);
  lines.push("");

  lines.push("## Space Manufacturing & In-Space Infrastructure Encyclopedia");
  lines.push(
    `${engine.spaceInfrastructure.domains().length} domains and ${engine.spaceInfrastructure.itemCount} technologies (engine.spaceInfrastructure) — the future engineering layer: in-situ resource utilisation (water, oxygen, metals, and propellant from the Moon, Mars, and asteroids), in-space manufacturing (3D printing, in-space assembly, servicing, autonomous construction), and the infrastructure of a spacefaring economy (propellant depots, commercial and inflatable habitats, lunar bases, solar-power satellites, surface fission power, space tugs, orbital refuelling, and megastructure concepts such as space elevators and mass drivers). Curated from NASA and ESA. Reuses the Moon, Mars, metal asteroids, the commercial/inflatable stations (Gateway, Axiom, Genesis), the propellants, and the components already in the graph. Technology maturity is stated honestly — from operational (ISS 3D printing, MOXIE oxygen on Mars) to purely theoretical (space elevator). No fabricated data.`,
  );
  lines.push(`- [Space Manufacturing & In-Space Infrastructure](${absoluteUrl("/space-infrastructure")})`);
  lines.push(`- ISRU: ${absoluteUrl("/space-infrastructure/discover/resource-utilisation")} · Manufacturing: ${absoluteUrl("/space-infrastructure/discover/manufacturing")} · Infrastructure: ${absoluteUrl("/space-infrastructure/discover/infrastructure-systems")}`);
  lines.push("");

  lines.push("## Future Space Exploration & Mission Concepts Encyclopedia");
  lines.push(
    `${engine.futureMissions.themes().length} themes and ${engine.futureMissions.conceptCount} planned missions and concepts (engine.futureMissions) — a future-exploration authority: the Artemis return to the Moon (Artemis II & III), Mars Sample Return, the Venus fleet (DAVINCI, VERITAS, EnVision), the ocean worlds (Dragonfly, plus the reused Europa Clipper and JUICE), the next great observatories (the reused Roman plus Habitable Worlds Observatory, LISA, Athena), planetary defence (NEO Surveyor), and the outer Solar System (a Uranus orbiter, Interstellar Probe). Only official or credible concepts are included. Each states its status, agency, timeline, goals, target, technology, and uncertainties HONESTLY — dates only when publicly stated. Reuses the in-development missions, agencies, and target bodies already in the graph; nothing duplicated or fabricated.`,
  );
  lines.push(`- [Future Space Exploration & Mission Concepts](${absoluteUrl("/future-exploration")})`);
  lines.push(`- Human & lunar: ${absoluteUrl("/future-exploration/discover/human-and-lunar")} · Planetary: ${absoluteUrl("/future-exploration/discover/planetary-missions")} · Observatories: ${absoluteUrl("/future-exploration/discover/future-observatories")}`);
  lines.push("");

  lines.push("## Astronomy Methods, Measurements & Scientific Techniques Encyclopedia");
  lines.push(
    `${engine.astronomyMethods.categories().length} categories and ${engine.astronomyMethods.methodCount} techniques (engine.astronomyMethods) — how astronomy actually works: astrometry and parallax, photometry and the magnitude system, spectroscopy and spectral classification, interferometry and adaptive optics, the cosmic distance ladder (Cepheids, standard candles, redshift and the Hubble–Lemaître law), helioseismology and asteroseismology, gravitational lensing, gravitational-wave detection, neutrino and multi-messenger astronomy, CMB measurements, galaxy rotation curves and black-hole mass measurement, and the error analysis, calibration, and honest uncertainty that make a measurement science. Curated from NASA and ESA. Reuses the exoplanet-detection methods, cosmology concepts, observing bands, Gaia, and the Harvard classification already in the graph; nothing duplicated or fabricated. Uncertainty is part of the method, not hidden.`,
  );
  lines.push(`- [Astronomy Methods, Measurements & Techniques](${absoluteUrl("/methods")})`);
  lines.push(`- Distances: ${absoluteUrl("/methods/discover/the-distance-ladder")} · Light & spectra: ${absoluteUrl("/methods/discover/light-and-spectra")} · Beyond light: ${absoluteUrl("/methods/discover/beyond-light")}`);
  lines.push("");

  lines.push("## Multi-Wavelength & Time-Domain Astronomy Atlas");
  lines.push(
    `${engine.timeDomain.spectrumBands().length} reused wavelength/messenger bands and ${engine.timeDomain.transientCount} transient classes plus alert infrastructure and workflow stages (engine.timeDomain) — how the dynamic universe is observed across radio, infrared, optical, UV, X-ray and gamma-ray light and through gravitational waves, neutrinos, and cosmic rays. Transient classes: Type Ia and core-collapse supernovae, hypernovae, novae, gamma-ray bursts, magnetar flares, kilonovae, compact-binary mergers, tidal disruption events, fast radio bursts, and cataclysmic/eruptive variables. Alert infrastructure: GCN, VOEvent, the Transient Name Server, the Astronomer's Telegram, and the Rubin alert stream. Workflow: discovery → follow-up → confirmation → classification → publication. Curated from NASA and ESA. The multi-wavelength axis REUSES the existing observing bands (at /observatories/{band}), the multi-messenger methods, and the surveys/observatories; nothing duplicated or fabricated.`,
  );
  lines.push(`- [Multi-Wavelength & Time-Domain Astronomy](${absoluteUrl("/time-domain")})`);
  lines.push(`- Explosive: ${absoluteUrl("/time-domain/discover/explosive-transients")} · Relativistic & mergers: ${absoluteUrl("/time-domain/discover/relativistic-and-mergers")} · Alerts: ${absoluteUrl("/time-domain/discover/alert-infrastructure")}`);
  lines.push("");

  lines.push("## Galaxies, AGN & the Extragalactic Universe Encyclopedia");
  lines.push(
    `${engine.galaxies.morphologyCount} galaxy morphologies, ${engine.galaxies.agnTypes().length} AGN types, ${engine.galaxies.processes().length} galactic processes, and ${engine.galaxies.structures().length} named cosmic structures (engine.galaxies) — the extragalactic universe: galaxy morphology (spiral, barred, elliptical, lenticular, irregular, ring, dwarf, peculiar); active galactic nuclei (Seyfert, LINER, radio galaxy, BL Lac, and the unified model); galaxy evolution (mergers, interactions, starbursts, black-hole feedback, quenching); and large-scale structure (the Local Group, the Virgo and Coma clusters, Laniakea, the Sloan Great Wall, the Boötes Void). Curated from NASA and ESA. REUSES the platform's galaxies (Andromeda, M87, M82, Centaurus A, the Antennae, the Magellanic Clouds), the astrophysical object classes (AGN, quasar, blazar, galaxy cluster, supercluster, cosmic filament, void, dark-matter halo, supermassive black hole), and the cosmology concepts (the cosmic web, large-scale structure, dark matter); nothing duplicated or fabricated.`,
  );
  lines.push(`- [Galaxies, AGN & the Extragalactic Universe](${absoluteUrl("/galaxies")})`);
  lines.push(`- Morphology: ${absoluteUrl("/galaxies/discover/galaxy-morphology")} · AGN: ${absoluteUrl("/galaxies/discover/active-galactic-nuclei")} · Structures: ${absoluteUrl("/galaxies/discover/cosmic-structures")}`);
  lines.push("");

  lines.push("## Astrobiology, Biosignatures & the Search for Life Encyclopedia");
  lines.push(
    `${engine.astrobiology.topics().length} disciplines, ${engine.astrobiology.biosignatureCount} biosignatures, and habitability factors and planetary-protection measures (engine.astrobiology) — the science of life beyond Earth: origins of life, planetary habitability (liquid water, energy, chemical building blocks, extremophiles, subsurface oceans), the ocean worlds (Europa, Enceladus, Titan), biosignatures (atmospheric, surface, chemical, geological) and the FALSE POSITIVES that must be ruled out, technosignatures and SETI, and planetary protection (forward/backward contamination, sample handling). Curated from NASA and ESA. REUSES the ocean-world moons, Mars, the habitable-zone concept, the SETI Institute, the Europa Clipper/Dragonfly/Perseverance missions, and spectroscopy already in the graph. No claim of extraterrestrial life is asserted; biosignatures are potential and false positives are treated seriously. Nothing duplicated or fabricated.`,
  );
  lines.push(`- [Astrobiology, Biosignatures & the Search for Life](${absoluteUrl("/astrobiology")})`);
  lines.push(`- Biosignatures: ${absoluteUrl("/astrobiology/discover/biosignatures")} · Habitability: ${absoluteUrl("/astrobiology/discover/habitability")} · Planetary protection: ${absoluteUrl("/astrobiology/discover/planetary-protection")}`);
  lines.push("");

  lines.push("## Planetary Defense & NEO Operations Encyclopedia");
  lines.push(
    `A ${engine.planetaryDefense.stageCount}-stage NEO operations pipeline plus impact-risk scales and deflection methods (engine.planetaryDefense) — the end-to-end system to find, track, assess, and deflect a hazardous near-Earth object. Pipeline: discovery → orbit determination → characterization → impact monitoring → risk assessment → risk communication → decision & planning → deflection. Risk scales: the Torino and Palermo scales. Deflection methods with honest maturity: kinetic impactor (DEMONSTRATED by DART on Dimorphos in 2022), gravity tractor and ion-beam (concepts), nuclear (THEORETICAL, never tested, last resort). Curated from NASA, ESA, and the Minor Planet Center. REUSES the survey telescopes (Catalina, Pan-STARRS, ATLAS, LSST, Rubin), the Minor Planet Center and CNEOS, the DART and Hera missions and the NEO Surveyor concept, the near-Earth-object classes, and the asteroids Apophis and Bennu; nothing duplicated or fabricated.`,
  );
  lines.push(`- [Planetary Defense & NEO Operations](${absoluteUrl("/planetary-defense")})`);
  lines.push(`- NEO pipeline: ${absoluteUrl("/planetary-defense/discover/the-neo-pipeline")} · Risk scales: ${absoluteUrl("/planetary-defense/discover/risk-scales")} · Deflection: ${absoluteUrl("/planetary-defense/discover/deflection-methods")}`);
  lines.push("");

  lines.push("## Space Agencies, Institutions & Laboratories Encyclopedia");
  lines.push(
    `${engine.institutions.types().length} institution types and ${engine.institutions.orgCount} newly-modelled field centers and laboratories (engine.institutions) — the institutional structure of spaceflight: space agencies, agency field centers (NASA's Goddard, Johnson, Marshall, Kennedy; ESA's ESTEC, ESAC; JAXA's Tsukuba), research laboratories (JPL, APL), science institutes (SwRI, SETI), commercial companies, and observatory operators. Curated from NASA, ESA, and JAXA. The many organization entities already in the graph (the agencies, commercial companies, and observatory operators) are REUSED and enriched with their institution type and parent, never duplicated. No fabricated founding dates or figures.`,
  );
  lines.push(`- [Space Agencies, Institutions & Laboratories](${absoluteUrl("/institutions")})`);
  lines.push(`- Agencies: ${absoluteUrl("/institutions/discover/space-agencies")} · Field centers: ${absoluteUrl("/institutions/discover/field-centers")} · Laboratories: ${absoluteUrl("/institutions/discover/laboratories")}`);
  lines.push("");

  lines.push("## Space Stations & Human Spaceflight");
  lines.push(
    `How humans live and work in space: ${engine.humanSpaceflight.byKind("station").length} space stations (ISS, Mir, Skylab, Salyut, Tiangong, and planned stations) plus crewed and cargo spacecraft, ISS modules, expeditions, spacewalks, programs, and astronauts â ${engine.humanSpaceflight.count} interconnected entities. Curated from NASA, ESA, Roscosmos, JAXA, CSA, and Smithsonian sources. No fabricated crew, dates, EVAs, or modules; planned stations are clearly marked.`,
  );
  lines.push(`- [Space Stations & Human Spaceflight](${absoluteUrl("/human-spaceflight")})`);
  lines.push(`- Stations: ${absoluteUrl("/human-spaceflight/discover/all-space-stations")} Â· ISS modules: ${absoluteUrl("/human-spaceflight/discover/iss-modules")} Â· Crewed spacecraft: ${absoluteUrl("/human-spaceflight/discover/crewed-spacecraft")} Â· Expeditions: ${absoluteUrl("/human-spaceflight/discover/iss-expeditions")}`);
  lines.push(`- Every station, spacecraft, expedition, and person resolves through the Scientific Data Engine; pages at /human-spaceflight/{slug}.`);
  lines.push("");

  lines.push("## Observatories & Telescopes");
  lines.push(
    `The instruments and places humans use to observe the universe: ground observatories, ground and space telescopes, instruments, sky surveys, observing bands, and observing sites â ${engine.observatories.count} interconnected entities across every band of the electromagnetic spectrum and beyond (gravitational waves, neutrinos, multi-messenger). Curated from NASA, ESA, ESO, NOIRLab, NSF, NRAO, NAOJ, and STScI sources. No fabricated apertures, first-light dates, operators, or instruments; future facilities are clearly marked.`,
  );
  lines.push(`- [Observatories & Telescopes](${absoluteUrl("/observatories")})`);
  lines.push(`- Observatories: ${absoluteUrl("/observatories/discover/all-observatories")} Â· Space telescopes: ${absoluteUrl("/observatories/discover/space-telescopes")} Â· Largest: ${absoluteUrl("/observatories/discover/largest-telescopes")} Â· Surveys: ${absoluteUrl("/observatories/discover/sky-surveys")}`);
  lines.push(`- Every observatory, telescope, instrument, survey, and band resolves through the Scientific Data Engine; pages at /observatories/{slug}.`);
  lines.push("");

  lines.push("## Exoplanets Encyclopedia");
  lines.push(
    `An encyclopedia of ${engine.exoplanets.planetCount} confirmed exoplanets across ${engine.exoplanets.systemCount} multi-planet systems â with host stars, detection methods, planetary classes, and discovery missions â as first-class entities, built on the NASA Exoplanet Archive (Planetary Systems Composite Parameters). Host stars already in the Star Encyclopedia are reused, not duplicated. Every value is real archive data; nothing is inferred, and habitability is never asserted as certainty.`,
  );
  lines.push(`- [Exoplanets Encyclopedia](${absoluteUrl("/exoplanets")})`);
  lines.push(`- All: ${absoluteUrl("/exoplanets/discover/all-exoplanets")} Â· Nearby: ${absoluteUrl("/exoplanets/discover/nearby-exoplanets")} Â· Potentially habitable: ${absoluteUrl("/exoplanets/discover/potentially-habitable")} Â· Multi-planet systems: ${absoluteUrl("/exoplanets/discover/multi-planet-systems")}`);
  lines.push(`- Every planet, host star, system, detection method, and class resolves through the Scientific Data Engine; pages at /exoplanets/{slug}.`);
  lines.push("");

  lines.push("## History of Astronomy Encyclopedia");
  lines.push(
    `The history of humanity discovering the universe: ${engine.history.astronomerCount} astronomers, ${engine.history.discoveryCount} landmark discoveries, ${engine.history.publicationCount} historic publications, plus theories, catalogues, awards, and ${engine.history.eraCount} eras â all first-class knowledge-graph entities connected to observatories, telescopes, missions, and objects. Curated from authoritative sources (IAU, NASA, ESA, ESO, ADS, the Nobel Foundation, Britannica). Astronomers already in the graph are reused, not duplicated; nothing is fabricated.`,
  );
  lines.push(`- [History of Astronomy Encyclopedia](${absoluteUrl("/history")})`);
  lines.push(`- Timeline: ${absoluteUrl("/timelines/history-of-astronomy")} Â· Astronomers AâZ: ${absoluteUrl("/history/discover/astronomers-a-z")} Â· Discoveries: ${absoluteUrl("/history/discover/scientific-discoveries")} Â· Publications: ${absoluteUrl("/history/discover/historic-publications")} Â· Cosmology: ${absoluteUrl("/history/discover/history-of-cosmology")}`);
  lines.push(`- Every astronomer, discovery, publication, theory, catalogue, era, event, and award resolves through the Scientific Data Engine; pages at /history/{slug}.`);
  lines.push("");

  lines.push("## Cosmology & Universe Encyclopedia");
  lines.push(
    `The scientific model of the Universe: ${engine.cosmology.conceptCount} cosmological and physical concepts, ${engine.cosmology.modelCount} models, and ${engine.cosmology.objectCount} classes of astrophysical object â all first-class knowledge-graph entities. Every topic carries an EXPLICIT consensus classification (Established Science, Strong Evidence, Active Research, Scientific Debate, or Speculative Hypothesis); these are never conflated. Curated from authoritative sources (Planck Collaboration, NASA, ESA, ESO, LIGO, the Event Horizon Telescope, DESI, SDSS). Theories, discoveries, scientists, and observatories already in the graph are reused, not duplicated; nothing is fabricated.`,
  );
  lines.push(`- [Cosmology & Universe Encyclopedia](${absoluteUrl("/cosmology")})`);
  lines.push(`- Universe timeline: ${absoluteUrl("/timelines/universe-timeline")} Â· Big Bang: ${absoluteUrl("/cosmology/discover/big-bang")} Â· Dark matter: ${absoluteUrl("/cosmology/discover/dark-matter")} Â· Black holes: ${absoluteUrl("/cosmology/discover/black-holes")} Â· Scientific debates: ${absoluteUrl("/cosmology/discover/scientific-debates")} Â· Open questions: ${absoluteUrl("/cosmology/discover/open-questions")}`);
  lines.push(`- Every concept, model, object class, observational program, and physicist resolves through the Scientific Data Engine; pages at /cosmology/{slug}.`);
  lines.push("");

  lines.push("## Night Sky Platform");
  lines.push(
    `The architecture for a daily-use observing platform, built on top of the Knowledge Graph. IMPORTANT: no live data is fabricated. Data is either 'reference' (timeless, source-backed facts â e.g. the annual meteor-shower parameters from the IMO) or 'prepared' (architecture ready for a named provider, with NO current values shown). There are no fake positions, forecasts, ISS locations, solar-activity readings, or eclipse dates. Typed provider interfaces exist for JPL Horizons, the USNO almanac, NASA DONKI, NOAA SWPC, CelesTrak, the Minor Planet Center, the IMO, and NASA eclipse predictions â all currently 'planned', none connected.`,
  );
  lines.push(`- [Night Sky Platform](${absoluteUrl("/sky")})`);
  lines.push(`- Meteor showers: ${absoluteUrl("/sky/meteor-showers")} Â· Moon: ${absoluteUrl("/sky/moon")} Â· Planet visibility: ${absoluteUrl("/sky/planet-visibility")} Â· Eclipses: ${absoluteUrl("/sky/eclipses")} Â· Space weather: ${absoluteUrl("/sky/space-weather")} Â· Observing calendar: ${absoluteUrl("/sky/observing-calendar")}`);
  lines.push(`- Every meteor shower and sky module links to real graph entities (Moon, planets, comets, the ISS, the Sun); pages at /sky/{slug} and /sky/meteor-showers/{slug}. Every datum is status- and source-labelled.`);
  lines.push("");

  lines.push("## Scientific Image Archive");
  lines.push(
    `A provenance-first image catalogue where every image is a first-class knowledge-graph entity with verified provenance: source archive, instrument, capture/publication details where known, license, and credit. IMPORTANT: Asteria Star does NOT re-host or hotlink image binaries it has not verified, and never fabricates a photograph, credit, license, capture date, object name, or source URL â unknown fields are omitted, and each image links to its official source archive. Only openly-licensed or public-domain images (NASA public domain, CC BY 4.0) are catalogued. Every image links to at least one real graph entity (the depicted object, the capturing telescope/mission, and any related discovery). Automated ingest from NASA, STScI, ESA/Hubble, ESA/Webb, ESO, the EHT, NOIRLab, and Wikimedia is prepared (all 'planned').`,
  );
  lines.push(`- [Scientific Image Archive](${absoluteUrl("/images")})`);
  lines.push(`- Latest: ${absoluteUrl("/images/galleries/latest")} Â· JWST: ${absoluteUrl("/images/galleries/jwst")} Â· Hubble: ${absoluteUrl("/images/galleries/hubble")} Â· Black holes: ${absoluteUrl("/images/galleries/black-holes")} Â· Public domain: ${absoluteUrl("/images/galleries/public-domain")} Â· Astrophotography guides: ${absoluteUrl("/images/astrophotography")}`);
  lines.push(`- Every image, collection, license, and source resolves through the Scientific Data Engine; image pages at /images/{slug} carry ImageObject metadata. Astrophotography guides are kept separate from institutional imagery.`);
  lines.push("");

  lines.push("## Open data");
  lines.push(
    `Asteria Star is open infrastructure for structured celestial knowledge: a versioned (graph ${GRAPH_VERSION_INFO.graphVersion}, schema ${GRAPH_VERSION_INFO.schemaVersion}), machine-readable knowledge graph of ${GRAPH_VERSION_INFO.entityCount} entities. Stable ids are permanent (type:slug). License: ${GRAPH_VERSION_INFO.license}.`,
  );
  lines.push(`- [Platform Core](${absoluteUrl(ROUTES.platform)}) â layers, runtime, registries, extension points`);
  lines.push(`- [Authority Dashboard](${absoluteUrl(ROUTES.authority)}) â derived coverage & quality; no fabricated statistics`);
  lines.push(`- [Transparency](${absoluteUrl(ROUTES.transparency)}) â methodology, evidence framework, review process, provenance, scope`);
  lines.push(`- [Open Data](${absoluteUrl(ROUTES.openData)})`);
  lines.push(`- [Data Portal](${absoluteUrl(ROUTES.data)}) â datasets, exports, schemas, licensing, provenance, quality`);
  lines.push(`- [Datasets](${absoluteUrl(ROUTES.datasets)})`);
  lines.push(`- [Knowledge Registry](${absoluteUrl(ROUTES.registry)})`);
  lines.push(`- [Developers](${absoluteUrl(ROUTES.developers)})`);
  lines.push(`- Graph export (JSON): ${absoluteUrl("/data/graph.json")}`);
  lines.push(`- Graph export (JSON-LD): ${absoluteUrl("/data/graph.jsonld")}`);
  for (const d of DATASETS) {
    lines.push(`- [${d.title} Dataset](${absoluteUrl(datasetPath(d.slug))}): ${d.entityCount} entities Â· JSON ${absoluteUrl(`/datasets/${d.slug}/json`)} Â· CSV ${absoluteUrl(`/datasets/${d.slug}/csv`)}`);
  }
  lines.push("");

  lines.push("## Open Data API (v0)");
  lines.push(
    `Read-only, deterministic, engine-backed JSON API. Every response carries a provenance envelope (apiVersion, schemaVersion, dataVersion, generatedAt, source, license, attribution). No auth, no rate limits, no write endpoints. OpenAPI 3.1: ${absoluteUrl("/api/v0/openapi.json")}. Reference: ${absoluteUrl(ROUTES.developersApi)}.`,
  );
  for (const e of IMPLEMENTED_ENDPOINTS) {
    lines.push(`- ${e.method} ${absoluteUrl(e.path)} â ${e.summary}${e.example ? ` (e.g. ${absoluteUrl(e.example)})` : ""}`);
  }
  lines.push("Checksummed exports (SHA-256 in the manifest):");
  for (const [id, m] of Object.entries(EXPORT_MANIFEST.exports)) {
    lines.push(`- ${id}: ${absoluteUrl(m.file)} â ${m.recordCount} records`);
  }
  lines.push("");

  lines.push("## Contribute (scientific contributions & review workflow)");
  lines.push(
    `A controlled, review-first workflow (architecture preview). Every contribution is a structured PROPOSAL attached to a real knowledge-graph object â validated and reviewed before any versioned change. Not public editing, not a social network. ${CONTRIB.stats.types} contribution types, ${CONTRIB.stats.states} review states, ${CONTRIB.stats.roles} roles. No accounts, no database, no live submissions, no fabricated contributors/reviews/approvals.`,
  );
  lines.push(`- [Contribute](${absoluteUrl(ROUTES.contribute)})`);
  for (const s of ALL_CONTRIBUTE_SECTIONS) {
    lines.push(`- [${s.title}](${absoluteUrl(contributePath(s.slug))}): ${s.description}`);
  }
  lines.push(`- Read-only APIs: ${absoluteUrl("/api/v0/contribution-types")} Â· ${absoluteUrl("/api/v0/review-states")} Â· ${absoluteUrl("/api/v0/contribution-guidelines")}`);
  lines.push(`- Planned (not implemented): POST /api/v1/contributions`);
  lines.push("");

  lines.push("## Policies");
  lines.push(`- [About](${absoluteUrl(ROUTES.about)})`);
  lines.push(`- [Editorial Policy](${absoluteUrl(ROUTES.editorialPolicy)})`);
  lines.push(`- [Sources Policy](${absoluteUrl(ROUTES.sourcesPolicy)})`);
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
