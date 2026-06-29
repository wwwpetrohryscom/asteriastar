import type { GraphEntity, GraphRelation } from "@/knowledge-graph/schema";
import { rel } from "@/knowledge-graph/schema";

export const entities: GraphEntity[] = [
  // ---------------------------------------------------------------- galaxies
  {
    id: "galaxy:milky-way",
    type: "galaxy",
    name: "The Milky Way",
    domain: "science",
    description:
      "The barred spiral galaxy that contains the Solar System, the Sun, and all stars visible to the naked eye.",
    sources: ["nasa", "esa", "iau"],
  },
  {
    id: "galaxy:andromeda-galaxy",
    type: "galaxy",
    name: "Andromeda Galaxy",
    domain: "science",
    description:
      "The nearest large spiral galaxy to the Milky Way and the most distant object readily visible to the naked eye.",
    aliases: ["M31", "Messier 31", "NGC 224"],
    sources: ["nasa", "esa", "iau"],
  },
  {
    id: "galaxy:triangulum-galaxy",
    type: "galaxy",
    name: "Triangulum Galaxy",
    domain: "science",
    description:
      "A spiral galaxy in the Local Group, the third-largest member after Andromeda and the Milky Way.",
    aliases: ["M33", "Messier 33", "NGC 598"],
    sources: ["nasa", "esa"],
  },
  {
    id: "galaxy:whirlpool-galaxy",
    type: "galaxy",
    name: "Whirlpool Galaxy",
    domain: "science",
    description:
      "A grand-design spiral galaxy interacting with a smaller companion galaxy, NGC 5195.",
    aliases: ["M51", "Messier 51", "NGC 5194"],
    sources: ["nasa", "esa"],
  },
  {
    id: "galaxy:sombrero-galaxy",
    type: "galaxy",
    name: "Sombrero Galaxy",
    domain: "science",
    description:
      "A galaxy notable for its bright nucleus and a prominent dust lane that gives it a hat-like appearance.",
    aliases: ["M104", "Messier 104", "NGC 4594"],
    sources: ["nasa", "esa"],
  },
  {
    id: "galaxy:large-magellanic-cloud",
    type: "galaxy",
    name: "Large Magellanic Cloud",
    domain: "science",
    description:
      "A satellite dwarf galaxy of the Milky Way and one of the closest galaxies to our own.",
    aliases: ["LMC"],
    sources: ["nasa", "esa"],
  },
  {
    id: "galaxy:small-magellanic-cloud",
    type: "galaxy",
    name: "Small Magellanic Cloud",
    domain: "science",
    description:
      "A dwarf galaxy near the Milky Way, visible to the naked eye from the Southern Hemisphere.",
    aliases: ["SMC"],
    sources: ["nasa", "esa"],
  },

  // ----------------------------------------------------------------- nebulae
  {
    id: "nebula:orion-nebula",
    type: "nebula",
    name: "Orion Nebula",
    domain: "science",
    description:
      "A diffuse emission nebula and active star-forming region, one of the brightest nebulae visible to the naked eye.",
    aliases: ["M42", "Messier 42", "NGC 1976"],
    sources: ["nasa", "esa"],
  },
  {
    id: "nebula:crab-nebula",
    type: "nebula",
    name: "Crab Nebula",
    domain: "science",
    description:
      "A supernova remnant produced by a stellar explosion recorded by astronomers in 1054 CE.",
    aliases: ["M1", "Messier 1", "NGC 1952"],
    sources: ["nasa", "esa"],
  },
  {
    id: "nebula:eagle-nebula",
    type: "nebula",
    name: "Eagle Nebula",
    domain: "science",
    description:
      "A young open cluster embedded in a star-forming nebula, famous for the 'Pillars of Creation' imaged by Hubble.",
    aliases: ["M16", "Messier 16", "NGC 6611"],
    sources: ["nasa", "esa"],
  },
  {
    id: "nebula:ring-nebula",
    type: "nebula",
    name: "Ring Nebula",
    domain: "science",
    description:
      "A planetary nebula formed by gas shed by a dying star, appearing as a luminous ring.",
    aliases: ["M57", "Messier 57", "NGC 6720"],
    sources: ["nasa", "esa"],
  },
  {
    id: "nebula:lagoon-nebula",
    type: "nebula",
    name: "Lagoon Nebula",
    domain: "science",
    description:
      "A large emission nebula and star-forming region, one of only a few visible to the naked eye.",
    aliases: ["M8", "Messier 8", "NGC 6523"],
    sources: ["nasa", "esa"],
  },

  // ------------------------------------------------------------- black holes
  {
    id: "black_hole:sagittarius-a-star",
    type: "black_hole",
    name: "Sagittarius A*",
    domain: "science",
    description:
      "The supermassive black hole at the center of the Milky Way, imaged by the Event Horizon Telescope in 2022.",
    aliases: ["Sgr A*"],
    sources: ["nasa", "esa"],
  },
  {
    id: "black_hole:m87-star",
    type: "black_hole",
    name: "M87*",
    domain: "science",
    description:
      "The supermassive black hole at the heart of galaxy M87, the first black hole ever directly imaged, in 2019.",
    aliases: ["Pōwehi"],
    sources: ["nasa", "esa"],
  },

  // ----------------------------------------------------------- star clusters
  {
    id: "star_cluster:pleiades",
    type: "star_cluster",
    name: "The Pleiades",
    domain: "science",
    description:
      "A bright open star cluster of hot young stars, easily visible to the naked eye.",
    aliases: ["M45", "Messier 45", "Seven Sisters"],
    sources: ["nasa", "esa"],
  },
  {
    id: "star_cluster:hyades",
    type: "star_cluster",
    name: "The Hyades",
    domain: "science",
    description:
      "The nearest open star cluster to the Solar System, forming a V-shaped grouping of stars.",
    sources: ["nasa", "esa"],
  },
  {
    id: "star_cluster:omega-centauri",
    type: "star_cluster",
    name: "Omega Centauri",
    domain: "science",
    description:
      "The brightest and most massive globular cluster orbiting the Milky Way.",
    aliases: ["NGC 5139"],
    sources: ["nasa", "esa"],
  },
];

export const relations: GraphRelation[] = [
  rel(
    "galaxy:andromeda-galaxy",
    "located_in",
    "constellation:andromeda",
    "confirmed",
    "science",
  ),
  rel(
    "nebula:orion-nebula",
    "located_in",
    "constellation:orion",
    "confirmed",
    "science",
  ),
  rel(
    "nebula:ring-nebula",
    "located_in",
    "constellation:lyra",
    "confirmed",
    "science",
  ),
  rel(
    "black_hole:sagittarius-a-star",
    "located_in",
    "galaxy:milky-way",
    "confirmed",
    "science",
    { note: "Supermassive black hole at the galactic center." },
  ),
  rel("star_cluster:pleiades", "part_of", "galaxy:milky-way", "confirmed", "science", {
    note: "An open cluster within the Milky Way.",
  }),
  rel("star_cluster:hyades", "part_of", "galaxy:milky-way", "confirmed", "science", {
    note: "An open cluster within the Milky Way.",
  }),
  rel("location:solar-system", "part_of", "galaxy:milky-way", "confirmed", "science"),
];
