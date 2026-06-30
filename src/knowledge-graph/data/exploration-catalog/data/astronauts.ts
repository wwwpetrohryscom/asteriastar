import type { ExplorationRecord } from "@/knowledge-graph/data/exploration-catalog/types";

/** Astronauts, cosmonauts, and taikonauts. Crewed missions link to them via crew. */
type A = { slug: string; name: string; nationality: string; agencySlug?: string; bornYear?: string; firstFlight?: string; notableFor: string; sources?: ExplorationRecord["sources"] };
const mk = (a: A): ExplorationRecord => ({
  id: `astronaut:${a.slug}`, slug: a.slug, name: a.name, kind: "astronaut", nationality: a.nationality,
  agencySlug: a.agencySlug, bornYear: a.bornYear, firstFlight: a.firstFlight, notableFor: a.notableFor,
  description: `${a.name} — ${a.notableFor}.`, sources: a.sources ?? ["nasa"],
});

export const astronauts: ExplorationRecord[] = [
  mk({ slug: "yuri-gagarin", name: "Yuri Gagarin", nationality: "Soviet Union", agencySlug: "roscosmos", bornYear: "1934", firstFlight: "1961", notableFor: "the first human to journey into outer space and orbit the Earth, aboard Vostok 1", sources: ["roscosmos"] }),
  mk({ slug: "alan-shepard", name: "Alan Shepard", nationality: "United States", agencySlug: "nasa", bornYear: "1923", firstFlight: "1961", notableFor: "the first American in space and later commander of Apollo 14, who walked on the Moon" }),
  mk({ slug: "john-glenn", name: "John Glenn", nationality: "United States", agencySlug: "nasa", bornYear: "1921", firstFlight: "1962", notableFor: "the first American to orbit the Earth, aboard Friendship 7" }),
  mk({ slug: "valentina-tereshkova", name: "Valentina Tereshkova", nationality: "Soviet Union", agencySlug: "roscosmos", bornYear: "1937", firstFlight: "1963", notableFor: "the first woman to fly in space, aboard Vostok 6", sources: ["roscosmos"] }),
  mk({ slug: "alexei-leonov", name: "Alexei Leonov", nationality: "Soviet Union", agencySlug: "roscosmos", bornYear: "1934", firstFlight: "1965", notableFor: "the first person to perform a spacewalk, during Voskhod 2", sources: ["roscosmos"] }),
  mk({ slug: "frank-borman", name: "Frank Borman", nationality: "United States", agencySlug: "nasa", bornYear: "1928", firstFlight: "1965", notableFor: "commander of Apollo 8, the first crewed mission to orbit the Moon" }),
  mk({ slug: "jim-lovell", name: "Jim Lovell", nationality: "United States", agencySlug: "nasa", bornYear: "1928", firstFlight: "1965", notableFor: "commander of Apollo 13 and a crew member of Apollo 8" }),
  mk({ slug: "william-anders", name: "William Anders", nationality: "United States", agencySlug: "nasa", bornYear: "1933", firstFlight: "1968", notableFor: "the Apollo 8 astronaut who photographed the iconic 'Earthrise'" }),
  mk({ slug: "neil-armstrong", name: "Neil Armstrong", nationality: "United States", agencySlug: "nasa", bornYear: "1930", firstFlight: "1966", notableFor: "the first person to walk on the Moon, as commander of Apollo 11" }),
  mk({ slug: "buzz-aldrin", name: "Buzz Aldrin", nationality: "United States", agencySlug: "nasa", bornYear: "1930", firstFlight: "1966", notableFor: "the second person to walk on the Moon, the lunar module pilot of Apollo 11" }),
  mk({ slug: "michael-collins", name: "Michael Collins", nationality: "United States", agencySlug: "nasa", bornYear: "1930", firstFlight: "1966", notableFor: "the Apollo 11 command module pilot who orbited the Moon during the first landing" }),
  mk({ slug: "eugene-cernan", name: "Eugene Cernan", nationality: "United States", agencySlug: "nasa", bornYear: "1934", firstFlight: "1966", notableFor: "the commander of Apollo 17 and the last person to walk on the Moon" }),
  mk({ slug: "harrison-schmitt", name: "Harrison Schmitt", nationality: "United States", agencySlug: "nasa", bornYear: "1935", firstFlight: "1972", notableFor: "a geologist on Apollo 17, the first scientist to walk on the Moon" }),
  mk({ slug: "sally-ride", name: "Sally Ride", nationality: "United States", agencySlug: "nasa", bornYear: "1951", firstFlight: "1983", notableFor: "the first American woman in space" }),
  mk({ slug: "mae-jemison", name: "Mae Jemison", nationality: "United States", agencySlug: "nasa", bornYear: "1956", firstFlight: "1992", notableFor: "the first Black woman to travel into space, aboard the Space Shuttle" }),
  mk({ slug: "rakesh-sharma", name: "Rakesh Sharma", nationality: "India", agencySlug: "isro", bornYear: "1949", firstFlight: "1984", notableFor: "the first Indian citizen to travel to space, aboard Soyuz T-11", sources: ["isro"] }),
  mk({ slug: "yang-liwei", name: "Yang Liwei", nationality: "China", agencySlug: "cnsa", bornYear: "1965", firstFlight: "2003", notableFor: "the first Chinese astronaut (taikonaut) in space, aboard Shenzhou 5" }),
  mk({ slug: "chris-hadfield", name: "Chris Hadfield", nationality: "Canada", agencySlug: "csa", bornYear: "1959", firstFlight: "1995", notableFor: "a Canadian astronaut and ISS commander known for sharing life in orbit with the public", sources: ["csa"] }),
  mk({ slug: "peggy-whitson", name: "Peggy Whitson", nationality: "United States", agencySlug: "nasa", bornYear: "1960", firstFlight: "2002", notableFor: "the first woman to command the ISS and holder of the US record for cumulative time in space" }),
];
