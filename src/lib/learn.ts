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
  {
    slug: "understanding-spacecraft-systems",
    title: "Understanding Spacecraft Systems",
    description: "The engineering of spacecraft — the subsystems and components that make a machine work in space for years without repair. Built on real NASA and ESA engineering; nothing is fabricated.",
    accent: "comet",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "What makes up a spacecraft?", href: "/spacecraft-systems", blurb: "The subsystems that must all work together for years." },
          { title: "Electrical power", href: "/spacecraft-systems/discover/power", blurb: "Solar arrays, batteries, and RTGs for deep space." },
          { title: "Thermal control", href: "/spacecraft-systems/thermal-control", blurb: "Staying warm in the cold and cool in the Sun." },
          { title: "Structure", href: "/spacecraft-systems/structure", blurb: "The frame that survives launch and holds everything." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "Propulsion", href: "/spacecraft-systems/discover/propulsion", blurb: "Chemical, ion, and Hall-effect thrusters." },
          { title: "Ion propulsion", href: "/spacecraft-systems/ion-thruster", blurb: "Gentle but ultra-efficient — how Dawn reached two worlds." },
          { title: "Attitude control", href: "/spacecraft-systems/discover/attitude-control", blurb: "Pointing a spacecraft with reaction wheels and gyros." },
          { title: "Reaction wheels", href: "/spacecraft-systems/reaction-wheel", blurb: "Turning a spacecraft using no fuel at all." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "Avionics and flight software", href: "/spacecraft-systems/discover/avionics", blurb: "The radiation-hardened computers that fly the mission." },
          { title: "Fault management", href: "/spacecraft-systems/fault-management", blurb: "How spacecraft protect themselves far from home." },
          { title: "Entry, descent, and landing", href: "/spacecraft-systems/discover/entry-landing", blurb: "Heat shields, parachutes, and the seven minutes of terror." },
          { title: "Robotics", href: "/spacecraft-systems/robotic-arm", blurb: "The arms that build stations and sample worlds." },
        ],
      },
    ],
    relatedEntityIds: ["spacecraft_subsystem:electrical-power", "spacecraft_component:ion-thruster", "spacecraft_component:reaction-wheel", "spacecraft_component:rtg"],
    next: ["understanding-mission-operations", "understanding-launch-vehicles"],
  },
  {
    slug: "understanding-scientific-instruments",
    title: "Understanding Scientific Instruments",
    description: "How spacecraft do science — the classes of instrument and the payloads that map worlds, read composition in light, and sense the invisible environment of space. Built on real NASA and ESA mission data; nothing is fabricated.",
    accent: "nebula",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "What is a science payload?", href: "/instruments", blurb: "The instruments that turn a spacecraft into a scientific observatory." },
          { title: "Cameras", href: "/instruments/optical-camera", blurb: "The eyes of a spacecraft, from wide-angle to narrow-angle telescopes." },
          { title: "Spectrometers", href: "/instruments/spectrometer", blurb: "Splitting light to read composition, temperature, and motion." },
          { title: "Instruments by class", href: "/instruments/discover/classes", blurb: "The families of instrument used across missions." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "Imaging spectrometers", href: "/instruments/imaging-spectrometer", blurb: "A spectrum for every pixel — mapping composition in an image." },
          { title: "Magnetometers", href: "/instruments/magnetometer", blurb: "Feeling magnetic fields — and the hidden oceans they reveal." },
          { title: "Radar and altimeters", href: "/instruments/discover/active-sensing", blurb: "Actively probing surfaces through cloud and darkness." },
          { title: "Seismometers", href: "/instruments/seismometer", blurb: "Listening to a planet's interior, as InSight did at Mars." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "Mass spectrometers", href: "/instruments/mass-spectrometer", blurb: "Sorting atoms by mass to identify chemistry and isotopes." },
          { title: "Fields and particles", href: "/instruments/discover/fields-particles", blurb: "Sensing the plasma, dust, and radiation of space." },
          { title: "Radio science", href: "/instruments/radio-science", blurb: "Using the spacecraft's own signal to weigh a planet." },
          { title: "A famous instrument: SEIS", href: "/instruments/insight-seis", blurb: "The seismometer that first mapped the interior of Mars." },
        ],
      },
    ],
    relatedEntityIds: ["instrument_class:optical-camera", "instrument_class:spectrometer", "scientific_instrument:insight-seis", "scientific_instrument:lorri"],
    next: ["understanding-spacecraft-systems", "understanding-the-universe"],
  },
  {
    slug: "understanding-planetary-geology",
    title: "Understanding Planetary Geology",
    description: "How to read the surface of a world — the craters, volcanoes, canyons, dunes, and ice plains that record a planet's history. Built on real NASA/JPL planetary data across the Solar System; nothing is fabricated.",
    accent: "plasma",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "Reading a planet's surface", href: "/planetary-geology", blurb: "Every solid world tells its story in its landforms." },
          { title: "Impact craters", href: "/planetary-geology/impact-crater", blurb: "The most common landform, and a clock for dating surfaces." },
          { title: "Volcanoes", href: "/planetary-geology/shield-volcano", blurb: "From Olympus Mons to the ice volcanoes of the outer worlds." },
          { title: "Feature types", href: "/planetary-geology/discover/feature-types", blurb: "The families of landform across the Solar System." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "Canyons and tectonics", href: "/planetary-geology/canyon", blurb: "How a world's crust cracks, faults, and folds." },
          { title: "Volcanic features", href: "/planetary-geology/discover/volcanic", blurb: "Lava plains, shield volcanoes, and cryovolcanoes." },
          { title: "Water on Mars", href: "/planetary-geology/jezero-crater", blurb: "Ancient river deltas and the search for past life." },
          { title: "The surface of Venus", href: "/planetary-geology/discover/tectonic", blurb: "Tesserae, coronae, and the highest mountains on Venus." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "The icy worlds", href: "/planetary-geology/discover/icy", blurb: "Chaos terrain, ice plains, and hydrocarbon lakes." },
          { title: "Cryovolcanism", href: "/planetary-geology/cryovolcano", blurb: "Volcanoes that erupt ice, from Ceres to Enceladus." },
          { title: "Pluto's nitrogen glaciers", href: "/planetary-geology/sputnik-planitia", blurb: "A churning, flowing plain of nitrogen ice." },
          { title: "Titan's methane seas", href: "/planetary-geology/kraken-mare", blurb: "The only other world with stable surface liquid." },
        ],
      },
    ],
    relatedEntityIds: ["geological_feature_type:impact-crater", "geological_feature_type:shield-volcano", "surface_feature:sputnik-planitia", "surface_feature:occator-crater"],
    next: ["the-solar-system", "understanding-scientific-instruments"],
  },
  {
    slug: "understanding-space-institutions",
    title: "Understanding Space Institutions",
    description: "Who builds and flies the spacecraft — the space agencies, field centers, laboratories, and companies of the space enterprise, and how they fit together. Built on real organizations from NASA, ESA, and JAXA; nothing is fabricated.",
    accent: "halo",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "The institutions of spaceflight", href: "/institutions", blurb: "Agencies, field centers, laboratories, and companies — and how they connect." },
          { title: "Space agencies", href: "/institutions/discover/space-agencies", blurb: "The government bodies that fund and run space programs." },
          { title: "A field center: Goddard", href: "/institutions/nasa-goddard", blurb: "How a space agency's work is split across specialised centres." },
          { title: "Field centers", href: "/institutions/discover/field-centers", blurb: "The centres of NASA, ESA, and JAXA, each with its own role." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "Mission Control: Johnson", href: "/institutions/nasa-jsc", blurb: "Where human spaceflight is trained and flown." },
          { title: "The Applied Physics Laboratory", href: "/institutions/jhuapl", blurb: "The lab behind New Horizons, Parker Solar Probe, and DART." },
          { title: "Laboratories & institutes", href: "/institutions/discover/laboratories", blurb: "Who designs, builds, and leads the science of robotic missions." },
          { title: "Europe's technical heart: ESTEC", href: "/institutions/esa-estec", blurb: "Where almost every ESA spacecraft is engineered and tested." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "Commercial space", href: "/institutions/discover/commercial", blurb: "The private companies building launch vehicles and spacecraft." },
          { title: "Observatory organisations", href: "/institutions/discover/observatories", blurb: "Who operates the great ground-based telescopes." },
          { title: "An independent institute: SwRI", href: "/institutions/swri", blurb: "Leading the science of Juno, New Horizons, and Lucy." },
          { title: "JAXA's hub: Tsukuba", href: "/institutions/jaxa-tsukuba", blurb: "Japan's centre for astronauts and the Kibo module." },
        ],
      },
    ],
    relatedEntityIds: ["institution_type:space-agency", "institution_type:field-center", "organization:nasa-goddard", "organization:jpl"],
    next: ["history-of-astronomy", "understanding-mission-operations"],
  },
  {
    slug: "understanding-the-history-of-spaceflight",
    title: "Understanding the History of Spaceflight",
    description: "How humanity reached space and explored the Solar System — the eras, the milestone firsts, and the records, from Sputnik to Artemis. Built on real dated events; nothing is fabricated.",
    accent: "comet",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "The story of spaceflight", href: "/timeline", blurb: "Eras, events, milestones, and records — the whole arc of the space age." },
          { title: "The eras of spaceflight", href: "/timeline/discover/eras", blurb: "From the Space Race to the Artemis era." },
          { title: "Sputnik opens the space age", href: "/timeline/launch-of-sputnik-1", blurb: "The first artificial satellite, 1957." },
          { title: "The first Moon landing", href: "/timeline/apollo-11-first-humans-on-the-moon", blurb: "Apollo 11, and the first footsteps on another world." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "Firsts & milestones", href: "/timeline/discover/firsts-and-milestones", blurb: "The milestone achievements of spaceflight." },
          { title: "The first human in space", href: "/timeline/gagarin-first-human-in-space", blurb: "Yuri Gagarin and Vostok 1, 1961." },
          { title: "Human spaceflight history", href: "/timeline/discover/human-spaceflight-history", blurb: "Crewed firsts, spacewalks, and space stations." },
          { title: "Building the ISS", href: "/timeline/first-module-of-the-iss", blurb: "The largest structure ever built in space." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "Robotic exploration history", href: "/timeline/discover/robotic-exploration-history", blurb: "Flybys, orbiters, landers, and sample return." },
          { title: "The only visit to Neptune", href: "/timeline/voyager-2-neptune-flyby", blurb: "Voyager 2 completes the grand tour, 1989." },
          { title: "The first close-up of Pluto", href: "/timeline/new-horizons-flies-past-pluto", blurb: "New Horizons, 2015." },
          { title: "Records of spaceflight", href: "/timeline/discover/records", blurb: "The most distant, fastest, and longest-lived." },
        ],
      },
    ],
    relatedEntityIds: ["historic_space_event:the-space-race", "timeline_event:apollo-11-first-humans-on-the-moon", "mission_milestone:first-human-in-space", "record:most-distant-human-made-object"],
    next: ["understanding-space-institutions", "history-of-astronomy"],
  },
  {
    slug: "understanding-humans-in-space",
    title: "Understanding Humans in Space",
    description: "What spaceflight does to the human body, how a crew is kept alive, and how their health is protected on the way to the Moon and Mars. Built on real NASA/ESA human research; quantitative figures are omitted unless well established.",
    accent: "aurora",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "The human factor", href: "/space-medicine", blurb: "Why the body needs help to live and work in space." },
          { title: "Effects of microgravity", href: "/space-medicine/discover/physiological-effects", blurb: "Bone and muscle loss, fluid shift, vision changes, and more." },
          { title: "Bone density loss", href: "/human-spaceflight/bone-density-loss", blurb: "One of the best-documented risks of long missions." },
          { title: "Keeping a crew alive", href: "/space-medicine/discover/life-support-technologies", blurb: "Oxygen, CO2 removal, water recovery, and food." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "Countermeasures", href: "/space-medicine/discover/countermeasures", blurb: "How crew health is protected in flight." },
          { title: "Exercise in orbit", href: "/space-medicine/resistive-exercise", blurb: "The primary defence against bone and muscle loss." },
          { title: "Recycling water and air", href: "/space-medicine/water-recovery", blurb: "Closing the loop for missions that cannot resupply." },
          { title: "Radiation biology", href: "/space-medicine/space-radiation-biology", blurb: "The defining health challenge of deep space." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "Fluid shift & vision changes", href: "/human-spaceflight/fluid-shift", blurb: "A leading unknown for long Mars missions." },
          { title: "Closed ecosystems", href: "/space-medicine/closed-loop-life-support", blurb: "The self-sufficient life support a Mars base will need." },
          { title: "The mind in space", href: "/space-medicine/space-psychology-and-human-factors", blurb: "Isolation, confinement, and behavioural health." },
          { title: "Artificial gravity", href: "/space-medicine/artificial-gravity", blurb: "Could counter many effects at once — not yet operational." },
        ],
      },
    ],
    relatedEntityIds: ["space_biology_topic:space-medicine", "space_medicine_topic:bone-density-loss", "countermeasure:resistive-exercise", "life_support_technology:water-recovery"],
    next: ["understanding-spacecraft-systems", "understanding-the-history-of-spaceflight"],
  },
  {
    slug: "understanding-building-in-space",
    title: "Understanding Building in Space",
    description: "How the next era of spaceflight will make and build things in space instead of launching them — mining the Moon and asteroids, printing parts in orbit, and building depots, habitats, and power stations. Each technology's real maturity is stated honestly.",
    accent: "stone",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "Building in space", href: "/space-infrastructure", blurb: "Why the future will not launch everything from Earth." },
          { title: "Living off the land (ISRU)", href: "/space-infrastructure/discover/resource-utilisation", blurb: "Water, oxygen, and metal from the Moon, Mars, and asteroids." },
          { title: "Water: the keystone resource", href: "/space-infrastructure/water-extraction", blurb: "Drinking water, oxygen, shielding, and rocket fuel." },
          { title: "Making oxygen on Mars", href: "/space-infrastructure/oxygen-production", blurb: "MOXIE demonstrated it on Perseverance." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "Manufacturing in orbit", href: "/space-infrastructure/discover/manufacturing", blurb: "3D printing, assembly, and servicing in space." },
          { title: "3D printing in space", href: "/space-infrastructure/additive-manufacturing", blurb: "A printer has run on the ISS since 2014." },
          { title: "Infrastructure systems", href: "/space-infrastructure/discover/infrastructure-systems", blurb: "Depots, habitats, power, and logistics." },
          { title: "Propellant depots", href: "/space-infrastructure/propellant-depot", blurb: "Refuel in orbit instead of launching full." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "Inflatable habitats", href: "/space-infrastructure/inflatable-habitat", blurb: "More living volume per kilogram launched." },
          { title: "Space-based power", href: "/space-infrastructure/solar-power-satellite", blurb: "Collect sunlight in orbit, beam it to Earth." },
          { title: "Making propellant off-world", href: "/space-infrastructure/propellant-production", blurb: "Fuel a return trip at the destination." },
          { title: "Megastructures", href: "/space-infrastructure/space-elevator", blurb: "Theoretical — no material yet strong enough." },
        ],
      },
    ],
    relatedEntityIds: ["infrastructure_domain:in-situ-resource-utilisation", "isru_technique:oxygen-production", "space_manufacturing_process:additive-manufacturing", "space_infrastructure:propellant-depot"],
    next: ["understanding-humans-in-space", "the-solar-system"],
  },
  {
    slug: "understanding-the-future-of-exploration",
    title: "Understanding the Future of Exploration",
    description: "What comes next in space — the missions being built and the concepts being studied, from the Artemis return to the Moon to the search for life around other stars. Only official or credible missions, with honest status and open questions.",
    accent: "ember",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "What comes next", href: "/future-exploration", blurb: "The missions and concepts shaping the coming decades." },
          { title: "Return to the Moon", href: "/future-exploration/discover/human-and-lunar", blurb: "The Artemis missions and Gateway." },
          { title: "Artemis III", href: "/future-exploration/artemis-iii", blurb: "The first crewed Moon landing since Apollo." },
          { title: "Planetary missions", href: "/future-exploration/discover/planetary-missions", blurb: "The next robotic missions across the Solar System." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "A drone on Titan", href: "/future-exploration/dragonfly", blurb: "Flying across an ocean world's organic chemistry." },
          { title: "The Venus fleet", href: "/future-exploration/davinci", blurb: "DAVINCI, VERITAS, and EnVision return to Venus." },
          { title: "Planetary defence", href: "/future-exploration/neo-surveyor", blurb: "Finding hazardous asteroids before they find us." },
          { title: "Bringing Mars home", href: "/human-spaceflight", blurb: "Mars Sample Return, caching rocks for Earth." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "Future observatories", href: "/future-exploration/discover/future-observatories", blurb: "The great telescopes of the coming decades." },
          { title: "Searching for other Earths", href: "/future-exploration/habitable-worlds-observatory", blurb: "Directly imaging potentially habitable worlds." },
          { title: "Gravitational waves from space", href: "/future-exploration/lisa", blurb: "A detector millions of kilometres across." },
          { title: "To the ice giants", href: "/future-exploration/uranus-orbiter-and-probe", blurb: "The top flagship priority of the decadal survey." },
        ],
      },
    ],
    relatedEntityIds: ["exploration_theme:lunar-exploration", "mission_concept:dragonfly", "mission_concept:habitable-worlds-observatory", "mission_concept:artemis-iii"],
    next: ["understanding-building-in-space", "the-solar-system"],
  },
  {
    slug: "understanding-how-astronomy-works",
    title: "Understanding How Astronomy Works",
    description: "The methods behind the science — how astronomers measure a distance, read a spectrum, weigh a black hole, and detect a ripple in spacetime, and how uncertainty is measured rather than hidden. Built on real techniques; nothing is fabricated.",
    accent: "nebula",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "How astronomy works", href: "/methods", blurb: "Everything astronomy knows, it knows through a method." },
          { title: "Measuring distances", href: "/methods/discover/the-distance-ladder", blurb: "Parallax, standard candles, and redshift." },
          { title: "Parallax", href: "/methods/parallax", blurb: "The one direct, geometric distance measurement." },
          { title: "The magnitude system", href: "/methods/the-magnitude-system", blurb: "Astronomy's backwards brightness scale." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "Light & spectra", href: "/methods/discover/light-and-spectra", blurb: "Photometry, imaging, and spectroscopy." },
          { title: "Spectroscopy", href: "/methods/spectroscopy", blurb: "The most powerful single tool in astronomy." },
          { title: "The Cepheid distance scale", href: "/methods/cepheid-distance-scale", blurb: "Leavitt's law and the size of the universe." },
          { title: "Finding exoplanets", href: "/methods/discover/finding-exoplanets", blurb: "Transit, radial velocity, and more." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "Beyond light", href: "/methods/discover/beyond-light", blurb: "Lensing, gravitational waves, and neutrinos." },
          { title: "Gravitational lensing", href: "/methods/gravitational-lensing", blurb: "Weighing matter directly, including dark matter." },
          { title: "Gravitational-wave detection", href: "/methods/gravitational-wave-detection", blurb: "Hearing the mergers of black holes." },
          { title: "Error analysis & calibration", href: "/methods/error-analysis-and-calibration", blurb: "Why a measurement needs an error bar." },
        ],
      },
    ],
    relatedEntityIds: ["method_category:the-cosmic-distance-ladder", "astronomy_method:spectroscopy", "astronomy_method:parallax", "astronomy_method:gravitational-wave-detection"],
    next: ["understanding-the-universe", "the-solar-system"],
  },
  {
    slug: "understanding-the-dynamic-universe",
    title: "Understanding the Dynamic Universe",
    description: "How astronomers watch the universe change — across every wavelength and messenger — and the transients, alert networks, and workflows that turn a flicker in the sky into science within hours. Built on real observations; nothing is fabricated.",
    accent: "plasma",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "The dynamic universe", href: "/time-domain", blurb: "The sky is not still — how we watch it change." },
          { title: "Explosive transients", href: "/time-domain/discover/explosive-transients", blurb: "The supernovae and novae." },
          { title: "Type Ia supernovae", href: "/time-domain/type-ia-supernova", blurb: "The standard candles that revealed dark energy." },
          { title: "Across the spectrum", href: "/observatories", blurb: "Radio to gamma-ray, and beyond light." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "Relativistic events & mergers", href: "/time-domain/discover/relativistic-and-mergers", blurb: "Gamma-ray bursts, kilonovae, and mergers." },
          { title: "Gamma-ray bursts", href: "/time-domain/gamma-ray-burst", blurb: "The most luminous explosions known." },
          { title: "Kilonovae", href: "/time-domain/kilonova", blurb: "Where the heaviest elements are made." },
          { title: "Fast radio bursts", href: "/time-domain/fast-radio-burst", blurb: "Millisecond radio flashes across the cosmos." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "The alert infrastructure", href: "/time-domain/discover/alert-infrastructure", blurb: "GCN, VOEvent, TNS, and the Rubin stream." },
          { title: "The Rubin alert stream", href: "/time-domain/rubin-alert-stream", blurb: "Millions of transient alerts every night." },
          { title: "The observation workflow", href: "/time-domain/discover/observation-workflow", blurb: "Discovery to publication." },
          { title: "Multi-messenger astronomy", href: "/methods/multi-messenger-astronomy", blurb: "Combining light, waves, and neutrinos." },
        ],
      },
    ],
    relatedEntityIds: ["transient_class:type-ia-supernova", "transient_class:kilonova", "transient_class:fast-radio-burst", "alert_system:rubin-alert-stream"],
    next: ["understanding-how-astronomy-works", "understanding-the-universe"],
  },
  {
    slug: "understanding-galaxies",
    title: "Understanding Galaxies",
    description: "The extragalactic universe — the forms of galaxies, the active nuclei at their hearts, how they evolve, and the great structures they build. Built on real galaxies and object classes; nothing is fabricated.",
    accent: "halo",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "The extragalactic universe", href: "/galaxies", blurb: "Hundreds of billions of galaxies, strung along the cosmic web." },
          { title: "Galaxy morphology", href: "/galaxies/discover/galaxy-morphology", blurb: "The forms of galaxies — the Hubble sequence and beyond." },
          { title: "Spiral galaxies", href: "/galaxies/spiral", blurb: "Rotating disks of ongoing star formation." },
          { title: "Elliptical galaxies", href: "/galaxies/elliptical", blurb: "Old stars, built by mergers." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "Active galactic nuclei", href: "/galaxies/discover/active-galactic-nuclei", blurb: "The energetic hearts of galaxies." },
          { title: "Radio galaxies", href: "/galaxies/radio-galaxy", blurb: "Jets and lobes larger than the galaxy itself." },
          { title: "How galaxies evolve", href: "/galaxies/discover/galaxy-evolution", blurb: "Mergers, starbursts, and quenching." },
          { title: "Galaxy mergers", href: "/galaxies/galaxy-merger", blurb: "Two spirals can merge into one elliptical." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "Cosmic structures", href: "/galaxies/discover/cosmic-structures", blurb: "Groups, clusters, superclusters, and voids." },
          { title: "The Local Group", href: "/galaxies/local-group", blurb: "Our home group of galaxies." },
          { title: "Laniakea", href: "/galaxies/laniakea-supercluster", blurb: "Our home supercluster, defined by galaxy flows." },
          { title: "Black-hole feedback", href: "/galaxies/black-hole-feedback", blurb: "A black hole shaping its whole galaxy." },
        ],
      },
    ],
    relatedEntityIds: ["galaxy_morphology:spiral", "agn_type:radio-galaxy", "galactic_process:galaxy-merger", "cosmic_structure:local-group"],
    next: ["understanding-the-dynamic-universe", "understanding-the-universe"],
  },
  {
    slug: "understanding-the-search-for-life",
    title: "Understanding the Search for Life",
    description: "How science asks whether we are alone — how life might begin, where it could survive, and how we would recognise its signs without being fooled. Built on real astrobiology; no claim of alien life is asserted.",
    accent: "aurora",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "The search for life", href: "/astrobiology", blurb: "Turning an ancient question into science." },
          { title: "What makes a world habitable", href: "/astrobiology/discover/habitability", blurb: "Water, energy, chemistry, and stability." },
          { title: "Liquid water", href: "/astrobiology/liquid-water", blurb: "The one requirement all known life shares." },
          { title: "Ocean worlds", href: "/astrobiology/ocean-worlds-astrobiology", blurb: "Europa, Enceladus, and Titan." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "Biosignatures", href: "/astrobiology/discover/biosignatures", blurb: "The potential signs of life." },
          { title: "Atmospheric biosignatures", href: "/astrobiology/atmospheric-biosignature", blurb: "Gases in disequilibrium, like oxygen and methane." },
          { title: "Extremophiles", href: "/astrobiology/extremophiles", blurb: "Life on Earth in conditions once thought lethal." },
          { title: "Subsurface oceans", href: "/astrobiology/subsurface-ocean", blurb: "Oceans hidden beneath the ice." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "False positives", href: "/astrobiology/biosignature-false-positive", blurb: "Ruling these out is the hardest part." },
          { title: "Technosignatures & SETI", href: "/astrobiology/technosignatures-and-seti", blurb: "The search for signs of intelligence." },
          { title: "Planetary protection", href: "/astrobiology/discover/planetary-protection", blurb: "Keeping the search honest, in both directions." },
          { title: "Backward contamination", href: "/astrobiology/backward-contamination", blurb: "Protecting Earth from returned samples." },
        ],
      },
    ],
    relatedEntityIds: ["astrobiology_topic:ocean-worlds-astrobiology", "biosignature:atmospheric-biosignature", "habitability_factor:liquid-water", "planetary_protection:forward-contamination"],
    next: ["understanding-humans-in-space", "understanding-the-future-of-exploration"],
  },
  {
    slug: "understanding-planetary-defense",
    title: "Understanding Planetary Defense",
    description: "How humanity would find and, if necessary, deflect a hazardous asteroid — the surveys, the risk scales, and the missions like DART that have shown an asteroid can be moved. Built on real programs; speculative methods are marked as such.",
    accent: "ember",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "Defending the Earth", href: "/planetary-defense", blurb: "The one natural disaster we could prevent." },
          { title: "The NEO pipeline", href: "/planetary-defense/discover/the-neo-pipeline", blurb: "From discovery to deflection, step by step." },
          { title: "Finding the asteroids", href: "/planetary-defense/neo-discovery", blurb: "The surveys that scan the sky every night." },
          { title: "Impact-risk scales", href: "/planetary-defense/discover/risk-scales", blurb: "The Torino and Palermo scales." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "The Torino Scale", href: "/planetary-defense/torino-scale", blurb: "Apophis reached level 4 — the highest ever." },
          { title: "Tracking and monitoring", href: "/planetary-defense/impact-monitoring", blurb: "Every orbit propagated a century ahead." },
          { title: "Deflection methods", href: "/planetary-defense/discover/deflection-methods", blurb: "From kinetic impactors to nuclear concepts." },
          { title: "The kinetic impactor", href: "/planetary-defense/kinetic-impactor", blurb: "DART moved an asteroid in 2022." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "Characterizing a target", href: "/planetary-defense/characterization", blurb: "Size, spin, and composition — and Hera's follow-up." },
          { title: "The gravity tractor", href: "/planetary-defense/gravity-tractor", blurb: "Towing an asteroid with a spacecraft's gravity." },
          { title: "Nuclear deflection", href: "/planetary-defense/nuclear-deflection", blurb: "A theoretical last resort — never tested." },
          { title: "Decision & planning", href: "/planetary-defense/decision-and-planning", blurb: "How a response would be decided." },
        ],
      },
    ],
    relatedEntityIds: ["defense_stage:neo-discovery", "risk_scale:torino-scale", "deflection_method:kinetic-impactor", "defense_stage:deflection"],
    next: ["understanding-the-future-of-exploration", "the-solar-system"],
  },
  {
    slug: "understanding-data-archives",
    title: "Understanding Space Data Archives & Open Science",
    description: "Where astronomy's data lives and how it is shared — the archives that hold the observations of the world's telescopes, the formats that let the data be shared, the Virtual Observatory that makes them searchable as one, and the open-science practices that make results findable, citable, and reusable. Curated from NASA, ESA, ESO, and the archive operators; nothing is fabricated.",
    accent: "nebula",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "Where the data lives", href: "/data-archives", blurb: "The hidden infrastructure beneath every discovery." },
          { title: "The science archives", href: "/data-archives/discover/the-archives", blurb: "The great archives that hold the sky's data." },
          { title: "MAST", href: "/data-archives/mast", blurb: "The home of Hubble and JWST data." },
          { title: "Data standards", href: "/data-archives/discover/data-standards", blurb: "The formats that let data be shared." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "FITS", href: "/data-archives/fits", blurb: "The universal file format of astronomy." },
          { title: "The Strasbourg CDS", href: "/data-archives/cds", blurb: "A cornerstone of open astronomy." },
          { title: "SIMBAD", href: "/data-archives/simbad", blurb: "Looking up any object beyond the Solar System." },
          { title: "The Virtual Observatory", href: "/data-archives/discover/the-virtual-observatory", blurb: "The world's archives, searchable as one." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "The Virtual Observatory framework", href: "/data-archives/the-virtual-observatory", blurb: "The IVOA standards that tie the archives together." },
          { title: "Data pipelines & calibration", href: "/data-archives/data-pipelines-and-calibration", blurb: "Raw detector counts become science-ready data." },
          { title: "The ADS literature service", href: "/data-archives/the-ads-literature-service", blurb: "The digital library that indexes all of astronomy." },
          { title: "Reproducibility & FAIR data", href: "/data-archives/reproducibility-and-fair", blurb: "Findable, Accessible, Interoperable, Reusable." },
        ],
      },
    ],
    relatedEntityIds: ["data_archive:mast", "data_standard:fits", "vo_framework:the-virtual-observatory", "open_science_practice:reproducibility-and-fair"],
    next: ["understanding-planetary-defense", "the-solar-system"],
  },
  {
    slug: "understanding-the-observatory-frontier",
    title: "Understanding the Observatory Frontier",
    description: "How the largest telescopes ever built actually see — the giant facilities of the coming decade, the adaptive optics that erase the atmosphere, the detectors that count single photons, and the interferometers that reach the sharpest vision in astronomy. Built on real facilities and techniques; facilities under construction are stated as such.",
    accent: "comet",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "The frontier of ground astronomy", href: "/observatory-frontier", blurb: "The largest eyes humanity has ever built." },
          { title: "Next-generation facilities", href: "/observatory-frontier/discover/next-generation-facilities", blurb: "GMT, ngVLA, and the Cherenkov Telescope Array." },
          { title: "The Giant Magellan Telescope", href: "/observatory-frontier/giant-magellan-telescope", blurb: "Seven 8.4-metre mirrors forming one giant." },
          { title: "Instrumentation", href: "/observatory-frontier/discover/instrumentation", blurb: "The optical systems telescopes are built around." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "Laser guide stars", href: "/observatory-frontier/laser-guide-star", blurb: "An artificial star, projected wherever the telescope points." },
          { title: "Deformable mirrors", href: "/observatory-frontier/deformable-mirror", blurb: "Reshaping a mirror thousands of times a second." },
          { title: "The echelle spectrograph", href: "/observatory-frontier/echelle-spectrograph", blurb: "Very high resolution on a single detector." },
          { title: "Detectors", href: "/observatory-frontier/discover/detectors", blurb: "From the CCD to superconducting MKIDs." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "Interferometry", href: "/observatory-frontier/discover/interferometry", blurb: "Many apertures acting as one." },
          { title: "Very Long Baseline Interferometry", href: "/observatory-frontier/very-long-baseline-interferometry", blurb: "Baselines the size of the Earth." },
          { title: "Aperture synthesis", href: "/observatory-frontier/aperture-synthesis", blurb: "Building an image from the Earth's rotation." },
          { title: "Fringe tracking", href: "/observatory-frontier/fringe-tracking", blurb: "Holding an interferometer's fringes steady." },
        ],
      },
    ],
    relatedEntityIds: ["telescope:giant-magellan-telescope", "instrument_technique:laser-guide-star", "interferometry_technique:very-long-baseline-interferometry", "detector_technology:ccd"],
    next: ["understanding-data-archives", "the-solar-system"],
  },
  {
    slug: "understanding-the-distance-ladder",
    title: "Understanding the Cosmic Distance Ladder",
    description: "How the universe is measured, rung by rung — from the geometry of parallax to the exploding stars that reach across the cosmos — and how following the ladder to its top revealed the Hubble tension. Built on real methods and measurements; values are not invented and proposed resolutions are labelled unconfirmed.",
    accent: "halo",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "Measuring the universe", href: "/distance-ladder", blurb: "A ladder of distances, each rung on the one below." },
          { title: "The distance ladder", href: "/distance-ladder/discover/the-distance-ladder", blurb: "The rungs, from parallax to standard sirens." },
          { title: "The tip of the red giant branch", href: "/distance-ladder/tip-of-the-red-giant-branch", blurb: "An independent calibration of supernovae." },
          { title: "Cosmological parameters", href: "/distance-ladder/discover/cosmological-parameters", blurb: "The numbers that describe the whole universe." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "The Tully–Fisher relation", href: "/distance-ladder/tully-fisher-relation", blurb: "Rotation speed reveals a spiral's true brightness." },
          { title: "Water megamaser distances", href: "/distance-ladder/water-megamaser-distances", blurb: "A one-step geometric distance." },
          { title: "Standard sirens", href: "/distance-ladder/standard-sirens", blurb: "A distance straight from a gravitational wave." },
          { title: "The matter density", href: "/distance-ladder/matter-density", blurb: "How much of the universe is matter." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "The Hubble tension", href: "/distance-ladder/discover/the-hubble-tension", blurb: "A crack between the local and early universe." },
          { title: "The SH0ES programme", href: "/distance-ladder/sh0es", blurb: "The local-ladder measurement of the expansion rate." },
          { title: "Early dark energy", href: "/distance-ladder/early-dark-energy", blurb: "One proposed, unconfirmed resolution." },
          { title: "The spectral index", href: "/distance-ladder/scalar-spectral-index", blurb: "The tilt inflation left in the primordial spectrum." },
        ],
      },
    ],
    relatedEntityIds: ["distance_indicator:standard-sirens", "distance_indicator:tip-of-the-red-giant-branch", "observational_program:sh0es", "cosmological_parameter:matter-density"],
    next: ["understanding-the-observatory-frontier", "the-solar-system"],
  },
  {
    slug: "understanding-space-weather",
    title: "Understanding Space Weather",
    description: "How the Sun's weather is made and how it reaches the Earth — the solar cycle and its storms, and their impacts on satellites, navigation, aviation, astronauts, and power grids — and the operational forecasting that watches for it. Built on documented effects and real forecasting services; nothing is fabricated.",
    accent: "aurora",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "The Sun's weather", href: "/heliophysics", blurb: "Watching the Sun and defending against it." },
          { title: "Solar sources", href: "/heliophysics/discover/solar-sources", blurb: "The solar cycle, sunspots, and active regions." },
          { title: "The solar cycle", href: "/heliophysics/solar-cycle", blurb: "The ~11-year heartbeat of solar activity." },
          { title: "Operational impacts", href: "/heliophysics/discover/operational-impacts", blurb: "How solar activity reaches technology and people." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "Active regions", href: "/heliophysics/active-region", blurb: "The magnetic launch sites of flares and CMEs." },
          { title: "Coronal holes", href: "/heliophysics/coronal-hole", blurb: "The source of the fast solar wind." },
          { title: "The ionosphere", href: "/heliophysics/ionosphere", blurb: "Where radio blackouts and GPS errors happen." },
          { title: "Power grids", href: "/heliophysics/power-grids", blurb: "Geomagnetically induced currents in the grid." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "Satellites", href: "/heliophysics/satellites", blurb: "Charging, upsets, and increased orbital drag." },
          { title: "Human spaceflight", href: "/heliophysics/human-spaceflight", blurb: "Radiation, the central hazard beyond low orbit." },
          { title: "Radio communications", href: "/heliophysics/radio-communications", blurb: "HF blackouts across the sunlit Earth." },
          { title: "Forecasting services", href: "/heliophysics/discover/forecasting", blurb: "Watching the Sun and warning the world." },
        ],
      },
    ],
    relatedEntityIds: ["space_weather_phenomenon:solar-cycle", "space_weather_impact:power-grids", "space_weather_impact:satellites", "organization:esa-space-weather-service-network"],
    next: ["understanding-the-distance-ladder", "the-solar-system"],
  },
  {
    slug: "understanding-machine-learning-in-astronomy",
    title: "Understanding Machine Learning in Astronomy",
    description: "How astronomy keeps up with the flood of survey data — the machine-learning methods that classify and discover at scale, the applications where they meet the sky, the brokers that triage the alert stream in real time, and the data engineering that keeps it honest. Built on real methods, brokers, and benchmark datasets; nothing is fabricated.",
    accent: "plasma",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "Astronomy at data scale", href: "/astro-ml", blurb: "How astronomy keeps up with the flood of data." },
          { title: "Machine-learning methods", href: "/astro-ml/discover/ml-methods", blurb: "The techniques astronomy borrows and adapts." },
          { title: "Classification", href: "/astro-ml/classification", blurb: "Sorting millions of objects into kinds." },
          { title: "Applications on the sky", href: "/astro-ml/discover/applications", blurb: "Where ML meets real astronomy." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "Photometric redshifts", href: "/astro-ml/photometric-redshifts", blurb: "Redshifts for hundreds of millions of galaxies." },
          { title: "Galaxy morphology", href: "/astro-ml/galaxy-morphology-classification", blurb: "Classifying galaxies by their shape." },
          { title: "Anomaly detection", href: "/astro-ml/anomaly-detection", blurb: "Finding the objects nobody expected." },
          { title: "Real-time alert classification", href: "/astro-ml/real-time-alert-classification", blurb: "Millions of alerts a night, classified live." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "Alert brokers", href: "/astro-ml/discover/alert-brokers", blurb: "ALeRCE, ANTARES, Fink, and Lasair." },
          { title: "Self-supervised learning", href: "/astro-ml/self-supervised-learning", blurb: "Learning from abundant data without labels." },
          { title: "Benchmark datasets", href: "/astro-ml/benchmark-datasets", blurb: "Comparing methods on equal footing." },
          { title: "Model evaluation", href: "/astro-ml/model-evaluation", blurb: "Completeness, purity, and guarding against overfitting." },
        ],
      },
    ],
    relatedEntityIds: ["ml_method:classification", "ml_application:real-time-alert-classification", "alert_system:alerce", "ml_workflow:benchmark-datasets"],
    next: ["understanding-data-archives", "understanding-the-observatory-frontier"],
  },
  {
    slug: "understanding-citizen-astronomy",
    title: "Understanding Citizen & Amateur Astronomy",
    description: "How anyone can take part in astronomy — from classifying galaxies online to timing an occultation from the backyard — and how amateurs still contribute to the research frontier. Built on real projects, organisations, and equipment; nothing is fabricated.",
    accent: "stone",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "The sky belongs to everyone", href: "/citizen-astronomy", blurb: "How anyone can take part in astronomy." },
          { title: "Citizen science", href: "/citizen-astronomy/discover/citizen-science", blurb: "Where the public does real research." },
          { title: "Galaxy Zoo", href: "/citizen-astronomy/galaxy-zoo", blurb: "Classifying galaxies at a scale no team could." },
          { title: "Backyard observing", href: "/citizen-astronomy/backyard-observing", blurb: "Where almost every astronomer begins." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "Binoculars", href: "/citizen-astronomy/binoculars", blurb: "The best first instrument in astronomy." },
          { title: "The Dobsonian telescope", href: "/citizen-astronomy/dobsonian-telescope", blurb: "The most aperture for the money." },
          { title: "Variable-star observing", href: "/citizen-astronomy/variable-star-observing", blurb: "Amateur light curves professionals rely on." },
          { title: "The AAVSO", href: "/citizen-astronomy/aavso", blurb: "A century of amateur observations." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "Occultation timing", href: "/citizen-astronomy/occultation-timing", blurb: "Professional-grade data from amateurs." },
          { title: "Meteor observing", href: "/citizen-astronomy/meteor-observing", blurb: "Real science with nothing but your eyes." },
          { title: "Dark-sky parks", href: "/citizen-astronomy/dark-sky-park", blurb: "Protecting the vanishing dark sky." },
          { title: "Star parties", href: "/citizen-astronomy/star-party", blurb: "Many people's first look through a telescope." },
        ],
      },
    ],
    relatedEntityIds: ["citizen_science_project:galaxy-zoo", "amateur_activity:variable-star-observing", "organization:aavso", "observing_equipment:binoculars"],
    next: ["understanding-machine-learning-in-astronomy", "the-solar-system"],
  },
  {
    slug: "understanding-multi-messenger-astronomy",
    title: "Understanding Multi-Messenger Astronomy",
    description: "How the universe is now observed in gravitational waves, neutrinos, and light at once — the detectors that feel a merger a billion light-years away, the sources that ring spacetime, and the race from alert to counterpart. Built on real detectors and events; proposed detectors are stated as such.",
    accent: "nebula",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "The new astronomy", href: "/multi-messenger", blurb: "Hearing and seeing the same event at once." },
          { title: "Source classes", href: "/multi-messenger/discover/source-classes", blurb: "The compact-binary mergers that ring spacetime." },
          { title: "Binary neutron star mergers", href: "/multi-messenger/binary-neutron-star-merger", blurb: "Seen in gravitational waves and light — GW170817." },
          { title: "Detection methods", href: "/multi-messenger/discover/detection-methods", blurb: "How gravitational waves are caught." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "Laser interferometry", href: "/multi-messenger/laser-interferometry", blurb: "Measuring a change smaller than a proton's width." },
          { title: "Pulsar timing arrays", href: "/multi-messenger/pulsar-timing-array", blurb: "A detector the size of the galaxy." },
          { title: "Multi-messenger channels", href: "/multi-messenger/discover/multi-messenger", blurb: "Gravitational waves with light, neutrinos, and more." },
          { title: "GW + light", href: "/multi-messenger/gravitational-waves-and-light", blurb: "The channel that founded the field." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "Follow-up & data products", href: "/multi-messenger/discover/follow-up", blurb: "From an alert to a counterpart." },
          { title: "Localization", href: "/multi-messenger/localization", blurb: "Turning three detectors into a position on the sky." },
          { title: "Parameter estimation", href: "/multi-messenger/parameter-estimation", blurb: "From a chirp to masses, spins, and distance." },
          { title: "The GWTC catalog", href: "/multi-messenger/gravitational-wave-transient-catalog", blurb: "The open census of every confident detection." },
        ],
      },
    ],
    relatedEntityIds: ["transient_class:binary-neutron-star-merger", "gw_detection_method:laser-interferometry", "gw_data_product:parameter-estimation", "mm_channel:gravitational-waves-and-light"],
    next: ["understanding-the-observatory-frontier", "understanding-the-dynamic-universe"],
  },
  {
    slug: "understanding-comparative-planetology",
    title: "Understanding Comparative Planetology",
    description: "Why Venus is a furnace, Mars a frozen desert, and Earth alive — the handful of processes, of interiors and atmospheres and magnetic fields, that play out to wildly different ends across the worlds. Built on real planetary science; hypothetical world-types are labelled as proposed.",
    accent: "ember",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "Comparing the worlds", href: "/comparative-planetology", blurb: "The same processes, wildly different ends." },
          { title: "Planetary interiors", href: "/comparative-planetology/discover/planetary-interiors", blurb: "Core, mantle, and crust." },
          { title: "Planetary differentiation", href: "/comparative-planetology/planetary-differentiation", blurb: "How a molten planet sorts itself." },
          { title: "Planetary processes", href: "/comparative-planetology/discover/planetary-processes", blurb: "The mechanisms that shape worlds." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "Plate tectonics", href: "/comparative-planetology/plate-tectonics", blurb: "Known for certain only on Earth." },
          { title: "The greenhouse effect", href: "/comparative-planetology/the-greenhouse-effect", blurb: "Modest on Earth, extreme on Venus." },
          { title: "Atmospheric escape", href: "/comparative-planetology/atmospheric-escape", blurb: "Why Mars lost most of its air." },
          { title: "Magnetospheric shielding", href: "/comparative-planetology/magnetospheric-shielding", blurb: "The magnetic field that protects an atmosphere." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "Cryovolcanism", href: "/comparative-planetology/cryovolcanism", blurb: "Volcanoes that erupt water and ice." },
          { title: "World types", href: "/comparative-planetology/discover/world-types", blurb: "Ocean, lava, and hycean worlds." },
          { title: "Ocean worlds", href: "/comparative-planetology/ocean-world", blurb: "Global oceans beneath ice." },
          { title: "Hycean planets", href: "/comparative-planetology/hycean-planet", blurb: "A proposed, unconfirmed habitable class." },
        ],
      },
    ],
    relatedEntityIds: ["planetary_process:plate-tectonics", "planetary_process:atmospheric-escape", "planetary_class:ocean-world", "planetary_interior:core"],
    next: ["the-solar-system", "understanding-the-search-for-life"],
  },
];

const BY_SLUG = new Map(LEARNING_PATHS.map((p) => [p.slug, p]));
export function getLearningPath(slug: string): LearningPath | undefined {
  return BY_SLUG.get(slug);
}
