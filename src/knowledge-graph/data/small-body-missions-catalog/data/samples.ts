import type { SmallBodyRecord } from "@/knowledge-graph/data/small-body-missions-catalog/types";

/**
 * Returned samples — the material actually brought back to Earth from a small body. Only
 * missions that have completed sample return appear here; masses are stated only where
 * verified (Itokawa's sub-milligram grains, Ryugu's 5.4 g, Bennu's 121.6 g). Stardust's
 * cometary and interstellar dust is a particle count in aerogel, not a meaningful mass.
 */

const mk = (r: Omit<SmallBodyRecord, "kind" | "id"> & { slug: string }): SmallBodyRecord => ({
  ...r,
  kind: "sample",
  id: `returned_sample:${r.slug}`,
});

export const samples: SmallBodyRecord[] = [
  mk({
    slug: "itokawa-sample",
    name: "Itokawa Sample (Hayabusa)",
    description: "More than 1,500 microscopic grains from the S-type asteroid 25143 Itokawa, returned by Hayabusa in 2010 — the first sample ever returned from an asteroid. The grains tied ordinary (LL) chondrite meteorites to S-type asteroids and showed signs of space weathering.",
    sampleBodyKey: "asteroid:itokawa",
    massLabel: "Sub-milligram total (more than 1,500 grains)",
    collectedByMissionSlug: "hayabusa",
    analysisLabel: "Curated at JAXA; distributed to laboratories worldwide.",
    sources: ["jaxa", "nasa"],
    highlights: ["First asteroid sample returned to Earth"],
  }),
  mk({
    slug: "ryugu-sample",
    name: "Ryugu Sample (Hayabusa2)",
    description: "5.4 grams of surface and subsurface material from the carbonaceous asteroid 162173 Ryugu, returned by Hayabusa2 in 2020. The pristine, water- and organic-bearing grains contain amino acids and predate the Solar System's planets.",
    sampleBodyKey: "asteroid:ryugu",
    massLabel: "5.4 g",
    collectedByMissionSlug: "hayabusa2",
    analysisLabel: "Curated at JAXA; found to contain water-bearing minerals and amino acids.",
    sources: ["jaxa", "nasa"],
    highlights: ["A carbonaceous asteroid's water- and organic-rich rock"],
  }),
  mk({
    slug: "bennu-sample",
    name: "Bennu Sample (OSIRIS-REx)",
    description: "121.6 grams of dust and rock from the carbonaceous near-Earth asteroid 101955 Bennu, returned by OSIRIS-REx in 2023 — the largest asteroid sample yet returned. Early analysis shows abundant carbon and water-bearing clay minerals.",
    sampleBodyKey: "asteroid:bennu",
    massLabel: "121.6 g",
    collectedByMissionSlug: "osiris-rex",
    analysisLabel: "Curated at NASA Johnson Space Center; rich in carbon and hydrated minerals.",
    sources: ["nasa", "jpl"],
    highlights: ["The largest asteroid sample returned to date"],
  }),
  mk({
    slug: "wild-2-sample",
    name: "Wild 2 Sample (Stardust)",
    description: "Thousands of cometary dust particles captured in aerogel as Stardust flew through the coma of comet 81P/Wild 2, returned in 2006 — the first cometary material and the first sample from beyond the Moon. The grains revealed high-temperature minerals and the amino acid glycine.",
    sampleBodyKey: "comet:wild-2",
    collectedByMissionSlug: "stardust",
    analysisLabel: "Curated at NASA Johnson Space Center; contains crystalline high-temperature minerals and glycine.",
    sources: ["nasa", "jpl"],
    highlights: ["First cometary sample returned to Earth"],
  }),
];
