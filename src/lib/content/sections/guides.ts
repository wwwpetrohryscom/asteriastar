import type { Section } from "@/lib/content/types";

/**
 * Guides — structured learning paths.
 *
 * Mostly science explainers and how-tos. The one astrology guide ("How to Read
 * a Birth Chart") is marked interpretive and carries the disclaimer, keeping
 * the science / tradition boundary intact even within a learning context.
 */
export const guides: Section = {
  slug: "guides",
  name: "Guides",
  kind: "learning",
  accent: "comet",
  tagline: "Learn the sky, step by step.",
  description:
    "Approachable, structured guides — from your first night under the stars and how telescopes work to advanced astronomy and reading a birth chart.",
  intro:
    "Guides are Asteria Star's learning paths: clear, structured explainers that take you from curiosity to understanding. Astronomy guides explain how things actually work; the astrology guide teaches a cultural tradition and is labeled as interpretive.",
  categories: [
    {
      slug: "beginner-astronomy",
      name: "Beginner Astronomy",
      summary: "Start here: the essentials of looking up.",
      overview:
        "A starting point for newcomers, introducing the night sky, the main types of objects, and how to begin observing without any equipment.",
      plannedTopics: ["First steps", "Naked-eye observing", "Key objects to find", "Where to go next"],
      sources: ["nasa", "esa"],
      keywords: ["astronomy for beginners", "getting started stargazing"],
    },
    {
      slug: "how-stars-form",
      name: "How Stars Form",
      summary: "From cold gas clouds to shining stars.",
      overview:
        "An explainer on star formation: how regions of cold gas and dust collapse under gravity until their cores become hot and dense enough to begin nuclear fusion.",
      plannedTopics: ["Molecular clouds", "Gravitational collapse", "Protostars", "Ignition of fusion"],
      sources: ["nasa", "esa"],
      keywords: ["star formation", "stellar birth", "protostar"],
    },
    {
      slug: "how-black-holes-work",
      name: "How Black Holes Work",
      summary: "Gravity, event horizons, and what falls in.",
      overview:
        "An explainer on black holes: what an event horizon is, how black holes form and grow, and why not even light can escape from within them.",
      plannedTopics: ["What a black hole is", "Event horizons", "Formation & growth", "Observing the unseen"],
      sources: ["nasa", "esa"],
      keywords: ["black holes explained", "event horizon", "how black holes form"],
    },
    {
      slug: "how-telescopes-work",
      name: "How Telescopes Work",
      summary: "Collecting and focusing light to see farther.",
      overview:
        "An explainer on telescopes: how lenses and mirrors gather and focus light, the main telescope designs, and how to choose one for observing.",
      plannedTopics: ["Refractors & reflectors", "Aperture & magnification", "Choosing a telescope", "Caring for optics"],
      sources: ["nasa", "esa", "britannica"],
      keywords: ["how telescopes work", "refractor vs reflector", "telescope basics"],
    },
    {
      slug: "how-to-observe-the-night-sky",
      name: "How to Observe the Night Sky",
      summary: "Practical skills for better stargazing.",
      overview:
        "A practical guide to observing: finding dark skies, letting your eyes adapt, using charts and binoculars, and planning around the Moon and weather.",
      plannedTopics: ["Dark-sky basics", "Dark adaptation", "Binoculars first", "Planning a session"],
      sources: ["nasa"],
      keywords: ["stargazing guide", "night sky observing", "dark sky tips"],
    },
    {
      slug: "how-to-read-a-birth-chart",
      name: "How to Read a Birth Chart",
      summary: "A beginner's path through astrology's chart wheel.",
      overview:
        "A beginner-friendly guide to the astrological birth chart — its wheel, signs, planets, and houses — taught as a cultural and symbolic tradition rather than as science.",
      plannedTopics: ["Reading the wheel", "Signs, planets, houses", "Putting it together", "Where to learn more"],
      interpretive: true,
      keywords: ["read birth chart", "astrology for beginners", "chart basics"],
    },
    {
      slug: "astronomy-for-kids",
      name: "Astronomy for Kids",
      summary: "Wonder-filled, accurate astronomy for young learners.",
      overview:
        "Age-appropriate explainers that introduce children to the planets, stars, and space in a way that is fun, accurate, and never talks down to them.",
      plannedTopics: ["The Solar System", "Stars & galaxies", "Fun sky activities", "For parents & teachers"],
      sources: ["nasa", "esa"],
      keywords: ["astronomy for kids", "space for children", "kids space facts"],
    },
    {
      slug: "advanced-astronomy",
      name: "Advanced Astronomy",
      summary: "Deeper concepts for experienced observers and learners.",
      overview:
        "For those ready to go further: deeper treatments of astrophysical concepts, observation techniques, and the methods astronomers use to study the universe.",
      plannedTopics: ["Astrophysics concepts", "Advanced observing", "Astrophotography basics", "Data & methods"],
      sources: ["nasa", "esa", "iau"],
      keywords: ["advanced astronomy", "astrophysics", "astrophotography"],
    },
  ],
};
