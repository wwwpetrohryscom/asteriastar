import { engine } from "@/platform/data-engine";
import { LICENSE_BY_SLUG } from "@/knowledge-graph/data/image-catalog";
import type { ImageRecord } from "@/knowledge-graph/data/image-catalog/types";

/**
 * Curated gallery themes — a redesigned, editorial front door onto the existing
 * provenance-backed image catalogue. Each theme is a predicate over the real
 * ImageRecord set (no fabricated imagery; the catalogue links to each image's
 * official archive rather than re-hosting binaries). The gallery reuses the
 * image detail pages under /images for full provenance.
 */
export interface GalleryTheme {
  slug: string;
  title: string;
  tagline: string;
  /** Which catalogue images belong to this theme. */
  match: (img: ImageRecord) => boolean;
  /** Optional deep link into the image archive's matching collection. */
  collection?: string;
}

const inCollections = (img: ImageRecord, slugs: string[]) =>
  (img.collections ?? []).some((c) => slugs.includes(c));

export const GALLERY_THEMES: GalleryTheme[] = [
  {
    slug: "jwst",
    title: "James Webb Space Telescope",
    tagline: "The infrared universe in unprecedented depth — Webb's first images and beyond.",
    collection: "jwst-first-images",
    match: (img) => img.telescopeId === "space_telescope:james-webb-space-telescope" || inCollections(img, ["jwst-first-images"]),
  },
  {
    slug: "hubble",
    title: "Hubble Space Telescope",
    tagline: "Three decades of the visible universe from low Earth orbit.",
    match: (img) =>
      img.telescopeId === "space_telescope:hubble-space-telescope" ||
      /hubble/i.test(img.credit) ||
      /hubble/i.test(img.institution ?? ""),
  },
  {
    slug: "solar-system",
    title: "Solar System",
    tagline: "Our own worlds — the Sun, the planets, their moons, and the probes that visited them.",
    collection: "solar-system",
    match: (img) => inCollections(img, ["solar-system", "mars", "jupiter", "saturn", "the-sun", "apollo", "voyager", "cassini", "earth-from-space"]),
  },
  {
    slug: "deep-sky",
    title: "Deep Sky",
    tagline: "Nebulae, galaxies, deep fields, and the horizon-scale shadows of black holes.",
    collection: "nebulae",
    match: (img) => inCollections(img, ["nebulae", "galaxies", "deep-fields", "black-holes"]),
  },
  {
    slug: "earth-from-space",
    title: "Earth from Space",
    tagline: "Our home world seen from the Moon, from orbit, and from billions of kilometres away.",
    collection: "earth-from-space",
    match: (img) => inCollections(img, ["earth-from-space"]),
  },
  {
    slug: "observatories",
    title: "Observatories & Instruments",
    tagline: "The telescopes and instruments that take these images — and the sky they map.",
    match: (img) => /observ|telescope|array/i.test(img.objectName) || (img.telescopeId != null && img.category === "institutional"),
  },
];

export function getGalleryTheme(slug: string): GalleryTheme | undefined {
  return GALLERY_THEMES.find((t) => t.slug === slug);
}

/** Images belonging to a theme, newest publication first. */
export function galleryImages(theme: GalleryTheme): ImageRecord[] {
  return engine.images
    .all()
    .filter(theme.match)
    .sort((a, b) => (b.publicationYear ?? 0) - (a.publicationYear ?? 0));
}

/** The canonical short licence label for a catalogue licence slug (single
 *  source of truth — matches the licence badge on the image detail pages). */
export function licenseLabel(slug: string): string {
  return LICENSE_BY_SLUG.get(slug)?.shortName ?? slug.replace(/-/g, " ");
}
