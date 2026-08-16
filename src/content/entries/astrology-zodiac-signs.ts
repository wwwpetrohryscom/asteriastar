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
      "The sign is a 30-degree slice of the ecliptic; the constellation of the same name is an irregular IAU sky region, and precession has separated the two.",
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
        heading: "Where the figure came from",
        paragraphs: [
          "The figure is Mesopotamian before it is Greek. In Babylonian star lists the region was MUL.LÚ.ḪUN.GÁ, 'the Hired Man' or agrarian labourer, associated with the god Dumuzi. The ram identification came later; by the time Greek astronomy inherited the zodiac the constellation was firmly a ram, and it acquired the story of Chrysomallos, the golden-fleeced ram that carried Phrixus to safety and whose fleece Jason later sought.",
        ],
      },
      {
        heading: "The constellation, and how it differs from the sign",
        paragraphs: [
          "Aries the constellation is inconspicuous. Its brightest star, Hamal, is only about magnitude 2, and the figure is essentially three stars in a short arc — a striking contrast with the prominence the sign carries in astrological tradition. The IAU boundaries drawn in 1930 give it a modest span of ecliptic, so the Sun crosses it in roughly three weeks rather than the sign's exact thirty days.",
          "The distinction matters and is easy to lose. The sign is one of twelve exactly equal 30-degree divisions of the ecliptic, measured from the March equinox in the Western tropical system. The constellation is an IAU sky region with irregular boundaries fixed in 1930, and the twelve zodiacal ones differ enormously in the span of ecliptic they cover. Precession has separated the two by roughly one sign over the past two thousand years.",
        ],
      },
      {
        heading: "The First Point of Aries",
        paragraphs: [
          "Around two thousand years ago the March equinox — the moment the Sun crosses the celestial equator heading north — lay in the constellation Aries. Astronomy named that point the First Point of Aries and made it the zero of the equatorial coordinate system, and the name has stuck.",
          "Precession has since carried the equinox westward out of Aries and into Pisces, where it now sits, and it will move on into Aquarius. So the First Point of Aries is no longer in Aries. This is the same drift that separates the tropical sign from the constellation, visible in a piece of technical vocabulary astronomers still use every day.",
        ],
      },
    ],
    sources: ["britannica", "iau", "simbad"],
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
      "The sign is a 30-degree slice of the ecliptic; the constellation of the same name is an irregular IAU sky region, and precession has separated the two.",
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
        heading: "Where the figure came from",
        paragraphs: [
          "Taurus is among the oldest recognised constellations. Babylonian sources call it GU.AN.NA, the Bull of Heaven — the creature Ishtar sends against Gilgamesh in the epic. Greek tradition attached the story of Zeus taking the form of a white bull to carry Europa across the sea, which is why the figure is usually drawn as only the front half of an animal emerging from water.",
        ],
      },
      {
        heading: "The constellation, and how it differs from the sign",
        paragraphs: [
          "Unlike most zodiac constellations, Taurus is genuinely spectacular. Aldebaran, its brightest star, glows orange at about magnitude 0.9 and appears to sit in the Hyades cluster — though it is a foreground star roughly half the cluster's distance, not a member. The Pleiades lie nearby, and the Crab Nebula, remnant of the supernova recorded in 1054 CE, sits near the tip of one horn.",
          "The distinction matters and is easy to lose. The sign is one of twelve exactly equal 30-degree divisions of the ecliptic, measured from the March equinox in the Western tropical system. The constellation is an IAU sky region with irregular boundaries fixed in 1930, and the twelve zodiacal ones differ enormously in the span of ecliptic they cover. Precession has separated the two by roughly one sign over the past two thousand years.",
        ],
      },
      {
        heading: "Two clusters, and a common error",
        paragraphs: [
          "The Hyades and the Pleiades are both genuine physical star clusters within Taurus, and both are visible without equipment — which is unusual and is why the constellation is so prominent in ancient records across many cultures.",
          "The frequent mistake is treating Aldebaran as the Hyades' brightest member. It is not a member at all: it lies about 65 light-years away against the cluster's roughly 150, and only happens to fall along the same line of sight. Gaia's parallax measurements settle this unambiguously.",
        ],
      },
    ],
    sources: ["britannica", "iau", "simbad"],
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
      "The sign is a 30-degree slice of the ecliptic; the constellation of the same name is an irregular IAU sky region, and precession has separated the two.",
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
        heading: "Where the figure came from",
        paragraphs: [
          "Babylonian sources name this pair MAŠ.TAB.BA.GAL.GAL, the Great Twins, identified with the underworld gods Lugal-irra and Meslamta-ea. Greek tradition recast them as Castor and Polydeuces — Pollux to the Romans — the Dioscuri, of whom one was mortal and one immortal, and who were placed together in the sky so they need never be separated.",
        ],
      },
      {
        heading: "The constellation, and how it differs from the sign",
        paragraphs: [
          "The two bright stars still carry the twins' names, and they contain a detail worth noticing: Pollux is brighter than Castor, at about magnitude 1.1 against 1.6, despite Castor holding the alpha designation. Bayer's lettering was not strictly by brightness, and this is one of the clearest examples. Castor is also not a single star but a six-component system.",
          "The distinction matters and is easy to lose. The sign is one of twelve exactly equal 30-degree divisions of the ecliptic, measured from the March equinox in the Western tropical system. The constellation is an IAU sky region with irregular boundaries fixed in 1930, and the twelve zodiacal ones differ enormously in the span of ecliptic they cover. Precession has separated the two by roughly one sign over the past two thousand years.",
        ],
      },
      {
        heading: "A summer solstice that moved",
        paragraphs: [
          "Two thousand years ago the Sun reached its northernmost point — the June solstice — while in Gemini's neighbouring constellation. Today, precession has carried the solstice point into Gemini's western end.",
          "This is the mirror of what happened to the Tropic of Cancer, which was named when the solstice fell in Cancer. The tropics kept their names while the sky moved underneath them, which is why the astronomical vocabulary and the current sky no longer line up.",
        ],
      },
    ],
    sources: ["britannica", "iau", "simbad"],
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
      "The sign is a 30-degree slice of the ecliptic; the constellation of the same name is an irregular IAU sky region, and precession has separated the two.",
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
        heading: "Where the figure came from",
        paragraphs: [
          "The Babylonian name for this region, AL.LUL, denotes a crayfish or crab, so the creature is consistent from the earliest sources. Greek tradition gave it a small role in a large story: the crab that attacked Heracles during his fight with the Hydra and was crushed underfoot, placed in the sky by Hera as consolation for a brief and unsuccessful intervention.",
        ],
      },
      {
        heading: "The constellation, and how it differs from the sign",
        paragraphs: [
          "Cancer is the faintest of the zodiac constellations — none of its stars reaches magnitude 3.5 — and from a light-polluted site it is effectively invisible. What it does contain is Praesepe, the Beehive Cluster, an open cluster visible to the unaided eye from a dark site as a hazy patch and resolved into dozens of stars by binoculars.",
          "The distinction matters and is easy to lose. The sign is one of twelve exactly equal 30-degree divisions of the ecliptic, measured from the March equinox in the Western tropical system. The constellation is an IAU sky region with irregular boundaries fixed in 1930, and the twelve zodiacal ones differ enormously in the span of ecliptic they cover. Precession has separated the two by roughly one sign over the past two thousand years.",
        ],
      },
      {
        heading: "The Tropic of Cancer",
        paragraphs: [
          "Earth's Tropic of Cancer is named for this constellation because, when the line was named, the Sun stood in Cancer at the June solstice — the moment it reaches its northernmost declination and stands overhead at that latitude.",
          "Precession has since moved the solstice point out of Cancer and into Taurus. The line on the globe has not moved and the name has not changed, so a geographical term now records where the Sun used to be roughly two thousand years ago rather than where it is.",
        ],
      },
    ],
    sources: ["britannica", "iau", "simbad"],
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
      "The sign is a 30-degree slice of the ecliptic; the constellation of the same name is an irregular IAU sky region, and precession has separated the two.",
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
        heading: "Where the figure came from",
        paragraphs: [
          "The lion is one of the most stable identifications in the zodiac. Babylonian sources call the constellation UR.GU.LA, the Lion, and the figure passes into Greek tradition essentially unchanged, where it is identified with the Nemean Lion killed by Heracles in the first of his labours.",
        ],
      },
      {
        heading: "The constellation, and how it differs from the sign",
        paragraphs: [
          "Leo is one of the few zodiac constellations that genuinely resembles its figure. The Sickle — a backwards question mark of stars — outlines the lion's head and mane, with Regulus at its base, and a triangle to the east marks the hindquarters. Regulus lies almost exactly on the ecliptic, so the Moon and planets pass very close to it and occasionally occult it.",
          "The distinction matters and is easy to lose. The sign is one of twelve exactly equal 30-degree divisions of the ecliptic, measured from the March equinox in the Western tropical system. The constellation is an IAU sky region with irregular boundaries fixed in 1930, and the twelve zodiacal ones differ enormously in the span of ecliptic they cover. Precession has separated the two by roughly one sign over the past two thousand years.",
        ],
      },
      {
        heading: "A royal star, and the Leonids",
        paragraphs: [
          "Regulus was one of the four stars Persian astronomy treated as royal, marking the approximate positions of the equinoxes and solstices around three thousand years ago — alongside Aldebaran, Antares and Fomalhaut. Precession has moved all four off those markers since.",
          "The Leonid meteor shower radiates from within the constellation each November. Its parent is comet Tempel–Tuttle, and because the debris is unevenly distributed along the orbit, the Leonids have produced some of the most intense meteor storms on record as well as many unremarkable years.",
        ],
      },
    ],
    sources: ["britannica", "iau", "simbad"],
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
      "The sign is a 30-degree slice of the ecliptic; the constellation of the same name is an irregular IAU sky region, and precession has separated the two.",
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
        heading: "Where the figure came from",
        paragraphs: [
          "Babylonian sources call this region AB.SIN, 'the Furrow', associated with the goddess Shala, who is depicted holding an ear of grain. The agricultural association survived every subsequent reinterpretation: Greek tradition identified the figure variously with Demeter, with Persephone, and with Astraea or Dike, the personification of justice who withdrew from a corrupted world.",
        ],
      },
      {
        heading: "The constellation, and how it differs from the sign",
        paragraphs: [
          "Virgo is the largest constellation of the zodiac and the second largest in the whole sky, so the Sun takes over six weeks to cross it — twice as long as some of its neighbours, and a clear demonstration that the constellations are nothing like the equal thirty-degree signs. It also contains the Virgo Cluster, the nearest large galaxy cluster, whose brightest members include M87.",
          "The distinction matters and is easy to lose. The sign is one of twelve exactly equal 30-degree divisions of the ecliptic, measured from the March equinox in the Western tropical system. The constellation is an IAU sky region with irregular boundaries fixed in 1930, and the twelve zodiacal ones differ enormously in the span of ecliptic they cover. Precession has separated the two by roughly one sign over the past two thousand years.",
        ],
      },
      {
        heading: "Spica, and the furrow that named it",
        paragraphs: [
          "The constellation's brightest star is Spica, and its name is simply Latin for 'ear of grain' — a direct linguistic descendant of the Babylonian furrow and the goddess holding barley. The agricultural image survived four thousand years and three languages inside a single star name.",
          "Spica is astrophysically nothing like a stalk of wheat: it is a close binary of two hot blue stars orbiting in about four days, distorted into ellipsoids by their mutual gravity, and its brightness varies slightly as they rotate.",
        ],
      },
    ],
    sources: ["britannica", "iau", "simbad"],
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
      "The sign is a 30-degree slice of the ecliptic; the constellation of the same name is an irregular IAU sky region, and precession has separated the two.",
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
        heading: "Where the figure came from",
        paragraphs: [
          "Libra is the only zodiac sign representing an inanimate object, and it is also the newest as an independent figure. Babylonian sources know ZI.BA.AN.NA, the balance, but Greek astronomy long treated the same stars as the Chelae — the Claws of the Scorpion. Roman practice established the scales as a separate constellation, and Ptolemy's catalogue records both readings.",
        ],
      },
      {
        heading: "The constellation, and how it differs from the sign",
        paragraphs: [
          "The star names preserve the older identification exactly. Zubenelgenubi and Zubeneschamali are Arabic for 'the southern claw' and 'the northern claw' — a constellation named for scales whose two brightest stars are still called the scorpion's claws. Zubeneschamali is sometimes reported as greenish, one of the few stars for which naked-eye colour claims of that kind persist.",
          "The distinction matters and is easy to lose. The sign is one of twelve exactly equal 30-degree divisions of the ecliptic, measured from the March equinox in the Western tropical system. The constellation is an IAU sky region with irregular boundaries fixed in 1930, and the twelve zodiacal ones differ enormously in the span of ecliptic they cover. Precession has separated the two by roughly one sign over the past two thousand years.",
        ],
      },
      {
        heading: "The equinox that named the scales",
        paragraphs: [
          "The association with balance is usually explained by the autumn equinox: around the time the figure was established, the Sun stood in Libra when day and night were equal, and the scales were read as that equality.",
          "Precession has since carried the September equinox out of Libra and into Virgo. The explanation for the name therefore no longer describes the sky, which makes Libra a compact illustration of why the tropical signs and the constellations have to be kept apart.",
        ],
      },
    ],
    sources: ["britannica", "iau", "simbad"],
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
      "The sign is a 30-degree slice of the ecliptic; the constellation of the same name is an irregular IAU sky region, and precession has separated the two.",
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
        heading: "Where the figure came from",
        paragraphs: [
          "Babylonian sources call the constellation GIR.TAB, the scorpion, and Greek tradition kept the creature while adding a story: the scorpion sent to kill the hunter Orion, after which the two were placed at opposite ends of the sky. The pairing is observationally real — Scorpius rises as Orion sets, so the two are never well placed at the same time.",
        ],
      },
      {
        heading: "The constellation, and how it differs from the sign",
        paragraphs: [
          "The constellation is properly Scorpius; Scorpio is the astrological sign. Antares, its brightest star, is a red supergiant whose name means 'rival of Ares' — Mars — because its colour is similar, and the two are sometimes confusable near the ecliptic. Antares is large enough that if placed at the Sun's position its surface would extend beyond the orbit of Mars.",
          "The distinction matters and is easy to lose. The sign is one of twelve exactly equal 30-degree divisions of the ecliptic, measured from the March equinox in the Western tropical system. The constellation is an IAU sky region with irregular boundaries fixed in 1930, and the twelve zodiacal ones differ enormously in the span of ecliptic they cover. Precession has separated the two by roughly one sign over the past two thousand years.",
        ],
      },
      {
        heading: "The sign the Sun barely enters",
        paragraphs: [
          "Because the IAU boundaries of 1930 cut Scorpius narrowly where the ecliptic crosses it, the Sun spends only about a week inside the constellation — the shortest passage of any zodiac constellation, and less than a quarter of the thirty days the sign occupies.",
          "The neighbouring constellation Ophiuchus takes up much of the gap, which is why it is sometimes described as a thirteenth zodiac constellation. It is a constellation the Sun crosses, but it is not a sign, because the twelvefold sign scheme was fixed long before those boundaries existed.",
        ],
      },
    ],
    sources: ["britannica", "iau", "simbad"],
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
      "The sign is a 30-degree slice of the ecliptic; the constellation of the same name is an irregular IAU sky region, and precession has separated the two.",
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
        heading: "Where the figure came from",
        paragraphs: [
          "The Babylonian figure PA.BIL.SAG is a composite archer, and Greek tradition rendered it as a centaur drawing a bow. It is sometimes identified with Chiron, though Chiron is more usually assigned to the separate constellation Centaurus, and ancient sources are not consistent about which centaur is which.",
        ],
      },
      {
        heading: "The constellation, and how it differs from the sign",
        paragraphs: [
          "The brightest stars form the Teapot, an asterism far easier to recognise than the archer. Sagittarius matters more than any other zodiac constellation for what lies behind it: the centre of the Milky Way, including the supermassive black hole Sagittarius A*, lies in this direction, so the region is dense with star clouds, nebulae and globular clusters.",
          "The distinction matters and is easy to lose. The sign is one of twelve exactly equal 30-degree divisions of the ecliptic, measured from the March equinox in the Western tropical system. The constellation is an IAU sky region with irregular boundaries fixed in 1930, and the twelve zodiacal ones differ enormously in the span of ecliptic they cover. Precession has separated the two by roughly one sign over the past two thousand years.",
        ],
      },
      {
        heading: "Looking toward the Galactic centre",
        paragraphs: [
          "The Milky Way is at its brightest and most structured here, because looking at Sagittarius means looking inward along the Galactic plane toward the centre, through the greatest depth of stars available from Earth.",
          "That same direction is heavily obscured by interstellar dust at visible wavelengths, which is why the Galactic centre was only characterised once infrared and radio astronomy could see through it — and why the Event Horizon Telescope's 2022 image of Sagittarius A* was made at millimetre wavelengths.",
        ],
      },
    ],
    sources: ["britannica", "iau", "simbad"],
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
      "The sign is a 30-degree slice of the ecliptic; the constellation of the same name is an irregular IAU sky region, and precession has separated the two.",
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
        heading: "Where the figure came from",
        paragraphs: [
          "The Babylonian figure SUḪUR.MAŠ, the goat-fish, is one of the oldest and strangest in the zodiac, associated with the god Ea. Greek tradition explained the hybrid with a story about Pan, who plunged into a river to escape the monster Typhon and transformed incompletely — goat above the water, fish below.",
        ],
      },
      {
        heading: "The constellation, and how it differs from the sign",
        paragraphs: [
          "Capricornus is faint and unremarkable to the eye, with no star brighter than about magnitude 2.8. Its one moment of astronomical prominence was in 1846, when Neptune was discovered close to its predicted position within the constellation's borders — the outcome of calculations from irregularities in the orbit of Uranus, and a decisive confirmation of Newtonian gravity.",
          "The distinction matters and is easy to lose. The sign is one of twelve exactly equal 30-degree divisions of the ecliptic, measured from the March equinox in the Western tropical system. The constellation is an IAU sky region with irregular boundaries fixed in 1930, and the twelve zodiacal ones differ enormously in the span of ecliptic they cover. Precession has separated the two by roughly one sign over the past two thousand years.",
        ],
      },
      {
        heading: "The Tropic of Capricorn",
        paragraphs: [
          "The southern tropic carries this name because the Sun stood in Capricornus at the December solstice when the line was named — the moment it reaches its southernmost declination and stands overhead at that latitude.",
          "Precession has since moved the solstice point into Sagittarius. As with the Tropic of Cancer, the terrestrial line and its name are unchanged while the sky has moved, so the term now records a configuration roughly two thousand years out of date.",
        ],
      },
    ],
    sources: ["britannica", "iau", "simbad"],
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
      "The sign is a 30-degree slice of the ecliptic; the constellation of the same name is an irregular IAU sky region, and precession has separated the two.",
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
        heading: "Where the figure came from",
        paragraphs: [
          "Babylonian sources call this region GU.LA, 'the Great One', and depict a figure pouring water from a vessel — associated with Ea, god of fresh water. Greek tradition identified the figure with Ganymede, carried off to serve as cupbearer to the gods. The water association is stable across every version, and the neighbouring constellations Pisces, Cetus and Eridanus form a watery region of sky.",
        ],
      },
      {
        heading: "The constellation, and how it differs from the sign",
        paragraphs: [
          "Aquarius is large but faint, with no star brighter than about magnitude 2.9. It contains the Helix Nebula, one of the nearest planetary nebulae, and the globular cluster M2. The star TRAPPIST-1, host to seven roughly Earth-sized planets, also lies within its boundaries — a modern detail entirely unrelated to anything the figure ever meant.",
          "The distinction matters and is easy to lose. The sign is one of twelve exactly equal 30-degree divisions of the ecliptic, measured from the March equinox in the Western tropical system. The constellation is an IAU sky region with irregular boundaries fixed in 1930, and the twelve zodiacal ones differ enormously in the span of ecliptic they cover. Precession has separated the two by roughly one sign over the past two thousand years.",
        ],
      },
      {
        heading: "The Age of Aquarius",
        paragraphs: [
          "Precession carries the March equinox slowly backwards through the constellations, and the 'astrological age' is defined by which constellation the equinox occupies. It currently lies in Pisces and is approaching Aquarius.",
          "There is no agreed date for the transition, and published estimates span several centuries, because the constellation boundaries used to define it are a twentieth-century astronomical convention that the astrological framework never adopted. The disagreement is about which boundary to use, not about the precession, which is precisely measured.",
        ],
      },
    ],
    sources: ["britannica", "iau", "simbad"],
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
      "The sign is a 30-degree slice of the ecliptic; the constellation of the same name is an irregular IAU sky region, and precession has separated the two.",
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
        heading: "Where the figure came from",
        paragraphs: [
          "Babylonian sources describe two fish joined by a cord in this region. Greek tradition supplied a story: Aphrodite and Eros transformed themselves into fish to escape Typhon and tied themselves together so as not to be separated. The cord is preserved in the star name Alrescha, Arabic for 'the cord', at the point where the two lines of stars meet.",
        ],
      },
      {
        heading: "The constellation, and how it differs from the sign",
        paragraphs: [
          "Pisces is faint — no star brighter than about magnitude 3.6 — and its figure is a large, sprawling V of dim stars that is hard to trace from anywhere but a dark site. Despite that obscurity it is currently the most important zodiac constellation for astronomical bookkeeping, because the March equinox now lies within it.",
          "The distinction matters and is easy to lose. The sign is one of twelve exactly equal 30-degree divisions of the ecliptic, measured from the March equinox in the Western tropical system. The constellation is an IAU sky region with irregular boundaries fixed in 1930, and the twelve zodiacal ones differ enormously in the span of ecliptic they cover. Precession has separated the two by roughly one sign over the past two thousand years.",
        ],
      },
      {
        heading: "Where the equinox is now",
        paragraphs: [
          "The March equinox — the origin of the equatorial coordinate system, still called the First Point of Aries — has been in Pisces for roughly the last two thousand years, having precessed westward out of Aries.",
          "This is the single clearest demonstration that the tropical signs and the constellations have come apart. Someone born in late March is assigned the sign Aries under the tropical convention, while the Sun is physically in Pisces. Both statements are correct within their own systems, and confusing them is the most common misunderstanding about the zodiac.",
        ],
      },
    ],
    sources: ["britannica", "iau", "simbad"],
    relatedEntries: [
      ["astrology", "zodiac-signs", "cancer"],
      ["astrology", "zodiac-signs", "scorpio"],
    ],
    relatedCategories: [["astrology", "planet-meanings"], ["astrology", "birth-chart"]],
  },
]);
