import type { Section } from "@/lib/content/types";

/**
 * Encyclopedia — reference, history, and context.
 *
 * Mixes science history with the cultural history of astronomy and astrology.
 * History-of-astrology and mythology topics are framed as cultural heritage;
 * physics and history-of-astronomy topics are science/reference. Topics here
 * are deliberately distinct from the Astronomy catalog to avoid duplicate
 * intent (e.g. this hub narrates the history of space exploration, while the
 * Astronomy hub catalogs individual missions and spacecraft).
 */
export const encyclopedia: Section = {
  slug: "encyclopedia",
  name: "Encyclopedia",
  kind: "reference",
  accent: "stone",
  tagline: "Definitions, history, and the human context of the sky.",
  description:
    "A reference library: a glossary of terms, the history of astronomy and astrology, ancient sky cultures, mythology, and the basics of the physics behind it all.",
  intro:
    "The Encyclopedia is Asteria Star's reference layer. It defines the vocabulary, traces how humanity's understanding of the sky developed, and gives cultural and historical context. Scientific history and physics are presented factually; the history of astrology and mythology are presented as cultural heritage.",
  categories: [
    {
      slug: "glossary",
      name: "Glossary",
      summary: "Plain-language definitions of astronomy and astrology terms.",
      overview:
        "The glossary defines the terms used across the site, clearly separating scientific astronomy vocabulary from astrological and mythological terms so the two are never confused.",
      plannedTopics: ["Astronomy terms", "Astrology terms", "Units & measures", "Cross-references"],
      sources: ["iau", "britannica", "nasa"],
      keywords: ["definitions", "astronomy terms", "vocabulary"],
    },
    {
      slug: "history-of-astronomy",
      name: "History of Astronomy",
      summary: "How humans learned to read and measure the sky.",
      overview:
        "The history of astronomy traces the development of humanity's scientific understanding of the heavens, from naked-eye observation to telescopes and space-based instruments.",
      plannedTopics: ["Ancient observation", "The telescopic era", "Modern astrophysics", "The space age"],
      sources: ["britannica", "nasa", "esa"],
      keywords: ["astronomy history", "scientific revolution"],
    },
    {
      slug: "history-of-astrology",
      name: "History of Astrology",
      summary: "The cultural history of a centuries-old tradition.",
      overview:
        "This topic traces astrology's development as a cultural and intellectual tradition across civilizations. It is presented as history of a belief system, not as evidence that astrology works.",
      plannedTopics: ["Mesopotamian roots", "Hellenistic astrology", "Medieval and Renaissance", "Modern revival"],
      sources: ["britannica"],
      keywords: ["astrology history", "horoscopic tradition"],
    },
    {
      slug: "ancient-civilizations",
      name: "Ancient Civilizations",
      summary: "How early cultures observed and used the sky.",
      overview:
        "Many ancient civilizations watched the sky to track seasons, time, and ritual. This topic surveys their astronomical knowledge and monuments as cultural and historical heritage.",
      plannedTopics: ["Mesopotamia", "Maya astronomy", "Chinese records", "Megalithic sites"],
      sources: ["britannica"],
      keywords: ["ancient astronomy", "archaeoastronomy"],
    },
    {
      slug: "greek-mythology",
      name: "Greek Mythology",
      summary: "The Greek myths behind constellation and planet names.",
      overview:
        "Greek mythology supplies many of the stories attached to constellations and the names later traditions used. These are cultural narratives, presented as mythology rather than fact.",
      plannedTopics: ["Constellation myths", "Olympian gods", "Heroes in the sky", "Star lore"],
      sources: ["britannica"],
      keywords: ["greek myths", "constellation stories"],
    },
    {
      slug: "roman-mythology",
      name: "Roman Mythology",
      summary: "The Roman names that the planets still carry.",
      overview:
        "Roman mythology gave us the names of the planets and many enduring symbols. This topic presents those myths as cultural heritage alongside their adaptation from Greek tradition.",
      plannedTopics: ["Roman gods and planets", "Greek-Roman parallels", "Festivals and the calendar", "Symbolism"],
      sources: ["britannica"],
      keywords: ["roman myths", "planet names origin"],
    },
    {
      slug: "egyptian-mythology",
      name: "Egyptian Mythology",
      summary: "Sky deities and star lore of ancient Egypt.",
      overview:
        "Ancient Egyptian culture wove the sky into its mythology and architecture. This topic surveys its sky deities and star lore as cultural and historical heritage.",
      plannedTopics: ["Sky deities", "The Decans", "Star alignments", "Calendar and the Nile"],
      sources: ["britannica"],
      keywords: ["egyptian myths", "sky gods"],
    },
    {
      slug: "babylonian-astronomy",
      name: "Babylonian Astronomy",
      summary: "Early systematic record-keeping of the heavens.",
      overview:
        "Babylonian scholars kept systematic records of celestial events and developed early mathematical methods for predicting them — foundational to later astronomy. This topic treats it as history of science.",
      plannedTopics: ["Astronomical diaries", "Predictive methods", "The zodiac's origins", "Legacy"],
      sources: ["britannica"],
      keywords: ["mesopotamian astronomy", "cuneiform records"],
    },
    {
      slug: "famous-astronomers",
      name: "Famous Astronomers",
      summary: "The people who changed how we see the cosmos.",
      overview:
        "This topic tells the stories of influential astronomers and their discoveries in historical context. The Astronomy hub keeps a structured directory; here the focus is narrative history.",
      plannedTopics: ["Pre-telescopic astronomers", "Telescopic pioneers", "Modern figures", "Their discoveries"],
      sources: ["britannica", "nasa"],
      keywords: ["historic astronomers", "discoveries"],
    },
    {
      slug: "space-exploration",
      name: "Space Exploration",
      summary: "The story of how humanity reached into space.",
      overview:
        "This topic narrates the history of space exploration — its milestones, programs, and turning points. Individual missions and spacecraft are cataloged in the Astronomy hub.",
      plannedTopics: ["The early space age", "Crewed milestones", "Robotic exploration", "International efforts"],
      sources: ["nasa", "esa", "britannica"],
      keywords: ["space history", "space race", "exploration milestones"],
    },
    {
      slug: "physics-basics",
      name: "Physics Basics",
      summary: "The physical ideas that make sense of the universe.",
      overview:
        "This topic explains the core physics behind astronomy — gravity, light, energy, and motion — at an accessible level, so the rest of the site's science is easier to follow.",
      plannedTopics: ["Gravity & orbits", "Light & the spectrum", "Energy & matter", "Spacetime basics"],
      sources: ["nasa", "esa", "britannica"],
      keywords: ["astrophysics basics", "gravity", "light"],
    },
    {
      slug: "timeline",
      name: "Timeline",
      summary: "A chronological thread through astronomy's milestones.",
      overview:
        "The timeline organizes major events in astronomy and space exploration in chronological order, tying the encyclopedia's topics into a single thread.",
      plannedTopics: ["Ancient era", "Telescopic era", "Space age", "Recent milestones"],
      sources: ["nasa", "esa", "britannica"],
      keywords: ["astronomy timeline", "chronology"],
    },
  ],
};
