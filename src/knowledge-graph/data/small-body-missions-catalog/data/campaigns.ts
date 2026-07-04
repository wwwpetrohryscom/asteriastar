import type { SmallBodyRecord } from "@/knowledge-graph/data/small-body-missions-catalog/types";

/**
 * Science campaigns — joint efforts that span more than one mission. AIDA is the
 * asteroid-deflection collaboration between NASA's DART and ESA's Hera.
 */

const mk = (r: Omit<SmallBodyRecord, "kind" | "id"> & { slug: string }): SmallBodyRecord => ({
  ...r,
  kind: "campaign",
  id: `science_campaign:${r.slug}`,
});

export const campaigns: SmallBodyRecord[] = [
  mk({
    slug: "aida",
    name: "AIDA",
    altNames: ["Asteroid Impact and Deflection Assessment"],
    description: "The Asteroid Impact and Deflection Assessment — an international collaboration to test and characterise asteroid deflection at the Didymos–Dimorphos binary. NASA's DART performed the kinetic impact in 2022; ESA's Hera will survey the result in detail, together turning a one-off experiment into a repeatable, well-understood technique.",
    definition: "The DART + Hera collaboration to demonstrate and measure asteroid deflection.",
    missionKeys: ["space_mission:dart", "space_mission:hera"],
    sources: ["nasa", "esa"],
    highlights: ["Links DART (impact) and Hera (assessment)"],
  }),
];
