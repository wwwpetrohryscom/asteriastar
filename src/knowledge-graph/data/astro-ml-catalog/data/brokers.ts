import type { MlRecord } from "@/knowledge-graph/data/astro-ml-catalog/types";

/** Community alert brokers — created with the EXISTING alert-system type (which already holds GCN,
 *  VOEvent, the Transient Name Server, the Astronomer's Telegram, and the Rubin alert stream).
 *  Each ingests and classifies the survey alert stream and links to the reused Rubin Observatory
 *  and alert stream and the real-time classification application. */
const brk = (r: Omit<MlRecord, "kind" | "id" | "sources"> & { slug: string; sources?: MlRecord["sources"] }): MlRecord => ({ sources: ["noirlab"], ...r, kind: "broker", id: `alert_system:${r.slug}` });

export const brokers: MlRecord[] = [
  brk({ slug: "alerce", name: "ALeRCE", altNames: ["Automatic Learning for the Rapid Classification of Events"], relatedKeys: ["alert_system:rubin-alert-stream", "ml_application:real-time-alert-classification", "ml_method:classification"], description: "A community alert broker, led from Chile, that ingests a survey's alert stream and classifies its transients and variable objects in real time with machine learning — first for the Zwicky Transient Facility and, in the era ahead, for Rubin.", sources: ["noirlab"], highlights: ["Machine-learning classification of the live alert stream"] }),
  brk({ slug: "antares-broker", name: "ANTARES", altNames: ["Arizona-NOIRLab Temporal Analysis and Response to Events System"], relatedKeys: ["alert_system:rubin-alert-stream", "ml_application:real-time-alert-classification"], description: "NOIRLab's alert broker for time-domain astronomy, which filters and annotates survey alert streams to surface the events most worth following up. One of the community brokers selected to process the full Rubin alert stream.", sources: ["noirlab"] }),
  brk({ slug: "fink", name: "Fink", relatedKeys: ["alert_system:rubin-alert-stream", "ml_application:real-time-alert-classification"], description: "A community alert broker built to process the alert streams of ZTF and Rubin, adding machine-learning classifications and value-added information so that astronomers can select the transients and variables they care about from millions of nightly alerts.", sources: ["noirlab"] }),
  brk({ slug: "lasair", name: "Lasair", relatedKeys: ["alert_system:rubin-alert-stream", "ml_application:real-time-alert-classification"], description: "A UK-led community alert broker for the ZTF and Rubin alert streams, letting astronomers query, filter, and cross-match the live stream of changing objects on the sky.", sources: ["noirlab"] }),
];
