import type { MmRecord } from "@/knowledge-graph/data/multi-messenger-catalog/types";

/** Multi-messenger alert systems — created with the EXISTING alert-system type (which already holds
 *  GCN, VOEvent, and the Transient Name Server). Each links to the reused alert systems and the
 *  detectors and follow-up stages it serves. */
const alr = (r: Omit<MmRecord, "kind" | "id" | "sources"> & { slug: string; sources?: MmRecord["sources"] }): MmRecord => ({ sources: ["ligo"], ...r, kind: "alert", id: `alert_system:${r.slug}` });

export const alerts: MmRecord[] = [
  alr({ slug: "lvk-alert-network", name: "LVK Public Alerts", altNames: ["LIGO-Virgo-KAGRA alerts"], relatedKeys: ["alert_system:gcn", "observatory:ligo-hanford", "gw_followup_stage:rapid-response"], description: "The public alert system of the LIGO–Virgo–KAGRA collaboration, which issues automated notices — within seconds to minutes — whenever the detectors flag a candidate gravitational-wave event, so that telescopes around the world can begin the hunt for a counterpart. The alerts are distributed through GCN.", sources: ["ligo"], highlights: ["Gravitational-wave alerts within seconds of a detection"] }),
  alr({ slug: "scimma", name: "SCiMMA", altNames: ["Scalable Cyberinfrastructure for Multi-Messenger Astrophysics"], relatedKeys: ["astronomy_method:multi-messenger-astronomy", "alert_system:gcn"], description: "An open cyberinfrastructure project building the tools and networks — including the Hopskotch streaming system — to carry the flood of multi-messenger alerts between gravitational-wave, neutrino, and electromagnetic observatories quickly and reliably.", sources: ["ligo"] }),
];
