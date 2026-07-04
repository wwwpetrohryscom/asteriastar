import type { DSCommRecord } from "@/knowledge-graph/data/deep-space-comms-catalog/types";

/**
 * TIME STANDARDS — the timescales and clocks that let ground stations and spacecraft agree
 * on when things happen, which is what makes ranging, Doppler, and event timing possible.
 */

const mk = (r: Omit<DSCommRecord, "kind" | "id"> & { slug: string }): DSCommRecord => ({
  ...r,
  kind: "time-standard",
  id: `time_standard:${r.slug}`,
  category: r.category ?? "timing",
});

export const standards: DSCommRecord[] = [
  mk({
    slug: "tai",
    name: "International Atomic Time (TAI)",
    altNames: ["TAI"],
    description: "A continuous atomic timescale kept by hundreds of atomic clocks worldwide — the stable foundation from which civil time is derived. TAI never inserts leap seconds, making it ideal for measuring precise intervals.",
    role: "The underlying continuous atomic timescale.",
    sources: ["nasa"],
  }),
  mk({
    slug: "utc",
    name: "Coordinated Universal Time (UTC)",
    altNames: ["UTC"],
    relatedKeys: ["time_standard:tai", "tracking_network:deep-space-network"],
    description: "The civil time standard, derived from International Atomic Time but kept within a second of the Earth's rotation by occasional leap seconds. Deep-space tracking tags its measurements in UTC.",
    role: "The civil time standard used to tag tracking data.",
    sources: ["nasa"],
  }),
  mk({
    slug: "gps-time",
    name: "GPS Time",
    relatedKeys: ["time_standard:tai"],
    description: "The continuous timescale of the Global Positioning System, offset from TAI by a fixed number of seconds and widely used to synchronise ground equipment.",
    role: "A continuous satellite-navigation timescale for synchronisation.",
    sources: ["nasa"],
  }),
  mk({
    slug: "spacecraft-clock",
    name: "Spacecraft Clock (SCLK)",
    altNames: ["SCLK"],
    relatedKeys: ["tracking_network:deep-space-network"],
    description: "The onboard counter that timestamps a spacecraft's data. Because it drifts relative to ground time, mission teams maintain a correlation (SCLK-to-ground time) using the tracking network so that events can be placed on a common timescale.",
    role: "The onboard clock, correlated to ground time via the network.",
    sources: ["nasa", "jpl"],
  }),
];
