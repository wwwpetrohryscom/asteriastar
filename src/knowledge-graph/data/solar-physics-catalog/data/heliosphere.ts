import { solar, type SolarRecord } from "@/knowledge-graph/data/solar-physics-catalog/types";

/** Structures of the heliosphere (heliosphere_structure) — the bubble the solar wind carves in the
 *  interstellar medium. Reuses the existing heliosphere/heliopause phenomena and the Voyager spacecraft. */
export const heliosphere: SolarRecord[] = [
  solar("heliosphere", {
    slug: "parker-spiral",
    name: "The Parker Spiral",
    altNames: ["Interplanetary magnetic field"],
    description:
      "The spiral shape the Sun's magnetic field takes as it is carried outward by the solar wind while the Sun rotates, like water from a spinning sprinkler. Predicted by Eugene Parker in 1958 and since confirmed by spacecraft, the Parker spiral sets the geometry of the interplanetary magnetic field and how solar storms reach the planets.",
    sources: ["nasa"],
    relatedKeys: ["star:sun", "space_weather_phenomenon:solar-wind", "space_mission:parker-solar-probe", "stellar_physics_concept:fast-solar-wind"],
    highlights: ["Parker's 1958 spiral — the shape of the interplanetary field"],
  }),
  solar("heliosphere", {
    slug: "termination-shock",
    name: "The Termination Shock",
    symbolLabel: "~85–95 AU",
    description:
      "The boundary where the supersonic solar wind abruptly slows as it runs into the pressure of the interstellar medium, roughly ninety astronomical units from the Sun. Voyager 1 crossed it in 2004 and Voyager 2 in 2007 — the first direct measurements of this shock.",
    relatedKeys: ["star:sun", "space_weather_phenomenon:heliosphere", "heliosphere_structure:heliosheath", "space_mission:voyager-1", "space_mission:voyager-2"],
    highlights: ["Where the solar wind goes subsonic — crossed by both Voyagers"],
  }),
  solar("heliosphere", {
    slug: "heliosheath",
    name: "The Heliosheath",
    description:
      "The turbulent outer region of the heliosphere, between the termination shock and the heliopause, where the slowed solar wind piles up and is deflected by the interstellar medium. Both Voyager spacecraft spent years traversing it before reaching interstellar space.",
    relatedKeys: ["star:sun", "space_weather_phenomenon:heliosphere", "space_weather_phenomenon:heliopause", "heliosphere_structure:termination-shock", "space_mission:voyager-1", "space_mission:voyager-2"],
    highlights: ["The piled-up, deflected solar wind past the shock"],
  }),
  solar("heliosphere", {
    slug: "heliospheric-bow-wave",
    name: "The Heliospheric Bow Wave",
    altNames: ["Bow wave"],
    description:
      "The disturbance ahead of the heliosphere as it moves through the surrounding interstellar cloud. Earlier work expected a sharp bow shock, but measurements from IBEX and the Voyagers suggest the Sun moves too slowly through the local medium for a strong shock — a gentler bow wave instead. The exact nature of the boundary is still being studied.",
    relatedKeys: ["star:sun", "space_weather_phenomenon:heliosphere", "space_weather_phenomenon:heliopause"],
    highlights: ["Likely a gentle bow wave, not a strong bow shock"],
  }),
];
