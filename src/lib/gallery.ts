import { IMAGES } from "@/lib/media/registry";
import { IMAGE_LICENSE_LABELS, type ImageAsset } from "@/lib/media/types";
import { getEntityById, entityGraphPath } from "@/knowledge-graph";
import { solarBodyPath } from "@/lib/routes";
import { bodySlug } from "@/knowledge-graph/data/solar-system-catalog";

/**
 * The gallery is a real-image front door onto the media library
 * (`src/lib/media/registry.ts`). Each card shows a real, openly-licensed,
 * self-hosted photograph of an actual object and links to that object's page.
 * Objects are grouped into categories by their knowledge-graph entity type.
 */
export interface GalleryImage {
  id: string;
  entityId: string;
  url: string;
  alt: string;
  blurDataURL?: string;
  title: string;
  object: string;
  credit: string;
  licenseLabel: string;
  href: string;
}

export interface GalleryCategory {
  slug: string;
  title: string;
  tagline: string;
  images: GalleryImage[];
}

const CATEGORY_DEFS: { slug: string; title: string; tagline: string; types: string[] }[] = [
  { slug: "galaxies", title: "Galaxies", tagline: "Spiral, elliptical and interacting galaxies across the visible and infrared spectrum.", types: ["galaxy"] },
  { slug: "nebulae", title: "Nebulae", tagline: "Star-forming regions, planetary nebulae and supernova remnants from Hubble and Webb.", types: ["nebula", "supernova_remnant"] },
  { slug: "star-clusters", title: "Star clusters", tagline: "Open and globular clusters — dense cities of stars.", types: ["star_cluster"] },
  { slug: "planets", title: "Planets & dwarf planets", tagline: "The worlds of the Solar System, portrayed by orbiters, flybys and Hubble.", types: ["planet", "dwarf_planet"] },
  { slug: "moons", title: "Moons", tagline: "Natural satellites — from our Moon to the icy ocean worlds of the giants.", types: ["moon"] },
  { slug: "sun-and-stars", title: "The Sun & stars", tagline: "Our star and its neighbours across ultraviolet, visible and infrared light.", types: ["star"] },
  { slug: "comets-asteroids", title: "Comets & asteroids", tagline: "Small bodies visited by spacecraft, and comets imaged from Earth and space.", types: ["comet", "asteroid"] },
  { slug: "black-holes", title: "Black holes", tagline: "Event-horizon-scale imagery of the Universe's most extreme objects.", types: ["black_hole"] },
  { slug: "telescopes", title: "Telescopes & observatories", tagline: "The instruments that take these images — in orbit and on the ground.", types: ["space_telescope", "observatory"] },
  { slug: "missions", title: "Missions & spacecraft", tagline: "The probes, rovers, spacecraft and launch vehicles of the space age.", types: ["space_mission", "spacecraft", "launch_vehicle"] },
  { slug: "surface-features", title: "Surface features", tagline: "Mountains, canyons and terrains mapped across the Solar System.", types: ["surface_feature"] },
  { slug: "constellations", title: "Constellations", tagline: "The patterns of the night sky and their brightest stars.", types: ["constellation"] },
  { slug: "space-weather", title: "Space weather", tagline: "Aurorae, solar flares and the dynamic Sun–Earth connection.", types: ["space_weather_phenomenon"] },
];

const TYPE_TO_CATEGORY = new Map<string, (typeof CATEGORY_DEFS)[number]>();
for (const c of CATEGORY_DEFS) for (const t of c.types) TYPE_TO_CATEGORY.set(t, c);

/** Canonical page URL for an entity that has an image. */
function entityHref(entityId: string): string {
  const e = getEntityById(entityId);
  const type = entityId.split(":")[0];
  if (e?.entryPath) return e.entryPath;
  if (["planet", "dwarf_planet", "moon", "surface_feature"].includes(type)) return solarBodyPath(bodySlug(entityId));
  if (e) return entityGraphPath(e);
  return "/explore";
}

function toGalleryImage(img: ImageAsset): GalleryImage {
  return {
    id: img.id,
    entityId: img.entityId ?? "",
    url: img.url ?? "",
    alt: img.alt,
    blurDataURL: img.blurDataURL,
    title: img.title,
    object: img.object ?? img.title,
    credit: img.credit,
    licenseLabel: IMAGE_LICENSE_LABELS[img.license],
    href: entityHref(img.entityId ?? ""),
  };
}

/** One representative (hero) image per entity, in registry order. */
function heroImages(): ImageAsset[] {
  const seen = new Set<string>();
  const out: ImageAsset[] = [];
  for (const img of IMAGES) {
    if (!img.published || !img.url || !img.entityId) continue;
    if (seen.has(img.entityId)) continue;
    seen.add(img.entityId);
    out.push(img);
  }
  return out;
}

export function galleryCategories(): GalleryCategory[] {
  const heroes = heroImages();
  return CATEGORY_DEFS.map((c) => ({
    slug: c.slug,
    title: c.title,
    tagline: c.tagline,
    images: heroes.filter((h) => c.types.includes((h.entityId ?? "").split(":")[0])).map(toGalleryImage),
  })).filter((c) => c.images.length > 0);
}

export function getGalleryCategory(slug: string): GalleryCategory | undefined {
  return galleryCategories().find((c) => c.slug === slug);
}

/** Total distinct objects with imagery in the gallery. */
export function galleryObjectCount(): number {
  return heroImages().filter((h) => TYPE_TO_CATEGORY.has((h.entityId ?? "").split(":")[0])).length;
}
