import type { MeteoriteRecord } from "@/knowledge-graph/data/meteorites-catalog/types";
import type { SourceKey } from "@/lib/sources";

/**
 * Fireballs — exceptionally bright meteors, and bolides (those that detonate in the
 * atmosphere). The Chelyabinsk and Tunguska events are REUSED from the impact_event
 * entities (Program Y) rather than duplicated; only fireballs not already modelled are
 * created here. Each is linked to Earth, and to any recovered meteorite.
 */
type F = { slug: string; name: string; date?: string; location?: string; energy?: string; bolide?: boolean; related?: string[]; sources?: SourceKey[]; description: string };
const mk = (f: F): MeteoriteRecord => ({
  id: `fireball:${f.slug}`,
  slug: f.slug,
  name: f.name,
  kind: "fireball",
  description: f.description,
  sources: f.sources ?? ["nasa"],
  category: "fireball",
  fallDate: f.date,
  location: f.location,
  energyLabel: f.energy,
  bolide: f.bolide,
  relatedKeys: f.related,
});

export const fireballs: MeteoriteRecord[] = [
  mk({ slug: "peekskill-fireball", name: "Peekskill Fireball", date: "1992-10-09", location: "eastern United States", bolide: true, sources: ["nasa"], description: "A brilliant green fireball that crossed the eastern United States in October 1992, filmed by at least 16 people, before a fragment struck a parked car in Peekskill, New York — one of the best-documented fireball-to-meteorite events." }),
  mk({ slug: "bering-sea-fireball", name: "Bering Sea Fireball", date: "2018-12-18", location: "Bering Sea", energy: "~ 173 kt TNT", bolide: true, related: ["planet:earth"], sources: ["nasa"], description: "A powerful bolide that exploded over the Bering Sea in December 2018 with roughly ten times the energy of the Hiroshima bomb — the largest airburst since Chelyabinsk, unnoticed at the time because it occurred over the remote ocean." }),
];
