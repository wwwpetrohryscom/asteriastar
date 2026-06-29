import type { AccentToken } from "@/lib/content/types";

/**
 * Learning paths — structured educational journeys through existing content and
 * the knowledge graph. Infrastructure only (no user accounts). Every step links
 * to a real route (entry, guide, topic, or connection page).
 */

export interface LearnStep {
  title: string;
  href: string;
  blurb: string;
}
export type LearnLevel = "Beginner" | "Intermediate" | "Advanced";
export interface LearnStage {
  level: LearnLevel;
  steps: LearnStep[];
}
export interface LearningPath {
  slug: string;
  title: string;
  description: string;
  accent: AccentToken;
  stages: LearnStage[];
  /** Graph entity ids to feature as "related". */
  relatedEntityIds?: string[];
  /** Slugs of recommended next paths. */
  next?: string[];
}

export const LEARNING_PATHS: LearningPath[] = [
  {
    slug: "learn-astronomy",
    title: "Learn Astronomy",
    description: "A guided journey from looking up to understanding the universe.",
    accent: "nebula",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "Beginner Astronomy", href: "/guides/beginner-astronomy", blurb: "Start here — the essentials of looking up." },
          { title: "What is a star?", href: "/encyclopedia/glossary/star", blurb: "The most fundamental object in the sky." },
          { title: "Explore the Solar System", href: "/connections/the-solar-system", blurb: "The Sun, planets, and dwarf planets." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "How stars form", href: "/guides/how-stars-form", blurb: "From cold gas clouds to shining stars." },
          { title: "Explore galaxies", href: "/explore/galaxies", blurb: "Island universes of stars and gas." },
          { title: "Light-years & distance", href: "/encyclopedia/glossary/light-year", blurb: "How we measure the cosmos." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "How black holes work", href: "/guides/how-black-holes-work", blurb: "Gravity, event horizons, and what falls in." },
          { title: "Explore deep sky", href: "/explore/deep-sky", blurb: "Galaxies, nebulae, clusters, and black holes." },
          { title: "Advanced astronomy", href: "/guides/advanced-astronomy", blurb: "Deeper concepts and methods." },
        ],
      },
    ],
    relatedEntityIds: ["star:sun", "galaxy:milky-way", "planet:earth"],
    next: ["learn-stars", "learn-galaxies", "learn-telescopes"],
  },
  {
    slug: "learn-stars",
    title: "Learn Stars",
    description: "From the Sun to supergiants — how stars live, shine, and die.",
    accent: "nebula",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "What is a star?", href: "/encyclopedia/glossary/star", blurb: "A self-gravitating sphere of plasma." },
          { title: "Sirius", href: "/astronomy/stars/sirius", blurb: "The brightest star in the night sky." },
          { title: "Explore stars", href: "/explore/stars", blurb: "Browse named stars in the graph." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "How stars form", href: "/guides/how-stars-form", blurb: "Gravitational collapse to fusion." },
          { title: "Betelgeuse", href: "/astronomy/stars/betelgeuse", blurb: "A red supergiant nearing its end." },
          { title: "Stars in Orion", href: "/connections/stars-in-orion", blurb: "The stars of a famous constellation." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "Supernovae", href: "/astronomy/supernovae", blurb: "The explosive deaths of stars." },
          { title: "Exoplanets", href: "/explore/exoplanets", blurb: "Worlds orbiting other stars." },
          { title: "Black holes", href: "/explore/black-holes", blurb: "What some massive stars leave behind." },
        ],
      },
    ],
    relatedEntityIds: ["star:sirius", "star:betelgeuse", "star:proxima-centauri"],
    next: ["learn-galaxies", "learn-black-holes"],
  },
  {
    slug: "learn-space-exploration",
    title: "Learn Space Exploration",
    description: "Humanity's journey beyond Earth — missions, vehicles, and agencies.",
    accent: "halo",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "Apollo 11", href: "/astronomy/space-missions/apollo-11", blurb: "The first crewed Moon landing." },
          { title: "Explore missions", href: "/explore/missions", blurb: "Landmark missions of exploration." },
          { title: "Space agencies", href: "/explore/space-agencies", blurb: "Who explores space." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "Voyager 1", href: "/astronomy/space-missions/voyager-1", blurb: "Now in interstellar space." },
          { title: "Launch vehicles", href: "/explore/launch-vehicles", blurb: "The rockets that get us there." },
          { title: "Missions to Mars", href: "/connections/missions-to-mars", blurb: "Spacecraft sent to the Red Planet." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "Cassini–Huygens", href: "/astronomy/space-missions/cassini-huygens", blurb: "Years at Saturn." },
          { title: "Space exploration history", href: "/encyclopedia/space-exploration", blurb: "The story of reaching into space." },
          { title: "Parker Solar Probe", href: "/astronomy/space-missions/parker-solar-probe", blurb: "Flying through the Sun's corona." },
        ],
      },
    ],
    relatedEntityIds: ["space_mission:apollo-11", "space_mission:voyager-1", "satellite:international-space-station"],
    next: ["learn-telescopes", "learn-astronomy"],
  },
  {
    slug: "learn-galaxies",
    title: "Learn Galaxies",
    description: "From the Milky Way to the deep field — the great systems of stars.",
    accent: "nebula",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "What is a galaxy?", href: "/encyclopedia/glossary/galaxy", blurb: "A gravitationally bound system of stars." },
          { title: "Explore galaxies", href: "/explore/galaxies", blurb: "Browse galaxies in the graph." },
          { title: "Galaxy vs nebula", href: "/compare/galaxy-vs-nebula", blurb: "Two different deep-sky objects." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "Deep-sky objects", href: "/connections/deep-sky-objects", blurb: "Galaxies, nebulae, and clusters." },
          { title: "Messier objects", href: "/connections/messier-objects", blurb: "The classic deep-sky catalogue." },
          { title: "Observed by James Webb", href: "/connections/galaxies-observed-by-james-webb", blurb: "What Webb studies." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "Black holes", href: "/explore/black-holes", blurb: "The engines at galactic centers." },
          { title: "Explore deep sky", href: "/explore/deep-sky", blurb: "The objects beyond the Solar System." },
          { title: "Quasars", href: "/astronomy/quasars", blurb: "Brilliant active galactic nuclei." },
        ],
      },
    ],
    relatedEntityIds: ["galaxy:milky-way", "galaxy:andromeda-galaxy", "black_hole:sagittarius-a-star"],
    next: ["learn-black-holes", "learn-telescopes"],
  },
  {
    slug: "learn-black-holes",
    title: "Learn Black Holes",
    description: "Gravity at its most extreme — event horizons and the unseen.",
    accent: "nebula",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "What is a black hole?", href: "/encyclopedia/glossary/black-hole", blurb: "Where light cannot escape." },
          { title: "How black holes work", href: "/guides/how-black-holes-work", blurb: "Event horizons and growth." },
          { title: "Explore black holes", href: "/explore/black-holes", blurb: "Black holes in the graph." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "Supernovae", href: "/astronomy/supernovae", blurb: "How massive stars end." },
          { title: "Chandra X-ray Observatory", href: "/astronomy/space-telescopes/chandra-x-ray-observatory", blurb: "Seeing the high-energy universe." },
          { title: "Deep-sky objects", href: "/connections/deep-sky-objects", blurb: "Where black holes live." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "Pulsars", href: "/astronomy/pulsars", blurb: "Other dense stellar remnants." },
          { title: "Quasars", href: "/astronomy/quasars", blurb: "Supermassive black holes at work." },
          { title: "Galaxies", href: "/explore/galaxies", blurb: "Black holes anchor galactic centers." },
        ],
      },
    ],
    relatedEntityIds: ["black_hole:sagittarius-a-star", "black_hole:m87-star"],
    next: ["learn-galaxies", "learn-stars"],
  },
  {
    slug: "learn-telescopes",
    title: "Learn Telescopes",
    description: "How we see farther — from backyard optics to orbiting observatories.",
    accent: "halo",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "How telescopes work", href: "/guides/how-telescopes-work", blurb: "Collecting and focusing light." },
          { title: "Explore telescopes", href: "/explore/telescopes", blurb: "Space telescopes in the graph." },
          { title: "Hubble", href: "/astronomy/space-telescopes/hubble-space-telescope", blurb: "The iconic optical observatory." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "James Webb", href: "/astronomy/space-telescopes/james-webb-space-telescope", blurb: "The great infrared observatory." },
          { title: "JWST vs Hubble", href: "/compare/jwst-vs-hubble", blurb: "Two observatories compared." },
          { title: "Observatories", href: "/explore/observatories", blurb: "Ground-based facilities." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "Chandra X-ray Observatory", href: "/astronomy/space-telescopes/chandra-x-ray-observatory", blurb: "The X-ray universe." },
          { title: "Observed by James Webb", href: "/connections/galaxies-observed-by-james-webb", blurb: "What Webb has studied." },
          { title: "TESS", href: "/astronomy/space-telescopes/tess", blurb: "An all-sky exoplanet hunter." },
        ],
      },
    ],
    relatedEntityIds: ["space_telescope:hubble-space-telescope", "space_telescope:james-webb-space-telescope"],
    next: ["learn-galaxies", "learn-space-exploration"],
  },
  {
    slug: "learn-night-sky",
    title: "Learn the Night Sky",
    description: "Find your way around the sky — constellations, planets, and events.",
    accent: "aurora",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "How to observe the night sky", href: "/guides/how-to-observe-the-night-sky", blurb: "Practical stargazing skills." },
          { title: "Sky Tonight", href: "/sky-guide/night-sky-tonight", blurb: "What's visible after dark." },
          { title: "Explore constellations", href: "/explore/constellations", blurb: "The patterns of the sky." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "Moon phases", href: "/sky-guide/moon-phase", blurb: "The Moon's monthly cycle." },
          { title: "Meteor showers", href: "/sky-guide/meteor-showers", blurb: "When Earth meets cometary dust." },
          { title: "Planet visibility", href: "/sky-guide/planet-visibility", blurb: "Where the planets are." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "Solar eclipses", href: "/sky-guide/solar-eclipses", blurb: "When the Moon hides the Sun." },
          { title: "Night sky objects", href: "/explore/night-sky", blurb: "Showers, comets, and bright constellations." },
          { title: "Celestial events", href: "/sky-guide/celestial-events", blurb: "The events worth looking up for." },
        ],
      },
    ],
    relatedEntityIds: ["constellation:orion", "meteor_shower:perseids"],
    next: ["learn-astrophotography", "learn-astronomy"],
  },
  {
    slug: "learn-astrophotography",
    title: "Learn Astrophotography",
    description: "Capturing the sky — the targets and the craft.",
    accent: "halo",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "Observe the night sky", href: "/guides/how-to-observe-the-night-sky", blurb: "Know the sky before you shoot it." },
          { title: "The Moon", href: "/sky-guide/moon-phase", blurb: "The best first target." },
          { title: "Explore constellations", href: "/explore/constellations", blurb: "Wide-field starting points." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "Nebulae", href: "/explore/nebulae", blurb: "Colorful deep-sky targets." },
          { title: "Messier objects", href: "/connections/messier-objects", blurb: "A classic target list." },
          { title: "Image Library", href: "/observatory/image-library", blurb: "Openly licensed reference imagery." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "Galaxies", href: "/explore/galaxies", blurb: "Faint, rewarding deep-sky targets." },
          { title: "Advanced astronomy", href: "/guides/advanced-astronomy", blurb: "Techniques and methods." },
          { title: "Deep sky", href: "/explore/deep-sky", blurb: "The full deep-sky catalogue." },
        ],
      },
    ],
    relatedEntityIds: ["nebula:orion-nebula", "star_cluster:pleiades"],
    next: ["learn-night-sky", "learn-telescopes"],
  },
  {
    slug: "learn-greek-sky-mythology",
    title: "Learn Greek Sky Mythology",
    description: "The myths behind the constellations — cultural heritage, not science.",
    accent: "ember",
    stages: [
      {
        level: "Beginner",
        steps: [
          { title: "Greek mythology", href: "/encyclopedia/greek-mythology", blurb: "The myths behind the names." },
          { title: "Orion", href: "/encyclopedia/greek-mythology/orion", blurb: "The giant huntsman." },
          { title: "Explore mythology", href: "/explore/mythology", blurb: "Figures of the sky in the graph." },
        ],
      },
      {
        level: "Intermediate",
        steps: [
          { title: "Perseus", href: "/encyclopedia/greek-mythology/perseus", blurb: "Hero of the Andromeda myth." },
          { title: "The Pleiades", href: "/encyclopedia/greek-mythology/pleiades", blurb: "The Seven Sisters." },
          { title: "Greek mythology of the sky", href: "/connections/greek-mythology-of-the-sky", blurb: "Figures linked to constellations." },
        ],
      },
      {
        level: "Advanced",
        steps: [
          { title: "Asteria", href: "/encyclopedia/greek-mythology/asteria", blurb: "Titaness of the starry night." },
          { title: "History of astronomy", href: "/encyclopedia/history-of-astronomy", blurb: "From myth to measurement." },
          { title: "Constellations", href: "/explore/constellations", blurb: "The modern sky regions." },
        ],
      },
    ],
    relatedEntityIds: ["mythology_figure:orion", "mythology_figure:perseus", "mythology_figure:asteria"],
    next: ["learn-night-sky", "learn-astronomy"],
  },
];

const BY_SLUG = new Map(LEARNING_PATHS.map((p) => [p.slug, p]));
export function getLearningPath(slug: string): LearningPath | undefined {
  return BY_SLUG.get(slug);
}
