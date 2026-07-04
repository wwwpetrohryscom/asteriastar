import type { AccentToken } from "@/lib/content/types";

/**
 * Learning paths — structured educational journeys through existing content and
 * the knowledge graph. Infrastructure only (no user accounts). Every step links
 * to a real route (entry, guide, topic, or connection page).
 */

export interface LearnStep {
  title: string;
  href: string;
  blurb: string;
}
export type LearnLevel = "Beginner" | "Intermediate" | "Advanced";
export interface LearnStage {
  level: LearnLevel;
  steps: LearnStep[];
}
export interface LearningPath {
  slug: string;
  title: string;
  description: string;
  accent: AccentToken;
  stages: LearnStage[];
  /** Graph entity ids to feature as "related". */
  relatedEntityIds?: string[];
  /** Slugs of recommended next paths. */
  next?: string[];
}

export const LEARNING_PATHS: LearningPath[] = [
  {
    slug: "observing-the-night-sky",
    title: "Observing the Night Sky",
    description: "A practical path to observing — the Moon, planets, meteor showers, eclipses, satellites, and space weather. Each lesson connects to real sky objects and honest, source-backed data (no fabricated live values).",
    accent: "aurora",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "How the night sky changes", href: "/sky/night-sky-tonight", blurb: "Why the sky looks different by the hour, month, and latitude." },
          { title: "Moon phases", href: "/sky/moon", blurb: "The Moon's monthly cycle and what it means for observing." },
          { title: "Planet visibility", href: "/sky/planet-visibility", blurb: "How to tell the wandering planets from the stars." },
          { title: "Meteor showers", href: "/sky/meteor-showers", blurb: "When and where to watch the annual showers." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "Solar eclipses", href: "/sky/eclipses/solar", blurb: "The types — and how to watch the Sun safely." },
          { title: "Lunar eclipses", href: "/sky/eclipses/lunar", blurb: "When the Moon slips into Earth's shadow." },
          { title: "Comets and asteroids", href: "/sky/comets", blurb: "The Solar System's small, unpredictable wanderers." },
          { title: "Satellites and the ISS", href: "/sky/iss-tracker", blurb: "Spotting the space station gliding overhead." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "Aurora and space weather", href: "/sky/aurora", blurb: "How the Sun paints the polar skies." },
          { title: "Light pollution", href: "/sky/night-sky-tonight", blurb: "Why dark skies matter and how to find them." },
          { title: "Observing equipment", href: "/observatories", blurb: "From naked eye to binoculars to telescopes." },
          { title: "Planning an observing night", href: "/sky/observing-calendar", blurb: "Putting Moon, weather, and events together." },
        ],
      },
    ],
    relatedEntityIds: ["moon:the-moon", "meteor_shower:perseids", "satellite:international-space-station", "star:sun"],
    next: ["understanding-stars", "observatories-and-telescopes"],
  },
  {
    slug: "understanding-the-universe",
    title: "Understanding the Universe",
    description: "The scientific story of the cosmos — how it began, how it evolved, and how we know. Each lesson connects to real cosmology entities, with the scientific consensus made explicit.",
    accent: "plasma",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "The Universe", href: "/cosmology/observable-universe", blurb: "What we can see, and how far it reaches." },
          { title: "The Big Bang", href: "/cosmology/the-big-bang", blurb: "How the Universe began 13.8 billion years ago." },
          { title: "Expansion", href: "/cosmology/cosmic-expansion", blurb: "Why space itself is stretching." },
          { title: "Galaxies", href: "/cosmology/structure-formation", blurb: "How gravity built the cosmic web." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "Stars", href: "/cosmology/cosmic-dawn", blurb: "The first stars and how they lit up the cosmos." },
          { title: "Black Holes", href: "/cosmology/black-hole", blurb: "Where gravity wins and light cannot escape." },
          { title: "Dark Matter", href: "/cosmology/dark-matter", blurb: "The unseen mass that shapes galaxies." },
          { title: "Dark Energy", href: "/cosmology/dark-energy", blurb: "The mystery accelerating the expansion." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "Relativity", href: "/cosmology/special-relativity", blurb: "Einstein's foundation for all of cosmology." },
          { title: "Cosmology", href: "/cosmology/lambda-cdm", blurb: "The standard model of the Universe." },
          { title: "Modern Observations", href: "/cosmology/cosmic-microwave-background", blurb: "Reading the oldest light in the Universe." },
          { title: "The Future of the Universe", href: "/cosmology/present-universe", blurb: "Where an accelerating cosmos is heading." },
        ],
      },
    ],
    relatedEntityIds: ["cosmology_concept:the-big-bang", "cosmology_concept:dark-energy", "cosmological_model:lambda-cdm", "astronomical_theory:general-relativity"],
    next: ["history-of-astronomy", "understanding-stars"],
  },
  {
    slug: "history-of-astronomy",
    title: "History of Astronomy",
    description: "How humanity came to understand the universe — from the first sky-watchers to the age of gravitational waves. Each lesson connects to real astronomers, discoveries, and eras in the knowledge graph.",
    accent: "stone",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "Origins", href: "/history/ancient-astronomy", blurb: "Why the first civilizations watched the sky." },
          { title: "Ancient civilizations", href: "/history/discover/ancient-astronomy", blurb: "Babylon, Egypt, China, India, and the Maya." },
          { title: "Greek astronomy", href: "/history/greek-astronomy", blurb: "Making astronomy a geometric science." },
          { title: "The Islamic Golden Age", href: "/history/islamic-golden-age", blurb: "Preserving and transforming the science." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "The Renaissance", href: "/history/renaissance-astronomy", blurb: "Copernicus moves the Earth from the centre." },
          { title: "The Scientific Revolution", href: "/history/scientific-revolution", blurb: "The telescope, Kepler's laws, and Newton." },
          { title: "Modern astronomy", href: "/history/modern-astronomy", blurb: "Spectroscopy reveals what stars are made of." },
          { title: "Galaxies", href: "/history/expansion-of-the-universe", blurb: "Discovering galaxies and the expanding universe." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "Cosmology", href: "/history/big-bang-theory", blurb: "The Big Bang and the cosmic microwave background." },
          { title: "The Space Age", href: "/history/space-age-astronomy", blurb: "Astronomy leaves the atmosphere behind." },
          { title: "Exoplanets", href: "/history/first-exoplanet-sunlike-star", blurb: "The first worlds found around other stars." },
          { title: "The future of astronomy", href: "/history/contemporary-astronomy", blurb: "Gravitational waves, black-hole images, and JWST." },
        ],
      },
    ],
    relatedEntityIds: ["astronomer:galileo-galilei", "astronomer:edwin-hubble", "historical_discovery:gravitational-waves", "astronomy_era:scientific-revolution"],
    next: ["exoplanets", "observatories-and-telescopes"],
  },
  {
    slug: "exoplanets",
    title: "Exoplanets",
    description: "Worlds beyond the Sun — how we find them, what kinds there are, and how scientists weigh whether any could be habitable. Built on real planets and systems from the NASA Exoplanet Archive.",
    accent: "ember",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "What is an exoplanet?", href: "/exoplanets", blurb: "Planets orbiting other stars, as a knowledge graph." },
          { title: "How exoplanets are found", href: "/exoplanets/discover/all-exoplanets", blurb: "The detection methods behind every discovery." },
          { title: "The transit method", href: "/exoplanets/transit", blurb: "Finding planets by the dip in starlight." },
          { title: "Radial velocity", href: "/exoplanets/radial-velocity", blurb: "Weighing planets by their star's wobble." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "Direct imaging", href: "/exoplanets/direct-imaging", blurb: "Taking an actual picture of a planet." },
          { title: "Planetary systems", href: "/exoplanets/discover/multi-planet-systems", blurb: "Stars with families of worlds." },
          { title: "Super-Earths and mini-Neptunes", href: "/exoplanets/super-earth", blurb: "The most common kinds of planet." },
          { title: "Hot Jupiters", href: "/exoplanets/hot-jupiter", blurb: "Giant planets in scorching orbits." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "Habitability and the habitable zone", href: "/exoplanets/discover/potentially-habitable", blurb: "What 'habitable zone' does and doesn't mean." },
          { title: "Atmospheres", href: "/exoplanets/k2-18-b", blurb: "Reading the air of distant worlds." },
          { title: "Exoplanet missions", href: "/exoplanets/discover/kepler-exoplanets", blurb: "The telescopes behind the discoveries." },
          { title: "The search for life", href: "/exoplanets/proxima-centauri-b", blurb: "The nearest potentially habitable world." },
        ],
      },
    ],
    next: ["observatories-and-telescopes", "understanding-stars"],
  },
  {
    slug: "observatories-and-telescopes",
    title: "Observatories & Telescopes",
    description: "How astronomers observe the universe — across every band of light and beyond, from mountaintop optical giants to space telescopes, radio arrays, and gravitational-wave detectors. Built on real observatories, telescopes, and surveys.",
    accent: "halo",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "Why telescopes matter", href: "/observatories", blurb: "How instruments extend human vision into the cosmos." },
          { title: "Light and the electromagnetic spectrum", href: "/observatories/visible-light", blurb: "The bands of light astronomers observe." },
          { title: "Optical telescopes", href: "/observatories/discover/optical-telescopes", blurb: "Gathering visible light with mirrors." },
          { title: "Radio astronomy", href: "/observatories/discover/radio-telescopes", blurb: "Listening to the radio universe." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "Space telescopes", href: "/observatories/discover/space-telescopes", blurb: "Observing from above the atmosphere." },
          { title: "Infrared astronomy", href: "/observatories/discover/infrared-telescopes", blurb: "Seeing heat and the hidden universe." },
          { title: "X-ray and gamma-ray astronomy", href: "/observatories/discover/x-ray-telescopes", blurb: "The high-energy cosmos." },
          { title: "Survey astronomy", href: "/observatories/discover/sky-surveys", blurb: "Mapping the whole sky." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "Interferometry", href: "/observatories/alma", blurb: "Combining telescopes for sharper vision." },
          { title: "Detectors and instruments", href: "/observatories/discover/astronomical-instruments", blurb: "The cameras and spectrographs behind the science." },
          { title: "Gravitational-wave astronomy", href: "/observatories/discover/gravitational-wave-observatories", blurb: "Sensing ripples in spacetime." },
          { title: "Multi-messenger astronomy", href: "/observatories/discover/multi-messenger-astronomy", blurb: "Combining light, waves, and particles." },
        ],
      },
    ],
    next: ["human-spaceflight", "history-of-space-exploration"],
  },
  {
    slug: "human-spaceflight",
    title: "Human Spaceflight",
    description: "How humans travel, live, and work in space — from the first orbits to space stations, spacewalks, and the road back to the Moon. Built on real missions, stations, spacecraft, and astronauts.",
    accent: "aurora",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "What is human spaceflight?", href: "/human-spaceflight", blurb: "Stations, spacecraft, crews, and spacewalks as a knowledge graph." },
          { title: "First humans in space", href: "/exploration/vostok-1", blurb: "Yuri Gagarin and the first orbit of the Earth." },
          { title: "Spacecraft for humans", href: "/human-spaceflight/discover/crewed-spacecraft", blurb: "The vehicles built to carry people." },
          { title: "Space stations", href: "/human-spaceflight/discover/all-space-stations", blurb: "From Salyut to the ISS and Tiangong." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "Living in orbit", href: "/human-spaceflight/international-space-station", blurb: "Life aboard the International Space Station." },
          { title: "Spacewalks", href: "/human-spaceflight/discover/evas-and-spacewalks", blurb: "Working outside the spacecraft." },
          { title: "Docking and resupply", href: "/human-spaceflight/discover/cargo-spacecraft", blurb: "Keeping a station stocked and crewed." },
          { title: "Space medicine", href: "/human-spaceflight/discover/space-station-science", blurb: "How the body adapts to weightlessness." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "Scientific research in orbit", href: "/human-spaceflight/nasa-twins-study", blurb: "What we learn from microgravity laboratories." },
          { title: "Commercial crew", href: "/human-spaceflight/discover/commercial-crew", blurb: "Crew Dragon, Starliner, and a new era of access." },
          { title: "Lunar human spaceflight", href: "/human-spaceflight/discover/lunar-human-spaceflight", blurb: "Apollo, Artemis, and the Lunar Gateway." },
          { title: "Future human exploration", href: "/human-spaceflight/lunar-gateway", blurb: "Stations and crews beyond low Earth orbit." },
        ],
      },
    ],
    next: ["history-of-space-exploration", "the-solar-system"],
  },
  {
    slug: "history-of-space-exploration",
    title: "History of Space Exploration",
    description: "From Sputnik to Mars rovers and the James Webb Space Telescope — how humanity learned to reach into space, told through real missions, spacecraft, agencies, and the people who flew. Built on authoritative public sources.",
    accent: "comet",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "What is space exploration?", href: "/exploration", blurb: "Missions, spacecraft, agencies, and astronauts as a knowledge graph." },
          { title: "Historic missions", href: "/exploration/discover/historic-missions", blurb: "The pioneering missions of the early Space Age." },
          { title: "Human spaceflight", href: "/exploration/discover/human-spaceflight", blurb: "From Gagarin to the Moon landings." },
          { title: "Space agencies", href: "/exploration/discover/space-agencies", blurb: "Who explores space, and how." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "Planetary exploration: the Moon", href: "/exploration/discover/moon-missions", blurb: "Every mission to Earth's Moon." },
          { title: "Planetary exploration: Mars", href: "/exploration/discover/mars-missions", blurb: "Orbiters, landers, and rovers at Mars." },
          { title: "Launch vehicles", href: "/exploration/discover/launch-vehicles", blurb: "The rockets that make it all possible." },
          { title: "Spacecraft", href: "/exploration/discover/spacecraft", blurb: "Rovers, landers, and probes." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "Deep space missions", href: "/exploration/discover/deep-space-missions", blurb: "To the outer planets and interstellar space." },
          { title: "Sample return missions", href: "/exploration/discover/sample-return-missions", blurb: "Bringing other worlds back to Earth." },
          { title: "Scientific instruments", href: "/exploration/discover/scientific-instruments", blurb: "The cameras and spectrometers that gather the data." },
          { title: "Mission programs", href: "/exploration/discover/mission-programs", blurb: "Apollo, Voyager, Artemis, and more." },
        ],
      },
    ],
    next: ["learn-space-exploration", "the-solar-system"],
  },
  {
    slug: "deep-sky-and-galaxies",
    title: "Deep Sky & Galaxies",
    description: "A guided tour beyond the Solar System — galaxies, nebulae, and star clusters from the Messier, Caldwell, and NGC/IC catalogues, with practical guidance on observing each one. Built on real OpenNGC catalogue data.",
    accent: "plasma",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "What are deep-sky objects?", href: "/deep-sky", blurb: "Galaxies, nebulae, and clusters beyond the Solar System." },
          { title: "The Messier catalogue", href: "/deep-sky/discover/messier-objects", blurb: "The classic list of bright deep-sky objects." },
          { title: "Bright objects to start with", href: "/deep-sky/discover/bright-deep-sky", blurb: "The easiest targets, magnitude 7 and brighter." },
          { title: "Beginner targets", href: "/deep-sky/discover/beginner-targets", blurb: "Naked-eye, binocular, and small-telescope objects." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "Types of galaxies", href: "/deep-sky/discover/all-galaxies", blurb: "Spiral, barred, elliptical, and lenticular galaxies." },
          { title: "Nebulae", href: "/deep-sky/discover/all-nebulae", blurb: "Emission, reflection, and planetary nebulae." },
          { title: "Open clusters", href: "/deep-sky/discover/open-clusters", blurb: "Loose groups of young stars in the galactic disc." },
          { title: "Globular clusters", href: "/deep-sky/discover/globular-clusters", blurb: "Ancient spherical swarms of hundreds of thousands of stars." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "The Caldwell catalogue", href: "/deep-sky/discover/caldwell-objects", blurb: "Bright objects Messier left out." },
          { title: "Planetary nebulae", href: "/deep-sky/discover/planetary-nebulae", blurb: "Shells cast off by dying Sun-like stars." },
          { title: "Supernova remnants", href: "/deep-sky/discover/supernova-remnants", blurb: "The expanding debris of exploded stars." },
          { title: "Advanced targets", href: "/deep-sky/discover/advanced-targets", blurb: "Faint objects for larger telescopes and dark skies." },
        ],
      },
    ],
    next: ["learn-galaxies", "understanding-stars"],
  },
  {
    slug: "the-solar-system",
    title: "The Solar System",
    description: "A guided tour of the Sun and the worlds that orbit it — planets, moons, small bodies, and the missions that explore them, all built on real NASA data.",
    accent: "halo",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "What is the Solar System?", href: "/solar-system", blurb: "The Sun and everything gravitationally bound to it." },
          { title: "The eight planets", href: "/solar-system/discover/all-planets", blurb: "From Mercury to Neptune, in order from the Sun." },
          { title: "The inner, rocky planets", href: "/solar-system/discover/inner-planets", blurb: "Mercury, Venus, Earth, and Mars." },
          { title: "Earth's Moon", href: "/solar-system/the-moon", blurb: "Our nearest neighbour in space." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "Gas giants", href: "/solar-system/discover/gas-giants", blurb: "Jupiter and Saturn — the largest planets." },
          { title: "Ice giants", href: "/solar-system/discover/ice-giants", blurb: "Uranus and Neptune." },
          { title: "Moons of the planets", href: "/solar-system/discover/natural-satellites", blurb: "From tiny Phobos to giant Ganymede." },
          { title: "Dwarf planets", href: "/solar-system/discover/dwarf-planets", blurb: "Pluto, Ceres, Eris, Haumea, and Makemake." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "Asteroids", href: "/solar-system/discover/asteroids", blurb: "Rocky remnants of the early Solar System." },
          { title: "Comets", href: "/solar-system/discover/comets", blurb: "Icy visitors from the outer Solar System." },
          { title: "Planetary missions", href: "/solar-system/discover/planetary-missions", blurb: "How we explore other worlds." },
          { title: "Mars — a world explored", href: "/solar-system/mars", blurb: "The most-visited planet beyond Earth." },
        ],
      },
    ],
    next: ["understanding-stars"],
  },
  {
    slug: "understanding-stars",
    title: "Understanding Stars",
    description: "From what a star is to how stars live and die — a guided path through the star encyclopedia, built on real catalogue data.",
    accent: "nebula",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "What is a star?", href: "/stars", blurb: "Meet the star encyclopedia: thousands of real stars, each a first-class entity." },
          { title: "Spectral classes & colour", href: "/stars/type/main-sequence", blurb: "Why stars range from blue to red, and what their spectra reveal." },
          { title: "Brightness & magnitude", href: "/stars/discover/brightest", blurb: "Apparent vs absolute magnitude, and the brightest stars in our sky." },
          { title: "Distance & the nearest stars", href: "/stars/discover/nearest", blurb: "How we measure stellar distances — and our closest neighbours." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "Yellow dwarfs like the Sun", href: "/stars/type/yellow-dwarf", blurb: "Main-sequence G stars and how the Sun fits in." },
          { title: "Red dwarfs", href: "/stars/type/red-dwarf", blurb: "The galaxy's most common and longest-lived stars." },
          { title: "Binary & multiple systems", href: "/stars/discover/multiple", blurb: "Most stars are not alone — how systems form and orbit." },
          { title: "Variable stars", href: "/stars/discover/variable", blurb: "Stars whose brightness changes, and why." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "Giants & subgiants", href: "/stars/type/red-giant", blurb: "What happens when a star leaves the main sequence." },
          { title: "Supergiants & the largest stars", href: "/stars/type/red-supergiant", blurb: "Colossal evolved stars and the precursors of supernovae." },
          { title: "Blue supergiants & Wolf-Rayet stars", href: "/stars/type/blue-supergiant", blurb: "The hottest, most massive, most luminous stars." },
          { title: "White dwarfs — stellar remnants", href: "/stars/type/white-dwarf", blurb: "The dense cores left when Sun-like stars die." },
        ],
      },
    ],
    next: ["learn-astronomy"],
  },
  {
    slug: "learn-astronomy",
    title: "Learn Astronomy",
    description: "A guided journey from looking up to understanding the universe.",
    accent: "nebula",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "Beginner Astronomy", href: "/guides/beginner-astronomy", blurb: "Start here — the essentials of looking up." },
          { title: "What is a star?", href: "/encyclopedia/glossary/star", blurb: "The most fundamental object in the sky." },
          { title: "Explore the Solar System", href: "/connections/the-solar-system", blurb: "The Sun, planets, and dwarf planets." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "How stars form", href: "/guides/how-stars-form", blurb: "From cold gas clouds to shining stars." },
          { title: "Explore galaxies", href: "/explore/galaxies", blurb: "Island universes of stars and gas." },
          { title: "Light-years & distance", href: "/encyclopedia/glossary/light-year", blurb: "How we measure the cosmos." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "How black holes work", href: "/guides/how-black-holes-work", blurb: "Gravity, event horizons, and what falls in." },
          { title: "Explore deep sky", href: "/explore/deep-sky", blurb: "Galaxies, nebulae, clusters, and black holes." },
          { title: "Advanced astronomy", href: "/guides/advanced-astronomy", blurb: "Deeper concepts and methods." },
        ],
      },
    ],
    relatedEntityIds: ["star:sun", "galaxy:milky-way", "planet:earth"],
    next: ["learn-stars", "learn-galaxies", "learn-telescopes"],
  },
  {
    slug: "learn-stars",
    title: "Learn Stars",
    description: "From the Sun to supergiants — how stars live, shine, and die.",
    accent: "nebula",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "What is a star?", href: "/encyclopedia/glossary/star", blurb: "A self-gravitating sphere of plasma." },
          { title: "Sirius", href: "/astronomy/stars/sirius", blurb: "The brightest star in the night sky." },
          { title: "Explore stars", href: "/explore/stars", blurb: "Browse named stars in the graph." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "How stars form", href: "/guides/how-stars-form", blurb: "Gravitational collapse to fusion." },
          { title: "Betelgeuse", href: "/astronomy/stars/betelgeuse", blurb: "A red supergiant nearing its end." },
          { title: "Stars in Orion", href: "/connections/stars-in-orion", blurb: "The stars of a famous constellation." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "Supernovae", href: "/astronomy/supernovae", blurb: "The explosive deaths of stars." },
          { title: "Exoplanets", href: "/explore/exoplanets", blurb: "Worlds orbiting other stars." },
          { title: "Black holes", href: "/explore/black-holes", blurb: "What some massive stars leave behind." },
        ],
      },
    ],
    relatedEntityIds: ["star:sirius", "star:betelgeuse", "star:proxima-centauri"],
    next: ["learn-galaxies", "learn-black-holes"],
  },
  {
    slug: "learn-space-exploration",
    title: "Learn Space Exploration",
    description: "Humanity's journey beyond Earth — missions, vehicles, and agencies.",
    accent: "halo",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "Apollo 11", href: "/astronomy/space-missions/apollo-11", blurb: "The first crewed Moon landing." },
          { title: "Explore missions", href: "/explore/missions", blurb: "Landmark missions of exploration." },
          { title: "Space agencies", href: "/explore/space-agencies", blurb: "Who explores space." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "Voyager 1", href: "/astronomy/space-missions/voyager-1", blurb: "Now in interstellar space." },
          { title: "Launch vehicles", href: "/explore/launch-vehicles", blurb: "The rockets that get us there." },
          { title: "Missions to Mars", href: "/connections/missions-to-mars", blurb: "Spacecraft sent to the Red Planet." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "Cassini–Huygens", href: "/astronomy/space-missions/cassini-huygens", blurb: "Years at Saturn." },
          { title: "Space exploration history", href: "/encyclopedia/space-exploration", blurb: "The story of reaching into space." },
          { title: "Parker Solar Probe", href: "/astronomy/space-missions/parker-solar-probe", blurb: "Flying through the Sun's corona." },
        ],
      },
    ],
    relatedEntityIds: ["space_mission:apollo-11", "space_mission:voyager-1", "satellite:international-space-station"],
    next: ["learn-telescopes", "learn-astronomy"],
  },
  {
    slug: "learn-galaxies",
    title: "Learn Galaxies",
    description: "From the Milky Way to the deep field — the great systems of stars.",
    accent: "nebula",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "What is a galaxy?", href: "/encyclopedia/glossary/galaxy", blurb: "A gravitationally bound system of stars." },
          { title: "Explore galaxies", href: "/explore/galaxies", blurb: "Browse galaxies in the graph." },
          { title: "Galaxy vs nebula", href: "/compare/galaxy-vs-nebula", blurb: "Two different deep-sky objects." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "Deep-sky objects", href: "/connections/deep-sky-objects", blurb: "Galaxies, nebulae, and clusters." },
          { title: "Messier objects", href: "/connections/messier-objects", blurb: "The classic deep-sky catalogue." },
          { title: "Observed by James Webb", href: "/connections/galaxies-observed-by-james-webb", blurb: "What Webb studies." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "Black holes", href: "/explore/black-holes", blurb: "The engines at galactic centers." },
          { title: "Explore deep sky", href: "/explore/deep-sky", blurb: "The objects beyond the Solar System." },
          { title: "Quasars", href: "/astronomy/quasars", blurb: "Brilliant active galactic nuclei." },
        ],
      },
    ],
    relatedEntityIds: ["galaxy:milky-way", "galaxy:andromeda-galaxy", "black_hole:sagittarius-a-star"],
    next: ["learn-black-holes", "learn-telescopes"],
  },
  {
    slug: "learn-black-holes",
    title: "Learn Black Holes",
    description: "Gravity at its most extreme — event horizons and the unseen.",
    accent: "nebula",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "What is a black hole?", href: "/encyclopedia/glossary/black-hole", blurb: "Where light cannot escape." },
          { title: "How black holes work", href: "/guides/how-black-holes-work", blurb: "Event horizons and growth." },
          { title: "Explore black holes", href: "/explore/black-holes", blurb: "Black holes in the graph." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "Supernovae", href: "/astronomy/supernovae", blurb: "How massive stars end." },
          { title: "Chandra X-ray Observatory", href: "/astronomy/space-telescopes/chandra-x-ray-observatory", blurb: "Seeing the high-energy universe." },
          { title: "Deep-sky objects", href: "/connections/deep-sky-objects", blurb: "Where black holes live." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "Pulsars", href: "/astronomy/pulsars", blurb: "Other dense stellar remnants." },
          { title: "Quasars", href: "/astronomy/quasars", blurb: "Supermassive black holes at work." },
          { title: "Galaxies", href: "/explore/galaxies", blurb: "Black holes anchor galactic centers." },
        ],
      },
    ],
    relatedEntityIds: ["black_hole:sagittarius-a-star", "black_hole:m87-star"],
    next: ["learn-galaxies", "learn-stars"],
  },
  {
    slug: "learn-telescopes",
    title: "Learn Telescopes",
    description: "How we see farther — from backyard optics to orbiting observatories.",
    accent: "halo",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "How telescopes work", href: "/guides/how-telescopes-work", blurb: "Collecting and focusing light." },
          { title: "Explore telescopes", href: "/explore/telescopes", blurb: "Space telescopes in the graph." },
          { title: "Hubble", href: "/astronomy/space-telescopes/hubble-space-telescope", blurb: "The iconic optical observatory." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "James Webb", href: "/astronomy/space-telescopes/james-webb-space-telescope", blurb: "The great infrared observatory." },
          { title: "JWST vs Hubble", href: "/compare/jwst-vs-hubble", blurb: "Two observatories compared." },
          { title: "Observatories", href: "/explore/observatories", blurb: "Ground-based facilities." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "Chandra X-ray Observatory", href: "/astronomy/space-telescopes/chandra-x-ray-observatory", blurb: "The X-ray universe." },
          { title: "Observed by James Webb", href: "/connections/galaxies-observed-by-james-webb", blurb: "What Webb has studied." },
          { title: "TESS", href: "/astronomy/space-telescopes/tess", blurb: "An all-sky exoplanet hunter." },
        ],
      },
    ],
    relatedEntityIds: ["space_telescope:hubble-space-telescope", "space_telescope:james-webb-space-telescope"],
    next: ["learn-galaxies", "learn-space-exploration"],
  },
  {
    slug: "learn-night-sky",
    title: "Learn the Night Sky",
    description: "Find your way around the sky — constellations, planets, and events.",
    accent: "aurora",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "How to observe the night sky", href: "/guides/how-to-observe-the-night-sky", blurb: "Practical stargazing skills." },
          { title: "Sky Tonight", href: "/sky-guide/night-sky-tonight", blurb: "What's visible after dark." },
          { title: "Explore constellations", href: "/explore/constellations", blurb: "The patterns of the sky." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "Moon phases", href: "/sky-guide/moon-phase", blurb: "The Moon's monthly cycle." },
          { title: "Meteor showers", href: "/sky-guide/meteor-showers", blurb: "When Earth meets cometary dust." },
          { title: "Planet visibility", href: "/sky-guide/planet-visibility", blurb: "Where the planets are." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "Solar eclipses", href: "/sky-guide/solar-eclipses", blurb: "When the Moon hides the Sun." },
          { title: "Night sky objects", href: "/explore/night-sky", blurb: "Showers, comets, and bright constellations." },
          { title: "Celestial events", href: "/sky-guide/celestial-events", blurb: "The events worth looking up for." },
        ],
      },
    ],
    relatedEntityIds: ["constellation:orion", "meteor_shower:perseids"],
    next: ["learn-astrophotography", "learn-astronomy"],
  },
  {
    slug: "learn-astrophotography",
    title: "Learn Astrophotography",
    description: "Capturing the sky — the targets and the craft.",
    accent: "halo",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "Observe the night sky", href: "/guides/how-to-observe-the-night-sky", blurb: "Know the sky before you shoot it." },
          { title: "The Moon", href: "/sky-guide/moon-phase", blurb: "The best first target." },
          { title: "Explore constellations", href: "/explore/constellations", blurb: "Wide-field starting points." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "Nebulae", href: "/explore/nebulae", blurb: "Colorful deep-sky targets." },
          { title: "Messier objects", href: "/connections/messier-objects", blurb: "A classic target list." },
          { title: "Image Library", href: "/observatory/image-library", blurb: "Openly licensed reference imagery." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "Galaxies", href: "/explore/galaxies", blurb: "Faint, rewarding deep-sky targets." },
          { title: "Advanced astronomy", href: "/guides/advanced-astronomy", blurb: "Techniques and methods." },
          { title: "Deep sky", href: "/explore/deep-sky", blurb: "The full deep-sky catalogue." },
        ],
      },
    ],
    relatedEntityIds: ["nebula:orion-nebula", "star_cluster:pleiades"],
    next: ["learn-night-sky", "learn-telescopes"],
  },
  {
    slug: "learn-greek-sky-mythology",
    title: "Learn Greek Sky Mythology",
    description: "The myths behind the constellations — cultural heritage, not science.",
    accent: "ember",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "Greek mythology", href: "/encyclopedia/greek-mythology", blurb: "The myths behind the names." },
          { title: "Orion", href: "/encyclopedia/greek-mythology/orion", blurb: "The giant huntsman." },
          { title: "Explore mythology", href: "/explore/mythology", blurb: "Figures of the sky in the graph." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "Perseus", href: "/encyclopedia/greek-mythology/perseus", blurb: "Hero of the Andromeda myth." },
          { title: "The Pleiades", href: "/encyclopedia/greek-mythology/pleiades", blurb: "The Seven Sisters." },
          { title: "Greek mythology of the sky", href: "/connections/greek-mythology-of-the-sky", blurb: "Figures linked to constellations." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "Asteria", href: "/encyclopedia/greek-mythology/asteria", blurb: "Titaness of the starry night." },
          { title: "History of astronomy", href: "/encyclopedia/history-of-astronomy", blurb: "From myth to measurement." },
          { title: "Constellations", href: "/explore/constellations", blurb: "The modern sky regions." },
        ],
      },
    ],
    relatedEntityIds: ["mythology_figure:orion", "mythology_figure:perseus", "mythology_figure:asteria"],
    next: ["learn-night-sky", "learn-astronomy"],
  },
  {
    slug: "understanding-launch-vehicles",
    title: "Understanding Launch Vehicles",
    description: "How rockets reach orbit — twelve steps through fundamentals, stages, engines, propellants, human-rating, reusability, and the future of space transportation. Built on real launch-vehicle data; no fabricated performance figures.",
    accent: "comet",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "Rocket fundamentals", href: "/rockets", blurb: "What a launch vehicle is, and how thrust overcomes gravity and drag to reach orbit." },
          { title: "Escape velocity", href: "/rockets/discover/super-heavy-lift", blurb: "The energy needed to leave orbit for the Moon and beyond — the domain of the most powerful rockets." },
          { title: "Rocket stages", href: "/rockets/discover/rocket-stages", blurb: "Why rockets shed mass in stages — boosters, cores, and upper stages." },
          { title: "Rocket engines", href: "/rockets/discover/rocket-engines", blurb: "How engines turn propellant into thrust, and the combustion cycles they use." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "Propellants", href: "/rockets/discover/propellants", blurb: "Kerolox, hydrolox, methalox, hypergolics, and solids — the trade-offs of each." },
          { title: "Guidance", href: "/rockets/falcon-9", blurb: "How a modern rocket steers itself to orbit — and, for Falcon 9, back to a landing." },
          { title: "Payload fairings", href: "/rockets/ariane-5", blurb: "The nose cone that protects the payload through the atmosphere, seen on the large Ariane 5." },
          { title: "Human-rated systems", href: "/rockets/discover/human-rated-rockets", blurb: "What it takes to certify a rocket to carry crews safely." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "Reusability", href: "/rockets/discover/reusable-rockets", blurb: "Recovering and re-flying hardware, from the Space Shuttle to Falcon 9 and Starship." },
          { title: "Heavy lift", href: "/rockets/discover/heavy-lift", blurb: "The vehicles that place 20+ tonnes into low Earth orbit." },
          { title: "Deep-space launch", href: "/rockets/saturn-v", blurb: "Sending payloads to the Moon and planets — the Saturn V and its super-heavy successors." },
          { title: "Future transportation", href: "/rockets/discover/future-rockets", blurb: "Fully reusable and next-generation vehicles now in development." },
        ],
      },
    ],
    relatedEntityIds: ["launch_vehicle:falcon-9", "rocket_engine:merlin-1d", "rocket_family:falcon", "launch_vehicle:saturn-v"],
    next: ["history-of-space-exploration", "human-spaceflight"],
  },
  {
    slug: "understanding-constellations",
    title: "Understanding Constellations",
    description: "Learn to read the night sky — the celestial sphere and coordinates, the zodiac, the seasonal and circumpolar sky, star designations, and how to find and star-hop between the 88 constellations. Built on real IAU constellation data.",
    accent: "nebula",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "The celestial sphere", href: "/constellations", blurb: "How the 88 constellations partition the whole sky into a single map." },
          { title: "Right ascension", href: "/constellations/discover/all-constellations", blurb: "The sky's longitude, measured in hours eastward around the celestial equator." },
          { title: "Declination", href: "/constellations/region/northern", blurb: "The sky's latitude — how far north or south of the celestial equator an object lies." },
          { title: "Finding constellations", href: "/constellations/discover/beginner-constellations", blurb: "Start with the brightest, easiest patterns and work outward." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "Circumpolar constellations", href: "/constellations/ursa-minor", blurb: "The constellations that never set from your latitude, circling the celestial pole around Polaris." },
          { title: "The zodiac", href: "/constellations/discover/zodiac", blurb: "The twelve constellations the Sun, Moon, and planets travel through along the ecliptic." },
          { title: "The seasonal sky", href: "/constellations/season/winter", blurb: "Why different constellations dominate the evening sky each season." },
          { title: "Bayer designations", href: "/constellations/orion", blurb: "Greek letters (α, β, γ…) that name the brightest stars within each constellation." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "Flamsteed designations", href: "/stars", blurb: "The numbered star designations that complement the Greek-letter Bayer names." },
          { title: "Deep-sky navigation", href: "/constellations/discover/messier-rich-constellations", blurb: "Use bright constellations as signposts to galaxies, nebulae, and clusters." },
          { title: "Star hopping", href: "/constellations/ursa-major", blurb: "Following chains of stars — like the Big Dipper's pointers to Polaris — to find fainter targets." },
          { title: "Planning observations", href: "/sky/night-sky-tonight", blurb: "Combine constellation knowledge with the computed Tonight dashboard for your location." },
        ],
      },
    ],
    relatedEntityIds: ["constellation:orion", "constellation:ursa-major", "constellation:cygnus", "constellation_family:zodiacal"],
    next: ["observing-the-night-sky", "understanding-stars"],
  },
  {
    slug: "understanding-satellites",
    title: "Understanding Artificial Satellites",
    description: "How the satellites that watch the Earth, connect the world, and navigate the planet actually work — the orbits they use, what they do, who operates them, and how the space age began. Built on real satellite data that reuses the platform's agencies, rockets, and launch sites; nothing is fabricated.",
    accent: "halo",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "What is a satellite?", href: "/satellites", blurb: "An object placed in orbit to do a job — communications, imaging, navigation, or science." },
          { title: "Low Earth orbit", href: "/satellites/orbit/leo", blurb: "The busy, low-latency regime where the ISS and most Earth-observation and broadband satellites fly." },
          { title: "Geostationary orbit", href: "/satellites/orbit/geo", blurb: "Why parking a satellite over the equator makes it appear fixed in the sky." },
          { title: "The first satellites", href: "/satellites/discover/satellite-firsts", blurb: "Explorer 1, Vanguard 1, TIROS-1, Telstar, and the milestones that opened the space age." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "Communications satellites", href: "/satellites/discover/communications", blurb: "From the first transatlantic relay to today's broadband constellations." },
          { title: "Navigation systems", href: "/satellites/discover/navigation", blurb: "How GPS, Galileo, GLONASS, and BeiDou fix your position from medium Earth orbit." },
          { title: "Watching the Earth", href: "/satellites/discover/earth-observation", blurb: "Landsat, the Sentinels, Terra, and Aqua — the satellites that map a changing planet." },
          { title: "Weather from orbit", href: "/satellites/discover/weather", blurb: "The geostationary and polar satellites behind every modern forecast." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "Satellite constellations", href: "/satellites/discover/constellations", blurb: "Why some jobs need dozens or thousands of coordinated satellites instead of one." },
          { title: "Scientific satellites", href: "/satellites/discover/science", blurb: "Measuring gravity, ice, soil moisture, and clouds to understand the Earth system." },
          { title: "Who operates satellites", href: "/satellites/operator/nasa", blurb: "The agencies, civil bodies, and companies that build, launch, and run the fleets." },
          { title: "Seeing satellites tonight", href: "/sky/night-sky-tonight", blurb: "Use the computed Live Sky dashboard for what is genuinely overhead — this encyclopedia states no pass times." },
        ],
      },
    ],
    relatedEntityIds: ["satellite:landsat-8", "satellite_constellation:starlink", "satellite_constellation:gps", "orbit_type:leo"],
    next: ["understanding-launch-vehicles", "observing-the-night-sky"],
  },
  {
    slug: "understanding-asteroids",
    title: "Understanding Asteroids",
    description: "The rocky and icy small bodies of the Solar System — where they live, what they are made of, how they group into families and populations, how spacecraft explore them, and how near-Earth objects are tracked. Built on real MPC/JPL data that reuses the platform's dwarf planets, asteroids, and missions; nothing is fabricated.",
    accent: "stone",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "What is an asteroid?", href: "/asteroids", blurb: "The leftover rocky and metallic building blocks of the Solar System." },
          { title: "The main asteroid belt", href: "/asteroids/group/main-belt", blurb: "The reservoir of most asteroids, between Mars and Jupiter." },
          { title: "The largest asteroids", href: "/asteroids/discover/largest", blurb: "Ceres, Vesta, Pallas, and the other giants of the belt." },
          { title: "Dwarf planets", href: "/asteroids/discover/dwarf-planets", blurb: "The minor planets big enough to pull themselves round — Ceres, Pluto, Eris, and more." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "Near-Earth objects", href: "/asteroids/discover/near-earth-objects", blurb: "The Apollo, Aten, Amor, and Atira asteroids whose orbits approach ours." },
          { title: "What asteroids are made of", href: "/asteroids/discover/carbonaceous-asteroids", blurb: "Carbonaceous, silicaceous, and metallic taxonomy from their spectra." },
          { title: "Asteroid families", href: "/asteroids/family/vesta", blurb: "Fragments of shattered parent bodies sharing similar orbits." },
          { title: "Trojans and resonances", href: "/asteroids/discover/trojans", blurb: "How orbital resonances trap asteroids into distinctive populations." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "Beyond Neptune", href: "/asteroids/discover/trans-neptunian", blurb: "The Kuiper Belt, scattered disc, and the distant detached objects." },
          { title: "Exploring asteroids", href: "/asteroids/discover/most-explored", blurb: "The spacecraft that have flown by, orbited, and landed on small bodies." },
          { title: "Sample return", href: "/asteroids/discover/sample-return-targets", blurb: "Bringing pieces of Itokawa, Ryugu, and Bennu back to Earth." },
          { title: "Planetary defense", href: "/asteroids/planetary-defense", blurb: "Finding, tracking, and — if ever needed — deflecting hazardous asteroids." },
        ],
      },
    ],
    relatedEntityIds: ["asteroid:vesta", "asteroid_family:vesta", "minor_planet_group:main-belt", "near_earth_object:apollo"],
    next: ["the-solar-system", "understanding-the-universe"],
  },
  {
    slug: "understanding-comets",
    title: "Understanding Comets and Small-Body Reservoirs",
    description: "The icy small bodies of the Solar System — what comets are, where they come from, how they were explored, and how they connect to the meteor showers. Built on real MPC/JPL data that reuses the platform's comets, meteor showers, missions, and the asteroid encyclopedia's trans-Neptunian reservoirs; nothing is fabricated.",
    accent: "comet",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "What is a comet?", href: "/comets", blurb: "The icy 'dirty snowballs' that grow tails as they near the Sun." },
          { title: "Anatomy of a comet", href: "/comets/discover/great-comets", blurb: "Nucleus, coma, and the dust and ion tails of the great comets." },
          { title: "Comet orbits", href: "/comets/discover/periodic-comets", blurb: "From Encke's 3-year loop to comets that fall in over millennia." },
          { title: "Periodic and long-period comets", href: "/comets/discover/long-period-comets", blurb: "The two great families of comets, defined by how long they take to return." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "The Kuiper Belt and scattered disc", href: "/comets/discover/scattered-disc-comets", blurb: "The trans-Neptunian source of the short-period, Jupiter-family comets." },
          { title: "The Oort cloud", href: "/comets/reservoir/oort-cloud", blurb: "The vast, distant shell that supplies the long-period comets." },
          { title: "Meteor showers and parent bodies", href: "/comets/discover/meteor-shower-parents", blurb: "How comet debris streams become the annual meteor showers." },
          { title: "Sungrazing comets", href: "/comets/discover/sungrazing-comets", blurb: "The Kreutz family and other comets that skim the Sun." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "Main-belt comets and active asteroids", href: "/comets/discover/active-asteroids", blurb: "Objects that blur the line between asteroid and comet." },
          { title: "Comet missions", href: "/comets/discover/comet-missions", blurb: "Giotto, Stardust, Deep Impact, and Rosetta up close at a comet." },
          { title: "Impact risk and planetary defense", href: "/comets/discover/planetary-defense-comets", blurb: "Shoemaker–Levy 9 at Jupiter and Siding Spring at Mars." },
          { title: "What comets tell us", href: "/comets/class/long-period", blurb: "Pristine long-period comets as frozen samples of the early Solar System." },
        ],
      },
    ],
    relatedEntityIds: ["comet:halleys-comet", "comet_class:jupiter-family", "small_body_reservoir:oort-cloud", "comet_family:kreutz-sungrazers"],
    next: ["understanding-asteroids", "the-solar-system"],
  },
  {
    slug: "understanding-meteorites",
    title: "Understanding Meteors & Meteorites",
    description: "The small bodies that reach the ground — how meteors become meteorites, how they are classified, where they come from, and the fireballs and craters they leave behind. Built on real Meteoritical Bulletin data that reuses the platform's asteroids, impact events, and meteor showers; nothing is fabricated.",
    accent: "halo",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "Meteors, meteoroids, and meteorites", href: "/meteorites", blurb: "The difference between a shooting star, the rock in space, and the piece that lands." },
          { title: "Falls and finds", href: "/meteorites/discover/falls", blurb: "Meteorites seen to fall versus those discovered later on the ground." },
          { title: "Meteorite classification", href: "/meteorites/class/chondrite", blurb: "The four great classes: chondrites, achondrites, irons, and stony-irons." },
          { title: "The largest meteorites", href: "/meteorites/discover/largest", blurb: "From the ~60-tonne Hoba iron to the great strewn fields." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "Carbonaceous chondrites", href: "/meteorites/discover/carbonaceous", blurb: "Primitive, water- and organic-rich meteorites carrying the ingredients of life." },
          { title: "Meteorites from Vesta", href: "/meteorites/group/hed", blurb: "The HED achondrites, matched to the asteroid Vesta's crust." },
          { title: "Martian and lunar meteorites", href: "/meteorites/discover/martian", blurb: "Rocks blasted off Mars and the Moon and delivered to Earth for free." },
          { title: "Iron and stony-iron meteorites", href: "/meteorites/class/iron", blurb: "Fragments of the metallic cores of shattered asteroids." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "Fireballs and bolides", href: "/meteorites/discover/fireballs", blurb: "The bright entries and airbursts — Peekskill, Chelyabinsk, the Bering Sea." },
          { title: "Impact structures", href: "/meteorites/discover/impact-structures", blurb: "The craters left on Earth, from young Meteor Crater to ancient Vredefort." },
          { title: "Meteor showers and their parents", href: "/sky/meteor-showers", blurb: "How comet and asteroid debris streams light up the sky each year." },
          { title: "Impact hazard and planetary defense", href: "/meteorites/discover/planetary-defense", blurb: "Why we track the near-Earth objects that could reach the ground." },
        ],
      },
    ],
    relatedEntityIds: ["meteorite:allende", "meteorite_group:hed", "meteorite_class:chondrite", "asteroid:vesta"],
    next: ["understanding-comets", "understanding-asteroids"],
  },
  {
    slug: "understanding-interstellar-objects",
    title: "Understanding Interstellar Objects",
    description: "Visitors from beyond the Solar System — what makes an object interstellar, how hyperbolic orbits reveal it, how the confirmed objects (1I/ʻOumuamua, 2I/Borisov, 3I/ATLAS) were found, and how astronomers tell them apart from Solar-System comets and from unconfirmed candidates. Built on real MPC/JPL data; confirmed and candidate objects are kept clearly separate and nothing is fabricated.",
    accent: "aurora",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "What is an interstellar object?", href: "/interstellar-objects", blurb: "A body from another star system, passing once through our own." },
          { title: "Hyperbolic orbits", href: "/interstellar-objects/trajectory/hyperbolic-ejection", blurb: "Unbound trajectories that never return — and where they come from." },
          { title: "Eccentricity greater than one", href: "/interstellar-objects/trajectory/interstellar-hyperbolic", blurb: "Why an eccentricity well above 1, with excess speed, means interstellar." },
          { title: "How interstellar objects are detected", href: "/interstellar-objects/detection/excess-hyperbolic-velocity", blurb: "The excess-velocity signature that betrays a visitor from another star." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "1I/ʻOumuamua", href: "/interstellar-objects/oumuamua", blurb: "The first interstellar object — elongated, dry, and much-discussed." },
          { title: "2I/Borisov", href: "/interstellar-objects/borisov", blurb: "The first clearly cometary interstellar object, rich in carbon monoxide." },
          { title: "Comets vs asteroids vs interstellar objects", href: "/interstellar-objects/discover/hyperbolic-comets", blurb: "Telling a visitor from another star from a hyperbolic Solar-System comet." },
          { title: "Survey telescopes", href: "/observatories/pan-starrs", blurb: "Pan-STARRS, ATLAS, and Catalina — the wide-field surveys that catch them." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "The Minor Planet Center", href: "/interstellar-objects/detection/incoming-trajectory-analysis", blurb: "Orbit determination and the IAU “I” interstellar designations." },
          { title: "Candidate and debated objects", href: "/interstellar-objects/discover/debated", blurb: "The CNEOS 2014 bolide and why some interstellar claims stay disputed." },
          { title: "What interstellar objects reveal", href: "/interstellar-objects/detection/spectroscopic-composition", blurb: "Spectroscopy of material formed around other stars." },
          { title: "Future interstellar surveys", href: "/observatories/lsst", blurb: "Why the Vera C. Rubin Observatory should find many more." },
        ],
      },
    ],
    relatedEntityIds: ["interstellar_object:oumuamua", "interstellar_object:borisov", "trajectory_class:interstellar-hyperbolic", "interstellar_detection_method:excess-hyperbolic-velocity"],
    next: ["understanding-comets", "understanding-meteorites"],
  },
  {
    slug: "understanding-small-body-missions",
    title: "Understanding Small-Body Missions",
    description: "How we reached the asteroids and comets — the flybys, orbiters, landers, impactors, and sample-return missions that explored them, from Giotto at Halley to OSIRIS-REx at Bennu and DART at Dimorphos. Built on real NASA/JPL, ESA, and JAXA mission data that reuses the platform's spacecraft, rockets, asteroids, and comets; planned missions claim no results they have not achieved and nothing is fabricated.",
    accent: "halo",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "Why explore small bodies?", href: "/small-body-missions", blurb: "Asteroids and comets are pristine leftovers of planet formation — and potential hazards." },
          { title: "Flyby missions", href: "/small-body-missions/type/flyby", blurb: "The quickest way to reach a new target: a single high-speed pass." },
          { title: "Orbiters and rendezvous", href: "/small-body-missions/type/orbiter", blurb: "Staying with a body to map it in detail — NEAR, Dawn, Rosetta." },
          { title: "Landers", href: "/small-body-missions/type/lander", blurb: "Touching down on a low-gravity surface — Philae, NEAR, the Hayabusa touchdowns." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "Impactor missions", href: "/small-body-missions/type/impactor", blurb: "Deliberately striking a body — to look inside it, or to deflect it." },
          { title: "Sample return", href: "/small-body-missions/discover/sample-return", blurb: "Bringing pieces of an asteroid or comet back to Earth's laboratories." },
          { title: "The Hayabusa line", href: "/small-body-missions/hayabusa2", blurb: "JAXA's pioneering asteroid sample-return missions, Hayabusa and Hayabusa2." },
          { title: "OSIRIS-REx at Bennu", href: "/small-body-missions/osiris-rex", blurb: "NASA's first asteroid sample return — 121.6 grams of a carbon-rich world." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "Comet missions", href: "/small-body-missions/discover/comet-missions", blurb: "From Giotto's first close-up of Halley to Rosetta orbiting comet 67P." },
          { title: "Planetary defense", href: "/small-body-missions/discover/planetary-defense", blurb: "DART's kinetic impact and Hera's follow-up — testing asteroid deflection." },
          { title: "What returned samples reveal", href: "/small-body-missions/sample/ryugu-sample", blurb: "Water, organics, and amino acids in pristine asteroid material." },
          { title: "Future missions", href: "/small-body-missions/discover/future-missions", blurb: "MMX, Comet Interceptor, Psyche, and the missions still to come." },
        ],
      },
    ],
    relatedEntityIds: ["space_mission:osiris-rex", "space_mission:rosetta", "returned_sample:ryugu-sample", "mission_class:sample-return"],
    next: ["understanding-asteroids", "understanding-comets"],
  },
  {
    slug: "understanding-deep-space-communications",
    title: "Understanding Deep Space Communications",
    description: "How we stay in touch with, and navigate, spacecraft across the Solar System — the giant antennas and tracking stations, the radio and laser signal bands, the light-time that makes deep space so hard, and the radiometric, optical, and autonomous navigation that keeps missions on course. Built on real NASA/JPL, ESA, and JAXA data that reuses the platform's networks and missions; nothing is fabricated.",
    accent: "aurora",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "Why deep-space communication is hard", href: "/deep-space-network", blurb: "Faint signals, huge distances, and the speed-of-light delay." },
          { title: "The Deep Space Network", href: "/deep-space-network/network/deep-space-network", blurb: "Three complexes ~120° apart that keep spacecraft always in view." },
          { title: "Tracking stations", href: "/deep-space-network/discover/tracking-stations", blurb: "Goldstone, Madrid, Canberra, and their counterparts worldwide." },
          { title: "Antennas", href: "/deep-space-network/discover/antennas", blurb: "From 70 m giants to the dishes on the spacecraft themselves." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "Signal bands", href: "/deep-space-network/band/x-band", blurb: "S, X, Ka, and optical — the frequencies that carry the data." },
          { title: "Light-time and latency", href: "/deep-space-network/band/x-band", blurb: "Why a command to Jupiter takes the best part of an hour." },
          { title: "Radiometric navigation", href: "/deep-space-network/navigation/radiometric-navigation", blurb: "Distance from signal time, velocity from the Doppler shift." },
          { title: "Delta-DOR", href: "/deep-space-network/navigation/delta-dor", blurb: "Using a quasar as a fixed reference for pinpoint accuracy." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "Optical and autonomous navigation", href: "/deep-space-network/navigation/autonomous-navigation", blurb: "Spacecraft that steer themselves in the final approach." },
          { title: "Onboard atomic clocks", href: "/deep-space-network/navigation/deep-space-atomic-clock", blurb: "Precise timekeeping that enables one-way navigation." },
          { title: "Laser communications", href: "/deep-space-network/discover/laser-communications", blurb: "DSOC and the leap to optical data rates." },
          { title: "The future of deep-space communication", href: "/deep-space-network/discover/future-communications", blurb: "Optical links, antenna arraying, and onboard timing." },
        ],
      },
    ],
    relatedEntityIds: ["tracking_network:deep-space-network", "tracking_station:goldstone", "signal_band:x-band", "navigation_system:radiometric-navigation"],
    next: ["understanding-small-body-missions", "understanding-satellites"],
  },
  {
    slug: "understanding-space-environment",
    title: "Understanding the Space Environment",
    description: "The hazards of space — the Sun's storms, the radiation of the Solar System and galaxy, and the debris and plasma that threaten spacecraft and astronauts — and the missions that watch for them. Built on real NASA and NOAA data; this encyclopedia states no live conditions and nothing is fabricated.",
    accent: "ember",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "What is space weather?", href: "/space-environment", blurb: "Space is not empty — it is full of radiation, plasma, and debris." },
          { title: "The solar wind", href: "/space-environment/solar-wind", blurb: "The Sun's constant outflow that fills the Solar System." },
          { title: "Solar flares and CMEs", href: "/space-environment/coronal-mass-ejection", blurb: "The eruptions that drive the biggest storms at Earth." },
          { title: "Geomagnetic storms and auroras", href: "/space-environment/geomagnetic-storm", blurb: "How solar eruptions disturb Earth's magnetic field." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "The magnetosphere", href: "/space-environment/magnetosphere", blurb: "The magnetic shield that deflects the solar wind." },
          { title: "The Van Allen belts", href: "/space-environment/van-allen-belts", blurb: "The doughnuts of trapped radiation around Earth." },
          { title: "Cosmic rays", href: "/space-environment/galactic-cosmic-rays", blurb: "High-energy particles from the Sun and the galaxy." },
          { title: "Measuring space weather", href: "/space-environment/kp-index", blurb: "The Kp, Dst, and NOAA scales that quantify the storms." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "Orbital debris", href: "/space-environment/orbital-debris", blurb: "The growing hazard of human-made junk in Earth orbit." },
          { title: "Spacecraft charging", href: "/space-environment/spacecraft-charging", blurb: "How the plasma environment can zap electronics." },
          { title: "Radiation on the way to Mars", href: "/space-environment/discover/radiation", blurb: "The dominant risk for long-duration human missions." },
          { title: "The heliosphere and its edge", href: "/space-environment/heliopause", blurb: "The Sun's bubble, and the boundary the Voyagers crossed." },
        ],
      },
    ],
    relatedEntityIds: ["space_weather_phenomenon:solar-wind", "space_weather_phenomenon:geomagnetic-storm", "radiation_environment:van-allen-belts", "geomagnetic_index:kp-index"],
    next: ["understanding-deep-space-communications", "the-solar-system"],
  },
  {
    slug: "understanding-mission-operations",
    title: "Understanding Mission Operations",
    description: "The operational infrastructure behind every mission — the control centres and the functions that fly spacecraft, from mission control and flight dynamics to fault protection and the operations lifecycle. Built on real NASA, ESA, and agency data; nothing is fabricated.",
    accent: "stone",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "What is mission operations?", href: "/mission-operations", blurb: "The teams on the ground that fly the spacecraft." },
          { title: "Operations centres", href: "/mission-operations/discover/operations-centers", blurb: "The control rooms — JPL's SFOF, ESA's ESOC, Houston's Mission Control." },
          { title: "Mission control", href: "/mission-operations/mission-control", blurb: "Commanding and monitoring a spacecraft in real time." },
          { title: "Telemetry and commanding", href: "/mission-operations/telemetry-processing", blurb: "Reading a spacecraft's data and sending it instructions." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "Flight dynamics", href: "/mission-operations/flight-dynamics", blurb: "Knowing and controlling a spacecraft's orbit and attitude." },
          { title: "Orbit determination", href: "/mission-operations/orbit-determination", blurb: "Pinning down where a spacecraft is from tracking data." },
          { title: "Navigation operations", href: "/mission-operations/navigation-operations", blurb: "Guiding a spacecraft to its target through the DSN." },
          { title: "Mission planning", href: "/mission-operations/mission-planning", blurb: "Turning goals into a resource-constrained plan of activities." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "Spacecraft health and safe mode", href: "/mission-operations/safe-mode", blurb: "How a spacecraft protects itself when something goes wrong." },
          { title: "Fault protection", href: "/mission-operations/fault-protection", blurb: "Automatic responses when the ground cannot react in time." },
          { title: "The operations lifecycle", href: "/mission-operations/discover/mission-lifecycle", blurb: "From launch and cruise to science and end-of-mission." },
          { title: "End-of-mission operations", href: "/mission-operations/end-of-mission-operations", blurb: "Disposing of a spacecraft responsibly and preserving its data." },
        ],
      },
    ],
    relatedEntityIds: ["mission_operations_center:jpl-sfof", "operations_function:mission-control", "operations_function:flight-dynamics", "operations_function:navigation-operations"],
    next: ["understanding-deep-space-communications", "understanding-small-body-missions"],
  },
];

const BY_SLUG = new Map(LEARNING_PATHS.map((p) => [p.slug, p]));
export function getLearningPath(slug: string): LearningPath | undefined {
  return BY_SLUG.get(slug);
}
