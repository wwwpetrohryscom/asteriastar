import type { GraphEntity, GraphRelation } from "@/knowledge-graph/schema";
import { rel } from "@/knowledge-graph/schema";

export const entities: GraphEntity[] = [
  {
    id: "catalog:messier",
    type: "catalog",
    name: "Messier Catalogue",
    domain: "science",
    description: "A catalogue of 110 deep-sky objects compiled by Charles Messier.",
    sources: ["iau"],
  },

  // M1 — Crab Nebula (supernova remnant), Taurus
  {
    id: "nebula:messier-1",
    type: "nebula",
    name: "Messier 1 (Crab Nebula)",
    domain: "science",
    description: "A supernova remnant in Taurus, the expanding debris of a star that exploded in 1054 AD.",
    sources: ["nasa"],
  },
  // M2 — globular cluster, Aquarius (not in list)
  {
    id: "star_cluster:messier-2",
    type: "star_cluster",
    name: "Messier 2",
    domain: "science",
    description: "A rich, compact globular cluster in the constellation Aquarius.",
    sources: ["nasa"],
  },
  // M3 — globular cluster, Canes Venatici
  {
    id: "star_cluster:messier-3",
    type: "star_cluster",
    name: "Messier 3",
    domain: "science",
    description: "A bright globular cluster in Canes Venatici containing hundreds of thousands of stars.",
    sources: ["nasa"],
  },
  // M4 — globular cluster, Scorpius
  {
    id: "star_cluster:messier-4",
    type: "star_cluster",
    name: "Messier 4",
    domain: "science",
    description: "A nearby globular cluster in Scorpius, one of the closest such clusters to the Sun.",
    sources: ["nasa"],
  },
  // M5 — globular cluster, Serpens (not in list)
  {
    id: "star_cluster:messier-5",
    type: "star_cluster",
    name: "Messier 5",
    domain: "science",
    description: "A large, bright globular cluster in the constellation Serpens.",
    sources: ["nasa"],
  },
  // M6 — Butterfly Cluster, open cluster, Scorpius
  {
    id: "star_cluster:messier-6",
    type: "star_cluster",
    name: "Messier 6 (Butterfly Cluster)",
    domain: "science",
    description: "An open star cluster in Scorpius whose brightest stars suggest the shape of a butterfly.",
    sources: ["nasa"],
  },
  // M7 — Ptolemy Cluster, open cluster, Scorpius
  {
    id: "star_cluster:messier-7",
    type: "star_cluster",
    name: "Messier 7 (Ptolemy Cluster)",
    domain: "science",
    description: "A bright open cluster in Scorpius noted by the ancient astronomer Ptolemy.",
    sources: ["nasa"],
  },
  // M8 — Lagoon Nebula, Sagittarius (not in list)
  {
    id: "nebula:messier-8",
    type: "nebula",
    name: "Messier 8 (Lagoon Nebula)",
    domain: "science",
    description: "A giant emission nebula and star-forming region in Sagittarius.",
    sources: ["nasa"],
  },
  // M9 — globular cluster, Ophiuchus (not in list)
  {
    id: "star_cluster:messier-9",
    type: "star_cluster",
    name: "Messier 9",
    domain: "science",
    description: "A globular cluster in Ophiuchus located near the center of the Milky Way.",
    sources: ["nasa"],
  },
  // M10 — globular cluster, Ophiuchus
  {
    id: "star_cluster:messier-10",
    type: "star_cluster",
    name: "Messier 10",
    domain: "science",
    description: "A globular cluster in the constellation Ophiuchus.",
    sources: ["nasa"],
  },
  // M11 — Wild Duck Cluster, open cluster, Scutum (not in list)
  {
    id: "star_cluster:messier-11",
    type: "star_cluster",
    name: "Messier 11 (Wild Duck Cluster)",
    domain: "science",
    description: "A rich open cluster in Scutum whose stars form a V-shape resembling flying ducks.",
    sources: ["nasa"],
  },
  // M12 — globular cluster, Ophiuchus
  {
    id: "star_cluster:messier-12",
    type: "star_cluster",
    name: "Messier 12",
    domain: "science",
    description: "A loosely concentrated globular cluster in Ophiuchus.",
    sources: ["nasa"],
  },
  // M13 — Hercules Globular Cluster, Hercules (not in list)
  {
    id: "star_cluster:messier-13",
    type: "star_cluster",
    name: "Messier 13 (Hercules Globular Cluster)",
    domain: "science",
    description: "The brightest globular cluster in the northern sky, located in Hercules.",
    sources: ["nasa"],
  },
  // M14 — globular cluster, Ophiuchus
  {
    id: "star_cluster:messier-14",
    type: "star_cluster",
    name: "Messier 14",
    domain: "science",
    description: "A globular cluster in the constellation Ophiuchus.",
    sources: ["nasa"],
  },
  // M15 — globular cluster, Pegasus (not in list)
  {
    id: "star_cluster:messier-15",
    type: "star_cluster",
    name: "Messier 15",
    domain: "science",
    description: "A dense globular cluster in Pegasus, one of the most concentrated clusters known.",
    sources: ["nasa"],
  },
  // M16 — Eagle Nebula, Serpens (not in list)
  {
    id: "nebula:messier-16",
    type: "nebula",
    name: "Messier 16 (Eagle Nebula)",
    domain: "science",
    description: "An emission nebula in Serpens famous for the Pillars of Creation star-forming columns.",
    sources: ["nasa"],
  },
  // M17 — Omega Nebula, Sagittarius (not in list)
  {
    id: "nebula:messier-17",
    type: "nebula",
    name: "Messier 17 (Omega Nebula)",
    domain: "science",
    description: "A bright emission nebula and star-forming region in Sagittarius, also called the Swan Nebula.",
    sources: ["nasa"],
  },
  // M18 — open cluster, Sagittarius
  {
    id: "star_cluster:messier-18",
    type: "star_cluster",
    name: "Messier 18",
    domain: "science",
    description: "A small open star cluster in the constellation Sagittarius.",
    sources: ["nasa"],
  },
  // M19 — globular cluster, Ophiuchus
  {
    id: "star_cluster:messier-19",
    type: "star_cluster",
    name: "Messier 19",
    domain: "science",
    description: "A markedly oval-shaped globular cluster in Ophiuchus.",
    sources: ["nasa"],
  },
  // M20 — Trifid Nebula, Sagittarius
  {
    id: "nebula:messier-20",
    type: "nebula",
    name: "Messier 20 (Trifid Nebula)",
    domain: "science",
    description: "A combination emission, reflection, and dark nebula in Sagittarius divided by dust lanes.",
    sources: ["nasa"],
  },
  // M21 — open cluster, Sagittarius
  {
    id: "star_cluster:messier-21",
    type: "star_cluster",
    name: "Messier 21",
    domain: "science",
    description: "A young open star cluster in the constellation Sagittarius.",
    sources: ["nasa"],
  },
  // M22 — globular cluster, Sagittarius
  {
    id: "star_cluster:messier-22",
    type: "star_cluster",
    name: "Messier 22",
    domain: "science",
    description: "A bright globular cluster in Sagittarius, one of the nearest to Earth.",
    sources: ["nasa"],
  },
  // M23 — open cluster, Sagittarius
  {
    id: "star_cluster:messier-23",
    type: "star_cluster",
    name: "Messier 23",
    domain: "science",
    description: "An open star cluster in the constellation Sagittarius.",
    sources: ["nasa"],
  },
  // M24 — Sagittarius Star Cloud — ambiguous (Milky Way star cloud), OMITTED
  // M25 — open cluster, Sagittarius
  {
    id: "star_cluster:messier-25",
    type: "star_cluster",
    name: "Messier 25",
    domain: "science",
    description: "An open star cluster in the constellation Sagittarius.",
    sources: ["nasa"],
  },
  // M26 — open cluster, Scutum
  {
    id: "star_cluster:messier-26",
    type: "star_cluster",
    name: "Messier 26",
    domain: "science",
    description: "An open star cluster in the constellation Scutum.",
    sources: ["nasa"],
  },
  // M27 — Dumbbell Nebula, planetary nebula, Vulpecula (not in list)
  {
    id: "nebula:messier-27",
    type: "nebula",
    name: "Messier 27 (Dumbbell Nebula)",
    domain: "science",
    description: "A bright planetary nebula in Vulpecula, the ejected shell of a dying Sun-like star.",
    sources: ["nasa"],
  },
  // M28 — globular cluster, Sagittarius
  {
    id: "star_cluster:messier-28",
    type: "star_cluster",
    name: "Messier 28",
    domain: "science",
    description: "A globular cluster in the constellation Sagittarius.",
    sources: ["nasa"],
  },
  // M29 — open cluster, Cygnus
  {
    id: "star_cluster:messier-29",
    type: "star_cluster",
    name: "Messier 29",
    domain: "science",
    description: "A small open star cluster in the constellation Cygnus.",
    sources: ["nasa"],
  },
  // M30 — globular cluster, Capricornus (not in list)
  {
    id: "star_cluster:messier-30",
    type: "star_cluster",
    name: "Messier 30",
    domain: "science",
    description: "A dense globular cluster in the constellation Capricornus.",
    sources: ["nasa"],
  },
  // M31 — Andromeda Galaxy, Andromeda
  {
    id: "galaxy:messier-31",
    type: "galaxy",
    name: "Messier 31 (Andromeda Galaxy)",
    domain: "science",
    description: "The nearest large spiral galaxy to the Milky Way, located in Andromeda.",
    sources: ["nasa"],
  },
  // M32 — dwarf elliptical galaxy, Andromeda
  {
    id: "galaxy:messier-32",
    type: "galaxy",
    name: "Messier 32",
    domain: "science",
    description: "A dwarf elliptical galaxy in Andromeda, a satellite of the Andromeda Galaxy.",
    sources: ["nasa"],
  },
  // M33 — Triangulum Galaxy, Triangulum (not in list)
  {
    id: "galaxy:messier-33",
    type: "galaxy",
    name: "Messier 33 (Triangulum Galaxy)",
    domain: "science",
    description: "A spiral galaxy in Triangulum and the third-largest member of the Local Group.",
    sources: ["nasa"],
  },
  // M34 — open cluster, Perseus
  {
    id: "star_cluster:messier-34",
    type: "star_cluster",
    name: "Messier 34",
    domain: "science",
    description: "An open star cluster in the constellation Perseus.",
    sources: ["nasa"],
  },
  // M35 — open cluster, Gemini
  {
    id: "star_cluster:messier-35",
    type: "star_cluster",
    name: "Messier 35",
    domain: "science",
    description: "A large, bright open star cluster in the constellation Gemini.",
    sources: ["nasa"],
  },
  // M36 — open cluster, Auriga
  {
    id: "star_cluster:messier-36",
    type: "star_cluster",
    name: "Messier 36",
    domain: "science",
    description: "A young open star cluster in the constellation Auriga.",
    sources: ["nasa"],
  },
  // M37 — open cluster, Auriga
  {
    id: "star_cluster:messier-37",
    type: "star_cluster",
    name: "Messier 37",
    domain: "science",
    description: "The richest open star cluster in the constellation Auriga.",
    sources: ["nasa"],
  },
  // M38 — open cluster, Auriga
  {
    id: "star_cluster:messier-38",
    type: "star_cluster",
    name: "Messier 38",
    domain: "science",
    description: "An open star cluster in the constellation Auriga.",
    sources: ["nasa"],
  },
  // M39 — open cluster, Cygnus
  {
    id: "star_cluster:messier-39",
    type: "star_cluster",
    name: "Messier 39",
    domain: "science",
    description: "A loose open star cluster in the constellation Cygnus.",
    sources: ["nasa"],
  },
  // M40 — Winnecke 4, double star — not a deep-sky object of these types, OMITTED
  // M41 — open cluster, Canis Major
  {
    id: "star_cluster:messier-41",
    type: "star_cluster",
    name: "Messier 41",
    domain: "science",
    description: "An open star cluster in Canis Major, located just south of Sirius.",
    sources: ["nasa"],
  },
  // M42 — Orion Nebula, Orion
  {
    id: "nebula:messier-42",
    type: "nebula",
    name: "Messier 42 (Orion Nebula)",
    domain: "science",
    description: "A bright diffuse nebula and active star-forming region in the sword of Orion.",
    sources: ["nasa"],
  },
  // M43 — De Mairan's Nebula, Orion (part of Orion complex, emission nebula)
  {
    id: "nebula:messier-43",
    type: "nebula",
    name: "Messier 43 (De Mairan's Nebula)",
    domain: "science",
    description: "An emission nebula in Orion that forms part of the larger Orion Nebula complex.",
    sources: ["nasa"],
  },
  // M44 — Beehive Cluster, open cluster, Cancer (not in list)
  {
    id: "star_cluster:messier-44",
    type: "star_cluster",
    name: "Messier 44 (Beehive Cluster)",
    domain: "science",
    description: "A nearby open star cluster in Cancer, visible to the naked eye as a hazy patch.",
    sources: ["nasa"],
  },
  // M45 — Pleiades, open cluster, Taurus
  {
    id: "star_cluster:messier-45",
    type: "star_cluster",
    name: "Messier 45 (Pleiades)",
    domain: "science",
    description: "A bright, nearby open star cluster in Taurus, also known as the Seven Sisters.",
    sources: ["nasa"],
  },
  // M46 — open cluster, Puppis (not in list)
  {
    id: "star_cluster:messier-46",
    type: "star_cluster",
    name: "Messier 46",
    domain: "science",
    description: "A rich open star cluster in the constellation Puppis.",
    sources: ["nasa"],
  },
  // M47 — open cluster, Puppis
  {
    id: "star_cluster:messier-47",
    type: "star_cluster",
    name: "Messier 47",
    domain: "science",
    description: "A bright open star cluster in the constellation Puppis.",
    sources: ["nasa"],
  },
  // M48 — open cluster, Hydra (not in list)
  {
    id: "star_cluster:messier-48",
    type: "star_cluster",
    name: "Messier 48",
    domain: "science",
    description: "An open star cluster in the constellation Hydra.",
    sources: ["nasa"],
  },
  // M49 — elliptical galaxy, Virgo
  {
    id: "galaxy:messier-49",
    type: "galaxy",
    name: "Messier 49",
    domain: "science",
    description: "A giant elliptical galaxy in Virgo, a bright member of the Virgo Cluster.",
    sources: ["nasa"],
  },
  // M50 — open cluster, Monoceros (not in list)
  {
    id: "star_cluster:messier-50",
    type: "star_cluster",
    name: "Messier 50",
    domain: "science",
    description: "An open star cluster in the constellation Monoceros.",
    sources: ["nasa"],
  },
  // M51 — Whirlpool Galaxy, Canes Venatici (not in list)
  {
    id: "galaxy:messier-51",
    type: "galaxy",
    name: "Messier 51 (Whirlpool Galaxy)",
    domain: "science",
    description: "A grand-design spiral galaxy in Canes Venatici interacting with a smaller companion.",
    sources: ["nasa"],
  },
  // M52 — open cluster, Cassiopeia
  {
    id: "star_cluster:messier-52",
    type: "star_cluster",
    name: "Messier 52",
    domain: "science",
    description: "A rich open star cluster in the constellation Cassiopeia.",
    sources: ["nasa"],
  },
  // M53 — globular cluster, Coma Berenices (not in list)
  {
    id: "star_cluster:messier-53",
    type: "star_cluster",
    name: "Messier 53",
    domain: "science",
    description: "A globular cluster in the constellation Coma Berenices.",
    sources: ["nasa"],
  },
  // M54 — globular cluster, Sagittarius
  {
    id: "star_cluster:messier-54",
    type: "star_cluster",
    name: "Messier 54",
    domain: "science",
    description: "A globular cluster in Sagittarius belonging to the Sagittarius Dwarf Galaxy.",
    sources: ["nasa"],
  },
  // M55 — globular cluster, Sagittarius
  {
    id: "star_cluster:messier-55",
    type: "star_cluster",
    name: "Messier 55",
    domain: "science",
    description: "A large, loosely concentrated globular cluster in Sagittarius.",
    sources: ["nasa"],
  },
  // M56 — globular cluster, Lyra
  {
    id: "star_cluster:messier-56",
    type: "star_cluster",
    name: "Messier 56",
    domain: "science",
    description: "A globular cluster in the constellation Lyra.",
    sources: ["nasa"],
  },
  // M57 — Ring Nebula, planetary nebula, Lyra
  {
    id: "nebula:messier-57",
    type: "nebula",
    name: "Messier 57 (Ring Nebula)",
    domain: "science",
    description: "A planetary nebula in Lyra appearing as a glowing ring of gas around a dying star.",
    sources: ["nasa"],
  },
  // M58 — barred spiral galaxy, Virgo
  {
    id: "galaxy:messier-58",
    type: "galaxy",
    name: "Messier 58",
    domain: "science",
    description: "A barred spiral galaxy in Virgo, a member of the Virgo Cluster.",
    sources: ["nasa"],
  },
  // M59 — elliptical galaxy, Virgo
  {
    id: "galaxy:messier-59",
    type: "galaxy",
    name: "Messier 59",
    domain: "science",
    description: "An elliptical galaxy in the Virgo Cluster within the constellation Virgo.",
    sources: ["nasa"],
  },
  // M60 — elliptical galaxy, Virgo
  {
    id: "galaxy:messier-60",
    type: "galaxy",
    name: "Messier 60",
    domain: "science",
    description: "A large elliptical galaxy in Virgo, part of the Virgo Cluster.",
    sources: ["nasa"],
  },
  // M61 — spiral galaxy, Virgo
  {
    id: "galaxy:messier-61",
    type: "galaxy",
    name: "Messier 61",
    domain: "science",
    description: "A barred spiral galaxy in Virgo and a member of the Virgo Cluster.",
    sources: ["nasa"],
  },
  // M62 — globular cluster, Ophiuchus
  {
    id: "star_cluster:messier-62",
    type: "star_cluster",
    name: "Messier 62",
    domain: "science",
    description: "A globular cluster in the constellation Ophiuchus.",
    sources: ["nasa"],
  },
  // M63 — Sunflower Galaxy, Canes Venatici (not in list)
  {
    id: "galaxy:messier-63",
    type: "galaxy",
    name: "Messier 63 (Sunflower Galaxy)",
    domain: "science",
    description: "A spiral galaxy in Canes Venatici with bright, patchy spiral arms.",
    sources: ["nasa"],
  },
  // M64 — Black Eye Galaxy, Coma Berenices (not in list)
  {
    id: "galaxy:messier-64",
    type: "galaxy",
    name: "Messier 64 (Black Eye Galaxy)",
    domain: "science",
    description: "A spiral galaxy in Coma Berenices with a prominent dark dust band across its core.",
    sources: ["nasa"],
  },
  // M65 — spiral galaxy, Leo
  {
    id: "galaxy:messier-65",
    type: "galaxy",
    name: "Messier 65",
    domain: "science",
    description: "A spiral galaxy in Leo, one of the members of the Leo Triplet.",
    sources: ["nasa"],
  },
  // M66 — spiral galaxy, Leo
  {
    id: "galaxy:messier-66",
    type: "galaxy",
    name: "Messier 66",
    domain: "science",
    description: "A spiral galaxy in Leo and the largest member of the Leo Triplet.",
    sources: ["nasa"],
  },
  // M67 — open cluster, Cancer (not in list)
  {
    id: "star_cluster:messier-67",
    type: "star_cluster",
    name: "Messier 67",
    domain: "science",
    description: "One of the oldest known open star clusters, located in Cancer.",
    sources: ["nasa"],
  },
  // M68 — globular cluster, Hydra (not in list)
  {
    id: "star_cluster:messier-68",
    type: "star_cluster",
    name: "Messier 68",
    domain: "science",
    description: "A globular cluster in the constellation Hydra.",
    sources: ["nasa"],
  },
  // M69 — globular cluster, Sagittarius
  {
    id: "star_cluster:messier-69",
    type: "star_cluster",
    name: "Messier 69",
    domain: "science",
    description: "A globular cluster in the constellation Sagittarius.",
    sources: ["nasa"],
  },
  // M70 — globular cluster, Sagittarius
  {
    id: "star_cluster:messier-70",
    type: "star_cluster",
    name: "Messier 70",
    domain: "science",
    description: "A globular cluster in the constellation Sagittarius.",
    sources: ["nasa"],
  },
  // M71 — globular cluster, Sagitta (not in list)
  {
    id: "star_cluster:messier-71",
    type: "star_cluster",
    name: "Messier 71",
    domain: "science",
    description: "A loosely concentrated globular cluster in the constellation Sagitta.",
    sources: ["nasa"],
  },
  // M72 — globular cluster, Aquarius (not in list)
  {
    id: "star_cluster:messier-72",
    type: "star_cluster",
    name: "Messier 72",
    domain: "science",
    description: "A faint, distant globular cluster in the constellation Aquarius.",
    sources: ["nasa"],
  },
  // M73 — asterism / sparse grouping — not a true cluster, OMITTED
  // M74 — spiral galaxy, Pisces (not in list)
  {
    id: "galaxy:messier-74",
    type: "galaxy",
    name: "Messier 74",
    domain: "science",
    description: "A face-on grand-design spiral galaxy in the constellation Pisces.",
    sources: ["nasa"],
  },
  // M75 — globular cluster, Sagittarius
  {
    id: "star_cluster:messier-75",
    type: "star_cluster",
    name: "Messier 75",
    domain: "science",
    description: "A dense, distant globular cluster in the constellation Sagittarius.",
    sources: ["nasa"],
  },
  // M76 — Little Dumbbell Nebula, planetary nebula, Perseus
  {
    id: "nebula:messier-76",
    type: "nebula",
    name: "Messier 76 (Little Dumbbell Nebula)",
    domain: "science",
    description: "A planetary nebula in Perseus, one of the faintest objects in the Messier catalogue.",
    sources: ["nasa"],
  },
  // M77 — barred spiral galaxy / Seyfert galaxy, Cetus (not in list)
  {
    id: "galaxy:messier-77",
    type: "galaxy",
    name: "Messier 77",
    domain: "science",
    description: "A barred spiral galaxy in Cetus with an active galactic nucleus, a prototypical Seyfert galaxy.",
    sources: ["nasa"],
  },
  // M78 — reflection nebula, Orion
  {
    id: "nebula:messier-78",
    type: "nebula",
    name: "Messier 78",
    domain: "science",
    description: "A reflection nebula in Orion, the brightest diffuse reflection nebula in the sky.",
    sources: ["nasa"],
  },
  // M79 — globular cluster, Lepus (not in list)
  {
    id: "star_cluster:messier-79",
    type: "star_cluster",
    name: "Messier 79",
    domain: "science",
    description: "A globular cluster in the constellation Lepus, unusual for its location away from the galactic center.",
    sources: ["nasa"],
  },
  // M80 — globular cluster, Scorpius
  {
    id: "star_cluster:messier-80",
    type: "star_cluster",
    name: "Messier 80",
    domain: "science",
    description: "A dense globular cluster in the constellation Scorpius.",
    sources: ["nasa"],
  },
  // M81 — Bode's Galaxy, Ursa Major (not in list)
  {
    id: "galaxy:messier-81",
    type: "galaxy",
    name: "Messier 81 (Bode's Galaxy)",
    domain: "science",
    description: "A grand-design spiral galaxy in Ursa Major, one of the brightest galaxies in the sky.",
    sources: ["nasa"],
  },
  // M82 — Cigar Galaxy, Ursa Major (not in list)
  {
    id: "galaxy:messier-82",
    type: "galaxy",
    name: "Messier 82 (Cigar Galaxy)",
    domain: "science",
    description: "An edge-on starburst galaxy in Ursa Major undergoing intense star formation.",
    sources: ["nasa"],
  },
  // M83 — Southern Pinwheel Galaxy, Hydra (not in list)
  {
    id: "galaxy:messier-83",
    type: "galaxy",
    name: "Messier 83 (Southern Pinwheel Galaxy)",
    domain: "science",
    description: "A barred spiral galaxy in Hydra noted for its bright, well-defined spiral arms.",
    sources: ["nasa"],
  },
  // M84 — lenticular/elliptical galaxy, Virgo
  {
    id: "galaxy:messier-84",
    type: "galaxy",
    name: "Messier 84",
    domain: "science",
    description: "A lenticular galaxy in Virgo within the heart of the Virgo Cluster.",
    sources: ["nasa"],
  },
  // M85 — lenticular galaxy, Coma Berenices (not in list)
  {
    id: "galaxy:messier-85",
    type: "galaxy",
    name: "Messier 85",
    domain: "science",
    description: "A lenticular galaxy in Coma Berenices, a member of the Virgo Cluster.",
    sources: ["nasa"],
  },
  // M86 — lenticular galaxy, Virgo
  {
    id: "galaxy:messier-86",
    type: "galaxy",
    name: "Messier 86",
    domain: "science",
    description: "A lenticular galaxy in Virgo near the center of the Virgo Cluster.",
    sources: ["nasa"],
  },
  // M87 — supergiant elliptical galaxy, Virgo
  {
    id: "galaxy:messier-87",
    type: "galaxy",
    name: "Messier 87",
    domain: "science",
    description: "A supergiant elliptical galaxy in Virgo hosting a supermassive black hole and a relativistic jet.",
    sources: ["nasa"],
  },
  // M88 — spiral galaxy, Coma Berenices (not in list)
  {
    id: "galaxy:messier-88",
    type: "galaxy",
    name: "Messier 88",
    domain: "science",
    description: "A spiral galaxy in Coma Berenices, a member of the Virgo Cluster.",
    sources: ["nasa"],
  },
  // M89 — elliptical galaxy, Virgo
  {
    id: "galaxy:messier-89",
    type: "galaxy",
    name: "Messier 89",
    domain: "science",
    description: "An elliptical galaxy in Virgo within the Virgo Cluster.",
    sources: ["nasa"],
  },
  // M90 — spiral galaxy, Virgo
  {
    id: "galaxy:messier-90",
    type: "galaxy",
    name: "Messier 90",
    domain: "science",
    description: "A spiral galaxy in Virgo and a member of the Virgo Cluster.",
    sources: ["nasa"],
  },
  // M91 — barred spiral galaxy, Coma Berenices (not in list)
  {
    id: "galaxy:messier-91",
    type: "galaxy",
    name: "Messier 91",
    domain: "science",
    description: "A barred spiral galaxy in Coma Berenices, a member of the Virgo Cluster.",
    sources: ["nasa"],
  },
  // M92 — globular cluster, Hercules (not in list)
  {
    id: "star_cluster:messier-92",
    type: "star_cluster",
    name: "Messier 92",
    domain: "science",
    description: "A bright globular cluster in the constellation Hercules.",
    sources: ["nasa"],
  },
  // M93 — open cluster, Puppis (not in list)
  {
    id: "star_cluster:messier-93",
    type: "star_cluster",
    name: "Messier 93",
    domain: "science",
    description: "An open star cluster in the constellation Puppis.",
    sources: ["nasa"],
  },
  // M94 — spiral galaxy, Canes Venatici (not in list)
  {
    id: "galaxy:messier-94",
    type: "galaxy",
    name: "Messier 94",
    domain: "science",
    description: "A spiral galaxy in Canes Venatici with a bright inner ring of star formation.",
    sources: ["nasa"],
  },
  // M95 — barred spiral galaxy, Leo
  {
    id: "galaxy:messier-95",
    type: "galaxy",
    name: "Messier 95",
    domain: "science",
    description: "A barred spiral galaxy in Leo, part of the Leo I group of galaxies.",
    sources: ["nasa"],
  },
  // M96 — spiral galaxy, Leo
  {
    id: "galaxy:messier-96",
    type: "galaxy",
    name: "Messier 96",
    domain: "science",
    description: "A spiral galaxy in Leo and the brightest member of the Leo I group.",
    sources: ["nasa"],
  },
  // M97 — Owl Nebula, planetary nebula, Ursa Major (not in list)
  {
    id: "nebula:messier-97",
    type: "nebula",
    name: "Messier 97 (Owl Nebula)",
    domain: "science",
    description: "A planetary nebula in Ursa Major whose two dark patches resemble an owl's eyes.",
    sources: ["nasa"],
  },
  // M98 — spiral galaxy, Coma Berenices (not in list)
  {
    id: "galaxy:messier-98",
    type: "galaxy",
    name: "Messier 98",
    domain: "science",
    description: "An edge-on spiral galaxy in Coma Berenices, a member of the Virgo Cluster.",
    sources: ["nasa"],
  },
  // M99 — spiral galaxy, Coma Berenices (not in list)
  {
    id: "galaxy:messier-99",
    type: "galaxy",
    name: "Messier 99",
    domain: "science",
    description: "A nearly face-on grand-design spiral galaxy in Coma Berenices.",
    sources: ["nasa"],
  },
  // M100 — spiral galaxy, Coma Berenices (not in list)
  {
    id: "galaxy:messier-100",
    type: "galaxy",
    name: "Messier 100",
    domain: "science",
    description: "A grand-design spiral galaxy in Coma Berenices, one of the brightest in the Virgo Cluster.",
    sources: ["nasa"],
  },
  // M101 — Pinwheel Galaxy, Ursa Major (not in list)
  {
    id: "galaxy:messier-101",
    type: "galaxy",
    name: "Messier 101 (Pinwheel Galaxy)",
    domain: "science",
    description: "A large face-on spiral galaxy in Ursa Major with sprawling spiral arms.",
    sources: ["nasa"],
  },
  // M102 — disputed identification, OMITTED
  // M103 — open cluster, Cassiopeia
  {
    id: "star_cluster:messier-103",
    type: "star_cluster",
    name: "Messier 103",
    domain: "science",
    description: "An open star cluster in the constellation Cassiopeia.",
    sources: ["nasa"],
  },
  // M104 — Sombrero Galaxy, Virgo
  {
    id: "galaxy:messier-104",
    type: "galaxy",
    name: "Messier 104 (Sombrero Galaxy)",
    domain: "science",
    description: "A spiral galaxy in Virgo seen nearly edge-on, with a prominent dust lane and bright bulge.",
    sources: ["nasa"],
  },
  // M105 — elliptical galaxy, Leo
  {
    id: "galaxy:messier-105",
    type: "galaxy",
    name: "Messier 105",
    domain: "science",
    description: "An elliptical galaxy in Leo and a member of the Leo I group.",
    sources: ["nasa"],
  },
  // M106 — spiral galaxy, Canes Venatici (not in list)
  {
    id: "galaxy:messier-106",
    type: "galaxy",
    name: "Messier 106",
    domain: "science",
    description: "A spiral galaxy in Canes Venatici with an active galactic nucleus.",
    sources: ["nasa"],
  },
  // M107 — globular cluster, Ophiuchus (not in list)
  {
    id: "star_cluster:messier-107",
    type: "star_cluster",
    name: "Messier 107",
    domain: "science",
    description: "A globular cluster in the constellation Ophiuchus.",
    sources: ["nasa"],
  },
  // M108 — barred spiral galaxy, Ursa Major (not in list)
  {
    id: "galaxy:messier-108",
    type: "galaxy",
    name: "Messier 108",
    domain: "science",
    description: "An edge-on barred spiral galaxy in the constellation Ursa Major.",
    sources: ["nasa"],
  },
  // M109 — barred spiral galaxy, Ursa Major (not in list)
  {
    id: "galaxy:messier-109",
    type: "galaxy",
    name: "Messier 109",
    domain: "science",
    description: "A barred spiral galaxy in the constellation Ursa Major.",
    sources: ["nasa"],
  },
  // M110 — dwarf elliptical galaxy, Andromeda
  {
    id: "galaxy:messier-110",
    type: "galaxy",
    name: "Messier 110",
    domain: "science",
    description: "A dwarf elliptical galaxy in Andromeda, a satellite of the Andromeda Galaxy.",
    sources: ["nasa"],
  },
];

export const relations: GraphRelation[] = [
  // M1 — Taurus (in list)
  rel("nebula:messier-1", "part_of", "catalog:messier", "confirmed", "science"),
  rel("nebula:messier-1", "located_in", "constellation:taurus", "confirmed", "science"),
  // M2 — Aquarius (not in list)
  rel("star_cluster:messier-2", "part_of", "catalog:messier", "confirmed", "science"),
  // M3 — Canes Venatici (not in list)
  rel("star_cluster:messier-3", "part_of", "catalog:messier", "confirmed", "science"),
  // M4 — Scorpius (in list)
  rel("star_cluster:messier-4", "part_of", "catalog:messier", "confirmed", "science"),
  rel("star_cluster:messier-4", "located_in", "constellation:scorpius", "confirmed", "science"),
  // M5 — Serpens (not in list)
  rel("star_cluster:messier-5", "part_of", "catalog:messier", "confirmed", "science"),
  // M6 — Scorpius (in list)
  rel("star_cluster:messier-6", "part_of", "catalog:messier", "confirmed", "science"),
  rel("star_cluster:messier-6", "located_in", "constellation:scorpius", "confirmed", "science"),
  // M7 — Scorpius (in list)
  rel("star_cluster:messier-7", "part_of", "catalog:messier", "confirmed", "science"),
  rel("star_cluster:messier-7", "located_in", "constellation:scorpius", "confirmed", "science"),
  // M8 — Sagittarius (not in list)
  rel("nebula:messier-8", "part_of", "catalog:messier", "confirmed", "science"),
  // M9 — Ophiuchus (not in list)
  rel("star_cluster:messier-9", "part_of", "catalog:messier", "confirmed", "science"),
  // M10 — Ophiuchus (not in list)
  rel("star_cluster:messier-10", "part_of", "catalog:messier", "confirmed", "science"),
  // M11 — Scutum (not in list)
  rel("star_cluster:messier-11", "part_of", "catalog:messier", "confirmed", "science"),
  // M12 — Ophiuchus (not in list)
  rel("star_cluster:messier-12", "part_of", "catalog:messier", "confirmed", "science"),
  // M13 — Hercules (not in list)
  rel("star_cluster:messier-13", "part_of", "catalog:messier", "confirmed", "science"),
  // M14 — Ophiuchus (not in list)
  rel("star_cluster:messier-14", "part_of", "catalog:messier", "confirmed", "science"),
  // M15 — Pegasus (not in list)
  rel("star_cluster:messier-15", "part_of", "catalog:messier", "confirmed", "science"),
  // M16 — Serpens (not in list)
  rel("nebula:messier-16", "part_of", "catalog:messier", "confirmed", "science"),
  // M17 — Sagittarius (not in list)
  rel("nebula:messier-17", "part_of", "catalog:messier", "confirmed", "science"),
  // M18 — Sagittarius (not in list)
  rel("star_cluster:messier-18", "part_of", "catalog:messier", "confirmed", "science"),
  // M19 — Ophiuchus (not in list)
  rel("star_cluster:messier-19", "part_of", "catalog:messier", "confirmed", "science"),
  // M20 — Sagittarius (not in list)
  rel("nebula:messier-20", "part_of", "catalog:messier", "confirmed", "science"),
  // M21 — Sagittarius (not in list)
  rel("star_cluster:messier-21", "part_of", "catalog:messier", "confirmed", "science"),
  // M22 — Sagittarius (not in list)
  rel("star_cluster:messier-22", "part_of", "catalog:messier", "confirmed", "science"),
  // M23 — Sagittarius (not in list)
  rel("star_cluster:messier-23", "part_of", "catalog:messier", "confirmed", "science"),
  // M25 — Sagittarius (not in list)
  rel("star_cluster:messier-25", "part_of", "catalog:messier", "confirmed", "science"),
  // M26 — Scutum (not in list)
  rel("star_cluster:messier-26", "part_of", "catalog:messier", "confirmed", "science"),
  // M27 — Vulpecula (not in list)
  rel("nebula:messier-27", "part_of", "catalog:messier", "confirmed", "science"),
  // M28 — Sagittarius (not in list)
  rel("star_cluster:messier-28", "part_of", "catalog:messier", "confirmed", "science"),
  // M29 — Cygnus (in list)
  rel("star_cluster:messier-29", "part_of", "catalog:messier", "confirmed", "science"),
  rel("star_cluster:messier-29", "located_in", "constellation:cygnus", "confirmed", "science"),
  // M30 — Capricornus (not in list)
  rel("star_cluster:messier-30", "part_of", "catalog:messier", "confirmed", "science"),
  // M31 — Andromeda (in list)
  rel("galaxy:messier-31", "part_of", "catalog:messier", "confirmed", "science"),
  rel("galaxy:messier-31", "located_in", "constellation:andromeda", "confirmed", "science"),
  // M32 — Andromeda (in list)
  rel("galaxy:messier-32", "part_of", "catalog:messier", "confirmed", "science"),
  rel("galaxy:messier-32", "located_in", "constellation:andromeda", "confirmed", "science"),
  // M33 — Triangulum (not in list)
  rel("galaxy:messier-33", "part_of", "catalog:messier", "confirmed", "science"),
  // M34 — Perseus (in list)
  rel("star_cluster:messier-34", "part_of", "catalog:messier", "confirmed", "science"),
  rel("star_cluster:messier-34", "located_in", "constellation:perseus", "confirmed", "science"),
  // M35 — Gemini (in list)
  rel("star_cluster:messier-35", "part_of", "catalog:messier", "confirmed", "science"),
  rel("star_cluster:messier-35", "located_in", "constellation:gemini", "confirmed", "science"),
  // M36 — Auriga (in list)
  rel("star_cluster:messier-36", "part_of", "catalog:messier", "confirmed", "science"),
  rel("star_cluster:messier-36", "located_in", "constellation:auriga", "confirmed", "science"),
  // M37 — Auriga (in list)
  rel("star_cluster:messier-37", "part_of", "catalog:messier", "confirmed", "science"),
  rel("star_cluster:messier-37", "located_in", "constellation:auriga", "confirmed", "science"),
  // M38 — Auriga (in list)
  rel("star_cluster:messier-38", "part_of", "catalog:messier", "confirmed", "science"),
  rel("star_cluster:messier-38", "located_in", "constellation:auriga", "confirmed", "science"),
  // M39 — Cygnus (in list)
  rel("star_cluster:messier-39", "part_of", "catalog:messier", "confirmed", "science"),
  rel("star_cluster:messier-39", "located_in", "constellation:cygnus", "confirmed", "science"),
  // M41 — Canis Major (in list)
  rel("star_cluster:messier-41", "part_of", "catalog:messier", "confirmed", "science"),
  rel("star_cluster:messier-41", "located_in", "constellation:canis-major", "confirmed", "science"),
  // M42 — Orion (in list)
  rel("nebula:messier-42", "part_of", "catalog:messier", "confirmed", "science"),
  rel("nebula:messier-42", "located_in", "constellation:orion", "confirmed", "science"),
  // M43 — Orion (in list)
  rel("nebula:messier-43", "part_of", "catalog:messier", "confirmed", "science"),
  rel("nebula:messier-43", "located_in", "constellation:orion", "confirmed", "science"),
  // M44 — Cancer (not in list)
  rel("star_cluster:messier-44", "part_of", "catalog:messier", "confirmed", "science"),
  // M45 — Taurus (in list)
  rel("star_cluster:messier-45", "part_of", "catalog:messier", "confirmed", "science"),
  rel("star_cluster:messier-45", "located_in", "constellation:taurus", "confirmed", "science"),
  // M46 — Puppis (not in list)
  rel("star_cluster:messier-46", "part_of", "catalog:messier", "confirmed", "science"),
  // M47 — Puppis (not in list)
  rel("star_cluster:messier-47", "part_of", "catalog:messier", "confirmed", "science"),
  // M48 — Hydra (not in list)
  rel("star_cluster:messier-48", "part_of", "catalog:messier", "confirmed", "science"),
  // M49 — Virgo (in list)
  rel("galaxy:messier-49", "part_of", "catalog:messier", "confirmed", "science"),
  rel("galaxy:messier-49", "located_in", "constellation:virgo", "confirmed", "science"),
  // M50 — Monoceros (not in list)
  rel("star_cluster:messier-50", "part_of", "catalog:messier", "confirmed", "science"),
  // M51 — Canes Venatici (not in list)
  rel("galaxy:messier-51", "part_of", "catalog:messier", "confirmed", "science"),
  // M52 — Cassiopeia (in list)
  rel("star_cluster:messier-52", "part_of", "catalog:messier", "confirmed", "science"),
  rel("star_cluster:messier-52", "located_in", "constellation:cassiopeia", "confirmed", "science"),
  // M53 — Coma Berenices (not in list)
  rel("star_cluster:messier-53", "part_of", "catalog:messier", "confirmed", "science"),
  // M54 — Sagittarius (not in list)
  rel("star_cluster:messier-54", "part_of", "catalog:messier", "confirmed", "science"),
  // M55 — Sagittarius (not in list)
  rel("star_cluster:messier-55", "part_of", "catalog:messier", "confirmed", "science"),
  // M56 — Lyra (in list)
  rel("star_cluster:messier-56", "part_of", "catalog:messier", "confirmed", "science"),
  rel("star_cluster:messier-56", "located_in", "constellation:lyra", "confirmed", "science"),
  // M57 — Lyra (in list)
  rel("nebula:messier-57", "part_of", "catalog:messier", "confirmed", "science"),
  rel("nebula:messier-57", "located_in", "constellation:lyra", "confirmed", "science"),
  // M58 — Virgo (in list)
  rel("galaxy:messier-58", "part_of", "catalog:messier", "confirmed", "science"),
  rel("galaxy:messier-58", "located_in", "constellation:virgo", "confirmed", "science"),
  // M59 — Virgo (in list)
  rel("galaxy:messier-59", "part_of", "catalog:messier", "confirmed", "science"),
  rel("galaxy:messier-59", "located_in", "constellation:virgo", "confirmed", "science"),
  // M60 — Virgo (in list)
  rel("galaxy:messier-60", "part_of", "catalog:messier", "confirmed", "science"),
  rel("galaxy:messier-60", "located_in", "constellation:virgo", "confirmed", "science"),
  // M61 — Virgo (in list)
  rel("galaxy:messier-61", "part_of", "catalog:messier", "confirmed", "science"),
  rel("galaxy:messier-61", "located_in", "constellation:virgo", "confirmed", "science"),
  // M62 — Ophiuchus (not in list)
  rel("star_cluster:messier-62", "part_of", "catalog:messier", "confirmed", "science"),
  // M63 — Canes Venatici (not in list)
  rel("galaxy:messier-63", "part_of", "catalog:messier", "confirmed", "science"),
  // M64 — Coma Berenices (not in list)
  rel("galaxy:messier-64", "part_of", "catalog:messier", "confirmed", "science"),
  // M65 — Leo (in list)
  rel("galaxy:messier-65", "part_of", "catalog:messier", "confirmed", "science"),
  rel("galaxy:messier-65", "located_in", "constellation:leo", "confirmed", "science"),
  // M66 — Leo (in list)
  rel("galaxy:messier-66", "part_of", "catalog:messier", "confirmed", "science"),
  rel("galaxy:messier-66", "located_in", "constellation:leo", "confirmed", "science"),
  // M67 — Cancer (not in list)
  rel("star_cluster:messier-67", "part_of", "catalog:messier", "confirmed", "science"),
  // M68 — Hydra (not in list)
  rel("star_cluster:messier-68", "part_of", "catalog:messier", "confirmed", "science"),
  // M69 — Sagittarius (not in list)
  rel("star_cluster:messier-69", "part_of", "catalog:messier", "confirmed", "science"),
  // M70 — Sagittarius (not in list)
  rel("star_cluster:messier-70", "part_of", "catalog:messier", "confirmed", "science"),
  // M71 — Sagitta (not in list)
  rel("star_cluster:messier-71", "part_of", "catalog:messier", "confirmed", "science"),
  // M72 — Aquarius (not in list)
  rel("star_cluster:messier-72", "part_of", "catalog:messier", "confirmed", "science"),
  // M74 — Pisces (not in list)
  rel("galaxy:messier-74", "part_of", "catalog:messier", "confirmed", "science"),
  // M75 — Sagittarius (not in list)
  rel("star_cluster:messier-75", "part_of", "catalog:messier", "confirmed", "science"),
  // M76 — Perseus (in list)
  rel("nebula:messier-76", "part_of", "catalog:messier", "confirmed", "science"),
  rel("nebula:messier-76", "located_in", "constellation:perseus", "confirmed", "science"),
  // M77 — Cetus (not in list)
  rel("galaxy:messier-77", "part_of", "catalog:messier", "confirmed", "science"),
  // M78 — Orion (in list)
  rel("nebula:messier-78", "part_of", "catalog:messier", "confirmed", "science"),
  rel("nebula:messier-78", "located_in", "constellation:orion", "confirmed", "science"),
  // M79 — Lepus (not in list)
  rel("star_cluster:messier-79", "part_of", "catalog:messier", "confirmed", "science"),
  // M80 — Scorpius (in list)
  rel("star_cluster:messier-80", "part_of", "catalog:messier", "confirmed", "science"),
  rel("star_cluster:messier-80", "located_in", "constellation:scorpius", "confirmed", "science"),
  // M81 — Ursa Major (not in list)
  rel("galaxy:messier-81", "part_of", "catalog:messier", "confirmed", "science"),
  // M82 — Ursa Major (not in list)
  rel("galaxy:messier-82", "part_of", "catalog:messier", "confirmed", "science"),
  // M83 — Hydra (not in list)
  rel("galaxy:messier-83", "part_of", "catalog:messier", "confirmed", "science"),
  // M84 — Virgo (in list)
  rel("galaxy:messier-84", "part_of", "catalog:messier", "confirmed", "science"),
  rel("galaxy:messier-84", "located_in", "constellation:virgo", "confirmed", "science"),
  // M85 — Coma Berenices (not in list)
  rel("galaxy:messier-85", "part_of", "catalog:messier", "confirmed", "science"),
  // M86 — Virgo (in list)
  rel("galaxy:messier-86", "part_of", "catalog:messier", "confirmed", "science"),
  rel("galaxy:messier-86", "located_in", "constellation:virgo", "confirmed", "science"),
  // M87 — Virgo (in list)
  rel("galaxy:messier-87", "part_of", "catalog:messier", "confirmed", "science"),
  rel("galaxy:messier-87", "located_in", "constellation:virgo", "confirmed", "science"),
  // M88 — Coma Berenices (not in list)
  rel("galaxy:messier-88", "part_of", "catalog:messier", "confirmed", "science"),
  // M89 — Virgo (in list)
  rel("galaxy:messier-89", "part_of", "catalog:messier", "confirmed", "science"),
  rel("galaxy:messier-89", "located_in", "constellation:virgo", "confirmed", "science"),
  // M90 — Virgo (in list)
  rel("galaxy:messier-90", "part_of", "catalog:messier", "confirmed", "science"),
  rel("galaxy:messier-90", "located_in", "constellation:virgo", "confirmed", "science"),
  // M91 — Coma Berenices (not in list)
  rel("galaxy:messier-91", "part_of", "catalog:messier", "confirmed", "science"),
  // M92 — Hercules (not in list)
  rel("star_cluster:messier-92", "part_of", "catalog:messier", "confirmed", "science"),
  // M93 — Puppis (not in list)
  rel("star_cluster:messier-93", "part_of", "catalog:messier", "confirmed", "science"),
  // M94 — Canes Venatici (not in list)
  rel("galaxy:messier-94", "part_of", "catalog:messier", "confirmed", "science"),
  // M95 — Leo (in list)
  rel("galaxy:messier-95", "part_of", "catalog:messier", "confirmed", "science"),
  rel("galaxy:messier-95", "located_in", "constellation:leo", "confirmed", "science"),
  // M96 — Leo (in list)
  rel("galaxy:messier-96", "part_of", "catalog:messier", "confirmed", "science"),
  rel("galaxy:messier-96", "located_in", "constellation:leo", "confirmed", "science"),
  // M97 — Ursa Major (not in list)
  rel("nebula:messier-97", "part_of", "catalog:messier", "confirmed", "science"),
  // M98 — Coma Berenices (not in list)
  rel("galaxy:messier-98", "part_of", "catalog:messier", "confirmed", "science"),
  // M99 — Coma Berenices (not in list)
  rel("galaxy:messier-99", "part_of", "catalog:messier", "confirmed", "science"),
  // M100 — Coma Berenices (not in list)
  rel("galaxy:messier-100", "part_of", "catalog:messier", "confirmed", "science"),
  // M101 — Ursa Major (not in list)
  rel("galaxy:messier-101", "part_of", "catalog:messier", "confirmed", "science"),
  // M103 — Cassiopeia (in list)
  rel("star_cluster:messier-103", "part_of", "catalog:messier", "confirmed", "science"),
  rel("star_cluster:messier-103", "located_in", "constellation:cassiopeia", "confirmed", "science"),
  // M104 — Virgo (in list)
  rel("galaxy:messier-104", "part_of", "catalog:messier", "confirmed", "science"),
  rel("galaxy:messier-104", "located_in", "constellation:virgo", "confirmed", "science"),
  // M105 — Leo (in list)
  rel("galaxy:messier-105", "part_of", "catalog:messier", "confirmed", "science"),
  rel("galaxy:messier-105", "located_in", "constellation:leo", "confirmed", "science"),
  // M106 — Canes Venatici (not in list)
  rel("galaxy:messier-106", "part_of", "catalog:messier", "confirmed", "science"),
  // M107 — Ophiuchus (not in list)
  rel("star_cluster:messier-107", "part_of", "catalog:messier", "confirmed", "science"),
  // M108 — Ursa Major (not in list)
  rel("galaxy:messier-108", "part_of", "catalog:messier", "confirmed", "science"),
  // M109 — Ursa Major (not in list)
  rel("galaxy:messier-109", "part_of", "catalog:messier", "confirmed", "science"),
  // M110 — Andromeda (in list)
  rel("galaxy:messier-110", "part_of", "catalog:messier", "confirmed", "science"),
  rel("galaxy:messier-110", "located_in", "constellation:andromeda", "confirmed", "science"),
];
