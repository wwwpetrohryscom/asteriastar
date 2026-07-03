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
