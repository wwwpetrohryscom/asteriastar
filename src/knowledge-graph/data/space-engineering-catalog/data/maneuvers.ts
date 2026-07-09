import { eng, type EngRecord } from "@/knowledge-graph/data/space-engineering-catalog/types";

/** Flight-maneuver & GNC-method concepts (space_engineering_concept), reusing docking/nav/EDL/ops hardware. */
export const maneuvers: EngRecord[] = [
  eng("maneuver", {
    slug: "orbital-rendezvous",
    name: "Orbital Rendezvous",
    description:
      "The guided approach of two spacecraft to the same orbit and position so they can dock or berth — a delicate dance governed by orbital mechanics, where firing to speed up raises the orbit and paradoxically slows the chase down on a target ahead, while slowing down drops into a lower, faster orbit that catches up. First achieved by Gemini in 1965, rendezvous is the foundation of space-station crew and cargo flights and of in-space assembly.",
    relatedKeys: ["space_engineering_concept:station-keeping", "docking_system:idss", "navigation_system:autonomous-navigation"],
    highlights: ["The orbital-mechanics dance before docking"],
  }),
  eng("maneuver", {
    slug: "station-keeping",
    name: "Station-Keeping",
    description:
      "The small, regular maneuvers that hold a spacecraft in its intended orbit or slot against perturbations — atmospheric drag, the Moon and Sun's pull, and the Earth's uneven gravity. Geostationary satellites, for instance, must be nudged north–south and east–west to stay on station, a task increasingly handed to efficient electric thrusters.",
    relatedKeys: ["operations_function:flight-dynamics", "spacecraft_component:reaction-control-system", "space_engineering_concept:electric-propulsion"],
    highlights: ["Nudging a satellite to hold its slot"],
  }),
  eng("maneuver", {
    slug: "aerobraking",
    name: "Aerobraking",
    description:
      "Using repeated shallow passes through the upper fringe of a planet's atmosphere to shed orbital energy through drag, gradually shrinking a large capture orbit into the desired one — trading time for a large saving in propellant. NASA's Mars orbiters, including Mars Global Surveyor and Mars Reconnaissance Orbiter, used months of aerobraking to reach their science orbits.",
    relatedKeys: ["space_engineering_concept:aerocapture", "space_engineering_concept:delta-v-budget"],
    highlights: ["Trimming an orbit with atmospheric drag to save propellant"],
  }),
  eng("maneuver", {
    slug: "aerocapture",
    name: "Aerocapture",
    description:
      "A single, deep pass through a planet's atmosphere to slow a spacecraft enough for orbital capture in one stroke, behind a heat shield — far faster than aerobraking but far more demanding, requiring precise guidance and thermal protection. It has been studied and validated in analysis but has not yet been used on a planetary mission.",
    relatedKeys: ["space_engineering_concept:aerobraking", "spacecraft_component:heat-shield", "spacecraft_subsystem:entry-descent-and-landing"],
    highlights: ["One atmospheric pass to capture — studied, not yet flown"],
  }),
  eng("maneuver", {
    slug: "gravity-turn",
    name: "Gravity-Turn Ascent",
    description:
      "The efficient launch trajectory in which a rocket pitches over slightly after liftoff and then lets gravity gradually bend its path toward the horizontal, keeping the vehicle aligned with its velocity to minimise aerodynamic loads and steering losses. Nearly every orbital launch follows a gravity-turn profile from the pad to orbit.",
    relatedKeys: ["space_engineering_concept:rocket-staging", "space_engineering_concept:thrust-vector-control"],
    highlights: ["Letting gravity bend the ascent toward orbit"],
  }),
];
