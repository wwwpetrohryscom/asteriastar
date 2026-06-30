import type { HsfRecord } from "@/knowledge-graph/data/human-spaceflight-catalog/types";

/**
 * Historically important spacewalks (EVAs). Durations and participant lists are
 * only included when confidently sourced; otherwise omitted. Each EVA connects
 * to its participants, mission, station, or program.
 */
type V = { slug: string; name: string; date?: string; durationText?: string; participantSlugs?: string[]; missionSlug?: string; stationSlug?: string; programSlug?: string; description: string; sources?: HsfRecord["sources"] };
const mk = (v: V): HsfRecord => ({
  id: `eva:${v.slug}`, slug: v.slug, name: v.name, kind: "eva", launchDate: v.date, durationText: v.durationText,
  participantSlugs: v.participantSlugs, missionSlug: v.missionSlug, stationSlug: v.stationSlug, programSlug: v.programSlug,
  description: v.description, sources: v.sources ?? ["nasa"],
});

export const evas: HsfRecord[] = [
  mk({ slug: "first-spacewalk-leonov", name: "First spacewalk — Alexei Leonov", date: "1965-03-18", durationText: "about 12 minutes", participantSlugs: ["alexei-leonov"], missionSlug: "voskhod-2",
    description: "On 18 March 1965, Alexei Leonov left the Voskhod 2 spacecraft to become the first human to perform a spacewalk (extravehicular activity).", sources: ["roscosmos"] }),
  mk({ slug: "apollo-11-lunar-eva", name: "Apollo 11 lunar EVA", date: "1969-07-21", durationText: "about 2 hours 31 minutes", participantSlugs: ["neil-armstrong", "buzz-aldrin"], missionSlug: "apollo-11",
    description: "The Apollo 11 moonwalk was the first time humans walked on the surface of another world, as Neil Armstrong and Buzz Aldrin explored the Sea of Tranquility." }),
  mk({ slug: "apollo-15-lunar-evas", name: "Apollo 15 lunar EVAs", date: "1971-07", programSlug: "apollo",
    description: "During Apollo 15, David Scott and James Irwin conducted the first extended lunar surface exploration using the Lunar Roving Vehicle, across three spacewalks." }),
  mk({ slug: "first-iss-assembly-eva", name: "First ISS assembly spacewalk", date: "1998-12-07", stationSlug: "international-space-station",
    description: "The first spacewalks to assemble the International Space Station were carried out during the STS-88 mission, connecting the Unity and Zarya modules." }),
  mk({ slug: "first-all-female-spacewalk", name: "First all-female spacewalk", date: "2019-10-18", durationText: "about 7 hours 17 minutes", stationSlug: "international-space-station",
    description: "On 18 October 2019, Christina Koch and Jessica Meir conducted the first spacewalk performed entirely by women, outside the International Space Station." }),
  mk({ slug: "first-chinese-eva", name: "First Chinese spacewalk", date: "2008-09-27", programSlug: "shenzhou",
    description: "During the Shenzhou 7 mission in 2008, Zhai Zhigang performed the first spacewalk by a Chinese astronaut (taikonaut)." }),
];
