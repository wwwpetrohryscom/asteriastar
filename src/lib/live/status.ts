import { BT_RECORDS, type LiveSourceRecord, type ProviderEnvelope, type LiveStatus } from "@/knowledge-graph/data/live-data-catalog";

/**
 * Honest status and envelope helpers for the Live Scientific Data Platform (Program BT). These build
 * the honesty envelope for a provider WITHOUT ever fabricating a value or a timestamp. A provider that
 * is not connected returns an envelope with its real status and no data; only a real fetch would
 * populate `data`, `fetchedAt`, and the validity window.
 */

/** Build the honest envelope for a provider that has not been fetched — status carried from the
 *  catalogue, no data, no invented timestamps. This is what every provider returns in this build. */
export function plannedEnvelope(source: LiveSourceRecord): ProviderEnvelope {
  return {
    provider: source.name,
    endpoint: source.endpoint,
    license: source.licenseNote,
    status: source.status,
    stale: false,
    provenance: `Modelled from ${source.name}. No live fetch has occurred in this build; the integration is ${source.status}.`,
    limitations: source.limitations,
    // fetchedAt / generatedAt / validFrom / validUntil / data are intentionally absent: no fetch.
  };
}

export interface LiveStatusReport {
  total: number;
  byStatus: Record<LiveStatus, number>;
  connected: number;
  planned: number;
  generatedNote: string;
  sources: { slug: string; name: string; category: string; status: LiveStatus; endpoint?: string; license?: string }[];
}

/** A truthful summary of every provider's status. Counts are real (from the catalogue); it never
 *  claims a provider is connected when it is not. */
export function buildStatusReport(): LiveStatusReport {
  const byStatus = { connected: 0, computed: 0, cached: 0, stale: 0, unavailable: 0, planned: 0 } as Record<LiveStatus, number>;
  for (const r of BT_RECORDS) byStatus[r.status] += 1;
  return {
    total: BT_RECORDS.length,
    byStatus,
    connected: byStatus.connected,
    planned: byStatus.planned,
    generatedNote: "Status is read from the live-data catalogue and the live-sky provider registry. No provider is connected in this deployment; no live value is fabricated.",
    sources: BT_RECORDS.map((r) => ({ slug: r.slug, name: r.name, category: r.category, status: r.status, endpoint: r.endpoint, license: r.licenseNote })),
  };
}
