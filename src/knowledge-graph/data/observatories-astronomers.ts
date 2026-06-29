import type { GraphEntity, GraphRelation } from "@/knowledge-graph/schema";
import { rel } from "@/knowledge-graph/schema";

export const entities: GraphEntity[] = [
  // ----------------------------------------------------------- observatories
  {
    id: "observatory:very-large-telescope",
    type: "observatory",
    name: "Very Large Telescope (VLT)",
    domain: "science",
    description:
      "ESO's optical/infrared array of four 8.2-metre telescopes at Cerro Paranal in Chile's Atacama Desert.",
    sources: ["esa"],
  },
  {
    id: "observatory:gemini-observatory",
    type: "observatory",
    name: "Gemini Observatory",
    domain: "science",
    description:
      "A pair of 8.1-metre optical/infrared telescopes, one in Hawaii and one in Chile, giving coverage of both hemispheres.",
    sources: ["nasa"],
  },
  {
    id: "observatory:green-bank-telescope",
    type: "observatory",
    name: "Green Bank Telescope",
    domain: "science",
    description:
      "The world's largest fully steerable radio telescope, a 100-metre dish in Green Bank, West Virginia.",
    sources: ["nasa"],
  },
  {
    id: "observatory:fast",
    type: "observatory",
    name: "FAST (Five-hundred-meter Aperture Spherical Telescope)",
    domain: "science",
    description:
      "The world's largest single-dish radio telescope, a 500-metre aperture instrument in Guizhou, China.",
    sources: ["nasa"],
  },
  {
    id: "observatory:vera-rubin-observatory",
    type: "observatory",
    name: "Vera C. Rubin Observatory",
    domain: "science",
    description:
      "An optical survey observatory in Chile conducting the wide, fast, deep Legacy Survey of Space and Time.",
    sources: ["nasa"],
  },

  // ---------------------------------------------------------- space telescopes
  {
    id: "space_telescope:gaia",
    type: "space_telescope",
    name: "Gaia",
    domain: "science",
    description:
      "An ESA space observatory charting the positions, distances, and motions of nearly two billion stars in the Milky Way.",
    sources: ["esa"],
  },
  {
    id: "space_telescope:nancy-grace-roman",
    type: "space_telescope",
    name: "Nancy Grace Roman Space Telescope",
    domain: "science",
    description:
      "A NASA infrared space telescope designed for wide-field surveys of dark energy and exoplanets.",
    sources: ["nasa"],
  },

  // --------------------------------------------------------------- astronomers
  {
    id: "astronomer:tycho-brahe",
    type: "astronomer",
    name: "Tycho Brahe",
    domain: "science",
    description:
      "A 16th-century Danish astronomer renowned for his exceptionally accurate naked-eye observations of the heavens.",
    sources: ["iau"],
  },
  {
    id: "astronomer:ptolemy",
    type: "astronomer",
    name: "Ptolemy",
    domain: "science",
    description:
      "A Greco-Roman astronomer whose Almagest codified the geocentric model that dominated astronomy for over a millennium.",
    sources: ["iau"],
  },
  {
    id: "astronomer:hipparchus",
    type: "astronomer",
    name: "Hipparchus",
    domain: "science",
    description:
      "An ancient Greek astronomer credited with compiling an early star catalogue and discovering the precession of the equinoxes.",
    sources: ["iau"],
  },
  {
    id: "astronomer:caroline-herschel",
    type: "astronomer",
    name: "Caroline Herschel",
    domain: "science",
    description:
      "A German-British astronomer who discovered several comets and was among the first women paid for scientific work.",
    sources: ["iau"],
  },
  {
    id: "astronomer:henrietta-leavitt",
    type: "astronomer",
    name: "Henrietta Swan Leavitt",
    domain: "science",
    description:
      "An American astronomer whose discovery of the Cepheid period–luminosity relation gave astronomers a way to measure cosmic distances.",
    sources: ["nasa"],
  },
  {
    id: "astronomer:annie-jump-cannon",
    type: "astronomer",
    name: "Annie Jump Cannon",
    domain: "science",
    description:
      "An American astronomer who developed the stellar spectral classification system still in use today.",
    sources: ["nasa"],
  },
  {
    id: "astronomer:vera-rubin",
    type: "astronomer",
    name: "Vera Rubin",
    domain: "science",
    description:
      "An American astronomer whose study of galaxy rotation curves provided strong evidence for dark matter.",
    sources: ["nasa"],
  },
  {
    id: "astronomer:carl-sagan",
    type: "astronomer",
    name: "Carl Sagan",
    domain: "science",
    description:
      "An American astronomer and planetary scientist celebrated for his research and his work communicating science to the public.",
    sources: ["nasa"],
  },
  {
    id: "astronomer:nancy-grace-roman",
    type: "astronomer",
    name: "Nancy Grace Roman",
    domain: "science",
    description:
      "An American astronomer and NASA's first chief of astronomy, often called the 'Mother of Hubble' for her role in space-based astronomy.",
    sources: ["nasa"],
  },
];

export const relations: GraphRelation[] = [
  // ----------------------------------------------------- observatory relations
  rel(
    "observatory:very-large-telescope",
    "studies",
    "galaxy:milky-way",
    "confirmed",
    "science",
  ),
  rel(
    "observatory:gemini-observatory",
    "studies",
    "galaxy:andromeda-galaxy",
    "confirmed",
    "science",
  ),
  rel(
    "observatory:green-bank-telescope",
    "studies",
    "galaxy:milky-way",
    "confirmed",
    "science",
  ),
  rel("observatory:fast", "studies", "galaxy:milky-way", "confirmed", "science"),
  rel(
    "observatory:vera-rubin-observatory",
    "named_after",
    "astronomer:vera-rubin",
    "confirmed",
    "science",
  ),
  rel(
    "observatory:vera-rubin-observatory",
    "studies",
    "galaxy:milky-way",
    "confirmed",
    "science",
  ),

  // -------------------------------------------------- space telescope relations
  rel(
    "space_telescope:gaia",
    "operated_by",
    "organization:esa",
    "confirmed",
    "science",
  ),
  rel(
    "space_telescope:gaia",
    "studies",
    "galaxy:milky-way",
    "confirmed",
    "science",
  ),
  rel(
    "space_telescope:nancy-grace-roman",
    "operated_by",
    "organization:nasa",
    "confirmed",
    "science",
  ),
  rel(
    "space_telescope:nancy-grace-roman",
    "named_after",
    "astronomer:nancy-grace-roman",
    "confirmed",
    "science",
  ),

  // -------------------------------------------------------- astronomer relations
  rel("astronomer:vera-rubin", "studies", "galaxy:milky-way", "likely", "science", {
    note: "Pioneered galaxy rotation and dark-matter evidence.",
  }),
  rel("astronomer:carl-sagan", "studies", "galaxy:milky-way", "likely", "science", {
    note: "Astronomer and science communicator.",
  }),
  rel(
    "astronomer:henrietta-leavitt",
    "studies",
    "galaxy:milky-way",
    "likely",
    "science",
    { note: "Discovered the Cepheid period–luminosity relation." },
  ),
  rel(
    "astronomer:annie-jump-cannon",
    "studies",
    "galaxy:milky-way",
    "likely",
    "science",
    { note: "Developed stellar spectral classification." },
  ),
  rel(
    "astronomer:caroline-herschel",
    "studies",
    "galaxy:milky-way",
    "likely",
    "science",
    { note: "Comet hunter and astronomer." },
  ),
  rel(
    "astronomer:tycho-brahe",
    "studies",
    "galaxy:milky-way",
    "likely",
    "science",
    { note: "Made precise pre-telescopic observations." },
  ),
  rel("astronomer:ptolemy", "studies", "galaxy:milky-way", "likely", "science", {
    note: "Author of the Almagest.",
  }),
  rel(
    "astronomer:hipparchus",
    "studies",
    "galaxy:milky-way",
    "likely",
    "science",
    { note: "Compiled an early star catalogue." },
  ),
  rel(
    "astronomer:nancy-grace-roman",
    "studies",
    "galaxy:milky-way",
    "likely",
    "science",
    { note: "Helped establish space-based astronomy." },
  ),
];
