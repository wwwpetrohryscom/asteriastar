import type { BodyRecord } from "@/knowledge-graph/data/solar-system-catalog/types";

/**
 * Curated Solar System bodies, from established public-domain facts (NASA / JPL /
 * IAU). Conservative: classification, discovery, designation, agency, launch
 * year, mission type, and targets are robust facts; numeric sizes are included
 * only where well-established. Unknown values are omitted, never invented.
 *
 * `enrichmentBodies` attach data to EXISTING graph entities (no new entity is
 * created). `newBodies` create new graph entities and relations.
 */

const S = { nasa: ["nasa", "jpl"] as const, iau: ["nasa", "jpl", "iau"] as const };

export const enrichmentBodies: BodyRecord[] = [
  // The Sun
  { id: "star:sun", kind: "star", name: "The Sun", classification: "G2V main-sequence star (yellow dwarf)", mass1e24Kg: 1989000, radiusKm: 696340, diameterKm: 1391400, meanTemperatureC: 5505, composition: "≈73% hydrogen, 25% helium by mass", sources: [...S.nasa] },

  // Dwarf planets
  { id: "dwarf_planet:ceres", kind: "dwarf-planet", name: "Ceres", classification: "Dwarf planet (asteroid belt)", designation: "(1) Ceres", discoveredBy: "Giuseppe Piazzi", discoveryYear: "1801", diameterKm: 939, radiusKm: 470, parent: "star:sun", sources: [...S.iau] },
  { id: "dwarf_planet:pluto", kind: "dwarf-planet", name: "Pluto", classification: "Dwarf planet (Kuiper belt)", designation: "(134340) Pluto", discoveredBy: "Clyde Tombaugh", discoveryYear: "1930", parent: "star:sun", moonCount: 5, sources: [...S.iau] },
  { id: "dwarf_planet:eris", kind: "dwarf-planet", name: "Eris", classification: "Dwarf planet (scattered disc)", designation: "(136199) Eris", discoveredBy: "M. Brown, C. Trujillo, D. Rabinowitz", discoveryYear: "2005", diameterKm: 2326, parent: "star:sun", moonCount: 1, sources: [...S.iau] },
  { id: "dwarf_planet:haumea", kind: "dwarf-planet", name: "Haumea", classification: "Dwarf planet (Kuiper belt) — elongated", designation: "(136108) Haumea", discoveryYear: "2004", parent: "star:sun", moonCount: 2, hasRingSystem: true, sources: [...S.iau] },
  { id: "dwarf_planet:makemake", kind: "dwarf-planet", name: "Makemake", classification: "Dwarf planet (Kuiper belt)", designation: "(136472) Makemake", discoveredBy: "M. Brown, C. Trujillo, D. Rabinowitz", discoveryYear: "2005", diameterKm: 1430, parent: "star:sun", moonCount: 1, sources: [...S.iau] },

  // Asteroids
  { id: "asteroid:vesta", kind: "asteroid", name: "Vesta", classification: "V-type asteroid (asteroid belt)", designation: "(4) Vesta", discoveredBy: "Heinrich Olbers", discoveryYear: "1807", diameterKm: 525, parent: "star:sun", sources: [...S.nasa] },
  { id: "asteroid:pallas", kind: "asteroid", name: "Pallas", classification: "B-type asteroid (asteroid belt)", designation: "(2) Pallas", discoveredBy: "Heinrich Olbers", discoveryYear: "1802", diameterKm: 513, parent: "star:sun", sources: [...S.nasa] },
  { id: "asteroid:hygiea", kind: "asteroid", name: "Hygiea", classification: "C-type asteroid (asteroid belt)", designation: "(10) Hygiea", discoveredBy: "Annibale de Gasparis", discoveryYear: "1849", diameterKm: 434, parent: "star:sun", sources: [...S.nasa] },
  { id: "asteroid:eros", kind: "asteroid", name: "Eros", classification: "S-type near-Earth asteroid", designation: "(433) Eros", discoveredBy: "Carl Gustav Witt", discoveryYear: "1898", parent: "star:sun", sources: [...S.nasa] },
  { id: "asteroid:psyche", kind: "asteroid", name: "Psyche", classification: "M-type asteroid (asteroid belt)", designation: "(16) Psyche", discoveredBy: "Annibale de Gasparis", discoveryYear: "1852", parent: "star:sun", sources: [...S.nasa] },
  { id: "asteroid:bennu", kind: "asteroid", name: "Bennu", classification: "B-type near-Earth asteroid", designation: "(101955) Bennu", discoveryYear: "1999", parent: "star:sun", sources: [...S.nasa] },
  { id: "asteroid:ryugu", kind: "asteroid", name: "Ryugu", classification: "C-type near-Earth asteroid", designation: "(162173) Ryugu", discoveryYear: "1999", parent: "star:sun", sources: [...S.nasa] },
  { id: "asteroid:itokawa", kind: "asteroid", name: "Itokawa", classification: "S-type near-Earth asteroid", designation: "(25143) Itokawa", discoveryYear: "1998", parent: "star:sun", sources: [...S.nasa] },
  { id: "asteroid:apophis", kind: "asteroid", name: "Apophis", classification: "S-type near-Earth asteroid", designation: "(99942) Apophis", discoveryYear: "2004", parent: "star:sun", sources: [...S.nasa] },

  // Comets
  { id: "comet:halleys-comet", kind: "comet", name: "Halley's Comet", classification: "Periodic comet", designation: "1P/Halley", orbitalPeriodYears: 76, parent: "star:sun", sources: [...S.nasa] },
  { id: "comet:swift-tuttle", kind: "comet", name: "Swift–Tuttle", classification: "Periodic comet", designation: "109P/Swift–Tuttle", orbitalPeriodYears: 133, discoveryYear: "1862", parent: "star:sun", sources: [...S.nasa] },
  { id: "comet:churyumov-gerasimenko", kind: "comet", name: "67P/Churyumov–Gerasimenko", classification: "Periodic comet", designation: "67P/Churyumov–Gerasimenko", orbitalPeriodYears: 6.45, discoveryYear: "1969", parent: "star:sun", sources: [...S.nasa] },
  { id: "comet:hale-bopp", kind: "comet", name: "Hale–Bopp", classification: "Long-period comet", designation: "C/1995 O1 (Hale–Bopp)", discoveryYear: "1995", parent: "star:sun", sources: [...S.nasa] },
  { id: "comet:hyakutake", kind: "comet", name: "Hyakutake", classification: "Long-period comet", designation: "C/1996 B2 (Hyakutake)", discoveryYear: "1996", parent: "star:sun", sources: [...S.nasa] },
  { id: "comet:shoemaker-levy-9", kind: "comet", name: "Shoemaker–Levy 9", classification: "Periodic comet (impacted Jupiter, 1994)", designation: "D/1993 F2", discoveryYear: "1993", parent: "star:sun", sources: [...S.nasa] },
  { id: "comet:comet-neowise", kind: "comet", name: "NEOWISE", classification: "Long-period comet", designation: "C/2020 F3 (NEOWISE)", discoveryYear: "2020", parent: "star:sun", sources: [...S.nasa] },

  // Existing missions (enrich with agency / launch / targets)
  { id: "space_mission:apollo-11", kind: "mission", name: "Apollo 11", classification: "Crewed lunar landing", agency: "NASA", launchYear: "1969", missionType: "crewed landing", targets: ["moon:the-moon"], status: "completed", sources: [...S.nasa] },
  { id: "space_mission:voyager-1", kind: "mission", name: "Voyager 1", classification: "Outer-planet flyby / interstellar", agency: "NASA", launchYear: "1977", missionType: "flyby", targets: ["planet:jupiter", "planet:saturn"], status: "active (interstellar)", sources: [...S.nasa] },
  { id: "space_mission:voyager-2", kind: "mission", name: "Voyager 2", classification: "Grand-tour flyby", agency: "NASA", launchYear: "1977", missionType: "flyby", targets: ["planet:jupiter", "planet:saturn", "planet:uranus", "planet:neptune"], status: "active (interstellar)", sources: [...S.nasa] },
  { id: "space_mission:cassini-huygens", kind: "mission", name: "Cassini–Huygens", classification: "Saturn orbiter", agency: "NASA / ESA", launchYear: "1997", missionType: "orbiter", targets: ["planet:saturn", "moon:titan"], status: "completed (2017)", sources: [...S.nasa] },
  { id: "space_mission:juno", kind: "mission", name: "Juno", classification: "Jupiter orbiter", agency: "NASA", launchYear: "2011", missionType: "orbiter", targets: ["planet:jupiter"], status: "active", sources: [...S.nasa] },
  { id: "space_mission:new-horizons", kind: "mission", name: "New Horizons", classification: "Pluto & Kuiper-belt flyby", agency: "NASA", launchYear: "2006", missionType: "flyby", targets: ["dwarf_planet:pluto"], status: "active", sources: [...S.nasa] },
  { id: "space_mission:parker-solar-probe", kind: "mission", name: "Parker Solar Probe", classification: "Solar probe", agency: "NASA", launchYear: "2018", missionType: "flyby", targets: ["star:sun"], status: "active", sources: [...S.nasa] },
  { id: "space_mission:mars-science-laboratory", kind: "mission", name: "Mars Science Laboratory", classification: "Mars rover mission (Curiosity)", agency: "NASA", launchYear: "2011", missionType: "rover", targets: ["planet:mars"], status: "active", sources: [...S.nasa] },
];

export const newBodies: BodyRecord[] = [
  // Asteroid
  { id: "asteroid:ida", kind: "asteroid", name: "Ida", classification: "S-type asteroid (Koronis family)", designation: "(243) Ida", discoveredBy: "Johann Palisa", discoveryYear: "1884", parent: "star:sun", sources: [...S.nasa] },

  // Comets
  { id: "comet:tempel-1", kind: "comet", name: "Tempel 1", classification: "Periodic comet", designation: "9P/Tempel", orbitalPeriodYears: 5.6, discoveryYear: "1867", parent: "star:sun", sources: [...S.nasa] },
  { id: "comet:borrelly", kind: "comet", name: "Borrelly", classification: "Periodic comet", designation: "19P/Borrelly", orbitalPeriodYears: 6.8, discoveryYear: "1904", parent: "star:sun", sources: [...S.nasa] },
  { id: "comet:wild-2", kind: "comet", name: "Wild 2", classification: "Periodic comet", designation: "81P/Wild", orbitalPeriodYears: 6.4, discoveryYear: "1978", parent: "star:sun", sources: [...S.nasa] },

  // Missions
  { id: "space_mission:galileo", kind: "mission", name: "Galileo", classification: "Jupiter orbiter", agency: "NASA", launchYear: "1989", missionType: "orbiter", targets: ["planet:jupiter", "asteroid:ida"], status: "completed (2003)", sources: [...S.nasa] },
  { id: "space_mission:magellan", kind: "mission", name: "Magellan", classification: "Venus orbiter", agency: "NASA", launchYear: "1989", missionType: "orbiter", targets: ["planet:venus"], status: "completed (1994)", sources: [...S.nasa] },
  { id: "space_mission:messenger", kind: "mission", name: "MESSENGER", classification: "Mercury orbiter", agency: "NASA", launchYear: "2004", missionType: "orbiter", targets: ["planet:mercury"], status: "completed (2015)", sources: [...S.nasa] },
  { id: "space_mission:mariner-10", kind: "mission", name: "Mariner 10", classification: "Venus & Mercury flyby", agency: "NASA", launchYear: "1973", missionType: "flyby", targets: ["planet:venus", "planet:mercury"], status: "completed (1975)", sources: [...S.nasa] },
  { id: "space_mission:viking-1", kind: "mission", name: "Viking 1", classification: "Mars orbiter & lander", agency: "NASA", launchYear: "1975", missionType: "orbiter / lander", targets: ["planet:mars"], status: "completed (1982)", sources: [...S.nasa] },
  { id: "space_mission:mars-express", kind: "mission", name: "Mars Express", classification: "Mars orbiter", agency: "ESA", launchYear: "2003", missionType: "orbiter", targets: ["planet:mars"], status: "active", sources: [...S.nasa] },
  { id: "space_mission:rosetta", kind: "mission", name: "Rosetta", classification: "Comet orbiter & lander", agency: "ESA", launchYear: "2004", missionType: "orbiter / lander", targets: ["comet:churyumov-gerasimenko"], status: "completed (2016)", sources: [...S.nasa] },
  { id: "space_mission:dawn", kind: "mission", name: "Dawn", classification: "Vesta & Ceres orbiter", agency: "NASA", launchYear: "2007", missionType: "orbiter", targets: ["asteroid:vesta", "dwarf_planet:ceres"], status: "completed (2018)", sources: [...S.nasa] },
  { id: "space_mission:solar-orbiter", kind: "mission", name: "Solar Orbiter", classification: "Solar observatory", agency: "ESA / NASA", launchYear: "2020", missionType: "orbiter", targets: ["star:sun"], status: "active", sources: [...S.nasa] },
  { id: "space_mission:mars-2020", kind: "mission", name: "Mars 2020", classification: "Mars rover mission (Perseverance)", agency: "NASA", launchYear: "2020", missionType: "rover", targets: ["planet:mars"], status: "active", sources: [...S.nasa] },
  { id: "space_mission:luna-2", kind: "mission", name: "Luna 2", classification: "First lunar impact", agency: "USSR", launchYear: "1959", missionType: "impactor", targets: ["moon:the-moon"], status: "completed (1959)", sources: [...S.nasa] },

  // Spacecraft
  { id: "spacecraft:curiosity", kind: "spacecraft", name: "Curiosity", classification: "Mars rover", agency: "NASA", launchYear: "2011", missionType: "rover", partOfMission: "space_mission:mars-science-laboratory", landedOn: ["planet:mars"], status: "active", sources: [...S.nasa] },
  { id: "spacecraft:perseverance", kind: "spacecraft", name: "Perseverance", classification: "Mars rover", agency: "NASA", launchYear: "2020", missionType: "rover", partOfMission: "space_mission:mars-2020", landedOn: ["planet:mars"], status: "active", sources: [...S.nasa] },
  { id: "spacecraft:ingenuity", kind: "spacecraft", name: "Ingenuity", classification: "Mars helicopter", agency: "NASA", launchYear: "2020", missionType: "rotorcraft", partOfMission: "space_mission:mars-2020", parent: "planet:mars", status: "completed (2024)", sources: [...S.nasa] },
  { id: "spacecraft:opportunity", kind: "spacecraft", name: "Opportunity", classification: "Mars Exploration Rover (MER-B)", agency: "NASA", launchYear: "2003", missionType: "rover", landedOn: ["planet:mars"], status: "completed (2018)", sources: [...S.nasa] },
  { id: "spacecraft:spirit", kind: "spacecraft", name: "Spirit", classification: "Mars Exploration Rover (MER-A)", agency: "NASA", launchYear: "2003", missionType: "rover", landedOn: ["planet:mars"], status: "completed (2010)", sources: [...S.nasa] },
  { id: "spacecraft:huygens", kind: "spacecraft", name: "Huygens", classification: "Titan lander", agency: "ESA", launchYear: "1997", missionType: "lander", partOfMission: "space_mission:cassini-huygens", landedOn: ["moon:titan"], status: "completed (2005)", sources: [...S.nasa] },

  // Surface features
  { id: "surface_feature:olympus-mons", kind: "surface-feature", name: "Olympus Mons", classification: "Shield volcano — tallest in the Solar System", parent: "planet:mars", sources: [...S.nasa] },
  { id: "surface_feature:valles-marineris", kind: "surface-feature", name: "Valles Marineris", classification: "Canyon system", parent: "planet:mars", sources: [...S.nasa] },
  { id: "surface_feature:tycho-crater", kind: "surface-feature", name: "Tycho", classification: "Lunar impact crater", parent: "moon:the-moon", sources: [...S.nasa] },
  { id: "surface_feature:mare-tranquillitatis", kind: "surface-feature", name: "Mare Tranquillitatis", classification: "Lunar mare (Apollo 11 landing site)", parent: "moon:the-moon", sources: [...S.nasa] },
  { id: "surface_feature:south-pole-aitken-basin", kind: "surface-feature", name: "South Pole–Aitken Basin", classification: "Giant lunar impact basin", parent: "moon:the-moon", sources: [...S.nasa] },
  { id: "surface_feature:great-red-spot", kind: "surface-feature", name: "Great Red Spot", classification: "Persistent anticyclonic storm", parent: "planet:jupiter", sources: [...S.nasa] },
];
