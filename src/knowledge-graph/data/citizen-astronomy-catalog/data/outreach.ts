import type { CitizenRecord } from "@/knowledge-graph/data/citizen-astronomy-catalog/types";

/** Public-outreach activities — how astronomy reaches everyone. Each links to the reused archive
 *  and observatory and to the activities and other outreach it connects to. */
const out = (r: Omit<CitizenRecord, "kind" | "id" | "sources"> & { slug: string; sources?: CitizenRecord["sources"] }): CitizenRecord => ({ sources: ["nasa"], ...r, kind: "outreach", id: `outreach_activity:${r.slug}` });

export const outreach: CitizenRecord[] = [
  out({ slug: "star-party", name: "Star Party", relatedKeys: ["amateur_activity:backyard-observing", "outreach_activity:dark-sky-park"], description: "A gathering where amateur astronomers bring their telescopes to share the sky — with each other and with the public. From a few people in a car park to thousands under a desert sky, star parties are the social heart of the hobby and many people's first look through a telescope.", sources: ["nasa"], highlights: ["Many people's first look through a telescope"] }),
  out({ slug: "public-observatory", name: "Public Observatory", relatedKeys: ["outreach_activity:astronomy-education"], description: "An observatory open to the public for viewing nights, talks, and hands-on astronomy — often run by universities, clubs, or planetariums. It gives people a chance to look through a real research-grade telescope and meet the people who use them.", sources: ["nasa"] }),
  out({ slug: "dark-sky-park", name: "Dark-Sky Park", relatedKeys: ["outreach_activity:star-party"], description: "A place formally protected for the darkness of its night sky, kept free of light pollution and certified by DarkSky International. Dark-sky parks preserve the vanishing experience of a truly dark sky — and protect the wildlife and human health that artificial light disrupts.", sources: ["nasa"], highlights: ["Protecting the vanishing dark sky"] }),
  out({ slug: "astronomy-education", name: "Astronomy Education", relatedKeys: ["data_archive:mast", "observatory:vera-rubin-observatory"], description: "Teaching and public engagement with astronomy — in classrooms, planetariums, science centres, and online — that turns a glance at the stars into understanding. Modern education draws directly on open data archives and survey imagery, letting anyone explore real observations.", sources: ["nasa"] }),
];
