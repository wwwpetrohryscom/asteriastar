import { defineEntries } from "@/lib/content/entry-types";

/**
 * Astrology / Zodiac Signs — interpretive entries.
 *
 * These describe the traditional, symbolic associations of the twelve Western
 * sun signs. Everything here is cultural and interpretive, not scientific: the
 * meanings are framed throughout as astrological tradition, never as established
 * fact, and no entry claims that astrology predicts or explains real events.
 * The date ranges are the approximate traditional tropical sun-sign windows.
 */
export const astrologyZodiacSigns = defineEntries([
  {
    section: "astrology",
    category: "zodiac-signs",
    slug: "aries",
    title: "Aries",
    description:
      "Aries is the first sign of the zodiac, traditionally associated in astrology with initiative, energy, and a pioneering spirit.",
    excerpt: "The first zodiac sign — the Ram.",
    kind: "interpretive",
    difficulty: "beginner",
    tags: ["fire sign", "cardinal sign", "the Ram"],
    facts: [
      { label: "Element", value: "Fire" },
      { label: "Modality", value: "Cardinal" },
      { label: "Ruling planet", value: "Mars (traditional)" },
      { label: "Symbol", value: "The Ram" },
      { label: "Dates", value: "Approximately March 21 – April 19" },
    ],
    keyPoints: [
      "The first sign of the zodiac in the Western tradition.",
      "Traditionally linked to initiative, courage, and new beginnings.",
      "These associations are cultural and symbolic, not scientific.",
    ],
    body: [
      {
        heading: "In astrological tradition",
        paragraphs: [
          "In astrology, Aries is the first sign of the zodiac and is traditionally associated with beginnings, drive, and a bold, pioneering temperament. These meanings are symbolic and interpretive rather than scientifically established.",
        ],
      },
      {
        heading: "Element and modality",
        paragraphs: [
          "Aries is a fire sign and a cardinal sign, a combination astrologers traditionally read as energetic and initiating. Its traditional ruling planet is Mars.",
        ],
      },
      {
        heading: "Symbol and dates",
        paragraphs: [
          "Aries is symbolized by the Ram. In the tropical zodiac used in Western astrology, the Sun is traditionally said to pass through Aries from around March 21 to April 19.",
        ],
      },
    ],
    relatedEntries: [
      ["astrology", "zodiac-signs", "leo"],
      ["astrology", "zodiac-signs", "taurus"],
    ],
    relatedCategories: [["astrology", "planet-meanings"], ["astrology", "birth-chart"]],
  },
  {
    section: "astrology",
    category: "zodiac-signs",
    slug: "taurus",
    title: "Taurus",
    description:
      "Taurus is the second sign of the zodiac, traditionally associated in astrology with steadiness, patience, and an appreciation for comfort and beauty.",
    excerpt: "The second zodiac sign — the Bull.",
    kind: "interpretive",
    difficulty: "beginner",
    tags: ["earth sign", "fixed sign", "the Bull"],
    facts: [
      { label: "Element", value: "Earth" },
      { label: "Modality", value: "Fixed" },
      { label: "Ruling planet", value: "Venus (traditional)" },
      { label: "Symbol", value: "The Bull" },
      { label: "Dates", value: "Approximately April 20 – May 20" },
    ],
    keyPoints: [
      "The second sign of the zodiac in the Western tradition.",
      "Traditionally linked to steadiness, patience, and sensual enjoyment.",
      "These associations are cultural and symbolic, not scientific.",
    ],
    body: [
      {
        heading: "In astrological tradition",
        paragraphs: [
          "In astrology, Taurus is traditionally associated with stability, persistence, and a grounded, deliberate temperament. Astrologers often describe it as valuing security and the pleasures of the physical world, though these readings are symbolic rather than scientifically established.",
        ],
      },
      {
        heading: "Element and modality",
        paragraphs: [
          "Taurus is an earth sign and a fixed sign, a pairing astrologers traditionally interpret as steady, reliable, and resistant to being rushed. Its traditional ruling planet is Venus.",
        ],
      },
      {
        heading: "Symbol and dates",
        paragraphs: [
          "Taurus is symbolized by the Bull. In the tropical zodiac used in Western astrology, the Sun is traditionally said to pass through Taurus from around April 20 to May 20.",
        ],
      },
    ],
    relatedEntries: [
      ["astrology", "zodiac-signs", "virgo"],
      ["astrology", "zodiac-signs", "capricorn"],
    ],
    relatedCategories: [["astrology", "planet-meanings"], ["astrology", "birth-chart"]],
  },
  {
    section: "astrology",
    category: "zodiac-signs",
    slug: "gemini",
    title: "Gemini",
    description:
      "Gemini is the third sign of the zodiac, traditionally associated in astrology with curiosity, communication, and quick-witted versatility.",
    excerpt: "The third zodiac sign — the Twins.",
    kind: "interpretive",
    difficulty: "beginner",
    tags: ["air sign", "mutable sign", "the Twins"],
    facts: [
      { label: "Element", value: "Air" },
      { label: "Modality", value: "Mutable" },
      { label: "Ruling planet", value: "Mercury (traditional)" },
      { label: "Symbol", value: "The Twins" },
      { label: "Dates", value: "Approximately May 21 – June 20" },
    ],
    keyPoints: [
      "The third sign of the zodiac in the Western tradition.",
      "Traditionally linked to curiosity, communication, and adaptability.",
      "These associations are cultural and symbolic, not scientific.",
    ],
    body: [
      {
        heading: "In astrological tradition",
        paragraphs: [
          "In astrology, Gemini is traditionally associated with curiosity, communication, and a lively, versatile mind. Astrologers often describe it as quick to learn and eager to exchange ideas, though these meanings are interpretive rather than scientifically established.",
        ],
      },
      {
        heading: "Element and modality",
        paragraphs: [
          "Gemini is an air sign and a mutable sign, a combination astrologers traditionally read as flexible, communicative, and intellectually restless. Its traditional ruling planet is Mercury.",
        ],
      },
      {
        heading: "Symbol and dates",
        paragraphs: [
          "Gemini is symbolized by the Twins. In the tropical zodiac used in Western astrology, the Sun is traditionally said to pass through Gemini from around May 21 to June 20.",
        ],
      },
    ],
    relatedEntries: [
      ["astrology", "zodiac-signs", "libra"],
      ["astrology", "zodiac-signs", "aquarius"],
    ],
    relatedCategories: [["astrology", "planet-meanings"], ["astrology", "birth-chart"]],
  },
  {
    section: "astrology",
    category: "zodiac-signs",
    slug: "cancer",
    title: "Cancer",
    description:
      "Cancer is the fourth sign of the zodiac, traditionally associated in astrology with nurturing, emotional sensitivity, and a strong sense of home.",
    excerpt: "The fourth zodiac sign — the Crab.",
    kind: "interpretive",
    difficulty: "beginner",
    tags: ["water sign", "cardinal sign", "the Crab"],
    facts: [
      { label: "Element", value: "Water" },
      { label: "Modality", value: "Cardinal" },
      { label: "Ruling planet", value: "The Moon (traditional)" },
      { label: "Symbol", value: "The Crab" },
      { label: "Dates", value: "Approximately June 21 – July 22" },
    ],
    keyPoints: [
      "The fourth sign of the zodiac in the Western tradition.",
      "Traditionally linked to nurturing, emotion, and home and family.",
      "These associations are cultural and symbolic, not scientific.",
    ],
    body: [
      {
        heading: "In astrological tradition",
        paragraphs: [
          "In astrology, Cancer is traditionally associated with nurturing, emotional depth, and a protective devotion to home and family. Astrologers often describe it as caring and intuitive, though these readings are symbolic rather than scientifically established.",
        ],
      },
      {
        heading: "Element and modality",
        paragraphs: [
          "Cancer is a water sign and a cardinal sign, a pairing astrologers traditionally interpret as emotionally responsive and quietly initiating. It is the only sign traditionally ruled by the Moon.",
        ],
      },
      {
        heading: "Symbol and dates",
        paragraphs: [
          "Cancer is symbolized by the Crab. In the tropical zodiac used in Western astrology, the Sun is traditionally said to pass through Cancer from around June 21 to July 22.",
        ],
      },
    ],
    relatedEntries: [
      ["astrology", "zodiac-signs", "scorpio"],
      ["astrology", "zodiac-signs", "pisces"],
    ],
    relatedCategories: [["astrology", "planet-meanings"], ["astrology", "birth-chart"]],
  },
  {
    section: "astrology",
    category: "zodiac-signs",
    slug: "leo",
    title: "Leo",
    description:
      "Leo is the fifth sign of the zodiac, traditionally associated in astrology with confidence, warmth, and a flair for creative self-expression.",
    excerpt: "The fifth zodiac sign — the Lion.",
    kind: "interpretive",
    difficulty: "beginner",
    tags: ["fire sign", "fixed sign", "the Lion"],
    facts: [
      { label: "Element", value: "Fire" },
      { label: "Modality", value: "Fixed" },
      { label: "Ruling planet", value: "The Sun (traditional)" },
      { label: "Symbol", value: "The Lion" },
      { label: "Dates", value: "Approximately July 23 – August 22" },
    ],
    keyPoints: [
      "The fifth sign of the zodiac in the Western tradition.",
      "Traditionally linked to confidence, warmth, and creative expression.",
      "These associations are cultural and symbolic, not scientific.",
    ],
    body: [
      {
        heading: "In astrological tradition",
        paragraphs: [
          "In astrology, Leo is traditionally associated with confidence, generosity, and a warm, expressive presence. Astrologers often describe it as drawn to creativity and recognition, though these meanings are interpretive rather than scientifically established.",
        ],
      },
      {
        heading: "Element and modality",
        paragraphs: [
          "Leo is a fire sign and a fixed sign, a combination astrologers traditionally read as steady, radiant, and self-assured. It is the only sign traditionally ruled by the Sun.",
        ],
      },
      {
        heading: "Symbol and dates",
        paragraphs: [
          "Leo is symbolized by the Lion. In the tropical zodiac used in Western astrology, the Sun is traditionally said to pass through Leo from around July 23 to August 22.",
        ],
      },
    ],
    relatedEntries: [
      ["astrology", "zodiac-signs", "aries"],
      ["astrology", "zodiac-signs", "sagittarius"],
    ],
    relatedCategories: [["astrology", "planet-meanings"], ["astrology", "birth-chart"]],
  },
  {
    section: "astrology",
    category: "zodiac-signs",
    slug: "virgo",
    title: "Virgo",
    description:
      "Virgo is the sixth sign of the zodiac, traditionally associated in astrology with precision, practicality, and a thoughtful spirit of service.",
    excerpt: "The sixth zodiac sign — the Maiden.",
    kind: "interpretive",
    difficulty: "beginner",
    tags: ["earth sign", "mutable sign", "the Maiden"],
    facts: [
      { label: "Element", value: "Earth" },
      { label: "Modality", value: "Mutable" },
      { label: "Ruling planet", value: "Mercury (traditional)" },
      { label: "Symbol", value: "The Maiden" },
      { label: "Dates", value: "Approximately August 23 – September 22" },
    ],
    keyPoints: [
      "The sixth sign of the zodiac in the Western tradition.",
      "Traditionally linked to precision, analysis, and helpfulness.",
      "These associations are cultural and symbolic, not scientific.",
    ],
    body: [
      {
        heading: "In astrological tradition",
        paragraphs: [
          "In astrology, Virgo is traditionally associated with precision, careful analysis, and a practical desire to be of use. Astrologers often describe it as attentive to detail and quietly diligent, though these readings are symbolic rather than scientifically established.",
        ],
      },
      {
        heading: "Element and modality",
        paragraphs: [
          "Virgo is an earth sign and a mutable sign, a pairing astrologers traditionally interpret as grounded yet adaptable and discerning. Its traditional ruling planet is Mercury.",
        ],
      },
      {
        heading: "Symbol and dates",
        paragraphs: [
          "Virgo is symbolized by the Maiden. In the tropical zodiac used in Western astrology, the Sun is traditionally said to pass through Virgo from around August 23 to September 22.",
        ],
      },
    ],
    relatedEntries: [
      ["astrology", "zodiac-signs", "taurus"],
      ["astrology", "zodiac-signs", "capricorn"],
    ],
    relatedCategories: [["astrology", "planet-meanings"], ["astrology", "birth-chart"]],
  },
  {
    section: "astrology",
    category: "zodiac-signs",
    slug: "libra",
    title: "Libra",
    description:
      "Libra is the seventh sign of the zodiac, traditionally associated in astrology with balance, harmony, and a strong sense of fairness.",
    excerpt: "The seventh zodiac sign — the Scales.",
    kind: "interpretive",
    difficulty: "beginner",
    tags: ["air sign", "cardinal sign", "the Scales"],
    facts: [
      { label: "Element", value: "Air" },
      { label: "Modality", value: "Cardinal" },
      { label: "Ruling planet", value: "Venus (traditional)" },
      { label: "Symbol", value: "The Scales" },
      { label: "Dates", value: "Approximately September 23 – October 22" },
    ],
    keyPoints: [
      "The seventh sign of the zodiac in the Western tradition.",
      "Traditionally linked to balance, harmony, and partnership.",
      "These associations are cultural and symbolic, not scientific.",
    ],
    body: [
      {
        heading: "In astrological tradition",
        paragraphs: [
          "In astrology, Libra is traditionally associated with balance, fairness, and a desire for harmony in relationships. Astrologers often describe it as diplomatic and attuned to others, though these meanings are interpretive rather than scientifically established.",
        ],
      },
      {
        heading: "Element and modality",
        paragraphs: [
          "Libra is an air sign and a cardinal sign, a combination astrologers traditionally read as sociable, relational, and inclined to initiate connection. Its traditional ruling planet is Venus.",
        ],
      },
      {
        heading: "Symbol and dates",
        paragraphs: [
          "Libra is symbolized by the Scales — the one zodiac symbol that is an object rather than a living figure. In the tropical zodiac used in Western astrology, the Sun is traditionally said to pass through Libra from around September 23 to October 22.",
        ],
      },
    ],
    relatedEntries: [
      ["astrology", "zodiac-signs", "gemini"],
      ["astrology", "zodiac-signs", "aquarius"],
    ],
    relatedCategories: [["astrology", "planet-meanings"], ["astrology", "birth-chart"]],
  },
  {
    section: "astrology",
    category: "zodiac-signs",
    slug: "scorpio",
    title: "Scorpio",
    description:
      "Scorpio is the eighth sign of the zodiac, traditionally associated in astrology with intensity, emotional depth, and transformation.",
    excerpt: "The eighth zodiac sign — the Scorpion.",
    kind: "interpretive",
    difficulty: "beginner",
    tags: ["water sign", "fixed sign", "the Scorpion"],
    facts: [
      { label: "Element", value: "Water" },
      { label: "Modality", value: "Fixed" },
      { label: "Ruling planet", value: "Mars (traditional)" },
      { label: "Symbol", value: "The Scorpion" },
      { label: "Dates", value: "Approximately October 23 – November 21" },
    ],
    keyPoints: [
      "The eighth sign of the zodiac in the Western tradition.",
      "Traditionally linked to intensity, depth, and transformation.",
      "These associations are cultural and symbolic, not scientific.",
    ],
    body: [
      {
        heading: "In astrological tradition",
        paragraphs: [
          "In astrology, Scorpio is traditionally associated with intensity, emotional depth, and themes of transformation. Astrologers often describe it as private, perceptive, and drawn to what lies beneath the surface, though these readings are symbolic rather than scientifically established.",
        ],
      },
      {
        heading: "Element and modality",
        paragraphs: [
          "Scorpio is a water sign and a fixed sign, a pairing astrologers traditionally interpret as deeply feeling yet focused and determined. Its traditional ruling planet is Mars.",
        ],
      },
      {
        heading: "Symbol and dates",
        paragraphs: [
          "Scorpio is symbolized by the Scorpion. In the tropical zodiac used in Western astrology, the Sun is traditionally said to pass through Scorpio from around October 23 to November 21.",
        ],
      },
    ],
    relatedEntries: [
      ["astrology", "zodiac-signs", "cancer"],
      ["astrology", "zodiac-signs", "pisces"],
    ],
    relatedCategories: [["astrology", "planet-meanings"], ["astrology", "birth-chart"]],
  },
  {
    section: "astrology",
    category: "zodiac-signs",
    slug: "sagittarius",
    title: "Sagittarius",
    description:
      "Sagittarius is the ninth sign of the zodiac, traditionally associated in astrology with adventure, optimism, and a love of freedom and exploration.",
    excerpt: "The ninth zodiac sign — the Archer.",
    kind: "interpretive",
    difficulty: "beginner",
    tags: ["fire sign", "mutable sign", "the Archer"],
    facts: [
      { label: "Element", value: "Fire" },
      { label: "Modality", value: "Mutable" },
      { label: "Ruling planet", value: "Jupiter (traditional)" },
      { label: "Symbol", value: "The Archer" },
      { label: "Dates", value: "Approximately November 22 – December 21" },
    ],
    keyPoints: [
      "The ninth sign of the zodiac in the Western tradition.",
      "Traditionally linked to adventure, optimism, and exploration.",
      "These associations are cultural and symbolic, not scientific.",
    ],
    body: [
      {
        heading: "In astrological tradition",
        paragraphs: [
          "In astrology, Sagittarius is traditionally associated with optimism, a love of adventure, and a far-reaching search for meaning. Astrologers often describe it as freedom-loving and philosophical, though these meanings are interpretive rather than scientifically established.",
        ],
      },
      {
        heading: "Element and modality",
        paragraphs: [
          "Sagittarius is a fire sign and a mutable sign, a combination astrologers traditionally read as enthusiastic, expansive, and open to change. Its traditional ruling planet is Jupiter.",
        ],
      },
      {
        heading: "Symbol and dates",
        paragraphs: [
          "Sagittarius is symbolized by the Archer, often depicted as a centaur drawing a bow. In the tropical zodiac used in Western astrology, the Sun is traditionally said to pass through Sagittarius from around November 22 to December 21.",
        ],
      },
    ],
    relatedEntries: [
      ["astrology", "zodiac-signs", "aries"],
      ["astrology", "zodiac-signs", "leo"],
    ],
    relatedCategories: [["astrology", "planet-meanings"], ["astrology", "birth-chart"]],
  },
  {
    section: "astrology",
    category: "zodiac-signs",
    slug: "capricorn",
    title: "Capricorn",
    description:
      "Capricorn is the tenth sign of the zodiac, traditionally associated in astrology with discipline, ambition, and patient long-term effort.",
    excerpt: "The tenth zodiac sign — the Sea-Goat.",
    kind: "interpretive",
    difficulty: "beginner",
    tags: ["earth sign", "cardinal sign", "the Sea-Goat"],
    facts: [
      { label: "Element", value: "Earth" },
      { label: "Modality", value: "Cardinal" },
      { label: "Ruling planet", value: "Saturn (traditional)" },
      { label: "Symbol", value: "The Sea-Goat" },
      { label: "Dates", value: "Approximately December 22 – January 19" },
    ],
    keyPoints: [
      "The tenth sign of the zodiac in the Western tradition.",
      "Traditionally linked to discipline, ambition, and perseverance.",
      "These associations are cultural and symbolic, not scientific.",
    ],
    body: [
      {
        heading: "In astrological tradition",
        paragraphs: [
          "In astrology, Capricorn is traditionally associated with discipline, ambition, and a patient, responsible approach to long-term goals. Astrologers often describe it as enduring and pragmatic, though these readings are symbolic rather than scientifically established.",
        ],
      },
      {
        heading: "Element and modality",
        paragraphs: [
          "Capricorn is an earth sign and a cardinal sign, a pairing astrologers traditionally interpret as grounded yet driven to build and achieve. Its traditional ruling planet is Saturn.",
        ],
      },
      {
        heading: "Symbol and dates",
        paragraphs: [
          "Capricorn is symbolized by the Sea-Goat, a mythic creature with the body of a goat and the tail of a fish. In the tropical zodiac used in Western astrology, the Sun is traditionally said to pass through Capricorn from around December 22 to January 19.",
        ],
      },
    ],
    relatedEntries: [
      ["astrology", "zodiac-signs", "taurus"],
      ["astrology", "zodiac-signs", "virgo"],
    ],
    relatedCategories: [["astrology", "planet-meanings"], ["astrology", "birth-chart"]],
  },
  {
    section: "astrology",
    category: "zodiac-signs",
    slug: "aquarius",
    title: "Aquarius",
    description:
      "Aquarius is the eleventh sign of the zodiac, traditionally associated in astrology with independence, innovation, and humanitarian ideals.",
    excerpt: "The eleventh zodiac sign — the Water-Bearer.",
    kind: "interpretive",
    difficulty: "beginner",
    tags: ["air sign", "fixed sign", "the Water-Bearer"],
    facts: [
      { label: "Element", value: "Air" },
      { label: "Modality", value: "Fixed" },
      { label: "Ruling planet", value: "Saturn (traditional)" },
      { label: "Symbol", value: "The Water-Bearer" },
      { label: "Dates", value: "Approximately January 20 – February 18" },
    ],
    keyPoints: [
      "The eleventh sign of the zodiac in the Western tradition.",
      "Traditionally linked to independence, innovation, and community ideals.",
      "These associations are cultural and symbolic, not scientific.",
    ],
    body: [
      {
        heading: "In astrological tradition",
        paragraphs: [
          "In astrology, Aquarius is traditionally associated with independence, originality, and a forward-looking concern for the wider community. Astrologers often describe it as inventive and idealistic, though these meanings are interpretive rather than scientifically established.",
        ],
      },
      {
        heading: "Element and modality",
        paragraphs: [
          "Aquarius is an air sign and a fixed sign, a combination astrologers traditionally read as intellectually independent yet firm in its convictions. Its traditional ruling planet is Saturn.",
        ],
      },
      {
        heading: "Symbol and dates",
        paragraphs: [
          "Aquarius is symbolized by the Water-Bearer, a figure pouring water — an air sign despite the imagery. In the tropical zodiac used in Western astrology, the Sun is traditionally said to pass through Aquarius from around January 20 to February 18.",
        ],
      },
    ],
    relatedEntries: [
      ["astrology", "zodiac-signs", "gemini"],
      ["astrology", "zodiac-signs", "libra"],
    ],
    relatedCategories: [["astrology", "planet-meanings"], ["astrology", "birth-chart"]],
  },
  {
    section: "astrology",
    category: "zodiac-signs",
    slug: "pisces",
    title: "Pisces",
    description:
      "Pisces is the twelfth sign of the zodiac, traditionally associated in astrology with imagination, empathy, and a gentle, dreamy sensitivity.",
    excerpt: "The twelfth zodiac sign — the Fishes.",
    kind: "interpretive",
    difficulty: "beginner",
    tags: ["water sign", "mutable sign", "the Fishes"],
    facts: [
      { label: "Element", value: "Water" },
      { label: "Modality", value: "Mutable" },
      { label: "Ruling planet", value: "Jupiter (traditional)" },
      { label: "Symbol", value: "The Fishes" },
      { label: "Dates", value: "Approximately February 19 – March 20" },
    ],
    keyPoints: [
      "The twelfth and final sign of the zodiac in the Western tradition.",
      "Traditionally linked to imagination, empathy, and intuition.",
      "These associations are cultural and symbolic, not scientific.",
    ],
    body: [
      {
        heading: "In astrological tradition",
        paragraphs: [
          "In astrology, Pisces is traditionally associated with imagination, empathy, and a sensitive, intuitive nature. Astrologers often describe it as compassionate and inclined toward the dreamy or artistic, though these readings are symbolic rather than scientifically established.",
        ],
      },
      {
        heading: "Element and modality",
        paragraphs: [
          "Pisces is a water sign and a mutable sign, a pairing astrologers traditionally interpret as deeply feeling, adaptable, and emotionally receptive. Its traditional ruling planet is Jupiter.",
        ],
      },
      {
        heading: "Symbol and dates",
        paragraphs: [
          "Pisces is symbolized by two Fishes, often shown swimming in opposite directions. In the tropical zodiac used in Western astrology, the Sun is traditionally said to pass through Pisces from around February 19 to March 20, closing the cycle of signs.",
        ],
      },
    ],
    relatedEntries: [
      ["astrology", "zodiac-signs", "cancer"],
      ["astrology", "zodiac-signs", "scorpio"],
    ],
    relatedCategories: [["astrology", "planet-meanings"], ["astrology", "birth-chart"]],
  },
]);
