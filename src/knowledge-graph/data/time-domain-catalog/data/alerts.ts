import type { TimeDomainRecord } from "@/knowledge-graph/data/time-domain-catalog/types";

/** Alert-infrastructure systems — how the discovery of a transient is broadcast to the world.
 *  Each is associated_with the REUSED facilities and surveys it connects, or other systems. */
const al = (r: Omit<TimeDomainRecord, "kind" | "id" | "category" | "sources"> & { slug: string; sources?: TimeDomainRecord["sources"] }): TimeDomainRecord => ({ sources: ["nasa"], ...r, kind: "alert", id: `alert_system:${r.slug}`, category: "infrastructure" });
const B = (b: string) => `wavelength_band:${b}`;

export const alertSystems: TimeDomainRecord[] = [
  al({ slug: "gcn", name: "General Coordinates Network", altNames: ["GCN", "Gamma-ray Coordinates Network"], relatedKeys: [B("gamma-ray"), B("multi-messenger")], description: "NASA's network for the rapid distribution of alerts about transient events — gamma-ray bursts, gravitational-wave triggers, and neutrino detections — so that telescopes around the world can slew to a fresh event within seconds.", sources: ["nasa"], highlights: ["Seconds-fast alerts for the whole community"] }),
  al({ slug: "voevent", name: "VOEvent", relatedKeys: ["alert_system:gcn", B("multi-messenger")], description: "The Virtual Observatory's standard machine-readable format for reporting a transient celestial event — what, where, when, and how confident — so that alerts flow automatically between observatories, brokers, and robotic telescopes.", sources: ["nasa"] }),
  al({ slug: "transient-name-server", name: "Transient Name Server", altNames: ["TNS"], relatedKeys: ["sky_survey:lsst", "sky_survey:pan-starrs"], description: "The official IAU registry that assigns the discovery names of supernovae and other transients, and collects the reports and classifications that establish who found what, and when.", sources: ["nasa"], highlights: ["The IAU registry of transient discoveries"] }),
  al({ slug: "astronomers-telegram", name: "The Astronomer's Telegram", altNames: ["ATel"], relatedKeys: ["alert_system:transient-name-server", B("multi-messenger")], description: "A short-notice publication service for rapidly announcing and commenting on new astronomical observations, widely used to share follow-up of transients within hours.", sources: ["nasa"] }),
  al({ slug: "rubin-alert-stream", name: "Rubin Alert Stream", altNames: ["LSST alert stream"], relatedKeys: ["observatory:vera-rubin-observatory", "sky_survey:lsst"], description: "The torrent of alerts the Vera C. Rubin Observatory will issue — millions per night — as it scans the whole southern sky every few nights, feeding community brokers that filter the deluge into the events worth chasing.", sources: ["nasa"], highlights: ["Millions of transient alerts every night"] }),
];
