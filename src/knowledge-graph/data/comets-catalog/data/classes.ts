import type { CometRecord } from "@/knowledge-graph/data/comets-catalog/types";
import type { SourceKey } from "@/lib/sources";

/**
 * Comet dynamical classes — the orbital categories comets fall into, defined by
 * period, inclination, and the Tisserand parameter with respect to Jupiter. Each
 * class has at least one modelled member linking to it via member_of_group.
 */
type K = { slug: string; name: string; definition: string; sources?: SourceKey[]; alt?: string[]; description: string };
const mk = (k: K): CometRecord => ({
  id: `comet_class:${k.slug}`,
  slug: k.slug,
  name: k.name,
  kind: "class",
  altNames: k.alt,
  description: k.description,
  sources: k.sources ?? ["nasa", "jpl"],
  definition: k.definition,
});

export const classes: CometRecord[] = [
  mk({ slug: "jupiter-family", name: "Jupiter-Family Comets", definition: "Short-period comets (periods under ~20 years) on low-inclination orbits controlled by Jupiter, with a Tisserand parameter between 2 and 3.", alt: ["JFC"], description: "The most numerous class of periodic comets, whose orbits are shepherded by Jupiter and which originate in the scattered disc beyond Neptune." }),
  mk({ slug: "halley-type", name: "Halley-Type Comets", definition: "Periodic comets with intermediate periods of roughly 20–200 years, often on highly inclined or retrograde orbits.", alt: ["HTC"], description: "Periodic comets with orbits of decades to a couple of centuries, named for their prototype, Halley's Comet." }),
  mk({ slug: "long-period", name: "Long-Period Comets", definition: "Comets with orbital periods longer than ~200 years, arriving on nearly parabolic orbits from all directions.", alt: ["LPC"], description: "Comets on enormous orbits reaching deep into the outer Solar System, arriving from the Oort cloud after millions of years — the source of most great comets." }),
  mk({ slug: "sungrazing", name: "Sungrazing Comets", definition: "Comets that pass extremely close to the Sun at perihelion, often within a few solar radii.", description: "Comets whose orbits carry them through the Sun's outer atmosphere; most disintegrate, though a few survive. Many belong to the Kreutz family and are discovered by solar observatories." }),
  mk({ slug: "main-belt-comet", name: "Main-Belt Comets", definition: "Bodies with asteroid-like orbits inside the main asteroid belt that display recurring, comet-like activity.", alt: ["MBC"], description: "Objects that orbit within the asteroid belt yet develop tails or comae — a blurring of the traditional line between asteroids and comets, and a possible reservoir of water." }),
];
