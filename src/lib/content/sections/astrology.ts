import type { Section } from "@/lib/content/types";

/**
 * Astrology — the cultural, symbolic, interpretive hub.
 *
 * Every overview here is framed as tradition and interpretation, never as
 * scientific fact. The section is `kind: "interpretive"`, which forces the
 * astrology disclaimer on every page. We describe what practitioners
 * traditionally hold, not what is scientifically established.
 */
export const astrology: Section = {
  slug: "astrology",
  name: "Astrology",
  kind: "interpretive",
  accent: "ember",
  tagline: "A cultural and symbolic tradition — clearly labeled as such.",
  description:
    "Learn the symbolism, history, and traditional meanings of astrology — zodiac signs, charts, planets, and houses — presented as culture and interpretation, not science.",
  intro:
    "Astrology is one of humanity's oldest symbolic traditions: a system for relating the positions of celestial bodies to character, timing, and meaning. On Asteria Star it is presented as cultural and interpretive heritage. These pages describe what astrological traditions hold; they do not claim astrology predicts or explains events scientifically.",
  categories: [
    {
      slug: "zodiac-signs",
      name: "Zodiac Signs",
      summary: "The twelve signs and the qualities tradition assigns them.",
      overview:
        "In Western astrology the zodiac is divided into twelve signs, each traditionally associated with particular themes, elements, and symbolism. These associations are cultural and interpretive rather than scientifically established.",
      plannedTopics: ["The twelve signs", "Elements and modalities", "Sign symbolism", "Sun-sign traditions"],
      keywords: ["star signs", "sun sign", "zodiac"],
    },
    {
      slug: "birth-chart",
      name: "Birth Chart",
      summary: "An introduction to the chart of the sky at a moment of birth.",
      overview:
        "A birth chart is astrology's map of where the Sun, Moon, and planets appeared from a given place and time. This introductory topic explains what the chart wheel represents; in-depth interpretation lives under Natal Chart.",
      plannedTopics: ["What a birth chart shows", "The chart wheel", "Reading the basics", "Common misconceptions"],
      interpretive: true,
      keywords: ["birth chart wheel", "astrology chart"],
    },
    {
      slug: "natal-chart",
      name: "Natal Chart",
      summary: "Interpreting signs, planets, and houses together in depth.",
      overview:
        "The natal chart and birth chart describe the same diagram; this topic focuses on the interpretive craft — how astrologers traditionally read placements together to describe themes. It is symbolic interpretation, not prediction.",
      plannedTopics: ["Synthesizing placements", "Chart rulers", "Patterns and shapes", "Worked examples"],
      interpretive: true,
      keywords: ["natal astrology", "chart interpretation"],
    },
    {
      slug: "rising-sign",
      name: "Rising Sign",
      summary: "The Ascendant — the sign on the eastern horizon at birth.",
      overview:
        "The rising sign, or Ascendant, is the zodiac sign that tradition places on the eastern horizon at the moment of birth. Astrologers associate it with first impressions and outward style.",
      plannedTopics: ["What the Ascendant is", "Rising vs. Sun sign", "The Descendant", "Traditional meanings"],
      interpretive: true,
      keywords: ["ascendant", "rising"],
    },
    {
      slug: "moon-sign",
      name: "Moon Sign",
      summary: "The sign the Moon occupied at birth, in tradition.",
      overview:
        "The Moon sign is the zodiac sign the Moon is said to have occupied at birth. In astrological tradition it is linked to emotion and inner life. This is symbolic association, not a scientific claim.",
      plannedTopics: ["Finding your Moon sign", "Traditional meanings", "Moon vs. Sun sign", "Lunar phases in tradition"],
      interpretive: true,
      keywords: ["lunar sign", "emotional astrology"],
    },
    {
      slug: "planet-meanings",
      name: "Planet Meanings",
      summary: "The symbolic roles tradition gives the planets and luminaries.",
      overview:
        "Astrology assigns symbolic meanings to the Sun, Moon, and planets — for example associating each with particular themes. These meanings are traditional and cultural, distinct from the planets' physical astronomy.",
      plannedTopics: ["The personal planets", "Social and outer planets", "Luminaries", "Symbol glossary"],
      interpretive: true,
      keywords: ["planetary symbolism", "rulerships"],
    },
    {
      slug: "houses",
      name: "Houses",
      summary: "The twelve houses and the life areas tradition links to them.",
      overview:
        "In astrology the chart is divided into twelve houses, each traditionally associated with an area of life. Different house systems divide the chart in different ways. These associations are interpretive conventions.",
      plannedTopics: ["The twelve houses", "House systems", "Angular, succedent, cadent", "House meanings"],
      interpretive: true,
      keywords: ["astrological houses", "house systems"],
    },
    {
      slug: "aspects",
      name: "Aspects",
      summary: "Angular relationships between chart points and their meanings.",
      overview:
        "Aspects are the angular relationships between points in a chart, such as conjunctions and oppositions. Astrologers interpret them as describing how symbolic energies interact. The geometry is real; the meanings are traditional.",
      plannedTopics: ["Major aspects", "Minor aspects", "Orbs", "Aspect patterns"],
      interpretive: true,
      keywords: ["conjunction", "trine", "square"],
    },
    {
      slug: "transits",
      name: "Transits",
      summary: "How current planetary positions are read against a birth chart.",
      overview:
        "Transits compare the current positions of the planets with those in a birth chart. In astrological practice they are used to describe timing and themes. This is interpretive tradition, not forecasting in a scientific sense.",
      plannedTopics: ["What transits are", "Slow vs. fast transits", "Reading timing", "Common transits"],
      interpretive: true,
      keywords: ["planetary transits", "timing"],
    },
    {
      slug: "progressions",
      name: "Progressions",
      summary: "A symbolic technique for advancing a chart over time.",
      overview:
        "Progressions are a symbolic technique in which the birth chart is advanced according to traditional rules to reflect personal development. They are an interpretive method within astrology.",
      plannedTopics: ["Secondary progressions", "Progressed Moon", "Solar arc", "How astrologers use them"],
      interpretive: true,
      keywords: ["secondary progressions", "solar arc"],
    },
    {
      slug: "solar-return",
      name: "Solar Return",
      summary: "A chart cast for the Sun's yearly return to its birth position.",
      overview:
        "A solar return chart is cast for the moment each year when the Sun returns to its position at birth. Astrologers traditionally read it as a theme for the year ahead. It is a symbolic practice.",
      plannedTopics: ["What a solar return is", "Return locations", "Reading the year", "Solar vs. lunar returns"],
      interpretive: true,
      keywords: ["return chart", "birthday chart"],
    },
    {
      slug: "compatibility",
      name: "Compatibility",
      summary: "How traditions compare signs and charts between people.",
      overview:
        "Astrological compatibility describes traditions for comparing two people's signs or charts. It is a cultural, interpretive practice and is not a scientific measure of relationships.",
      plannedTopics: ["Sign compatibility", "Element pairings", "Beyond sun signs", "Limitations"],
      interpretive: true,
      keywords: ["zodiac compatibility", "love astrology"],
    },
    {
      slug: "synastry",
      name: "Synastry",
      summary: "Comparing two birth charts side by side.",
      overview:
        "Synastry is the astrological technique of comparing two birth charts to describe the dynamics tradition associates with a relationship. It is interpretive and symbolic.",
      plannedTopics: ["What synastry is", "Inter-chart aspects", "Composite charts", "Reading a pairing"],
      interpretive: true,
      keywords: ["relationship astrology", "chart comparison"],
    },
    {
      slug: "chinese-zodiac",
      name: "Chinese Zodiac",
      summary: "The twelve-year animal cycle of East Asian tradition.",
      overview:
        "The Chinese zodiac is a twelve-year cycle in which each year is associated with an animal sign in East Asian cultural tradition. It is a rich folklore and calendrical tradition, distinct from Western astrology and from astronomy.",
      plannedTopics: ["The twelve animals", "The five elements", "Year of birth", "Cultural background"],
      interpretive: true,
      keywords: ["sheng xiao", "animal signs", "lunar new year"],
    },
    {
      slug: "western-astrology",
      name: "Western Astrology",
      summary: "The tropical-zodiac tradition rooted in the Mediterranean world.",
      overview:
        "Western astrology is the tradition that developed around the Mediterranean and uses the tropical zodiac. This topic covers its concepts and history as cultural heritage, not as science.",
      plannedTopics: ["Origins and history", "The tropical zodiac", "Core techniques", "Modern practice"],
      interpretive: true,
      keywords: ["tropical zodiac", "horoscopic astrology"],
    },
    {
      slug: "vedic-astrology",
      name: "Vedic Astrology",
      summary: "Jyotisha — the astrological tradition of the Indian subcontinent.",
      overview:
        "Vedic astrology, or Jyotisha, is the astrological tradition of the Indian subcontinent and generally uses the sidereal zodiac. This topic presents its concepts and history as cultural tradition.",
      plannedTopics: ["Sidereal zodiac", "Nakshatras", "Dashas", "Comparison with Western astrology"],
      interpretive: true,
      keywords: ["jyotisha", "sidereal", "nakshatra"],
    },
  ],
};
