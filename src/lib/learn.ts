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
];

const BY_SLUG = new Map(LEARNING_PATHS.map((p) => [p.slug, p]));
export function getLearningPath(slug: string): LearningPath | undefined {
  return BY_SLUG.get(slug);
}
