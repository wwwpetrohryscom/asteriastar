import { solar, type SolarRecord } from "@/knowledge-graph/data/solar-physics-catalog/types";

/** The concentric structure of the Sun — the interior zones and the atmosphere layers (solar_region).
 *  Values are the firmly established ones; nothing is invented. Each links to the Sun and its neighbours. */
export const structure: SolarRecord[] = [
  // ---- Interior ----
  solar("interior", {
    slug: "solar-core",
    name: "The Solar Core",
    altNames: ["Core"],
    symbolLabel: "~15 million K",
    description:
      "The innermost region of the Sun, out to about a quarter of its radius, where nuclear fusion powers the star. At roughly 15 million kelvin and immense density, hydrogen fuses to helium mainly through the proton–proton chain, releasing the energy that slowly works its way outward. Almost all of the Sun's luminosity is generated here.",
    relatedKeys: ["star:sun", "solar_region:radiative-zone"],
    highlights: ["Fusion powers the Sun here, at ~15 million K"],
  }),
  solar("interior", {
    slug: "radiative-zone",
    name: "The Radiative Zone",
    symbolLabel: "~0.25–0.7 R☉",
    description:
      "The layer surrounding the core, from about a quarter to seven-tenths of the solar radius, where energy travels outward as radiation. Photons are absorbed and re-emitted so many times that a single packet of energy can take on the order of a hundred thousand years to cross it. The plasma here rotates almost as a rigid body.",
    relatedKeys: ["star:sun", "solar_region:solar-core", "solar_region:tachocline"],
    highlights: ["Energy diffuses outward as radiation over ~10⁵ years"],
  }),
  solar("interior", {
    slug: "tachocline",
    name: "The Tachocline",
    description:
      "The thin shear layer near seven-tenths of the solar radius, where the rigidly rotating radiative interior meets the differentially rotating convection zone. This velocity shear is widely thought to be where the Sun's large-scale magnetic field is generated — the seat of the solar dynamo.",
    relatedKeys: ["star:sun", "solar_region:radiative-zone", "solar_region:convection-zone", "stellar_physics_concept:solar-dynamo", "stellar_physics_concept:differential-rotation"],
    highlights: ["The shear layer thought to seat the solar dynamo"],
  }),
  solar("interior", {
    slug: "convection-zone",
    name: "The Convection Zone",
    symbolLabel: "~0.7 R☉ to the surface",
    description:
      "The outer third of the solar interior, where energy is carried by convection — hot plasma rises, cools, and sinks, like a pot of boiling water. This churning is visible at the surface as granulation and drives the magnetic activity of the Sun. It sits above the tachocline and below the photosphere.",
    relatedKeys: ["star:sun", "solar_region:tachocline", "solar_region:photosphere", "solar_feature:granulation"],
    highlights: ["Convection carries energy to the surface, driving activity"],
  }),

  // ---- Atmosphere ----
  solar("atmosphere", {
    slug: "photosphere",
    name: "The Photosphere",
    altNames: ["Solar surface"],
    symbolLabel: "~5,772 K",
    description:
      "The visible surface of the Sun — the layer from which sunlight escapes — with an effective temperature near 5,772 kelvin and a thickness of only a few hundred kilometres. Sunspots, granulation, and the limb darkening seen in white-light images all belong to the photosphere. It is the reference surface for the Sun's radius.",
    relatedKeys: ["star:sun", "solar_region:convection-zone", "solar_region:chromosphere", "space_weather_phenomenon:sunspot", "solar_feature:granulation"],
    highlights: ["The visible surface, ~5,772 K"],
  }),
  solar("atmosphere", {
    slug: "chromosphere",
    name: "The Chromosphere",
    symbolLabel: "~few thousand km thick",
    description:
      "The reddish layer of the solar atmosphere just above the photosphere, a few thousand kilometres thick, briefly visible as a rosy rim at the start and end of a total eclipse. Its temperature rises with height, and it is threaded by spicules, filaments, and plages. Above it lies the thin transition region.",
    relatedKeys: ["star:sun", "solar_region:photosphere", "solar_region:transition-region", "solar_feature:spicule", "solar_feature:plage", "solar_feature:filament"],
    highlights: ["The rosy layer glimpsed at eclipse — home to spicules"],
  }),
  solar("atmosphere", {
    slug: "transition-region",
    name: "The Transition Region",
    description:
      "The thin, irregular layer between the chromosphere and the corona where the temperature climbs steeply — from around ten thousand to a million kelvin over only a few hundred kilometres. It radiates mostly in the extreme ultraviolet and is central to the still-open question of how the corona is heated.",
    relatedKeys: ["star:sun", "solar_region:chromosphere", "solar_region:corona", "stellar_physics_concept:coronal-heating-problem"],
    highlights: ["Temperature leaps from ~10⁴ to ~10⁶ K across it"],
  }),
  solar("atmosphere", {
    slug: "corona",
    name: "The Solar Corona",
    altNames: ["Corona"],
    symbolLabel: "~1–3 million K",
    description:
      "The Sun's outermost atmosphere — a tenuous, million-degree plasma extending millions of kilometres into space, visible to the eye only during a total solar eclipse or with a coronagraph. Far hotter than the surface beneath it, it is shaped by magnetic fields into loops, holes, and streamers, and it continually expands outward as the solar wind.",
    relatedKeys: ["star:sun", "solar_region:transition-region", "space_weather_phenomenon:solar-wind", "space_weather_phenomenon:coronal-hole", "solar_feature:coronal-loop", "solar_feature:coronal-streamer", "stellar_physics_concept:coronal-heating-problem", "space_mission:soho"],
    highlights: ["A million-degree atmosphere, source of the solar wind"],
  }),
];
