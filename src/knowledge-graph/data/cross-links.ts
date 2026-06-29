import type { GraphEntity, GraphRelation } from "@/knowledge-graph/schema";
import { rel } from "@/knowledge-graph/schema";

/**
 * Cross-cutting relations that span the per-area data modules (e.g. a telescope
 * that studies a galaxy defined in another file). Kept here so the area files
 * stay self-contained. Every relation is a well-established scientific fact.
 */
export const entities: GraphEntity[] = [];

export const relations: GraphRelation[] = [
  // Observatories & telescopes studying deep-sky objects (all documented).
  rel("space_telescope:hubble-space-telescope", "studies", "galaxy:andromeda-galaxy", "confirmed", "science"),
  rel("space_telescope:hubble-space-telescope", "studies", "nebula:crab-nebula", "confirmed", "science"),
  rel("space_telescope:hubble-space-telescope", "studies", "nebula:eagle-nebula", "confirmed", "science", {
    note: "Hubble's 1995 image of the Eagle Nebula — the 'Pillars of Creation'.",
  }),
  rel("space_telescope:james-webb-space-telescope", "studies", "nebula:eagle-nebula", "confirmed", "science", {
    note: "Webb re-imaged the Pillars of Creation in infrared.",
  }),
  rel("space_telescope:james-webb-space-telescope", "studies", "nebula:orion-nebula", "confirmed", "science"),
  rel("space_telescope:chandra-x-ray-observatory", "studies", "black_hole:sagittarius-a-star", "confirmed", "science"),
  rel("space_telescope:spitzer-space-telescope", "studies", "galaxy:milky-way", "confirmed", "science", {
    note: "Spitzer's infrared surveys mapped the plane of the Milky Way.",
  }),

  // Discoveries (documented, iconic).
  rel("planet:uranus", "discovered_by", "astronomer:william-herschel", "confirmed", "science", {
    note: "Herschel discovered Uranus in 1781.",
  }),
  rel("moon:io", "discovered_by", "astronomer:galileo-galilei", "confirmed", "science"),
  rel("moon:europa", "discovered_by", "astronomer:galileo-galilei", "confirmed", "science"),
  rel("moon:ganymede", "discovered_by", "astronomer:galileo-galilei", "confirmed", "science"),
  rel("moon:callisto", "discovered_by", "astronomer:galileo-galilei", "confirmed", "science", {
    note: "Galileo discovered the four Galilean moons of Jupiter in 1610.",
  }),
  rel("comet:halleys-comet", "named_after", "astronomer:edmond-halley", "confirmed", "science", {
    note: "Halley computed the comet's orbit and predicted its return.",
  }),

  // Mission targets (documented flyby/orbit/landing destinations).
  rel("space_mission:apollo-11", "mission_target", "moon:the-moon", "confirmed", "science"),
  rel("space_mission:cassini-huygens", "mission_target", "planet:saturn", "confirmed", "science"),
  rel("space_mission:new-horizons", "mission_target", "dwarf_planet:pluto", "confirmed", "science"),
  rel("space_mission:parker-solar-probe", "mission_target", "star:sun", "confirmed", "science"),
  rel("space_mission:voyager-1", "mission_target", "planet:saturn", "confirmed", "science"),
  rel("space_mission:voyager-2", "mission_target", "planet:saturn", "confirmed", "science"),
  rel("space_mission:voyager-2", "mission_target", "planet:uranus", "confirmed", "science"),
  rel("space_mission:voyager-2", "mission_target", "planet:neptune", "confirmed", "science", {
    note: "Voyager 2 is the only spacecraft to visit Uranus and Neptune.",
  }),

  // Galaxy relationships.
  rel("galaxy:andromeda-galaxy", "scientifically_related_to", "galaxy:milky-way", "confirmed", "science", {
    note: "The nearest large galaxy to the Milky Way.",
  }),

  // --- Phase 4: connect remaining objects with well-established facts ---
  rel("galaxy:triangulum-galaxy", "scientifically_related_to", "galaxy:milky-way", "confirmed", "science", { note: "A member of the Local Group with the Milky Way." }),
  rel("galaxy:large-magellanic-cloud", "scientifically_related_to", "galaxy:milky-way", "confirmed", "science", { note: "A satellite galaxy of the Milky Way." }),
  rel("galaxy:small-magellanic-cloud", "scientifically_related_to", "galaxy:milky-way", "confirmed", "science", { note: "A satellite galaxy of the Milky Way." }),
  rel("space_telescope:hubble-space-telescope", "studies", "galaxy:whirlpool-galaxy", "confirmed", "science"),
  rel("space_telescope:hubble-space-telescope", "studies", "galaxy:sombrero-galaxy", "confirmed", "science"),
  rel("space_telescope:hubble-space-telescope", "studies", "nebula:lagoon-nebula", "confirmed", "science"),
  rel("black_hole:m87-star", "scientifically_related_to", "black_hole:sagittarius-a-star", "confirmed", "science", { note: "Both supermassive black holes imaged by the Event Horizon Telescope." }),
  rel("star_cluster:omega-centauri", "part_of", "galaxy:milky-way", "confirmed", "science", { note: "A globular cluster orbiting the Milky Way." }),
  rel("observatory:keck-observatory", "part_of", "observatory:mauna-kea-observatories", "confirmed", "science", { note: "The Keck telescopes sit atop Mauna Kea." }),
  rel("observatory:very-large-array", "studies", "galaxy:milky-way", "confirmed", "science", { note: "Radio surveys of the galaxy." }),
  rel("observatory:alma", "studies", "black_hole:m87-star", "confirmed", "science", { note: "ALMA contributed to the Event Horizon Telescope image of M87*." }),
  rel("observatory:palomar-observatory", "studies", "galaxy:andromeda-galaxy", "confirmed", "science", { note: "Imaged by the 200-inch Hale Telescope." }),
  rel("space_mission:voyager-1", "operated_by", "organization:jpl", "confirmed", "science", { note: "Managed by NASA's Jet Propulsion Laboratory." }),
  rel("space_mission:cassini-huygens", "operated_by", "organization:jpl", "confirmed", "science"),
  rel("space_mission:mars-science-laboratory", "operated_by", "organization:jpl", "confirmed", "science"),
  rel("astronomer:nicolaus-copernicus", "studies", "galaxy:milky-way", "likely", "science", { note: "Proposed the heliocentric model of the Solar System." }),
  rel("meteor_shower:geminids", "associated_with", "constellation:gemini", "confirmed", "science", { note: "Radiant in Gemini." }),
  rel("meteor_shower:leonids", "associated_with", "constellation:leo", "confirmed", "science", { note: "Radiant in Leo." }),
  rel("meteor_shower:quadrantids", "associated_with", "constellation:bootes", "confirmed", "science", { note: "Radiant in northern Boötes." }),
  rel("comet:comet-neowise", "part_of", "location:solar-system", "confirmed", "science"),
  rel("mythology_figure:zeus", "mythologically_linked_to", "mythology_figure:leto", "confirmed", "culture", { note: "In myth, Zeus is the father of Leto's children, Apollo and Artemis." }),
];
