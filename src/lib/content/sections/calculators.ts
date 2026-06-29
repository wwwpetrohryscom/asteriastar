import type { Section } from "@/lib/content/types";

const NUMEROLOGY_DISCLAIMER =
  "Numerology on Asteria Star is presented as a cultural and symbolic tradition. It is not presented as scientifically proven.";

/**
 * Calculators — interactive tools (planned).
 *
 * IMPORTANT: this foundation phase does NOT implement working calculators.
 * Each entry is a landing page that describes the planned tool. Astrology- and
 * numerology-based calculators are marked interpretive and carry a disclaimer;
 * the physics-based ones (age/weight on other worlds, planet positions) are
 * straightforward science and are framed factually.
 */
export const calculators: Section = {
  slug: "calculators",
  name: "Calculators",
  kind: "tools",
  accent: "plasma",
  tagline: "Tools for the sky — astronomical and traditional.",
  description:
    "Planned interactive tools: from physics-based calculators like your age and weight on other worlds to traditional astrology and numerology calculators, each clearly labeled.",
  intro:
    "This hub will host Asteria Star's interactive tools. Physics-based calculators are grounded in published planetary data; astrology and numerology calculators are offered as cultural tradition and are labeled as interpretive. None of these tools is live yet — each page below describes what is planned.",
  categories: [
    {
      slug: "natal-chart-calculator",
      name: "Natal Chart Calculator",
      summary: "Generate a birth chart wheel from a date, time, and place.",
      overview:
        "A planned tool to draw a birth chart from a date, time, and location, showing sign, planet, and house placements for interpretation. Output is an astrological tradition, not a scientific reading.",
      plannedTopics: ["Chart wheel rendering", "Placement table", "House system options", "Save & share (future)"],
      interpretive: true,
      keywords: ["birth chart generator", "free natal chart"],
    },
    {
      slug: "zodiac-sign-calculator",
      name: "Zodiac Sign Calculator",
      summary: "Find the sun sign traditionally linked to a birth date.",
      overview:
        "A planned tool that returns the Western sun sign traditionally associated with a birth date. Sun-sign dates are an astrological convention, not an astronomical measurement.",
      plannedTopics: ["Sun sign by date", "Cusp dates explained", "Sign profile links", "Element & modality"],
      interpretive: true,
      keywords: ["sun sign calculator", "what's my sign"],
    },
    {
      slug: "rising-sign-calculator",
      name: "Rising Sign Calculator",
      summary: "Estimate the Ascendant from birth time and place.",
      overview:
        "A planned tool to estimate the rising sign (Ascendant) from a birth time and location. The Ascendant is an astrological construct used for interpretation.",
      plannedTopics: ["Ascendant calculation", "Why birth time matters", "Result explainer", "Link to rising-sign guide"],
      interpretive: true,
      keywords: ["ascendant calculator", "rising sign finder"],
    },
    {
      slug: "moon-sign-calculator",
      name: "Moon Sign Calculator",
      summary: "Find the sign the Moon occupied at birth, in tradition.",
      overview:
        "A planned tool that returns the Moon sign traditionally associated with a birth date and time. This is an astrological convention used for symbolic interpretation.",
      plannedTopics: ["Moon sign by birth data", "Result explainer", "Moon sign profiles", "Lunar phase note"],
      interpretive: true,
      keywords: ["moon sign finder", "lunar sign calculator"],
    },
    {
      slug: "chinese-zodiac-calculator",
      name: "Chinese Zodiac Calculator",
      summary: "Find the animal sign for a birth year.",
      overview:
        "A planned tool that returns the Chinese zodiac animal and associated element for a birth year, based on the lunar calendar. This is East Asian cultural tradition.",
      plannedTopics: ["Animal by year", "Element pairing", "Lunar new year boundary", "Cultural notes"],
      interpretive: true,
      keywords: ["chinese zodiac finder", "animal sign year"],
    },
    {
      slug: "numerology-calculator",
      name: "Numerology Calculator",
      summary: "Derive numerology numbers from a name or date.",
      overview:
        "A planned tool that derives traditional numerology numbers from a name or date. Numerology is a symbolic tradition presented here as culture, not science.",
      plannedTopics: ["Core numbers", "Name numerology", "Method explainer", "Cultural background"],
      interpretive: true,
      disclaimer: NUMEROLOGY_DISCLAIMER,
      keywords: ["numerology numbers", "name number"],
    },
    {
      slug: "life-path-calculator",
      name: "Life Path Calculator",
      summary: "Compute the numerology life path number from a birth date.",
      overview:
        "A planned tool that computes the life path number from a birth date using standard numerology reduction. It is offered as a symbolic tradition, not a scientific result.",
      plannedTopics: ["Life path method", "Reduction steps", "Number meanings", "Cultural background"],
      interpretive: true,
      disclaimer: NUMEROLOGY_DISCLAIMER,
      keywords: ["life path number", "destiny number"],
    },
    {
      slug: "planet-positions-calculator",
      name: "Planet Positions Calculator",
      summary: "Show where the planets are for a given date and place.",
      overview:
        "A planned astronomy tool to display the positions of the planets in the sky for a chosen date and location, using published ephemeris data. This is an observational, scientific tool.",
      plannedTopics: ["Sky positions", "Rise & set times", "Ephemeris source", "Coordinate display"],
      sources: ["jpl", "usno", "nasa"],
      keywords: ["planet positions", "ephemeris", "where are the planets"],
    },
    {
      slug: "compatibility-calculator",
      name: "Compatibility Calculator",
      summary: "Compare two signs in the astrological tradition.",
      overview:
        "A planned tool that compares two zodiac signs and summarizes traditional compatibility themes. It is a cultural, interpretive tool and not a measure of real relationships.",
      plannedTopics: ["Sign-pair lookup", "Element view", "Tradition notes", "Limitations panel"],
      interpretive: true,
      keywords: ["zodiac compatibility calculator", "love match"],
    },
    {
      slug: "synastry-calculator",
      name: "Synastry Calculator",
      summary: "Compare two birth charts side by side.",
      overview:
        "A planned tool to compare two birth charts and highlight the inter-chart relationships astrologers traditionally read. It is an interpretive, symbolic tool.",
      plannedTopics: ["Dual chart input", "Inter-aspect grid", "Reading guide", "Save & share (future)"],
      interpretive: true,
      keywords: ["synastry chart calculator", "relationship chart"],
    },
    {
      slug: "solar-return-calculator",
      name: "Solar Return Calculator",
      summary: "Cast a chart for your next solar return.",
      overview:
        "A planned tool to cast a solar return chart — the moment the Sun returns to its birth position each year. It is an astrological tradition used for symbolic interpretation.",
      plannedTopics: ["Return moment", "Return location option", "Chart output", "Year-ahead notes"],
      interpretive: true,
      keywords: ["solar return chart", "birthday chart calculator"],
    },
    {
      slug: "age-on-mercury",
      name: "Age on Mercury",
      summary: "Your age counted in Mercury's short years.",
      overview:
        "Because Mercury orbits the Sun far faster than Earth, far more Mercury-years pass in a lifetime. This planned tool converts your age into the number of Mercury orbits since your birth.",
      plannedTopics: ["How the conversion works", "Mercury's orbital year", "Your age on Mercury", "Compare planets"],
      sources: ["nasa", "jpl"],
      keywords: ["age on mercury", "mercury years"],
    },
    {
      slug: "age-on-venus",
      name: "Age on Venus",
      summary: "Your age counted in Venusian years.",
      overview:
        "Venus completes an orbit of the Sun more quickly than Earth, so your age in Venus-years differs from your Earth age. This planned tool makes the conversion.",
      plannedTopics: ["How the conversion works", "Venus's orbital year", "Your age on Venus", "Compare planets"],
      sources: ["nasa", "jpl"],
      keywords: ["age on venus", "venus years"],
    },
    {
      slug: "age-on-mars",
      name: "Age on Mars",
      summary: "Your age counted in Martian years.",
      overview:
        "Mars takes longer than Earth to orbit the Sun, so fewer Mars-years have passed in your lifetime. This planned tool converts your Earth age into Mars-years.",
      plannedTopics: ["How the conversion works", "The Martian year", "Your age on Mars", "Compare planets"],
      sources: ["nasa", "jpl"],
      keywords: ["age on mars", "mars years", "martian age"],
    },
    {
      slug: "age-on-jupiter",
      name: "Age on Jupiter",
      summary: "Your age counted in Jupiter's long years.",
      overview:
        "Jupiter's orbit around the Sun is far longer than Earth's, so a lifetime spans only a fraction of a Jupiter-year. This planned tool makes the conversion.",
      plannedTopics: ["How the conversion works", "Jupiter's orbital year", "Your age on Jupiter", "Compare planets"],
      sources: ["nasa", "jpl"],
      keywords: ["age on jupiter", "jupiter years"],
    },
    {
      slug: "weight-on-moon",
      name: "Weight on Moon",
      summary: "How much you'd weigh under the Moon's gravity.",
      overview:
        "Surface gravity on the Moon is weaker than on Earth, so you would weigh less there while your mass stays the same. This planned tool scales your weight by the Moon's surface gravity.",
      plannedTopics: ["Weight vs. mass", "The Moon's gravity", "Your weight on the Moon", "Compare worlds"],
      sources: ["nasa"],
      keywords: ["weight on the moon", "lunar gravity"],
    },
    {
      slug: "weight-on-mars",
      name: "Weight on Mars",
      summary: "How much you'd weigh under Martian gravity.",
      overview:
        "Mars has weaker surface gravity than Earth, so you would weigh less on Mars while your mass is unchanged. This planned tool scales your weight by Martian surface gravity.",
      plannedTopics: ["Weight vs. mass", "Mars's gravity", "Your weight on Mars", "Compare worlds"],
      sources: ["nasa", "jpl"],
      keywords: ["weight on mars", "martian gravity"],
    },
  ],
};
