import { solar, type SolarRecord } from "@/knowledge-graph/data/solar-physics-catalog/types";

/** Solar surface and atmospheric features (solar_feature). Each reuses the Sun and the region it lives in. */
export const features: SolarRecord[] = [
  solar("feature", {
    slug: "granulation",
    name: "Granulation",
    symbolLabel: "~1,000 km cells",
    description:
      "The mottled, cellular pattern covering the photosphere — the tops of convection cells about a thousand kilometres across, each lasting only minutes. Bright centres are hot plasma rising, dark lanes are cooler plasma sinking. Granulation is the direct visible signature of the convection zone beneath.",
    relatedKeys: ["star:sun", "solar_region:photosphere", "solar_region:convection-zone", "solar_feature:supergranulation"],
    highlights: ["Convection cells, the visible face of the convection zone"],
  }),
  solar("feature", {
    slug: "supergranulation",
    name: "Supergranulation",
    symbolLabel: "~30,000 km cells",
    description:
      "A larger-scale convective pattern, with cells around thirty thousand kilometres across that persist for roughly a day. Supergranule flows sweep magnetic field to their edges, building the chromospheric network. It was discovered through Doppler measurements of the surface flows.",
    relatedKeys: ["star:sun", "solar_region:photosphere", "solar_feature:granulation"],
    highlights: ["Day-long convection cells that shape the magnetic network"],
  }),
  solar("feature", {
    slug: "prominence",
    name: "Prominence",
    description:
      "A large, relatively cool and dense structure of plasma suspended above the solar surface by magnetic fields, extending into the hot corona. Seen at the limb against the dark sky it appears as a bright arch; quiescent prominences can last for months, while eruptive ones can launch a coronal mass ejection.",
    relatedKeys: ["star:sun", "solar_region:corona", "solar_feature:filament", "space_weather_phenomenon:coronal-mass-ejection"],
    highlights: ["Cool plasma held aloft in the corona by magnetic fields"],
  }),
  solar("feature", {
    slug: "filament",
    name: "Filament",
    description:
      "The same structure as a prominence, but seen against the bright solar disk rather than at the limb, where it appears as a dark, thread-like channel. A filament is cool plasma along a magnetic boundary; its sudden eruption is a common trigger of a coronal mass ejection.",
    relatedKeys: ["star:sun", "solar_region:chromosphere", "solar_feature:prominence", "space_weather_phenomenon:coronal-mass-ejection"],
    highlights: ["A prominence seen dark against the disk"],
  }),
  solar("feature", {
    slug: "plage",
    name: "Plage",
    description:
      "A bright region of the chromosphere associated with an active region, where concentrated magnetic field heats the plasma above a group of sunspots. Plages are conspicuous in the light of hydrogen and calcium and mark magnetically active areas even as the sunspots themselves come and go.",
    relatedKeys: ["star:sun", "solar_region:chromosphere", "space_weather_phenomenon:active-region", "space_weather_phenomenon:sunspot"],
    highlights: ["Bright chromospheric mark of an active region"],
  }),
  solar("feature", {
    slug: "spicule",
    name: "Spicule",
    description:
      "A short-lived jet of plasma, a few hundred kilometres across, that shoots up from the chromosphere at tens of kilometres per second and falls back within minutes. Millions cover the Sun at any moment, giving the chromospheric limb a grassy appearance; they may contribute to the mass and energy budget of the corona.",
    relatedKeys: ["star:sun", "solar_region:chromosphere", "solar_region:corona"],
    highlights: ["Grassy chromospheric jets, millions at a time"],
  }),
  solar("feature", {
    slug: "coronal-loop",
    name: "Coronal Loop",
    description:
      "An arch of hot, glowing plasma tracing a magnetic field line rooted in the photosphere, the basic building block of the closed corona above active regions. Coronal loops shine brightly in the extreme ultraviolet and X-rays and are central to studies of how the corona is structured and heated.",
    relatedKeys: ["star:sun", "solar_region:corona", "space_weather_phenomenon:active-region", "stellar_physics_concept:coronal-heating-problem"],
    highlights: ["Plasma tracing a coronal magnetic field line"],
  }),
  solar("feature", {
    slug: "coronal-streamer",
    name: "Coronal Streamer",
    altNames: ["Helmet streamer"],
    description:
      "A large, pointed structure in the corona, seen in eclipse and coronagraph images as bright rays extending outward above the streamer belt. Helmet streamers cap closed magnetic regions and are the source of the slow solar wind; their shape changes over the solar cycle.",
    relatedKeys: ["star:sun", "solar_region:corona", "stellar_physics_concept:slow-solar-wind", "space_weather_phenomenon:solar-wind"],
    highlights: ["Bright coronal rays — source of the slow solar wind"],
  }),
  solar("feature", {
    slug: "polar-coronal-plume",
    name: "Polar Coronal Plume",
    altNames: ["Polar plume"],
    description:
      "A thin, ray-like structure of denser plasma rooted in the Sun's polar regions and extending into a polar coronal hole. Plumes trace open magnetic field lines from which fast solar wind flows, and appear as delicate streaks in images of the poles.",
    relatedKeys: ["star:sun", "solar_region:corona", "space_weather_phenomenon:coronal-hole", "stellar_physics_concept:fast-solar-wind"],
    highlights: ["Rays along open field in the polar coronal holes"],
  }),
];
