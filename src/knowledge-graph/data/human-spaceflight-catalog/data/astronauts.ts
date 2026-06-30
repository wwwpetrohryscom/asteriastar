import type { HsfRecord } from "@/knowledge-graph/data/human-spaceflight-catalog/types";

/**
 * Astronauts new to the platform. The other people named in the brief (Gagarin,
 * Armstrong, Tereshkova, Leonov, Sally Ride, Mae Jemison, Chris Hadfield, Peggy
 * Whitson, Yang Liwei, …) already exist from Program D and are referenced by
 * expeditions and EVAs. Only source-backed facts; biographies not invented.
 */
type A = { slug: string; name: string; nationality: string; agencySlug?: string; relatedKeys?: string[]; bornYear?: string; firstFlight?: string; notableFor: string; sources?: HsfRecord["sources"] };
const mk = (a: A): HsfRecord => ({
  id: `astronaut:${a.slug}`, slug: a.slug, name: a.name, kind: "astronaut", nationality: a.nationality,
  agencySlug: a.agencySlug, relatedKeys: a.relatedKeys, bornYear: a.bornYear, firstFlight: a.firstFlight, notableFor: a.notableFor,
  description: `${a.name} — ${a.notableFor}.`, sources: a.sources ?? ["nasa"],
});

export const astronauts: HsfRecord[] = [
  mk({ slug: "sergei-krikalev", name: "Sergei Krikalev", nationality: "Russia", agencySlug: "roscosmos", bornYear: "1958", firstFlight: "1988", notableFor: "a veteran cosmonaut who flew on Mir, the Space Shuttle, and the ISS, and was a member of the first ISS expedition crew", sources: ["roscosmos"] }),
  mk({ slug: "gennady-padalka", name: "Gennady Padalka", nationality: "Russia", agencySlug: "roscosmos", bornYear: "1958", firstFlight: "1998", notableFor: "a cosmonaut who commanded several ISS expeditions and holds the record for the most cumulative time spent in space", sources: ["roscosmos"] }),
  mk({ slug: "wang-yaping", name: "Wang Yaping", nationality: "China", agencySlug: "cnsa", bornYear: "1980", firstFlight: "2013", notableFor: "a taikonaut who became the first Chinese woman to perform a spacewalk, during a Shenzhou mission to the Tiangong station" }),
  mk({ slug: "helen-sharman", name: "Helen Sharman", nationality: "United Kingdom", relatedKeys: ["space_station:mir"], bornYear: "1963", firstFlight: "1991", notableFor: "the first British astronaut in space, who visited the Mir station in 1991 via the privately funded Project Juno mission", sources: ["esa"] }),
  mk({ slug: "samantha-cristoforetti", name: "Samantha Cristoforetti", nationality: "Italy", agencySlug: "esa", bornYear: "1977", firstFlight: "2014", notableFor: "an ESA astronaut, the first Italian woman in space, who later commanded the International Space Station", sources: ["esa"] }),
];
