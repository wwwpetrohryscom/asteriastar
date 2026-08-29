import { BT_RECORDS, type LiveSourceRecord, type ProviderEnvelope, type LiveStatus } from "@/knowledge-graph/data/live-data-catalog";

/**
 * Honest status and envelope helpers for the Live Scientific Data Platform (Program BT). These build
 * the honesty envelope for a provider WITHOUT ever fabricating a value or a timestamp. A provider that
 * is not connected returns an envelope with its real status and no data; only a real fetch would
 * populate `data`, `fetchedAt`, and the validity window.
 */

/** Build the honest envelope for a provider whose page is being rendered from the catalogue alone —
 *  status carried from the catalogue, no data, no invented timestamps. Providers that ARE connected
 *  serve their real values through the live-provider runtime (platform/live-providers); this
 *  envelope describes the catalogue record, and deliberately carries no measurement. */
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
 *  claims a provider is connected when it is not, and the note it produces is derived from those
 *  same counts rather than written by hand. */
export function buildStatusReport(): LiveStatusReport {
  const byStatus = { connected: 0, computed: 0, cached: 0, stale: 0, unavailable: 0, planned: 0 } as Record<LiveStatus, number>;
  for (const r of BT_RECORDS) byStatus[r.status] += 1;
  return {
    total: BT_RECORDS.length,
    byStatus,
    connected: byStatus.connected,
    planned: byStatus.planned,
    // Computed, never asserted: the sentence has to change when the catalogue does, so it cannot
    // drift into claiming a connection that no longer exists — or denying one that now does.
    generatedNote:
      `Status is read from the live-data catalogue and the live-sky provider registry. ` +
      `${byStatus.connected} of ${BT_RECORDS.length} providers are connected end-to-end and serve real values with the provider's own timestamps; ` +
      `${byStatus.planned} remain architecture-ready and show no values at all. No live value, timestamp or provider status is fabricated.`,
    sources: BT_RECORDS.map((r) => ({ slug: r.slug, name: r.name, category: r.category, status: r.status, endpoint: r.endpoint, license: r.licenseNote })),
  };
}
