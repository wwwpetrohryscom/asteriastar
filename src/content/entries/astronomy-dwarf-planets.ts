import { defineEntries } from "@/lib/content/entry-types";

/**
 * Astronomy / Dwarf Planets — the recognized dwarf planets.
 *
 * Factual and source-ready. Dates given (e.g. Pluto's 2006 reclassification,
 * the 2015 New Horizons flyby) are well-documented historical facts.
 */
export const astronomyDwarfPlanets = defineEntries([
  {
    section: "astronomy",
    category: "dwarf-planets",
    slug: "pluto",
    title: "Pluto",
    description:
      "Pluto is the best-known dwarf planet — a small, icy world in the Kuiper Belt, reclassified from planet to dwarf planet in 2006 and explored up close in 2015.",
    excerpt: "The most famous dwarf planet, in the Kuiper Belt.",
    kind: "science",
    difficulty: "beginner",
    tags: ["dwarf planet", "Kuiper Belt", "New Horizons", "Charon"],
    facts: [
      { label: "Location", value: "Kuiper Belt, beyond Neptune" },
      { label: "Classification", value: "Reclassified as a dwarf planet in 2006 (IAU)" },
      { label: "Largest moon", value: "Charon" },
      { label: "Explored by", value: "NASA's New Horizons (2015 flyby)" },
    ],
    keyPoints: [
      "Once counted as the ninth planet; reclassified as a dwarf planet in 2006.",
      "A small, icy body in the Kuiper Belt beyond Neptune.",
      "Visited by New Horizons in 2015, revealing surprisingly varied terrain.",
    ],
    body: [
      {
        heading: "From planet to dwarf planet",
        paragraphs: [
          "Pluto was discovered in 1930 and long regarded as the ninth planet. In 2006 the International Astronomical Union adopted a formal definition of 'planet'; Pluto did not meet the criterion of clearing its orbital neighborhood and was reclassified as a dwarf planet.",
        ],
      },
      {
        heading: "An icy Kuiper Belt world",
        paragraphs: [
          "Pluto orbits in the Kuiper Belt, a region of icy bodies beyond Neptune. It has a thin atmosphere and a system of moons, the largest of which, Charon, is so big relative to Pluto that the two orbit a point between them.",
        ],
      },
      {
        heading: "Seen up close",
        paragraphs: [
          "NASA's New Horizons spacecraft flew past Pluto in 2015, transforming it from a blurry dot into a detailed world with mountains of ice, smooth plains, and a famous heart-shaped region.",
        ],
      },
    ],
    sources: ["nasa", "iau", "jpl"],
    relatedEntries: [
      ["astronomy", "dwarf-planets", "eris"],
      ["astronomy", "dwarf-planets", "ceres"],
      ["astronomy", "planets", "neptune"],
    ],
    relatedCategories: [["astronomy", "space-missions"]],
  },
  {
    section: "astronomy",
    category: "dwarf-planets",
    slug: "ceres",
    title: "Ceres",
    description:
      "Ceres is the largest object in the asteroid belt and the only dwarf planet in the inner Solar System, studied up close by NASA's Dawn mission.",
    excerpt: "The largest body in the asteroid belt.",
    kind: "science",
    difficulty: "intermediate",
    tags: ["dwarf planet", "asteroid belt", "Dawn mission"],
    facts: [
      { label: "Location", value: "Asteroid belt, between Mars and Jupiter" },
      { label: "Distinction", value: "Largest object in the asteroid belt" },
      { label: "Classification", value: "The only dwarf planet in the inner Solar System" },
      { label: "Explored by", value: "NASA's Dawn mission" },
    ],
    keyPoints: [
      "The largest body in the asteroid belt — round enough to be a dwarf planet.",
      "The only dwarf planet located in the inner Solar System.",
      "Dawn revealed bright deposits thought to be salts left by briny water.",
    ],
    body: [
      {
        heading: "Belt giant and dwarf planet",
        paragraphs: [
          "Ceres is by far the largest object in the asteroid belt between Mars and Jupiter. It is large enough that its own gravity pulled it into a round shape, which is why it is classified as a dwarf planet rather than an asteroid.",
        ],
      },
      {
        heading: "An icy interior",
        paragraphs: [
          "Unlike rocky asteroids, Ceres contains a significant amount of water ice and may have once held subsurface brine. This makes it an interesting target for understanding water in the early Solar System.",
        ],
      },
      {
        heading: "The Dawn mission",
        paragraphs: [
          "NASA's Dawn spacecraft orbited Ceres and mapped its surface in detail, finding striking bright spots — concentrations of salts — and a solitary tall mountain, hinting at past geological activity.",
        ],
      },
    ],
    sources: ["nasa", "iau", "jpl"],
    relatedEntries: [
      ["astronomy", "dwarf-planets", "pluto"],
      ["astronomy", "planets", "mars"],
    ],
    relatedCategories: [
      ["astronomy", "asteroids"],
      ["astronomy", "space-missions"],
    ],
  },
  {
    section: "astronomy",
    category: "dwarf-planets",
    slug: "eris",
    title: "Eris",
    description:
      "Eris is a distant, massive dwarf planet whose discovery helped prompt the formal definition of 'planet' and the creation of the dwarf-planet category.",
    excerpt: "The distant dwarf planet that reshaped the definitions.",
    kind: "science",
    difficulty: "intermediate",
    tags: ["dwarf planet", "scattered disk", "trans-Neptunian"],
    facts: [
      { label: "Location", value: "Scattered disk, far beyond Neptune" },
      { label: "Mass", value: "Among the most massive known dwarf planets" },
      { label: "Moon", value: "Dysnomia" },
      { label: "Significance", value: "Its discovery spurred the 2006 planet definition" },
    ],
    keyPoints: [
      "A very distant and massive dwarf planet.",
      "Its discovery triggered the debate that redefined 'planet' in 2006.",
      "Has a moon named Dysnomia.",
    ],
    body: [
      {
        heading: "A distant, massive body",
        paragraphs: [
          "Eris is a dwarf planet in the scattered disk, a region of icy bodies on far-flung orbits beyond the main Kuiper Belt. It is one of the most massive dwarf planets known, comparable to Pluto.",
        ],
      },
      {
        heading: "Why Eris mattered",
        paragraphs: [
          "Because Eris rivaled Pluto in size and mass, its discovery forced astronomers to decide whether such bodies should be called planets. The result was the 2006 definition that created the 'dwarf planet' category and reclassified Pluto.",
        ],
      },
      {
        heading: "Eris and Dysnomia",
        paragraphs: [
          "Eris has a small moon, Dysnomia, whose orbit allowed astronomers to measure Eris's mass precisely. Eris remains one of the most distant readily studied objects of the Solar System.",
        ],
      },
    ],
    sources: ["nasa", "iau"],
    relatedEntries: [
      ["astronomy", "dwarf-planets", "pluto"],
      ["astronomy", "dwarf-planets", "makemake"],
    ],
    relatedCategories: [["astronomy", "dwarf-planets"]],
  },
  {
    section: "astronomy",
    category: "dwarf-planets",
    slug: "haumea",
    title: "Haumea",
    description:
      "Haumea is an unusual dwarf planet in the Kuiper Belt, spinning so fast that it is stretched into an egg-like shape, and notable for having rings and moons.",
    excerpt: "The fast-spinning, egg-shaped dwarf planet.",
    kind: "science",
    difficulty: "advanced",
    tags: ["dwarf planet", "Kuiper Belt", "rapid rotation", "ring system"],
    facts: [
      { label: "Location", value: "Kuiper Belt, beyond Neptune" },
      { label: "Shape", value: "Elongated by very fast rotation" },
      { label: "Rings", value: "Has a ring system" },
      { label: "Moons", value: "Two known moons" },
    ],
    keyPoints: [
      "Spins so rapidly that it is stretched into an elongated, egg-like shape.",
      "One of the few small bodies known to have a ring.",
      "Has two small moons.",
    ],
    body: [
      {
        heading: "A spinning oddity",
        paragraphs: [
          "Haumea is a dwarf planet in the Kuiper Belt with one of the fastest rotations of any large body in the Solar System. Its rapid spin distorts it into an elongated, egg-like shape rather than a sphere.",
        ],
      },
      {
        heading: "Rings and moons",
        paragraphs: [
          "Haumea is notable for having a ring — a feature once thought to belong only to the giant planets — as well as two small moons. These suggest a violent past, perhaps a major collision.",
        ],
      },
      {
        heading: "A distant, icy world",
        paragraphs: [
          "Far out beyond Neptune, Haumea is cold and icy, with a surface that appears to be coated in bright water ice. It is one of the more unusual members of the dwarf-planet family.",
        ],
      },
    ],
    sources: ["nasa", "iau"],
    relatedEntries: [
      ["astronomy", "dwarf-planets", "makemake"],
      ["astronomy", "dwarf-planets", "pluto"],
    ],
    relatedCategories: [["astronomy", "dwarf-planets"]],
  },
  {
    section: "astronomy",
    category: "dwarf-planets",
    slug: "makemake",
    title: "Makemake",
    description:
      "Makemake is one of the largest dwarf planets in the Kuiper Belt, a bright, icy world far beyond Neptune with at least one small moon.",
    excerpt: "A large, bright dwarf planet of the Kuiper Belt.",
    kind: "science",
    difficulty: "advanced",
    tags: ["dwarf planet", "Kuiper Belt", "trans-Neptunian"],
    facts: [
      { label: "Location", value: "Kuiper Belt, beyond Neptune" },
      { label: "Size", value: "One of the larger Kuiper Belt objects" },
      { label: "Surface", value: "Bright and icy" },
      { label: "Moon", value: "At least one known small moon" },
    ],
    keyPoints: [
      "Among the largest objects in the Kuiper Belt.",
      "Has a bright, icy surface.",
      "Accompanied by at least one small, dark moon.",
    ],
    body: [
      {
        heading: "A bright Kuiper Belt world",
        paragraphs: [
          "Makemake is one of the largest dwarf planets in the Kuiper Belt, the ring of icy bodies beyond Neptune. It has a relatively bright surface, suggesting fresh ices.",
        ],
      },
      {
        heading: "A distant, cold object",
        paragraphs: [
          "Orbiting far from the Sun, Makemake is extremely cold. Its surface composition is studied through the light it reflects, since no spacecraft has visited it.",
        ],
      },
      {
        heading: "A small companion",
        paragraphs: [
          "Astronomers have detected at least one small, faint moon orbiting Makemake, which helps in estimating the dwarf planet's properties.",
        ],
      },
    ],
    sources: ["nasa", "iau"],
    relatedEntries: [
      ["astronomy", "dwarf-planets", "haumea"],
      ["astronomy", "dwarf-planets", "eris"],
    ],
    relatedCategories: [["astronomy", "dwarf-planets"]],
  },
]);
