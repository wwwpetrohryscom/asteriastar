import type { MinorBodyRecord } from "@/knowledge-graph/data/asteroids-catalog/types";
import type { SourceKey } from "@/lib/sources";

/**
 * Trojan populations — minor planets sharing a planet's orbit, librating around the
 * L4 (leading) and L5 (trailing) Lagrange points in a 1:1 resonance with the planet.
 * Each group links to its members and/or its orbital_resonance.
 */
type T = { slug: string; name: string; lagrange?: "L4" | "L5"; resonance?: string; sources?: SourceKey[]; description: string };
const mk = (t: T): MinorBodyRecord => ({
  id: `trojan_group:${t.slug}`,
  slug: t.slug,
  name: t.name,
  kind: "trojan-group",
  description: t.description,
  sources: t.sources ?? ["nasa", "jpl"],
  category: "trojan",
  lagrangePoint: t.lagrange,
  resonanceSlug: t.resonance,
});

export const trojans: MinorBodyRecord[] = [
  mk({ slug: "jupiter-trojans", name: "Jupiter Trojans", resonance: "jupiter-1-1", description: "The vast swarm of asteroids sharing Jupiter's orbit in a 1:1 resonance, split between the leading Greek camp and the trailing Trojan camp — the target population of NASA's Lucy mission." }),
  mk({ slug: "greek-camp", name: "Greek Camp (L4)", lagrange: "L4", description: "The Jupiter Trojans leading the planet at the L4 Lagrange point, traditionally named after Greek heroes of the Trojan War — led by 588 Achilles." }),
  mk({ slug: "trojan-camp", name: "Trojan Camp (L5)", lagrange: "L5", description: "The Jupiter Trojans trailing the planet at the L5 Lagrange point, traditionally named after Trojan heroes — including the binary 617 Patroclus." }),
  mk({ slug: "neptune-trojans", name: "Neptune Trojans", resonance: "neptune-1-1", description: "Minor planets sharing Neptune's orbit in a 1:1 resonance at its L4 and L5 points — a population thought to rival the Jupiter Trojans in number." }),
];
