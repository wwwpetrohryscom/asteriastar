import type { DSCommRecord } from "@/knowledge-graph/data/deep-space-comms-catalog/types";

/**
 * Communication SIGNAL BANDS — the radio and optical frequency ranges used for deep-space
 * links. These are communication allocations, distinct from the astronomy observation
 * bands (`wavelength_band`) already in the graph. Signal light-time is a property of
 * distance, not of the band, so it is described honestly (distance ÷ speed of light), never
 * as a fabricated fixed delay.
 */

const mk = (r: Omit<DSCommRecord, "kind" | "id"> & { slug: string }): DSCommRecord => ({
  ...r,
  kind: "band",
  id: `signal_band:${r.slug}`,
  category: r.category ?? "signal",
});

export const bands: DSCommRecord[] = [
  mk({
    slug: "s-band",
    name: "S-band",
    frequencyLabel: "≈ 2.0–2.3 GHz",
    description: "A lower-frequency microwave band long used for spacecraft command and low-rate telemetry, and for near-Earth links. Robust and less affected by weather than higher bands, but limited in data rate.",
    role: "Command and low-rate telemetry; near-Earth links.",
    sources: ["nasa", "jpl"],
  }),
  mk({
    slug: "x-band",
    name: "X-band",
    frequencyLabel: "≈ 7.1–8.5 GHz",
    description: "The workhorse band of deep-space communication and radiometric navigation. Most interplanetary missions send their science data and are tracked on X-band, which balances data rate against antenna size and weather losses.",
    role: "Primary deep-space telemetry, command, and navigation.",
    latencyNote: "Signals travel at the speed of light, so one-way light-time grows with distance: about 1.3 s to the Moon, 3–22 minutes to Mars, 33–53 minutes to Jupiter, and over 22 hours to Voyager 1 — real light-time, never a fabricated fixed delay.",
    sources: ["nasa", "jpl"],
    highlights: ["The deep-space workhorse band"],
  }),
  mk({
    slug: "ka-band",
    name: "Ka-band",
    frequencyLabel: "≈ 26–32 GHz",
    description: "A higher-frequency band that carries much more data than X-band for the same antenna, at the cost of greater sensitivity to rain and pointing. Increasingly used for high-rate science downlink from deep space.",
    role: "High-rate science downlink.",
    sources: ["nasa", "jpl"],
  }),
  mk({
    slug: "uhf",
    name: "UHF",
    frequencyLabel: "≈ 400 MHz",
    description: "An ultra-high-frequency band used for short-range proximity links — for example between a Mars rover and an orbiter that relays the data to Earth — rather than for direct deep-space communication.",
    role: "Short-range proximity relay links.",
    sources: ["nasa", "jpl"],
  }),
  mk({
    slug: "optical",
    name: "Optical (Laser)",
    category: "optical",
    wavelengthLabel: "near-infrared laser (≈ 1064–1550 nm)",
    description: "Laser communication encodes data on an infrared beam instead of radio waves. Its far shorter wavelength packs data into a tighter beam, promising data rates 10–100× higher than radio — the frontier of deep-space communication, demonstrated by DSOC on the Psyche spacecraft.",
    role: "Very-high-rate optical (laser) communication.",
    sources: ["nasa", "jpl"],
    highlights: ["10–100× the data rate of radio, demonstrated by DSOC"],
  }),
];
