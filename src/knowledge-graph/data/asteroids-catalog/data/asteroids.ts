import type { BodyCategory, MinorBodyRecord } from "@/knowledge-graph/data/asteroids-catalog/types";
import type { SourceKey } from "@/lib/sources";

/**
 * Individual minor planets. The ten asteroids and five dwarf planets already in the
 * graph are marked `existing: true` and ENRICHED here (linked into families, groups,
 * resonances, and missions) — never recreated; their canonical pages stay in the
 * Solar System encyclopedia. New minor planets are created with `/asteroids/{slug}`
 * pages. Every figure is source-backed; sizes/discovery data are given only where
 * well-established (MPC / JPL Small-Body Database), and omitted otherwise.
 */
type A = {
  slug: string;
  name: string;
  existing?: boolean;
  dwarf?: boolean; // dwarf planet (reused; never created here)
  category: BodyCategory;
  designation?: string;
  discoveredBy?: string;
  discoveryYear?: string;
  spectral?: string;
  taxonomy?: "carbonaceous" | "silicaceous" | "metallic" | "basaltic" | "other";
  diameterKm?: number;
  dimensions?: string;
  family?: string;
  groups?: string[];
  neoClass?: string;
  trojanGroups?: string[];
  resonance?: string;
  parentBody?: string;
  systemPrimary?: string;
  systemType?: "binary" | "triple";
  moons?: string[];
  pha?: boolean;
  visitedBy?: string[];
  sampleReturnBy?: string[];
  targetOf?: string[];
  related?: string[];
  sources?: SourceKey[];
  alt?: string[];
  description: string;
  highlights?: string[];
};

const mk = (a: A): MinorBodyRecord => ({
  id: `${a.dwarf ? "dwarf_planet" : "asteroid"}:${a.slug}`,
  slug: a.slug,
  name: a.name,
  kind: a.dwarf ? "dwarf-planet" : "asteroid",
  existing: a.existing,
  altNames: a.alt,
  description: a.description,
  sources: a.sources ?? ["jpl", "mpc"],
  category: a.category,
  designation: a.designation,
  discoveredBy: a.discoveredBy,
  discoveryYear: a.discoveryYear,
  spectralType: a.spectral,
  taxonomyClass: a.taxonomy,
  meanDiameterKm: a.diameterKm,
  dimensionsLabel: a.dimensions,
  familySlug: a.family,
  groupSlugs: a.groups,
  neoClassSlug: a.neoClass,
  trojanGroupSlugs: a.trojanGroups,
  resonanceSlug: a.resonance,
  parentBodySlug: a.parentBody,
  systemPrimarySlug: a.systemPrimary,
  systemType: a.systemType,
  moons: a.moons,
  pha: a.pha,
  visitedBySlugs: a.visitedBy,
  sampleReturnBySlugs: a.sampleReturnBy,
  targetOfSlugs: a.targetOf,
  relatedKeys: a.related,
  highlights: a.highlights,
});

export const asteroids: MinorBodyRecord[] = [
  /* ---------------- Dwarf planets (reused; enriched into populations) ---------------- */
  mk({ slug: "ceres", name: "Ceres", existing: true, dwarf: true, category: "dwarf-planet", designation: "(1) Ceres", discoveredBy: "Giuseppe Piazzi", discoveryYear: "1801", spectral: "C", taxonomy: "carbonaceous", diameterKm: 939, groups: ["main-belt"], visitedBy: ["dawn"], sources: ["nasa", "jpl", "iau"], description: "The largest object in the asteroid belt and the closest dwarf planet to the Sun — the first minor planet discovered, and the only one visited by the Dawn orbiter in the inner Solar System." }),
  mk({ slug: "pluto", name: "Pluto", existing: true, dwarf: true, category: "dwarf-planet", designation: "(134340) Pluto", discoveredBy: "Clyde Tombaugh", discoveryYear: "1930", groups: ["kuiper-belt"], resonance: "neptune-2-3", visitedBy: ["new-horizons"], sources: ["nasa", "jpl", "iau"], description: "The largest and best-known Kuiper Belt object, a dwarf planet locked in a 2:3 mean-motion resonance with Neptune (the archetypal 'plutino'), explored by New Horizons in 2015." }),
  mk({ slug: "haumea", name: "Haumea", existing: true, dwarf: true, category: "trans-neptunian", designation: "(136108) Haumea", discoveryYear: "2004", groups: ["kuiper-belt"], sources: ["nasa", "iau"], description: "A fast-rotating, elongated dwarf planet in the Kuiper Belt, with a ring and two known moons." }),
  mk({ slug: "makemake", name: "Makemake", existing: true, dwarf: true, category: "trans-neptunian", designation: "(136472) Makemake", discoveryYear: "2005", groups: ["kuiper-belt"], sources: ["nasa", "iau"], description: "A bright dwarf planet in the classical Kuiper Belt, one of the largest trans-Neptunian objects." }),
  mk({ slug: "eris", name: "Eris", existing: true, dwarf: true, category: "trans-neptunian", designation: "(136199) Eris", discoveredBy: "Mike Brown, Chad Trujillo, David Rabinowitz", discoveryYear: "2005", groups: ["scattered-disc"], sources: ["nasa", "iau"], description: "The most massive known dwarf planet, a scattered-disc object whose discovery prompted the 2006 redefinition of 'planet'." }),

  /* ---------------- Existing asteroids (reused; enriched) ---------------- */
  mk({ slug: "vesta", name: "4 Vesta", existing: true, category: "main-belt", designation: "(4) Vesta", discoveredBy: "Heinrich Wilhelm Olbers", discoveryYear: "1807", spectral: "V", taxonomy: "basaltic", diameterKm: 525, family: "vesta", groups: ["main-belt"], visitedBy: ["dawn"], sources: ["nasa", "jpl"], description: "The second-most-massive asteroid and the brightest as seen from Earth, a differentiated basaltic body and the parent of the Vesta family, orbited by NASA's Dawn." }),
  mk({ slug: "pallas", name: "2 Pallas", existing: true, category: "main-belt", designation: "(2) Pallas", discoveredBy: "Heinrich Wilhelm Olbers", discoveryYear: "1802", spectral: "B", taxonomy: "carbonaceous", diameterKm: 513, groups: ["main-belt"], sources: ["nasa", "jpl"], description: "The third-most-massive asteroid, on a notably inclined orbit, the second minor planet ever discovered." }),
  mk({ slug: "hygiea", name: "10 Hygiea", existing: true, category: "main-belt", designation: "(10) Hygiea", discoveredBy: "Annibale de Gasparis", discoveryYear: "1849", spectral: "C", taxonomy: "carbonaceous", diameterKm: 434, family: "hygiea", groups: ["main-belt"], sources: ["nasa", "jpl"], description: "The fourth-largest asteroid and the largest carbonaceous one, nearly spherical, the parent of the Hygiea family." }),
  mk({ slug: "psyche", name: "16 Psyche", existing: true, category: "main-belt", designation: "(16) Psyche", discoveredBy: "Annibale de Gasparis", discoveryYear: "1852", spectral: "M", taxonomy: "metallic", diameterKm: 222, groups: ["main-belt"], targetOf: ["psyche"], sources: ["nasa", "jpl"], description: "A large metal-rich main-belt asteroid, the destination of NASA's Psyche mission to study a possible exposed planetary core." }),
  mk({ slug: "bennu", name: "101955 Bennu", existing: true, category: "near-earth", designation: "(101955) Bennu", discoveredBy: "LINEAR survey", discoveryYear: "1999", spectral: "B", taxonomy: "carbonaceous", diameterKm: 0.49, neoClass: "apollo", pha: true, visitedBy: ["osiris-rex"], sampleReturnBy: ["osiris-rex"], sources: ["nasa", "jpl"], description: "A small, carbon-rich near-Earth asteroid sampled by OSIRIS-REx, whose material was returned to Earth in 2023." }),
  mk({ slug: "ryugu", name: "162173 Ryugu", existing: true, category: "near-earth", designation: "(162173) Ryugu", discoveredBy: "LINEAR survey", discoveryYear: "1999", spectral: "C", taxonomy: "carbonaceous", diameterKm: 0.9, neoClass: "apollo", pha: true, visitedBy: ["hayabusa2"], sampleReturnBy: ["hayabusa2"], sources: ["jaxa", "jpl"], description: "A carbonaceous near-Earth asteroid visited by Japan's Hayabusa2, which returned surface and subsurface samples to Earth in 2020." }),
  mk({ slug: "apophis", name: "99942 Apophis", existing: true, category: "near-earth", designation: "(99942) Apophis", discoveryYear: "2004", spectral: "S", taxonomy: "silicaceous", neoClass: "aten", pha: true, sources: ["nasa", "jpl"], description: "A near-Earth asteroid famous for its very close but non-impacting approach to Earth on 13 April 2029; impacts for the foreseeable future have been ruled out by radar and tracking." }),
  mk({ slug: "eros", name: "433 Eros", existing: true, category: "near-earth", designation: "(433) Eros", discoveredBy: "Carl Gustav Witt", discoveryYear: "1898", spectral: "S", taxonomy: "silicaceous", dimensions: "≈ 34 × 11 × 11 km", neoClass: "amor", visitedBy: ["near-shoemaker"], sources: ["nasa", "jpl"], description: "The first near-Earth asteroid discovered and the first to be orbited and landed on — by NASA's NEAR Shoemaker in 2000–2001." }),
  mk({ slug: "itokawa", name: "25143 Itokawa", existing: true, category: "near-earth", designation: "(25143) Itokawa", discoveredBy: "LINEAR survey", discoveryYear: "1998", spectral: "S", taxonomy: "silicaceous", dimensions: "≈ 535 × 294 × 209 m", neoClass: "apollo", visitedBy: ["hayabusa"], sampleReturnBy: ["hayabusa"], sources: ["jaxa", "jpl"], description: "A small stony near-Earth 'rubble-pile' asteroid, the first body from which samples were returned to Earth, by Japan's Hayabusa in 2010." }),
  mk({ slug: "ida", name: "243 Ida", existing: true, category: "main-belt", designation: "(243) Ida", discoveredBy: "Johann Palisa", discoveryYear: "1884", spectral: "S", taxonomy: "silicaceous", dimensions: "≈ 60 × 25 × 19 km", family: "koronis", groups: ["main-belt"], systemType: "binary", moons: ["Dactyl"], visitedBy: ["galileo"], sources: ["nasa", "jpl"], description: "A Koronis-family main-belt asteroid imaged by the Galileo spacecraft in 1993, which revealed its tiny moon Dactyl — the first confirmed asteroid moon." }),

  /* ---------------- Largest main-belt asteroids (new) ---------------- */
  mk({ slug: "interamnia", name: "704 Interamnia", category: "main-belt", designation: "(704) Interamnia", discoveredBy: "Vincenzo Cerulli", discoveryYear: "1910", spectral: "F", taxonomy: "carbonaceous", diameterKm: 332, groups: ["main-belt"], sources: ["nasa", "jpl"], description: "One of the largest main-belt asteroids, a dark, primitive carbonaceous body." }),
  mk({ slug: "europa-asteroid", name: "52 Europa", category: "main-belt", designation: "(52) Europa", discoveredBy: "Hermann Goldschmidt", discoveryYear: "1858", spectral: "C", taxonomy: "carbonaceous", diameterKm: 315, groups: ["main-belt"], alt: ["52 Europa"], sources: ["nasa", "jpl"], description: "One of the largest carbonaceous main-belt asteroids — not to be confused with Jupiter's moon Europa." }),
  mk({ slug: "davida", name: "511 Davida", category: "main-belt", designation: "(511) Davida", discoveredBy: "Raymond Smith Dugan", discoveryYear: "1903", spectral: "C", taxonomy: "carbonaceous", diameterKm: 289, groups: ["main-belt"], sources: ["nasa", "jpl"], description: "One of the largest main-belt asteroids, a dark carbonaceous body." }),
  mk({ slug: "sylvia", name: "87 Sylvia", category: "main-belt", designation: "(87) Sylvia", discoveredBy: "Norman Robert Pogson", discoveryYear: "1866", spectral: "P", taxonomy: "carbonaceous", diameterKm: 253, groups: ["main-belt"], systemType: "triple", moons: ["Romulus", "Remus"], sources: ["nasa", "jpl"], description: "A large outer-main-belt asteroid and the first asteroid found to have two moons — Romulus and Remus — making it the first known triple asteroid system." }),
  mk({ slug: "euphrosyne", name: "31 Euphrosyne", category: "main-belt", designation: "(31) Euphrosyne", discoveredBy: "James Ferguson", discoveryYear: "1854", spectral: "C", taxonomy: "carbonaceous", diameterKm: 256, groups: ["main-belt"], sources: ["nasa", "jpl"], description: "One of the largest asteroids, on a highly inclined orbit, the namesake of the Euphrosyne family." }),
  mk({ slug: "juno", name: "3 Juno", category: "main-belt", designation: "(3) Juno", discoveredBy: "Karl Ludwig Harding", discoveryYear: "1804", spectral: "S", taxonomy: "silicaceous", diameterKm: 233, groups: ["main-belt"], sources: ["nasa", "jpl"], description: "The third asteroid ever discovered, a large stony main-belt body — one of the historic first four minor planets." }),

  /* ---------------- Asteroid-family anchors (new) ---------------- */
  mk({ slug: "eunomia", name: "15 Eunomia", category: "main-belt", designation: "(15) Eunomia", discoveredBy: "Annibale de Gasparis", discoveryYear: "1851", spectral: "S", taxonomy: "silicaceous", diameterKm: 268, family: "eunomia", groups: ["main-belt"], sources: ["nasa", "jpl"], description: "The largest stony (S-type) asteroid and the parent of the Eunomia family in the intermediate main belt." }),
  mk({ slug: "themis", name: "24 Themis", category: "main-belt", designation: "(24) Themis", discoveredBy: "Annibale de Gasparis", discoveryYear: "1853", spectral: "C", taxonomy: "carbonaceous", diameterKm: 198, family: "themis", groups: ["main-belt"], sources: ["nasa", "jpl"], description: "A large carbonaceous outer-main-belt asteroid, parent of the Themis family, on whose surface water ice has been detected." }),
  mk({ slug: "eos", name: "221 Eos", category: "main-belt", designation: "(221) Eos", discoveredBy: "Johann Palisa", discoveryYear: "1882", spectral: "K", taxonomy: "other", diameterKm: 104, family: "eos", groups: ["main-belt"], sources: ["nasa", "jpl"], description: "The parent body of the Eos family, a large K-type asteroid in the outer main belt." }),
  mk({ slug: "flora", name: "8 Flora", category: "main-belt", designation: "(8) Flora", discoveredBy: "John Russell Hind", discoveryYear: "1847", spectral: "S", taxonomy: "silicaceous", diameterKm: 136, family: "flora", groups: ["main-belt"], sources: ["nasa", "jpl"], description: "The parent of the large Flora family of stony asteroids in the inner main belt." }),

  /* ---------------- Dynamical-population anchors (new) ---------------- */
  mk({ slug: "hungaria", name: "434 Hungaria", category: "main-belt", designation: "(434) Hungaria", discoveredBy: "Max Wolf", discoveryYear: "1898", spectral: "E", taxonomy: "other", diameterKm: 11, groups: ["hungaria"], sources: ["nasa", "jpl"], description: "The namesake of the Hungaria group — a dense cluster of small, high-inclination asteroids at the inner edge of the main belt." }),
  mk({ slug: "hilda", name: "153 Hilda", category: "main-belt", designation: "(153) Hilda", discoveredBy: "Johann Palisa", discoveryYear: "1875", spectral: "P", taxonomy: "carbonaceous", diameterKm: 170, groups: ["hilda"], resonance: "jupiter-3-2", sources: ["nasa", "jpl"], description: "The namesake of the Hilda group, whose members orbit in a 3:2 mean-motion resonance with Jupiter in the outer main belt." }),
  mk({ slug: "chiron", name: "2060 Chiron", category: "centaur", designation: "(2060) Chiron", discoveredBy: "Charles Kowal", discoveryYear: "1977", groups: ["centaurs"], sources: ["nasa", "jpl"], alt: ["95P/Chiron"], description: "The first Centaur discovered, orbiting between Saturn and Uranus and showing cometary activity — so it carries both an asteroid and a comet designation." }),
  mk({ slug: "sedna", name: "90377 Sedna", category: "trans-neptunian", designation: "(90377) Sedna", discoveredBy: "Mike Brown, Chad Trujillo, David Rabinowitz", discoveryYear: "2003", groups: ["detached"], sources: ["nasa", "jpl"], description: "A large, extremely distant detached trans-Neptunian object on one of the most elongated known orbits, far beyond the Kuiper Belt." }),
  mk({ slug: "aethra", name: "132 Aethra", category: "main-belt", designation: "(132) Aethra", discoveredBy: "James Craig Watson", discoveryYear: "1873", spectral: "M", taxonomy: "metallic", diameterKm: 42, groups: ["mars-crossers"], sources: ["nasa", "jpl"], description: "The first Mars-crossing asteroid discovered — its orbit crosses that of Mars." }),

  /* ---------------- Jupiter Trojans (new) ---------------- */
  mk({ slug: "achilles", name: "588 Achilles", category: "trojan", designation: "(588) Achilles", discoveredBy: "Max Wolf", discoveryYear: "1906", diameterKm: 130, trojanGroups: ["greek-camp", "jupiter-trojans"], resonance: "jupiter-1-1", sources: ["nasa", "jpl"], description: "The first Jupiter Trojan discovered, leading Jupiter at the L4 Lagrange point in the 'Greek camp'." }),
  mk({ slug: "patroclus", name: "617 Patroclus", category: "trojan", designation: "(617) Patroclus", discoveredBy: "August Kopff", discoveryYear: "1906", diameterKm: 140, trojanGroups: ["trojan-camp", "jupiter-trojans"], resonance: "jupiter-1-1", systemType: "binary", moons: ["Menoetius"], targetOf: ["lucy"], sources: ["nasa", "jpl"], description: "A binary Jupiter Trojan trailing Jupiter at the L5 'Trojan camp', and the final flyby target of NASA's Lucy mission." }),

  /* ---------------- Near-Earth objects (new) ---------------- */
  mk({ slug: "didymos", name: "65803 Didymos", category: "near-earth", designation: "(65803) Didymos", discoveredBy: "Spacewatch", discoveryYear: "1996", spectral: "S", taxonomy: "silicaceous", diameterKm: 0.78, neoClass: "apollo", systemType: "binary", moons: ["Dimorphos"], visitedBy: ["dart"], targetOf: ["hera"], sources: ["nasa", "jpl"], description: "A near-Earth binary asteroid whose small moon, Dimorphos, was struck by NASA's DART in 2022 — humanity's first test of asteroid deflection." }),
  mk({ slug: "dimorphos", name: "Dimorphos", category: "near-earth", designation: "(65803) Didymos I Dimorphos", diameterKm: 0.16, neoClass: "apollo", parentBody: "didymos", systemPrimary: "didymos", visitedBy: ["dart"], targetOf: ["hera"], sources: ["nasa", "jpl"], description: "The small moon of the near-Earth asteroid Didymos and the impact target of NASA's DART mission — the first object whose orbit humans deliberately changed. ESA's Hera will survey the aftermath." }),
  mk({ slug: "toutatis", name: "4179 Toutatis", category: "near-earth", designation: "(4179) Toutatis", discoveredBy: "Christian Pollas", discoveryYear: "1989", spectral: "S", taxonomy: "silicaceous", dimensions: "≈ 4.75 × 2.4 × 1.95 km", neoClass: "apollo", pha: true, groups: ["mars-crossers"], sources: ["nasa", "jpl"], description: "An elongated near-Earth asteroid in a chaotic, tumbling rotation, flown past by China's Chang'e 2 in 2012; it crosses both Earth's and Mars's orbits." }),
  mk({ slug: "geographos", name: "1620 Geographos", category: "near-earth", designation: "(1620) Geographos", discoveredBy: "Albert George Wilson, Rudolph Minkowski", discoveryYear: "1951", spectral: "S", taxonomy: "silicaceous", dimensions: "≈ 5.0 × 2.0 × 2.1 km", neoClass: "apollo", pha: true, sources: ["nasa", "jpl"], description: "One of the most elongated known asteroids, a near-Earth Apollo object well characterised by radar." }),
  mk({ slug: "golevka", name: "6489 Golevka", category: "near-earth", designation: "(6489) Golevka", discoveredBy: "Eleanor Helin", discoveryYear: "1991", diameterKm: 0.53, neoClass: "apollo", sources: ["nasa", "jpl"], description: "A small near-Earth Apollo asteroid on which the Yarkovsky effect — the tiny orbital push from re-radiated sunlight — was first directly measured by radar." }),
  mk({ slug: "atira", name: "163693 Atira", category: "near-earth", designation: "(163693) Atira", discoveredBy: "LINEAR survey", discoveryYear: "2003", neoClass: "atira", sources: ["nasa", "jpl"], description: "The prototype of the Atira class — near-Earth asteroids whose orbits lie entirely inside Earth's orbit — and itself a binary system." }),
];
