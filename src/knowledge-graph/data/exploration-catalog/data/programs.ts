import type { ExplorationRecord } from "@/knowledge-graph/data/exploration-catalog/types";

/** Mission programs. Each links to its lead agency; missions link via part_of_program. */
const P = (slug: string, name: string, agencySlug: string, startYear: string, endYear: string | undefined, status: string, description: string, sources: ExplorationRecord["sources"] = ["nasa"], altNames?: string[]): ExplorationRecord =>
  ({ id: `mission_program:${slug}`, slug, name, kind: "program", agencySlug, startYear, endYear, status, description, sources, altNames });

export const programs: ExplorationRecord[] = [
  P("mercury", "Project Mercury", "nasa", "1958", "1963", "Completed", "Project Mercury was the first United States human spaceflight programme, putting the first American astronauts into orbit."),
  P("gemini", "Project Gemini", "nasa", "1961", "1966", "Completed", "Project Gemini developed the rendezvous, docking, and spacewalk techniques needed for the Apollo lunar missions."),
  P("apollo", "Apollo program", "nasa", "1961", "1972", "Completed", "The Apollo program landed the first humans on the Moon between 1969 and 1972, carrying out six crewed lunar landings."),
  P("skylab", "Skylab", "nasa", "1973", "1979", "Completed", "Skylab was the first United States space station, crewed by three missions in 1973–1974."),
  P("space-shuttle", "Space Shuttle program", "nasa", "1972", "2011", "Completed", "The Space Shuttle was NASA's reusable crewed launch system, flying 135 missions between 1981 and 2011.", ["nasa"], ["Space Transportation System", "STS"]),
  P("artemis", "Artemis program", "nasa", "2017", undefined, "Active", "Artemis is NASA's programme to return humans to the Moon and establish a sustainable lunar presence, in partnership with international and commercial partners."),
  P("mariner", "Mariner program", "nasa", "1962", "1973", "Completed", "The Mariner program conducted the first successful flybys and orbits of Mercury, Venus, and Mars.", ["jpl"]),
  P("pioneer", "Pioneer program", "nasa", "1958", "1978", "Completed", "The Pioneer program included the first spacecraft to fly through the asteroid belt and past Jupiter and Saturn."),
  P("voyager", "Voyager program", "nasa", "1977", undefined, "Active", "The Voyager program sent two probes on a grand tour of the outer planets; both have since entered interstellar space.", ["jpl"]),
  P("viking", "Viking program", "nasa", "1975", "1982", "Completed", "The Viking program placed two orbiter–lander pairs at Mars, returning the first images from the Martian surface and searching for life."),
  P("mars-exploration-program", "Mars Exploration Program", "nasa", "1993", undefined, "Active", "NASA's long-running programme of orbiters, landers, and rovers systematically exploring Mars.", ["jpl"]),
  P("luna", "Luna program", "roscosmos", "1959", "1976", "Completed", "The Soviet Luna program achieved many lunar firsts, including the first impact, first far-side images, and first robotic sample return.", ["roscosmos"], ["Lunik"]),
  P("lunokhod", "Lunokhod program", "roscosmos", "1969", "1973", "Completed", "The Lunokhod program operated the first robotic rovers on the Moon.", ["roscosmos"]),
  P("venera", "Venera program", "roscosmos", "1961", "1984", "Completed", "The Soviet Venera program returned the first data and images from the surface of Venus.", ["roscosmos"]),
  P("vostok", "Vostok program", "roscosmos", "1961", "1963", "Completed", "The Vostok program carried out the first human spaceflight, by Yuri Gagarin in 1961.", ["roscosmos"]),
  P("voskhod", "Voskhod program", "roscosmos", "1964", "1965", "Completed", "The Voskhod program achieved the first multi-crew flight and the first spacewalk.", ["roscosmos"]),
  P("soyuz-program", "Soyuz program", "roscosmos", "1967", undefined, "Active", "The Soyuz program has provided crewed access to orbit for over five decades and remains a mainstay of ISS crew transport.", ["roscosmos"]),
  P("change", "Chang'e program", "cnsa", "2007", undefined, "Active", "China's Chang'e program of lunar orbiters, landers, rovers, and sample-return missions, named for the lunar goddess.", ["nasa"], ["Chang'e"]),
  P("chandrayaan", "Chandrayaan program", "isro", "2008", undefined, "Active", "ISRO's lunar exploration program; Chandrayaan-3 achieved the first soft landing near the lunar south pole in 2023.", ["isro"]),
  P("hayabusa-program", "Hayabusa program", "jaxa", "2003", undefined, "Active", "JAXA's asteroid sample-return program; Hayabusa and Hayabusa2 returned samples from asteroids Itokawa and Ryugu.", ["jaxa"]),
  P("new-frontiers", "New Frontiers program", "nasa", "2006", undefined, "Active", "NASA's series of medium-class planetary missions, including New Horizons, Juno, and OSIRIS-REx."),
  P("discovery-program", "Discovery Program", "nasa", "1992", undefined, "Active", "NASA's line of lower-cost, focused planetary science missions, including MESSENGER, Dawn, InSight, Lucy, and Psyche."),
  P("mars-sample-return", "Mars Sample Return", "nasa", "2020", undefined, "Planned", "A planned NASA–ESA campaign to return the rock cores cached by the Perseverance rover to Earth.", ["nasa", "esa"]),
];
