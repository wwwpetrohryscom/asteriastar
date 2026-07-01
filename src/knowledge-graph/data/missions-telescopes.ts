import type { GraphEntity, GraphRelation } from "@/knowledge-graph/schema";
import { rel } from "@/knowledge-graph/schema";

export const entities: GraphEntity[] = [
  // ------------------------------------------------------- space missions
  {
    id: "space_mission:apollo-11",
    type: "space_mission",
    name: "Apollo 11",
    domain: "science",
    description:
      "Apollo 11 was the NASA mission that in July 1969 first landed humans on the Moon, with Neil Armstrong and Buzz Aldrin walking on the lunar surface.",
    entryPath: "/astronomy/space-missions/apollo-11",
    sources: ["nasa"],
  },
  {
    id: "space_mission:voyager-1",
    type: "space_mission",
    name: "Voyager 1",
    domain: "science",
    description:
      "Voyager 1 is a NASA space probe launched in 1977 that explored Jupiter and Saturn and has since become the most distant human-made object, traveling in interstellar space.",
    entryPath: "/astronomy/space-missions/voyager-1",
    sources: ["nasa", "jpl"],
  },
  {
    id: "space_mission:voyager-2",
    type: "space_mission",
    name: "Voyager 2",
    domain: "science",
    description:
      "Voyager 2 is a NASA space probe launched in 1977 and the only spacecraft to have flown past all four giant planets: Jupiter, Saturn, Uranus, and Neptune.",
    entryPath: "/astronomy/space-missions/voyager-2",
    sources: ["nasa", "jpl"],
  },
  {
    id: "space_mission:cassini-huygens",
    type: "space_mission",
    name: "Cassini–Huygens",
    domain: "science",
    description:
      "Cassini–Huygens was a NASA–ESA–ASI mission launched in 1997 that orbited Saturn from 2004 to 2017 and delivered the Huygens probe to the surface of its moon Titan.",
    entryPath: "/astronomy/space-missions/cassini-huygens",
    sources: ["nasa", "esa", "jpl"],
  },
  {
    id: "space_mission:new-horizons",
    type: "space_mission",
    name: "New Horizons",
    domain: "science",
    description:
      "New Horizons is a NASA space probe launched in 2006 that performed the first close flyby of the dwarf planet Pluto in 2015.",
    entryPath: "/astronomy/space-missions/new-horizons",
    sources: ["nasa", "jpl"],
  },
  {
    id: "space_mission:juno",
    type: "space_mission",
    name: "Juno",
    domain: "science",
    description:
      "Juno is a NASA space probe launched in 2011 that entered orbit around Jupiter in 2016 to study the planet's composition, gravity, and magnetic field.",
    entryPath: "/astronomy/space-missions/juno",
    sources: ["nasa", "jpl"],
  },
  {
    id: "space_mission:mars-science-laboratory",
    type: "space_mission",
    name: "Mars Science Laboratory",
    domain: "science",
    description:
      "Mars Science Laboratory is the NASA mission that delivered the Curiosity rover to Mars in 2012 to investigate the planet's climate and geology.",
    entryPath: "/astronomy/space-missions/mars-science-laboratory",
    sources: ["nasa", "jpl"],
  },
  {
    id: "space_mission:parker-solar-probe",
    type: "space_mission",
    name: "Parker Solar Probe",
    domain: "science",
    description:
      "Parker Solar Probe is a NASA spacecraft launched in 2018 to fly through the Sun's outer atmosphere, making the closest approaches to the Sun of any spacecraft.",
    entryPath: "/astronomy/space-missions/parker-solar-probe",
    sources: ["nasa"],
  },

  // ----------------------------------------------------- space telescopes
  {
    id: "space_telescope:spitzer-space-telescope",
    type: "space_telescope",
    name: "Spitzer Space Telescope",
    domain: "science",
    description:
      "The Spitzer Space Telescope was a NASA infrared space observatory operating from 2003 to 2020.",
    entryPath: "/astronomy/space-telescopes/spitzer-space-telescope",
    sources: ["nasa", "jpl"],
  },
  {
    id: "space_telescope:chandra-x-ray-observatory",
    type: "space_telescope",
    name: "Chandra X-ray Observatory",
    domain: "science",
    description:
      "The Chandra X-ray Observatory is a NASA space telescope launched in 1999 that observes the universe in X-ray wavelengths.",
    entryPath: "/astronomy/space-telescopes/chandra-x-ray-observatory",
    sources: ["nasa"],
  },
  {
    id: "space_telescope:kepler-space-telescope",
    type: "space_telescope",
    name: "Kepler Space Telescope",
    domain: "science",
    description:
      "The Kepler Space Telescope was a NASA space observatory launched in 2009 that discovered thousands of exoplanets by monitoring stars for transit dimming.",
    entryPath: "/astronomy/space-telescopes/kepler-space-telescope",
    sources: ["nasa"],
  },
  {
    id: "space_telescope:tess",
    type: "space_telescope",
    name: "TESS",
    domain: "science",
    description:
      "TESS (Transiting Exoplanet Survey Satellite) is a NASA space telescope launched in 2018 that surveys nearby bright stars to detect transiting exoplanets.",
    entryPath: "/astronomy/space-telescopes/tess",
    sources: ["nasa"],
  },

  // --------------------------------------------------------- observatories
  {
    id: "observatory:mauna-kea-observatories",
    type: "observatory",
    name: "Mauna Kea Observatories",
    domain: "science",
    description:
      "The Mauna Kea Observatories are a collection of independent astronomical research facilities located near the summit of Mauna Kea on the island of Hawaii.",
    sources: ["nasa"],
  },
  {
    id: "observatory:keck-observatory",
    type: "observatory",
    name: "W. M. Keck Observatory",
    domain: "science",
    description:
      "The W. M. Keck Observatory is an astronomical observatory on Mauna Kea, Hawaii, operating two of the largest optical and infrared telescopes in the world.",
    sources: ["nasa"],
  },
  {
    id: "observatory:very-large-array",
    type: "observatory",
    name: "Very Large Array",
    domain: "science",
    description:
      "The Very Large Array is a radio astronomy observatory in New Mexico consisting of 27 movable parabolic antennas arranged in a Y-shaped configuration.",
    sources: ["nasa"],
  },
  {
    id: "observatory:alma",
    type: "observatory",
    name: "ALMA (Atacama Large Millimeter Array)",
    domain: "science",
    description:
      "ALMA is an international radio observatory of millimeter and submillimeter antennas located on the Chajnantor plateau in the Atacama Desert of northern Chile.",
    sources: ["esa"],
  },
  {
    id: "observatory:palomar-observatory",
    type: "observatory",
    name: "Palomar Observatory",
    domain: "science",
    description:
      "Palomar Observatory is an astronomical observatory in California, home to the historic 200-inch Hale Telescope.",
    sources: ["nasa"],
  },

  // --------------------------------------------------------- organizations
  {
    id: "organization:jpl",
    type: "organization",
    name: "NASA Jet Propulsion Laboratory",
    domain: "science",
    description:
      "The Jet Propulsion Laboratory is a NASA federally funded research and development center in California that builds and operates robotic spacecraft.",
    sources: ["nasa", "jpl"],
  },
  {
    id: "organization:roscosmos",
    type: "organization",
    name: "Roscosmos",
    domain: "science",
    description:
      "Roscosmos is the state corporation responsible for the space program of the Russian Federation.",
    sources: ["nasa"],
  },
  {
    id: "organization:spacex",
    type: "organization",
    name: "SpaceX",
    domain: "science",
    description:
      "SpaceX is an American aerospace company that designs, manufactures, and launches rockets and spacecraft.",
    sources: ["nasa"],
  },
  {
    id: "organization:isro",
    type: "organization",
    name: "ISRO (Indian Space Research Organisation)",
    domain: "science",
    description:
      "ISRO is the national space agency of India, responsible for the country's space exploration and satellite programs.",
    sources: ["nasa"],
  },

  // ------------------------------------------------------------ astronomers
  {
    id: "astronomer:galileo-galilei",
    entryPath: "/history/galileo-galilei",
    type: "astronomer",
    name: "Galileo Galilei",
    domain: "science",
    description:
      "Galileo Galilei was an Italian astronomer and physicist who pioneered telescopic astronomy, discovering the four largest moons of Jupiter.",
    sources: ["iau"],
  },
  {
    id: "astronomer:edwin-hubble",
    entryPath: "/history/edwin-hubble",
    type: "astronomer",
    name: "Edwin Hubble",
    domain: "science",
    description:
      "Edwin Hubble was an American astronomer whose observations established that the universe is expanding and that galaxies lie far beyond the Milky Way.",
    sources: ["iau"],
  },
  {
    id: "astronomer:nicolaus-copernicus",
    entryPath: "/history/nicolaus-copernicus",
    type: "astronomer",
    name: "Nicolaus Copernicus",
    domain: "science",
    description:
      "Nicolaus Copernicus was a Renaissance astronomer who formulated the heliocentric model placing the Sun at the center of the universe.",
    sources: ["iau"],
  },
  {
    id: "astronomer:johannes-kepler",
    entryPath: "/history/johannes-kepler",
    type: "astronomer",
    name: "Johannes Kepler",
    domain: "science",
    description:
      "Johannes Kepler was a German astronomer who formulated the three laws of planetary motion.",
    sources: ["iau"],
  },
  {
    id: "astronomer:william-herschel",
    entryPath: "/history/william-herschel",
    type: "astronomer",
    name: "William Herschel",
    domain: "science",
    description:
      "William Herschel was a German-British astronomer who discovered the planet Uranus in 1781.",
    sources: ["iau"],
  },
  {
    id: "astronomer:edmond-halley",
    entryPath: "/history/edmond-halley",
    type: "astronomer",
    name: "Edmond Halley",
    domain: "science",
    description:
      "Edmond Halley was an English astronomer who computed the orbit of the comet that now bears his name and predicted its return.",
    sources: ["iau"],
  },
  {
    id: "astronomer:subrahmanyan-chandrasekhar",
    entryPath: "/history/subrahmanyan-chandrasekhar",
    type: "astronomer",
    name: "Subrahmanyan Chandrasekhar",
    domain: "science",
    description:
      "Subrahmanyan Chandrasekhar was an Indian-American astrophysicist known for the Chandrasekhar limit on white dwarf mass, for which he shared the 1983 Nobel Prize in Physics.",
    sources: ["iau"],
  },
];

export const relations: GraphRelation[] = [
  // ----------------------------------------------------------- operated_by
  rel("space_mission:apollo-11", "operated_by", "organization:nasa", "confirmed", "science", {
    sources: ["nasa"],
  }),
  rel("space_mission:voyager-1", "operated_by", "organization:nasa", "confirmed", "science", {
    sources: ["nasa", "jpl"],
  }),
  rel("space_mission:voyager-2", "operated_by", "organization:nasa", "confirmed", "science", {
    sources: ["nasa", "jpl"],
  }),
  rel("space_mission:cassini-huygens", "operated_by", "organization:nasa", "confirmed", "science", {
    note: "Conducted in partnership with ESA and the Italian Space Agency (ASI).",
    sources: ["nasa", "jpl"],
  }),
  rel("space_mission:cassini-huygens", "operated_by", "organization:esa", "confirmed", "science", {
    note: "ESA provided and operated the Huygens probe.",
    sources: ["esa"],
  }),
  rel("space_mission:new-horizons", "operated_by", "organization:nasa", "confirmed", "science", {
    sources: ["nasa", "jpl"],
  }),
  rel("space_mission:juno", "operated_by", "organization:nasa", "confirmed", "science", {
    sources: ["nasa", "jpl"],
  }),
  rel("space_mission:mars-science-laboratory", "operated_by", "organization:nasa", "confirmed", "science", {
    sources: ["nasa", "jpl"],
  }),
  rel("space_mission:parker-solar-probe", "operated_by", "organization:nasa", "confirmed", "science", {
    sources: ["nasa"],
  }),
  rel("space_telescope:spitzer-space-telescope", "operated_by", "organization:nasa", "confirmed", "science", {
    sources: ["nasa", "jpl"],
  }),
  rel("space_telescope:chandra-x-ray-observatory", "operated_by", "organization:nasa", "confirmed", "science", {
    sources: ["nasa"],
  }),
  rel("space_telescope:kepler-space-telescope", "operated_by", "organization:nasa", "confirmed", "science", {
    sources: ["nasa"],
  }),
  rel("space_telescope:tess", "operated_by", "organization:nasa", "confirmed", "science", {
    sources: ["nasa"],
  }),

  // --------------------------------------------------------- mission_target
  rel("space_mission:juno", "mission_target", "planet:jupiter", "confirmed", "science", {
    sources: ["nasa", "jpl"],
  }),
  rel("space_mission:mars-science-laboratory", "mission_target", "planet:mars", "confirmed", "science", {
    sources: ["nasa", "jpl"],
  }),

  // ------------------------------------------------------------ named_after
  rel("space_telescope:kepler-space-telescope", "named_after", "astronomer:johannes-kepler", "confirmed", "science", {
    sources: ["nasa"],
  }),
  rel("space_telescope:hubble-space-telescope", "named_after", "astronomer:edwin-hubble", "confirmed", "science", {
    sources: ["nasa"],
  }),
  rel("space_telescope:chandra-x-ray-observatory", "named_after", "astronomer:subrahmanyan-chandrasekhar", "confirmed", "science", {
    sources: ["nasa"],
  }),
];
