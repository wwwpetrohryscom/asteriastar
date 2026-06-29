import { defineEntries } from "@/lib/content/entry-types";

/**
 * Astronomy / Space Telescopes — orbiting observatories, described as
 * instruments. Hubble and JWST here carry their default SEO titles (the
 * observatory), distinct from the "... Mission" entries under Space Missions.
 */
export const astronomySpaceTelescopes = defineEntries([
  {
    section: "astronomy",
    category: "space-telescopes",
    slug: "hubble-space-telescope",
    title: "Hubble Space Telescope",
    description:
      "The Hubble Space Telescope is an orbiting observatory that has produced some of the most detailed and iconic images of the universe across visible, ultraviolet, and near-infrared light.",
    excerpt: "The iconic orbiting observatory of optical astronomy.",
    kind: "science",
    difficulty: "beginner",
    tags: ["Hubble", "observatory", "deep field", "optical astronomy"],
    facts: [
      { label: "Type", value: "Optical / ultraviolet / near-infrared telescope" },
      { label: "Location", value: "Low Earth orbit" },
      { label: "Operators", value: "NASA and ESA" },
      { label: "Named after", value: "Astronomer Edwin Hubble" },
    ],
    keyPoints: [
      "Observes mainly in visible and ultraviolet light from above the atmosphere.",
      "Famous for deep-field images revealing thousands of distant galaxies.",
      "One of the most scientifically productive observatories ever built.",
    ],
    body: [
      {
        heading: "Above the atmosphere",
        paragraphs: [
          "The Hubble Space Telescope observes from orbit, free of the blurring and absorption caused by Earth's atmosphere. This gives it sharp, clear views across visible, ultraviolet, and near-infrared wavelengths.",
        ],
      },
      {
        heading: "Iconic images",
        paragraphs: [
          "Hubble is renowned for images that have become part of popular culture, including detailed views of nebulae and galaxies and its deep-field exposures, which reveal myriad distant galaxies in tiny patches of sky.",
        ],
      },
      {
        heading: "A lasting legacy",
        paragraphs: [
          "Hubble's observations have contributed to a wide range of discoveries about the age and expansion of the universe, galaxy evolution, and planetary science. The story of its launch and in-orbit servicing is covered under Space Missions.",
        ],
      },
    ],
    sources: ["nasa", "esa"],
    relatedEntries: [
      ["astronomy", "space-telescopes", "james-webb-space-telescope"],
      ["astronomy", "space-missions", "hubble-space-telescope"],
    ],
    relatedCategories: [["astronomy", "galaxies"]],
  },
  {
    section: "astronomy",
    category: "space-telescopes",
    slug: "james-webb-space-telescope",
    title: "James Webb Space Telescope",
    description:
      "The James Webb Space Telescope is a large infrared observatory built to see the earliest galaxies and to peer through dust into stellar nurseries and planet-forming disks.",
    excerpt: "The great infrared observatory of the modern era.",
    kind: "science",
    difficulty: "intermediate",
    tags: ["JWST", "infrared", "early universe", "segmented mirror"],
    facts: [
      { label: "Type", value: "Infrared telescope" },
      { label: "Mirror", value: "Large segmented, gold-coated primary mirror" },
      { label: "Location", value: "Near the Sun–Earth L2 point" },
      { label: "Operators", value: "NASA, ESA, and CSA" },
    ],
    keyPoints: [
      "Optimized for infrared light, which lets it see very distant, redshifted galaxies.",
      "Its large segmented mirror and sunshield keep it sensitive and cold.",
      "Can peer through dust to study star and planet formation.",
    ],
    body: [
      {
        heading: "An infrared eye",
        paragraphs: [
          "The James Webb Space Telescope is designed to observe infrared light. Because the expansion of the universe stretches light from the most distant galaxies into the infrared, Webb can see objects from the universe's early history.",
        ],
      },
      {
        heading: "Built to stay cold",
        paragraphs: [
          "Webb uses a large segmented primary mirror to gather faint light and a tennis-court-sized sunshield to block the Sun's heat. Operating far from Earth and kept very cold, it can detect faint infrared signals.",
        ],
      },
      {
        heading: "Seeing through dust",
        paragraphs: [
          "Infrared light passes through clouds of dust that block visible light, so Webb can look inside stellar nurseries and study disks where planets form, as well as the atmospheres of exoplanets. Its launch and journey are covered under Space Missions.",
        ],
      },
    ],
    sources: ["nasa", "esa"],
    relatedEntries: [
      ["astronomy", "space-telescopes", "hubble-space-telescope"],
      ["astronomy", "space-missions", "james-webb-space-telescope"],
    ],
    relatedCategories: [
      ["astronomy", "exoplanets"],
      ["astronomy", "nebulae"],
    ],
  },
  {
    section: "astronomy",
    category: "space-telescopes",
    slug: "spitzer-space-telescope",
    title: "Spitzer Space Telescope",
    description:
      "The Spitzer Space Telescope was a NASA infrared observatory that studied cool and dusty objects — from forming stars to distant galaxies — before its retirement in 2020.",
    excerpt: "NASA's pioneering infrared observatory.",
    kind: "historical",
    difficulty: "intermediate",
    tags: ["Spitzer", "infrared", "star formation", "NASA"],
    facts: [
      { label: "Type", value: "Infrared telescope" },
      { label: "Agency", value: "NASA" },
      { label: "Focus", value: "Cool, dusty, and distant objects" },
      { label: "Retired", value: "2020" },
    ],
    keyPoints: [
      "Observed the universe in infrared light.",
      "Studied star-forming regions, dusty galaxies, and exoplanet atmospheres.",
      "Operated for far longer than its original planned lifetime before retiring in 2020.",
    ],
    body: [
      {
        heading: "An infrared pioneer",
        paragraphs: [
          "The Spitzer Space Telescope was one of NASA's Great Observatories, specializing in infrared light. Infrared lets astronomers study objects that are cool, dusty, or very distant, which are faint or hidden in visible light.",
        ],
      },
      {
        heading: "What it studied",
        paragraphs: [
          "Spitzer peered into dusty star-forming regions, surveyed distant galaxies, and made early measurements of the light from exoplanets, helping to characterize worlds beyond our Solar System.",
        ],
      },
      {
        heading: "End of mission",
        paragraphs: [
          "After operating well beyond its planned lifetime, Spitzer was retired in 2020. Its infrared legacy helped pave the way for the James Webb Space Telescope.",
        ],
      },
    ],
    sources: ["nasa", "jpl"],
    relatedEntries: [
      ["astronomy", "space-telescopes", "james-webb-space-telescope"],
      ["astronomy", "space-telescopes", "hubble-space-telescope"],
    ],
    relatedCategories: [["astronomy", "nebulae"]],
  },
  {
    section: "astronomy",
    category: "space-telescopes",
    slug: "chandra-x-ray-observatory",
    title: "Chandra X-ray Observatory",
    description:
      "The Chandra X-ray Observatory is a NASA telescope that observes the universe in X-rays, revealing the hottest and most energetic phenomena such as black holes and supernova remnants.",
    excerpt: "NASA's window onto the high-energy X-ray universe.",
    kind: "science",
    difficulty: "advanced",
    tags: ["Chandra", "X-ray", "black holes", "NASA"],
    facts: [
      { label: "Type", value: "X-ray telescope" },
      { label: "Agency", value: "NASA" },
      { label: "Studies", value: "Hot gas, black holes, supernova remnants" },
      { label: "Named after", value: "Astrophysicist Subrahmanyan Chandrasekhar" },
    ],
    keyPoints: [
      "Observes X-rays, which must be studied from space because the atmosphere blocks them.",
      "Reveals extremely hot and energetic phenomena.",
      "Used to study black holes, exploded stars, and galaxy clusters.",
    ],
    body: [
      {
        heading: "Seeing in X-rays",
        paragraphs: [
          "The Chandra X-ray Observatory detects X-ray light, which is produced by some of the hottest and most violent processes in the universe. Earth's atmosphere blocks X-rays, so this work must be done from orbit.",
        ],
      },
      {
        heading: "The high-energy universe",
        paragraphs: [
          "Chandra studies material falling toward black holes, the glowing remnants of supernovae, and vast clouds of hot gas in galaxy clusters — phenomena largely invisible to optical telescopes.",
        ],
      },
      {
        heading: "A named observatory",
        paragraphs: [
          "Chandra is named for Subrahmanyan Chandrasekhar, whose theoretical work helped explain the fate of dying stars, including the formation of white dwarfs and the limits that lead to black holes.",
        ],
      },
    ],
    sources: ["nasa"],
    relatedEntries: [
      ["astronomy", "space-telescopes", "hubble-space-telescope"],
      ["astronomy", "stars", "betelgeuse"],
    ],
    relatedCategories: [
      ["astronomy", "black-holes"],
      ["astronomy", "supernovae"],
    ],
  },
  {
    section: "astronomy",
    category: "space-telescopes",
    slug: "kepler-space-telescope",
    title: "Kepler Space Telescope",
    description:
      "The Kepler Space Telescope was a NASA mission that discovered thousands of exoplanets by watching for the tiny dips in starlight caused when a planet crosses its star.",
    excerpt: "The telescope that revealed thousands of exoplanets.",
    kind: "historical",
    difficulty: "intermediate",
    tags: ["Kepler", "exoplanets", "transit method", "NASA"],
    facts: [
      { label: "Type", value: "Optical telescope (exoplanet survey)" },
      { label: "Agency", value: "NASA" },
      { label: "Method", value: "Transit photometry" },
      { label: "Retired", value: "2018" },
    ],
    keyPoints: [
      "Hunted for exoplanets using the transit method.",
      "Discovered thousands of confirmed and candidate planets.",
      "Showed that planets are common around other stars.",
    ],
    body: [
      {
        heading: "Watching for transits",
        paragraphs: [
          "The Kepler Space Telescope stared at a single region of sky, monitoring the brightness of many thousands of stars. When a planet crosses in front of its star, it blocks a tiny fraction of the light — a transit — which Kepler could detect.",
        ],
      },
      {
        heading: "A flood of planets",
        paragraphs: [
          "Kepler discovered thousands of exoplanets and candidates of many sizes and orbits, demonstrating that planetary systems are common throughout the galaxy.",
        ],
      },
      {
        heading: "Legacy",
        paragraphs: [
          "After running low on the fuel needed to point precisely, Kepler was retired in 2018. Its results reshaped our understanding of how many planets exist and set the stage for follow-up surveys.",
        ],
      },
    ],
    sources: ["nasa"],
    relatedEntries: [
      ["astronomy", "space-telescopes", "tess"],
      ["astronomy", "space-telescopes", "james-webb-space-telescope"],
    ],
    relatedCategories: [["astronomy", "exoplanets"]],
  },
  {
    section: "astronomy",
    category: "space-telescopes",
    slug: "tess",
    title: "TESS",
    shortTitle: "TESS",
    description:
      "TESS, the Transiting Exoplanet Survey Satellite, is a NASA telescope that surveys bright, nearby stars across nearly the whole sky to find transiting exoplanets.",
    excerpt: "NASA's all-sky survey for nearby exoplanets.",
    kind: "science",
    difficulty: "intermediate",
    tags: ["TESS", "exoplanets", "transit method", "NASA"],
    facts: [
      { label: "Full name", value: "Transiting Exoplanet Survey Satellite" },
      { label: "Agency", value: "NASA" },
      { label: "Method", value: "Transit photometry" },
      { label: "Coverage", value: "Bright stars across most of the sky" },
    ],
    keyPoints: [
      "Surveys bright, relatively nearby stars across nearly the entire sky.",
      "Finds exoplanets by the transit method, like Kepler.",
      "Its targets are well suited to follow-up by other telescopes.",
    ],
    body: [
      {
        heading: "An all-sky planet hunter",
        paragraphs: [
          "TESS, the Transiting Exoplanet Survey Satellite, scans large swaths of the sky in turn, monitoring bright, nearby stars for the telltale dips of transiting planets.",
        ],
      },
      {
        heading: "Choosing bright stars",
        paragraphs: [
          "By focusing on relatively bright, nearby stars, TESS finds planets that are easier for other observatories — including the James Webb Space Telescope — to study in detail afterward.",
        ],
      },
      {
        heading: "Building on Kepler",
        paragraphs: [
          "Where Kepler stared deeply at one region to measure how common planets are, TESS surveys the whole sky to find the nearest and best examples for further investigation.",
        ],
      },
    ],
    sources: ["nasa"],
    relatedEntries: [
      ["astronomy", "space-telescopes", "kepler-space-telescope"],
      ["astronomy", "space-missions", "parker-solar-probe"],
    ],
    relatedCategories: [["astronomy", "exoplanets"]],
  },
]);
