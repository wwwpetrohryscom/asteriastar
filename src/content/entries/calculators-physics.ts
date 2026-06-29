import { defineEntries } from "@/lib/content/entry-types";

/**
 * Calculators / Physics — science-based calculator *landing pages*.
 *
 * IMPORTANT: these do NOT compute results in this phase. Each explains the
 * concept and the real, source-ready physical values the future interactive
 * tool will use (orbital periods, surface gravities), and states plainly that
 * the interactive version is planned. No fabricated outputs. kind = "tool".
 */
export const calculatorsPhysics = defineEntries([
  {
    section: "calculators",
    category: "physics",
    slug: "age-on-mars",
    title: "Age on Mars",
    description:
      "How to work out your age in Martian years: because Mars takes about 687 Earth days to orbit the Sun, a Mars year is nearly twice an Earth year.",
    excerpt: "Your age in Mars years — the concept and the science.",
    kind: "tool",
    difficulty: "beginner",
    tags: ["Mars", "orbital period", "fun science"],
    facts: [
      { label: "Mars year", value: "About 687 Earth days" },
      { label: "Relative length", value: "Nearly 1.9 Earth years" },
      { label: "Basis", value: "Mars's orbital period around the Sun" },
      { label: "Tool status", value: "Interactive calculator planned (not live yet)" },
    ],
    keyPoints: [
      "A Mars year is the time Mars takes to orbit the Sun once — about 687 Earth days.",
      "Your age in Mars years is roughly your Earth age divided by 1.9.",
      "This page explains the method; the interactive calculator is in development.",
    ],
    body: [
      {
        heading: "The idea",
        paragraphs: [
          "Your age is just a count of how many times your planet has gone around the Sun since you were born. On Mars, which takes longer to circle the Sun than Earth does, fewer of those orbits have passed — so your 'Martian age' is smaller than your Earth age.",
        ],
      },
      {
        heading: "The science behind it",
        paragraphs: [
          "Mars completes one orbit of the Sun in about 687 Earth days, nearly 1.9 Earth years. To convert, the calculator will take your age in Earth days and divide by the length of a Mars year. These orbital values come from published planetary data.",
        ],
      },
      {
        heading: "About this tool",
        paragraphs: [
          "The interactive version of this calculator is planned and is not live yet — this page does not compute a result. When it launches it will use the real orbital period above, with no guesswork.",
        ],
      },
    ],
    sources: ["nasa", "jpl"],
    relatedEntries: [
      ["calculators", "physics", "age-on-jupiter"],
      ["calculators", "physics", "age-on-venus"],
    ],
    relatedCategories: [["astronomy", "planets"]],
  },
  {
    section: "calculators",
    category: "physics",
    slug: "age-on-venus",
    title: "Age on Venus",
    description:
      "How to find your age in Venusian years: Venus orbits the Sun in about 225 Earth days, so a Venus year is shorter than an Earth year.",
    excerpt: "Your age in Venus years — the concept and the science.",
    kind: "tool",
    difficulty: "beginner",
    tags: ["Venus", "orbital period", "fun science"],
    facts: [
      { label: "Venus year", value: "About 225 Earth days" },
      { label: "Relative length", value: "Shorter than an Earth year" },
      { label: "Basis", value: "Venus's orbital period around the Sun" },
      { label: "Tool status", value: "Interactive calculator planned (not live yet)" },
    ],
    keyPoints: [
      "Venus orbits the Sun in about 225 Earth days.",
      "Because its year is shorter, your Venus age is larger than your Earth age.",
      "This page explains the method; the calculator itself is planned.",
    ],
    body: [
      {
        heading: "The idea",
        paragraphs: [
          "A 'year' on any planet is one trip around the Sun. Venus makes that trip faster than Earth, so more Venusian years fit into your life — your age in Venus years is larger than your age in Earth years.",
        ],
      },
      {
        heading: "The science behind it",
        paragraphs: [
          "Venus completes an orbit in about 225 Earth days. The planned calculator will divide your age in Earth days by the length of a Venus year to give your Venusian age, using published orbital data.",
        ],
      },
      {
        heading: "About this tool",
        paragraphs: [
          "This is an explanatory landing page; the interactive calculator is in development and does not yet compute a result.",
        ],
      },
    ],
    sources: ["nasa", "jpl"],
    relatedEntries: [
      ["calculators", "physics", "age-on-mars"],
      ["calculators", "physics", "age-on-mercury"],
    ],
    relatedCategories: [["astronomy", "planets"]],
  },
  {
    section: "calculators",
    category: "physics",
    slug: "age-on-mercury",
    title: "Age on Mercury",
    description:
      "How to find your age in Mercury years: Mercury races around the Sun in only about 88 Earth days, so many Mercury years pass in a single lifetime.",
    excerpt: "Your age in Mercury years — the concept and the science.",
    kind: "tool",
    difficulty: "beginner",
    tags: ["Mercury", "orbital period", "fun science"],
    facts: [
      { label: "Mercury year", value: "About 88 Earth days" },
      { label: "Relative length", value: "The shortest planetary year" },
      { label: "Basis", value: "Mercury's orbital period around the Sun" },
      { label: "Tool status", value: "Interactive calculator planned (not live yet)" },
    ],
    keyPoints: [
      "Mercury orbits the Sun in only about 88 Earth days — the fastest of all the planets.",
      "Because its year is so short, your Mercury age is many times your Earth age.",
      "This page explains the method; the calculator itself is planned.",
    ],
    body: [
      {
        heading: "The idea",
        paragraphs: [
          "Mercury is the innermost planet and orbits the Sun far faster than Earth. With such a short year, a great many Mercury years pass during a single human lifetime.",
        ],
      },
      {
        heading: "The science behind it",
        paragraphs: [
          "Mercury completes an orbit in about 88 Earth days. The planned calculator will divide your age in Earth days by that figure to give your age in Mercury years, based on published orbital data.",
        ],
      },
      {
        heading: "About this tool",
        paragraphs: [
          "This page explains the concept only. The interactive calculator is in development and does not yet produce a result.",
        ],
      },
    ],
    sources: ["nasa", "jpl"],
    relatedEntries: [
      ["calculators", "physics", "age-on-venus"],
      ["calculators", "physics", "age-on-mars"],
    ],
    relatedCategories: [["astronomy", "planets"]],
  },
  {
    section: "calculators",
    category: "physics",
    slug: "age-on-jupiter",
    title: "Age on Jupiter",
    description:
      "How to find your age in Jupiter years: Jupiter takes about 12 Earth years to orbit the Sun, so a lifetime spans only a handful of Jupiter years.",
    excerpt: "Your age in Jupiter years — the concept and the science.",
    kind: "tool",
    difficulty: "beginner",
    tags: ["Jupiter", "orbital period", "fun science"],
    facts: [
      { label: "Jupiter year", value: "About 12 Earth years" },
      { label: "Relative length", value: "Much longer than an Earth year" },
      { label: "Basis", value: "Jupiter's orbital period around the Sun" },
      { label: "Tool status", value: "Interactive calculator planned (not live yet)" },
    ],
    keyPoints: [
      "Jupiter takes about 12 Earth years to orbit the Sun once.",
      "Because its year is so long, your Jupiter age is only a fraction of your Earth age.",
      "This page explains the method; the calculator itself is planned.",
    ],
    body: [
      {
        heading: "The idea",
        paragraphs: [
          "The giant planet Jupiter orbits the Sun slowly compared with Earth, so very few Jupiter years pass in a human lifetime — making your Jupiter age strikingly small.",
        ],
      },
      {
        heading: "The science behind it",
        paragraphs: [
          "Jupiter completes one orbit in roughly 12 Earth years. The planned calculator will divide your Earth age by that figure to express your age in Jupiter years, using published orbital data.",
        ],
      },
      {
        heading: "About this tool",
        paragraphs: [
          "This is an explanatory page; the interactive calculator is in development and does not yet compute a result.",
        ],
      },
    ],
    sources: ["nasa", "jpl"],
    relatedEntries: [
      ["calculators", "physics", "age-on-mars"],
      ["calculators", "physics", "age-on-mercury"],
    ],
    relatedCategories: [["astronomy", "planets"]],
  },
  {
    section: "calculators",
    category: "physics",
    slug: "weight-on-moon",
    title: "Weight on the Moon",
    shortTitle: "Weight on Moon",
    description:
      "How to find your weight on the Moon: lunar surface gravity is about one-sixth of Earth's, so you would weigh roughly a sixth as much while your mass is unchanged.",
    excerpt: "Your weight on the Moon — the concept and the science.",
    kind: "tool",
    difficulty: "beginner",
    tags: ["Moon", "gravity", "weight vs mass", "fun science"],
    facts: [
      { label: "Lunar gravity", value: "About 1/6 of Earth's surface gravity" },
      { label: "Your weight", value: "Roughly one-sixth of your Earth weight" },
      { label: "Your mass", value: "Unchanged — only weight differs" },
      { label: "Tool status", value: "Interactive calculator planned (not live yet)" },
    ],
    keyPoints: [
      "Weight depends on gravity; mass does not change when you travel.",
      "The Moon's surface gravity is about one-sixth of Earth's.",
      "So on the Moon you would weigh roughly a sixth of your Earth weight.",
    ],
    body: [
      {
        heading: "Weight versus mass",
        paragraphs: [
          "Mass is how much matter you are made of and does not change when you travel. Weight is the force of gravity on that mass, so it changes from world to world. On a lower-gravity world you weigh less but contain exactly as much matter.",
        ],
      },
      {
        heading: "The science behind it",
        paragraphs: [
          "The Moon's surface gravity is about one-sixth of Earth's. The planned calculator will multiply your Earth weight by that factor to estimate your weight on the Moon, using published values.",
        ],
      },
      {
        heading: "About this tool",
        paragraphs: [
          "This page explains the concept only; the interactive calculator is in development and does not yet produce a result.",
        ],
      },
    ],
    sources: ["nasa"],
    relatedEntries: [
      ["calculators", "physics", "weight-on-mars"],
      ["calculators", "physics", "age-on-mars"],
    ],
    relatedCategories: [["astronomy", "moons"]],
  },
  {
    section: "calculators",
    category: "physics",
    slug: "weight-on-mars",
    title: "Weight on Mars",
    description:
      "How to find your weight on Mars: Martian surface gravity is about 38% of Earth's, so you would weigh a little over a third as much while your mass stays the same.",
    excerpt: "Your weight on Mars — the concept and the science.",
    kind: "tool",
    difficulty: "beginner",
    tags: ["Mars", "gravity", "weight vs mass", "fun science"],
    facts: [
      { label: "Martian gravity", value: "About 38% of Earth's surface gravity" },
      { label: "Your weight", value: "A little over a third of your Earth weight" },
      { label: "Your mass", value: "Unchanged — only weight differs" },
      { label: "Tool status", value: "Interactive calculator planned (not live yet)" },
    ],
    keyPoints: [
      "Mars's surface gravity is about 38% of Earth's.",
      "So on Mars you would weigh a little over a third of your Earth weight.",
      "Your mass stays the same — only your weight changes.",
    ],
    body: [
      {
        heading: "Weight versus mass",
        paragraphs: [
          "Your mass is fixed wherever you go; your weight is the pull of gravity on it. On Mars, where gravity is weaker than on Earth, the same body weighs less.",
        ],
      },
      {
        heading: "The science behind it",
        paragraphs: [
          "Mars's surface gravity is about 38% of Earth's. The planned calculator will multiply your Earth weight by that factor to estimate your weight on Mars, using published values.",
        ],
      },
      {
        heading: "About this tool",
        paragraphs: [
          "This is an explanatory page; the interactive calculator is in development and does not yet compute a result.",
        ],
      },
    ],
    sources: ["nasa", "jpl"],
    relatedEntries: [
      ["calculators", "physics", "weight-on-moon"],
      ["calculators", "physics", "age-on-mars"],
    ],
    relatedCategories: [["astronomy", "planets"]],
  },
]);
