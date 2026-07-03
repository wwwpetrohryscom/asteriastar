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
