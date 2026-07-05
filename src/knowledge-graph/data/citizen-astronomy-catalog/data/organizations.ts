import type { CitizenRecord } from "@/knowledge-graph/data/citizen-astronomy-catalog/types";

/** Amateur-astronomy organisations — created with the EXISTING organization type. Each coordinates
 *  a field of amateur observation and links to the activities it supports. */
const org = (r: Omit<CitizenRecord, "kind" | "id" | "sources"> & { slug: string; sources?: CitizenRecord["sources"] }): CitizenRecord => ({ sources: ["nasa"], ...r, kind: "organization", id: `organization:${r.slug}` });

export const organizations: CitizenRecord[] = [
  org({ slug: "aavso", name: "AAVSO", altNames: ["American Association of Variable Star Observers"], relatedKeys: ["amateur_activity:variable-star-observing", "astronomy_method:photometry"], description: "The American Association of Variable Star Observers — for more than a century, the organisation that gathers variable-star observations from amateurs worldwide into a single database that professional astronomers draw on. The model for how amateur and professional astronomy work together.", sources: ["nasa"], highlights: ["A century of amateur observations professionals use"] }),
  org({ slug: "international-meteor-organization", name: "International Meteor Organization", altNames: ["IMO"], relatedKeys: ["amateur_activity:meteor-observing"], description: "The global body that coordinates amateur meteor observation, collecting counts from observers around the world to measure the strength and structure of meteor showers and to study the streams of debris that cause them.", sources: ["nasa"] }),
  org({ slug: "alpo", name: "ALPO", altNames: ["Association of Lunar and Planetary Observers"], relatedKeys: ["amateur_activity:asteroid-observing", "amateur_activity:comet-observing"], description: "The Association of Lunar and Planetary Observers, which coordinates amateur observation of the Moon, the planets, comets, and asteroids — organising observing programmes and archiving the results so that amateur monitoring of the Solar System adds up to something lasting.", sources: ["nasa"] }),
];
