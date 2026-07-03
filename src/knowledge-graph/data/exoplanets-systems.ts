import type { GraphEntity, GraphRelation } from "@/knowledge-graph/schema";
import { rel } from "@/knowledge-graph/schema";

export const entities: GraphEntity[] = [
  /* ----------------------------------------------------- constellations */
  {
    id: "constellation:aquarius", entryPath: "/constellations/aquarius",
    type: "constellation",
    name: "Aquarius",
    domain: "science",
    description:
      "A large equatorial constellation, one of the 88 modern constellations, lying along the zodiac.",
    sources: ["iau"],
  },
  {
    id: "constellation:pegasus", entryPath: "/constellations/pegasus",
    type: "constellation",
    name: "Pegasus",
    domain: "science",
    description:
      "A northern constellation, one of the 88 modern constellations, recognizable by the Great Square asterism.",
    sources: ["iau"],
  },
  {
    id: "constellation:cancer", entryPath: "/constellations/cancer",
    type: "constellation",
    name: "Cancer",
    domain: "science",
    description:
      "A faint northern zodiacal constellation, one of the 88 modern constellations.",
    sources: ["iau"],
  },
  {
    id: "constellation:libra", entryPath: "/constellations/libra",
    type: "constellation",
    name: "Libra",
    domain: "science",
    description:
      "A southern zodiacal constellation, one of the 88 modern constellations.",
    sources: ["iau"],
  },
  {
    id: "constellation:cetus-constellation", entryPath: "/constellations/cetus-constellation",
    type: "constellation",
    name: "Cetus",
    domain: "science",
    description:
      "A large constellation in the southern sky, one of the 88 modern constellations, often called the Whale or Sea Monster.",
    sources: ["iau"],
  },

  /* ------------------------------------------------------------- stars */
  {
    id: "star:trappist-1",
    type: "star",
    name: "TRAPPIST-1",
    domain: "science",
    description:
      "An ultra-cool red dwarf star about 40 light-years away that hosts seven known terrestrial planets.",
    sources: ["nasa", "esa"],
  },
  {
    id: "star:kepler-22",
    type: "star",
    name: "Kepler-22",
    domain: "science",
    description:
      "A Sun-like star in Cygnus hosting Kepler-22b, the first habitable-zone planet found by the Kepler mission.",
    sources: ["nasa"],
  },
  {
    id: "star:kepler-186",
    type: "star",
    name: "Kepler-186",
    domain: "science",
    description:
      "A red dwarf star in Cygnus hosting Kepler-186f, the first Earth-size planet found in a habitable zone.",
    sources: ["nasa"],
  },
  {
    id: "star:hd-209458",
    type: "star",
    name: "HD 209458",
    domain: "science",
    description:
      "A Sun-like star in Pegasus whose planet HD 209458 b was the first exoplanet observed transiting its star.",
    sources: ["nasa", "esa"],
  },
  {
    id: "star:gliese-581",
    type: "star",
    name: "Gliese 581",
    domain: "science",
    description:
      "A red dwarf star in Libra hosting a system of confirmed super-Earth and Neptune-mass planets.",
    sources: ["nasa", "esa"],
  },
  {
    id: "star:tabby-s-star",
    type: "star",
    name: "Tabby's Star (KIC 8462852)",
    domain: "science",
    description:
      "An F-type main-sequence star in Cygnus noted for unusual, irregular dimming events detected by Kepler.",
    sources: ["nasa"],
  },

  /* --------------------------------------------------------- exoplanets */
  {
    id: "exoplanet:proxima-centauri-b",
    type: "exoplanet",
    name: "Proxima Centauri b",
    domain: "science",
    description:
      "A roughly Earth-mass planet in the habitable zone of Proxima Centauri, the nearest known exoplanet to the Solar System.",
    sources: ["esa", "nasa"],
  },
  {
    id: "exoplanet:trappist-1-b",
    type: "exoplanet",
    name: "TRAPPIST-1 b",
    domain: "science",
    description:
      "The innermost of the seven known terrestrial planets orbiting TRAPPIST-1.",
    sources: ["nasa", "esa"],
  },
  {
    id: "exoplanet:trappist-1-c",
    type: "exoplanet",
    name: "TRAPPIST-1 c",
    domain: "science",
    description:
      "The second terrestrial planet from the ultra-cool dwarf star TRAPPIST-1.",
    sources: ["nasa", "esa"],
  },
  {
    id: "exoplanet:trappist-1-d",
    type: "exoplanet",
    name: "TRAPPIST-1 d",
    domain: "science",
    description:
      "The third terrestrial planet in the TRAPPIST-1 system.",
    sources: ["nasa", "esa"],
  },
  {
    id: "exoplanet:trappist-1-e",
    type: "exoplanet",
    name: "TRAPPIST-1 e",
    domain: "science",
    description:
      "A habitable-zone terrestrial planet in the TRAPPIST-1 system, comparable in size to Earth.",
    sources: ["nasa", "esa"],
  },
  {
    id: "exoplanet:trappist-1-f",
    type: "exoplanet",
    name: "TRAPPIST-1 f",
    domain: "science",
    description:
      "A habitable-zone terrestrial planet orbiting TRAPPIST-1.",
    sources: ["nasa", "esa"],
  },
  {
    id: "exoplanet:trappist-1-g",
    type: "exoplanet",
    name: "TRAPPIST-1 g",
    domain: "science",
    description:
      "The sixth of the seven known terrestrial planets orbiting TRAPPIST-1.",
    sources: ["nasa", "esa"],
  },
  {
    id: "exoplanet:trappist-1-h",
    type: "exoplanet",
    name: "TRAPPIST-1 h",
    domain: "science",
    description:
      "The outermost of the seven known terrestrial planets orbiting TRAPPIST-1.",
    sources: ["nasa", "esa"],
  },
  {
    id: "exoplanet:51-pegasi-b",
    type: "exoplanet",
    name: "51 Pegasi b",
    domain: "science",
    description:
      "A hot Jupiter and the first exoplanet discovered orbiting a Sun-like star, announced in 1995.",
    sources: ["nasa", "esa"],
  },
  {
    id: "exoplanet:kepler-22b",
    type: "exoplanet",
    name: "Kepler-22b",
    domain: "science",
    description:
      "A super-Earth-to-Neptune-size planet in the habitable zone of the Sun-like star Kepler-22.",
    sources: ["nasa"],
  },
  {
    id: "exoplanet:kepler-186f",
    type: "exoplanet",
    name: "Kepler-186f",
    domain: "science",
    description:
      "The first validated Earth-size planet found orbiting in the habitable zone of another star.",
    sources: ["nasa"],
  },
  {
    id: "exoplanet:hd-209458-b",
    type: "exoplanet",
    name: "HD 209458 b",
    domain: "science",
    description:
      "A hot Jupiter and the first exoplanet observed transiting its host star and to have its atmosphere detected.",
    sources: ["nasa", "esa"],
  },
  {
    id: "exoplanet:55-cancri-e",
    type: "exoplanet",
    name: "55 Cancri e",
    domain: "science",
    description:
      "A super-Earth orbiting very close to 55 Cancri, with a likely scorching, possibly molten surface.",
    sources: ["nasa", "esa"],
  },
  {
    id: "exoplanet:gliese-581c",
    type: "exoplanet",
    name: "Gliese 581 c",
    domain: "science",
    description:
      "A confirmed super-Earth orbiting the red dwarf Gliese 581, one of the earliest low-mass planets found near a habitable zone.",
    sources: ["esa", "nasa"],
  },
];

export const relations: GraphRelation[] = [
  /* host stars → constellations */
  rel("star:trappist-1", "belongs_to", "constellation:aquarius", "confirmed", "science"),
  rel("star:kepler-22", "belongs_to", "constellation:cygnus", "confirmed", "science"),
  rel("star:kepler-186", "belongs_to", "constellation:cygnus", "confirmed", "science"),
  rel("star:hd-209458", "belongs_to", "constellation:pegasus", "confirmed", "science"),
  rel("star:gliese-581", "belongs_to", "constellation:libra", "confirmed", "science"),
  rel("star:tabby-s-star", "belongs_to", "constellation:cygnus", "confirmed", "science"),

  /* exoplanets → host stars */
  rel("exoplanet:proxima-centauri-b", "child_of", "star:proxima-centauri", "confirmed", "science", {
    note: "Nearest known exoplanet to the Solar System.",
  }),
  rel("exoplanet:trappist-1-b", "child_of", "star:trappist-1", "confirmed", "science"),
  rel("exoplanet:trappist-1-c", "child_of", "star:trappist-1", "confirmed", "science"),
  rel("exoplanet:trappist-1-d", "child_of", "star:trappist-1", "confirmed", "science"),
  rel("exoplanet:trappist-1-e", "child_of", "star:trappist-1", "confirmed", "science"),
  rel("exoplanet:trappist-1-f", "child_of", "star:trappist-1", "confirmed", "science"),
  rel("exoplanet:trappist-1-g", "child_of", "star:trappist-1", "confirmed", "science"),
  rel("exoplanet:trappist-1-h", "child_of", "star:trappist-1", "confirmed", "science"),
  rel("exoplanet:51-pegasi-b", "child_of", "star:helvetios", "confirmed", "science", {
    note: "First exoplanet found around a Sun-like star.",
  }),
  rel("exoplanet:kepler-22b", "child_of", "star:kepler-22", "confirmed", "science"),
  rel("exoplanet:kepler-186f", "child_of", "star:kepler-186", "confirmed", "science"),
  rel("exoplanet:hd-209458-b", "child_of", "star:hd-209458", "confirmed", "science"),
  rel("exoplanet:55-cancri-e", "child_of", "star:copernicus", "confirmed", "science"),
  rel("exoplanet:gliese-581c", "child_of", "star:gliese-581", "confirmed", "science"),
];
