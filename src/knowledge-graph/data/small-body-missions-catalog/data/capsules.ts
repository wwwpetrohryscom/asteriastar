import type { SmallBodyRecord } from "@/knowledge-graph/data/small-body-missions-catalog/types";

/**
 * Sample-return capsules — the reentry hardware that carried each returned sample safely
 * through the atmosphere to a recovery site. Each is part_of_mission of its spacecraft.
 */

const mk = (r: Omit<SmallBodyRecord, "kind" | "id"> & { slug: string }): SmallBodyRecord => ({
  ...r,
  kind: "capsule",
  id: `sample_return_capsule:${r.slug}`,
});

export const capsules: SmallBodyRecord[] = [
  mk({
    slug: "hayabusa-src",
    name: "Hayabusa Sample-Return Capsule",
    description: "The small heat-shielded capsule that carried Hayabusa's Itokawa grains back through the atmosphere, separating from the spacecraft (which burned up) and landing by parachute in the Australian outback.",
    missionSlug: "hayabusa",
    reentryLabel: "13 June 2010 — Woomera, Australia",
    sources: ["jaxa"],
  }),
  mk({
    slug: "hayabusa2-src",
    name: "Hayabusa2 Sample-Return Capsule",
    description: "The reentry capsule that returned Hayabusa2's 5.4 g of Ryugu material, recovered in the Australian desert while the spacecraft continued on to an extended mission.",
    missionSlug: "hayabusa2",
    reentryLabel: "6 December 2020 — Woomera, Australia",
    sources: ["jaxa"],
  }),
  mk({
    slug: "osiris-rex-src",
    name: "OSIRIS-REx Sample-Return Capsule",
    description: "The capsule that delivered 121.6 g of asteroid Bennu to Earth, released by OSIRIS-REx on a flyby before the spacecraft diverted toward Apophis.",
    missionSlug: "osiris-rex",
    reentryLabel: "24 September 2023 — Utah Test and Training Range",
    sources: ["nasa"],
  }),
  mk({
    slug: "stardust-src",
    name: "Stardust Sample-Return Capsule",
    description: "The capsule that returned Stardust's aerogel trays of comet Wild 2 dust — the first sample-return capsule to bring material back from beyond the Moon.",
    missionSlug: "stardust",
    reentryLabel: "15 January 2006 — Utah Test and Training Range",
    sources: ["nasa", "jpl"],
  }),
];
