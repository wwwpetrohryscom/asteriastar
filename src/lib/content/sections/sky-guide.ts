import type { Section } from "@/lib/content/types";

/**
 * Sky Guide — practical, observational astronomy.
 *
 * Science-based and evidence-led. Many of these topics will become
 * location/date-aware tools later; for now they are accurate informational
 * pages with future interactive features noted as planned.
 */
export const skyGuide: Section = {
  slug: "sky-guide",
  name: "Sky Guide",
  kind: "science",
  accent: "aurora",
  tagline: "What to see in the sky, and when.",
  description:
    "Know what's happening overhead: moon phases, meteor showers, eclipses, planet visibility, and the events worth looking up for.",
  intro:
    "The Sky Guide helps you observe the real sky. It collects the recurring events and tools that tell you what is visible from where you are — from tonight's planets to the next eclipse. Timing and visibility data will be drawn from authoritative almanac sources.",
  categories: [
    {
      slug: "night-sky-tonight",
      name: "Night Sky Tonight",
      summary: "A guide to what's visible after dark right now.",
      overview:
        "This guide orients you to what is currently observable: the Moon, bright planets, and prominent stars and constellations. A location- and date-aware version is planned.",
      plannedTopics: ["Tonight's highlights", "Locating bright planets", "Seasonal constellations", "Stargazing tips"],
      sources: ["usno", "nasa"],
      keywords: ["stargazing tonight", "what's up", "sky tonight"],
    },
    {
      slug: "moon-phase",
      name: "Moon Phase",
      summary: "The Moon's cycle from new to full and back.",
      overview:
        "The Moon goes through a repeating cycle of phases — new, waxing, full, and waning — as the geometry of the Sun, Earth, and Moon changes. Phase data will be sourced from almanac references.",
      plannedTopics: ["The phase cycle", "Today's phase", "Supermoons and names", "Phase and tides"],
      sources: ["usno", "nasa"],
      keywords: ["lunar phase", "full moon", "new moon"],
    },
    {
      slug: "meteor-showers",
      name: "Meteor Showers",
      summary: "When Earth passes through cometary debris streams.",
      overview:
        "A meteor shower occurs when Earth passes through the debris left by a comet or asteroid, and many meteors appear to radiate from one point in the sky. Activity forecasts will draw on meteor-organization data.",
      plannedTopics: ["Annual showers", "Radiants and rates", "Best viewing conditions", "Peak calendar"],
      sources: ["imo", "nasa"],
      keywords: ["Perseids", "Geminids", "shooting stars"],
    },
    {
      slug: "solar-eclipses",
      name: "Solar Eclipses",
      summary: "When the Moon passes between Earth and the Sun.",
      overview:
        "A solar eclipse happens when the Moon passes between the Sun and Earth, casting its shadow on Earth's surface. Eclipses can be total, partial, or annular. Always observe the Sun with proper protection.",
      plannedTopics: ["Types of solar eclipse", "Eclipse paths", "Safe observing", "Upcoming eclipses"],
      sources: ["nasa", "usno"],
      keywords: ["total eclipse", "annular eclipse", "eclipse safety"],
    },
    {
      slug: "lunar-eclipses",
      name: "Lunar Eclipses",
      summary: "When the Moon passes through Earth's shadow.",
      overview:
        "A lunar eclipse occurs when Earth lies between the Sun and the Moon, and the Moon passes through Earth's shadow. Unlike solar eclipses, they are safe to watch with the unaided eye.",
      plannedTopics: ["Total, partial, penumbral", "Why the Moon reddens", "Visibility by region", "Upcoming eclipses"],
      sources: ["nasa", "usno"],
      keywords: ["blood moon", "umbra", "penumbra"],
    },
    {
      slug: "planet-visibility",
      name: "Planet Visibility",
      summary: "Which planets are visible, and where to look.",
      overview:
        "The naked-eye planets shift position against the stars over weeks and months, so their visibility changes throughout the year. A location-aware visibility tool is planned.",
      plannedTopics: ["Naked-eye planets", "Morning vs. evening sky", "Conjunctions", "Oppositions"],
      sources: ["usno", "jpl", "nasa"],
      keywords: ["visible planets", "Venus", "Jupiter visibility"],
    },
    {
      slug: "iss-tracker",
      name: "ISS Tracker",
      summary: "Spotting the International Space Station overhead.",
      overview:
        "The International Space Station orbits Earth and can be seen from the ground as a bright, fast-moving point of light during favorable passes. A pass-prediction tool is planned.",
      plannedTopics: ["When the ISS is visible", "Reading a pass prediction", "Other satellites", "Observing tips"],
      sources: ["nasa"],
      keywords: ["space station", "satellite spotting", "ISS pass"],
    },
    {
      slug: "comet-visibility",
      name: "Comet Visibility",
      summary: "Tracking comets bright enough to observe.",
      overview:
        "Most comets are faint, but occasionally one becomes bright enough to see with binoculars or the unaided eye. This guide will track currently observable comets using small-body data.",
      plannedTopics: ["Current bright comets", "Finder charts", "Predicting brightness", "Observing comets"],
      sources: ["mpc", "jpl", "nasa"],
      keywords: ["bright comet", "comet tonight", "naked-eye comet"],
    },
    {
      slug: "sky-calendar",
      name: "Sky Calendar",
      summary: "A running calendar of notable sky events.",
      overview:
        "The sky calendar collects upcoming astronomical events — phases, eclipses, shower peaks, conjunctions, and oppositions — in one timeline. Dates will be sourced from authoritative almanacs.",
      plannedTopics: ["Monthly highlights", "Annual events", "Conjunctions", "Add-to-calendar"],
      sources: ["usno", "nasa", "imo"],
      keywords: ["astronomy calendar", "sky events calendar"],
    },
    {
      slug: "celestial-events",
      name: "Celestial Events",
      summary: "Explainers for the events that make people look up.",
      overview:
        "This topic explains the recurring and rare events worth watching — conjunctions, oppositions, occultations, and more — so you understand what you are seeing, not just when.",
      plannedTopics: ["Conjunctions and oppositions", "Occultations", "Equinoxes and solstices", "Rare events"],
      sources: ["nasa", "usno"],
      keywords: ["conjunction", "opposition", "solstice"],
    },
  ],
};
