import { defineEntries } from "@/lib/content/entry-types";

/**
 * Astronomy / Planets — the eight planets of the Solar System.
 *
 * Strictly scientific. These entries deliberately do NOT link to the astrology
 * "planet meanings" entries: keeping the science/tradition boundary intact
 * matters more than cross-navigation. Numeric claims are limited to canonical
 * facts (orbital order, "largest/smallest"); detailed measurements are left to
 * sourced future expansion.
 */
export const astronomyPlanets = defineEntries([
  {
    section: "astronomy",
    category: "planets",
    slug: "mercury",
    title: "Mercury",
    description:
      "Mercury is the smallest planet and the closest to the Sun — an airless, heavily cratered world of extreme temperature swings.",
    excerpt: "The smallest planet, closest to the Sun.",
    kind: "science",
    difficulty: "beginner",
    tags: ["terrestrial planet", "inner solar system", "Solar System"],
    facts: [
      { label: "Order from Sun", value: "First planet" },
      { label: "Type", value: "Terrestrial (rocky) planet" },
      { label: "Size", value: "Smallest planet in the Solar System" },
      { label: "Atmosphere", value: "Only an extremely thin exosphere" },
    ],
    keyPoints: [
      "The innermost and smallest planet.",
      "Has almost no atmosphere, so temperatures swing wildly between day and night.",
      "Its surface is heavily cratered, recording a long history of impacts.",
    ],
    body: [
      {
        heading: "The innermost planet",
        paragraphs: [
          "Mercury orbits closer to the Sun than any other planet and is the smallest of the eight. It is a rocky, terrestrial world with a large metallic core relative to its size.",
        ],
      },
      {
        heading: "A world of extremes",
        paragraphs: [
          "With essentially no atmosphere to trap or redistribute heat, Mercury experiences enormous differences between its sunlit and night sides. Its cratered, Moon-like surface preserves the scars of ancient impacts.",
        ],
      },
      {
        heading: "Hard to observe",
        paragraphs: [
          "Because it never strays far from the Sun in our sky, Mercury is best seen low on the horizon during twilight, and only briefly. Spacecraft have provided most of our detailed knowledge of it.",
        ],
      },
    ],
    sources: ["nasa", "jpl"],
    relatedEntries: [
      ["astronomy", "planets", "venus"],
      ["astronomy", "planets", "earth"],
    ],
    relatedCategories: [["astronomy", "space-missions"]],
  },
  {
    section: "astronomy",
    category: "planets",
    slug: "venus",
    title: "Venus",
    description:
      "Venus is the second planet from the Sun — similar in size to Earth but wrapped in a thick carbon-dioxide atmosphere that makes it the hottest planet.",
    excerpt: "Earth's size, but a scorching greenhouse world.",
    kind: "science",
    difficulty: "beginner",
    tags: ["terrestrial planet", "greenhouse effect", "inner solar system"],
    facts: [
      { label: "Order from Sun", value: "Second planet" },
      { label: "Type", value: "Terrestrial (rocky) planet" },
      { label: "Atmosphere", value: "Thick carbon dioxide with sulfuric-acid clouds" },
      { label: "Note", value: "Hottest planetary surface in the Solar System" },
    ],
    keyPoints: [
      "Close to Earth in size, but utterly different at the surface.",
      "A runaway greenhouse effect makes it the hottest planet.",
      "Often the brightest planet in our sky, seen near sunrise or sunset.",
    ],
    body: [
      {
        heading: "Earth's hot twin",
        paragraphs: [
          "Venus is the second planet from the Sun and close to Earth in size and composition. There the similarity ends: a dense atmosphere of carbon dioxide traps heat through a runaway greenhouse effect, giving Venus the hottest surface of any planet.",
        ],
      },
      {
        heading: "A shrouded surface",
        paragraphs: [
          "Thick clouds of sulfuric acid hide the surface from view in visible light. Radar mapping from spacecraft revealed a landscape of volcanic plains and highlands beneath the clouds.",
        ],
      },
      {
        heading: "The 'morning' and 'evening star'",
        paragraphs: [
          "Venus is frequently the brightest planet in our sky and is often called the morning or evening star, appearing brilliant near the horizon around sunrise or sunset.",
        ],
      },
    ],
    sources: ["nasa", "jpl"],
    relatedEntries: [
      ["astronomy", "planets", "mercury"],
      ["astronomy", "planets", "earth"],
    ],
    relatedCategories: [["astronomy", "space-missions"]],
  },
  {
    section: "astronomy",
    category: "planets",
    slug: "earth",
    title: "Earth",
    description:
      "Earth is the third planet from the Sun and the only world known to support life, with abundant liquid water and a protective atmosphere.",
    excerpt: "The third planet — and the only known home of life.",
    kind: "science",
    difficulty: "beginner",
    tags: ["terrestrial planet", "habitability", "home planet"],
    facts: [
      { label: "Order from Sun", value: "Third planet" },
      { label: "Type", value: "Terrestrial (rocky) planet" },
      { label: "Moons", value: "One (the Moon)" },
      { label: "Distinction", value: "Only known world with life" },
    ],
    keyPoints: [
      "The only planet known to host life.",
      "Has stable liquid water at the surface and a protective atmosphere.",
      "Accompanied by a single large natural satellite, the Moon.",
    ],
    body: [
      {
        heading: "Our home world",
        paragraphs: [
          "Earth is the third planet from the Sun and, so far, the only place in the universe known to support life. Liquid water, a breathable atmosphere, and a moderate climate set it apart from its neighbors.",
        ],
      },
      {
        heading: "A protected, active planet",
        paragraphs: [
          "Earth's magnetic field and atmosphere shield the surface from much of the Sun's harmful radiation. Plate tectonics, oceans, and a living biosphere continually reshape the planet.",
        ],
      },
      {
        heading: "Earth and its Moon",
        paragraphs: [
          "Earth has one large natural satellite, the Moon, which stabilizes the planet's tilt and drives the tides. Studying Earth from space has transformed how we understand our place in the Solar System.",
        ],
      },
    ],
    sources: ["nasa", "esa"],
    relatedEntries: [
      ["astronomy", "planets", "venus"],
      ["astronomy", "planets", "mars"],
    ],
    relatedCategories: [["astronomy", "moons"]],
  },
  {
    section: "astronomy",
    category: "planets",
    slug: "mars",
    title: "Mars",
    description:
      "Mars is the fourth planet from the Sun — the 'Red Planet', a cold desert world with a thin atmosphere, polar ice, and the largest volcano in the Solar System.",
    excerpt: "The Red Planet, a cold desert world.",
    kind: "science",
    difficulty: "beginner",
    tags: ["terrestrial planet", "Red Planet", "exploration"],
    facts: [
      { label: "Order from Sun", value: "Fourth planet" },
      { label: "Type", value: "Terrestrial (rocky) planet" },
      { label: "Color", value: "Reddish, from iron-oxide dust" },
      { label: "Moons", value: "Two small moons, Phobos and Deimos" },
    ],
    keyPoints: [
      "Nicknamed the Red Planet for its rusty, iron-rich dust.",
      "Has a thin atmosphere, polar ice caps, and ancient river-like channels.",
      "A primary target in the search for past habitable conditions.",
    ],
    body: [
      {
        heading: "The Red Planet",
        paragraphs: [
          "Mars is the fourth planet from the Sun, a cold desert world whose surface is colored red by iron-oxide ('rust') dust. It has a thin atmosphere, seasons, and polar caps of ice.",
        ],
      },
      {
        heading: "A dramatic landscape",
        paragraphs: [
          "Mars hosts towering volcanoes — including Olympus Mons, the largest known volcano in the Solar System — and vast canyon systems. Channels carved long ago suggest liquid water once flowed there.",
        ],
      },
      {
        heading: "The most explored planet",
        paragraphs: [
          "Beyond Earth, Mars is the most intensively explored planet, with orbiters, landers, and rovers studying its geology and climate and searching for signs of past habitability. It has two small moons, Phobos and Deimos.",
        ],
      },
    ],
    sources: ["nasa", "jpl"],
    relatedEntries: [
      ["astronomy", "planets", "earth"],
      ["astronomy", "planets", "jupiter"],
    ],
    relatedCategories: [
      ["astronomy", "space-missions"],
      ["astronomy", "moons"],
    ],
  },
  {
    section: "astronomy",
    category: "planets",
    slug: "jupiter",
    title: "Jupiter",
    description:
      "Jupiter is the largest planet in the Solar System — a giant ball of gas with a banded atmosphere, the Great Red Spot, and dozens of moons.",
    excerpt: "The largest planet — a banded gas giant.",
    kind: "science",
    difficulty: "beginner",
    tags: ["gas giant", "outer solar system", "Galilean moons"],
    facts: [
      { label: "Order from Sun", value: "Fifth planet" },
      { label: "Type", value: "Gas giant" },
      { label: "Size", value: "Largest planet in the Solar System" },
      { label: "Famous feature", value: "The Great Red Spot, a long-lived storm" },
    ],
    keyPoints: [
      "By far the largest and most massive planet.",
      "A gas giant with colorful cloud bands and a giant storm, the Great Red Spot.",
      "Has a large family of moons, including the four big Galilean moons.",
    ],
    body: [
      {
        heading: "King of the planets",
        paragraphs: [
          "Jupiter is the largest planet in the Solar System — a gas giant more massive than all the other planets combined. It has no solid surface; its visible 'surface' is the top of a deep, turbulent atmosphere.",
        ],
      },
      {
        heading: "Bands and the Great Red Spot",
        paragraphs: [
          "Jupiter's atmosphere is organized into colorful bands of clouds driven by powerful winds. Its most famous feature is the Great Red Spot, an enormous storm that has persisted for a very long time.",
        ],
      },
      {
        heading: "A system of moons",
        paragraphs: [
          "Jupiter is orbited by a large number of moons. The four largest — Io, Europa, Ganymede, and Callisto — were discovered by Galileo and are called the Galilean moons; Europa in particular is studied for its subsurface ocean.",
        ],
      },
    ],
    sources: ["nasa", "jpl"],
    relatedEntries: [
      ["astronomy", "planets", "saturn"],
      ["astronomy", "planets", "mars"],
    ],
    relatedCategories: [
      ["astronomy", "moons"],
      ["astronomy", "space-missions"],
    ],
  },
  {
    section: "astronomy",
    category: "planets",
    slug: "saturn",
    title: "Saturn",
    description:
      "Saturn is the sixth planet from the Sun — a gas giant famous for its spectacular ring system and its large, varied family of moons.",
    excerpt: "The ringed gas giant.",
    kind: "science",
    difficulty: "beginner",
    tags: ["gas giant", "rings", "Titan", "outer solar system"],
    facts: [
      { label: "Order from Sun", value: "Sixth planet" },
      { label: "Type", value: "Gas giant" },
      { label: "Famous feature", value: "Prominent ring system" },
      { label: "Notable moon", value: "Titan, which has a thick atmosphere" },
    ],
    keyPoints: [
      "Renowned for its bright, broad ring system of ice and rock.",
      "A gas giant, second in size only to Jupiter.",
      "Its moon Titan has a dense atmosphere and surface lakes of liquid methane.",
    ],
    body: [
      {
        heading: "The ringed planet",
        paragraphs: [
          "Saturn is the sixth planet from the Sun and the most visually striking, encircled by a broad, bright ring system made of countless particles of ice and rock. The rings are easily seen through a small telescope.",
        ],
      },
      {
        heading: "A giant of gas",
        paragraphs: [
          "Like Jupiter, Saturn is a gas giant with no solid surface and a deep atmosphere of hydrogen and helium. It is the second-largest planet in the Solar System.",
        ],
      },
      {
        heading: "Moons and Titan",
        paragraphs: [
          "Saturn has many moons. The largest, Titan, is bigger than the planet Mercury and has a thick atmosphere and lakes of liquid methane, making it one of the most intriguing worlds in the Solar System.",
        ],
      },
    ],
    sources: ["nasa", "jpl"],
    relatedEntries: [
      ["astronomy", "planets", "jupiter"],
      ["astronomy", "planets", "uranus"],
    ],
    relatedCategories: [
      ["astronomy", "moons"],
      ["astronomy", "space-missions"],
    ],
  },
  {
    section: "astronomy",
    category: "planets",
    slug: "uranus",
    title: "Uranus",
    description:
      "Uranus is the seventh planet from the Sun — an ice giant with a pale blue-green color that famously rotates tipped almost entirely on its side.",
    excerpt: "The sideways-spinning ice giant.",
    kind: "science",
    difficulty: "intermediate",
    tags: ["ice giant", "axial tilt", "outer solar system"],
    facts: [
      { label: "Order from Sun", value: "Seventh planet" },
      { label: "Type", value: "Ice giant" },
      { label: "Color", value: "Pale blue-green" },
      { label: "Feature", value: "Extreme axial tilt — rotates on its side" },
    ],
    keyPoints: [
      "An ice giant, distinct from the gas giants Jupiter and Saturn.",
      "Tipped on its side, so its poles take turns facing the Sun.",
      "Its blue-green color comes from methane in the atmosphere.",
    ],
    body: [
      {
        heading: "An ice giant",
        paragraphs: [
          "Uranus is the seventh planet from the Sun and the first of the two 'ice giants', whose interiors contain more icy materials than the hydrogen-helium gas giants. Methane in its atmosphere gives it a pale blue-green color.",
        ],
      },
      {
        heading: "Spinning on its side",
        paragraphs: [
          "Uranus is unique for its extreme axial tilt: it is tipped over so far that it essentially rolls along its orbit on its side. This produces extreme seasons, with each pole facing the Sun for long stretches.",
        ],
      },
      {
        heading: "A distant, faint world",
        paragraphs: [
          "At the edge of naked-eye visibility under dark skies, Uranus was the first planet discovered with a telescope. It has a system of faint rings and numerous moons.",
        ],
      },
    ],
    sources: ["nasa", "jpl"],
    relatedEntries: [
      ["astronomy", "planets", "neptune"],
      ["astronomy", "planets", "saturn"],
    ],
    relatedCategories: [["astronomy", "moons"]],
  },
  {
    section: "astronomy",
    category: "planets",
    slug: "neptune",
    title: "Neptune",
    description:
      "Neptune is the eighth and farthest major planet from the Sun — a deep-blue ice giant with powerful winds and the large moon Triton.",
    excerpt: "The deep-blue, windy ice giant at the edge.",
    kind: "science",
    difficulty: "intermediate",
    tags: ["ice giant", "outer solar system", "Triton"],
    facts: [
      { label: "Order from Sun", value: "Eighth planet" },
      { label: "Type", value: "Ice giant" },
      { label: "Color", value: "Deep blue" },
      { label: "Notable moon", value: "Triton, which orbits backward" },
    ],
    keyPoints: [
      "The farthest of the eight planets from the Sun.",
      "An ice giant with some of the strongest winds in the Solar System.",
      "Its large moon Triton orbits in the 'wrong' direction, suggesting it was captured.",
    ],
    body: [
      {
        heading: "The outermost planet",
        paragraphs: [
          "Neptune is the eighth and farthest major planet from the Sun. A deep-blue ice giant, it is similar in size and makeup to Uranus and lies far out in the cold outer Solar System.",
        ],
      },
      {
        heading: "A stormy atmosphere",
        paragraphs: [
          "Despite its great distance from the Sun, Neptune has an active, dynamic atmosphere with some of the fastest winds measured on any planet, along with large dark storm systems.",
        ],
      },
      {
        heading: "Discovery and Triton",
        paragraphs: [
          "Neptune was the first planet found through mathematical prediction rather than chance observation. Its largest moon, Triton, orbits in the opposite direction to Neptune's rotation, a strong hint that it was captured from elsewhere.",
        ],
      },
    ],
    sources: ["nasa", "jpl"],
    relatedEntries: [
      ["astronomy", "planets", "uranus"],
      ["astronomy", "dwarf-planets", "pluto"],
    ],
    relatedCategories: [["astronomy", "moons"]],
  },
]);
