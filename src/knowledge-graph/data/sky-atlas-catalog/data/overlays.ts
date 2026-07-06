import type { AtlasRecord } from "@/knowledge-graph/data/sky-atlas-catalog/types";

/** Atlas overlays — data layers drawn on top of the maps and explorers. Each links to the REUSED
 *  telescope, survey, or object it represents, and to the atlas view it augments. Overlays add
 *  context; they never invent positions or observations. */
const overlay = (r: Omit<AtlasRecord, "kind" | "id" | "sources"> & { slug: string; sources?: AtlasRecord["sources"] }): AtlasRecord => ({ sources: ["nasa"], ...r, kind: "overlay", id: `atlas_overlay:${r.slug}` });

export const overlays: AtlasRecord[] = [
  overlay({ slug: "constellation-lines-overlay", name: "Constellation Lines Overlay", relatedKeys: ["constellation:orion", "atlas_view:all-sky-star-atlas"], description: "The familiar stick-figure lines that join a constellation's stars, drawn between the real stellar positions to make the ancient patterns legible on the star map.", sources: ["iau"] }),
  overlay({ slug: "observation-conditions-overlay", name: "Observation Conditions Overlay", relatedKeys: ["planet:earth", "atlas_view:all-sky-star-atlas"], description: "A layer showing which part of the sky is above the horizon for an observer at a given place and time. Computed from the observer's location and the clock — no observing conditions are assumed or invented, and location stays on the device.", sources: ["nasa"] }),
  overlay({ slug: "jwst-target-overlay", name: "JWST Target Overlay", relatedKeys: ["space_telescope:james-webb-space-telescope", "atlas_view:deep-sky-atlas"], description: "A layer marking the positions of objects observed by the James Webb Space Telescope, linking each region of the deep-sky map to the science it has enabled.", sources: ["nasa"] }),
  overlay({ slug: "hubble-target-overlay", name: "Hubble Target Overlay", relatedKeys: ["space_telescope:hubble-space-telescope", "atlas_view:deep-sky-atlas"], description: "A layer marking the positions of famous Hubble Space Telescope targets across the deep-sky map, from the Deep Fields to the great nebulae.", sources: ["nasa"] }),
  overlay({ slug: "gaia-survey-overlay", name: "Gaia Survey Overlay", relatedKeys: ["space_telescope:gaia", "atlas_view:all-sky-star-atlas"], description: "A layer representing the all-sky astrometric coverage of the Gaia mission, whose measured positions and parallaxes underpin the modern star catalogue that the atlas draws.", sources: ["gaia"] }),
  overlay({ slug: "telescope-fov-overlay", name: "Telescope Field-of-View Overlay", relatedKeys: ["space_telescope:hubble-space-telescope", "atlas_view:messier-atlas"], description: "A layer showing the angular field of view of a chosen telescope or instrument against the sky, so a target's real angular size can be compared with what an instrument can frame in a single pointing.", sources: ["nasa"] }),
];
