import type { GraphEntity, GraphRelation } from "@/knowledge-graph/schema";
import { rel } from "@/knowledge-graph/schema";

export const entities: GraphEntity[] = [
  // ----------------------------------------------------------------- catalog
  {
    id: "catalog:ngc",
    type: "catalog",
    name: "New General Catalogue (NGC)",
    domain: "science",
    description: "A catalogue of nearly 8,000 deep-sky objects.",
    sources: ["iau"],
  },

  // ----------------------------------------------------- NGC nebulae & galaxies
  {
    id: "nebula:ngc-7000",
    type: "nebula",
    name: "North America Nebula (NGC 7000)",
    domain: "science",
    description:
      "A large emission nebula in Cygnus whose shape resembles the continent of North America.",
    sources: ["nasa", "esa"],
  },
  {
    id: "nebula:ngc-2024",
    type: "nebula",
    name: "Flame Nebula (NGC 2024)",
    domain: "science",
    description:
      "An emission nebula and star-forming region in Orion, near the star Alnitak.",
    sources: ["nasa", "esa"],
  },
  {
    id: "nebula:ngc-6960",
    type: "nebula",
    name: "Western Veil Nebula (NGC 6960)",
    domain: "science",
    description:
      "Part of the Veil Nebula, a supernova remnant in Cygnus also known as the Witch's Broom Nebula.",
    sources: ["nasa", "esa"],
  },
  {
    id: "nebula:ngc-6302",
    type: "nebula",
    name: "Butterfly Nebula (NGC 6302)",
    domain: "science",
    description:
      "A bipolar planetary nebula in Scorpius with one of the hottest known central stars.",
    sources: ["nasa", "esa"],
  },
  {
    id: "nebula:ngc-6543",
    type: "nebula",
    name: "Cat's Eye Nebula (NGC 6543)",
    domain: "science",
    description:
      "A complex planetary nebula in the constellation Draco, one of the first to be studied with a spectroscope.",
    sources: ["nasa", "esa"],
  },
  {
    id: "nebula:ngc-2237",
    type: "nebula",
    name: "Rosette Nebula (NGC 2237)",
    domain: "science",
    description:
      "A large emission nebula in the constellation Monoceros surrounding a young open star cluster.",
    sources: ["nasa", "esa"],
  },
  {
    id: "galaxy:ngc-4486",
    type: "galaxy",
    name: "Messier 87 (NGC 4486)",
    domain: "science",
    description:
      "A giant elliptical galaxy in Virgo whose supermassive black hole was the first to be directly imaged.",
    sources: ["nasa", "esa"],
  },
  {
    id: "galaxy:ngc-253",
    type: "galaxy",
    name: "Sculptor Galaxy (NGC 253)",
    domain: "science",
    description:
      "A bright barred spiral starburst galaxy in the constellation Sculptor.",
    sources: ["nasa", "esa"],
  },
  {
    id: "galaxy:ngc-4565",
    type: "galaxy",
    name: "Needle Galaxy (NGC 4565)",
    domain: "science",
    description:
      "An edge-on spiral galaxy in Coma Berenices noted for its slender, needle-like profile.",
    sources: ["nasa", "esa"],
  },
  {
    id: "galaxy:ngc-5128",
    type: "galaxy",
    name: "Centaurus A (NGC 5128)",
    domain: "science",
    description:
      "A prominent radio galaxy in Centaurus, one of the closest active galaxies to Earth.",
    sources: ["nasa", "esa"],
  },
  {
    id: "galaxy:ngc-1300",
    type: "galaxy",
    name: "NGC 1300",
    domain: "science",
    description:
      "A barred spiral galaxy in the constellation Eridanus with a striking central bar structure.",
    sources: ["nasa", "esa"],
  },
  {
    id: "galaxy:ngc-1365",
    type: "galaxy",
    name: "NGC 1365",
    domain: "science",
    description:
      "A double-barred spiral galaxy in the Fornax Cluster, in the constellation Fornax.",
    sources: ["nasa", "esa"],
  },

  // ------------------------------------------------------------ meteor showers
  {
    id: "meteor_shower:taurids",
    type: "meteor_shower",
    name: "Taurids",
    domain: "science",
    description:
      "An extended autumn meteor shower with a radiant in the constellation Taurus, associated with Comet Encke.",
    sources: ["nasa"],
  },
];

export const relations: GraphRelation[] = [
  // Every NGC object is part of the NGC catalogue.
  rel("nebula:ngc-7000", "part_of", "catalog:ngc", "confirmed", "science"),
  rel("nebula:ngc-2024", "part_of", "catalog:ngc", "confirmed", "science"),
  rel("nebula:ngc-6960", "part_of", "catalog:ngc", "confirmed", "science"),
  rel("nebula:ngc-6302", "part_of", "catalog:ngc", "confirmed", "science"),
  rel("nebula:ngc-6543", "part_of", "catalog:ngc", "confirmed", "science"),
  rel("nebula:ngc-2237", "part_of", "catalog:ngc", "confirmed", "science"),
  rel("galaxy:ngc-4486", "part_of", "catalog:ngc", "confirmed", "science"),
  rel("galaxy:ngc-253", "part_of", "catalog:ngc", "confirmed", "science"),
  rel("galaxy:ngc-4565", "part_of", "catalog:ngc", "confirmed", "science"),
  rel("galaxy:ngc-5128", "part_of", "catalog:ngc", "confirmed", "science"),
  rel("galaxy:ngc-1300", "part_of", "catalog:ngc", "confirmed", "science"),
  rel("galaxy:ngc-1365", "part_of", "catalog:ngc", "confirmed", "science"),

  // located_in only for objects whose host constellation is in the allowed list.
  rel("nebula:ngc-7000", "located_in", "constellation:cygnus", "confirmed", "science"),
  rel("nebula:ngc-2024", "located_in", "constellation:orion", "confirmed", "science"),
  rel("nebula:ngc-6960", "located_in", "constellation:cygnus", "confirmed", "science"),
  rel("nebula:ngc-6302", "located_in", "constellation:scorpius", "confirmed", "science"),
  rel("galaxy:ngc-4486", "located_in", "constellation:virgo", "confirmed", "science"),

  // Meteor shower radiant association.
  rel("meteor_shower:taurids", "associated_with", "constellation:taurus", "confirmed", "science", {
    note: "The shower's radiant lies in the constellation Taurus.",
  }),
];
