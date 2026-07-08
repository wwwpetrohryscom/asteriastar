import { solar, type SolarRecord } from "@/knowledge-graph/data/solar-physics-catalog/types";

/** Solar-physics processes, solar-cycle concepts, and solar-wind regimes (stellar_physics_concept). Only
 *  well-established solar physics is stated; open questions are flagged, and nothing is fabricated. */
export const dynamics: SolarRecord[] = [
  // ---- Physics / processes ----
  solar("physics", {
    slug: "solar-dynamo",
    name: "The Solar Dynamo",
    description:
      "The mechanism that generates and regenerates the Sun's magnetic field, converting the energy of plasma motions — differential rotation and convection — into magnetic energy. The dynamo drives the roughly eleven-year sunspot cycle and the reversal of the Sun's polarity; the details, especially the role of the tachocline, remain an active research problem.",
    relatedKeys: ["star:sun", "solar_region:tachocline", "stellar_physics_concept:differential-rotation", "space_weather_phenomenon:solar-cycle", "space_weather_phenomenon:sunspot"],
    highlights: ["Generates the Sun's field and drives the activity cycle"],
  }),
  solar("physics", {
    slug: "magnetic-reconnection",
    name: "Magnetic Reconnection",
    description:
      "The process by which oppositely directed magnetic field lines break and reconnect, converting stored magnetic energy explosively into heat, light, and fast particles. Reconnection powers solar flares and helps launch coronal mass ejections, and is a fundamental plasma process seen throughout the Universe.",
    relatedKeys: ["star:sun", "solar_region:corona", "space_weather_phenomenon:solar-flare", "space_weather_phenomenon:coronal-mass-ejection"],
    highlights: ["Releases magnetic energy — the engine of solar flares"],
  }),
  solar("physics", {
    slug: "differential-rotation",
    name: "Differential Rotation",
    symbolLabel: "~25 d equator, ~35 d poles",
    description:
      "The Sun does not rotate as a solid body: its equator completes a turn in about twenty-five days while the polar regions take around thirty-five. This shearing of the plasma winds up the magnetic field and is a key ingredient of the solar dynamo. It is measured from tracking sunspots and from helioseismology.",
    relatedKeys: ["star:sun", "solar_region:convection-zone", "stellar_physics_concept:solar-dynamo", "astronomy_method:helioseismology"],
    highlights: ["Equator laps the poles — winding up the magnetic field"],
  }),
  solar("physics", {
    slug: "coronal-heating-problem",
    name: "The Coronal Heating Problem",
    description:
      "One of the central open questions in solar physics: why the corona, at a million or more kelvin, is hundreds of times hotter than the photosphere below it. Leading candidate mechanisms include heating by many tiny reconnection events (nanoflares) and by magnetic waves; missions such as Parker Solar Probe and Solar Orbiter are testing them. No single answer is yet established.",
    relatedKeys: ["star:sun", "solar_region:corona", "stellar_physics_concept:nanoflare-heating", "space_mission:parker-solar-probe", "space_mission:solar-orbiter"],
    highlights: ["Why is the corona hotter than the surface? Still open"],
  }),
  solar("physics", {
    slug: "nanoflare-heating",
    name: "Nanoflare Heating",
    description:
      "A proposed solution to the coronal heating problem, put forward by Eugene Parker: the corona is heated by a vast number of tiny reconnection events — nanoflares — each far too small to see on its own, but collectively enough to keep the corona hot. It is one of several candidate mechanisms still being tested against observations.",
    relatedKeys: ["star:sun", "solar_region:corona", "stellar_physics_concept:coronal-heating-problem", "stellar_physics_concept:magnetic-reconnection"],
    highlights: ["Parker's idea: countless tiny reconnection events"],
  }),

  // ---- Solar cycle ----
  solar("cycle", {
    slug: "butterfly-diagram",
    name: "The Butterfly Diagram",
    description:
      "A plot of the latitudes at which sunspots appear over time, first drawn by the Maunders. Across each roughly eleven-year cycle, spots emerge first at mid-latitudes and then closer to the equator, so successive cycles trace wing-shaped patterns. It is the clearest visual summary of the solar activity cycle.",
    relatedKeys: ["star:sun", "space_weather_phenomenon:solar-cycle", "space_weather_phenomenon:sunspot"],
    highlights: ["Sunspot latitudes drift equatorward each cycle"],
  }),
  solar("cycle", {
    slug: "maunder-minimum",
    name: "The Maunder Minimum",
    symbolLabel: "≈ 1645–1715",
    description:
      "A roughly seventy-year span in the seventeenth and early eighteenth centuries when sunspots almost vanished from the record. It overlapped part of the cooler period known as the Little Ice Age, though the size of any climate link is debated. It is the archetype of a grand solar minimum.",
    relatedKeys: ["star:sun", "space_weather_phenomenon:solar-cycle", "stellar_physics_concept:dalton-minimum", "space_weather_phenomenon:sunspot"],
    highlights: ["Sunspots nearly vanished for ~70 years"],
  }),
  solar("cycle", {
    slug: "dalton-minimum",
    name: "The Dalton Minimum",
    symbolLabel: "≈ 1790–1830",
    description:
      "A period of low but not absent solar activity around the turn of the nineteenth century, less deep than the Maunder Minimum. Like other grand minima it is reconstructed from sunspot counts and from cosmogenic isotopes recorded in ice cores and tree rings.",
    relatedKeys: ["star:sun", "space_weather_phenomenon:solar-cycle", "stellar_physics_concept:maunder-minimum"],
    highlights: ["A shallower grand minimum around 1800"],
  }),
  solar("cycle", {
    slug: "solar-irradiance-variation",
    name: "Solar Irradiance Variation",
    symbolLabel: "~0.1% over a cycle",
    description:
      "The total energy the Sun radiates varies slightly over the activity cycle — by about a tenth of a percent between solar maximum and minimum — as dark sunspots and bright faculae come and go. Measured continuously from space since the late 1970s, these variations are a key input to studies of the Sun's influence on climate.",
    relatedKeys: ["star:sun", "space_weather_phenomenon:solar-cycle", "space_weather_phenomenon:sunspot", "solar_feature:plage"],
    highlights: ["Total output changes ~0.1% across the cycle"],
  }),

  // ---- Solar wind ----
  solar("wind", {
    slug: "fast-solar-wind",
    name: "The Fast Solar Wind",
    symbolLabel: "~700–800 km/s",
    description:
      "The steady, high-speed stream of the solar wind — around seven to eight hundred kilometres per second — that flows out along open magnetic field lines from coronal holes, especially over the poles at solar minimum. It is smoother and less dense than the slow wind.",
    relatedKeys: ["star:sun", "space_weather_phenomenon:solar-wind", "space_weather_phenomenon:coronal-hole", "solar_feature:polar-coronal-plume", "heliosphere_structure:parker-spiral"],
    highlights: ["~750 km/s streams from coronal holes"],
  }),
  solar("wind", {
    slug: "slow-solar-wind",
    name: "The Slow Solar Wind",
    symbolLabel: "~300–500 km/s",
    description:
      "The denser, more variable component of the solar wind — around three to five hundred kilometres per second — associated with the streamer belt near the solar equator. Its exact sources and release mechanisms are still being pinned down by close-in missions.",
    relatedKeys: ["star:sun", "space_weather_phenomenon:solar-wind", "solar_feature:coronal-streamer", "heliosphere_structure:parker-spiral"],
    highlights: ["~400 km/s from the streamer belt"],
  }),
];
