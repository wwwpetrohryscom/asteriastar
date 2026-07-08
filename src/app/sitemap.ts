import type { MetadataRoute } from "next";
import { getAllCategories, getAllSections } from "@/lib/content/registry";
import { getAllEntries } from "@/content/entries";
import { getStandaloneEntities, entityGraphPath } from "@/knowledge-graph";
import { TOPICS, RELATIONSHIP_PAGES } from "@/lib/discovery";
import { COMPARISONS } from "@/lib/compare";
import { LEARNING_PATHS } from "@/lib/learn";
import { TIMELINES } from "@/lib/timelines";
import { DATASETS } from "@/lib/datasets";
import { TRANSPARENCY_PAGES } from "@/app/transparency/content";
import { engine } from "@/platform/data-engine";
import { STAR_DISCOVERIES } from "@/app/stars/discovery";
import { SOLAR_DISCOVERIES } from "@/app/solar-system/discovery";
import { DEEP_SKY_DISCOVERIES } from "@/app/deep-sky/discovery";
import { EXPLORATION_DISCOVERIES } from "@/app/exploration/discovery";
import { ROCKET_DISCOVERIES } from "@/app/rockets/discovery";
import { CONSTELLATION_DISCOVERIES } from "@/app/constellations/discovery";
import { SATELLITE_DISCOVERIES } from "@/app/satellites/discovery";
import { ASTEROID_DISCOVERIES } from "@/app/asteroids/discovery";
import { COMET_DISCOVERIES } from "@/app/comets/discovery";
import { METEORITE_DISCOVERIES } from "@/app/meteorites/discovery";
import { INTERSTELLAR_DISCOVERIES } from "@/app/interstellar-objects/discovery";
import { MISSION_DISCOVERIES } from "@/app/small-body-missions/discovery";
import { DSCOMM_DISCOVERIES } from "@/app/deep-space-network/discovery";
import { ENV_DISCOVERIES } from "@/app/space-environment/discovery";
import { OPS_DISCOVERIES } from "@/app/mission-operations/discovery";
import { SYS_DISCOVERIES } from "@/app/spacecraft-systems/discovery";
import { INST_DISCOVERIES } from "@/app/instruments/discovery";
import { GEO_DISCOVERIES } from "@/app/planetary-geology/discovery";
import { INSTITUTION_DISCOVERIES } from "@/app/institutions/discovery";
import { TIMELINE_DISCOVERIES } from "@/app/timeline/discovery";
import { MED_DISCOVERIES } from "@/app/space-medicine/discovery";
import { INFRA_DISCOVERIES } from "@/app/space-infrastructure/discovery";
import { FUTURE_DISCOVERIES } from "@/app/future-exploration/discovery";
import { METHOD_DISCOVERIES } from "@/app/methods/discovery";
import { TD_DISCOVERIES } from "@/app/time-domain/discovery";
import { GX_DISCOVERIES } from "@/app/galaxies/discovery";
import { AB_DISCOVERIES } from "@/app/astrobiology/discovery";
import { PD_DISCOVERIES } from "@/app/planetary-defense/discovery";
import { AT_DISCOVERIES } from "@/app/data-archives/discovery";
import { AU_DISCOVERIES } from "@/app/observatory-frontier/discovery";
import { AV_DISCOVERIES } from "@/app/distance-ladder/discovery";
import { AW_DISCOVERIES } from "@/app/heliophysics/discovery";
import { AX_DISCOVERIES } from "@/app/astro-ml/discovery";
import { AY_DISCOVERIES } from "@/app/citizen-astronomy/discovery";
import { AZ_DISCOVERIES } from "@/app/multi-messenger/discovery";
import { BA_DISCOVERIES } from "@/app/comparative-planetology/discovery";
import { BB_DISCOVERIES } from "@/app/astrochemistry/discovery";
import { BC_DISCOVERIES } from "@/app/space-policy/discovery";
import { BD_DISCOVERIES } from "@/app/discovery-history/discovery";
import { BE_DISCOVERIES } from "@/app/celestial-mechanics/discovery";
import { BF_DISCOVERIES } from "@/app/stellar-astrophysics/discovery";
import { BY_DISCOVERIES } from "@/app/solar-physics/discovery";
import { BZ_DISCOVERIES } from "@/app/compact-objects/discovery";
import { BG_DISCOVERIES } from "@/app/galactic-astronomy/discovery";
import { BH_DISCOVERIES } from "@/app/astroinformatics/discovery";
import { BI_DISCOVERIES } from "@/app/deep-space-exploration/discovery";
import { BO_DISCOVERIES } from "@/app/sky-atlas/discovery";
import { BP_DISCOVERIES } from "@/app/calculators/discovery";
import { BQ_DISCOVERIES } from "@/app/observing/discovery";
import { BR_DISCOVERIES } from "@/app/graph/discovery";
import { BS_DISCOVERIES } from "@/app/assistant/discovery";
import { BT_DISCOVERIES } from "@/app/live/discovery";
import { HSF_DISCOVERIES } from "@/app/human-spaceflight/discovery";
import { OBS_DISCOVERIES } from "@/app/observatories/discovery";
import { EXO_DISCOVERIES } from "@/app/exoplanets/discovery";
import { HISTORY_DISCOVERIES } from "@/app/history/discovery";
import { COSMO_DISCOVERIES } from "@/app/cosmology/discovery";
import { bodySlug } from "@/knowledge-graph/data/solar-system-catalog";
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
  transparencyPath,
  starPath,
  starDiscoveryPath,
  starCategoryPath,
  solarBodyPath,
  solarDiscoveryPath,
  deepSkyPath,
  deepSkyDiscoveryPath,
  explorationPath,
  explorationDiscoveryPath,
  humanSpaceflightPath,
  humanSpaceflightDiscoveryPath,
  observatoryPath,
  observatoryDiscoveryPath,
  exoplanetPath,
  exoplanetDiscoveryPath,
  historyPath,
  historyDiscoveryPath,
  cosmologyPath,
  cosmologyDiscoveryPath,
  imagePath,
  imageCollectionPath,
  imageGalleryPath,
  astrophotographyPath,
  dataPath,
  apiGroupPath,
  developerDocPath,
  contributePath,
  rocketPath,
  rocketDiscoveryPath,
  constellationPath,
  constellationDiscoveryPath,
  constellationFamilyPath,
  constellationSeasonPath,
  constellationRegionPath,
  constellationAsterismPath,
  satellitePath,
  satelliteDiscoveryPath,
  satelliteConstellationPath,
  satelliteOperatorPath,
  satelliteOrbitPath,
  satelliteNetworkPath,
  asteroidPath,
  asteroidDiscoveryPath,
  asteroidFamilyPath,
  asteroidGroupPath,
  asteroidNearEarthPath,
  asteroidTrojanPath,
  asteroidResonancePath,
  asteroidImpactPath,
  cometPath,
  cometDiscoveryPath,
  cometClassPath,
  cometFamilyPath,
  cometReservoirPath,
  cometActivePath,
  cometDormantPath,
  meteoritePath,
  meteoriteDiscoveryPath,
  meteoriteClassPath,
  meteoriteGroupPath,
  meteoriteFireballPath,
  meteoriteImpactStructurePath,
  meteoriteSitePath,
  interstellarObjectPath,
  interstellarDiscoveryPath,
  interstellarDetectionPath,
  interstellarTrajectoryPath,
  smallBodyMissionPath,
  smallBodyDiscoveryPath,
  smallBodyTypePath,
  smallBodySamplePath,
  dsnNetworkPath,
  dsnStationPath,
  dsnAntennaPath,
  dsnBandPath,
  dsnNavigationPath,
  dsnDiscoveryPath,
  spaceEnvironmentPath,
  spaceEnvironmentDiscoveryPath,
  missionOperationsPath,
  missionOperationsDiscoveryPath,
  spacecraftSystemsPath,
  spacecraftSystemsDiscoveryPath,
  instrumentsPath,
  instrumentsDiscoveryPath,
  planetaryGeologyPath,
  planetaryGeologyDiscoveryPath,
  institutionsPath,
  institutionsDiscoveryPath,
  spaceflightTimelinePath,
  spaceflightTimelineDiscoveryPath,
  spaceMedicinePath,
  spaceMedicineDiscoveryPath,
  spaceInfrastructurePath,
  spaceInfrastructureDiscoveryPath,
  futureExplorationPath,
  futureExplorationDiscoveryPath,
  methodPath,
  methodDiscoveryPath,
  timeDomainPath,
  timeDomainDiscoveryPath,
  galaxiesPath,
  galaxiesDiscoveryPath,
  astrobiologyPath,
  astrobiologyDiscoveryPath,
  planetaryDefensePath,
  planetaryDefenseDiscoveryPath,
  dataArchivesPath,
  dataArchivesDiscoveryPath,
  observatoryFrontierPath,
  observatoryFrontierDiscoveryPath,
  distanceLadderPath,
  distanceLadderDiscoveryPath,
  heliophysicsPath,
  heliophysicsDiscoveryPath,
  astroMlPath,
  astroMlDiscoveryPath,
  citizenAstronomyPath,
  citizenAstronomyDiscoveryPath,
  multiMessengerPath,
  multiMessengerDiscoveryPath,
  comparativePlanetologyPath,
  comparativePlanetologyDiscoveryPath,
  astrochemistryPath,
  astrochemistryDiscoveryPath,
  spacePolicyPath,
  spacePolicyDiscoveryPath,
  discoveryHistoryPath,
  discoveryHistoryDiscoveryPath,
  celestialMechanicsPath,
  celestialMechanicsDiscoveryPath,
  stellarAstrophysicsPath,
  stellarAstrophysicsDiscoveryPath,
  solarPhysicsPath,
  solarPhysicsDiscoveryPath,
  compactObjectsPath,
  compactObjectsDiscoveryPath,
  galacticAstronomyPath,
  galacticAstronomyDiscoveryPath,
  astroinformaticsPath,
  astroinformaticsDiscoveryPath,
  deepSpaceExplorationPath,
  deepSpaceExplorationDiscoveryPath,
  skyAtlasPath,
  skyAtlasDiscoveryPath,
  calculatorPath,
  calculatorsDiscoveryPath,
  observingPath,
  observingDiscoveryPath,
  graphViewPath,
  graphDiscoveryPath,
  assistantPath,
  assistantDiscoveryPath,
  livePath,
  liveDiscoveryPath,
  universeScenePath,
  workspaceFeaturePath,
  openPlatformPath,
  ROUTES,
} from "@/lib/routes";
import { ACTIVE_GALLERIES } from "@/app/images/galleries";
import { ASTRO_GUIDES } from "@/app/images/astrophotography";
import { DATA_SECTION_SLUGS, ENDPOINT_GROUPS, DEVELOPER_DOC_SLUGS } from "@/platform/open-data";
import { CONTRIBUTE_SLUGS } from "@/platform/contributions";

/**
 * Generates sitemap.xml from the content registry, so every public route is
 * included automatically. Static routes are listed explicitly; hubs and
 * categories are derived. As the site grows past Google's 50k-URL limit, this
 * can be split with generateSitemaps without changing the data source.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.home), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl(ROUTES.explore), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl(ROUTES.discover), changeFrequency: "weekly", priority: 0.6 },
    { url: absoluteUrl(ROUTES.entityIndex), changeFrequency: "weekly", priority: 0.6 },
    { url: absoluteUrl(ROUTES.topicIndex), changeFrequency: "weekly", priority: 0.6 },
    { url: absoluteUrl(ROUTES.compare), changeFrequency: "weekly", priority: 0.6 },
    { url: absoluteUrl(ROUTES.learn), changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl(ROUTES.timelines), changeFrequency: "weekly", priority: 0.6 },
    { url: absoluteUrl(ROUTES.search), changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl(ROUTES.community), changeFrequency: "weekly", priority: 0.6 },
    { url: absoluteUrl(ROUTES.openData), changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl(ROUTES.datasets), changeFrequency: "weekly", priority: 0.6 },
    { url: absoluteUrl(ROUTES.registry), changeFrequency: "weekly", priority: 0.6 },
    { url: absoluteUrl(ROUTES.developers), changeFrequency: "weekly", priority: 0.6 },
    { url: absoluteUrl(ROUTES.data), changeFrequency: "weekly", priority: 0.7 },
    ...DATA_SECTION_SLUGS.map((s) => ({ url: absoluteUrl(dataPath(s)), changeFrequency: "monthly" as const, priority: 0.5 })),
    { url: absoluteUrl(ROUTES.developersApi), changeFrequency: "weekly", priority: 0.6 },
    ...ENDPOINT_GROUPS.map((g) => ({ url: absoluteUrl(apiGroupPath(g)), changeFrequency: "monthly" as const, priority: 0.5 })),
    ...DEVELOPER_DOC_SLUGS.map((s) => ({ url: absoluteUrl(developerDocPath(s)), changeFrequency: "monthly" as const, priority: 0.5 })),
    { url: absoluteUrl(ROUTES.contribute), changeFrequency: "weekly", priority: 0.6 },
    ...CONTRIBUTE_SLUGS.map((s) => ({ url: absoluteUrl(contributePath(s)), changeFrequency: "monthly" as const, priority: 0.5 })),
    { url: absoluteUrl(ROUTES.platform), changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl(ROUTES.authority), changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl(ROUTES.transparency), changeFrequency: "weekly", priority: 0.7 },
    ...TRANSPARENCY_PAGES.map((p) => ({ url: absoluteUrl(transparencyPath(p.slug)), changeFrequency: "monthly" as const, priority: 0.5 })),
    ...DATASETS.map((d) => ({ url: absoluteUrl(datasetPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.5 })),
    ...[
      "observations",
      "astrophotography",
      "collections",
      "contributors",
      "learning",
      "explore-together",
    ].map((s) => ({ url: absoluteUrl(`/community/${s}`), changeFrequency: "monthly" as const, priority: 0.5 })),
    { url: absoluteUrl(ROUTES.about), changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl(ROUTES.editorialPolicy), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl(ROUTES.sourcesPolicy), changeFrequency: "yearly", priority: 0.3 },
  ];

  // Discovery: topic indexes, relationship pages, standalone graph entities.
  const discoveryRoutes: MetadataRoute.Sitemap = [
    ...TOPICS.map((t) => ({ url: absoluteUrl(topicPath(t.slug)), changeFrequency: "weekly" as const, priority: 0.6 })),
    ...RELATIONSHIP_PAGES.map((p) => ({ url: absoluteUrl(connectionPath(p.slug)), changeFrequency: "monthly" as const, priority: 0.5 })),
    ...COMPARISONS.map((c) => ({ url: absoluteUrl(comparePath(c.slug)), changeFrequency: "monthly" as const, priority: 0.5 })),
    ...LEARNING_PATHS.map((p) => ({ url: absoluteUrl(learnPath(p.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...TIMELINES.map((t) => ({ url: absoluteUrl(timelinePath(t.slug)), changeFrequency: "monthly" as const, priority: 0.5 })),
    ...getStandaloneEntities().map((e) => ({ url: absoluteUrl(entityGraphPath(e)), changeFrequency: "monthly" as const, priority: 0.4 })),
  ];

  // Star encyclopedia: hub, every star, discovery, constellation, and type pages.
  const starRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.stars), changeFrequency: "weekly", priority: 0.8 },
    ...engine.star.all().map((s) => ({ url: absoluteUrl(starPath(s.slug)), changeFrequency: "yearly" as const, priority: 0.5 })),
    ...STAR_DISCOVERIES.map((d) => ({ url: absoluteUrl(starDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    // Per-constellation star-list pages canonicalize to /constellations/{slug} (Program W), so they are not listed here.
    ...engine.star.categories().map((c) => ({ url: absoluteUrl(starCategoryPath(c.category)), changeFrequency: "monthly" as const, priority: 0.5 })),
  ];

  // Solar System encyclopedia: hub, every body, and discovery pages.
  const solarRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.solarSystem), changeFrequency: "weekly", priority: 0.8 },
    ...engine.solar.all().map((b) => ({ url: absoluteUrl(solarBodyPath(bodySlug(b.id))), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...SOLAR_DISCOVERIES.map((d) => ({ url: absoluteUrl(solarDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  const exoRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.exoplanets), changeFrequency: "weekly", priority: 0.8 },
    ...engine.exoplanets.allSlugs().map((s) => ({ url: absoluteUrl(exoplanetPath(s)), changeFrequency: "monthly" as const, priority: 0.5 })),
    ...EXO_DISCOVERIES.map((d) => ({ url: absoluteUrl(exoplanetDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  const historyRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.history), changeFrequency: "weekly", priority: 0.8 },
    ...engine.history.allSlugs().map((s) => ({ url: absoluteUrl(historyPath(s)), changeFrequency: "monthly" as const, priority: 0.5 })),
    ...HISTORY_DISCOVERIES.map((d) => ({ url: absoluteUrl(historyDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  const cosmologyRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.cosmology), changeFrequency: "weekly", priority: 0.8 },
    ...engine.cosmology.allSlugs().map((s) => ({ url: absoluteUrl(cosmologyPath(s)), changeFrequency: "monthly" as const, priority: 0.5 })),
    ...COSMO_DISCOVERIES.map((d) => ({ url: absoluteUrl(cosmologyDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  const skyRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.sky), changeFrequency: "weekly", priority: 0.8 },
    ...engine.liveSky.allSkyPaths().map((p) => ({ url: absoluteUrl(p), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  // Image archive. Image-sitemap support is prepared: each image page can carry
  // an `images` array of verified public URLs; none are populated yet because
  // the platform links to source archives rather than re-hosting binaries, and
  // no fabricated URL is ever emitted.
  const imageRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.images), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/images/astrophotography"), changeFrequency: "monthly", priority: 0.5 },
    ...engine.images.slugs().map((s) => ({ url: absoluteUrl(imagePath(s)), changeFrequency: "monthly" as const, priority: 0.5 })),
    ...engine.images.collections.slugs().map((s) => ({ url: absoluteUrl(imageCollectionPath(s)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...ACTIVE_GALLERIES.map((g) => ({ url: absoluteUrl(imageGalleryPath(g.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...ASTRO_GUIDES.map((g) => ({ url: absoluteUrl(astrophotographyPath(g.slug)), changeFrequency: "monthly" as const, priority: 0.5 })),
  ];

  const obsRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.observatories), changeFrequency: "weekly", priority: 0.8 },
    ...engine.observatories.all().map((r) => ({ url: absoluteUrl(observatoryPath(r.slug)), changeFrequency: "monthly" as const, priority: 0.5 })),
    ...OBS_DISCOVERIES.map((d) => ({ url: absoluteUrl(observatoryDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  const hsfRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.humanSpaceflight), changeFrequency: "weekly", priority: 0.8 },
    ...engine.humanSpaceflight.all().map((r) => ({ url: absoluteUrl(humanSpaceflightPath(r.slug)), changeFrequency: "monthly" as const, priority: 0.5 })),
    ...HSF_DISCOVERIES.map((d) => ({ url: absoluteUrl(humanSpaceflightDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  const explorationRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.exploration), changeFrequency: "weekly", priority: 0.8 },
    ...engine.exploration.all().map((r) => ({ url: absoluteUrl(explorationPath(r.slug)), changeFrequency: "monthly" as const, priority: 0.5 })),
    ...EXPLORATION_DISCOVERIES.map((d) => ({ url: absoluteUrl(explorationDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  const rocketRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.rockets), changeFrequency: "weekly", priority: 0.8 },
    // Only NEW rocket entities own a canonical /rockets/{slug} URL; reused entities
    // (existing:true) canonicalize to their primary home, so they are excluded here
    // to avoid duplicate-content URLs in the sitemap.
    ...engine.launchVehicles.all().filter((r) => !r.existing).map((r) => ({ url: absoluteUrl(rocketPath(r.slug)), changeFrequency: "monthly" as const, priority: 0.5 })),
    ...ROCKET_DISCOVERIES.map((d) => ({ url: absoluteUrl(rocketDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  const constellationRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.constellations), changeFrequency: "weekly", priority: 0.8 },
    ...engine.constellations.all().map((c) => ({ url: absoluteUrl(constellationPath(c.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...CONSTELLATION_DISCOVERIES.map((d) => ({ url: absoluteUrl(constellationDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...engine.constellations.families().map((f) => ({ url: absoluteUrl(constellationFamilyPath(f.slug)), changeFrequency: "monthly" as const, priority: 0.5 })),
    ...engine.constellations.seasons().map((s) => ({ url: absoluteUrl(constellationSeasonPath(s.slug)), changeFrequency: "monthly" as const, priority: 0.5 })),
    ...engine.constellations.asterisms().map((a) => ({ url: absoluteUrl(constellationAsterismPath(a.slug)), changeFrequency: "monthly" as const, priority: 0.5 })),
    ...(["northern", "southern", "equatorial"] as const).map((r) => ({ url: absoluteUrl(constellationRegionPath(r)), changeFrequency: "monthly" as const, priority: 0.5 })),
  ];

  const satelliteRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.satellites), changeFrequency: "weekly", priority: 0.8 },
    ...engine.satellites.satellites().map((s) => ({ url: absoluteUrl(satellitePath(s.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...engine.satellites.constellations().map((c) => ({ url: absoluteUrl(satelliteConstellationPath(c.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...engine.satellites.orbits().map((o) => ({ url: absoluteUrl(satelliteOrbitPath(o.slug)), changeFrequency: "monthly" as const, priority: 0.5 })),
    ...engine.satellites.operators().map((o) => ({ url: absoluteUrl(satelliteOperatorPath(o.slug)), changeFrequency: "monthly" as const, priority: 0.5 })),
    ...engine.satellites.networks().map((n) => ({ url: absoluteUrl(satelliteNetworkPath(n.slug)), changeFrequency: "monthly" as const, priority: 0.5 })),
    ...SATELLITE_DISCOVERIES.map((d) => ({ url: absoluteUrl(satelliteDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  const asteroidRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.asteroids), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/asteroids/planetary-defense"), changeFrequency: "monthly", priority: 0.7 },
    // Only NEW asteroid bodies own a canonical /asteroids/{slug} URL; reused bodies
    // (existing dwarf planets and asteroids) keep their Solar System / graph pages.
    ...engine.asteroids.pages().map((r) => ({ url: absoluteUrl(asteroidPath(r.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...ASTEROID_DISCOVERIES.map((d) => ({ url: absoluteUrl(asteroidDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...engine.asteroids.families().map((f) => ({ url: absoluteUrl(asteroidFamilyPath(f.slug)), changeFrequency: "monthly" as const, priority: 0.5 })),
    ...engine.asteroids.groups().map((g) => ({ url: absoluteUrl(asteroidGroupPath(g.slug)), changeFrequency: "monthly" as const, priority: 0.5 })),
    ...engine.asteroids.neoClasses().map((n) => ({ url: absoluteUrl(asteroidNearEarthPath(n.slug)), changeFrequency: "monthly" as const, priority: 0.5 })),
    ...engine.asteroids.trojans().map((t) => ({ url: absoluteUrl(asteroidTrojanPath(t.slug)), changeFrequency: "monthly" as const, priority: 0.5 })),
    ...engine.asteroids.resonances().map((r) => ({ url: absoluteUrl(asteroidResonancePath(r.slug)), changeFrequency: "monthly" as const, priority: 0.5 })),
    ...engine.asteroids.impacts().map((i) => ({ url: absoluteUrl(asteroidImpactPath(i.slug)), changeFrequency: "monthly" as const, priority: 0.5 })),
  ];

  const cometRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.comets), changeFrequency: "weekly", priority: 0.8 },
    // Only NEW comets own a canonical /comets/{slug} URL; the ten reused comets keep
    // their Solar System / graph pages.
    ...engine.comets.pages().map((r) => ({ url: absoluteUrl(cometPath(r.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...COMET_DISCOVERIES.map((d) => ({ url: absoluteUrl(cometDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...engine.comets.classes().map((c) => ({ url: absoluteUrl(cometClassPath(c.slug)), changeFrequency: "monthly" as const, priority: 0.5 })),
    ...engine.comets.families().map((f) => ({ url: absoluteUrl(cometFamilyPath(f.slug)), changeFrequency: "monthly" as const, priority: 0.5 })),
    ...engine.comets.reservoirs().map((r) => ({ url: absoluteUrl(cometReservoirPath(r.slug)), changeFrequency: "monthly" as const, priority: 0.5 })),
    ...engine.comets.activeAsteroids().map((r) => ({ url: absoluteUrl(cometActivePath(r.slug)), changeFrequency: "monthly" as const, priority: 0.5 })),
    ...engine.comets.dormantComets().map((r) => ({ url: absoluteUrl(cometDormantPath(r.slug)), changeFrequency: "monthly" as const, priority: 0.5 })),
  ];

  const meteoriteRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.meteorites), changeFrequency: "weekly", priority: 0.8 },
    ...engine.meteorites.meteorites().map((r) => ({ url: absoluteUrl(meteoritePath(r.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...METEORITE_DISCOVERIES.map((d) => ({ url: absoluteUrl(meteoriteDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...engine.meteorites.classes().map((c) => ({ url: absoluteUrl(meteoriteClassPath(c.slug)), changeFrequency: "monthly" as const, priority: 0.5 })),
    ...engine.meteorites.groups().map((g) => ({ url: absoluteUrl(meteoriteGroupPath(g.slug)), changeFrequency: "monthly" as const, priority: 0.5 })),
    ...engine.meteorites.fireballs().map((f) => ({ url: absoluteUrl(meteoriteFireballPath(f.slug)), changeFrequency: "monthly" as const, priority: 0.5 })),
    ...engine.meteorites.structures().map((s) => ({ url: absoluteUrl(meteoriteImpactStructurePath(s.slug)), changeFrequency: "monthly" as const, priority: 0.5 })),
    ...engine.meteorites.sites().map((s) => ({ url: absoluteUrl(meteoriteSitePath(s.slug)), changeFrequency: "monthly" as const, priority: 0.5 })),
  ];

  const interstellarRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.interstellarObjects), changeFrequency: "weekly", priority: 0.8 },
    ...engine.interstellarObjects.all().map((r) => ({ url: absoluteUrl(interstellarObjectPath(r.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...INTERSTELLAR_DISCOVERIES.map((d) => ({ url: absoluteUrl(interstellarDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...engine.interstellarObjects.detectionMethods().map((m) => ({ url: absoluteUrl(interstellarDetectionPath(m.slug)), changeFrequency: "monthly" as const, priority: 0.5 })),
    ...engine.interstellarObjects.trajectoryClasses().map((c) => ({ url: absoluteUrl(interstellarTrajectoryPath(c.slug)), changeFrequency: "monthly" as const, priority: 0.5 })),
  ];

  const smallBodyMissionRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.smallBodyMissions), changeFrequency: "weekly", priority: 0.8 },
    // Only NEW missions are listed here; reused missions keep their canonical home page,
    // so their /small-body-missions/{slug} view is excluded to avoid duplicate content.
    ...engine.smallBodyMissions.missions().filter((m) => !m.existing).map((r) => ({ url: absoluteUrl(smallBodyMissionPath(r.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...MISSION_DISCOVERIES.map((d) => ({ url: absoluteUrl(smallBodyDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...engine.smallBodyMissions.classes().map((c) => ({ url: absoluteUrl(smallBodyTypePath(c.slug)), changeFrequency: "monthly" as const, priority: 0.5 })),
    ...engine.smallBodyMissions.samples().map((s) => ({ url: absoluteUrl(smallBodySamplePath(s.slug)), changeFrequency: "monthly" as const, priority: 0.5 })),
  ];

  const deepSpaceNetworkRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.deepSpaceNetwork), changeFrequency: "weekly", priority: 0.8 },
    // Reused networks keep their canonical home; only NEW networks are listed here.
    ...engine.deepSpaceCommunications.networks().filter((n) => !n.existing).map((r) => ({ url: absoluteUrl(dsnNetworkPath(r.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...DSCOMM_DISCOVERIES.map((d) => ({ url: absoluteUrl(dsnDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...engine.deepSpaceCommunications.allStations().map((s) => ({ url: absoluteUrl(dsnStationPath(s.slug)), changeFrequency: "monthly" as const, priority: 0.5 })),
    ...engine.deepSpaceCommunications.antennas().map((a) => ({ url: absoluteUrl(dsnAntennaPath(a.slug)), changeFrequency: "monthly" as const, priority: 0.5 })),
    ...engine.deepSpaceCommunications.signalBands().map((b) => ({ url: absoluteUrl(dsnBandPath(b.slug)), changeFrequency: "monthly" as const, priority: 0.5 })),
    ...engine.deepSpaceCommunications.navigationMethods().map((m) => ({ url: absoluteUrl(dsnNavigationPath(m.slug)), changeFrequency: "monthly" as const, priority: 0.5 })),
  ];

  const spaceEnvironmentRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.spaceEnvironment), changeFrequency: "weekly", priority: 0.8 },
    ...engine.spaceEnvironment.all().map((r) => ({ url: absoluteUrl(spaceEnvironmentPath(r.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...ENV_DISCOVERIES.map((d) => ({ url: absoluteUrl(spaceEnvironmentDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  const missionOperationsRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.missionOperations), changeFrequency: "weekly", priority: 0.8 },
    ...engine.missionOperations.all().map((r) => ({ url: absoluteUrl(missionOperationsPath(r.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...OPS_DISCOVERIES.map((d) => ({ url: absoluteUrl(missionOperationsDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  const spacecraftSystemsRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.spacecraftSystems), changeFrequency: "weekly", priority: 0.8 },
    ...engine.spacecraftSystems.all().map((r) => ({ url: absoluteUrl(spacecraftSystemsPath(r.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...SYS_DISCOVERIES.map((d) => ({ url: absoluteUrl(spacecraftSystemsDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  const instrumentsRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.instruments), changeFrequency: "weekly", priority: 0.8 },
    ...engine.instruments.all().map((r) => ({ url: absoluteUrl(instrumentsPath(r.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...INST_DISCOVERIES.map((d) => ({ url: absoluteUrl(instrumentsDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  const planetaryGeologyRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.planetaryGeology), changeFrequency: "weekly", priority: 0.8 },
    ...engine.planetaryGeology.all().map((r) => ({ url: absoluteUrl(planetaryGeologyPath(r.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...GEO_DISCOVERIES.map((d) => ({ url: absoluteUrl(planetaryGeologyDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  const institutionsRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.institutions), changeFrequency: "weekly", priority: 0.8 },
    ...engine.institutions.all().map((r) => ({ url: absoluteUrl(institutionsPath(r.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...INSTITUTION_DISCOVERIES.map((d) => ({ url: absoluteUrl(institutionsDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  const spaceflightTimelineRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.spaceflightTimeline), changeFrequency: "weekly", priority: 0.8 },
    ...engine.spaceflightHistory.all().map((r) => ({ url: absoluteUrl(spaceflightTimelinePath(r.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...TIMELINE_DISCOVERIES.map((d) => ({ url: absoluteUrl(spaceflightTimelineDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  const spaceMedicineRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.spaceMedicine), changeFrequency: "weekly", priority: 0.8 },
    ...engine.spaceMedicine.all().map((r) => ({ url: absoluteUrl(spaceMedicinePath(r.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...MED_DISCOVERIES.map((d) => ({ url: absoluteUrl(spaceMedicineDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  const spaceInfrastructureRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.spaceInfrastructure), changeFrequency: "weekly", priority: 0.8 },
    ...engine.spaceInfrastructure.all().map((r) => ({ url: absoluteUrl(spaceInfrastructurePath(r.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...INFRA_DISCOVERIES.map((d) => ({ url: absoluteUrl(spaceInfrastructureDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  const futureExplorationRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.futureExploration), changeFrequency: "weekly", priority: 0.8 },
    ...engine.futureMissions.all().map((r) => ({ url: absoluteUrl(futureExplorationPath(r.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...FUTURE_DISCOVERIES.map((d) => ({ url: absoluteUrl(futureExplorationDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  const methodsRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.methods), changeFrequency: "weekly", priority: 0.8 },
    ...engine.astronomyMethods.all().map((r) => ({ url: absoluteUrl(methodPath(r.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...METHOD_DISCOVERIES.map((d) => ({ url: absoluteUrl(methodDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  const timeDomainRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.timeDomain), changeFrequency: "weekly", priority: 0.8 },
    ...engine.timeDomain.all().map((r) => ({ url: absoluteUrl(timeDomainPath(r.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...TD_DISCOVERIES.map((d) => ({ url: absoluteUrl(timeDomainDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  const galaxiesRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.galaxies), changeFrequency: "weekly", priority: 0.8 },
    ...engine.galaxies.all().map((r) => ({ url: absoluteUrl(galaxiesPath(r.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...GX_DISCOVERIES.map((d) => ({ url: absoluteUrl(galaxiesDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  const astrobiologyRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.astrobiology), changeFrequency: "weekly", priority: 0.8 },
    ...engine.astrobiology.all().map((r) => ({ url: absoluteUrl(astrobiologyPath(r.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...AB_DISCOVERIES.map((d) => ({ url: absoluteUrl(astrobiologyDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  const planetaryDefenseRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.planetaryDefense), changeFrequency: "weekly", priority: 0.8 },
    ...engine.planetaryDefense.all().map((r) => ({ url: absoluteUrl(planetaryDefensePath(r.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...PD_DISCOVERIES.map((d) => ({ url: absoluteUrl(planetaryDefenseDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  const dataArchivesRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.dataArchives), changeFrequency: "weekly", priority: 0.8 },
    ...engine.dataArchives.all().map((r) => ({ url: absoluteUrl(dataArchivesPath(r.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...AT_DISCOVERIES.map((d) => ({ url: absoluteUrl(dataArchivesDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  const observatoryFrontierRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.observatoryFrontier), changeFrequency: "weekly", priority: 0.8 },
    ...engine.observatoryFrontier.all().map((r) => ({ url: absoluteUrl(observatoryFrontierPath(r.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...AU_DISCOVERIES.map((d) => ({ url: absoluteUrl(observatoryFrontierDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  const distanceLadderRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.distanceLadder), changeFrequency: "weekly", priority: 0.8 },
    ...engine.distanceLadder.all().map((r) => ({ url: absoluteUrl(distanceLadderPath(r.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...AV_DISCOVERIES.map((d) => ({ url: absoluteUrl(distanceLadderDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  const heliophysicsRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.heliophysics), changeFrequency: "weekly", priority: 0.8 },
    ...engine.heliophysics.all().map((r) => ({ url: absoluteUrl(heliophysicsPath(r.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...AW_DISCOVERIES.map((d) => ({ url: absoluteUrl(heliophysicsDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  const astroMlRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.astroMl), changeFrequency: "weekly", priority: 0.8 },
    ...engine.astroMl.all().map((r) => ({ url: absoluteUrl(astroMlPath(r.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...AX_DISCOVERIES.map((d) => ({ url: absoluteUrl(astroMlDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  const citizenAstronomyRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.citizenAstronomy), changeFrequency: "weekly", priority: 0.8 },
    ...engine.citizenAstronomy.all().map((r) => ({ url: absoluteUrl(citizenAstronomyPath(r.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...AY_DISCOVERIES.map((d) => ({ url: absoluteUrl(citizenAstronomyDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  const multiMessengerRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.multiMessenger), changeFrequency: "weekly", priority: 0.8 },
    ...engine.multiMessenger.all().map((r) => ({ url: absoluteUrl(multiMessengerPath(r.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...AZ_DISCOVERIES.map((d) => ({ url: absoluteUrl(multiMessengerDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  const comparativePlanetologyRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.comparativePlanetology), changeFrequency: "weekly", priority: 0.8 },
    ...engine.comparativePlanetology.all().map((r) => ({ url: absoluteUrl(comparativePlanetologyPath(r.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...BA_DISCOVERIES.map((d) => ({ url: absoluteUrl(comparativePlanetologyDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  const astrochemistryRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.astrochemistry), changeFrequency: "weekly", priority: 0.8 },
    ...engine.astrochemistry.all().map((r) => ({ url: absoluteUrl(astrochemistryPath(r.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...BB_DISCOVERIES.map((d) => ({ url: absoluteUrl(astrochemistryDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  const spacePolicyRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.spacePolicy), changeFrequency: "weekly", priority: 0.8 },
    ...engine.spacePolicy.all().map((r) => ({ url: absoluteUrl(spacePolicyPath(r.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...BC_DISCOVERIES.map((d) => ({ url: absoluteUrl(spacePolicyDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  const discoveryHistoryRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.discoveryHistory), changeFrequency: "weekly", priority: 0.8 },
    ...engine.discoveryHistory.all().map((r) => ({ url: absoluteUrl(discoveryHistoryPath(r.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...BD_DISCOVERIES.map((d) => ({ url: absoluteUrl(discoveryHistoryDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  const celestialMechanicsRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.celestialMechanics), changeFrequency: "weekly", priority: 0.8 },
    ...engine.celestialMechanics.all().map((r) => ({ url: absoluteUrl(celestialMechanicsPath(r.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...BE_DISCOVERIES.map((d) => ({ url: absoluteUrl(celestialMechanicsDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  const stellarAstrophysicsRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.stellarAstrophysics), changeFrequency: "weekly", priority: 0.8 },
    ...engine.stellarAstrophysics.all().map((r) => ({ url: absoluteUrl(stellarAstrophysicsPath(r.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...BF_DISCOVERIES.map((d) => ({ url: absoluteUrl(stellarAstrophysicsDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  const solarPhysicsRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.solarPhysics), changeFrequency: "weekly", priority: 0.8 },
    ...engine.solarPhysics.all().map((r) => ({ url: absoluteUrl(solarPhysicsPath(r.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...BY_DISCOVERIES.map((d) => ({ url: absoluteUrl(solarPhysicsDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  const compactObjectsRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.compactObjects), changeFrequency: "weekly", priority: 0.8 },
    ...engine.compactObjects.all().map((r) => ({ url: absoluteUrl(compactObjectsPath(r.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...BZ_DISCOVERIES.map((d) => ({ url: absoluteUrl(compactObjectsDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  const galacticAstronomyRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.galacticAstronomy), changeFrequency: "weekly", priority: 0.8 },
    ...engine.galacticAstronomy.all().map((r) => ({ url: absoluteUrl(galacticAstronomyPath(r.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...BG_DISCOVERIES.map((d) => ({ url: absoluteUrl(galacticAstronomyDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  const astroinformaticsRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.astroinformatics), changeFrequency: "weekly", priority: 0.8 },
    ...engine.astroinformatics.all().map((r) => ({ url: absoluteUrl(astroinformaticsPath(r.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...BH_DISCOVERIES.map((d) => ({ url: absoluteUrl(astroinformaticsDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  const deepSpaceExplorationRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.deepSpaceExploration), changeFrequency: "weekly", priority: 0.8 },
    ...engine.deepSpaceExploration.all().map((r) => ({ url: absoluteUrl(deepSpaceExplorationPath(r.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...BI_DISCOVERIES.map((d) => ({ url: absoluteUrl(deepSpaceExplorationDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  const skyAtlasRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.skyAtlas), changeFrequency: "weekly", priority: 0.8 },
    ...engine.skyAtlas.all().map((r) => ({ url: absoluteUrl(skyAtlasPath(r.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...BO_DISCOVERIES.map((d) => ({ url: absoluteUrl(skyAtlasDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  const calculatorRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.calculators), changeFrequency: "weekly", priority: 0.8 },
    ...engine.scientificCalculators.all().map((r) => ({ url: absoluteUrl(calculatorPath(r.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...BP_DISCOVERIES.map((d) => ({ url: absoluteUrl(calculatorsDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  const observingRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.observing), changeFrequency: "weekly", priority: 0.8 },
    ...engine.observingSuite.all().map((r) => ({ url: absoluteUrl(observingPath(r.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...BQ_DISCOVERIES.map((d) => ({ url: absoluteUrl(observingDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  const graphRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.graph), changeFrequency: "weekly", priority: 0.8 },
    ...engine.graphExplorer.all().map((r) => ({ url: absoluteUrl(graphViewPath(r.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...BR_DISCOVERIES.map((d) => ({ url: absoluteUrl(graphDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  const assistantRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.assistant), changeFrequency: "weekly", priority: 0.8 },
    ...["entity", "compare", "evidence-path", "learning", "limitations"].map((s) => ({ url: absoluteUrl(`${ROUTES.assistant}/${s}`), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...engine.scientificAssistant.all().map((r) => ({ url: absoluteUrl(assistantPath(r.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...BS_DISCOVERIES.map((d) => ({ url: absoluteUrl(assistantDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  const liveRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.live), changeFrequency: "daily", priority: 0.8 },
    { url: absoluteUrl(`${ROUTES.live}/data-status`), changeFrequency: "daily", priority: 0.6 },
    ...engine.liveScientificData.all().map((r) => ({ url: absoluteUrl(livePath(r.slug)), changeFrequency: "weekly" as const, priority: 0.6 })),
    ...BT_DISCOVERIES.map((d) => ({ url: absoluteUrl(liveDiscoveryPath(d.slug)), changeFrequency: "weekly" as const, priority: 0.6 })),
  ];

  const universe3dRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.universe3d), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl(`${ROUTES.universe3d}/data-coverage`), changeFrequency: "monthly", priority: 0.6 },
    ...engine.webglUniverse.all().map((r) => ({ url: absoluteUrl(universeScenePath(r.slug)), changeFrequency: "monthly" as const, priority: 0.7 })),
  ];

  const workspaceRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.workspace), changeFrequency: "monthly", priority: 0.7 },
    ...["collections", "notes", "citations", "exports", "privacy"].map((s) => ({ url: absoluteUrl(workspaceFeaturePath(s)), changeFrequency: "monthly" as const, priority: 0.5 })),
  ];

  const openPlatformRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.openPlatform), changeFrequency: "monthly", priority: 0.8 },
    ...["api", "graph", "datasets", "downloads", "licenses", "sdk", "federation", "roadmap"].map((s) => ({ url: absoluteUrl(openPlatformPath(s)), changeFrequency: "monthly" as const, priority: 0.6 })),
    { url: absoluteUrl("/developers/platform"), changeFrequency: "monthly", priority: 0.6 },
  ];

  const deepSkyRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl(ROUTES.deepSky), changeFrequency: "weekly", priority: 0.8 },
    ...engine.deepSky.all().map((d) => ({ url: absoluteUrl(deepSkyPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.5 })),
    ...DEEP_SKY_DISCOVERIES.map((d) => ({ url: absoluteUrl(deepSkyDiscoveryPath(d.slug)), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  const sectionRoutes: MetadataRoute.Sitemap = getAllSections().map((section) => ({
    url: absoluteUrl(sectionPath(section)),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = getAllCategories().map(
    ({ section, category }) => ({
      url: absoluteUrl(categoryPath(section, category)),
      changeFrequency: "monthly",
      priority: 0.6,
    }),
  );

  // Published entries (the third taxonomy level).
  const entryRoutes: MetadataRoute.Sitemap = getAllEntries().map((entry) => ({
    url: entry.canonicalUrl,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [
    ...staticRoutes,
    ...sectionRoutes,
    ...categoryRoutes,
    ...entryRoutes,
    ...discoveryRoutes,
    ...starRoutes,
    ...solarRoutes,
    ...deepSkyRoutes,
    ...explorationRoutes,
    ...rocketRoutes,
    ...constellationRoutes,
    ...satelliteRoutes,
    ...asteroidRoutes,
    ...cometRoutes,
    ...meteoriteRoutes,
    ...interstellarRoutes,
    ...smallBodyMissionRoutes,
    ...deepSpaceNetworkRoutes,
    ...spaceEnvironmentRoutes,
    ...missionOperationsRoutes,
    ...spacecraftSystemsRoutes,
    ...instrumentsRoutes,
    ...planetaryGeologyRoutes,
    ...institutionsRoutes,
    ...spaceflightTimelineRoutes,
    ...spaceMedicineRoutes,
    ...spaceInfrastructureRoutes,
    ...futureExplorationRoutes,
    ...methodsRoutes,
    ...timeDomainRoutes,
    ...galaxiesRoutes,
    ...astrobiologyRoutes,
    ...planetaryDefenseRoutes,
    ...dataArchivesRoutes,
    ...observatoryFrontierRoutes,
    ...distanceLadderRoutes,
    ...heliophysicsRoutes,
    ...astroMlRoutes,
    ...citizenAstronomyRoutes,
    ...multiMessengerRoutes,
    ...comparativePlanetologyRoutes,
    ...astrochemistryRoutes,
    ...spacePolicyRoutes,
    ...discoveryHistoryRoutes,
    ...celestialMechanicsRoutes,
    ...stellarAstrophysicsRoutes,
    ...solarPhysicsRoutes,
    ...compactObjectsRoutes,
    ...galacticAstronomyRoutes,
    ...astroinformaticsRoutes,
    ...deepSpaceExplorationRoutes,
    ...skyAtlasRoutes,
    ...calculatorRoutes,
    ...observingRoutes,
    ...graphRoutes,
    ...assistantRoutes,
    ...liveRoutes,
    ...universe3dRoutes,
    ...workspaceRoutes,
    ...openPlatformRoutes,
    ...hsfRoutes,
    ...obsRoutes,
    ...exoRoutes,
    ...historyRoutes,
    ...cosmologyRoutes,
    ...skyRoutes,
    ...imageRoutes,
  ].map((entry) => ({
    lastModified: now,
    ...entry,
  }));
}
