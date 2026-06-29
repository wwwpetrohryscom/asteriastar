import { defineEntries } from "@/lib/content/entry-types";

/**
 * Astrology / Planet Meanings — the symbolic meanings astrological tradition
 * assigns to the Sun, Moon, and planets.
 *
 * Strictly interpretive. These entries describe cultural and symbolic
 * associations, not astronomy. They deliberately do NOT link to the science
 * "planets" entries: keeping the tradition/science boundary intact matters
 * more than cross-navigation. Everything is framed as astrological tradition,
 * never as a scientific claim.
 */
export const astrologyPlanetMeanings = defineEntries([
  {
    section: "astrology",
    category: "planet-meanings",
    slug: "sun-in-astrology",
    title: "Sun in Astrology",
    shortTitle: "The Sun",
    description:
      "In astrology the Sun is one of the two luminaries, traditionally associated with the core self, identity, and vitality.",
    excerpt: "The luminary of identity and vitality, in tradition.",
    kind: "interpretive",
    difficulty: "beginner",
    tags: ["luminary", "identity", "sun sign"],
    facts: [
      { label: "Type", value: "Luminary" },
      { label: "Traditional theme", value: "Core self, identity, vitality" },
      { label: "Traditionally rules", value: "Leo" },
    ],
    keyPoints: [
      "One of the two luminaries in astrology, alongside the Moon.",
      "Traditionally linked to identity, purpose, and life force.",
      "These meanings are symbolic tradition, not scientific claims.",
    ],
    body: [
      {
        heading: "In astrological tradition",
        paragraphs: [
          "In astrology the Sun is treated as a luminary and is traditionally associated with the core self — a person's sense of identity, purpose, and vitality. The popular 'star sign' is the zodiac sign the Sun is said to occupy at birth. These are symbolic associations, not scientific findings.",
        ],
      },
      {
        heading: "What it is said to represent",
        paragraphs: [
          "Astrologers traditionally read the Sun's placement as describing themes of self-expression and the drive to grow into one's identity. It is considered the center of the chart in much the same way it is the center of the Solar System — a symbolic parallel, not a physical claim.",
        ],
      },
      {
        heading: "How astrologers use it",
        paragraphs: [
          "In chart interpretation the Sun's sign and house are read together with the other placements. Its traditional rulership is the sign Leo.",
        ],
      },
    ],
    relatedEntries: [
      ["astrology", "planet-meanings", "moon-in-astrology"],
      ["astrology", "planet-meanings", "mars-in-astrology"],
    ],
    relatedCategories: [["astrology", "zodiac-signs"], ["astrology", "houses"]],
  },
  {
    section: "astrology",
    category: "planet-meanings",
    slug: "moon-in-astrology",
    title: "Moon in Astrology",
    shortTitle: "The Moon",
    description:
      "In astrology the Moon is the second luminary, traditionally associated with emotions, instincts, and a person's inner world.",
    excerpt: "The luminary of emotion and instinct, in tradition.",
    kind: "interpretive",
    difficulty: "beginner",
    tags: ["luminary", "emotions", "moon sign"],
    facts: [
      { label: "Type", value: "Luminary" },
      { label: "Traditional theme", value: "Emotions, instincts, inner world" },
      { label: "Traditionally rules", value: "Cancer" },
    ],
    keyPoints: [
      "The second of the two luminaries, paired with the Sun.",
      "Traditionally linked to feeling, instinct, and the need for security.",
      "These meanings are symbolic tradition, not scientific claims.",
    ],
    body: [
      {
        heading: "In astrological tradition",
        paragraphs: [
          "In astrology the Moon is the second luminary and is traditionally associated with the emotional and instinctive side of a person — moods, needs, and the private inner world. Astrologers describe it as complementing the Sun's outward identity with an inward emotional nature. These are symbolic associations, not scientific findings.",
        ],
      },
      {
        heading: "What it is said to represent",
        paragraphs: [
          "Astrologers traditionally interpret the Moon's placement as describing how a person seeks comfort, responds emotionally, and forms habits. It is often connected with themes of nurturing, memory, and the sense of home.",
        ],
      },
      {
        heading: "How astrologers use it",
        paragraphs: [
          "In chart interpretation the Moon's sign and house are read alongside the Sun and other placements to flesh out the emotional picture. Its traditional rulership is the sign Cancer.",
        ],
      },
    ],
    relatedEntries: [
      ["astrology", "planet-meanings", "sun-in-astrology"],
      ["astrology", "planet-meanings", "venus-in-astrology"],
    ],
    relatedCategories: [["astrology", "zodiac-signs"], ["astrology", "houses"]],
  },
  {
    section: "astrology",
    category: "planet-meanings",
    slug: "mercury-in-astrology",
    title: "Mercury in Astrology",
    shortTitle: "Mercury",
    description:
      "In astrology Mercury is a personal planet, traditionally associated with communication, thinking, and learning.",
    excerpt: "The personal planet of mind and communication, in tradition.",
    kind: "interpretive",
    difficulty: "beginner",
    tags: ["personal planet", "communication", "mind"],
    facts: [
      { label: "Type", value: "Personal planet" },
      { label: "Traditional theme", value: "Communication, thinking, learning" },
      { label: "Traditionally rules", value: "Gemini and Virgo" },
    ],
    keyPoints: [
      "Counted among the personal planets in astrology.",
      "Traditionally linked to the mind, speech, and how a person learns.",
      "These meanings are symbolic tradition, not scientific claims.",
    ],
    body: [
      {
        heading: "In astrological tradition",
        paragraphs: [
          "In astrology Mercury is one of the personal planets and is traditionally associated with the mind — how a person thinks, speaks, learns, and exchanges information. Astrologers often cast it as the messenger of the chart. These are symbolic associations, not scientific findings.",
        ],
      },
      {
        heading: "What it is said to represent",
        paragraphs: [
          "Astrologers traditionally read Mercury's placement as describing a person's communication style, reasoning, and curiosity. It is frequently mentioned in popular astrology in connection with phases described as 'Mercury retrograde'.",
        ],
      },
      {
        heading: "How astrologers use it",
        paragraphs: [
          "In chart interpretation Mercury's sign and house are read together with the other placements to characterize the intellect. Its traditional rulerships are the signs Gemini and Virgo.",
        ],
      },
    ],
    relatedEntries: [
      ["astrology", "planet-meanings", "venus-in-astrology"],
      ["astrology", "planet-meanings", "sun-in-astrology"],
    ],
    relatedCategories: [["astrology", "zodiac-signs"], ["astrology", "houses"]],
  },
  {
    section: "astrology",
    category: "planet-meanings",
    slug: "venus-in-astrology",
    title: "Venus in Astrology",
    shortTitle: "Venus",
    description:
      "In astrology Venus is a personal planet, traditionally associated with love, values, beauty, and relationships.",
    excerpt: "The personal planet of love and values, in tradition.",
    kind: "interpretive",
    difficulty: "beginner",
    tags: ["personal planet", "love", "values"],
    facts: [
      { label: "Type", value: "Personal planet" },
      { label: "Traditional theme", value: "Love, values, beauty, relationships" },
      { label: "Traditionally rules", value: "Taurus and Libra" },
    ],
    keyPoints: [
      "Counted among the personal planets in astrology.",
      "Traditionally linked to affection, attraction, and what a person values.",
      "These meanings are symbolic tradition, not scientific claims.",
    ],
    body: [
      {
        heading: "In astrological tradition",
        paragraphs: [
          "In astrology Venus is one of the personal planets and is traditionally associated with love, pleasure, and the things a person finds beautiful or worthwhile. Astrologers describe it as governing attraction and harmony. These are symbolic associations, not scientific findings.",
        ],
      },
      {
        heading: "What it is said to represent",
        paragraphs: [
          "Astrologers traditionally read Venus's placement as describing how a person relates, what they are drawn to, and how they express affection and taste. It is often discussed in connection with relationships and personal values.",
        ],
      },
      {
        heading: "How astrologers use it",
        paragraphs: [
          "In chart interpretation Venus's sign and house are read together with the other placements to characterize relating and values. Its traditional rulerships are the signs Taurus and Libra.",
        ],
      },
    ],
    relatedEntries: [
      ["astrology", "planet-meanings", "mars-in-astrology"],
      ["astrology", "planet-meanings", "moon-in-astrology"],
    ],
    relatedCategories: [["astrology", "zodiac-signs"], ["astrology", "houses"]],
  },
  {
    section: "astrology",
    category: "planet-meanings",
    slug: "mars-in-astrology",
    title: "Mars in Astrology",
    shortTitle: "Mars",
    description:
      "In astrology Mars is a personal planet, traditionally associated with drive, energy, assertion, and action.",
    excerpt: "The personal planet of drive and action, in tradition.",
    kind: "interpretive",
    difficulty: "beginner",
    tags: ["personal planet", "drive", "action"],
    facts: [
      { label: "Type", value: "Personal planet" },
      { label: "Traditional theme", value: "Drive, energy, assertion, action" },
      { label: "Traditionally rules", value: "Aries (and traditionally Scorpio)" },
    ],
    keyPoints: [
      "Counted among the personal planets in astrology.",
      "Traditionally linked to assertion, desire, and physical energy.",
      "These meanings are symbolic tradition, not scientific claims.",
    ],
    body: [
      {
        heading: "In astrological tradition",
        paragraphs: [
          "In astrology Mars is one of the personal planets and is traditionally associated with drive, courage, and the will to act. Astrologers describe it as the planet of energy and assertion in the chart. These are symbolic associations, not scientific findings.",
        ],
      },
      {
        heading: "What it is said to represent",
        paragraphs: [
          "Astrologers traditionally read Mars's placement as describing how a person pursues goals, expresses anger, and channels physical and competitive energy. It is often linked with ambition and the capacity for initiative.",
        ],
      },
      {
        heading: "How astrologers use it",
        paragraphs: [
          "In chart interpretation Mars's sign and house are read together with the other placements to characterize action and drive. Its modern rulership is the sign Aries, and in traditional astrology it also rules Scorpio.",
        ],
      },
    ],
    relatedEntries: [
      ["astrology", "planet-meanings", "venus-in-astrology"],
      ["astrology", "planet-meanings", "sun-in-astrology"],
    ],
    relatedCategories: [["astrology", "zodiac-signs"], ["astrology", "houses"]],
  },
  {
    section: "astrology",
    category: "planet-meanings",
    slug: "jupiter-in-astrology",
    title: "Jupiter in Astrology",
    shortTitle: "Jupiter",
    description:
      "In astrology Jupiter is a social planet, traditionally associated with expansion, growth, optimism, and abundance.",
    excerpt: "The social planet of expansion and growth, in tradition.",
    kind: "interpretive",
    difficulty: "intermediate",
    tags: ["social planet", "expansion", "growth"],
    facts: [
      { label: "Type", value: "Social planet" },
      { label: "Traditional theme", value: "Expansion, growth, optimism, abundance" },
      { label: "Traditionally rules", value: "Sagittarius (and traditionally Pisces)" },
    ],
    keyPoints: [
      "Counted among the social planets in astrology.",
      "Traditionally linked to growth, opportunity, and good fortune.",
      "These meanings are symbolic tradition, not scientific claims.",
    ],
    body: [
      {
        heading: "In astrological tradition",
        paragraphs: [
          "In astrology Jupiter is a social planet and is traditionally associated with expansion, optimism, and the search for meaning. Astrologers often describe it as the 'greater benefic', a symbol of growth and abundance. These are symbolic associations, not scientific findings.",
        ],
      },
      {
        heading: "What it is said to represent",
        paragraphs: [
          "Astrologers traditionally read Jupiter's placement as describing where a person seeks growth, learning, and broader horizons. It is frequently linked with themes of generosity, faith, and opportunity.",
        ],
      },
      {
        heading: "How astrologers use it",
        paragraphs: [
          "In chart interpretation Jupiter's sign and house are read together with the other placements to characterize growth and outlook. Its modern rulership is the sign Sagittarius, and in traditional astrology it also rules Pisces.",
        ],
      },
    ],
    relatedEntries: [
      ["astrology", "planet-meanings", "saturn-in-astrology"],
      ["astrology", "planet-meanings", "sun-in-astrology"],
    ],
    relatedCategories: [["astrology", "zodiac-signs"], ["astrology", "houses"]],
  },
  {
    section: "astrology",
    category: "planet-meanings",
    slug: "saturn-in-astrology",
    title: "Saturn in Astrology",
    shortTitle: "Saturn",
    description:
      "In astrology Saturn is a social planet, traditionally associated with discipline, structure, responsibility, and limits.",
    excerpt: "The social planet of discipline and structure, in tradition.",
    kind: "interpretive",
    difficulty: "intermediate",
    tags: ["social planet", "discipline", "structure"],
    facts: [
      { label: "Type", value: "Social planet" },
      { label: "Traditional theme", value: "Discipline, structure, responsibility, limits" },
      { label: "Traditionally rules", value: "Capricorn (and traditionally Aquarius)" },
    ],
    keyPoints: [
      "Counted among the social planets in astrology.",
      "Traditionally linked to boundaries, discipline, and maturity.",
      "These meanings are symbolic tradition, not scientific claims.",
    ],
    body: [
      {
        heading: "In astrological tradition",
        paragraphs: [
          "In astrology Saturn is a social planet and is traditionally associated with structure, discipline, and the lessons of time and limitation. Astrologers often describe it as the taskmaster of the chart. These are symbolic associations, not scientific findings.",
        ],
      },
      {
        heading: "What it is said to represent",
        paragraphs: [
          "Astrologers traditionally read Saturn's placement as describing where a person meets responsibility, restriction, and the need for patience and effort. It is frequently linked with maturity earned through challenge, including the much-discussed 'Saturn return'.",
        ],
      },
      {
        heading: "How astrologers use it",
        paragraphs: [
          "In chart interpretation Saturn's sign and house are read together with the other placements to characterize discipline and limits. Its modern rulership is the sign Capricorn, and in traditional astrology it also rules Aquarius.",
        ],
      },
    ],
    relatedEntries: [
      ["astrology", "planet-meanings", "jupiter-in-astrology"],
      ["astrology", "planet-meanings", "uranus-in-astrology"],
    ],
    relatedCategories: [["astrology", "zodiac-signs"], ["astrology", "houses"]],
  },
  {
    section: "astrology",
    category: "planet-meanings",
    slug: "uranus-in-astrology",
    title: "Uranus in Astrology",
    shortTitle: "Uranus",
    description:
      "In astrology Uranus is a modern outer planet, traditionally associated with change, innovation, independence, and disruption.",
    excerpt: "The outer planet of change and innovation, in tradition.",
    kind: "interpretive",
    difficulty: "intermediate",
    tags: ["outer planet", "change", "innovation"],
    facts: [
      { label: "Type", value: "Outer (modern) planet" },
      { label: "Traditional theme", value: "Change, innovation, independence, disruption" },
      { label: "Modern ruler of", value: "Aquarius" },
    ],
    keyPoints: [
      "Counted among the modern outer planets in astrology.",
      "Traditionally linked to sudden change, originality, and freedom.",
      "These meanings are symbolic tradition, not scientific claims.",
    ],
    body: [
      {
        heading: "In astrological tradition",
        paragraphs: [
          "In astrology Uranus is one of the modern outer planets and is traditionally associated with change, innovation, and the urge toward independence. Because it was identified only in the modern era, astrologers added it to the symbolic system relatively recently. These are symbolic associations, not scientific findings.",
        ],
      },
      {
        heading: "What it is said to represent",
        paragraphs: [
          "Astrologers traditionally read Uranus's placement as describing where a person breaks from convention, seeks freedom, or experiences sudden shifts. It is frequently linked with originality, rebellion, and progress.",
        ],
      },
      {
        heading: "How astrologers use it",
        paragraphs: [
          "In chart interpretation Uranus's sign and house are read together with the other placements; as a slow-moving planet its sign is shared across a generation. It is regarded in modern astrology as the ruler of Aquarius.",
        ],
      },
    ],
    relatedEntries: [
      ["astrology", "planet-meanings", "neptune-in-astrology"],
      ["astrology", "planet-meanings", "saturn-in-astrology"],
    ],
    relatedCategories: [["astrology", "zodiac-signs"], ["astrology", "houses"]],
  },
  {
    section: "astrology",
    category: "planet-meanings",
    slug: "neptune-in-astrology",
    title: "Neptune in Astrology",
    shortTitle: "Neptune",
    description:
      "In astrology Neptune is a modern outer planet, traditionally associated with dreams, imagination, spirituality, and illusion.",
    excerpt: "The outer planet of dreams and imagination, in tradition.",
    kind: "interpretive",
    difficulty: "intermediate",
    tags: ["outer planet", "dreams", "imagination"],
    facts: [
      { label: "Type", value: "Outer (modern) planet" },
      { label: "Traditional theme", value: "Dreams, imagination, spirituality, illusion" },
      { label: "Modern ruler of", value: "Pisces" },
    ],
    keyPoints: [
      "Counted among the modern outer planets in astrology.",
      "Traditionally linked to imagination, spirituality, and the dissolving of boundaries.",
      "These meanings are symbolic tradition, not scientific claims.",
    ],
    body: [
      {
        heading: "In astrological tradition",
        paragraphs: [
          "In astrology Neptune is one of the modern outer planets and is traditionally associated with dreams, imagination, and the spiritual or transcendent. Astrologers added it to the symbolic system in the modern era. These are symbolic associations, not scientific findings.",
        ],
      },
      {
        heading: "What it is said to represent",
        paragraphs: [
          "Astrologers traditionally read Neptune's placement as describing where a person idealizes, imagines, or seeks the intangible — and where they may be prone to illusion or escapism. It is frequently linked with art, compassion, and mysticism.",
        ],
      },
      {
        heading: "How astrologers use it",
        paragraphs: [
          "In chart interpretation Neptune's sign and house are read together with the other placements; as a slow-moving planet its sign is shared across a generation. It is regarded in modern astrology as the ruler of Pisces.",
        ],
      },
    ],
    relatedEntries: [
      ["astrology", "planet-meanings", "pluto-in-astrology"],
      ["astrology", "planet-meanings", "uranus-in-astrology"],
    ],
    relatedCategories: [["astrology", "zodiac-signs"], ["astrology", "houses"]],
  },
  {
    section: "astrology",
    category: "planet-meanings",
    slug: "pluto-in-astrology",
    title: "Pluto in Astrology",
    shortTitle: "Pluto",
    description:
      "In astrology Pluto is a modern outer planet, traditionally associated with transformation, power, and regeneration.",
    excerpt: "The outer planet of transformation and power, in tradition.",
    kind: "interpretive",
    difficulty: "intermediate",
    tags: ["outer planet", "transformation", "power"],
    facts: [
      { label: "Type", value: "Outer (modern) planet" },
      { label: "Traditional theme", value: "Transformation, power, regeneration" },
      { label: "Modern ruler of", value: "Scorpio" },
    ],
    keyPoints: [
      "Counted among the modern outer planets in astrology.",
      "Traditionally linked to deep transformation, power, and rebirth.",
      "These meanings are symbolic tradition, not scientific claims.",
    ],
    body: [
      {
        heading: "In astrological tradition",
        paragraphs: [
          "In astrology Pluto is one of the modern outer planets and is traditionally associated with transformation, power, and regeneration. Astrologers continue to use it symbolically regardless of its classification in astronomy. These are symbolic associations, not scientific findings.",
        ],
      },
      {
        heading: "What it is said to represent",
        paragraphs: [
          "Astrologers traditionally read Pluto's placement as describing where a person undergoes profound change, confronts power, or experiences cycles of endings and renewal. It is frequently linked with depth, intensity, and rebirth.",
        ],
      },
      {
        heading: "How astrologers use it",
        paragraphs: [
          "In chart interpretation Pluto's sign and house are read together with the other placements; as the slowest-moving body its sign is shared across a generation. It is regarded in modern astrology as the ruler of Scorpio.",
        ],
      },
    ],
    relatedEntries: [
      ["astrology", "planet-meanings", "neptune-in-astrology"],
      ["astrology", "planet-meanings", "mars-in-astrology"],
    ],
    relatedCategories: [["astrology", "zodiac-signs"], ["astrology", "houses"]],
  },
]);
