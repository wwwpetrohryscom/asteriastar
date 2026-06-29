import type { GraphEntity, GraphRelation } from "@/knowledge-graph/schema";
import { rel } from "@/knowledge-graph/schema";

export const entities: GraphEntity[] = [
  // ----------------------------------------------------------------- star
  {
    id: "star:sun",
    type: "star",
    name: "The Sun",
    domain: "science",
    description:
      "The Sun is the star at the center of the Solar System, around which the planets and other bodies orbit.",
    sources: ["nasa"],
  },

  // --------------------------------------------------------------- planets
  {
    id: "planet:mercury",
    type: "planet",
    name: "Mercury",
    domain: "science",
    description:
      "Mercury is the smallest planet in the Solar System and the closest to the Sun.",
    entryPath: "/astronomy/planets/mercury",
    sources: ["nasa", "jpl"],
  },
  {
    id: "planet:venus",
    type: "planet",
    name: "Venus",
    domain: "science",
    description:
      "Venus is the second planet from the Sun and is similar in size to Earth.",
    entryPath: "/astronomy/planets/venus",
    sources: ["nasa", "jpl"],
  },
  {
    id: "planet:earth",
    type: "planet",
    name: "Earth",
    domain: "science",
    description:
      "Earth is the third planet from the Sun and the only world known to support life.",
    entryPath: "/astronomy/planets/earth",
    sources: ["nasa", "jpl"],
  },
  {
    id: "planet:saturn",
    type: "planet",
    name: "Saturn",
    domain: "science",
    description:
      "Saturn is the sixth planet from the Sun and is known for its prominent ring system.",
    entryPath: "/astronomy/planets/saturn",
    sources: ["nasa", "jpl"],
  },
  {
    id: "planet:uranus",
    type: "planet",
    name: "Uranus",
    domain: "science",
    description:
      "Uranus is the seventh planet from the Sun and is classified as an ice giant.",
    entryPath: "/astronomy/planets/uranus",
    sources: ["nasa", "jpl"],
  },
  {
    id: "planet:neptune",
    type: "planet",
    name: "Neptune",
    domain: "science",
    description:
      "Neptune is the eighth and most distant known planet from the Sun in the Solar System.",
    entryPath: "/astronomy/planets/neptune",
    sources: ["nasa", "jpl"],
  },

  // --------------------------------------------------------- dwarf planets
  {
    id: "dwarf_planet:pluto",
    type: "dwarf_planet",
    name: "Pluto",
    domain: "science",
    description:
      "Pluto is a dwarf planet in the Kuiper Belt beyond the orbit of Neptune.",
    entryPath: "/astronomy/dwarf-planets/pluto",
    sources: ["nasa", "iau"],
  },
  {
    id: "dwarf_planet:ceres",
    type: "dwarf_planet",
    name: "Ceres",
    domain: "science",
    description:
      "Ceres is a dwarf planet and the largest object in the asteroid belt between Mars and Jupiter.",
    entryPath: "/astronomy/dwarf-planets/ceres",
    sources: ["nasa", "iau"],
  },
  {
    id: "dwarf_planet:eris",
    type: "dwarf_planet",
    name: "Eris",
    domain: "science",
    description:
      "Eris is a distant dwarf planet in the scattered disc of the outer Solar System.",
    entryPath: "/astronomy/dwarf-planets/eris",
    sources: ["nasa", "iau"],
  },
  {
    id: "dwarf_planet:haumea",
    type: "dwarf_planet",
    name: "Haumea",
    domain: "science",
    description:
      "Haumea is a dwarf planet located beyond the orbit of Neptune in the Kuiper Belt.",
    entryPath: "/astronomy/dwarf-planets/haumea",
    sources: ["nasa", "iau"],
  },
  {
    id: "dwarf_planet:makemake",
    type: "dwarf_planet",
    name: "Makemake",
    domain: "science",
    description:
      "Makemake is a dwarf planet in the Kuiper Belt beyond the orbit of Neptune.",
    entryPath: "/astronomy/dwarf-planets/makemake",
    sources: ["nasa", "iau"],
  },

  // ----------------------------------------------------------------- moons
  {
    id: "moon:the-moon",
    type: "moon",
    name: "The Moon",
    domain: "science",
    description: "The Moon is Earth's only natural satellite.",
    sources: ["nasa"],
  },
  {
    id: "moon:phobos",
    type: "moon",
    name: "Phobos",
    domain: "science",
    description:
      "Phobos is the larger and inner of the two natural satellites of Mars.",
    sources: ["nasa", "jpl"],
  },
  {
    id: "moon:deimos",
    type: "moon",
    name: "Deimos",
    domain: "science",
    description:
      "Deimos is the smaller and outer of the two natural satellites of Mars.",
    sources: ["nasa", "jpl"],
  },
  {
    id: "moon:io",
    type: "moon",
    name: "Io",
    domain: "science",
    description:
      "Io is the innermost of the four Galilean moons of Jupiter and is intensely volcanic.",
    sources: ["nasa", "jpl"],
  },
  {
    id: "moon:europa",
    type: "moon",
    name: "Europa",
    domain: "science",
    description:
      "Europa is one of the four Galilean moons of Jupiter, covered by a shell of water ice.",
    sources: ["nasa", "jpl"],
  },
  {
    id: "moon:ganymede",
    type: "moon",
    name: "Ganymede",
    domain: "science",
    description:
      "Ganymede is a Galilean moon of Jupiter and the largest moon in the Solar System.",
    sources: ["nasa", "jpl"],
  },
  {
    id: "moon:callisto",
    type: "moon",
    name: "Callisto",
    domain: "science",
    description:
      "Callisto is the outermost of the four Galilean moons of Jupiter and is heavily cratered.",
    sources: ["nasa", "jpl"],
  },
  {
    id: "moon:titan",
    type: "moon",
    name: "Titan",
    domain: "science",
    description:
      "Titan is the largest moon of Saturn and has a dense, nitrogen-rich atmosphere.",
    sources: ["nasa", "jpl"],
  },
  {
    id: "moon:enceladus",
    type: "moon",
    name: "Enceladus",
    domain: "science",
    description:
      "Enceladus is an icy moon of Saturn that vents plumes of water ice from its south pole.",
    sources: ["nasa", "jpl"],
  },
  {
    id: "moon:triton",
    type: "moon",
    name: "Triton",
    domain: "science",
    description:
      "Triton is the largest moon of Neptune and orbits in a retrograde direction.",
    sources: ["nasa", "jpl"],
  },
];

export const relations: GraphRelation[] = [
  // The Sun and the planets are part of the Solar System.
  rel("star:sun", "part_of", "location:solar-system", "confirmed", "science"),
  rel("planet:mercury", "part_of", "location:solar-system", "confirmed", "science"),
  rel("planet:venus", "part_of", "location:solar-system", "confirmed", "science"),
  rel("planet:earth", "part_of", "location:solar-system", "confirmed", "science"),
  rel("planet:saturn", "part_of", "location:solar-system", "confirmed", "science"),
  rel("planet:uranus", "part_of", "location:solar-system", "confirmed", "science"),
  rel("planet:neptune", "part_of", "location:solar-system", "confirmed", "science"),

  // Dwarf planets are part of the Solar System.
  rel("dwarf_planet:pluto", "part_of", "location:solar-system", "confirmed", "science"),
  rel("dwarf_planet:ceres", "part_of", "location:solar-system", "confirmed", "science"),
  rel("dwarf_planet:eris", "part_of", "location:solar-system", "confirmed", "science"),
  rel("dwarf_planet:haumea", "part_of", "location:solar-system", "confirmed", "science"),
  rel("dwarf_planet:makemake", "part_of", "location:solar-system", "confirmed", "science"),

  // Moons orbit their parent planets.
  rel("moon:the-moon", "child_of", "planet:earth", "confirmed", "science"),
  rel("moon:phobos", "child_of", "planet:mars", "confirmed", "science"),
  rel("moon:deimos", "child_of", "planet:mars", "confirmed", "science"),
  rel("moon:io", "child_of", "planet:jupiter", "confirmed", "science", {
    note: "One of the four Galilean moons.",
  }),
  rel("moon:europa", "child_of", "planet:jupiter", "confirmed", "science", {
    note: "One of the four Galilean moons.",
  }),
  rel("moon:ganymede", "child_of", "planet:jupiter", "confirmed", "science", {
    note: "One of the four Galilean moons.",
  }),
  rel("moon:callisto", "child_of", "planet:jupiter", "confirmed", "science", {
    note: "One of the four Galilean moons.",
  }),
  rel("moon:titan", "child_of", "planet:saturn", "confirmed", "science"),
  rel("moon:enceladus", "child_of", "planet:saturn", "confirmed", "science"),
  rel("moon:triton", "child_of", "planet:neptune", "confirmed", "science"),
];
