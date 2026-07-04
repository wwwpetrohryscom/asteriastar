import { engine } from "@/platform/data-engine";
import type { TimelineRecord } from "@/knowledge-graph/data/spaceflight-history-catalog/types";

/** Engine-driven discovery hubs for the Space Missions Timeline & Historical Events Encyclopedia. */
export interface TimelineDiscovery {
  slug: string;
  title: string;
  description: string;
  get: () => TimelineRecord[];
}

const e = engine.spaceflightHistory;

export const TIMELINE_DISCOVERIES: TimelineDiscovery[] = [
  { slug: "master-timeline", title: "The Master Timeline", description: "Every landmark event of spaceflight, from Sputnik to Artemis, in chronological order.", get: () => e.timeline() },
  { slug: "eras", title: "Eras of Spaceflight", description: "The great periods of the space age — the Space Race, the golden age of planetary exploration, the Shuttle and ISS eras, and beyond.", get: () => e.eras() },
  { slug: "firsts-and-milestones", title: "Firsts & Milestones", description: "The milestone achievements — the first satellite, the first human in space, the first Moon landing, and more.", get: () => e.milestones() },
  { slug: "records", title: "Records", description: "The standing records of spaceflight — the most distant, fastest, and longest-lived of humanity's craft and crews.", get: () => e.recordsList() },
  { slug: "human-spaceflight-history", title: "Human Spaceflight History", description: "The crewed milestones — first flights, spacewalks, and space stations.", get: () => [...e.byCategory("crewed"), ...e.byCategory("spacewalk"), ...e.byCategory("station")].sort((a, b) => (a.year ?? 0) - (b.year ?? 0)) },
  { slug: "robotic-exploration-history", title: "Robotic Exploration History", description: "The great robotic firsts — flybys, orbiters, landers, aircraft, and the missions that returned samples.", get: () => [...e.byCategory("flyby"), ...e.byCategory("orbit"), ...e.byCategory("landing"), ...e.byCategory("sample-return"), ...e.byCategory("flight")].sort((a, b) => (a.year ?? 0) - (b.year ?? 0)) },
];

const BY_SLUG = new Map(TIMELINE_DISCOVERIES.map((d) => [d.slug, d]));
export function getTimelineDiscovery(slug: string): TimelineDiscovery | undefined {
  return BY_SLUG.get(slug);
}
