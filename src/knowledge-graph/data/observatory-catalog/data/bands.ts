import type { ObsRecord } from "@/knowledge-graph/data/observatory-catalog/types";

/** Observing bands across the electromagnetic spectrum and beyond. */
const B = (slug: string, name: string, wavelength: string, description: string): ObsRecord =>
  ({ id: `wavelength_band:${slug}`, slug, name, kind: "band", wavelength, description, sources: ["nasa"] });

export const bands: ObsRecord[] = [
  B("radio", "Radio", "wavelengths longer than ~1 mm", "Radio waves are the longest-wavelength light; radio telescopes study pulsars, galaxies, and the cold gas of the universe."),
  B("millimeter", "Millimeter", "~1–10 mm", "Millimeter-wave astronomy probes cold molecular gas and dust, the raw material of stars and planets."),
  B("submillimeter", "Submillimeter", "~0.1–1 mm", "Submillimeter astronomy reveals the cold, dusty early stages of star and galaxy formation."),
  B("infrared", "Infrared", "~0.7 µm – 1 mm", "Infrared light penetrates dust and reveals cool objects — forming stars, planets, and distant galaxies."),
  B("near-infrared", "Near-infrared", "~0.7–5 µm", "The near-infrared bridges visible and thermal infrared light, key for studying the early universe and exoplanet atmospheres."),
  B("visible-light", "Visible light", "~380–700 nm", "Visible light is the band the human eye sees and the traditional domain of optical telescopes."),
  B("ultraviolet", "Ultraviolet", "~10–400 nm", "Ultraviolet light traces hot young stars and energetic processes; most of it is blocked by Earth's atmosphere."),
  B("x-ray", "X-ray", "~0.01–10 nm", "X-rays come from the hottest, most energetic places in the universe — black holes, neutron stars, and galaxy clusters."),
  B("gamma-ray", "Gamma-ray", "wavelengths shorter than ~0.01 nm", "Gamma rays are the most energetic light, produced by supernovae, pulsars, and matter falling into black holes."),
  B("gravitational-waves", "Gravitational waves", "ripples in spacetime", "Gravitational waves are ripples in spacetime from violent events such as merging black holes and neutron stars, detected by laser interferometers."),
  B("neutrinos", "Neutrinos", "subatomic particles", "Neutrinos are nearly massless particles that stream from nuclear processes in stars and cataclysmic events, detected deep underground or in ice."),
  B("multi-messenger", "Multi-messenger astronomy", "combined signals", "Multi-messenger astronomy combines light, gravitational waves, and particles to study a single cosmic event from several independent channels."),
];
