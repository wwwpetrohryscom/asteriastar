import type { DSCommRecord } from "@/knowledge-graph/data/deep-space-comms-catalog/types";

/**
 * COMMUNICATION SYSTEMS — the relay and end-to-end systems, including the optical
 * demonstrations that are the frontier of deep-space communication and the telemetry,
 * tracking, and command architecture that underlies every mission.
 */

const mk = (r: Omit<DSCommRecord, "kind" | "id"> & { slug: string }): DSCommRecord => ({
  ...r,
  kind: "comm-system",
  id: `communication_system:${r.slug}`,
  category: r.category ?? "signal",
});

export const systems: DSCommRecord[] = [
  mk({
    slug: "dsoc",
    name: "Deep Space Optical Communications (DSOC)",
    category: "optical",
    altNames: ["DSOC"],
    bandSlugs: ["optical"],
    relatedKeys: ["space_mission:psyche"],
    description: "NASA's technology demonstration of laser communication from deep space, flying as a rider on the Psyche spacecraft. It transmitted data over tens of millions of kilometres at rates far beyond radio, proving optical links for future missions.",
    role: "Deep-space laser-communication technology demonstration.",
    sources: ["nasa", "jpl"],
    highlights: ["First deep-space optical-communication demonstration", "Flew on Psyche"],
  }),
  mk({
    slug: "lcrd",
    name: "Laser Communications Relay Demonstration (LCRD)",
    category: "optical",
    altNames: ["LCRD"],
    bandSlugs: ["optical"],
    networkKey: "tracking_network:near-space-network",
    description: "A NASA optical-communication relay in geostationary orbit that demonstrates two-way laser links between ground stations and spacecraft, a stepping stone toward operational optical relays in the Near Space Network.",
    role: "Geostationary optical-communication relay demonstration.",
    sources: ["nasa"],
  }),
  mk({
    slug: "tdrs",
    name: "Tracking and Data Relay Satellite System (TDRS)",
    category: "near-earth",
    altNames: ["TDRS", "Space Network"],
    bandSlugs: ["s-band", "ka-band"],
    networkKey: "tracking_network:near-space-network",
    description: "A fleet of geostationary relay satellites that give near-Earth spacecraft — including the ISS and Hubble — near-continuous contact with the ground, instead of only during the few minutes of a ground-station pass. TDRS is the space-based half of NASA's Near Space Network.",
    role: "Geostationary relay for continuous near-Earth communication.",
    sources: ["nasa"],
    highlights: ["Near-continuous contact for the ISS and Hubble"],
  }),
  mk({
    slug: "telemetry-tracking-command",
    name: "Telemetry, Tracking & Command (TT&C)",
    altNames: ["TT&C"],
    bandSlugs: ["s-band", "x-band"],
    relatedKeys: ["tracking_network:deep-space-network"],
    description: "The end-to-end function every mission depends on: downlinking telemetry (spacecraft health and science), measuring the signal for tracking and navigation, and uplinking commands. The deep-space and near-Earth networks exist to provide TT&C.",
    role: "The core downlink-telemetry, tracking, and uplink-command function.",
    sources: ["nasa", "jpl"],
  }),
];
