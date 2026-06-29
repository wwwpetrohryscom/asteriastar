import type { GraphEntity, GraphRelation } from "@/knowledge-graph/schema";
import { rel } from "@/knowledge-graph/schema";

export const entities: GraphEntity[] = [
  // ----------------------------------------------------- space agencies / organizations
  {
    id: "organization:jaxa",
    type: "organization",
    name: "JAXA (Japan Aerospace Exploration Agency)",
    domain: "science",
    description:
      "JAXA is Japan's national space agency, responsible for the country's aerospace research, satellite operations, and human spaceflight contributions including the Kibo module on the International Space Station.",
    sources: ["nasa"],
  },
  {
    id: "organization:cnsa",
    type: "organization",
    name: "CNSA (China National Space Administration)",
    domain: "science",
    description:
      "CNSA is the national space agency of the People's Republic of China, overseeing the country's civil space program including launch vehicles, lunar exploration, and crewed spaceflight.",
    sources: ["nasa"],
  },
  {
    id: "organization:arianespace",
    type: "organization",
    name: "Arianespace",
    domain: "science",
    description:
      "Arianespace is a European launch service provider that markets and operates launches of the Ariane family of rockets from the Guiana Space Centre.",
    sources: ["esa"],
  },
  {
    id: "organization:ula",
    type: "organization",
    name: "United Launch Alliance",
    domain: "science",
    description:
      "United Launch Alliance is an American launch service provider, a joint venture of Boeing and Lockheed Martin, that operates the Atlas and Delta families of rockets.",
    sources: ["nasa"],
  },

  // ----------------------------------------------------- launch vehicles
  {
    id: "launch_vehicle:saturn-v",
    type: "launch_vehicle",
    name: "Saturn V",
    domain: "science",
    description:
      "The Saturn V was a NASA super heavy-lift launch vehicle that carried the Apollo missions to the Moon and launched the Skylab space station.",
    sources: ["nasa"],
  },
  {
    id: "launch_vehicle:falcon-9",
    type: "launch_vehicle",
    name: "Falcon 9",
    domain: "science",
    description:
      "Falcon 9 is a partially reusable two-stage orbital launch vehicle developed and operated by SpaceX.",
    sources: ["nasa"],
  },
  {
    id: "launch_vehicle:falcon-heavy",
    type: "launch_vehicle",
    name: "Falcon Heavy",
    domain: "science",
    description:
      "Falcon Heavy is a partially reusable heavy-lift launch vehicle derived from the Falcon 9 and operated by SpaceX.",
    sources: ["nasa"],
  },
  {
    id: "launch_vehicle:starship",
    type: "launch_vehicle",
    name: "Starship",
    domain: "science",
    description:
      "Starship is a fully reusable super heavy-lift launch system being developed by SpaceX for crewed and cargo missions to Earth orbit, the Moon, and Mars.",
    sources: ["nasa"],
  },
  {
    id: "launch_vehicle:ariane-5",
    type: "launch_vehicle",
    name: "Ariane 5",
    domain: "science",
    description:
      "Ariane 5 was a European heavy-lift launch vehicle operated by Arianespace, notable for launching the James Webb Space Telescope in 2021.",
    sources: ["esa"],
  },
  {
    id: "launch_vehicle:atlas-v",
    type: "launch_vehicle",
    name: "Atlas V",
    domain: "science",
    description:
      "Atlas V is an expendable launch vehicle operated by United Launch Alliance that has launched numerous NASA science and planetary missions.",
    sources: ["nasa"],
  },
  {
    id: "launch_vehicle:space-launch-system",
    type: "launch_vehicle",
    name: "Space Launch System (SLS)",
    domain: "science",
    description:
      "The Space Launch System is NASA's super heavy-lift launch vehicle developed to carry the Orion spacecraft and crew under the Artemis program.",
    sources: ["nasa"],
  },
  {
    id: "launch_vehicle:soyuz",
    type: "launch_vehicle",
    name: "Soyuz",
    domain: "science",
    description:
      "Soyuz is a family of expendable launch vehicles operated by Roscosmos that has long carried crews and cargo to orbit, including to the International Space Station.",
    sources: ["nasa"],
  },
  {
    id: "launch_vehicle:long-march-5",
    type: "launch_vehicle",
    name: "Long March 5",
    domain: "science",
    description:
      "Long March 5 is a Chinese heavy-lift launch vehicle that has launched missions including the Tianwen-1 Mars probe and modules of the Tiangong space station.",
    sources: ["nasa"],
  },
  {
    id: "launch_vehicle:pslv",
    type: "launch_vehicle",
    name: "PSLV (Polar Satellite Launch Vehicle)",
    domain: "science",
    description:
      "The PSLV is an expendable launch vehicle operated by ISRO that has launched many Earth observation satellites as well as the Chandrayaan-1 and Mangalyaan missions.",
    sources: ["nasa"],
  },

  // ----------------------------------------------------- satellites / stations
  {
    id: "satellite:international-space-station",
    type: "satellite",
    name: "International Space Station",
    domain: "science",
    description:
      "The International Space Station is a crewed modular space station in low Earth orbit, operated as a partnership among NASA, Roscosmos, ESA, JAXA, and the CSA.",
    sources: ["nasa", "esa"],
  },
];

export const relations: GraphRelation[] = [
  // launch vehicles operated by their agencies / providers
  rel("launch_vehicle:saturn-v", "operated_by", "organization:nasa", "confirmed", "science"),
  rel("launch_vehicle:falcon-9", "operated_by", "organization:spacex", "confirmed", "science"),
  rel("launch_vehicle:falcon-heavy", "operated_by", "organization:spacex", "confirmed", "science"),
  rel("launch_vehicle:starship", "operated_by", "organization:spacex", "confirmed", "science"),
  rel("launch_vehicle:ariane-5", "operated_by", "organization:arianespace", "confirmed", "science"),
  rel("launch_vehicle:atlas-v", "operated_by", "organization:ula", "confirmed", "science"),
  rel(
    "launch_vehicle:space-launch-system",
    "operated_by",
    "organization:nasa",
    "confirmed",
    "science",
  ),
  rel("launch_vehicle:soyuz", "operated_by", "organization:roscosmos", "confirmed", "science"),
  rel("launch_vehicle:long-march-5", "operated_by", "organization:cnsa", "confirmed", "science"),
  rel("launch_vehicle:pslv", "operated_by", "organization:isro", "confirmed", "science"),

  // International Space Station — five partner agencies
  rel(
    "satellite:international-space-station",
    "operated_by",
    "organization:nasa",
    "confirmed",
    "science",
    { note: "One of the five ISS partner agencies." },
  ),
  rel(
    "satellite:international-space-station",
    "operated_by",
    "organization:roscosmos",
    "confirmed",
    "science",
    { note: "One of the five ISS partner agencies." },
  ),
  rel(
    "satellite:international-space-station",
    "operated_by",
    "organization:esa",
    "confirmed",
    "science",
    { note: "One of the five ISS partner agencies." },
  ),
  rel(
    "satellite:international-space-station",
    "operated_by",
    "organization:jaxa",
    "confirmed",
    "science",
    { note: "One of the five ISS partner agencies." },
  ),
  rel(
    "satellite:international-space-station",
    "operated_by",
    "organization:csa",
    "confirmed",
    "science",
    { note: "One of the five ISS partner agencies." },
  ),
];
