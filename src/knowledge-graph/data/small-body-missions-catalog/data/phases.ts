import type { SmallBodyRecord } from "@/knowledge-graph/data/small-body-missions-catalog/types";

/**
 * Mission-lifecycle phases — the generic stages a small-body mission passes through, in
 * sequence (each followed_by the next). They are reference concepts, not per-mission
 * timelines: no fabricated dates. A few exemplar missions are linked to each phase.
 */

const mk = (r: Omit<SmallBodyRecord, "kind" | "id"> & { slug: string }): SmallBodyRecord => ({
  ...r,
  kind: "phase",
  id: `mission_phase:${r.slug}`,
});

export const phases: SmallBodyRecord[] = [
  mk({
    slug: "launch-and-cruise",
    name: "Launch & Cruise",
    order: 1,
    description: "The launch and the long interplanetary cruise to the target, often using gravity assists or ion propulsion to reach a distant small body.",
    definition: "Launch and the interplanetary transfer to the target body.",
    nextPhaseSlug: "approach-and-characterization",
    exemplarKeys: ["space_mission:dawn", "space_mission:lucy"],
    sources: ["nasa", "esa"],
  }),
  mk({
    slug: "approach-and-characterization",
    name: "Approach & Characterization",
    order: 2,
    description: "The final approach, when the target grows from a point of light into a resolved world and the spacecraft measures its shape, spin, and gravity to plan operations.",
    definition: "Approaching the target and characterising its shape, rotation, and environment.",
    nextPhaseSlug: "proximity-operations",
    exemplarKeys: ["space_mission:rosetta", "space_mission:osiris-rex"],
    sources: ["nasa", "esa"],
  }),
  mk({
    slug: "proximity-operations",
    name: "Proximity Operations",
    order: 3,
    description: "Extended operations close to the body — global mapping, orbiting, and selecting sites for a landing, sampling, or impact.",
    definition: "Sustained close-in operations: mapping, orbiting, and site selection.",
    nextPhaseSlug: "surface-operations",
    exemplarKeys: ["space_mission:near-shoemaker", "space_mission:hayabusa2"],
    sources: ["nasa", "jaxa"],
  }),
  mk({
    slug: "surface-operations",
    name: "Surface Operations & Sampling",
    order: 4,
    description: "The critical interaction with the surface — a touchdown, a landing, a sample-collection manoeuvre, or a deliberate impact.",
    definition: "Interacting with the surface: touchdown, landing, sampling, or impact.",
    nextPhaseSlug: "return-and-reentry",
    exemplarKeys: ["space_mission:hayabusa2", "space_mission:dart"],
    sources: ["nasa", "jaxa"],
  }),
  mk({
    slug: "return-and-reentry",
    name: "Return & Reentry",
    order: 5,
    description: "For sample-return missions, the journey home and the high-speed atmospheric reentry of the capsule to a recovery site — the phase that delivers the science to Earth.",
    definition: "The cruise home and the reentry of the sample capsule (sample-return missions).",
    exemplarKeys: ["space_mission:stardust", "space_mission:hayabusa"],
    sources: ["nasa", "jaxa"],
  }),
];
