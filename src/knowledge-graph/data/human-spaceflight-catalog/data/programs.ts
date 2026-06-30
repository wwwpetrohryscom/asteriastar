import type { HsfRecord } from "@/knowledge-graph/data/human-spaceflight-catalog/types";

/**
 * Human spaceflight programs. Programs that already exist as mission_program
 * entities (from Program D) are reused and enriched; the station-era programs
 * are created as human_spaceflight_program entities.
 */
type P = { slug: string; name: string; existing?: boolean; existingId?: string; agencySlug: string; startYear: string; endYear?: string; status: string; description: string; sources?: HsfRecord["sources"] };
const mk = (p: P): HsfRecord => ({
  id: p.existingId ?? `human_spaceflight_program:${p.slug}`, slug: p.slug, name: p.name, kind: "program", existing: p.existing,
  agencySlug: p.agencySlug, operationalPeriod: `${p.startYear}–${p.endYear ?? "present"}`, status: p.status, description: p.description, sources: p.sources ?? ["nasa"],
});

export const programs: HsfRecord[] = [
  // Reused mission_program entities (enriched in the human-spaceflight context).
  mk({ slug: "vostok", existing: true, existingId: "mission_program:vostok", name: "Vostok program", agencySlug: "roscosmos", startYear: "1961", endYear: "1963", status: "Completed", description: "The Vostok program carried out the first human spaceflight, by Yuri Gagarin in 1961.", sources: ["roscosmos"] }),
  mk({ slug: "voskhod", existing: true, existingId: "mission_program:voskhod", name: "Voskhod program", agencySlug: "roscosmos", startYear: "1964", endYear: "1965", status: "Completed", description: "The Voskhod program achieved the first multi-crew flight and the first spacewalk.", sources: ["roscosmos"] }),
  mk({ slug: "mercury", existing: true, existingId: "mission_program:mercury", name: "Project Mercury", agencySlug: "nasa", startYear: "1958", endYear: "1963", status: "Completed", description: "Project Mercury was the first United States human spaceflight program, putting the first Americans into space and orbit." }),
  mk({ slug: "gemini", existing: true, existingId: "mission_program:gemini", name: "Project Gemini", agencySlug: "nasa", startYear: "1961", endYear: "1966", status: "Completed", description: "Project Gemini developed the rendezvous, docking, and spacewalk techniques needed for Apollo." }),
  mk({ slug: "apollo", existing: true, existingId: "mission_program:apollo", name: "Apollo program", agencySlug: "nasa", startYear: "1961", endYear: "1972", status: "Completed", description: "The Apollo program landed the first humans on the Moon between 1969 and 1972." }),
  mk({ slug: "skylab-program", existing: true, existingId: "mission_program:skylab", name: "Skylab program", agencySlug: "nasa", startYear: "1973", endYear: "1979", status: "Completed", description: "Skylab was the first United States space station program, crewed by three missions in 1973–1974." }),
  mk({ slug: "space-shuttle", existing: true, existingId: "mission_program:space-shuttle", name: "Space Shuttle program", agencySlug: "nasa", startYear: "1972", endYear: "2011", status: "Completed", description: "The Space Shuttle program flew a reusable crewed spaceplane on 135 missions and assembled much of the ISS." }),
  mk({ slug: "artemis", existing: true, existingId: "mission_program:artemis", name: "Artemis program", agencySlug: "nasa", startYear: "2017", status: "Active", description: "Artemis is NASA's program to return humans to the Moon and build a sustainable lunar presence." }),

  // New human-spaceflight programs.
  mk({ slug: "salyut", name: "Salyut program", agencySlug: "roscosmos", startYear: "1971", endYear: "1986", status: "Completed", description: "The Soviet Salyut program operated the first generation of space stations, including the world's first station, Salyut 1.", sources: ["roscosmos"] }),
  mk({ slug: "mir-program", name: "Mir program", agencySlug: "roscosmos", startYear: "1986", endYear: "2001", status: "Completed", description: "The Mir program operated the first modular long-duration space station and pioneered international cooperation in orbit.", sources: ["roscosmos"] }),
  mk({ slug: "iss-program", name: "International Space Station program", agencySlug: "nasa", startYear: "1998", status: "Active", description: "The ISS program is the international partnership that builds and operates the continuously crewed International Space Station.", sources: ["nasa", "esa"] }),
  mk({ slug: "shenzhou", name: "Shenzhou program", agencySlug: "cnsa", startYear: "1999", status: "Active", description: "Shenzhou is China's crewed spaceflight program, which first sent a Chinese astronaut to orbit in 2003 and now crews the Tiangong station." }),
  mk({ slug: "commercial-crew", name: "Commercial Crew Program", agencySlug: "nasa", startYear: "2010", status: "Active", description: "NASA's Commercial Crew Program partners with industry to provide crewed transport to the ISS aboard SpaceX's Crew Dragon and Boeing's Starliner." }),
  mk({ slug: "tiangong-program", name: "Tiangong program", agencySlug: "cnsa", startYear: "2011", status: "Active", description: "China's space-station program, which flew the Tiangong-1 and Tiangong-2 laboratories before assembling the modular Tiangong station." }),
];
