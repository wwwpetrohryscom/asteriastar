import type { Section } from "@/lib/content/types";

/**
 * Observatory — visual and interactive media.
 *
 * Galleries will use openly licensed and public-domain imagery only, with
 * provenance and license recorded for every item. No images are bundled in
 * this foundation phase; these pages describe the planned, source-backed
 * collections and interactive tools.
 */
export const observatory: Section = {
  slug: "observatory",
  name: "Observatory",
  kind: "media",
  accent: "halo",
  tagline: "See the universe — through verified, openly licensed imagery.",
  description:
    "Curated galleries and interactive views of the cosmos: NASA and ESA imagery, James Webb and Hubble highlights, sky maps, and a 3D Solar System — all from licensed sources.",
  intro:
    "The Observatory is Asteria Star's visual layer. It will gather the finest openly licensed and public-domain imagery of the universe, plus interactive tools for exploring the sky. Every image will carry its source, license, and credit. The collections below are planned and not yet populated.",
  categories: [
    {
      slug: "image-library",
      name: "Image Library",
      summary: "A searchable home for verified, openly licensed space imagery.",
      overview:
        "The image library will be a curated, searchable collection of openly licensed and public-domain space imagery, each item recorded with its source, credit, and license terms.",
      plannedTopics: ["Browse by object type", "Search & filters", "Credits & licenses", "Download policy"],
      sources: ["nasa", "esa", "wikimedia"],
      keywords: ["space images", "astronomy gallery", "public domain space"],
    },
    {
      slug: "nasa-gallery",
      name: "NASA Gallery",
      summary: "Highlights from NASA's public imagery.",
      overview:
        "A planned gallery of highlights drawn from NASA's largely public-domain image collections, with each item linked to its original NASA source and usage terms.",
      plannedTopics: ["Mission highlights", "Planetary imagery", "Earth from space", "Source links"],
      sources: ["nasa"],
      keywords: ["nasa images", "nasa photos"],
    },
    {
      slug: "esa-gallery",
      name: "ESA Gallery",
      summary: "Highlights from European Space Agency imagery.",
      overview:
        "A planned gallery of European Space Agency imagery, presented with credit and license details and linked back to ESA's originals.",
      plannedTopics: ["ESA missions", "Space science imagery", "Earth observation", "Source links"],
      sources: ["esa"],
      keywords: ["esa images", "european space agency photos"],
    },
    {
      slug: "james-webb",
      name: "James Webb",
      summary: "Imagery from the James Webb Space Telescope.",
      overview:
        "A planned showcase of imagery from the James Webb Space Telescope — an infrared observatory operated as an international partnership — with full source and credit for each release.",
      plannedTopics: ["Deep field views", "Nebulae & galaxies", "How JWST sees", "Release credits"],
      sources: ["nasa", "esa"],
      keywords: ["jwst images", "webb telescope photos"],
    },
    {
      slug: "hubble",
      name: "Hubble",
      summary: "Highlights from the Hubble Space Telescope.",
      overview:
        "A planned showcase of Hubble Space Telescope imagery, a decades-long collaboration in orbit, presented with credit and source links for each image.",
      plannedTopics: ["Iconic images", "Deep fields", "How Hubble sees", "Release credits"],
      sources: ["nasa", "esa"],
      keywords: ["hubble images", "hubble photos"],
    },
    {
      slug: "videos",
      name: "Videos",
      summary: "Curated, openly licensed astronomy video.",
      overview:
        "A planned collection of openly licensed astronomy and space video — visualizations, mission footage, and explainers — each presented with its source and license.",
      plannedTopics: ["Mission footage", "Visualizations", "Explainers", "Source & license"],
      sources: ["nasa", "esa"],
      keywords: ["space videos", "astronomy video"],
    },
    {
      slug: "interactive-sky-maps",
      name: "Interactive Sky Maps",
      summary: "Pan-and-zoom maps of the night sky.",
      overview:
        "A planned interactive sky map for exploring constellations, bright stars, and deep-sky objects from your location and date. It will complement the Sky Guide's observing tools.",
      plannedTopics: ["Interactive star map", "Constellation overlays", "Object search", "Location & time"],
      sources: ["iau", "nasa"],
      keywords: ["star map online", "interactive planetarium"],
    },
    {
      slug: "3d-solar-system",
      name: "3D Solar System",
      summary: "An interactive model of the Sun and its worlds.",
      overview:
        "A planned interactive 3D model of the Solar System, letting you explore the relative positions and orbits of the planets using published orbital data.",
      plannedTopics: ["Orbit visualization", "Planet explorer", "Scale toggles", "Data source"],
      sources: ["nasa", "jpl"],
      keywords: ["solar system model", "3d planets"],
    },
    {
      slug: "star-maps",
      name: "Star Maps",
      summary: "Reference and printable star charts.",
      overview:
        "A planned set of reference star charts — including printable seasonal maps — for learning the sky and planning observation, complementing the interactive maps.",
      plannedTopics: ["Seasonal charts", "Printable maps", "Constellation guides", "How to use them"],
      sources: ["iau", "nasa"],
      keywords: ["printable star chart", "star atlas"],
    },
    {
      slug: "nasa-image-archive",
      name: "NASA Image Archive",
      summary: "A future window onto NASA's openly licensed imagery.",
      overview:
        "A planned archive surfacing NASA's largely public-domain imagery with full credit, license, and source for every item. Prepared for official NASA integration — no images are bundled or fabricated.",
      plannedTopics: ["Mission imagery", "Planetary photography", "Credits & licenses", "Source links"],
      sources: ["nasa"],
      dataModule: true,
      keywords: ["nasa images", "nasa image archive"],
    },
    {
      slug: "esa-image-archive",
      name: "ESA Image Archive",
      summary: "A future window onto ESA's openly licensed imagery.",
      overview:
        "A planned archive surfacing European Space Agency imagery with credit and license details and links back to ESA's originals. Prepared for official ESA integration — no images are bundled or fabricated.",
      plannedTopics: ["ESA missions", "Space science imagery", "Credits & licenses", "Source links"],
      sources: ["esa"],
      dataModule: true,
      keywords: ["esa images", "esa image archive"],
    },
    {
      slug: "launches",
      name: "Launches",
      summary: "A future calendar of rocket launches and their vehicles.",
      overview:
        "A planned launch calendar tracking upcoming and historic launches by vehicle and agency. Prepared for integration with official launch schedules — no fake live data. Explore launch vehicles and agencies in the Knowledge Graph today.",
      plannedTopics: ["Upcoming launches", "By launch vehicle", "By agency", "Live schedule"],
      sources: ["nasa", "esa"],
      dataModule: true,
      keywords: ["rocket launches", "launch schedule", "launch calendar"],
    },
  ],
};
