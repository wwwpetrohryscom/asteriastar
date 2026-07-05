import { SITE_URL } from "@/lib/site";
import type { Category, Section } from "@/lib/content/types";

/**
 * Route helpers — the only place URLs are constructed.
 *
 * Components and pages should import these rather than hand-writing paths, so
 * the routing scheme can evolve in one place. `*Path` helpers return
 * site-relative paths (for <Link>); `absoluteUrl` builds canonical URLs for
 * metadata, JSON-LD, and the sitemap.
 */

export const ROUTES = {
  home: "/",
  about: "/about",
  editorialPolicy: "/editorial-policy",
  sourcesPolicy: "/sources-policy",
  explore: "/explore",
  entityIndex: "/entity-index",
  topicIndex: "/topic-index",
  discover: "/discover",
  compare: "/compare",
  learn: "/learn",
  timelines: "/timelines",
  search: "/search",
  community: "/community",
  openData: "/open-data",
  data: "/data",
  datasets: "/datasets",
  registry: "/registry",
  developers: "/developers",
  developersApi: "/developers/api",
  contribute: "/contribute",
  platform: "/platform",
  observatory: "/observatory",
  authority: "/authority",
  transparency: "/transparency",
  stars: "/stars",
  solarSystem: "/solar-system",
  deepSky: "/deep-sky",
  exploration: "/exploration",
  humanSpaceflight: "/human-spaceflight",
  observatories: "/observatories",
  exoplanets: "/exoplanets",
  history: "/history",
  cosmology: "/cosmology",
  sky: "/sky",
  images: "/images",
  rockets: "/rockets",
  constellations: "/constellations",
  satellites: "/satellites",
  asteroids: "/asteroids",
  comets: "/comets",
  meteorites: "/meteorites",
  interstellarObjects: "/interstellar-objects",
  smallBodyMissions: "/small-body-missions",
  deepSpaceNetwork: "/deep-space-network",
  spaceEnvironment: "/space-environment",
  missionOperations: "/mission-operations",
  spacecraftSystems: "/spacecraft-systems",
  instruments: "/instruments",
  planetaryGeology: "/planetary-geology",
  institutions: "/institutions",
  spaceflightTimeline: "/timeline",
  spaceMedicine: "/space-medicine",
  spaceInfrastructure: "/space-infrastructure",
  futureExploration: "/future-exploration",
  methods: "/methods",
  timeDomain: "/time-domain",
  galaxies: "/galaxies",
  astrobiology: "/astrobiology",
  planetaryDefense: "/planetary-defense",
  dataArchives: "/data-archives",
  observatoryFrontier: "/observatory-frontier",
  distanceLadder: "/distance-ladder",
  heliophysics: "/heliophysics",
  astroMl: "/astro-ml",
  citizenAstronomy: "/citizen-astronomy",
  multiMessenger: "/multi-messenger",
  comparativePlanetology: "/comparative-planetology",
  astrochemistry: "/astrochemistry",
  spacePolicy: "/space-policy",
  discoveryHistory: "/discovery-history",
  celestialMechanics: "/celestial-mechanics",
  stellarAstrophysics: "/stellar-astrophysics",
} as const;

/** Rockets & Launch Vehicles encyclopedia (Program V). */
export function rocketPath(slug: string): string {
  return `/rockets/${slug}`;
}
export function rocketDiscoveryPath(slug: string): string {
  return `/rockets/discover/${slug}`;
}

/** Constellation Encyclopedia (Program W). */
export function constellationPath(slug: string): string {
  return `/constellations/${slug}`;
}
export function constellationDiscoveryPath(slug: string): string {
  return `/constellations/discover/${slug}`;
}
export function constellationFamilyPath(slug: string): string {
  return `/constellations/family/${slug}`;
}
export function constellationSeasonPath(slug: string): string {
  return `/constellations/season/${slug}`;
}
export function constellationRegionPath(slug: string): string {
  return `/constellations/region/${slug}`;
}
export function constellationAsterismPath(slug: string): string {
  return `/constellations/asterism/${slug}`;
}

/** Satellite Encyclopedia (Program X). */
export function satellitePath(slug: string): string {
  return `/satellites/${slug}`;
}
export function satelliteDiscoveryPath(slug: string): string {
  return `/satellites/discover/${slug}`;
}
export function satelliteConstellationPath(slug: string): string {
  return `/satellites/constellation/${slug}`;
}
export function satelliteOperatorPath(slug: string): string {
  return `/satellites/operator/${slug}`;
}
export function satelliteOrbitPath(slug: string): string {
  return `/satellites/orbit/${slug}`;
}
export function satelliteNetworkPath(slug: string): string {
  return `/satellites/network/${slug}`;
}

/** Asteroids & Minor Planets Encyclopedia (Program Y). */
export function asteroidPath(slug: string): string {
  return `/asteroids/${slug}`;
}
export function asteroidDiscoveryPath(slug: string): string {
  return `/asteroids/discover/${slug}`;
}
export function asteroidFamilyPath(slug: string): string {
  return `/asteroids/family/${slug}`;
}
export function asteroidGroupPath(slug: string): string {
  return `/asteroids/group/${slug}`;
}
export function asteroidNearEarthPath(slug: string): string {
  return `/asteroids/near-earth/${slug}`;
}
export function asteroidTrojanPath(slug: string): string {
  return `/asteroids/trojans/${slug}`;
}
export function asteroidResonancePath(slug: string): string {
  return `/asteroids/resonance/${slug}`;
}
export function asteroidImpactPath(slug: string): string {
  return `/asteroids/impact/${slug}`;
}

/** Comets & Small-Body Reservoirs Encyclopedia (Program Z). */
export function cometPath(slug: string): string {
  return `/comets/${slug}`;
}
export function cometDiscoveryPath(slug: string): string {
  return `/comets/discover/${slug}`;
}
export function cometClassPath(slug: string): string {
  return `/comets/class/${slug}`;
}
export function cometFamilyPath(slug: string): string {
  return `/comets/family/${slug}`;
}
export function cometReservoirPath(slug: string): string {
  return `/comets/reservoir/${slug}`;
}
export function cometActivePath(slug: string): string {
  return `/comets/active/${slug}`;
}
export function cometDormantPath(slug: string): string {
  return `/comets/dormant/${slug}`;
}

/** Meteors, Meteorites & Fireballs Encyclopedia (Program AA). */
export function meteoritePath(slug: string): string {
  return `/meteorites/${slug}`;
}
export function meteoriteDiscoveryPath(slug: string): string {
  return `/meteorites/discover/${slug}`;
}
export function meteoriteClassPath(slug: string): string {
  return `/meteorites/class/${slug}`;
}
export function meteoriteGroupPath(slug: string): string {
  return `/meteorites/group/${slug}`;
}
export function meteoriteFireballPath(slug: string): string {
  return `/meteorites/fireball/${slug}`;
}
export function meteoriteImpactStructurePath(slug: string): string {
  return `/meteorites/impact-structure/${slug}`;
}
export function meteoriteSitePath(slug: string): string {
  return `/meteorites/site/${slug}`;
}

/** Interstellar & Hyperbolic Objects Encyclopedia (Program AB). */
export function interstellarObjectPath(slug: string): string {
  return `/interstellar-objects/${slug}`;
}
export function interstellarDiscoveryPath(slug: string): string {
  return `/interstellar-objects/discover/${slug}`;
}
export function interstellarDetectionPath(slug: string): string {
  return `/interstellar-objects/detection/${slug}`;
}
export function interstellarTrajectoryPath(slug: string): string {
  return `/interstellar-objects/trajectory/${slug}`;
}

/** Small-Body Missions & Sample Return Encyclopedia (Program AC). */
export function smallBodyMissionPath(slug: string): string {
  return `/small-body-missions/${slug}`;
}
export function smallBodyDiscoveryPath(slug: string): string {
  return `/small-body-missions/discover/${slug}`;
}
export function smallBodyTypePath(slug: string): string {
  return `/small-body-missions/type/${slug}`;
}
export function smallBodySamplePath(slug: string): string {
  return `/small-body-missions/sample/${slug}`;
}

/** Deep Space Communications & Navigation Encyclopedia (Program AD). */
export function dsnNetworkPath(slug: string): string {
  return `/deep-space-network/network/${slug}`;
}
export function dsnStationPath(slug: string): string {
  return `/deep-space-network/station/${slug}`;
}
export function dsnAntennaPath(slug: string): string {
  return `/deep-space-network/antenna/${slug}`;
}
export function dsnBandPath(slug: string): string {
  return `/deep-space-network/band/${slug}`;
}
export function dsnNavigationPath(slug: string): string {
  return `/deep-space-network/navigation/${slug}`;
}
export function dsnDiscoveryPath(slug: string): string {
  return `/deep-space-network/discover/${slug}`;
}

export function exoplanetPath(slug: string): string {
  return `/exoplanets/${slug}`;
}

export function exoplanetDiscoveryPath(slug: string): string {
  return `/exoplanets/discover/${slug}`;
}

export function imagePath(slug: string): string {
  return `/images/${slug}`;
}

export function imageCollectionPath(slug: string): string {
  return `/images/collections/${slug}`;
}

export function imageGalleryPath(slug: string): string {
  return `/images/galleries/${slug}`;
}

export function astrophotographyPath(slug: string): string {
  return `/images/astrophotography/${slug}`;
}

export function skyPath(slug: string): string {
  return `/sky/${slug}`;
}

export function meteorShowerPath(slug: string): string {
  return `/sky/meteor-showers/${slug}`;
}

export function cosmologyPath(slug: string): string {
  return `/cosmology/${slug}`;
}

export function cosmologyDiscoveryPath(slug: string): string {
  return `/cosmology/discover/${slug}`;
}

export function historyPath(slug: string): string {
  return `/history/${slug}`;
}

export function historyDiscoveryPath(slug: string): string {
  return `/history/discover/${slug}`;
}

export function observatoryPath(slug: string): string {
  return `/observatories/${slug}`;
}

export function observatoryDiscoveryPath(slug: string): string {
  return `/observatories/discover/${slug}`;
}

export function explorationPath(slug: string): string {
  return `/exploration/${slug}`;
}

export function explorationDiscoveryPath(slug: string): string {
  return `/exploration/discover/${slug}`;
}

export function humanSpaceflightPath(slug: string): string {
  return `/human-spaceflight/${slug}`;
}

export function humanSpaceflightDiscoveryPath(slug: string): string {
  return `/human-spaceflight/discover/${slug}`;
}

export function deepSkyPath(slug: string): string {
  return `/deep-sky/${slug}`;
}

export function deepSkyDiscoveryPath(slug: string): string {
  return `/deep-sky/discover/${slug}`;
}

export function solarBodyPath(slug: string): string {
  return `/solar-system/${slug}`;
}

export function solarDiscoveryPath(slug: string): string {
  return `/solar-system/discover/${slug}`;
}

export function transparencyPath(slug: string): string {
  return `/transparency/${slug}`;
}

export function starPath(slug: string): string {
  return `/stars/${slug}`;
}

export function constellationStarsPath(slug: string): string {
  return `/stars/constellations/${slug}`;
}

export function starCategoryPath(slug: string): string {
  return `/stars/type/${slug}`;
}

export function starDiscoveryPath(slug: string): string {
  return `/stars/discover/${slug}`;
}

export function datasetPath(slug: string): string {
  return `/datasets/${slug}`;
}

/** Public data-portal sub-page (e.g. /data/exports, /data/licensing). */
export function dataPath(slug: string): string {
  return `/data/${slug}`;
}

/** Developer API reference for one endpoint group (e.g. /developers/api/entities). */
export function apiGroupPath(group: string): string {
  return `/developers/api/${group}`;
}

/** Developer doc sub-page (e.g. /developers/sdk, /developers/openapi). */
export function developerDocPath(slug: string): string {
  return `/developers/${slug}`;
}

/** Contribution portal sub-page (e.g. /contribute/guidelines, /contribute/review-queue). */
export function contributePath(slug: string): string {
  return `/contribute/${slug}`;
}

export function comparePath(slug: string): string {
  return `/compare/${slug}`;
}

export function learnPath(slug: string): string {
  return `/learn/${slug}`;
}

export function timelinePath(slug: string): string {
  return `/timelines/${slug}`;
}

export function topicPath(slug: string): string {
  return `/explore/${slug}`;
}

export function connectionPath(slug: string): string {
  return `/connections/${slug}`;
}

export function sectionPath(section: Pick<Section, "slug">): string {
  return `/${section.slug}`;
}

export function categoryPath(
  section: Pick<Section, "slug">,
  category: Pick<Category, "slug">,
): string {
  return `/${section.slug}/${category.slug}`;
}

/** Build an entry path from raw slugs (used by the entry registry). */
export function entryPath(
  section: string,
  category: string,
  entry: string,
): string {
  return `/${section}/${category}/${entry}`;
}

/** Build an absolute, canonical URL from a site-relative path. */
export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized === "/" ? "" : normalized}`;
}

/** Space Environment & Hazards Encyclopedia (Program AE). */
export function spaceEnvironmentPath(slug: string): string {
  return `/space-environment/${slug}`;
}
export function spaceEnvironmentDiscoveryPath(slug: string): string {
  return `/space-environment/discover/${slug}`;
}

/** Ground Segment & Mission Operations Encyclopedia (Program AF). */
export function missionOperationsPath(slug: string): string {
  return `/mission-operations/${slug}`;
}
export function missionOperationsDiscoveryPath(slug: string): string {
  return `/mission-operations/discover/${slug}`;
}

/** Spacecraft Systems & Engineering Encyclopedia (Program AG). */
export function spacecraftSystemsPath(slug: string): string {
  return `/spacecraft-systems/${slug}`;
}
export function spacecraftSystemsDiscoveryPath(slug: string): string {
  return `/spacecraft-systems/discover/${slug}`;
}

/** Scientific Instruments & Payloads Encyclopedia (Program AH). */
export function instrumentsPath(slug: string): string {
  return `/instruments/${slug}`;
}
export function instrumentsDiscoveryPath(slug: string): string {
  return `/instruments/discover/${slug}`;
}

/** Planetary Geology & Surface Features Encyclopedia (Program AI). */
export function planetaryGeologyPath(slug: string): string {
  return `/planetary-geology/${slug}`;
}
export function planetaryGeologyDiscoveryPath(slug: string): string {
  return `/planetary-geology/discover/${slug}`;
}

/** Space Agencies, Institutions & Laboratories encyclopedia (Program AJ). */
export function institutionsPath(slug: string): string {
  return `/institutions/${slug}`;
}
export function institutionsDiscoveryPath(slug: string): string {
  return `/institutions/discover/${slug}`;
}

/** Space Missions Timeline & Historical Events encyclopedia (Program AK). */
export function spaceflightTimelinePath(slug: string): string {
  return `/timeline/${slug}`;
}
export function spaceflightTimelineDiscoveryPath(slug: string): string {
  return `/timeline/discover/${slug}`;
}

/** Life Support, Space Biology & Space Medicine encyclopedia (Program AL). */
export function spaceMedicinePath(slug: string): string {
  return `/space-medicine/${slug}`;
}
export function spaceMedicineDiscoveryPath(slug: string): string {
  return `/space-medicine/discover/${slug}`;
}

/** Space Manufacturing & In-Space Infrastructure encyclopedia (Program AM). */
export function spaceInfrastructurePath(slug: string): string {
  return `/space-infrastructure/${slug}`;
}
export function spaceInfrastructureDiscoveryPath(slug: string): string {
  return `/space-infrastructure/discover/${slug}`;
}

/** Future Space Exploration & Mission Concepts encyclopedia (Program AN). */
export function futureExplorationPath(slug: string): string {
  return `/future-exploration/${slug}`;
}
export function futureExplorationDiscoveryPath(slug: string): string {
  return `/future-exploration/discover/${slug}`;
}

/** Astronomy Methods, Measurements & Scientific Techniques encyclopedia (Program AO). */
export function methodPath(slug: string): string {
  return `/methods/${slug}`;
}
export function methodDiscoveryPath(slug: string): string {
  return `/methods/discover/${slug}`;
}

/** Multi-Wavelength & Time-Domain Astronomy Atlas (Program AP). */
export function timeDomainPath(slug: string): string {
  return `/time-domain/${slug}`;
}
export function timeDomainDiscoveryPath(slug: string): string {
  return `/time-domain/discover/${slug}`;
}

/** Galaxies, AGN & the Extragalactic Universe encyclopedia (Program AQ). */
export function galaxiesPath(slug: string): string {
  return `/galaxies/${slug}`;
}
export function galaxiesDiscoveryPath(slug: string): string {
  return `/galaxies/discover/${slug}`;
}

/** Astrobiology, Biosignatures & the Search for Life encyclopedia (Program AR). */
export function astrobiologyPath(slug: string): string {
  return `/astrobiology/${slug}`;
}
export function astrobiologyDiscoveryPath(slug: string): string {
  return `/astrobiology/discover/${slug}`;
}

/** Planetary Defense & NEO Operations encyclopedia (Program AS). */
export function planetaryDefensePath(slug: string): string {
  return `/planetary-defense/${slug}`;
}
export function planetaryDefenseDiscoveryPath(slug: string): string {
  return `/planetary-defense/discover/${slug}`;
}
export function dataArchivesPath(slug: string): string {
  return `/data-archives/${slug}`;
}
export function dataArchivesDiscoveryPath(slug: string): string {
  return `/data-archives/discover/${slug}`;
}
export function observatoryFrontierPath(slug: string): string {
  return `/observatory-frontier/${slug}`;
}
export function observatoryFrontierDiscoveryPath(slug: string): string {
  return `/observatory-frontier/discover/${slug}`;
}
export function distanceLadderPath(slug: string): string {
  return `/distance-ladder/${slug}`;
}
export function distanceLadderDiscoveryPath(slug: string): string {
  return `/distance-ladder/discover/${slug}`;
}
export function heliophysicsPath(slug: string): string {
  return `/heliophysics/${slug}`;
}
export function heliophysicsDiscoveryPath(slug: string): string {
  return `/heliophysics/discover/${slug}`;
}
export function astroMlPath(slug: string): string {
  return `/astro-ml/${slug}`;
}
export function astroMlDiscoveryPath(slug: string): string {
  return `/astro-ml/discover/${slug}`;
}
export function citizenAstronomyPath(slug: string): string {
  return `/citizen-astronomy/${slug}`;
}
export function citizenAstronomyDiscoveryPath(slug: string): string {
  return `/citizen-astronomy/discover/${slug}`;
}
export function multiMessengerPath(slug: string): string {
  return `/multi-messenger/${slug}`;
}
export function multiMessengerDiscoveryPath(slug: string): string {
  return `/multi-messenger/discover/${slug}`;
}
export function comparativePlanetologyPath(slug: string): string {
  return `/comparative-planetology/${slug}`;
}
export function comparativePlanetologyDiscoveryPath(slug: string): string {
  return `/comparative-planetology/discover/${slug}`;
}
export function astrochemistryPath(slug: string): string {
  return `/astrochemistry/${slug}`;
}
export function astrochemistryDiscoveryPath(slug: string): string {
  return `/astrochemistry/discover/${slug}`;
}
export function spacePolicyPath(slug: string): string {
  return `/space-policy/${slug}`;
}
export function spacePolicyDiscoveryPath(slug: string): string {
  return `/space-policy/discover/${slug}`;
}
export function discoveryHistoryPath(slug: string): string {
  return `/discovery-history/${slug}`;
}
export function discoveryHistoryDiscoveryPath(slug: string): string {
  return `/discovery-history/discover/${slug}`;
}
export function celestialMechanicsPath(slug: string): string {
  return `/celestial-mechanics/${slug}`;
}
export function celestialMechanicsDiscoveryPath(slug: string): string {
  return `/celestial-mechanics/discover/${slug}`;
}
export function stellarAstrophysicsPath(slug: string): string {
  return `/stellar-astrophysics/${slug}`;
}
export function stellarAstrophysicsDiscoveryPath(slug: string): string {
  return `/stellar-astrophysics/discover/${slug}`;
}
