import type { AsterismRecord } from "@/knowledge-graph/data/constellations-catalog/types";

/**
 * Named asterisms — recognizable star patterns that are NOT among the 88 official
 * constellations (some lie within one constellation, others span several). Each
 * links to the constellation(s) it draws from via associated_with. Star ids are
 * given only for well-catalogued vertex stars (reused, never created) and are
 * otherwise omitted.
 */
export const asterisms: AsterismRecord[] = [
  { slug: "big-dipper", name: "The Big Dipper", sources: ["britannica"], description: "Seven bright stars of Ursa Major forming a dipper (the Plough in Britain) — the most familiar star pattern of the northern sky, and a signpost to Polaris.", constellationSlugs: ["ursa-major"] },
  { slug: "little-dipper", name: "The Little Dipper", sources: ["britannica"], description: "The main pattern of Ursa Minor, whose handle ends at Polaris, the North Star.", constellationSlugs: ["ursa-minor"], starIds: ["star:polaris"] },
  { slug: "summer-triangle", name: "The Summer Triangle", sources: ["britannica"], description: "A large triangle of three first-magnitude stars — Vega, Deneb, and Altair — spanning Lyra, Cygnus, and Aquila; the defining pattern of the northern summer sky.", constellationSlugs: ["lyra", "cygnus", "aquila"], starIds: ["star:vega", "star:deneb", "star:altair"] },
  { slug: "winter-triangle", name: "The Winter Triangle", sources: ["britannica"], description: "An equilateral triangle of Sirius, Procyon, and Betelgeuse, straddling Canis Major, Canis Minor, and Orion.", constellationSlugs: ["orion", "canis-major", "canis-minor"], starIds: ["star:sirius", "star:procyon"] },
  { slug: "winter-hexagon", name: "The Winter Hexagon", sources: ["britannica"], description: "A great ring of brilliant winter stars — Rigel, Aldebaran, Capella, Pollux, Procyon, and Sirius — enclosing much of the northern winter sky.", constellationSlugs: ["orion", "taurus", "auriga", "gemini", "canis-minor", "canis-major"], starIds: ["star:rigel", "star:aldebaran", "star:capella", "star:pollux", "star:procyon", "star:sirius"] },
  { slug: "great-square-of-pegasus", name: "The Great Square of Pegasus", sources: ["britannica"], description: "A large near-square of stars marking the body of Pegasus, with its northeastern corner shared by Andromeda — a key autumn signpost.", constellationSlugs: ["pegasus", "andromeda"] },
  { slug: "northern-cross", name: "The Northern Cross", sources: ["britannica"], description: "The cross-shaped main pattern of Cygnus, laid along the summer Milky Way with Deneb at its head.", constellationSlugs: ["cygnus"], starIds: ["star:deneb"] },
  { slug: "teapot", name: "The Teapot", sources: ["britannica"], description: "The brightest stars of Sagittarius form a teapot whose spout points toward the Galactic Center, where the summer Milky Way is richest.", constellationSlugs: ["sagittarius"] },
  { slug: "sickle", name: "The Sickle of Leo", sources: ["britannica"], description: "A backwards-question-mark of stars marking the head and mane of Leo, anchored by Regulus.", constellationSlugs: ["leo"], starIds: ["star:regulus"] },
  { slug: "keystone", name: "The Keystone", sources: ["britannica"], description: "A lopsided quadrilateral forming the torso of Hercules; the great globular cluster M13 lies along its western side.", constellationSlugs: ["hercules"] },
  { slug: "coathanger", name: "The Coathanger", sources: ["britannica"], description: "A chance line of six stars with a hook (also called Brocchi's Cluster) in Vulpecula, a fine binocular target.", constellationSlugs: ["vulpecula"] },
  { slug: "false-cross", name: "The False Cross", sources: ["britannica"], description: "A cross of four stars spanning Carina and Vela, often mistaken for the true Southern Cross (Crux).", constellationSlugs: ["carina", "vela"] },
];
