import type { AwardRecord } from "@/knowledge-graph/data/history-catalog/types";

/** Major scientific awards relevant to astronomy. */
export const AWARDS: AwardRecord[] = [
  {
    slug: "nobel-prize-physics",
    name: "Nobel Prize in Physics",
    description:
      "The premier international award in physics, awarded by the Royal Swedish Academy of Sciences since 1901. Astronomy and astrophysics have been recognised many times — for the cosmic microwave background, pulsars, neutron stars, exoplanets, cosmic acceleration, and black holes.",
    sources: ["nobel"],
  },
  {
    slug: "breakthrough-prize-fundamental-physics",
    name: "Breakthrough Prize in Fundamental Physics",
    description:
      "A major science award founded in 2012. Its Special Breakthrough Prize has honoured discoveries including the detection of gravitational waves and, for Jocelyn Bell Burnell, the discovery of pulsars.",
    sources: ["britannica"],
  },
];
