import type { DSCommRecord } from "@/knowledge-graph/data/deep-space-comms-catalog/types";

/**
 * NAVIGATION systems — the methods used to know where a spacecraft is and where it is
 * pointed. Radiometric tracking via the ground network, Delta-DOR, optical navigation,
 * and onboard attitude and autonomy systems. Each is linked to a signal band, an example
 * mission, or a related system; nothing is fabricated.
 */

const mk = (r: Omit<DSCommRecord, "kind" | "id"> & { slug: string }): DSCommRecord => ({
  ...r,
  kind: "navigation",
  id: `navigation_system:${r.slug}`,
  category: r.category ?? "navigation",
});

export const navigation: DSCommRecord[] = [
  mk({
    slug: "radiometric-navigation",
    name: "Radiometric Navigation",
    bandSlugs: ["x-band"],
    relatedKeys: ["tracking_network:deep-space-network"],
    description: "Measuring a spacecraft's distance and velocity from its radio signal — range from the round-trip signal time, and line-of-sight velocity from the Doppler shift. Combined over time from the ground stations, these fix a spacecraft's trajectory across the Solar System.",
    role: "Range and Doppler tracking from the ground network.",
    sources: ["nasa", "jpl"],
    highlights: ["Distance from signal time; velocity from Doppler shift"],
  }),
  mk({
    slug: "delta-dor",
    name: "Delta-DOR",
    altNames: ["Delta Differential One-way Ranging"],
    bandSlugs: ["x-band"],
    relatedKeys: ["tracking_network:deep-space-network"],
    description: "A precise angular-position technique: two widely separated stations record the spacecraft's signal and that of a distant quasar, and the tiny difference in arrival times pins down the spacecraft's position on the sky to a few nanoradians — vital for accurate planetary arrivals.",
    role: "Very-high-precision angular position using two stations and a quasar.",
    sources: ["nasa", "jpl", "esa"],
    highlights: ["Uses a quasar as a fixed reference for nanoradian accuracy"],
  }),
  mk({
    slug: "optical-navigation",
    name: "Optical Navigation",
    relatedKeys: ["space_mission:dart"],
    description: "Using a spacecraft's own camera images of a target body against the background stars to determine its position relative to that body — essential in the final approach to an asteroid, comet, or moon, where ground tracking alone is not precise enough.",
    role: "Onboard imaging of the target against the stars to refine approach.",
    sources: ["nasa", "jpl"],
  }),
  mk({
    slug: "autonomous-navigation",
    name: "Autonomous Navigation",
    altNames: ["AutoNav"],
    relatedKeys: ["space_mission:deep-space-1"],
    description: "Onboard software that processes optical-navigation images in real time and steers the spacecraft itself, without waiting for commands from Earth. It was pioneered by Deep Space 1 and used for terminal guidance in fast flybys and the DART impact.",
    role: "Real-time onboard navigation without waiting for Earth.",
    sources: ["nasa", "jpl"],
    highlights: ["Pioneered by Deep Space 1; guided the DART impact"],
  }),
  mk({
    slug: "star-tracker",
    name: "Star Tracker",
    relatedKeys: ["space_mission:new-horizons"],
    description: "A small camera that identifies star patterns to determine which way a spacecraft is pointed, to a fraction of an arcsecond. Star trackers give the precise attitude a spacecraft needs to aim its high-gain antenna at Earth and its instruments at a target.",
    role: "Determining spacecraft attitude from star patterns.",
    sources: ["nasa", "jpl"],
  }),
  mk({
    slug: "inertial-navigation",
    name: "Inertial Navigation",
    altNames: ["IMU"],
    relatedKeys: ["space_mission:cassini-huygens"],
    description: "Gyroscopes and accelerometers in an inertial measurement unit that sense a spacecraft's rotation and acceleration, propagating its orientation between star-tracker updates and through manoeuvres when other references are unavailable.",
    role: "Sensing rotation and acceleration to propagate attitude.",
    sources: ["nasa", "jpl"],
  }),
  mk({
    slug: "deep-space-atomic-clock",
    name: "Deep Space Atomic Clock",
    altNames: ["DSAC"],
    relatedKeys: ["time_standard:tai"],
    description: "A miniaturised, ultra-stable atomic clock small enough to fly on a spacecraft. By putting precise timekeeping onboard, it enables one-way radiometric navigation — the spacecraft can determine its own position without the round-trip to a ground clock — a technology demonstrated in Earth orbit.",
    role: "Onboard atomic timekeeping to enable one-way navigation.",
    sources: ["nasa", "jpl"],
    highlights: ["Enables one-way deep-space navigation"],
  }),
];
