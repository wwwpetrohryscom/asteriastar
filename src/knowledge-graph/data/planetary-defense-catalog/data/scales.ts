import type { DefenseRecord } from "@/knowledge-graph/data/planetary-defense-catalog/types";

/** Impact-risk communication scales. Each is associated_with the REUSED organisations and
 *  objects it has been applied to. */
const sc = (r: Omit<DefenseRecord, "kind" | "id" | "sources"> & { slug: string; sources?: DefenseRecord["sources"] }): DefenseRecord => ({ sources: ["nasa"], ...r, kind: "scale", id: `risk_scale:${r.slug}` });

export const scales: DefenseRecord[] = [
  sc({ slug: "torino-scale", name: "The Torino Scale", relatedKeys: ["asteroid:apophis", "organization:cneos"], description: "A 0–10 scale, like a hazard traffic light, for communicating the risk of a near-Earth object to the public — combining impact probability and energy into a single colour-coded number. Apophis briefly reached level 4, the highest ever, before further observations returned it to zero.", sources: ["nasa"], highlights: ["Apophis reached level 4 — the highest ever recorded"] }),
  sc({ slug: "palermo-scale", name: "The Palermo Scale", relatedKeys: ["organization:cneos"], description: "A more technical, logarithmic scale used by specialists to rank impact hazards against the background risk of a random impact of the same size over the same time. Values below zero mean a threat less than the everyday background; above zero warrants attention.", sources: ["nasa"] }),
];
