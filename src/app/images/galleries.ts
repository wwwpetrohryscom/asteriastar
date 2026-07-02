import { engine } from "@/platform/data-engine";
import type { ImageRecord } from "@/platform/images";

/** Discovery galleries — filtered views over the image catalogue. */
export interface Gallery { slug: string; title: string; description: string; images: () => ImageRecord[] }

const im = engine.images;

export const GALLERIES: Gallery[] = [
  { slug: "latest", title: "Latest Scientific Images", description: "The most recently published images in the catalogue.", images: () => im.latest(40) },
  { slug: "jwst", title: "JWST Gallery", description: "Images from the James Webb Space Telescope.", images: () => im.search.byTelescope("space_telescope:james-webb-space-telescope") },
  { slug: "hubble", title: "Hubble Gallery", description: "Images from the Hubble Space Telescope.", images: () => im.search.byTelescope("space_telescope:hubble-space-telescope") },
  { slug: "planets", title: "Planet Gallery", description: "Images of the planets of the Solar System.", images: () => im.all().filter((i) => i.objectEntityId?.startsWith("planet:")) },
  { slug: "mars", title: "Mars Gallery", description: "The Red Planet from orbit and the surface.", images: () => im.search.byObject("planet:mars") },
  { slug: "solar", title: "Solar Gallery", description: "Images of the Sun.", images: () => im.search.byObject("star:sun") },
  { slug: "nebulae", title: "Nebula Gallery", description: "Clouds of gas and dust where stars are born and die.", images: () => im.collections.images("nebulae") },
  { slug: "galaxies", title: "Galaxy Gallery", description: "Galaxies near and far.", images: () => im.collections.images("galaxies") },
  { slug: "black-holes", title: "Black Hole Gallery", description: "Direct images of supermassive black holes.", images: () => im.collections.images("black-holes") },
  { slug: "earth-from-space", title: "Earth from Space", description: "Our home world seen from afar.", images: () => im.collections.images("earth-from-space") },
  { slug: "historic", title: "Historic Astronomy Images", description: "Landmark images from before the year 2000.", images: () => im.all().filter((i) => (i.publicationYear ?? 9999) < 2000) },
  { slug: "public-domain", title: "Public Domain Images", description: "Images free of copyright, in the public domain.", images: () => im.search.byLicense("public-domain") },
];

/** Only galleries that actually contain images. */
export const ACTIVE_GALLERIES = GALLERIES.filter((g) => g.images().length > 0);
const BY_SLUG = new Map(GALLERIES.map((g) => [g.slug, g]));
export function getGallery(slug: string): Gallery | undefined { return BY_SLUG.get(slug); }
