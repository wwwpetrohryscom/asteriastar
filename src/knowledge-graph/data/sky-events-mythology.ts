import type { GraphEntity, GraphRelation } from "@/knowledge-graph/schema";
import { rel } from "@/knowledge-graph/schema";

export const entities: GraphEntity[] = [
  // ------------------------------------------------------------ meteor showers
  {
    id: "meteor_shower:perseids",
    type: "meteor_shower",
    name: "Perseids",
    domain: "science",
    description:
      "A prominent summer meteor shower whose radiant lies in the constellation Perseus, produced by debris from comet Swift–Tuttle.",
    sources: ["nasa", "imo"],
  },
  {
    id: "meteor_shower:geminids",
    type: "meteor_shower",
    name: "Geminids",
    domain: "science",
    description:
      "A reliable December meteor shower whose radiant lies in the constellation Gemini.",
    sources: ["nasa", "imo"],
  },
  {
    id: "meteor_shower:leonids",
    type: "meteor_shower",
    name: "Leonids",
    domain: "science",
    description:
      "A November meteor shower whose radiant lies in the constellation Leo, associated with comet Tempel–Tuttle.",
    sources: ["nasa", "imo"],
  },
  {
    id: "meteor_shower:orionids",
    type: "meteor_shower",
    name: "Orionids",
    domain: "science",
    description:
      "An October meteor shower whose radiant lies in the constellation Orion, produced by debris from Halley's Comet.",
    sources: ["nasa", "imo"],
  },
  {
    id: "meteor_shower:quadrantids",
    type: "meteor_shower",
    name: "Quadrantids",
    domain: "science",
    description:
      "An early-January meteor shower known for a short, sharp peak of activity.",
    sources: ["nasa", "imo"],
  },

  // -------------------------------------------------------------------- comets
  {
    id: "comet:halleys-comet",
    type: "comet",
    name: "Halley's Comet",
    domain: "science",
    description:
      "A short-period comet (1P/Halley) that returns to the inner Solar System roughly every 76 years.",
    aliases: ["1P/Halley"],
    sources: ["nasa", "britannica"],
  },
  {
    id: "comet:comet-neowise",
    type: "comet",
    name: "Comet NEOWISE",
    domain: "science",
    description:
      "A long-period comet discovered in 2020 that became a bright naked-eye object in the Northern Hemisphere sky.",
    sources: ["nasa"],
  },
  {
    id: "comet:swift-tuttle",
    type: "comet",
    name: "Comet Swift–Tuttle",
    domain: "science",
    description:
      "A periodic comet (109P/Swift–Tuttle) that is the parent body of the Perseid meteor shower.",
    aliases: ["109P/Swift–Tuttle"],
    sources: ["nasa", "britannica"],
  },

  // --------------------------------------------------------- mythology figures
  {
    id: "mythology_figure:artemis",
    type: "mythology_figure",
    name: "Artemis",
    domain: "culture",
    description:
      "In Greek mythology, the goddess of the hunt and the Moon, daughter of Zeus and Leto and twin sister of Apollo.",
    sources: ["britannica"],
  },
  {
    id: "mythology_figure:zeus",
    type: "mythology_figure",
    name: "Zeus",
    domain: "culture",
    description:
      "In Greek mythology, the king of the gods who ruled from Mount Olympus.",
    sources: ["britannica"],
  },
  {
    id: "mythology_figure:leto",
    type: "mythology_figure",
    name: "Leto",
    domain: "culture",
    description:
      "In Greek mythology, a Titaness who, by Zeus, became the mother of the twins Apollo and Artemis.",
    sources: ["britannica"],
  },
  {
    id: "mythology_figure:apollo",
    type: "mythology_figure",
    name: "Apollo",
    domain: "culture",
    description:
      "In Greek mythology, the god of light, music, and prophecy, son of Zeus and Leto and twin brother of Artemis.",
    sources: ["britannica"],
  },
  {
    id: "mythology_figure:medusa",
    type: "mythology_figure",
    name: "Medusa",
    domain: "culture",
    description:
      "In Greek mythology, a Gorgon whose gaze turned onlookers to stone and who was slain by the hero Perseus.",
    sources: ["britannica"],
  },
  {
    id: "mythology_figure:atlas",
    type: "mythology_figure",
    name: "Atlas",
    domain: "culture",
    description:
      "In Greek mythology, a Titan condemned to hold up the sky and the father of the Pleiades.",
    sources: ["britannica"],
  },
  {
    id: "mythology_figure:cetus",
    type: "mythology_figure",
    name: "Cetus",
    domain: "culture",
    description:
      "In Greek mythology, the sea monster sent to devour Andromeda before she was rescued by Perseus.",
    sources: ["britannica"],
  },
  {
    id: "mythology_figure:cepheus",
    type: "mythology_figure",
    name: "Cepheus",
    domain: "culture",
    description:
      "In Greek mythology, the king of Aethiopia, husband of Cassiopeia and father of Andromeda.",
    sources: ["britannica"],
  },
  {
    id: "mythology_figure:pleiades",
    type: "mythology_figure",
    name: "The Pleiades (Seven Sisters)",
    domain: "culture",
    description:
      "In Greek mythology, the seven daughters of the Titan Atlas, placed among the stars as the Pleiades cluster.",
    entryPath: "/encyclopedia/greek-mythology/pleiades",
    sources: ["britannica"],
  },
];

export const relations: GraphRelation[] = [
  // ----------------------------------------------------- science (associated_with)
  rel(
    "meteor_shower:perseids",
    "associated_with",
    "comet:swift-tuttle",
    "confirmed",
    "science",
    { note: "Parent comet of the Perseids." },
  ),
  rel(
    "meteor_shower:orionids",
    "associated_with",
    "comet:halleys-comet",
    "confirmed",
    "science",
    { note: "Debris from Halley's Comet." },
  ),
  rel(
    "meteor_shower:perseids",
    "associated_with",
    "constellation:perseus",
    "confirmed",
    "science",
    { note: "Radiant lies in Perseus." },
  ),
  rel(
    "meteor_shower:orionids",
    "associated_with",
    "constellation:orion",
    "confirmed",
    "science",
    { note: "Radiant lies in Orion." },
  ),

  // -------------------------------------------- culture (mythologically_linked_to)
  rel(
    "mythology_figure:perseus",
    "mythologically_linked_to",
    "mythology_figure:medusa",
    "confirmed",
    "culture",
    { note: "Perseus slew the Gorgon Medusa." },
  ),
  rel(
    "mythology_figure:perseus",
    "mythologically_linked_to",
    "mythology_figure:andromeda",
    "confirmed",
    "culture",
    { note: "Perseus rescued Andromeda." },
  ),
  rel(
    "mythology_figure:cassiopeia",
    "mythologically_linked_to",
    "mythology_figure:cepheus",
    "confirmed",
    "culture",
    { note: "Queen and king of Aethiopia." },
  ),
  rel(
    "mythology_figure:andromeda",
    "mythologically_linked_to",
    "mythology_figure:cetus",
    "confirmed",
    "culture",
    { note: "Andromeda was threatened by the sea monster Cetus." },
  ),
  rel(
    "mythology_figure:artemis",
    "mythologically_linked_to",
    "mythology_figure:apollo",
    "confirmed",
    "culture",
    { note: "Twin siblings, children of Zeus and Leto." },
  ),
  rel(
    "mythology_figure:leto",
    "mythologically_linked_to",
    "mythology_figure:artemis",
    "confirmed",
    "culture",
    { note: "Leto is the mother of Artemis." },
  ),
  rel(
    "mythology_figure:leto",
    "mythologically_linked_to",
    "mythology_figure:apollo",
    "confirmed",
    "culture",
    { note: "Leto is the mother of Apollo." },
  ),
  rel(
    "mythology_figure:pleiades",
    "mythologically_linked_to",
    "mythology_figure:atlas",
    "confirmed",
    "culture",
    { note: "The Pleiades were the daughters of Atlas." },
  ),
];
