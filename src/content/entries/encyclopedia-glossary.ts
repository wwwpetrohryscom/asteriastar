import { defineEntries } from "@/lib/content/entry-types";

/**
 * Encyclopedia / Glossary — concise, textbook-correct definitions of core
 * astronomy terms, plus a small number of clearly-labeled astrology entries.
 *
 * Science terms cite source slots and never assert astrological claims. Where a
 * word is shared with astrology ("zodiac", "transit") the astronomy meaning is
 * defined first and the astrological usage is flagged as a separate, interpretive
 * tradition in a single labeled sentence. The one interpretive entry
 * ("ascendant") is framed entirely as astrology and carries no science sources.
 * Numeric values are limited to widely-published, stable figures.
 */
export const encyclopediaGlossary = defineEntries([
  {
    section: "encyclopedia",
    category: "glossary",
    slug: "star",
    title: "Star",
    description:
      "A star is a luminous sphere of plasma held together by its own gravity, generating energy by nuclear fusion in its core.",
    excerpt: "A self-gravitating sphere of plasma powered by fusion.",
    kind: "science",
    difficulty: "beginner",
    tags: ["stars", "stellar physics"],
    facts: [
      { label: "Category", value: "Astronomy term" },
      { label: "Energy source", value: "Nuclear fusion in the core" },
      { label: "Nearest example", value: "The Sun" },
    ],
    keyPoints: [
      "A self-gravitating ball of hot plasma.",
      "Produces energy by fusing lighter elements into heavier ones.",
      "The Sun is the nearest star.",
    ],
    body: [
      {
        heading: "Definition",
        paragraphs: [
          "A star is a luminous sphere of plasma bound together by its own gravity. In its core, pressure and temperature are high enough to drive nuclear fusion, which releases the energy that makes the star shine.",
        ],
      },
      {
        heading: "In context",
        paragraphs: [
          "Stars vary enormously in mass, temperature, and color, and a star's mass largely sets how it lives and how it ends. Our Sun is a fairly typical star and the closest one to Earth, which is why it appears so much brighter than any other.",
        ],
      },
      {
        heading: "Related ideas",
        paragraphs: [
          "Stars gather by the billions into galaxies. When some massive stars die they explode as supernovae, and the most massive can leave behind black holes.",
        ],
      },
    ],
    sources: ["nasa", "esa", "iau"],
    relatedEntries: [
      ["encyclopedia", "glossary", "galaxy"],
      ["encyclopedia", "glossary", "supernova"],
      ["encyclopedia", "glossary", "light-year"],
    ],
    relatedCategories: [["astronomy", "stars"]],
  },
  {
    section: "encyclopedia",
    category: "glossary",
    slug: "planet",
    title: "Planet",
    description:
      "Under the IAU definition, a planet is a body orbiting the Sun that is massive enough to be rounded by its own gravity and has cleared the neighborhood around its orbit.",
    excerpt: "A round body that orbits the Sun and has cleared its orbit.",
    kind: "science",
    difficulty: "beginner",
    tags: ["planets", "solar system", "IAU definition"],
    facts: [
      { label: "Category", value: "Astronomy term" },
      { label: "Defined by", value: "International Astronomical Union (2006)" },
      { label: "Planets in the Solar System", value: "Eight" },
    ],
    keyPoints: [
      "Orbits the Sun directly.",
      "Has enough mass to pull itself into a nearly round shape.",
      "Has cleared other bodies from its orbital neighborhood.",
    ],
    body: [
      {
        heading: "Definition",
        paragraphs: [
          "Under the definition adopted by the International Astronomical Union in 2006, a planet is a body that orbits the Sun, has enough mass for its own gravity to pull it into a nearly round shape, and has cleared the neighborhood around its orbit of other comparable bodies.",
        ],
      },
      {
        heading: "In context",
        paragraphs: [
          "By this definition the Solar System has eight planets, from Mercury out to Neptune. Bodies that are round but have not cleared their orbits, such as Pluto and Ceres, are classed as dwarf planets instead.",
        ],
      },
      {
        heading: "Related ideas",
        paragraphs: [
          "Planets around other stars are called exoplanets; thousands are now known. Planets shine by reflecting sunlight rather than producing their own light like a star.",
        ],
      },
    ],
    sources: ["iau", "nasa"],
    relatedEntries: [
      ["encyclopedia", "glossary", "star"],
      ["encyclopedia", "glossary", "astronomical-unit"],
      ["encyclopedia", "glossary", "transit"],
    ],
    relatedCategories: [["astronomy", "planets"]],
  },
  {
    section: "encyclopedia",
    category: "glossary",
    slug: "galaxy",
    title: "Galaxy",
    description:
      "A galaxy is a gravitationally bound system of stars, gas, dust, and dark matter, ranging from dwarfs of a few million stars to giants with hundreds of billions.",
    excerpt: "A gravitationally bound system of stars, gas, dust, and dark matter.",
    kind: "science",
    difficulty: "beginner",
    tags: ["galaxies", "Milky Way", "dark matter"],
    facts: [
      { label: "Category", value: "Astronomy term" },
      { label: "Our galaxy", value: "The Milky Way" },
      { label: "Holds together by", value: "Gravity, including dark matter" },
    ],
    keyPoints: [
      "A vast, gravitationally bound collection of stars and interstellar matter.",
      "Includes large amounts of unseen dark matter.",
      "Our Sun is one star in the Milky Way galaxy.",
    ],
    body: [
      {
        heading: "Definition",
        paragraphs: [
          "A galaxy is a gravitationally bound system of stars, stellar remnants, interstellar gas and dust, and dark matter. Galaxies range from dwarfs with a few million stars to giants containing hundreds of billions.",
        ],
      },
      {
        heading: "In context",
        paragraphs: [
          "Galaxies come in several broad shapes, including spirals, ellipticals, and irregulars. Our own galaxy, the Milky Way, is a barred spiral, and the Sun is just one of its many billions of stars.",
        ],
      },
      {
        heading: "Related ideas",
        paragraphs: [
          "Most large galaxies host a supermassive black hole at their center. Galaxies themselves cluster into larger groups and superclusters spread across the observable universe.",
        ],
      },
    ],
    sources: ["nasa", "esa"],
    relatedEntries: [
      ["encyclopedia", "glossary", "star"],
      ["encyclopedia", "glossary", "nebula"],
      ["encyclopedia", "glossary", "black-hole"],
    ],
    relatedCategories: [["astronomy", "galaxies"]],
  },
  {
    section: "encyclopedia",
    category: "glossary",
    slug: "nebula",
    title: "Nebula",
    description:
      "A nebula is an interstellar cloud of gas and dust — the raw material from which stars form and, in some cases, the debris left behind when stars die.",
    excerpt: "An interstellar cloud of gas and dust.",
    kind: "science",
    difficulty: "beginner",
    tags: ["nebulae", "interstellar medium", "star formation"],
    facts: [
      { label: "Category", value: "Astronomy term" },
      { label: "Made of", value: "Interstellar gas and dust" },
      { label: "Role", value: "Birthplace and graveyard of stars" },
    ],
    keyPoints: [
      "A cloud of gas and dust between the stars.",
      "Many nebulae are stellar nurseries where new stars form.",
      "Others are shells of material cast off by dying stars.",
    ],
    body: [
      {
        heading: "Definition",
        paragraphs: [
          "A nebula is an interstellar cloud of gas and dust. The word once referred to any fuzzy patch in the sky, but today it specifically means these clouds of gas and dust within a galaxy.",
        ],
      },
      {
        heading: "In context",
        paragraphs: [
          "Some nebulae are dense regions where gravity is pulling gas together to form new stars. Others, such as planetary nebulae and supernova remnants, are material shed by stars near the end of their lives.",
        ],
      },
      {
        heading: "Related ideas",
        paragraphs: [
          "Nebulae glow when nearby hot stars light up their gas, reflect starlight, or block the light behind them as dark silhouettes. The material in them is eventually recycled into new generations of stars and planets.",
        ],
      },
    ],
    sources: ["nasa", "esa"],
    relatedEntries: [
      ["encyclopedia", "glossary", "star"],
      ["encyclopedia", "glossary", "supernova"],
      ["encyclopedia", "glossary", "galaxy"],
    ],
    relatedCategories: [["astronomy", "nebulae"]],
  },
  {
    section: "encyclopedia",
    category: "glossary",
    slug: "supernova",
    title: "Supernova",
    description:
      "A supernova is the explosive death of certain stars, briefly outshining an entire galaxy and scattering heavy elements into interstellar space.",
    excerpt: "The explosive death of certain stars.",
    kind: "science",
    difficulty: "intermediate",
    tags: ["supernovae", "stellar death", "nucleosynthesis"],
    facts: [
      { label: "Category", value: "Astronomy term" },
      { label: "Event type", value: "Stellar explosion" },
      { label: "Can leave behind", value: "A neutron star or black hole" },
    ],
    keyPoints: [
      "A powerful explosion marking the death of certain stars.",
      "Can briefly outshine all the other stars in its galaxy combined.",
      "Disperses heavy elements that enrich future stars and planets.",
    ],
    body: [
      {
        heading: "Definition",
        paragraphs: [
          "A supernova is the explosive death of a star. It occurs either when a massive star's core collapses at the end of its life, or when a white dwarf in a binary system is pushed past a critical mass and detonates.",
        ],
      },
      {
        heading: "In context",
        paragraphs: [
          "For a few weeks a single supernova can outshine an entire galaxy of stars. The explosion forges and scatters heavy elements, seeding the surrounding gas with the material that later forms new stars, planets, and ultimately the chemistry of life.",
        ],
      },
      {
        heading: "Related ideas",
        paragraphs: [
          "A core-collapse supernova can leave behind a dense neutron star or, for the most massive stars, a black hole. The expanding debris becomes a supernova remnant — a type of nebula.",
        ],
      },
    ],
    sources: ["nasa", "esa"],
    relatedEntries: [
      ["encyclopedia", "glossary", "star"],
      ["encyclopedia", "glossary", "black-hole"],
      ["encyclopedia", "glossary", "nebula"],
    ],
    relatedCategories: [["astronomy", "supernovae"]],
  },
  {
    section: "encyclopedia",
    category: "glossary",
    slug: "black-hole",
    title: "Black Hole",
    description:
      "A black hole is a region of spacetime where gravity is so strong that nothing, not even light, can escape from within its boundary, the event horizon.",
    excerpt: "A region of spacetime from which not even light escapes.",
    kind: "science",
    difficulty: "intermediate",
    tags: ["black holes", "gravity", "event horizon"],
    facts: [
      { label: "Category", value: "Astronomy term" },
      { label: "Boundary", value: "The event horizon" },
      { label: "Escape velocity inside", value: "Exceeds the speed of light" },
    ],
    keyPoints: [
      "A region where gravity is so strong nothing can escape.",
      "Its boundary is called the event horizon.",
      "Forms from collapsing massive stars, and grows by accreting matter.",
    ],
    body: [
      {
        heading: "Definition",
        paragraphs: [
          "A black hole is a region of spacetime where gravity is so strong that nothing, not even light, can escape once it crosses the boundary. That boundary is called the event horizon, and it marks the point of no return.",
        ],
      },
      {
        heading: "In context",
        paragraphs: [
          "Stellar-mass black holes form when the cores of the most massive stars collapse at the end of their lives. Supermassive black holes, millions to billions of times the mass of the Sun, sit at the centers of most large galaxies, including the Milky Way.",
        ],
      },
      {
        heading: "Related ideas",
        paragraphs: [
          "We cannot see a black hole directly, but we detect it through its gravity and through radiation from hot matter swirling around it. Telescopes have now imaged the glowing gas surrounding the shadows of supermassive black holes.",
        ],
      },
    ],
    sources: ["nasa", "esa"],
    relatedEntries: [
      ["encyclopedia", "glossary", "supernova"],
      ["encyclopedia", "glossary", "galaxy"],
      ["encyclopedia", "glossary", "star"],
    ],
    relatedCategories: [["astronomy", "black-holes"]],
  },
  {
    section: "encyclopedia",
    category: "glossary",
    slug: "light-year",
    title: "Light-Year",
    description:
      "A light-year is the distance light travels in one year — about 9.46 trillion kilometers (about 5.88 trillion miles). It is a unit of distance, not time.",
    excerpt: "The distance light travels in one year — a measure of distance.",
    kind: "science",
    difficulty: "beginner",
    tags: ["distance", "units", "light"],
    facts: [
      { label: "Category", value: "Unit of distance" },
      { label: "Length", value: "About 9.46 trillion km (about 5.88 trillion miles)" },
      { label: "Common misconception", value: "It is a distance, not a time" },
    ],
    keyPoints: [
      "The distance light travels in one year.",
      "Roughly 9.46 trillion kilometers (about 5.88 trillion miles).",
      "A unit of distance — despite the word 'year' in its name.",
    ],
    body: [
      {
        heading: "Definition",
        paragraphs: [
          "A light-year is the distance that light, traveling at its fixed speed in a vacuum, covers in one year — about 9.46 trillion kilometers (about 5.88 trillion miles). Despite the word 'year' in its name, it measures distance, not time.",
        ],
      },
      {
        heading: "In context",
        paragraphs: [
          "Astronomical distances are so vast that ordinary units become unwieldy, so astronomers measure the gaps between stars and galaxies in light-years. The nearest star system beyond the Sun, Alpha Centauri, lies about four light-years away.",
        ],
      },
      {
        heading: "Related ideas",
        paragraphs: [
          "Because light takes time to reach us, looking far across space is also looking back in time: we see distant objects as they were when their light set out. For distances within the Solar System, astronomers more often use the astronomical unit.",
        ],
      },
    ],
    sources: ["nasa", "esa"],
    relatedEntries: [
      ["encyclopedia", "glossary", "astronomical-unit"],
      ["encyclopedia", "glossary", "star"],
      ["encyclopedia", "glossary", "galaxy"],
    ],
    relatedCategories: [["astronomy", "stars"]],
  },
  {
    section: "encyclopedia",
    category: "glossary",
    slug: "astronomical-unit",
    title: "Astronomical Unit",
    description:
      "An astronomical unit (AU) is the average distance between Earth and the Sun — about 149.6 million kilometers (about 93 million miles) — used to measure distances within the Solar System.",
    excerpt: "The average Earth–Sun distance, about 149.6 million km.",
    kind: "science",
    difficulty: "beginner",
    tags: ["distance", "units", "solar system"],
    facts: [
      { label: "Category", value: "Unit of distance" },
      { label: "Length", value: "About 149.6 million km (about 93 million miles)" },
      { label: "Symbol", value: "AU" },
    ],
    keyPoints: [
      "The average distance between Earth and the Sun.",
      "About 149.6 million kilometers (about 93 million miles).",
      "Convenient for measuring distances inside the Solar System.",
    ],
    body: [
      {
        heading: "Definition",
        paragraphs: [
          "An astronomical unit, abbreviated AU, is the average distance between Earth and the Sun — about 149.6 million kilometers (about 93 million miles). It provides a natural yardstick for distances across the Solar System.",
        ],
      },
      {
        heading: "In context",
        paragraphs: [
          "Using the AU keeps Solar System distances manageable: Mercury orbits at about 0.4 AU, while Neptune lies about 30 AU from the Sun. Light takes roughly eight minutes to travel one astronomical unit.",
        ],
      },
      {
        heading: "Related ideas",
        paragraphs: [
          "For the far greater distances between stars and galaxies, the astronomical unit becomes too small to be practical, and astronomers switch to the light-year instead.",
        ],
      },
    ],
    sources: ["nasa", "jpl"],
    relatedEntries: [
      ["encyclopedia", "glossary", "light-year"],
      ["encyclopedia", "glossary", "planet"],
      ["encyclopedia", "glossary", "ecliptic"],
    ],
    relatedCategories: [["astronomy", "planets"]],
  },
  {
    section: "encyclopedia",
    category: "glossary",
    slug: "ecliptic",
    title: "Ecliptic",
    description:
      "The ecliptic is the apparent yearly path of the Sun across the sky — essentially the plane of Earth's orbit projected onto the sky — and the Moon and planets stay close to it.",
    excerpt: "The Sun's apparent yearly path across the sky.",
    kind: "science",
    difficulty: "intermediate",
    tags: ["sky", "orbits", "celestial sphere"],
    facts: [
      { label: "Category", value: "Astronomy term" },
      { label: "Traced by", value: "The Sun's apparent yearly motion" },
      { label: "Stays near it", value: "The Moon and planets" },
    ],
    keyPoints: [
      "The Sun's apparent path through the sky over a year.",
      "Really the plane of Earth's orbit projected onto the sky.",
      "The Moon and planets are always found near this line.",
    ],
    body: [
      {
        heading: "Definition",
        paragraphs: [
          "The ecliptic is the apparent path the Sun traces against the background stars over the course of a year. It is essentially the plane of Earth's orbit projected onto the sky, seen from our moving vantage point.",
        ],
      },
      {
        heading: "In context",
        paragraphs: [
          "Because the planets orbit the Sun in roughly the same plane as Earth, they — along with the Moon — are always seen close to the ecliptic. The constellations the Sun passes through over the year lie along this same band.",
        ],
      },
      {
        heading: "Related ideas",
        paragraphs: [
          "The ecliptic is tilted relative to Earth's equator, a tilt that gives rise to the seasons. The band of constellations centered on the ecliptic is known as the zodiac.",
        ],
      },
    ],
    sources: ["nasa", "iau"],
    relatedEntries: [
      ["encyclopedia", "glossary", "zodiac"],
      ["encyclopedia", "glossary", "planet"],
      ["encyclopedia", "glossary", "astronomical-unit"],
    ],
    relatedCategories: [["astronomy", "constellations"]],
  },
  {
    section: "encyclopedia",
    category: "glossary",
    slug: "zodiac",
    title: "Zodiac",
    description:
      "In astronomy, the zodiac is the band of sky and the constellations along it, centered on the ecliptic, through which the Sun, Moon, and planets appear to move.",
    excerpt: "The band of constellations along the ecliptic.",
    kind: "science",
    difficulty: "intermediate",
    tags: ["constellations", "ecliptic", "sky"],
    facts: [
      { label: "Category", value: "Astronomy term" },
      { label: "Centered on", value: "The ecliptic" },
      { label: "Bodies that move through it", value: "The Sun, Moon, and planets" },
    ],
    keyPoints: [
      "A band of sky and constellations along the ecliptic.",
      "The Sun, Moon, and planets all appear to travel through it.",
      "Astronomically it is a region of sky, not a system of meanings.",
    ],
    body: [
      {
        heading: "Definition",
        paragraphs: [
          "In astronomy, the zodiac is the band of sky centered on the ecliptic, together with the constellations that lie along it. It is the strip of sky through which the Sun, Moon, and planets appear to move as seen from Earth.",
        ],
      },
      {
        heading: "In context",
        paragraphs: [
          "Because the Sun, Moon, and planets all stay close to the ecliptic, they are always found somewhere within this band. The Sun passes in front of these background constellations over the course of a year.",
          "In astrology — a separate, interpretive tradition that astronomy does not endorse — this same band is instead divided into twelve equal signs used for chart-making.",
        ],
      },
      {
        heading: "Related ideas",
        paragraphs: [
          "The astronomical zodiac constellations are uneven in size and number, which is why the strict band the Sun crosses does not match the neat twelve equal divisions of astrology.",
        ],
      },
    ],
    sources: ["iau", "nasa"],
    relatedEntries: [
      ["encyclopedia", "glossary", "ecliptic"],
      ["encyclopedia", "glossary", "transit"],
      ["encyclopedia", "glossary", "ascendant"],
    ],
    relatedCategories: [["astronomy", "constellations"]],
  },
  {
    section: "encyclopedia",
    category: "glossary",
    slug: "transit",
    title: "Transit",
    description:
      "In astronomy, a transit is the passage of a smaller body across the face of a larger one — such as a planet crossing the Sun's disk, or an exoplanet crossing its star.",
    excerpt: "A smaller body passing across the face of a larger one.",
    kind: "science",
    difficulty: "intermediate",
    tags: ["exoplanets", "observation", "events"],
    facts: [
      { label: "Category", value: "Astronomy term" },
      { label: "Example", value: "A planet crossing the Sun's disk" },
      { label: "Application", value: "A leading exoplanet-detection method" },
    ],
    keyPoints: [
      "A smaller body passing across the face of a larger one.",
      "Mercury and Venus occasionally transit the Sun as seen from Earth.",
      "Detecting an exoplanet's tiny dip in starlight is the transit method.",
    ],
    body: [
      {
        heading: "Definition",
        paragraphs: [
          "In astronomy, a transit is the passage of a smaller body across the face of a larger one as seen by an observer — for example, a planet crossing the Sun's disk, or an exoplanet passing in front of its host star.",
        ],
      },
      {
        heading: "In context",
        paragraphs: [
          "When an exoplanet transits its star, it blocks a tiny fraction of the star's light, producing a small, repeating dip in brightness. Measuring these dips is one of the most productive methods for discovering and characterizing planets around other stars.",
          "Astrology — a separate, interpretive tradition — uses the word differently, to describe the current positions of the planets relative to a person's birth chart.",
        ],
      },
      {
        heading: "Related ideas",
        paragraphs: [
          "From Earth, only Mercury and Venus can transit the Sun, because they are the only planets that orbit closer to the Sun than we do. Space telescopes have used the transit method to find thousands of exoplanets.",
        ],
      },
    ],
    sources: ["nasa"],
    relatedEntries: [
      ["encyclopedia", "glossary", "planet"],
      ["encyclopedia", "glossary", "ecliptic"],
      ["encyclopedia", "glossary", "zodiac"],
    ],
    relatedCategories: [["astronomy", "exoplanets"]],
  },
  {
    section: "encyclopedia",
    category: "glossary",
    slug: "ascendant",
    title: "Ascendant",
    description:
      "In astrology, the Ascendant, or rising sign, is the zodiac sign the tradition places on the eastern horizon at the moment of birth, associated with outward style and first impressions.",
    excerpt: "In astrology, the zodiac sign rising on the eastern horizon at birth.",
    kind: "interpretive",
    difficulty: "beginner",
    tags: ["astrology", "rising sign", "birth chart"],
    facts: [
      { label: "Category", value: "Astrology term" },
      { label: "Also called", value: "The rising sign" },
      { label: "Set by", value: "Exact time and place of birth" },
    ],
    keyPoints: [
      "In astrology, the zodiac sign said to be rising on the eastern horizon at birth.",
      "Also known as the rising sign.",
      "Astrologers link it with outward style and first impressions.",
    ],
    body: [
      {
        heading: "Definition",
        paragraphs: [
          "In astrology, the Ascendant — also called the rising sign — is the zodiac sign that the tradition places on the eastern horizon at the exact moment and place of a person's birth. It is a concept of astrological interpretation, not an astronomical measurement of fact.",
        ],
      },
      {
        heading: "In astrological tradition",
        paragraphs: [
          "Because the sign on the eastern horizon changes roughly every two hours, astrologers say the Ascendant requires a precise birth time to determine. Within the tradition it anchors the layout of a birth chart and its houses.",
        ],
      },
      {
        heading: "What practitioners associate with it",
        paragraphs: [
          "Astrologers commonly associate the Ascendant with a person's outward style, demeanor, and the first impression they make on others — distinct from the Sun sign. These are interpretive associations within astrology, presented here as cultural tradition rather than scientific claims.",
        ],
      },
    ],
    relatedEntries: [
      ["encyclopedia", "glossary", "zodiac"],
      ["encyclopedia", "glossary", "ecliptic"],
    ],
    relatedCategories: [["astrology", "rising-sign"]],
  },
]);
