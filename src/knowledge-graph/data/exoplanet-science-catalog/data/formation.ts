import { cc, type CcRecord } from "@/knowledge-graph/data/exoplanet-science-catalog/types";

/** Planet-formation concepts (exoplanet_science_concept), reusing the protoplanetary disk & formation chemistry. */
export const formation: CcRecord[] = [
  cc("formation", {
    slug: "core-accretion",
    name: "Core Accretion",
    description:
      "The leading model of planet formation: dust in a protoplanetary disk sticks into ever-larger bodies until a solid core grows massive enough — roughly ten Earth masses — to pull in a thick envelope of gas, becoming a giant planet. It naturally explains rocky planets, ice giants, and gas giants as a sequence, though building cores fast enough before the gas disperses is a live problem.",
    relatedKeys: ["interstellar_environment:protoplanetary-disk", "astrochemical_process:planet-formation-chemistry", "planetary_class:gas-giant"],
    highlights: ["Grow a solid core, then capture gas — the standard model"],
  }),
  cc("formation", {
    slug: "disk-instability",
    name: "Disk Instability",
    description:
      "An alternative route to giant planets in which a massive, cool region of a protoplanetary disk becomes gravitationally unstable and fragments directly into a bound clump of gas, skipping the slow core-building step. It may account for massive planets on wide orbits that are hard to make by core accretion within the disk's lifetime.",
    relatedKeys: ["interstellar_environment:protoplanetary-disk", "exoplanet_science_concept:core-accretion"],
    highlights: ["A disk fragments straight into a giant planet"],
  }),
  cc("formation", {
    slug: "planetary-migration",
    name: "Planetary Migration",
    description:
      "Planets do not necessarily stay where they form: gravitational interaction with the gas disk, or later with other bodies, can move them inward or outward over time. Migration is the standard explanation for hot Jupiters — giant planets on scorching close-in orbits where they could not have formed — and shapes the architecture of whole systems.",
    relatedKeys: ["planetary_class:hot-jupiter", "interstellar_environment:protoplanetary-disk", "exoplanet_science_concept:core-accretion"],
    highlights: ["Planets drift through the disk — how hot Jupiters get close in"],
  }),
  cc("formation", {
    slug: "snow-line",
    name: "The Snow Line",
    altNames: ["Frost line"],
    description:
      "The distance from a young star beyond which it is cold enough for a volatile such as water to freeze into ice. Past the snow line the supply of solid material jumps, favouring the rapid growth of massive cores — one reason the Solar System's giant planets lie beyond it — and its location leaves an imprint on a planet's later atmospheric composition.",
    relatedKeys: ["interstellar_environment:protoplanetary-disk", "exoplanet_science_concept:core-accretion", "exoplanet_science_concept:atmospheric-metallicity"],
    highlights: ["Where ice can condense — a boundary that favours giant planets"],
  }),
  cc("formation", {
    slug: "pebble-accretion",
    name: "Pebble Accretion",
    description:
      "A mechanism that helps solve core accretion's timing problem: centimetre-sized 'pebbles' drifting inward through the disk are efficiently swept up by a growing embryo, letting cores reach giant-planet mass far faster than by collisions of larger bodies alone. It has become a central ingredient in modern planet-formation theory.",
    relatedKeys: ["exoplanet_science_concept:core-accretion", "interstellar_environment:protoplanetary-disk"],
    highlights: ["Sweeping up drifting pebbles to build cores quickly"],
  }),
];
