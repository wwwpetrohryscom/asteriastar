import type { GraphEntity, GraphRelation } from "@/knowledge-graph/schema";
import { rel } from "@/knowledge-graph/schema";

/**
 * Additional well-known bright/named stars and the constellations that house
 * them. Star -> constellation memberships are standard IAU constellation
 * boundaries; each new constellation referenced here is defined once so its
 * `belongs_to` relations resolve.
 */

export const entities: GraphEntity[] = [
  // ------------------------------------------------------ new constellations
  {
    id: "constellation:carina", entryPath: "/constellations/carina",
    type: "constellation",
    name: "Carina",
    domain: "science",
    description:
      "Carina is a southern constellation representing the keel of the ship Argo, home to the bright star Canopus.",
    sources: ["iau"],
  },
  {
    id: "constellation:eridanus", entryPath: "/constellations/eridanus",
    type: "constellation",
    name: "Eridanus",
    domain: "science",
    description:
      "Eridanus is a long southern constellation representing a celestial river, terminating at the bright star Achernar.",
    sources: ["iau"],
  },
  {
    id: "constellation:centaurus", entryPath: "/constellations/centaurus",
    type: "constellation",
    name: "Centaurus",
    domain: "science",
    description:
      "Centaurus is a bright southern constellation depicting a centaur and containing several of the sky's most luminous stars.",
    sources: ["iau"],
  },
  {
    id: "constellation:crux", entryPath: "/constellations/crux",
    type: "constellation",
    name: "Crux",
    domain: "science",
    description:
      "Crux, the Southern Cross, is the smallest of the 88 modern constellations and a prominent southern-sky asterism.",
    sources: ["iau"],
  },
  {
    id: "constellation:ursa-major", entryPath: "/constellations/ursa-major",
    type: "constellation",
    name: "Ursa Major",
    domain: "science",
    description:
      "Ursa Major, the Great Bear, is a large northern constellation containing the seven stars of the Big Dipper asterism.",
    sources: ["iau"],
  },
  {
    id: "constellation:ophiuchus", entryPath: "/constellations/ophiuchus",
    type: "constellation",
    name: "Ophiuchus",
    domain: "science",
    description:
      "Ophiuchus is a large equatorial constellation depicting a man holding a serpent, straddling the celestial equator.",
    sources: ["iau"],
  },
  {
    id: "constellation:capricornus", entryPath: "/constellations/capricornus",
    type: "constellation",
    name: "Capricornus",
    domain: "science",
    description:
      "Capricornus is a faint zodiacal constellation traditionally represented as a sea goat.",
    sources: ["iau"],
  },
  {
    id: "constellation:aries", entryPath: "/constellations/aries",
    type: "constellation",
    name: "Aries",
    domain: "science",
    description:
      "Aries is a mid-sized zodiacal constellation representing the ram, with Hamal as its brightest star.",
    sources: ["iau"],
  },

  // --------------------------------------------------------------- new stars
  {
    id: "star:canopus",
    type: "star",
    name: "Canopus",
    domain: "science",
    description:
      "Canopus is a white supergiant and the second-brightest star in the night sky, the luminary of the constellation Carina.",
    sources: ["iau", "nasa"],
  },
  {
    id: "star:achernar",
    type: "star",
    name: "Achernar",
    domain: "science",
    description:
      "Achernar is a hot blue main-sequence star and the brightest star in the constellation Eridanus.",
    sources: ["iau", "nasa"],
  },
  {
    id: "star:hadar",
    type: "star",
    name: "Hadar",
    domain: "science",
    description:
      "Hadar (Beta Centauri) is a blue giant multiple star system and the second-brightest star in the constellation Centaurus.",
    sources: ["iau", "nasa"],
  },
  {
    id: "star:acrux",
    type: "star",
    name: "Acrux",
    domain: "science",
    description:
      "Acrux (Alpha Crucis) is the brightest star in the constellation Crux and the southernmost first-magnitude star.",
    sources: ["iau", "nasa"],
  },
  {
    id: "star:gacrux",
    type: "star",
    name: "Gacrux",
    domain: "science",
    description:
      "Gacrux (Gamma Crucis) is a red giant marking the top of the Southern Cross in the constellation Crux.",
    sources: ["iau", "nasa"],
  },
  {
    id: "star:bellatrix",
    type: "star",
    name: "Bellatrix",
    domain: "science",
    description:
      "Bellatrix is a blue giant marking the left shoulder of the hunter in the constellation Orion.",
    sources: ["iau", "nasa"],
  },
  {
    id: "star:mintaka",
    type: "star",
    name: "Mintaka",
    domain: "science",
    description:
      "Mintaka is a multiple star system forming the westernmost star of Orion's Belt in the constellation Orion.",
    sources: ["iau", "nasa"],
  },
  {
    id: "star:alnilam",
    type: "star",
    name: "Alnilam",
    domain: "science",
    description:
      "Alnilam is a blue supergiant forming the central star of Orion's Belt in the constellation Orion.",
    sources: ["iau", "nasa"],
  },
  {
    id: "star:alnitak",
    type: "star",
    name: "Alnitak",
    domain: "science",
    description:
      "Alnitak is a hot blue triple star system forming the easternmost star of Orion's Belt in the constellation Orion.",
    sources: ["iau", "nasa"],
  },
  {
    id: "star:saiph",
    type: "star",
    name: "Saiph",
    domain: "science",
    description:
      "Saiph is a blue supergiant marking the lower-right knee of the hunter in the constellation Orion.",
    sources: ["iau", "nasa"],
  },
  {
    id: "star:dubhe",
    type: "star",
    name: "Dubhe",
    domain: "science",
    description:
      "Dubhe is an orange giant and one of the two 'pointer' stars of the Big Dipper in the constellation Ursa Major.",
    sources: ["iau", "nasa"],
  },
  {
    id: "star:merak",
    type: "star",
    name: "Merak",
    domain: "science",
    description:
      "Merak is a white main-sequence star and a 'pointer' of the Big Dipper in the constellation Ursa Major.",
    sources: ["iau", "nasa"],
  },
  {
    id: "star:alkaid",
    type: "star",
    name: "Alkaid",
    domain: "science",
    description:
      "Alkaid is a hot blue star marking the end of the Big Dipper's handle in the constellation Ursa Major.",
    sources: ["iau", "nasa"],
  },
  {
    id: "star:mizar",
    type: "star",
    name: "Mizar",
    domain: "science",
    description:
      "Mizar is a well-known multiple star system in the handle of the Big Dipper in the constellation Ursa Major.",
    sources: ["iau", "nasa"],
  },
  {
    id: "star:alioth",
    type: "star",
    name: "Alioth",
    domain: "science",
    description:
      "Alioth is the brightest star in the constellation Ursa Major and sits in the handle of the Big Dipper.",
    sources: ["iau", "nasa"],
  },
  {
    id: "star:denebola",
    type: "star",
    name: "Denebola",
    domain: "science",
    description:
      "Denebola is a white main-sequence star marking the tail of the lion in the constellation Leo.",
    sources: ["iau", "nasa"],
  },
  {
    id: "star:algol",
    type: "star",
    name: "Algol",
    domain: "science",
    description:
      "Algol is a famous eclipsing binary, the prototype 'Demon Star', in the constellation Perseus.",
    sources: ["iau", "nasa"],
  },
  {
    id: "star:mirfak",
    type: "star",
    name: "Mirfak",
    domain: "science",
    description:
      "Mirfak is a yellow-white supergiant and the brightest star in the constellation Perseus.",
    sources: ["iau", "nasa"],
  },
  {
    id: "star:rasalhague",
    type: "star",
    name: "Rasalhague",
    domain: "science",
    description:
      "Rasalhague is a white binary star and the brightest star in the constellation Ophiuchus.",
    sources: ["iau", "nasa"],
  },
  {
    id: "star:vindemiatrix",
    type: "star",
    name: "Vindemiatrix",
    domain: "science",
    description:
      "Vindemiatrix is a yellow giant and one of the brighter stars in the constellation Virgo.",
    sources: ["iau", "nasa"],
  },
  {
    id: "star:sadr",
    type: "star",
    name: "Sadr",
    domain: "science",
    description:
      "Sadr is a yellow-white supergiant marking the heart of the swan in the constellation Cygnus.",
    sources: ["iau", "nasa"],
  },
  {
    id: "star:albireo",
    type: "star",
    name: "Albireo",
    domain: "science",
    description:
      "Albireo is a celebrated colorful double star marking the head of the swan in the constellation Cygnus.",
    sources: ["iau", "nasa"],
  },
  {
    id: "star:deneb-algedi",
    type: "star",
    name: "Deneb Algedi",
    domain: "science",
    description:
      "Deneb Algedi (Delta Capricorni) is an eclipsing binary and the brightest star in the constellation Capricornus.",
    sources: ["iau", "nasa"],
  },
  {
    id: "star:hamal",
    type: "star",
    name: "Hamal",
    domain: "science",
    description:
      "Hamal is an orange giant and the brightest star in the constellation Aries.",
    sources: ["iau", "nasa"],
  },
  {
    id: "star:alpheratz",
    type: "star",
    name: "Alpheratz",
    domain: "science",
    description:
      "Alpheratz is a blue-white star marking the head of the chained princess in the constellation Andromeda.",
    sources: ["iau", "nasa"],
  },
  {
    id: "star:mirach",
    type: "star",
    name: "Mirach",
    domain: "science",
    description:
      "Mirach is a red giant in the constellation Andromeda, often used as a guide to nearby galaxies.",
    sources: ["iau", "nasa"],
  },
  {
    id: "star:schedar",
    type: "star",
    name: "Schedar",
    domain: "science",
    description:
      "Schedar is an orange giant and the brightest star in the constellation Cassiopeia.",
    sources: ["iau", "nasa"],
  },
  {
    id: "star:caph",
    type: "star",
    name: "Caph",
    domain: "science",
    description:
      "Caph is a yellow-white star forming one corner of the distinctive W-shape of the constellation Cassiopeia.",
    sources: ["iau", "nasa"],
  },
];

export const relations: GraphRelation[] = [
  rel("star:canopus", "belongs_to", "constellation:carina", "confirmed", "science"),
  rel("star:achernar", "belongs_to", "constellation:eridanus", "confirmed", "science"),
  rel("star:hadar", "belongs_to", "constellation:centaurus", "confirmed", "science"),
  rel("star:acrux", "belongs_to", "constellation:crux", "confirmed", "science"),
  rel("star:gacrux", "belongs_to", "constellation:crux", "confirmed", "science"),
  rel("star:bellatrix", "belongs_to", "constellation:orion", "confirmed", "science"),
  rel("star:mintaka", "belongs_to", "constellation:orion", "confirmed", "science"),
  rel("star:alnilam", "belongs_to", "constellation:orion", "confirmed", "science"),
  rel("star:alnitak", "belongs_to", "constellation:orion", "confirmed", "science"),
  rel("star:saiph", "belongs_to", "constellation:orion", "confirmed", "science"),
  rel("star:dubhe", "belongs_to", "constellation:ursa-major", "confirmed", "science"),
  rel("star:merak", "belongs_to", "constellation:ursa-major", "confirmed", "science"),
  rel("star:alkaid", "belongs_to", "constellation:ursa-major", "confirmed", "science"),
  rel("star:mizar", "belongs_to", "constellation:ursa-major", "confirmed", "science"),
  rel("star:alioth", "belongs_to", "constellation:ursa-major", "confirmed", "science"),
  rel("star:denebola", "belongs_to", "constellation:leo", "confirmed", "science"),
  rel("star:algol", "belongs_to", "constellation:perseus", "confirmed", "science"),
  rel("star:mirfak", "belongs_to", "constellation:perseus", "confirmed", "science"),
  rel("star:rasalhague", "belongs_to", "constellation:ophiuchus", "confirmed", "science"),
  rel("star:vindemiatrix", "belongs_to", "constellation:virgo", "confirmed", "science"),
  rel("star:sadr", "belongs_to", "constellation:cygnus", "confirmed", "science"),
  rel("star:albireo", "belongs_to", "constellation:cygnus", "confirmed", "science"),
  rel("star:deneb-algedi", "belongs_to", "constellation:capricornus", "confirmed", "science"),
  rel("star:hamal", "belongs_to", "constellation:aries", "confirmed", "science"),
  rel("star:alpheratz", "belongs_to", "constellation:andromeda", "confirmed", "science"),
  rel("star:mirach", "belongs_to", "constellation:andromeda", "confirmed", "science"),
  rel("star:schedar", "belongs_to", "constellation:cassiopeia", "confirmed", "science"),
  rel("star:caph", "belongs_to", "constellation:cassiopeia", "confirmed", "science"),
];
