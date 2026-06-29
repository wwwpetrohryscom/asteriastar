import type { Section } from "@/lib/content/types";

/**
 * Astronomy — the scientific, evidence-based hub.
 *
 * Every overview here is definitional and textbook-level. No specific
 * measurements, counts, dates, or statistics are asserted in this foundation
 * pass; those will be added per entry with explicit citations (see sources).
 */
export const astronomy: Section = {
  slug: "astronomy",
  name: "Astronomy",
  kind: "science",
  accent: "nebula",
  tagline: "The universe, studied with evidence.",
  description:
    "Explore stars, galaxies, planets, and the objects that fill the universe — explained with scientific accuracy and built to cite authoritative sources.",
  intro:
    "Astronomy on Asteria Star is the science of everything beyond Earth: the objects that fill the cosmos, how they form and change, and how we study them. Each topic below is a gateway to structured, source-backed reference material. We describe what is well established and clearly separate it from interpretation.",
  categories: [
    {
      slug: "stars",
      name: "Stars",
      summary: "Luminous spheres of plasma powered by nuclear fusion.",
      overview:
        "Stars are luminous spheres of plasma held together by their own gravity, generating energy through nuclear fusion in their cores. Their mass largely determines how they live, how they shine, and how they end.",
      plannedTopics: ["Stellar classification", "Stellar life cycles", "Notable named stars", "Variable stars"],
      sources: ["nasa", "esa", "iau"],
      keywords: ["stellar", "star types", "main sequence"],
    },
    {
      slug: "constellations",
      name: "Constellations",
      summary: "The 88 official sky regions and their patterns of stars.",
      overview:
        "A constellation is a recognized pattern of stars and, formally, one of the 88 regions into which the International Astronomical Union divides the celestial sphere. Constellations help observers locate objects in the night sky.",
      plannedTopics: ["The 88 IAU constellations", "Seasonal sky maps", "Asterisms", "Cultural sky traditions"],
      sources: ["iau", "nasa"],
      keywords: ["star patterns", "celestial sphere", "asterism"],
    },
    {
      slug: "galaxies",
      name: "Galaxies",
      summary: "Gravitationally bound systems of stars, gas, dust, and dark matter.",
      overview:
        "A galaxy is a gravitationally bound system of stars, stellar remnants, interstellar gas and dust, and dark matter. Galaxies range from compact dwarfs to giant spirals and ellipticals.",
      plannedTopics: ["Galaxy types", "The Milky Way", "Galaxy clusters", "Active galaxies"],
      sources: ["nasa", "esa", "iau"],
      keywords: ["spiral galaxy", "elliptical galaxy", "Milky Way"],
    },
    {
      slug: "nebulae",
      name: "Nebulae",
      summary: "Interstellar clouds of gas and dust — stellar nurseries and remnants.",
      overview:
        "A nebula is an interstellar cloud of gas and dust. Some are regions where new stars form; others are shells of material shed by dying stars. They are among the most visually striking objects in deep-sky imaging.",
      plannedTopics: ["Emission nebulae", "Planetary nebulae", "Supernova remnants", "Dark nebulae"],
      sources: ["nasa", "esa"],
      keywords: ["emission nebula", "planetary nebula", "interstellar medium"],
    },
    {
      slug: "planets",
      name: "Planets",
      summary: "Worlds orbiting the Sun, from rocky terrestrials to gas and ice giants.",
      overview:
        "A planet, as defined by the International Astronomical Union, orbits the Sun, is massive enough to be rounded by its own gravity, and has cleared its orbital neighborhood. Our Solar System has eight.",
      plannedTopics: ["The eight planets", "Terrestrial vs. giant planets", "Planetary atmospheres", "Rings and moons"],
      sources: ["nasa", "jpl", "iau"],
      keywords: ["solar system", "terrestrial planets", "gas giants"],
    },
    {
      slug: "dwarf-planets",
      name: "Dwarf Planets",
      summary: "Rounded worlds that share their orbital zone with other bodies.",
      overview:
        "A dwarf planet orbits the Sun and is massive enough to be nearly round, but unlike a planet it has not cleared its orbital neighborhood. Pluto is the best-known example.",
      plannedTopics: ["Pluto", "Ceres", "Eris, Haumea, Makemake", "Trans-Neptunian objects"],
      sources: ["iau", "nasa", "jpl"],
      keywords: ["Pluto", "Ceres", "Kuiper Belt"],
    },
    {
      slug: "moons",
      name: "Moons",
      summary: "Natural satellites orbiting planets and smaller bodies.",
      overview:
        "A moon, or natural satellite, is a body that orbits a planet, dwarf planet, or smaller object. Moons vary enormously, from airless rock to worlds with thick atmospheres or subsurface oceans.",
      plannedTopics: ["The Moon", "Galilean moons", "Titan and Enceladus", "Irregular satellites"],
      sources: ["nasa", "jpl", "esa"],
      keywords: ["natural satellite", "the Moon", "Galilean moons"],
    },
    {
      slug: "exoplanets",
      name: "Exoplanets",
      summary: "Planets orbiting stars beyond the Sun.",
      overview:
        "An exoplanet is a planet that orbits a star other than the Sun. They are detected through methods such as transits and radial velocity, and their study is a fast-moving field of modern astronomy.",
      plannedTopics: ["Detection methods", "Hot Jupiters", "Super-Earths", "Habitable-zone planets"],
      sources: ["nasa", "esa"],
      keywords: ["transit method", "habitable zone", "extrasolar planet"],
    },
    {
      slug: "asteroids",
      name: "Asteroids",
      summary: "Rocky and metallic remnants from the early Solar System.",
      overview:
        "Asteroids are rocky or metallic bodies, mostly orbiting the Sun in the main belt between Mars and Jupiter. They are leftover building blocks from the formation of the Solar System.",
      plannedTopics: ["The main belt", "Near-Earth asteroids", "Asteroid composition", "Notable asteroids"],
      sources: ["mpc", "jpl", "nasa"],
      keywords: ["main belt", "near-Earth object", "minor planet"],
    },
    {
      slug: "comets",
      name: "Comets",
      summary: "Icy bodies that grow tails as they near the Sun.",
      overview:
        "A comet is an icy small body that releases gas and dust when it approaches the Sun, forming a glowing coma and often a tail. Comets originate in the outer Solar System.",
      plannedTopics: ["Comet anatomy", "Short- and long-period comets", "Famous comets", "Comet observing"],
      sources: ["mpc", "jpl", "nasa"],
      keywords: ["coma", "comet tail", "Oort Cloud"],
    },
    {
      slug: "meteorites",
      name: "Meteorites",
      summary: "Space rocks that survive the fall to a planet's surface.",
      overview:
        "A meteoroid that survives its passage through the atmosphere and lands is called a meteorite. Studying them gives direct samples of asteroids, the Moon, and Mars.",
      plannedTopics: ["Meteoroids, meteors, meteorites", "Stony, iron, and stony-iron types", "Famous falls", "Meteorite identification"],
      sources: ["nasa", "britannica"],
      keywords: ["meteor", "meteoroid", "fireball"],
    },
    {
      slug: "black-holes",
      name: "Black Holes",
      summary: "Regions where gravity is so strong not even light escapes.",
      overview:
        "A black hole is a region of spacetime where gravity is so strong that nothing, not even light, can escape from within its event horizon. They form from collapsed massive stars and grow by accreting matter.",
      plannedTopics: ["Event horizons", "Stellar vs. supermassive black holes", "Accretion disks", "Gravitational waves"],
      sources: ["nasa", "esa"],
      keywords: ["event horizon", "supermassive black hole", "singularity"],
    },
    {
      slug: "quasars",
      name: "Quasars",
      summary: "Brilliant active galactic nuclei in the distant universe.",
      overview:
        "A quasar is an extremely luminous active galactic nucleus, powered by gas falling toward a supermassive black hole at a galaxy's center. They are among the most distant and energetic objects we observe.",
      plannedTopics: ["Active galactic nuclei", "How quasars shine", "Quasars and cosmic distance", "Notable quasars"],
      sources: ["nasa", "esa"],
      keywords: ["active galactic nucleus", "AGN", "accretion"],
    },
    {
      slug: "pulsars",
      name: "Pulsars",
      summary: "Rapidly spinning neutron stars that beam radiation.",
      overview:
        "A pulsar is a highly magnetized, rapidly rotating neutron star that emits beams of radiation. As it spins, the beams sweep past Earth as regular pulses.",
      plannedTopics: ["Neutron stars", "How pulsars form", "Millisecond pulsars", "Pulsar timing"],
      sources: ["nasa", "esa"],
      keywords: ["neutron star", "rotation", "radio pulsar"],
    },
    {
      slug: "supernovae",
      name: "Supernovae",
      summary: "The explosive deaths of stars.",
      overview:
        "A supernova is the powerful explosion that marks the death of certain stars, briefly outshining entire galaxies and scattering heavy elements into space. These elements seed future stars and planets.",
      plannedTopics: ["Core-collapse supernovae", "Type Ia supernovae", "Supernova remnants", "Historical supernovae"],
      sources: ["nasa", "esa"],
      keywords: ["stellar explosion", "Type Ia", "core collapse"],
    },
    {
      slug: "star-clusters",
      name: "Star Clusters",
      summary: "Groups of stars born from the same cloud.",
      overview:
        "A star cluster is a group of stars that formed together from the same molecular cloud and remain loosely or tightly bound by gravity. Open clusters are young and scattered; globular clusters are old and dense.",
      plannedTopics: ["Open clusters", "Globular clusters", "Cluster ages", "Observing clusters"],
      sources: ["nasa", "esa", "iau"],
      keywords: ["open cluster", "globular cluster", "Pleiades"],
    },
    {
      slug: "space-missions",
      name: "Space Missions",
      summary: "Robotic and crewed journeys that explore the Solar System and beyond.",
      overview:
        "Space missions are organized efforts to explore space using crewed or robotic spacecraft. They have visited every planet in the Solar System and continue to expand what we can study directly.",
      plannedTopics: ["Planetary missions", "Crewed spaceflight", "Sample return", "Mission timelines"],
      sources: ["nasa", "esa", "jpl"],
      keywords: ["robotic missions", "exploration", "flyby"],
    },
    {
      slug: "spacecraft",
      name: "Spacecraft",
      summary: "The vehicles and probes built to travel and work in space.",
      overview:
        "A spacecraft is a vehicle designed to operate in space, whether orbiting a body, landing on it, or flying past. Designs range from tiny CubeSats to large crewed vehicles and deep-space probes.",
      plannedTopics: ["Orbiters and landers", "Probes and rovers", "Propulsion basics", "Spacecraft anatomy"],
      sources: ["nasa", "esa", "jpl"],
      keywords: ["probe", "rover", "orbiter"],
    },
    {
      slug: "space-telescopes",
      name: "Space Telescopes",
      summary: "Observatories in orbit, above the blur of the atmosphere.",
      overview:
        "A space telescope observes the universe from orbit, avoiding the distortion and absorption caused by Earth's atmosphere. Different telescopes are tuned to different parts of the electromagnetic spectrum.",
      plannedTopics: ["Hubble Space Telescope", "James Webb Space Telescope", "X-ray and infrared observatories", "How they see"],
      sources: ["nasa", "esa"],
      keywords: ["orbital telescope", "Hubble", "James Webb"],
    },
    {
      slug: "observatories",
      name: "Observatories",
      summary: "Ground-based sites built to study the sky.",
      overview:
        "An observatory is a facility equipped for observing astronomical objects, typically built at high, dark, dry sites. Modern observatories host large optical and radio telescopes.",
      plannedTopics: ["Optical observatories", "Radio observatories", "Site selection", "Historic observatories"],
      sources: ["esa", "nasa", "britannica"],
      keywords: ["telescope", "radio astronomy", "dark sky"],
    },
    {
      slug: "astronomers",
      name: "Astronomers",
      summary: "The scientists who study the universe — a working directory.",
      overview:
        "Astronomers are scientists who study celestial objects and the physics of the universe. This directory profiles individuals and their contributions; the broader history is covered in the Encyclopedia.",
      plannedTopics: ["Modern astronomers", "Observational pioneers", "Theorists", "Fields of study"],
      sources: ["iau", "britannica"],
      keywords: ["scientists", "researchers", "astrophysicists"],
    },
  ],
};
