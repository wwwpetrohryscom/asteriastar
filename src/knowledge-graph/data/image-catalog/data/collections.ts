import type { CollectionDef } from "@/knowledge-graph/data/image-catalog/types";

/** Curated image collections. A collection is populated only if it has ≥1 catalogued image. */
export const COLLECTIONS: CollectionDef[] = [
  { slug: "jwst-first-images", name: "JWST First Images", description: "The first full-colour science images from the James Webb Space Telescope, released in July 2022." },
  { slug: "deep-fields", name: "Deep Fields", description: "Long exposures that reveal thousands of distant galaxies in a tiny patch of sky." },
  { slug: "black-holes", name: "Black Holes", description: "Direct horizon-scale images of supermassive black holes." },
  { slug: "nebulae", name: "Nebulae", description: "Clouds of gas and dust where stars are born and where they end their lives." },
  { slug: "galaxies", name: "Galaxies", description: "Island universes of stars, from the Milky Way to the deep field." },
  { slug: "solar-system", name: "Solar System", description: "Worlds of our own Sun — planets, moons, and the Sun itself." },
  { slug: "mars", name: "Mars", description: "The Red Planet, seen from orbit and from its surface." },
  { slug: "jupiter", name: "Jupiter", description: "The largest planet and its dynamic atmosphere." },
  { slug: "saturn", name: "Saturn", description: "The ringed planet and its moons." },
  { slug: "the-sun", name: "The Sun", description: "Our star across the electromagnetic spectrum." },
  { slug: "earth-from-space", name: "Earth from Space", description: "Our home world seen from the Moon, from orbit, and from billions of kilometres away." },
  { slug: "apollo", name: "Apollo", description: "Images from the Apollo missions to the Moon." },
  { slug: "voyager", name: "Voyager", description: "Images from the twin Voyager probes on their grand tour and beyond." },
  { slug: "cassini", name: "Cassini", description: "Images from the Cassini mission to Saturn." },
];
