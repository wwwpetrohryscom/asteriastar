import type { ImageAsset } from "@/lib/media/types";

/**
 * Image asset registry.
 *
 * Verified, openly-licensed/public-domain editorial image assets. Every record
 * stores credit, license, source page, original archive URL, and local optimized
 * dimensions. No fabricated imagery is ever added here.
 */
export const IMAGES: ImageAsset[] = [
  {
    id: "webb-cosmic-cliffs",
    entityId: "nebula:ngc-3372",
    entryPath: "/astronomy/space-telescopes/james-webb-space-telescope",
    title: "Cosmic Cliffs in the Carina Nebula",
    alt: "A glowing cliff-like ridge of orange gas and dust below a blue star-filled sky in the Carina Nebula.",
    url: "/editorial/cosmic-cliffs.jpg",
    width: 1600,
    height: 926,
    credit: "NASA, ESA, CSA, STScI",
    provider: "jwst",
    sourceUrl: "https://images.nasa.gov/details/carina_nebula",
    originalUrl: "https://images-assets.nasa.gov/image/carina_nebula/carina_nebula~large.jpg",
    license: "nasa-media",
    source: "nasa",
    captureDate: "2022-07-12",
    instrument: "NIRCam",
    mission: "James Webb Space Telescope",
    author: "STScI (Webb)",
    object: "Carina Nebula / NGC 3324",
    published: true,
  },
  {
    id: "webb-first-deep-field",
    entityId: "scientific_image:webb-first-deep-field",
    entryPath: "/astronomy/space-missions/james-webb-space-telescope",
    title: "Webb's First Deep Field",
    alt: "Thousands of galaxies fill a black infrared deep field, with several galaxies stretched into arcs by gravitational lensing.",
    url: "/editorial/webb-deep-field.jpg",
    width: 1200,
    height: 1225,
    credit: "NASA, ESA, CSA, STScI",
    provider: "jwst",
    sourceUrl: "https://images.nasa.gov/details/webb_first_deep_field",
    originalUrl: "https://images-assets.nasa.gov/image/webb_first_deep_field/webb_first_deep_field~large.jpg",
    license: "nasa-media",
    source: "nasa",
    captureDate: "2022-07-12",
    instrument: "NIRCam",
    mission: "James Webb Space Telescope",
    author: "STScI",
    object: "SMACS 0723",
    published: true,
  },
  {
    id: "hubble-pillars-creation",
    entityId: "nebula:eagle-nebula",
    entryPath: "/astronomy/space-telescopes/hubble-space-telescope",
    title: "Pillars of Creation",
    alt: "Tall columns of gas and dust in the Eagle Nebula stand against a dense field of stars.",
    url: "/editorial/pillars-hubble.jpg",
    width: 1200,
    height: 1124,
    credit: "NASA, ESA, and the Hubble Heritage Team (STScI/AURA)",
    provider: "hubble",
    sourceUrl: "https://images.nasa.gov/details/GSFC_20171208_Archive_e000842",
    originalUrl: "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000842/GSFC_20171208_Archive_e000842~large.jpg",
    license: "nasa-media",
    source: "nasa",
    instrument: "Hubble Space Telescope",
    mission: "Hubble Space Telescope",
    author: "NASA Goddard",
    object: "Eagle Nebula / Messier 16",
    published: true,
  },
  {
    id: "blue-marble-viirs",
    entityId: "planet:earth",
    entryPath: "/astronomy/planets/earth",
    title: "Blue Marble Earth",
    alt: "A full-disc view of Earth with blue oceans, white cloud systems, and the continents visible against black space.",
    url: "/editorial/blue-marble.jpg",
    width: 1200,
    height: 1200,
    credit: "NASA/NOAA/GSFC/Suomi NPP/VIIRS/Norman Kuring",
    provider: "nasa",
    sourceUrl: "https://images.nasa.gov/details/PIA18033",
    originalUrl: "https://images-assets.nasa.gov/image/PIA18033/PIA18033~large.jpg",
    license: "nasa-media",
    source: "nasa",
    captureDate: "2012-01-30",
    instrument: "VIIRS",
    mission: "Suomi NPP",
    author: "NASA",
    photographer: "Norman Kuring",
    object: "Earth",
    published: true,
  },
  {
    id: "sun-sdo",
    entityId: "star:sun",
    entryPath: "/solar-physics",
    title: "The Sun from Solar Dynamics Observatory",
    alt: "A full-disc view of the Sun in golden ultraviolet light, with bright active regions and coronal structure visible around the limb.",
    url: "/editorial/sun-sdo.jpg",
    width: 1800,
    height: 1800,
    credit: "NASA/GSFC/Solar Dynamics Observatory",
    provider: "nasa",
    sourceUrl: "https://images.nasa.gov/details/PIA26681",
    originalUrl: "https://images-assets.nasa.gov/image/PIA26681/PIA26681~orig.jpg",
    license: "nasa-media",
    source: "nasa",
    captureDate: "2025-09-10",
    instrument: "Atmospheric Imaging Assembly",
    mission: "Solar Dynamics Observatory",
    author: "NASA Goddard Space Flight Center",
    object: "Sun",
    published: true,
  },
  {
    id: "jupiter-hubble",
    entityId: "planet:jupiter",
    entryPath: "/solar-system/jupiter",
    title: "Hubble Close-up Portrait of Jupiter",
    alt: "A full-disc Hubble view of Jupiter showing layered cloud bands and the Great Red Spot against black space.",
    url: "/editorial/jupiter-hubble.jpg",
    width: 1400,
    height: 1400,
    credit: "NASA Goddard",
    provider: "hubble",
    sourceUrl: "https://images.nasa.gov/details/GSFC_20171208_Archive_e000103",
    originalUrl: "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000103/GSFC_20171208_Archive_e000103~orig.png",
    license: "nasa-media",
    source: "nasa",
    captureDate: "2017-04-06",
    instrument: "Hubble Space Telescope",
    mission: "Hubble Space Telescope",
    author: "NASA Goddard",
    object: "Jupiter",
    published: true,
  },
  {
    id: "trumpler-14-hubble",
    entityId: "star_cluster:trumpler-14",
    entryPath: "/astronomy/stars",
    title: "Trumpler 14 Star Cluster",
    alt: "A dense Hubble star field with bright blue-white stars and surrounding gas in the Trumpler 14 cluster.",
    url: "/editorial/trumpler-14-hubble.jpg",
    width: 1800,
    height: 1800,
    credit: "NASA/STScI",
    provider: "hubble",
    sourceUrl: "https://images.nasa.gov/details/PIA20468",
    originalUrl: "https://images-assets.nasa.gov/image/PIA20468/PIA20468~orig.jpg",
    license: "nasa-media",
    source: "nasa",
    captureDate: "2016-01-21",
    instrument: "Hubble Space Telescope",
    mission: "Hubble Space Telescope",
    author: "NASA/STScI",
    object: "Trumpler 14",
    published: true,
  },
  {
    id: "saturn-cassini",
    entityId: "planet:saturn",
    entryPath: "/solar-system/saturn",
    title: "Cassini Global Portrait of Saturn",
    alt: "A natural-color Cassini mosaic of Saturn and its rings floating against black space.",
    url: "/editorial/saturn-cassini.jpg",
    width: 2200,
    height: 1125,
    credit: "NASA/JPL/Space Science Institute",
    provider: "nasa",
    sourceUrl: "https://images.nasa.gov/details/PIA06193",
    originalUrl: "https://images-assets.nasa.gov/image/PIA06193/PIA06193~orig.jpg",
    license: "nasa-media",
    source: "nasa",
    captureDate: "2005-02-24",
    instrument: "Cassini Imaging Science Subsystem",
    mission: "Cassini-Huygens",
    author: "NASA/JPL/Space Science Institute",
    object: "Saturn",
    published: true,
  },
  {
    id: "mars-marathon-valley",
    entityId: "planet:mars",
    entryPath: "/solar-system/mars",
    title: "Hinners Point Above Marathon Valley on Mars",
    alt: "A panoramic view from NASA's Opportunity rover showing a rocky ridge and ochre Martian terrain in Marathon Valley.",
    url: "/editorial/mars-marathon-valley.jpg",
    width: 3200,
    height: 983,
    credit: "NASA/JPL-Caltech/Cornell Univ./Arizona State Univ.",
    provider: "nasa",
    sourceUrl: "https://images.nasa.gov/details/PIA19819",
    originalUrl: "https://images-assets.nasa.gov/image/PIA19819/PIA19819~orig.jpg",
    license: "nasa-media",
    source: "nasa",
    captureDate: "2015-09-25",
    instrument: "Pancam",
    mission: "Mars Exploration Rover Opportunity",
    author: "NASA/JPL-Caltech/Cornell Univ./Arizona State Univ.",
    object: "Mars / Marathon Valley",
    published: true,
  },
];

/** Validate image records (used by `npm run validate`). */
export function validateImages(): string[] {
  const issues: string[] = [];
  const seen = new Set<string>();
  for (const img of IMAGES) {
    if (seen.has(img.id)) issues.push(`duplicate image id: ${img.id}`);
    seen.add(img.id);
    if (img.published) {
      if (!img.url) issues.push(`${img.id}: published image has no url`);
      if (!img.credit) issues.push(`${img.id}: published image has no credit`);
      if (!img.sourceUrl) issues.push(`${img.id}: published image has no sourceUrl`);
      if (!img.originalUrl) issues.push(`${img.id}: published image has no originalUrl`);
      if (!img.author && !img.photographer) issues.push(`${img.id}: published image has no author/photographer`);
    }
  }
  return issues;
}

export function getImageAsset(id: string): ImageAsset | undefined {
  return IMAGES.find((i) => i.id === id && i.published && i.url);
}

/** Published, displayable images for a graph entity id. */
export function getImagesForEntity(entityId: string): ImageAsset[] {
  return IMAGES.filter((i) => i.published && i.url && i.entityId === entityId);
}

/** Published, displayable images for a content entry path. */
export function getImagesForEntryPath(path: string): ImageAsset[] {
  return IMAGES.filter((i) => i.published && i.url && i.entryPath === path);
}

export const IMAGE_STATS = {
  total: IMAGES.length,
  published: IMAGES.filter((i) => i.published && i.url).length,
} as const;
