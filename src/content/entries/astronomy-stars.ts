import { defineEntries } from "@/lib/content/entry-types";

/**
 * Astronomy / Stars — factual stellar entries.
 *
 * Facts here are well-established and source-ready. Numeric values are limited
 * to widely-published, stable figures (e.g. Sirius at ~8.6 light-years); where
 * a value is uncertain or evolving it is described qualitatively rather than
 * asserted precisely. Never mixed with astrology.
 */
export const astronomyStars = defineEntries([
  {
    section: "astronomy",
    category: "stars",
    slug: "sirius",
    title: "Sirius",
    description:
      "Sirius is the brightest star in Earth's night sky, a hot blue-white star in the constellation Canis Major and one of the Sun's near neighbors.",
    excerpt: "The brightest star in the night sky, in Canis Major.",
    kind: "science",
    difficulty: "beginner",
    tags: ["bright stars", "binary star", "Canis Major", "winter sky"],
    graphEntityId: "star:sirius",
    entityType: "star",
    entityDomain: "science",
    facts: [
      { label: "Constellation", value: "Canis Major" },
      { label: "Apparent brightness", value: "Brightest star in the night sky" },
      { label: "System", value: "Binary (Sirius A and white dwarf Sirius B)" },
      { label: "Distance", value: "About 8.6 light-years" },
    ],
    keyPoints: [
      "The brightest star visible from Earth at night.",
      "A binary system: a main-sequence star (Sirius A) with a white-dwarf companion (Sirius B).",
      "Easily found by following the belt of Orion down and to the left.",
    ],
    body: [
      {
        heading: "What Sirius is",
        paragraphs: [
          "Sirius is a hot, blue-white star in the constellation Canis Major, the Greater Dog. It is the brightest star in the night sky, a combination of being genuinely luminous and lying close to the Sun in galactic terms — about 8.6 light-years away.",
        ],
      },
      {
        heading: "A two-star system",
        paragraphs: [
          "Sirius is a binary system. The bright star we see, Sirius A, is a main-sequence star noticeably hotter and more massive than the Sun. Orbiting it is Sirius B, a faint white dwarf — the dense, Earth-sized remnant of a star that has ended its main lifetime.",
        ],
      },
      {
        heading: "Finding it in the sky",
        paragraphs: [
          "From the Northern Hemisphere, Sirius dominates winter evenings. The three stars of Orion's Belt point down and to the left toward it. Because it is so bright and often low in the sky, it frequently twinkles in vivid colors.",
        ],
      },
    ],
    sources: ["nasa", "esa", "iau"],
    relatedEntries: [
      ["astronomy", "stars", "betelgeuse"],
      ["astronomy", "stars", "rigel"],
      ["astronomy", "stars", "vega"],
    ],
    relatedCategories: [
      ["astronomy", "constellations"],
      ["astronomy", "star-clusters"],
    ],
  },
  {
    section: "astronomy",
    category: "stars",
    slug: "betelgeuse",
    title: "Betelgeuse",
    description:
      "Betelgeuse is a red supergiant marking the shoulder of Orion — a variable, late-stage massive star expected to end its life as a supernova.",
    excerpt: "The red supergiant on Orion's shoulder.",
    kind: "science",
    difficulty: "beginner",
    tags: ["red supergiant", "Orion", "variable star", "supernova"],
    facts: [
      { label: "Constellation", value: "Orion" },
      { label: "Type", value: "Red supergiant" },
      { label: "Color", value: "Distinctly reddish-orange" },
      { label: "Variability", value: "Semiregular variable (brightness changes over time)" },
    ],
    keyPoints: [
      "A red supergiant nearing the end of its life.",
      "Its brightness visibly varies over months to years.",
      "Will eventually explode as a supernova — on astronomical timescales.",
    ],
    body: [
      {
        heading: "A swollen, dying star",
        paragraphs: [
          "Betelgeuse is a red supergiant: a massive star that has exhausted the hydrogen in its core, swollen enormously, and cooled at the surface to a reddish glow. Its radius is so large that, placed at the Sun's position, it would engulf the inner Solar System.",
        ],
      },
      {
        heading: "A changing brightness",
        paragraphs: [
          "Betelgeuse is a semiregular variable star — its brightness rises and falls as the star pulsates and sheds material. A pronounced dimming drew wide attention before the star recovered, a reminder that supergiants are restless rather than steady.",
        ],
      },
      {
        heading: "Its future as a supernova",
        paragraphs: [
          "As a massive star in a late stage of life, Betelgeuse is expected to end as a core-collapse supernova. On human timescales it is unpredictable, and could be tens of thousands of years away; the explosion would pose no danger to Earth but would be a spectacular sight.",
        ],
      },
    ],
    sources: ["nasa", "esa", "iau"],
    relatedEntries: [
      ["astronomy", "stars", "rigel"],
      ["astronomy", "stars", "antares"],
      ["astronomy", "stars", "sirius"],
    ],
    relatedCategories: [
      ["astronomy", "constellations"],
      ["astronomy", "supernovae"],
    ],
  },
  {
    section: "astronomy",
    category: "stars",
    slug: "rigel",
    title: "Rigel",
    description:
      "Rigel is a brilliant blue supergiant marking the foot of Orion and one of the most luminous stars in our region of the galaxy.",
    excerpt: "The blue supergiant at Orion's foot.",
    kind: "science",
    difficulty: "beginner",
    tags: ["blue supergiant", "Orion", "luminous stars"],
    facts: [
      { label: "Constellation", value: "Orion" },
      { label: "Type", value: "Blue supergiant" },
      { label: "Color", value: "Blue-white" },
      { label: "Note", value: "Among the most luminous stars near the Sun" },
    ],
    keyPoints: [
      "A hot, blue-white supergiant — far more luminous than the Sun.",
      "Marks the foot of Orion, opposite reddish Betelgeuse.",
      "Part of a multiple-star system.",
    ],
    body: [
      {
        heading: "A luminous blue supergiant",
        paragraphs: [
          "Rigel is a blue supergiant, a hot and extraordinarily luminous star. Its blue-white color signals a high surface temperature, in clear contrast to the cool, red glow of Betelgeuse across the figure of Orion.",
        ],
      },
      {
        heading: "A stellar system",
        paragraphs: [
          "What appears as a single point is a multiple-star system, with the dominant supergiant accompanied by fainter companions. The supergiant supplies almost all of the light we see.",
        ],
      },
      {
        heading: "Orion's two beacons",
        paragraphs: [
          "Rigel and Betelgeuse are the two brightest stars of Orion and a classic contrast lesson: a hot blue star and a cool red one, side by side in the same constellation, illustrating how color reveals temperature.",
        ],
      },
    ],
    sources: ["nasa", "esa", "iau"],
    relatedEntries: [
      ["astronomy", "stars", "betelgeuse"],
      ["astronomy", "stars", "deneb"],
      ["astronomy", "stars", "sirius"],
    ],
    relatedCategories: [["astronomy", "constellations"]],
  },
  {
    section: "astronomy",
    category: "stars",
    slug: "vega",
    title: "Vega",
    description:
      "Vega is a brilliant blue-white star in the constellation Lyra, a vertex of the Summer Triangle and a historically important reference star.",
    excerpt: "The brilliant blue-white star of Lyra.",
    kind: "science",
    difficulty: "beginner",
    tags: ["Summer Triangle", "Lyra", "reference star", "precession"],
    facts: [
      { label: "Constellation", value: "Lyra" },
      { label: "Color", value: "Blue-white" },
      { label: "Asterism", value: "Vertex of the Summer Triangle" },
      { label: "Note", value: "A former — and future — northern pole star" },
    ],
    keyPoints: [
      "One of the brightest stars in the northern sky.",
      "Forms the Summer Triangle with Deneb and Altair.",
      "Was the northern pole star thousands of years ago, and will be again due to precession.",
    ],
    body: [
      {
        heading: "A summer beacon",
        paragraphs: [
          "Vega is a hot, blue-white star and one of the most prominent in the northern sky. High overhead on summer evenings, it anchors the small constellation Lyra, the Lyre.",
        ],
      },
      {
        heading: "The Summer Triangle",
        paragraphs: [
          "Vega forms one corner of the Summer Triangle, a large asterism completed by Deneb in Cygnus and Altair in Aquila. The pattern is one of the easiest star groupings to learn in the northern summer.",
        ],
      },
      {
        heading: "A shifting pole star",
        paragraphs: [
          "Because Earth's axis slowly wobbles over a roughly 26,000-year cycle (precession), the title of pole star passes between stars over time. Vega held it in the distant past and will again in the future, while Polaris marks the pole today.",
        ],
      },
    ],
    sources: ["nasa", "esa", "iau"],
    relatedEntries: [
      ["astronomy", "stars", "deneb"],
      ["astronomy", "stars", "altair"],
      ["astronomy", "stars", "polaris"],
    ],
    relatedCategories: [["astronomy", "constellations"]],
  },
  {
    section: "astronomy",
    category: "stars",
    slug: "polaris",
    title: "Polaris",
    description:
      "Polaris, the North Star, lies very close to the north celestial pole, making it a steady guide for navigation in the Northern Hemisphere.",
    excerpt: "The North Star, near the north celestial pole.",
    kind: "science",
    difficulty: "beginner",
    tags: ["pole star", "navigation", "Ursa Minor", "Cepheid"],
    facts: [
      { label: "Constellation", value: "Ursa Minor" },
      { label: "Role", value: "Current northern pole star" },
      { label: "Type", value: "Cepheid variable (multiple-star system)" },
      { label: "Use", value: "Northern navigation reference" },
    ],
    keyPoints: [
      "Sits within about a degree of the north celestial pole.",
      "Appears nearly fixed while other stars wheel around it.",
      "A multiple-star system whose primary is a Cepheid variable.",
    ],
    body: [
      {
        heading: "The star that barely moves",
        paragraphs: [
          "Polaris lies very close to the north celestial pole — the point in the sky directly above Earth's North Pole. As Earth rotates, the other stars appear to circle Polaris, while it stays almost stationary, which is why it has guided navigators for centuries.",
        ],
      },
      {
        heading: "Finding north with it",
        paragraphs: [
          "The two stars at the end of the Big Dipper's bowl are the 'pointer stars': a line drawn through them leads to Polaris. Its altitude above the horizon also approximates an observer's latitude in the Northern Hemisphere.",
        ],
      },
      {
        heading: "Not truly permanent",
        paragraphs: [
          "Polaris is the pole star only for now. Earth's slow axial precession gradually shifts the pole among different stars over thousands of years, so Polaris's role as the North Star is temporary on astronomical timescales.",
        ],
      },
    ],
    sources: ["nasa", "esa", "iau"],
    relatedEntries: [
      ["astronomy", "stars", "vega"],
      ["astronomy", "stars", "aldebaran"],
    ],
    relatedCategories: [["astronomy", "constellations"]],
  },
  {
    section: "astronomy",
    category: "stars",
    slug: "proxima-centauri",
    title: "Proxima Centauri",
    description:
      "Proxima Centauri is the closest known star to the Sun, a small red dwarf in the Alpha Centauri system that hosts at least one known exoplanet.",
    excerpt: "The closest known star to the Sun.",
    kind: "science",
    difficulty: "intermediate",
    tags: ["red dwarf", "nearest star", "Alpha Centauri", "exoplanets"],
    facts: [
      { label: "Constellation", value: "Centaurus" },
      { label: "Type", value: "Red dwarf (M-type)" },
      { label: "Distance", value: "About 4.24 light-years" },
      { label: "System", value: "Part of the Alpha Centauri triple system" },
    ],
    keyPoints: [
      "The nearest individual star to the Sun.",
      "A small, cool, long-lived red dwarf, too faint to see without a telescope.",
      "Known to host at least one exoplanet, Proxima b.",
    ],
    body: [
      {
        heading: "Our nearest stellar neighbor",
        paragraphs: [
          "Proxima Centauri is the closest known star to the Sun, at about 4.24 light-years. Despite that proximity it is far too faint to see with the unaided eye, because it is a red dwarf — a small, cool star that emits a fraction of the Sun's light.",
        ],
      },
      {
        heading: "Part of a triple system",
        paragraphs: [
          "Proxima is gravitationally associated with the bright pair Alpha Centauri A and B, making the Alpha Centauri system a triple. Proxima orbits the pair at a great distance and currently sits slightly closer to us than they do.",
        ],
      },
      {
        heading: "A flare star with planets",
        paragraphs: [
          "Like many red dwarfs, Proxima is a flare star, prone to sudden bursts of activity. It is known to host at least one exoplanet, Proxima b, which makes the nearest star also one of the nearest known planetary systems.",
        ],
      },
    ],
    sources: ["nasa", "esa", "iau"],
    relatedEntries: [
      ["astronomy", "stars", "alpha-centauri"],
      ["astronomy", "stars", "sirius"],
    ],
    relatedCategories: [["astronomy", "exoplanets"]],
  },
  {
    section: "astronomy",
    category: "stars",
    slug: "alpha-centauri",
    title: "Alpha Centauri",
    description:
      "Alpha Centauri is the nearest stellar system to the Sun — a triple system whose two bright Sun-like stars and the red dwarf Proxima lie just over four light-years away.",
    excerpt: "The nearest star system to the Sun.",
    kind: "science",
    difficulty: "intermediate",
    tags: ["nearest system", "triple star", "Centaurus", "Sun-like stars"],
    facts: [
      { label: "Constellation", value: "Centaurus" },
      { label: "Type", value: "Triple star system" },
      { label: "Components", value: "Alpha Cen A, Alpha Cen B, and Proxima Centauri" },
      { label: "Distance", value: "About 4.3 light-years" },
    ],
    keyPoints: [
      "The closest stellar system to the Sun.",
      "Two of its stars are broadly similar to the Sun.",
      "Includes Proxima Centauri, the nearest individual star.",
    ],
    body: [
      {
        heading: "The Sun's closest neighbors",
        paragraphs: [
          "Alpha Centauri is the nearest star system to the Sun, just over four light-years away in the southern constellation Centaurus. To the unaided eye it appears as a single brilliant point, but it is actually multiple stars.",
        ],
      },
      {
        heading: "A triple system",
        paragraphs: [
          "The system contains two Sun-like stars, Alpha Centauri A and B, orbiting each other, plus the faint red dwarf Proxima Centauri. Their nearness makes them prime targets for studying other stars in detail.",
        ],
      },
      {
        heading: "A southern sight",
        paragraphs: [
          "Alpha Centauri is a brilliant feature of the southern sky and, with nearby Beta Centauri, points toward the Southern Cross. It is not visible from most northern latitudes.",
        ],
      },
    ],
    sources: ["nasa", "esa", "iau"],
    relatedEntries: [
      ["astronomy", "stars", "proxima-centauri"],
      ["astronomy", "stars", "sirius"],
    ],
    relatedCategories: [["astronomy", "constellations"]],
  },
  {
    section: "astronomy",
    category: "stars",
    slug: "antares",
    title: "Antares",
    description:
      "Antares is a red supergiant at the heart of Scorpius whose reddish color earned it a name meaning 'rival of Mars'.",
    excerpt: "The red supergiant heart of Scorpius.",
    kind: "science",
    difficulty: "beginner",
    tags: ["red supergiant", "Scorpius", "variable star"],
    facts: [
      { label: "Constellation", value: "Scorpius" },
      { label: "Type", value: "Red supergiant" },
      { label: "Name meaning", value: "'Rival of Mars' (for its reddish color)" },
      { label: "Variability", value: "Semiregular variable" },
    ],
    keyPoints: [
      "A huge, cool red supergiant marking the heart of the Scorpion.",
      "Its red hue resembles the planet Mars, hence its name.",
      "Like Betelgeuse, a late-stage massive star.",
    ],
    body: [
      {
        heading: "The Scorpion's heart",
        paragraphs: [
          "Antares is a red supergiant that marks the heart of Scorpius, a prominent summer constellation in the Northern Hemisphere. Its strong reddish color makes it easy to identify.",
        ],
      },
      {
        heading: "Rival of Mars",
        paragraphs: [
          "The name Antares derives from a Greek phrase meaning 'rival of Ares' — Ares being the Greek counterpart of the Roman god Mars. When the planet Mars passes nearby, the two reddish objects can be confused, which is the origin of the name.",
        ],
      },
      {
        heading: "A massive star near its end",
        paragraphs: [
          "Antares is an enormous, cool supergiant nearing the end of its life. Like other massive supergiants, it is expected eventually to end as a supernova.",
        ],
      },
    ],
    sources: ["nasa", "esa", "iau"],
    relatedEntries: [
      ["astronomy", "stars", "betelgeuse"],
      ["astronomy", "stars", "aldebaran"],
    ],
    relatedCategories: [["astronomy", "constellations"]],
  },
  {
    section: "astronomy",
    category: "stars",
    slug: "deneb",
    title: "Deneb",
    description:
      "Deneb is a blue-white supergiant marking the tail of Cygnus and a corner of the Summer Triangle — one of the most luminous stars known.",
    excerpt: "The distant supergiant in the tail of Cygnus.",
    kind: "science",
    difficulty: "intermediate",
    tags: ["blue-white supergiant", "Cygnus", "Summer Triangle", "luminous stars"],
    facts: [
      { label: "Constellation", value: "Cygnus" },
      { label: "Type", value: "Blue-white supergiant" },
      { label: "Asterism", value: "Corner of the Summer Triangle" },
      { label: "Note", value: "Intrinsically very luminous and distant" },
    ],
    keyPoints: [
      "Marks the tail of Cygnus, the Swan.",
      "One corner of the Summer Triangle, with Vega and Altair.",
      "Appears bright despite great distance because it is extremely luminous.",
    ],
    body: [
      {
        heading: "The tail of the Swan",
        paragraphs: [
          "Deneb marks the tail of Cygnus, the Swan, which flies along the Milky Way. The constellation's brightest stars also form the 'Northern Cross', with Deneb at its top.",
        ],
      },
      {
        heading: "Distant but dazzling",
        paragraphs: [
          "Deneb is remarkable because it appears bright even though it is very far away. To look as it does at such distance, it must be intrinsically one of the most luminous stars known — a blue-white supergiant.",
        ],
      },
      {
        heading: "A Summer Triangle corner",
        paragraphs: [
          "With Vega and Altair, Deneb completes the Summer Triangle, a guidepost for finding constellations along the summer Milky Way.",
        ],
      },
    ],
    sources: ["nasa", "esa", "iau"],
    relatedEntries: [
      ["astronomy", "stars", "vega"],
      ["astronomy", "stars", "altair"],
      ["astronomy", "stars", "rigel"],
    ],
    relatedCategories: [["astronomy", "constellations"]],
  },
  {
    section: "astronomy",
    category: "stars",
    slug: "altair",
    title: "Altair",
    description:
      "Altair is a bright white star in Aquila, a near neighbor of the Sun famous for spinning so fast that it is visibly flattened.",
    excerpt: "The fast-spinning white star of Aquila.",
    kind: "science",
    difficulty: "intermediate",
    tags: ["Aquila", "Summer Triangle", "rapid rotation", "nearby stars"],
    facts: [
      { label: "Constellation", value: "Aquila" },
      { label: "Color", value: "White" },
      { label: "Asterism", value: "Corner of the Summer Triangle" },
      { label: "Feature", value: "Rotates rapidly — flattened at the poles" },
    ],
    keyPoints: [
      "One of the nearest bright stars to the Sun.",
      "Completes the Summer Triangle with Vega and Deneb.",
      "Spins so quickly that its equator bulges outward.",
    ],
    body: [
      {
        heading: "A close, bright neighbor",
        paragraphs: [
          "Altair is the brightest star in Aquila, the Eagle, and one of the nearer bright stars to the Sun. Its relative closeness contributes to its prominence on summer evenings.",
        ],
      },
      {
        heading: "A flattened, fast rotator",
        paragraphs: [
          "Altair rotates extremely rapidly — fast enough that centrifugal effect distorts it into an oblate shape, wider across the equator than pole to pole. It is one of the clearest examples of a rapidly spinning star.",
        ],
      },
      {
        heading: "Part of the Summer Triangle",
        paragraphs: [
          "Altair forms the southern corner of the Summer Triangle, together with Vega and Deneb, helping observers orient themselves along the summer Milky Way.",
        ],
      },
    ],
    sources: ["nasa", "esa", "iau"],
    relatedEntries: [
      ["astronomy", "stars", "vega"],
      ["astronomy", "stars", "deneb"],
    ],
    relatedCategories: [["astronomy", "constellations"]],
  },
  {
    section: "astronomy",
    category: "stars",
    slug: "aldebaran",
    title: "Aldebaran",
    description:
      "Aldebaran is an orange giant that forms the fiery eye of Taurus, appearing in front of the Hyades cluster though it is not a member.",
    excerpt: "The orange giant eye of Taurus.",
    kind: "science",
    difficulty: "beginner",
    tags: ["orange giant", "Taurus", "Hyades", "winter sky"],
    facts: [
      { label: "Constellation", value: "Taurus" },
      { label: "Type", value: "Orange giant" },
      { label: "Appearance", value: "Marks the eye of the Bull" },
      { label: "Note", value: "A foreground star, not part of the Hyades cluster behind it" },
    ],
    keyPoints: [
      "An evolved orange giant with a warm hue.",
      "Marks the eye of Taurus, the Bull.",
      "Lies in front of the Hyades but is not a cluster member.",
    ],
    body: [
      {
        heading: "The eye of the Bull",
        paragraphs: [
          "Aldebaran is an orange giant that marks the eye of Taurus. Its warm color and brightness make it a standout of the winter sky and a useful signpost near Orion.",
        ],
      },
      {
        heading: "In front of the Hyades",
        paragraphs: [
          "Aldebaran appears among the V-shaped Hyades star cluster, but this is a line-of-sight effect: Aldebaran is much closer to us than the cluster and is not a member of it.",
        ],
      },
      {
        heading: "An evolved star",
        paragraphs: [
          "As a giant, Aldebaran has evolved off the main sequence, expanding and cooling at the surface to its characteristic orange glow — a later stage in a star's life than the Sun's current phase.",
        ],
      },
    ],
    sources: ["nasa", "esa", "iau"],
    relatedEntries: [
      ["astronomy", "stars", "antares"],
      ["astronomy", "stars", "sirius"],
    ],
    relatedCategories: [
      ["astronomy", "star-clusters"],
      ["astronomy", "constellations"],
    ],
  },
  {
    section: "astronomy",
    category: "stars",
    slug: "spica",
    title: "Spica",
    description:
      "Spica is the brightest star in Virgo, a hot blue point of light that is actually a close pair of massive stars orbiting each other.",
    excerpt: "The blue star of Virgo — actually a close binary.",
    kind: "science",
    difficulty: "intermediate",
    tags: ["Virgo", "binary star", "blue stars", "spring sky"],
    facts: [
      { label: "Constellation", value: "Virgo" },
      { label: "Color", value: "Blue" },
      { label: "System", value: "Close binary of hot, massive stars" },
      { label: "Finding it", value: "'Arc to Arcturus, then speed on to Spica'" },
    ],
    keyPoints: [
      "The brightest star in Virgo.",
      "A hot blue star — actually two massive stars in a tight orbit.",
      "Found by following the curve of the Big Dipper's handle past Arcturus.",
    ],
    body: [
      {
        heading: "Virgo's brightest",
        paragraphs: [
          "Spica is the leading star of Virgo and a prominent feature of spring evenings in the Northern Hemisphere. Its blue tint signals high temperature.",
        ],
      },
      {
        heading: "A close double",
        paragraphs: [
          "Although it looks like one star, Spica is a close binary — two hot, massive stars orbiting so tightly that they cannot be separated by eye. Their mutual orbit subtly affects the light we receive.",
        ],
      },
      {
        heading: "Star-hopping to Spica",
        paragraphs: [
          "A classic sky guide runs: 'arc to Arcturus, then speed on to Spica.' Following the curve of the Big Dipper's handle leads first to orange Arcturus and then onward to blue Spica.",
        ],
      },
    ],
    sources: ["nasa", "esa", "iau"],
    relatedEntries: [
      ["astronomy", "stars", "sirius"],
      ["astronomy", "stars", "vega"],
    ],
    relatedCategories: [["astronomy", "constellations"]],
  },
]);
