import type { GraphEntity } from "@/knowledge-graph/schema";
import { entities as solarSystem } from "@/knowledge-graph/data/solar-system";
import { entities as starsConstellations } from "@/knowledge-graph/data/stars-constellations";
import { entities as deepSky } from "@/knowledge-graph/data/deep-sky";
import { entities as missionsTelescopes } from "@/knowledge-graph/data/missions-telescopes";
import { entities as skyEventsMythology } from "@/knowledge-graph/data/sky-events-mythology";
import { entities as messier } from "@/knowledge-graph/data/messier";
import { entities as moonsExtra } from "@/knowledge-graph/data/moons-extra";
import { entities as agenciesVehicles } from "@/knowledge-graph/data/agencies-vehicles";
import { entities as observatoriesAstronomers } from "@/knowledge-graph/data/observatories-astronomers";
import { entities as deepSkyExtra } from "@/knowledge-graph/data/deep-sky-extra";
import { entities as starsExtra } from "@/knowledge-graph/data/stars-extra";
import { entities as exoplanetsSystems } from "@/knowledge-graph/data/exoplanets-systems";
import { entities as notableObjects } from "@/knowledge-graph/data/notable-objects";
import { entities as crossLinks } from "@/knowledge-graph/data/cross-links";
import { entities as starCatalog } from "@/knowledge-graph/data/star-catalog";
import { entities as solarSystemCatalog } from "@/knowledge-graph/data/solar-system-catalog";
import { entities as deepSkyCatalog } from "@/knowledge-graph/data/deep-sky-catalog";
import { entities as explorationCatalog } from "@/knowledge-graph/data/exploration-catalog";
import { entities as humanSpaceflightCatalog } from "@/knowledge-graph/data/human-spaceflight-catalog";
import { entities as observatoryCatalog } from "@/knowledge-graph/data/observatory-catalog";
import { entities as exoplanetCatalog } from "@/knowledge-graph/data/exoplanet-catalog";
import { entities as historyCatalog } from "@/knowledge-graph/data/history-catalog";
import { entities as cosmologyCatalog } from "@/knowledge-graph/data/cosmology-catalog";
import { entities as imageCatalog } from "@/knowledge-graph/data/image-catalog";
import { entities as rocketsCatalog } from "@/knowledge-graph/data/rockets-catalog";
import { entities as constellationsCatalog } from "@/knowledge-graph/data/constellations-catalog";
import { entities as satellitesCatalog } from "@/knowledge-graph/data/satellites-catalog";
import { entities as asteroidsCatalog } from "@/knowledge-graph/data/asteroids-catalog";
import { entities as cometsCatalog } from "@/knowledge-graph/data/comets-catalog";
import { entities as meteoritesCatalog } from "@/knowledge-graph/data/meteorites-catalog";
import { entities as interstellarCatalog } from "@/knowledge-graph/data/interstellar-catalog";
import { entities as smallBodyMissionsCatalog } from "@/knowledge-graph/data/small-body-missions-catalog";
import { entities as deepSpaceCommsCatalog } from "@/knowledge-graph/data/deep-space-comms-catalog";

/**
 * Knowledge-graph entities.
 *
 * The original seed lives in `coreEntities` (below); the per-area data modules
 * in `data/` add the Phase 3 expansion. Every entity that has a published
 * content entry carries its `entryPath`, the single source of truth for
 * entity ↔ entry linkage. Astronomy planets and astrology "planets" are
 * deliberately SEPARATE entities (e.g. `planet:mars` vs `astrology_planet:mars`)
 * so the science/astrology boundary holds at the data level.
 */
const coreEntities: GraphEntity[] = [
  /* ----------------------------------------------------- science: stars */
  {
    id: "star:sirius",
    type: "star",
    name: "Sirius",
    domain: "science",
    entryPath: "/astronomy/stars/sirius",
    description: "The brightest star in the night sky, in Canis Major.",
    sources: ["iau", "nasa"],
  },
  {
    id: "star:betelgeuse",
    type: "star",
    name: "Betelgeuse",
    domain: "science",
    entryPath: "/astronomy/stars/betelgeuse",
    sources: ["iau", "nasa"],
  },
  {
    id: "star:rigel",
    type: "star",
    name: "Rigel",
    domain: "science",
    entryPath: "/astronomy/stars/rigel",
    sources: ["iau", "nasa"],
  },
  {
    id: "star:vega",
    type: "star",
    name: "Vega",
    domain: "science",
    entryPath: "/astronomy/stars/vega",
    sources: ["iau", "nasa"],
  },
  {
    id: "star:polaris",
    type: "star",
    name: "Polaris",
    domain: "science",
    entryPath: "/astronomy/stars/polaris",
    sources: ["iau", "nasa"],
  },
  {
    id: "star:proxima-centauri",
    type: "star",
    name: "Proxima Centauri",
    domain: "science",
    entryPath: "/astronomy/stars/proxima-centauri",
    sources: ["iau", "nasa"],
  },
  {
    id: "star:alpha-centauri",
    type: "star",
    name: "Alpha Centauri",
    domain: "science",
    entryPath: "/astronomy/stars/alpha-centauri",
    description: "The nearest star system to the Sun.",
    sources: ["iau", "nasa"],
  },

  /* --------------------------------------------- science: constellations */
  { id: "constellation:canis-major", entryPath: "/constellations/canis-major", type: "constellation", name: "Canis Major", domain: "science", sources: ["iau"] },
  { id: "constellation:orion", entryPath: "/constellations/orion", type: "constellation", name: "Orion", domain: "science", sources: ["iau"] },
  { id: "constellation:lyra", entryPath: "/constellations/lyra", type: "constellation", name: "Lyra", domain: "science", sources: ["iau"] },
  { id: "constellation:ursa-minor", entryPath: "/constellations/ursa-minor", type: "constellation", name: "Ursa Minor", domain: "science", sources: ["iau"] },
  { id: "constellation:andromeda", entryPath: "/constellations/andromeda", type: "constellation", name: "Andromeda (constellation)", domain: "science", sources: ["iau"] },
  { id: "constellation:cassiopeia", entryPath: "/constellations/cassiopeia", type: "constellation", name: "Cassiopeia (constellation)", domain: "science", sources: ["iau"] },
  { id: "constellation:perseus", entryPath: "/constellations/perseus", type: "constellation", name: "Perseus (constellation)", domain: "science", sources: ["iau"] },

  /* --------------------------------------------------- science: planets */
  {
    id: "planet:mars",
    type: "planet",
    name: "Mars",
    domain: "science",
    entryPath: "/astronomy/planets/mars",
    sources: ["nasa", "jpl"],
  },
  {
    id: "planet:jupiter",
    type: "planet",
    name: "Jupiter",
    domain: "science",
    entryPath: "/astronomy/planets/jupiter",
    sources: ["nasa", "jpl"],
  },
  {
    id: "location:solar-system",
    type: "location",
    name: "Solar System",
    domain: "science",
    description: "The Sun and the bodies gravitationally bound to it.",
    sources: ["nasa"],
  },

  /* ------------------------------------------ science: telescopes & orgs */
  {
    id: "space_telescope:hubble-space-telescope",
    type: "space_telescope",
    name: "Hubble Space Telescope",
    domain: "science",
    entryPath: "/astronomy/space-telescopes/hubble-space-telescope",
    sources: ["nasa", "esa"],
  },
  {
    id: "space_telescope:james-webb-space-telescope",
    type: "space_telescope",
    name: "James Webb Space Telescope",
    domain: "science",
    entryPath: "/astronomy/space-telescopes/james-webb-space-telescope",
    sources: ["nasa", "esa"],
  },
  { id: "organization:nasa", type: "organization", name: "NASA", domain: "science", sources: ["nasa"] },
  { id: "organization:esa", type: "organization", name: "ESA", domain: "science", sources: ["esa"] },
  { id: "organization:csa", type: "organization", name: "Canadian Space Agency (CSA)", domain: "science" },

  /* ----------------------------------------------- culture: mythology */
  {
    id: "mythology_figure:orion",
    type: "mythology_figure",
    name: "Orion (myth)",
    domain: "culture",
    entryPath: "/encyclopedia/greek-mythology/orion",
    sources: ["britannica"],
  },
  {
    id: "mythology_figure:andromeda",
    type: "mythology_figure",
    name: "Andromeda (myth)",
    domain: "culture",
    entryPath: "/encyclopedia/greek-mythology/andromeda",
    sources: ["britannica"],
  },
  {
    id: "mythology_figure:cassiopeia",
    type: "mythology_figure",
    name: "Cassiopeia (myth)",
    domain: "culture",
    entryPath: "/encyclopedia/greek-mythology/cassiopeia",
    sources: ["britannica"],
  },
  {
    id: "mythology_figure:perseus",
    type: "mythology_figure",
    name: "Perseus (myth)",
    domain: "culture",
    entryPath: "/encyclopedia/greek-mythology/perseus",
    sources: ["britannica"],
  },
  {
    id: "mythology_figure:asteria",
    type: "mythology_figure",
    name: "Asteria",
    domain: "culture",
    entryPath: "/encyclopedia/greek-mythology/asteria",
    sources: ["britannica"],
  },
  {
    id: "mythology_story:night-sky",
    type: "mythology_story",
    name: "Star & night-sky mythology",
    domain: "culture",
    description: "The body of myth and lore humans built around the stars and night sky.",
  },

  /* -------------------------------------------- astrology: signs (12) */
  { id: "astrology_sign:aries", type: "astrology_sign", name: "Aries", domain: "astrology", entryPath: "/astrology/zodiac-signs/aries" },
  { id: "astrology_sign:taurus", type: "astrology_sign", name: "Taurus", domain: "astrology", entryPath: "/astrology/zodiac-signs/taurus" },
  { id: "astrology_sign:gemini", type: "astrology_sign", name: "Gemini", domain: "astrology", entryPath: "/astrology/zodiac-signs/gemini" },
  { id: "astrology_sign:cancer", type: "astrology_sign", name: "Cancer", domain: "astrology", entryPath: "/astrology/zodiac-signs/cancer" },
  { id: "astrology_sign:leo", type: "astrology_sign", name: "Leo", domain: "astrology", entryPath: "/astrology/zodiac-signs/leo" },
  { id: "astrology_sign:virgo", type: "astrology_sign", name: "Virgo", domain: "astrology", entryPath: "/astrology/zodiac-signs/virgo" },
  { id: "astrology_sign:libra", type: "astrology_sign", name: "Libra", domain: "astrology", entryPath: "/astrology/zodiac-signs/libra" },
  { id: "astrology_sign:scorpio", type: "astrology_sign", name: "Scorpio", domain: "astrology", entryPath: "/astrology/zodiac-signs/scorpio" },
  { id: "astrology_sign:sagittarius", type: "astrology_sign", name: "Sagittarius", domain: "astrology", entryPath: "/astrology/zodiac-signs/sagittarius" },
  { id: "astrology_sign:capricorn", type: "astrology_sign", name: "Capricorn", domain: "astrology", entryPath: "/astrology/zodiac-signs/capricorn" },
  { id: "astrology_sign:aquarius", type: "astrology_sign", name: "Aquarius", domain: "astrology", entryPath: "/astrology/zodiac-signs/aquarius" },
  { id: "astrology_sign:pisces", type: "astrology_sign", name: "Pisces", domain: "astrology", entryPath: "/astrology/zodiac-signs/pisces" },

  /* ----------------------------------------- astrology: planets (10) */
  { id: "astrology_planet:sun", type: "astrology_planet", name: "Sun (in astrology)", domain: "astrology", entryPath: "/astrology/planet-meanings/sun-in-astrology" },
  { id: "astrology_planet:moon", type: "astrology_planet", name: "Moon (in astrology)", domain: "astrology", entryPath: "/astrology/planet-meanings/moon-in-astrology" },
  { id: "astrology_planet:mercury", type: "astrology_planet", name: "Mercury (in astrology)", domain: "astrology", entryPath: "/astrology/planet-meanings/mercury-in-astrology" },
  { id: "astrology_planet:venus", type: "astrology_planet", name: "Venus (in astrology)", domain: "astrology", entryPath: "/astrology/planet-meanings/venus-in-astrology" },
  { id: "astrology_planet:mars", type: "astrology_planet", name: "Mars (in astrology)", domain: "astrology", entryPath: "/astrology/planet-meanings/mars-in-astrology" },
  { id: "astrology_planet:jupiter", type: "astrology_planet", name: "Jupiter (in astrology)", domain: "astrology", entryPath: "/astrology/planet-meanings/jupiter-in-astrology" },
  { id: "astrology_planet:saturn", type: "astrology_planet", name: "Saturn (in astrology)", domain: "astrology", entryPath: "/astrology/planet-meanings/saturn-in-astrology" },
  { id: "astrology_planet:uranus", type: "astrology_planet", name: "Uranus (in astrology)", domain: "astrology", entryPath: "/astrology/planet-meanings/uranus-in-astrology" },
  { id: "astrology_planet:neptune", type: "astrology_planet", name: "Neptune (in astrology)", domain: "astrology", entryPath: "/astrology/planet-meanings/neptune-in-astrology" },
  { id: "astrology_planet:pluto", type: "astrology_planet", name: "Pluto (in astrology)", domain: "astrology", entryPath: "/astrology/planet-meanings/pluto-in-astrology" },
];

export const entities: GraphEntity[] = [
  ...coreEntities,
  ...solarSystem,
  ...starsConstellations,
  ...deepSky,
  ...missionsTelescopes,
  ...skyEventsMythology,
  ...messier,
  ...moonsExtra,
  ...agenciesVehicles,
  ...observatoriesAstronomers,
  ...deepSkyExtra,
  ...starsExtra,
  ...exoplanetsSystems,
  ...notableObjects,
  ...crossLinks,
  ...starCatalog,
  ...solarSystemCatalog,
  ...deepSkyCatalog,
  ...explorationCatalog,
  ...humanSpaceflightCatalog,
  ...observatoryCatalog,
  ...exoplanetCatalog,
  ...historyCatalog,
  ...cosmologyCatalog,
  ...imageCatalog,
  ...rocketsCatalog,
  ...constellationsCatalog,
  ...satellitesCatalog,
  ...asteroidsCatalog,
  ...cometsCatalog,
  ...meteoritesCatalog,
  ...interstellarCatalog,
  ...smallBodyMissionsCatalog,
  ...deepSpaceCommsCatalog,
];
