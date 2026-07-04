import type { DSCommRecord } from "@/knowledge-graph/data/deep-space-comms-catalog/types";

/**
 * ANTENNA classes — the ground dishes and spacecraft antennas that carry deep-space
 * signals. Ground antennas are located_at a representative station; spacecraft antennas
 * are linked to a signal band and, where notable, an example mission. Diameters and gains
 * are stated only where reliably known.
 */

const mk = (r: Omit<DSCommRecord, "kind" | "id"> & { slug: string }): DSCommRecord => ({
  ...r,
  kind: "antenna",
  id: `antenna:${r.slug}`,
  category: r.category ?? "deep-space",
});

export const antennas: DSCommRecord[] = [
  mk({
    slug: "seventy-metre",
    name: "70-metre Antenna",
    diameterLabel: "70 m",
    stationKey: "tracking_station:goldstone",
    bandSlugs: ["s-band", "x-band"],
    description: "The largest and most sensitive dishes of the Deep Space Network — one at each complex (Goldstone, Madrid, Canberra). Their huge collecting area is reserved for the most distant or weakest spacecraft, such as the Voyagers, and for radar astronomy.",
    role: "Highest-sensitivity reception for the most distant spacecraft.",
    sources: ["nasa", "jpl"],
    highlights: ["The DSN's most sensitive antennas"],
  }),
  mk({
    slug: "thirty-four-metre-beam-waveguide",
    name: "34-metre Beam-Waveguide Antenna",
    altNames: ["34 m BWG"],
    diameterLabel: "34 m",
    stationKey: "tracking_station:goldstone",
    bandSlugs: ["x-band", "ka-band"],
    description: "The modern workhorse antennas of the Deep Space Network. A beam-waveguide design routes the signal through mirrors to equipment in a shielded room below, allowing several to be arrayed and supporting X- and Ka-band.",
    role: "The DSN's modern multi-band workhorse; arrayable.",
    sources: ["nasa", "jpl"],
  }),
  mk({
    slug: "thirty-four-metre-high-efficiency",
    name: "34-metre High-Efficiency Antenna",
    altNames: ["34 m HEF"],
    diameterLabel: "34 m",
    stationKey: "tracking_station:madrid",
    bandSlugs: ["x-band"],
    description: "An earlier generation of 34 m Deep Space Network antenna with the feed at the dish, being gradually retired in favour of the beam-waveguide design.",
    role: "Earlier-generation 34 m antenna.",
    sources: ["nasa", "jpl"],
  }),
  mk({
    slug: "phased-array",
    name: "Phased-Array Antenna",
    bandSlugs: ["x-band"],
    description: "Instead of one large dish, many smaller antennas whose signals are combined electronically to act as a single larger aperture. Arraying is a future direction for the Deep Space Network, offering flexible, scalable collecting area.",
    role: "Combining many antennas into one large virtual aperture (a future DSN direction).",
    sources: ["nasa", "jpl"],
  }),
  mk({
    slug: "spacecraft-high-gain",
    name: "High-Gain Antenna (Spacecraft)",
    altNames: ["HGA"],
    bandSlugs: ["x-band"],
    relatedKeys: ["space_mission:voyager-1"],
    description: "The main dish on a spacecraft, which focuses its signal into a narrow, high-gain beam that must be pointed accurately at Earth. It carries the high-rate science downlink — for example Voyager's 3.7 m dish.",
    role: "The spacecraft's narrow-beam, high-rate downlink antenna.",
    sources: ["nasa", "jpl"],
  }),
  mk({
    slug: "spacecraft-medium-gain",
    name: "Medium-Gain Antenna (Spacecraft)",
    altNames: ["MGA"],
    bandSlugs: ["x-band"],
    description: "A spacecraft antenna with a broader beam than the high-gain dish, trading data rate for easier pointing — useful during manoeuvres or as a backup.",
    role: "A broader-beam spacecraft antenna, easier to point.",
    sources: ["nasa", "jpl"],
  }),
  mk({
    slug: "spacecraft-low-gain",
    name: "Low-Gain Antenna (Spacecraft)",
    altNames: ["LGA"],
    bandSlugs: ["s-band", "uhf"],
    description: "A near-omnidirectional spacecraft antenna that needs no accurate pointing, used for command and low-rate telemetry — the safety-net link that works even when a spacecraft has lost attitude control.",
    role: "Omnidirectional, low-rate safety-net link.",
    sources: ["nasa", "jpl"],
  }),
  mk({
    slug: "laser-communication-terminal",
    name: "Laser Communication Terminal",
    category: "optical",
    bandSlugs: ["optical"],
    relatedKeys: ["space_mission:psyche"],
    description: "An optical (laser) communication terminal that transmits data on an infrared beam rather than radio. NASA's Deep Space Optical Communications terminal flew on the Psyche spacecraft and set deep-space data-rate records.",
    role: "Transmits data by laser for very high rates.",
    sources: ["nasa", "jpl"],
    highlights: ["Flew on Psyche as the DSOC terminal"],
  }),
];
