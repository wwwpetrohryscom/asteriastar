import type { HsfRecord } from "@/knowledge-graph/data/human-spaceflight-catalog/types";

/**
 * ISS expeditions (the long-duration resident crews). Each is part_of_station
 * the ISS and launched aboard a Soyuz. Crew members are linked where they exist
 * as graph entities; other crew are named in the description, and exact launch/
 * landing dates are omitted where not confidently sourced.
 */
type E = { n: number; period: string; commander: string; commanderSlug?: string; crewSlugs?: string[]; description: string };
const mk = (e: E): HsfRecord => ({
  id: `expedition:iss-expedition-${e.n}`, slug: `iss-expedition-${e.n}`, name: `ISS Expedition ${e.n}`, kind: "expedition",
  expeditionNumber: e.n, stationSlug: "international-space-station", launchVehicleSlug: "soyuz",
  operationalPeriod: e.period, commanderSlug: e.commanderSlug, crewSlugs: e.crewSlugs,
  role: `Commanded by ${e.commander}`, description: e.description, sources: ["nasa", "roscosmos"],
});

export const expeditions: HsfRecord[] = [
  mk({ n: 1, period: "2000–2001", commander: "William Shepherd", crewSlugs: ["sergei-krikalev"], description: "ISS Expedition 1 was the first resident crew of the International Space Station, beginning continuous human presence in orbit. The crew was William Shepherd, Yuri Gidzenko, and Sergei Krikalev." }),
  mk({ n: 2, period: "2001", commander: "Yury Usachev", description: "ISS Expedition 2 was the second resident crew, comprising Yury Usachev, Susan Helms, and James Voss." }),
  mk({ n: 3, period: "2001", commander: "Frank Culbertson", description: "ISS Expedition 3 was crewed by Frank Culbertson, Vladimir Dezhurov, and Mikhail Tyurin." }),
  mk({ n: 4, period: "2001–2002", commander: "Yury Onufrienko", description: "ISS Expedition 4 was crewed by Yury Onufrienko, Carl Walz, and Daniel Bursch." }),
  mk({ n: 5, period: "2002", commander: "Valery Korzun", crewSlugs: ["peggy-whitson"], description: "ISS Expedition 5 was crewed by Valery Korzun, Peggy Whitson, and Sergei Treschev." }),
  mk({ n: 6, period: "2002–2003", commander: "Kenneth Bowersox", description: "ISS Expedition 6 was crewed by Kenneth Bowersox, Nikolai Budarin, and Donald Pettit; the crew returned aboard a Soyuz after the Columbia accident grounded the Shuttle." }),
  mk({ n: 7, period: "2003", commander: "Yuri Malenchenko", description: "ISS Expedition 7, a two-person caretaker crew of Yuri Malenchenko and Edward Lu, kept the station operating after the Columbia accident." }),
  mk({ n: 8, period: "2003–2004", commander: "Michael Foale", description: "ISS Expedition 8 was a two-person crew of Michael Foale and Alexander Kaleri." }),
  mk({ n: 9, period: "2004", commander: "Gennady Padalka", commanderSlug: "gennady-padalka", description: "ISS Expedition 9 was crewed by Gennady Padalka and Michael Fincke." }),
  mk({ n: 10, period: "2004–2005", commander: "Leroy Chiao", description: "ISS Expedition 10 was a two-person crew of Leroy Chiao and Salizhan Sharipov." }),
];
