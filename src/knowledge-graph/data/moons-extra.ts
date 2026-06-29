import type { GraphEntity, GraphRelation } from "@/knowledge-graph/schema";
import { rel } from "@/knowledge-graph/schema";

export const entities: GraphEntity[] = [
  // ------------------------------------------------------------ Saturn moons
  {
    id: "moon:rhea",
    type: "moon",
    name: "Rhea",
    domain: "science",
    description:
      "Rhea is the second-largest moon of Saturn and an icy, heavily cratered world.",
    sources: ["nasa", "jpl"],
  },
  {
    id: "moon:iapetus",
    type: "moon",
    name: "Iapetus",
    domain: "science",
    description:
      "Iapetus is a moon of Saturn known for its striking two-toned surface, with one dark and one bright hemisphere.",
    sources: ["nasa", "jpl"],
  },
  {
    id: "moon:dione",
    type: "moon",
    name: "Dione",
    domain: "science",
    description:
      "Dione is an icy moon of Saturn marked by bright wispy fractures across its surface.",
    sources: ["nasa", "jpl"],
  },
  {
    id: "moon:tethys",
    type: "moon",
    name: "Tethys",
    domain: "science",
    description:
      "Tethys is an icy moon of Saturn featuring the enormous Ithaca Chasma canyon and the large Odysseus crater.",
    sources: ["nasa", "jpl"],
  },
  {
    id: "moon:mimas",
    type: "moon",
    name: "Mimas",
    domain: "science",
    description:
      "Mimas is an inner moon of Saturn dominated by the huge impact crater Herschel.",
    sources: ["nasa", "jpl"],
  },

  // ------------------------------------------------------------ Uranus moons
  {
    id: "moon:titania",
    type: "moon",
    name: "Titania",
    domain: "science",
    description: "Titania is the largest moon of Uranus.",
    sources: ["nasa", "jpl"],
  },
  {
    id: "moon:oberon",
    type: "moon",
    name: "Oberon",
    domain: "science",
    description:
      "Oberon is the outermost of the large moons of Uranus and is heavily cratered.",
    sources: ["nasa", "jpl"],
  },
  {
    id: "moon:miranda",
    type: "moon",
    name: "Miranda",
    domain: "science",
    description:
      "Miranda is the smallest of the five major moons of Uranus and has an unusually jumbled, varied surface.",
    sources: ["nasa", "jpl"],
  },
  {
    id: "moon:ariel",
    type: "moon",
    name: "Ariel",
    domain: "science",
    description:
      "Ariel is a moon of Uranus and the brightest of its major satellites.",
    sources: ["nasa", "jpl"],
  },
  {
    id: "moon:umbriel",
    type: "moon",
    name: "Umbriel",
    domain: "science",
    description:
      "Umbriel is a moon of Uranus and the darkest of its major satellites.",
    sources: ["nasa", "jpl"],
  },

  // ----------------------------------------------------------- Neptune moons
  {
    id: "moon:nereid",
    type: "moon",
    name: "Nereid",
    domain: "science",
    description:
      "Nereid is a moon of Neptune with one of the most eccentric orbits of any known moon in the Solar System.",
    sources: ["nasa", "jpl"],
  },
  {
    id: "moon:proteus",
    type: "moon",
    name: "Proteus",
    domain: "science",
    description:
      "Proteus is one of the larger inner moons of Neptune and one of the darkest objects in the Solar System.",
    sources: ["nasa", "jpl"],
  },

  // ----------------------------------------------------------- Jupiter moons
  {
    id: "moon:amalthea",
    type: "moon",
    name: "Amalthea",
    domain: "science",
    description:
      "Amalthea is a small, reddish inner moon of Jupiter orbiting closer to the planet than the Galilean moons.",
    sources: ["nasa", "jpl"],
  },

  // ------------------------------------------------------------- Pluto moons
  {
    id: "moon:charon",
    type: "moon",
    name: "Charon",
    domain: "science",
    description:
      "Charon is the largest moon of the dwarf planet Pluto, roughly half Pluto's diameter.",
    sources: ["nasa", "jpl"],
  },
];

export const relations: GraphRelation[] = [
  rel("moon:rhea", "child_of", "planet:saturn", "confirmed", "science"),
  rel("moon:iapetus", "child_of", "planet:saturn", "confirmed", "science"),
  rel("moon:dione", "child_of", "planet:saturn", "confirmed", "science"),
  rel("moon:tethys", "child_of", "planet:saturn", "confirmed", "science"),
  rel("moon:mimas", "child_of", "planet:saturn", "confirmed", "science"),

  rel("moon:titania", "child_of", "planet:uranus", "confirmed", "science"),
  rel("moon:oberon", "child_of", "planet:uranus", "confirmed", "science"),
  rel("moon:miranda", "child_of", "planet:uranus", "confirmed", "science"),
  rel("moon:ariel", "child_of", "planet:uranus", "confirmed", "science"),
  rel("moon:umbriel", "child_of", "planet:uranus", "confirmed", "science"),

  rel("moon:nereid", "child_of", "planet:neptune", "confirmed", "science"),
  rel("moon:proteus", "child_of", "planet:neptune", "confirmed", "science"),

  rel("moon:amalthea", "child_of", "planet:jupiter", "confirmed", "science"),

  rel("moon:charon", "child_of", "dwarf_planet:pluto", "confirmed", "science"),
];
