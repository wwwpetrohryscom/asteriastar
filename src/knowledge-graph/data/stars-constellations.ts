import type { GraphEntity, GraphRelation } from "@/knowledge-graph/schema";
import { rel } from "@/knowledge-graph/schema";

export const entities: GraphEntity[] = [
  // ---------------------------------------------------------------- stars
  // Bright stars with existing content pages.
  {
    id: "star:antares",
    type: "star",
    name: "Antares",
    domain: "science",
    description:
      "Antares is a red supergiant and the brightest star in the constellation Scorpius.",
    entryPath: "/astronomy/stars/antares",
    sources: ["iau", "nasa"],
  },
  {
    id: "star:deneb",
    type: "star",
    name: "Deneb",
    domain: "science",
    description:
      "Deneb is a luminous blue-white supergiant and the brightest star in the constellation Cygnus.",
    entryPath: "/astronomy/stars/deneb",
    sources: ["iau", "nasa"],
  },
  {
    id: "star:altair",
    type: "star",
    name: "Altair",
    domain: "science",
    description:
      "Altair is the brightest star in the constellation Aquila and one of the nearest naked-eye stars.",
    entryPath: "/astronomy/stars/altair",
    sources: ["iau", "nasa"],
  },
  {
    id: "star:aldebaran",
    type: "star",
    name: "Aldebaran",
    domain: "science",
    description:
      "Aldebaran is an orange giant and the brightest star in the constellation Taurus.",
    entryPath: "/astronomy/stars/aldebaran",
    sources: ["iau", "nasa"],
  },
  {
    id: "star:spica",
    type: "star",
    name: "Spica",
    domain: "science",
    description:
      "Spica is the brightest star in the constellation Virgo and is itself a close binary system.",
    entryPath: "/astronomy/stars/spica",
    sources: ["iau", "nasa"],
  },
  // Additional bright stars (no content pages yet).
  {
    id: "star:arcturus",
    type: "star",
    name: "Arcturus",
    domain: "science",
    description:
      "Arcturus is an orange giant and the brightest star in the constellation Boötes.",
    sources: ["iau", "nasa"],
  },
  {
    id: "star:capella",
    type: "star",
    name: "Capella",
    domain: "science",
    description:
      "Capella is the brightest star in the constellation Auriga and is a system of multiple stars.",
    sources: ["iau", "nasa"],
  },
  {
    id: "star:procyon",
    type: "star",
    name: "Procyon",
    domain: "science",
    description:
      "Procyon is the brightest star in the constellation Canis Minor and one of the nearest stars to the Sun.",
    sources: ["iau", "nasa"],
  },
  {
    id: "star:pollux",
    type: "star",
    name: "Pollux",
    domain: "science",
    description:
      "Pollux is an orange giant and the brightest star in the constellation Gemini.",
    sources: ["iau", "nasa"],
  },
  {
    id: "star:castor",
    type: "star",
    name: "Castor",
    domain: "science",
    description:
      "Castor is a multiple-star system in the constellation Gemini, traditionally paired with Pollux.",
    sources: ["iau", "nasa"],
  },
  {
    id: "star:regulus",
    type: "star",
    name: "Regulus",
    domain: "science",
    description:
      "Regulus is the brightest star in the constellation Leo and lies close to the ecliptic.",
    sources: ["iau", "nasa"],
  },
  {
    id: "star:fomalhaut",
    type: "star",
    name: "Fomalhaut",
    domain: "science",
    description:
      "Fomalhaut is the brightest star in the constellation Piscis Austrinus and hosts a prominent debris disk.",
    sources: ["iau", "nasa"],
  },

  // -------------------------------------------------------- constellations
  {
    id: "constellation:scorpius", entryPath: "/constellations/scorpius",
    type: "constellation",
    name: "Scorpius",
    domain: "science",
    description:
      "Scorpius is a zodiacal constellation of the southern sky, recognized as one of the 88 modern constellations.",
    sources: ["iau"],
  },
  {
    id: "constellation:cygnus", entryPath: "/constellations/cygnus",
    type: "constellation",
    name: "Cygnus",
    domain: "science",
    description:
      "Cygnus is a northern constellation lying along the plane of the Milky Way, one of the 88 modern constellations.",
    sources: ["iau"],
  },
  {
    id: "constellation:aquila", entryPath: "/constellations/aquila",
    type: "constellation",
    name: "Aquila",
    domain: "science",
    description:
      "Aquila is a constellation on the celestial equator, one of the 88 modern constellations.",
    sources: ["iau"],
  },
  {
    id: "constellation:taurus", entryPath: "/constellations/taurus",
    type: "constellation",
    name: "Taurus",
    domain: "science",
    description:
      "Taurus is a large zodiacal constellation of the northern sky, one of the 88 modern constellations.",
    sources: ["iau"],
  },
  {
    id: "constellation:virgo", entryPath: "/constellations/virgo",
    type: "constellation",
    name: "Virgo",
    domain: "science",
    description:
      "Virgo is the second-largest constellation and a zodiacal constellation, one of the 88 modern constellations.",
    sources: ["iau"],
  },
  {
    id: "constellation:bootes", entryPath: "/constellations/bootes",
    type: "constellation",
    name: "Boötes",
    domain: "science",
    description:
      "Boötes is a northern constellation, one of the 88 modern constellations.",
    sources: ["iau"],
  },
  {
    id: "constellation:auriga", entryPath: "/constellations/auriga",
    type: "constellation",
    name: "Auriga",
    domain: "science",
    description:
      "Auriga is a northern constellation, one of the 88 modern constellations.",
    sources: ["iau"],
  },
  {
    id: "constellation:canis-minor", entryPath: "/constellations/canis-minor",
    type: "constellation",
    name: "Canis Minor",
    domain: "science",
    description:
      "Canis Minor is a small constellation, one of the 88 modern constellations.",
    sources: ["iau"],
  },
  {
    id: "constellation:gemini", entryPath: "/constellations/gemini",
    type: "constellation",
    name: "Gemini",
    domain: "science",
    description:
      "Gemini is a zodiacal constellation of the northern sky, one of the 88 modern constellations.",
    sources: ["iau"],
  },
  {
    id: "constellation:leo", entryPath: "/constellations/leo",
    type: "constellation",
    name: "Leo",
    domain: "science",
    description:
      "Leo is a zodiacal constellation of the northern sky, one of the 88 modern constellations.",
    sources: ["iau"],
  },
  {
    id: "constellation:piscis-austrinus", entryPath: "/constellations/piscis-austrinus",
    type: "constellation",
    name: "Piscis Austrinus",
    domain: "science",
    description:
      "Piscis Austrinus is a southern constellation, one of the 88 modern constellations.",
    sources: ["iau"],
  },
];

export const relations: GraphRelation[] = [
  rel("star:antares", "belongs_to", "constellation:scorpius", "confirmed", "science"),
  rel("star:deneb", "belongs_to", "constellation:cygnus", "confirmed", "science"),
  rel("star:altair", "belongs_to", "constellation:aquila", "confirmed", "science"),
  rel("star:aldebaran", "belongs_to", "constellation:taurus", "confirmed", "science"),
  rel("star:spica", "belongs_to", "constellation:virgo", "confirmed", "science"),
  rel("star:arcturus", "belongs_to", "constellation:bootes", "confirmed", "science"),
  rel("star:capella", "belongs_to", "constellation:auriga", "confirmed", "science"),
  rel("star:procyon", "belongs_to", "constellation:canis-minor", "confirmed", "science"),
  rel("star:pollux", "belongs_to", "constellation:gemini", "confirmed", "science"),
  rel("star:castor", "belongs_to", "constellation:gemini", "confirmed", "science"),
  rel("star:regulus", "belongs_to", "constellation:leo", "confirmed", "science"),
  rel("star:fomalhaut", "belongs_to", "constellation:piscis-austrinus", "confirmed", "science"),
];
