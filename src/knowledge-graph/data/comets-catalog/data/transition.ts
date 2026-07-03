import type { CometKind, CometRecord } from "@/knowledge-graph/data/comets-catalog/types";
import type { SourceKey } from "@/lib/sources";

/**
 * Transition objects that blur the asteroid–comet boundary: active asteroids (which
 * orbit like asteroids but show comet-like activity) and dormant comets (extinct
 * cometary nuclei on comet-like orbits). Modelled as first-class entities of the new
 * active_asteroid / dormant_comet types; Chiron — both a Centaur and a comet — is
 * REUSED from Program Y (asteroid:chiron) and linked, not recreated.
 */
type T = {
  slug: string;
  name: string;
  kind: Extract<CometKind, "active-asteroid" | "dormant-comet">;
  designation?: string;
  discoveredBy?: string;
  discoveryYear?: string;
  diameterKm?: number;
  classes?: string[];
  showers?: string[];
  related?: string[];
  sources?: SourceKey[];
  alt?: string[];
  description: string;
};
const mk = (t: T): CometRecord => ({
  id: `${t.kind === "active-asteroid" ? "active_asteroid" : "dormant_comet"}:${t.slug}`,
  slug: t.slug,
  name: t.name,
  kind: t.kind,
  altNames: t.alt,
  description: t.description,
  sources: t.sources ?? ["nasa", "jpl"],
  category: "transition",
  designation: t.designation,
  discoveredBy: t.discoveredBy,
  discoveryYear: t.discoveryYear,
  nucleusDiameterKm: t.diameterKm,
  classSlugs: t.classes,
  meteorShowerIds: t.showers,
  relatedKeys: t.related,
});

export const transition: CometRecord[] = [
  // Active asteroids
  mk({ slug: "phaethon", name: "3200 Phaethon", kind: "active-asteroid", designation: "(3200) Phaethon", discoveredBy: "IRAS (Simon Green, John Davies)", discoveryYear: "1983", diameterKm: 5.4, showers: ["meteor_shower:geminids"], sources: ["nasa", "jpl"], description: "A near-Earth asteroid that brightens and sheds dust as it passes very close to the Sun — a 'rock comet' — and the parent body of the Geminid meteor shower, unusual for a shower whose source is an asteroid rather than a comet." }),
  mk({ slug: "elst-pizarro", name: "7968 Elst–Pizarro", kind: "active-asteroid", designation: "(7968) Elst–Pizarro", discoveredBy: "Eric Elst, Guido Pizarro", discoveryYear: "1996", classes: ["main-belt-comet"], sources: ["nasa", "jpl"], alt: ["133P/Elst–Pizarro"], description: "The prototype main-belt comet — an object on an ordinary asteroid-belt orbit that repeatedly develops a comet-like tail, carrying both an asteroid number and a comet designation." }),

  // Dormant comets
  mk({ slug: "don-quixote", name: "3552 Don Quixote", kind: "dormant-comet", designation: "(3552) Don Quixote", discoveredBy: "Paul Wild", discoveryYear: "1983", diameterKm: 19, classes: ["jupiter-family"], sources: ["nasa", "jpl"], description: "A large near-Earth object on a comet-like orbit long suspected to be a dormant comet; faint carbon-dioxide activity was detected in 2013, suggesting it is not fully extinct." }),
  mk({ slug: "2003-eh1", name: "(196256) 2003 EH1", kind: "dormant-comet", designation: "(196256) 2003 EH1", discoveredBy: "Lowell Observatory (LONEOS)", discoveryYear: "2003", showers: ["meteor_shower:quadrantids"], sources: ["nasa", "jpl"], description: "An asteroid on a short-period, comet-like orbit believed to be a dormant or extinct comet nucleus — the parent body of the sharp, brief Quadrantid meteor shower." }),
];
