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
 * Serves /llms.txt — an LLM-friendly map of the site, generated from the
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
    `Content is organized in three levels: sections (hubs) → categories (topics) → entries (individual pages, e.g. a specific star, planet, mission, or zodiac sign). There are currently ${ENTRY_STATS.total} published entries at /[section]/[category]/[entry]. Entries are listed under their category below.`,
  );
  lines.push("");

  for (const section of getAllSections()) {
    lines.push(`## ${section.name} — ${section.tagline}`);
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
    "Knowledge-first community architecture — no accounts, profiles, posts, feeds, or user data yet. User contributions will attach to graph entities; the graph stays the source of truth.",
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
  lines.push(`- Brightest: ${absoluteUrl("/stars/discover/brightest")} · Nearest: ${absoluteUrl("/stars/discover/nearest")} · Variable: ${absoluteUrl("/stars/discover/variable")}`);
  lines.push(`- Every star resolves through the Scientific Data Engine; pages at /stars/{slug} and /stars/type/{slug}. Full constellation entries live at /constellations/{slug}.`);
  lines.push("");

  lines.push("## Solar System Encyclopedia");
  lines.push(
    `A reference encyclopedia of the Solar System — ${engine.solar.count} bodies (the Sun, 8 planets, dwarf planets, moons, asteroids, comets, missions, spacecraft, and surface features) as first-class entities, built on real NASA Planetary Fact Sheet + JPL data (public domain). No fabricated bodies or measurements.`,
  );
  lines.push(`- [Solar System Encyclopedia](${absoluteUrl("/solar-system")})`);
  lines.push(`- Planets: ${absoluteUrl("/solar-system/discover/all-planets")} · Moons: ${absoluteUrl("/solar-system/discover/natural-satellites")} · Missions: ${absoluteUrl("/solar-system/discover/planetary-missions")}`);
  lines.push(`- Every body resolves through the Scientific Data Engine; pages at /solar-system/{slug}.`);
  lines.push("");

  lines.push("## Deep Sky & Galaxy Encyclopedia");
  lines.push(
    `An encyclopedia of ${engine.deepSky.count} real deep-sky objects — galaxies, nebulae, and star clusters — as first-class entities, built on the open OpenNGC database (NGC/IC, Messier, and Caldwell catalogues; CC BY-SA 4.0). The Messier and Caldwell catalogues are complete. No fabricated objects, identifiers, or measurements.`,
  );
  lines.push(`- [Deep Sky Encyclopedia](${absoluteUrl("/deep-sky")})`);
  lines.push(`- Galaxies: ${absoluteUrl("/deep-sky/discover/all-galaxies")} · Nebulae: ${absoluteUrl("/deep-sky/discover/all-nebulae")} · Messier: ${absoluteUrl("/deep-sky/discover/messier-objects")} · Caldwell: ${absoluteUrl("/deep-sky/discover/caldwell-objects")}`);
  lines.push(`- Every object resolves through the Scientific Data Engine; pages at /deep-sky/{slug}.`);
  lines.push("");

  lines.push("## Space Exploration Encyclopedia");
  lines.push(
    `The history of human space exploration as a knowledge graph: ${engine.exploration.missionCount} missions plus space agencies, mission programs, launch vehicles, launch sites, spacecraft, astronauts, and scientific instruments — ${engine.exploration.count} interconnected entities. Curated from authoritative public sources (NASA, ESA, JPL, national agencies). No fabricated missions, launch dates, or discoveries.`,
  );
  lines.push(`- [Space Exploration Encyclopedia](${absoluteUrl("/exploration")})`);
  lines.push(`- Missions: ${absoluteUrl("/exploration/discover/all-missions")} · Human spaceflight: ${absoluteUrl("/exploration/discover/human-spaceflight")} · Launch vehicles: ${absoluteUrl("/exploration/discover/launch-vehicles")} · Agencies: ${absoluteUrl("/exploration/discover/space-agencies")}`);
  lines.push(`- Every mission, spacecraft, and agency resolves through the Scientific Data Engine; pages at /exploration/{slug}.`);
  lines.push("");

  lines.push("## Rockets & Launch Vehicles Encyclopedia");
  lines.push(
    `A source-backed encyclopedia of ${engine.launchVehicles.byKind("vehicle").length} launch vehicles plus rocket families, booster and upper stages, engines, propellants, launch providers, programs, and pads — ${engine.launchVehicles.count} records resolving through the Scientific Data Engine (engine.launchVehicles). Curated from agency user's manuals and manufacturer documentation (NASA, ESA, JAXA, ISRO, Roscosmos, SpaceX, ULA, Arianespace, Rocket Lab, Blue Origin). Specifications that are not reliably known are left blank — never invented; no fabricated payloads, thrusts, specific impulses, or launch counts.`,
  );
  lines.push(`- [Rockets & Launch Vehicles](${absoluteUrl("/rockets")})`);
  lines.push(`- Launch vehicles: ${absoluteUrl("/rockets/discover/all-launch-vehicles")} · Engines: ${absoluteUrl("/rockets/discover/rocket-engines")} · Families: ${absoluteUrl("/rockets/discover/rocket-families")} · Providers: ${absoluteUrl("/rockets/discover/launch-providers")}`);
  lines.push(`- Every rocket, engine, stage, and propellant resolves through the Scientific Data Engine; pages at /rockets/{slug}.`);
  lines.push("");

  lines.push("## Constellation Encyclopedia");
  lines.push(
    `All ${engine.constellations.count} official IAU constellations as first-class knowledge-graph entities (engine.constellations), each connected to its brightest stars, deep-sky objects, exoplanet hosts, meteor-shower radiants, mythology, family, and seasonal visibility. Boundaries, areas, and designations follow the International Astronomical Union; stars, deep-sky objects, exoplanets, and meteor showers are the platform's existing source-backed entities — reused, never duplicated. Unknown values are left blank; constellation visibility is not fabricated (the computed Live Sky tools are linked instead).`,
  );
  lines.push(`- [Constellations](${absoluteUrl("/constellations")})`);
  lines.push(`- All 88: ${absoluteUrl("/constellations/discover/all-constellations")} · Zodiac: ${absoluteUrl("/constellations/discover/zodiac")} · Families: ${absoluteUrl("/constellations/family/zodiacal")} · Seasonal sky: ${absoluteUrl("/constellations/season/winter")}`);
  lines.push(`- Every constellation resolves through the Scientific Data Engine; pages at /constellations/{slug}, with family/season/region and discover sub-hubs.`);
  lines.push("");

  lines.push("## Satellite Encyclopedia");
  lines.push(
    `${engine.satellites.count} individual artificial satellites plus ${engine.satellites.constellations().length} constellations, ${engine.satellites.orbits().length} orbit types, ${engine.satellites.operators().length} operators, and ${engine.satellites.networks().length} tracking networks as first-class knowledge-graph entities (engine.satellites) — spanning communications, navigation, Earth observation, weather, and science. Agencies, launch vehicles, and launch sites are the platform's existing source-backed entities — reused, never duplicated. Specifications, launch dates, operators, and orbital parameters are never fabricated; unknown values are left blank. No real-time tracking is performed and no pass times are stated — the computed Live Sky tools are linked instead.`,
  );
  lines.push(`- [Satellites](${absoluteUrl("/satellites")})`);
  lines.push(`- All satellites: ${absoluteUrl("/satellites/discover/all-satellites")} · Constellations: ${absoluteUrl("/satellites/discover/constellations")} · Earth observation: ${absoluteUrl("/satellites/discover/earth-observation")} · Orbits: ${absoluteUrl("/satellites/orbit/leo")}`);
  lines.push(`- Every satellite, constellation, orbit type, operator, and tracking network resolves through the Scientific Data Engine; pages at /satellites/{slug}, /satellites/constellation/{slug}, /satellites/orbit/{slug}, /satellites/operator/{slug}, and /satellites/network/{slug}.`);
  lines.push("## Asteroids & Minor Planets Encyclopedia");
  lines.push(
    `${engine.asteroids.count} minor planets (asteroids and dwarf planets) plus ${engine.asteroids.families().length} collisional families, ${engine.asteroids.groups().length} dynamical populations, ${engine.asteroids.neoClasses().length} near-Earth classes, ${engine.asteroids.trojans().length} Trojan groups, ${engine.asteroids.resonances().length} orbital resonances, and ${engine.asteroids.impacts().length} impact events as first-class knowledge-graph entities (engine.asteroids). Designations follow the IAU Minor Planet Center; orbits and sizes come from the NASA/JPL Small-Body Database. The five dwarf planets, the previously-modelled asteroids, and the small-body missions (Dawn, Hayabusa/2, OSIRIS-REx, DART, Psyche, Lucy…) are REUSED and never duplicated; reused bodies keep their canonical pages. A planetary-defense knowledge layer covers hazard scales, surveys, and deflection — factual and non-sensational. Sizes/orbits/discovery data are never fabricated; unknown values are left blank.`,
  );
  lines.push(`- [Asteroids & Minor Planets](${absoluteUrl("/asteroids")})`);
  lines.push(`- Largest: ${absoluteUrl("/asteroids/discover/largest")} · Near-Earth: ${absoluteUrl("/asteroids/discover/near-earth-objects")} · Trojans: ${absoluteUrl("/asteroids/discover/trojans")} · Planetary defense: ${absoluteUrl("/asteroids/planetary-defense")}`);
  lines.push(`- New asteroids resolve at /asteroids/{slug}; families/groups/near-Earth classes/Trojans/resonances/impacts at /asteroids/{family,group,near-earth,trojans,resonance,impact}/{slug}.`);
  lines.push("");

  lines.push("## Comets & Small-Body Reservoirs Encyclopedia");
  lines.push(
    `${engine.comets.count} comets and transition objects plus ${engine.comets.classes().length} dynamical classes, ${engine.comets.families().length} genetic families, and ${engine.comets.reservoirs().length} source reservoirs as first-class knowledge-graph entities (engine.comets). Designations and orbits come from the IAU Minor Planet Center and the NASA/JPL Small-Body Database. The ten comets already modelled, the meteor showers, the missions (Rosetta, Giotto, Stardust, Deep Impact…), and Program Y's trans-Neptunian reservoirs (Kuiper Belt, scattered disc, Centaurs) are REUSED and never duplicated; reused comets keep their canonical pages. Comets are linked to the meteor showers they parent (source_of_meteor_shower) and to their source reservoirs (belongs_to_reservoir). No live comet visibility or brightness is computed or fabricated — the Live Sky tools are linked instead.`,
  );
  lines.push(`- [Comets & Small-Body Reservoirs](${absoluteUrl("/comets")})`);
  lines.push(`- Periodic: ${absoluteUrl("/comets/discover/periodic-comets")} · Great comets: ${absoluteUrl("/comets/discover/great-comets")} · Meteor-shower parents: ${absoluteUrl("/comets/discover/meteor-shower-parents")} · Oort cloud: ${absoluteUrl("/comets/reservoir/oort-cloud")}`);
  lines.push(`- New comets resolve at /comets/{slug}; classes/families/reservoirs at /comets/{class,family,reservoir}/{slug}; transition objects at /comets/{active,dormant}/{slug}.`);
  lines.push("");

  lines.push("## Meteors, Meteorites & Fireballs Encyclopedia");
  lines.push(
    `${engine.meteorites.count} meteorites plus ${engine.meteorites.classes().length} classes, ${engine.meteorites.groups().length} groups, ${engine.meteorites.fireballs().length} fireballs, ${engine.meteorites.structures().length} impact structures, and ${engine.meteorites.sites().length} recovery sites as first-class knowledge-graph entities (engine.meteorites) — the capstone of the small-bodies trilogy (asteroids → comets → meteorites). Classifications and fall data come from the Meteoritical Bulletin Database. The parent bodies are REUSED graph entities: the asteroid Vesta (Program Y) for the HED meteorites, Mars for the Martian meteorites, and the Moon for the lunar meteorites (parent_body); the impact events and meteor showers are likewise reused, never duplicated. No live fireball detection is performed or fabricated — the Live Sky meteor-shower tools are linked instead.`,
  );
  lines.push(`- [Meteors, Meteorites & Fireballs](${absoluteUrl("/meteorites")})`);
  lines.push(`- Falls: ${absoluteUrl("/meteorites/discover/falls")} · Carbonaceous: ${absoluteUrl("/meteorites/discover/carbonaceous")} · Martian: ${absoluteUrl("/meteorites/discover/martian")} · Impact structures: ${absoluteUrl("/meteorites/discover/impact-structures")}`);
  lines.push(`- Meteorites resolve at /meteorites/{slug}; classes/groups at /meteorites/{class,group}/{slug}; fireballs, impact structures, and recovery sites at /meteorites/{fireball,impact-structure,site}/{slug}.`);
  lines.push("");

  lines.push("## Interstellar & Hyperbolic Objects Encyclopedia");
  lines.push(
    `${engine.interstellarObjects.count} confirmed interstellar objects (1I/ʻOumuamua, 2I/Borisov, 3I/ATLAS) plus ${engine.interstellarObjects.candidateInterstellarObjects().length} debated candidate, ${engine.interstellarObjects.hyperbolicComets().length} hyperbolic Solar-System comets, ${engine.interstellarObjects.detectionMethods().length} detection methods, and ${engine.interstellarObjects.trajectoryClasses().length} trajectory classes as first-class knowledge-graph entities (engine.interstellarObjects) — the coda to the small-body arc (asteroids → comets → meteorites → interstellar). Orbits and designations come from the IAU Minor Planet Center and the NASA/JPL Small-Body Database. HONEST STATUS is the governing rule: confirmed interstellar objects, unconfirmed candidates, and hyperbolic Solar-System comets are typed and displayed separately, and an interstellar origin (has_trajectory_class → interstellar-hyperbolic) is asserted ONLY for the confirmed objects; candidates such as the CNEOS 2014-01-08 bolide carry explicit uncertainty notes and are NEVER labelled confirmed. The reused comet class, Pan-STARRS / LSST, and NASA/JPL are never duplicated; new ATLAS/Catalina/Minor Planet Center/CNEOS entities are created. No "alien" or artificial-origin claims are made; no live visibility is computed or fabricated.`,
  );
  lines.push(`- [Interstellar & Hyperbolic Objects](${absoluteUrl("/interstellar-objects")})`);
  lines.push(`- Confirmed: ${absoluteUrl("/interstellar-objects/discover/confirmed")} · Debated: ${absoluteUrl("/interstellar-objects/discover/debated")} · Hyperbolic comets: ${absoluteUrl("/interstellar-objects/discover/hyperbolic-comets")} · Detection: ${absoluteUrl("/interstellar-objects/detection/excess-hyperbolic-velocity")}`);
  lines.push(`- Objects/comets resolve at /interstellar-objects/{slug}; detection methods at /interstellar-objects/detection/{slug}; trajectory classes at /interstellar-objects/trajectory/{slug}.`);
  lines.push("");

  lines.push("## Small-Body Missions & Sample Return Encyclopedia");
  lines.push(
    `${engine.smallBodyMissions.count} small-body missions (${engine.smallBodyMissions.completedMissions().length} completed/extended, ${engine.smallBodyMissions.activeSmallBodyMissions().length} active, ${engine.smallBodyMissions.futureMissions().length} planned/concept) plus ${engine.smallBodyMissions.classes().length} mission classes, ${engine.smallBodyMissions.returnedSamples().length} returned samples, ${engine.smallBodyMissions.capsules().length} sample-return capsules, ${engine.smallBodyMissions.phases().length} lifecycle phases, and 1 science campaign (engine.smallBodyMissions) — the engineering bridge across the small-body arc (asteroids/comets/meteorites/interstellar). Timelines, targets, launch vehicles, and sample masses come from NASA/JPL, ESA, and JAXA. The existing space missions (Hayabusa, OSIRIS-REx, Rosetta, DART, Lucy…), their rockets (Program V), and target asteroids/comets (Programs Y/Z) are REUSED and enriched, never duplicated — reused missions keep their canonical page, so their /small-body-missions view is excluded from the sitemap. HONEST TENSE: a planned/concept/cancelled mission asserts no past-tense encounter and no returned sample. No fabricated timelines, targets, or outcomes.`,
  );
  lines.push(`- [Small-Body Missions & Sample Return](${absoluteUrl("/small-body-missions")})`);
  lines.push(`- Sample return: ${absoluteUrl("/small-body-missions/discover/sample-return")} · Planetary defense: ${absoluteUrl("/small-body-missions/discover/planetary-defense")} · Comet missions: ${absoluteUrl("/small-body-missions/discover/comet-missions")} · Timeline: ${absoluteUrl("/small-body-missions/discover/mission-timeline")}`);
  lines.push(`- Missions resolve at /small-body-missions/{slug} (reused ones canonical to their main page); mission classes at /small-body-missions/type/{slug}; returned samples at /small-body-missions/sample/{slug}.`);
  lines.push("");

  lines.push("## Space Stations & Human Spaceflight");
  lines.push(
    `How humans live and work in space: ${engine.humanSpaceflight.byKind("station").length} space stations (ISS, Mir, Skylab, Salyut, Tiangong, and planned stations) plus crewed and cargo spacecraft, ISS modules, expeditions, spacewalks, programs, and astronauts — ${engine.humanSpaceflight.count} interconnected entities. Curated from NASA, ESA, Roscosmos, JAXA, CSA, and Smithsonian sources. No fabricated crew, dates, EVAs, or modules; planned stations are clearly marked.`,
  );
  lines.push(`- [Space Stations & Human Spaceflight](${absoluteUrl("/human-spaceflight")})`);
  lines.push(`- Stations: ${absoluteUrl("/human-spaceflight/discover/all-space-stations")} · ISS modules: ${absoluteUrl("/human-spaceflight/discover/iss-modules")} · Crewed spacecraft: ${absoluteUrl("/human-spaceflight/discover/crewed-spacecraft")} · Expeditions: ${absoluteUrl("/human-spaceflight/discover/iss-expeditions")}`);
  lines.push(`- Every station, spacecraft, expedition, and person resolves through the Scientific Data Engine; pages at /human-spaceflight/{slug}.`);
  lines.push("");

  lines.push("## Observatories & Telescopes");
  lines.push(
    `The instruments and places humans use to observe the universe: ground observatories, ground and space telescopes, instruments, sky surveys, observing bands, and observing sites — ${engine.observatories.count} interconnected entities across every band of the electromagnetic spectrum and beyond (gravitational waves, neutrinos, multi-messenger). Curated from NASA, ESA, ESO, NOIRLab, NSF, NRAO, NAOJ, and STScI sources. No fabricated apertures, first-light dates, operators, or instruments; future facilities are clearly marked.`,
  );
  lines.push(`- [Observatories & Telescopes](${absoluteUrl("/observatories")})`);
  lines.push(`- Observatories: ${absoluteUrl("/observatories/discover/all-observatories")} · Space telescopes: ${absoluteUrl("/observatories/discover/space-telescopes")} · Largest: ${absoluteUrl("/observatories/discover/largest-telescopes")} · Surveys: ${absoluteUrl("/observatories/discover/sky-surveys")}`);
  lines.push(`- Every observatory, telescope, instrument, survey, and band resolves through the Scientific Data Engine; pages at /observatories/{slug}.`);
  lines.push("");

  lines.push("## Exoplanets Encyclopedia");
  lines.push(
    `An encyclopedia of ${engine.exoplanets.planetCount} confirmed exoplanets across ${engine.exoplanets.systemCount} multi-planet systems — with host stars, detection methods, planetary classes, and discovery missions — as first-class entities, built on the NASA Exoplanet Archive (Planetary Systems Composite Parameters). Host stars already in the Star Encyclopedia are reused, not duplicated. Every value is real archive data; nothing is inferred, and habitability is never asserted as certainty.`,
  );
  lines.push(`- [Exoplanets Encyclopedia](${absoluteUrl("/exoplanets")})`);
  lines.push(`- All: ${absoluteUrl("/exoplanets/discover/all-exoplanets")} · Nearby: ${absoluteUrl("/exoplanets/discover/nearby-exoplanets")} · Potentially habitable: ${absoluteUrl("/exoplanets/discover/potentially-habitable")} · Multi-planet systems: ${absoluteUrl("/exoplanets/discover/multi-planet-systems")}`);
  lines.push(`- Every planet, host star, system, detection method, and class resolves through the Scientific Data Engine; pages at /exoplanets/{slug}.`);
  lines.push("");

  lines.push("## History of Astronomy Encyclopedia");
  lines.push(
    `The history of humanity discovering the universe: ${engine.history.astronomerCount} astronomers, ${engine.history.discoveryCount} landmark discoveries, ${engine.history.publicationCount} historic publications, plus theories, catalogues, awards, and ${engine.history.eraCount} eras — all first-class knowledge-graph entities connected to observatories, telescopes, missions, and objects. Curated from authoritative sources (IAU, NASA, ESA, ESO, ADS, the Nobel Foundation, Britannica). Astronomers already in the graph are reused, not duplicated; nothing is fabricated.`,
  );
  lines.push(`- [History of Astronomy Encyclopedia](${absoluteUrl("/history")})`);
  lines.push(`- Timeline: ${absoluteUrl("/timelines/history-of-astronomy")} · Astronomers A–Z: ${absoluteUrl("/history/discover/astronomers-a-z")} · Discoveries: ${absoluteUrl("/history/discover/scientific-discoveries")} · Publications: ${absoluteUrl("/history/discover/historic-publications")} · Cosmology: ${absoluteUrl("/history/discover/history-of-cosmology")}`);
  lines.push(`- Every astronomer, discovery, publication, theory, catalogue, era, event, and award resolves through the Scientific Data Engine; pages at /history/{slug}.`);
  lines.push("");

  lines.push("## Cosmology & Universe Encyclopedia");
  lines.push(
    `The scientific model of the Universe: ${engine.cosmology.conceptCount} cosmological and physical concepts, ${engine.cosmology.modelCount} models, and ${engine.cosmology.objectCount} classes of astrophysical object — all first-class knowledge-graph entities. Every topic carries an EXPLICIT consensus classification (Established Science, Strong Evidence, Active Research, Scientific Debate, or Speculative Hypothesis); these are never conflated. Curated from authoritative sources (Planck Collaboration, NASA, ESA, ESO, LIGO, the Event Horizon Telescope, DESI, SDSS). Theories, discoveries, scientists, and observatories already in the graph are reused, not duplicated; nothing is fabricated.`,
  );
  lines.push(`- [Cosmology & Universe Encyclopedia](${absoluteUrl("/cosmology")})`);
  lines.push(`- Universe timeline: ${absoluteUrl("/timelines/universe-timeline")} · Big Bang: ${absoluteUrl("/cosmology/discover/big-bang")} · Dark matter: ${absoluteUrl("/cosmology/discover/dark-matter")} · Black holes: ${absoluteUrl("/cosmology/discover/black-holes")} · Scientific debates: ${absoluteUrl("/cosmology/discover/scientific-debates")} · Open questions: ${absoluteUrl("/cosmology/discover/open-questions")}`);
  lines.push(`- Every concept, model, object class, observational program, and physicist resolves through the Scientific Data Engine; pages at /cosmology/{slug}.`);
  lines.push("");

  lines.push("## Night Sky Platform");
  lines.push(
    `The architecture for a daily-use observing platform, built on top of the Knowledge Graph. IMPORTANT: no live data is fabricated. Data is either 'reference' (timeless, source-backed facts — e.g. the annual meteor-shower parameters from the IMO) or 'prepared' (architecture ready for a named provider, with NO current values shown). There are no fake positions, forecasts, ISS locations, solar-activity readings, or eclipse dates. Typed provider interfaces exist for JPL Horizons, the USNO almanac, NASA DONKI, NOAA SWPC, CelesTrak, the Minor Planet Center, the IMO, and NASA eclipse predictions — all currently 'planned', none connected.`,
  );
  lines.push(`- [Night Sky Platform](${absoluteUrl("/sky")})`);
  lines.push(`- Meteor showers: ${absoluteUrl("/sky/meteor-showers")} · Moon: ${absoluteUrl("/sky/moon")} · Planet visibility: ${absoluteUrl("/sky/planet-visibility")} · Eclipses: ${absoluteUrl("/sky/eclipses")} · Space weather: ${absoluteUrl("/sky/space-weather")} · Observing calendar: ${absoluteUrl("/sky/observing-calendar")}`);
  lines.push(`- Every meteor shower and sky module links to real graph entities (Moon, planets, comets, the ISS, the Sun); pages at /sky/{slug} and /sky/meteor-showers/{slug}. Every datum is status- and source-labelled.`);
  lines.push("");

  lines.push("## Scientific Image Archive");
  lines.push(
    `A provenance-first image catalogue where every image is a first-class knowledge-graph entity with verified provenance: source archive, instrument, capture/publication details where known, license, and credit. IMPORTANT: Asteria Star does NOT re-host or hotlink image binaries it has not verified, and never fabricates a photograph, credit, license, capture date, object name, or source URL — unknown fields are omitted, and each image links to its official source archive. Only openly-licensed or public-domain images (NASA public domain, CC BY 4.0) are catalogued. Every image links to at least one real graph entity (the depicted object, the capturing telescope/mission, and any related discovery). Automated ingest from NASA, STScI, ESA/Hubble, ESA/Webb, ESO, the EHT, NOIRLab, and Wikimedia is prepared (all 'planned').`,
  );
  lines.push(`- [Scientific Image Archive](${absoluteUrl("/images")})`);
  lines.push(`- Latest: ${absoluteUrl("/images/galleries/latest")} · JWST: ${absoluteUrl("/images/galleries/jwst")} · Hubble: ${absoluteUrl("/images/galleries/hubble")} · Black holes: ${absoluteUrl("/images/galleries/black-holes")} · Public domain: ${absoluteUrl("/images/galleries/public-domain")} · Astrophotography guides: ${absoluteUrl("/images/astrophotography")}`);
  lines.push(`- Every image, collection, license, and source resolves through the Scientific Data Engine; image pages at /images/{slug} carry ImageObject metadata. Astrophotography guides are kept separate from institutional imagery.`);
  lines.push("");

  lines.push("## Open data");
  lines.push(
    `Asteria Star is open infrastructure for structured celestial knowledge: a versioned (graph ${GRAPH_VERSION_INFO.graphVersion}, schema ${GRAPH_VERSION_INFO.schemaVersion}), machine-readable knowledge graph of ${GRAPH_VERSION_INFO.entityCount} entities. Stable ids are permanent (type:slug). License: ${GRAPH_VERSION_INFO.license}.`,
  );
  lines.push(`- [Platform Core](${absoluteUrl(ROUTES.platform)}) — layers, runtime, registries, extension points`);
  lines.push(`- [Authority Dashboard](${absoluteUrl(ROUTES.authority)}) — derived coverage & quality; no fabricated statistics`);
  lines.push(`- [Transparency](${absoluteUrl(ROUTES.transparency)}) — methodology, evidence framework, review process, provenance, scope`);
  lines.push(`- [Open Data](${absoluteUrl(ROUTES.openData)})`);
  lines.push(`- [Data Portal](${absoluteUrl(ROUTES.data)}) — datasets, exports, schemas, licensing, provenance, quality`);
  lines.push(`- [Datasets](${absoluteUrl(ROUTES.datasets)})`);
  lines.push(`- [Knowledge Registry](${absoluteUrl(ROUTES.registry)})`);
  lines.push(`- [Developers](${absoluteUrl(ROUTES.developers)})`);
  lines.push(`- Graph export (JSON): ${absoluteUrl("/data/graph.json")}`);
  lines.push(`- Graph export (JSON-LD): ${absoluteUrl("/data/graph.jsonld")}`);
  for (const d of DATASETS) {
    lines.push(`- [${d.title} Dataset](${absoluteUrl(datasetPath(d.slug))}): ${d.entityCount} entities · JSON ${absoluteUrl(`/datasets/${d.slug}/json`)} · CSV ${absoluteUrl(`/datasets/${d.slug}/csv`)}`);
  }
  lines.push("");

  lines.push("## Open Data API (v0)");
  lines.push(
    `Read-only, deterministic, engine-backed JSON API. Every response carries a provenance envelope (apiVersion, schemaVersion, dataVersion, generatedAt, source, license, attribution). No auth, no rate limits, no write endpoints. OpenAPI 3.1: ${absoluteUrl("/api/v0/openapi.json")}. Reference: ${absoluteUrl(ROUTES.developersApi)}.`,
  );
  for (const e of IMPLEMENTED_ENDPOINTS) {
    lines.push(`- ${e.method} ${absoluteUrl(e.path)} — ${e.summary}${e.example ? ` (e.g. ${absoluteUrl(e.example)})` : ""}`);
  }
  lines.push("Checksummed exports (SHA-256 in the manifest):");
  for (const [id, m] of Object.entries(EXPORT_MANIFEST.exports)) {
    lines.push(`- ${id}: ${absoluteUrl(m.file)} — ${m.recordCount} records`);
  }
  lines.push("");

  lines.push("## Contribute (scientific contributions & review workflow)");
  lines.push(
    `A controlled, review-first workflow (architecture preview). Every contribution is a structured PROPOSAL attached to a real knowledge-graph object — validated and reviewed before any versioned change. Not public editing, not a social network. ${CONTRIB.stats.types} contribution types, ${CONTRIB.stats.states} review states, ${CONTRIB.stats.roles} roles. No accounts, no database, no live submissions, no fabricated contributors/reviews/approvals.`,
  );
  lines.push(`- [Contribute](${absoluteUrl(ROUTES.contribute)})`);
  for (const s of ALL_CONTRIBUTE_SECTIONS) {
    lines.push(`- [${s.title}](${absoluteUrl(contributePath(s.slug))}): ${s.description}`);
  }
  lines.push(`- Read-only APIs: ${absoluteUrl("/api/v0/contribution-types")} · ${absoluteUrl("/api/v0/review-states")} · ${absoluteUrl("/api/v0/contribution-guidelines")}`);
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
