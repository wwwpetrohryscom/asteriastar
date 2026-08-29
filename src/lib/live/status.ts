import { BT_RECORDS, type LiveSourceRecord, type ProviderEnvelope, type LiveStatus } from "@/knowledge-graph/data/live-data-catalog";

/**
 * Honest status and envelope helpers for the Live Scientific Data Platform (Program BT). These build
 * the honesty envelope for a provider WITHOUT ever fabricating a value or a timestamp. A provider that
 * is not connected returns an envelope with its real status and no data; only a real fetch would
 * populate `data`, `fetchedAt`, and the validity window.
 */

/**
 * Build the honest envelope for a provider's CATALOGUE entry — its identity, endpoint, licence and
 * connection state. This page describes the provider; it does not read from it, which is why there
 * is no value and no timestamp here and never has been.
 *
 * The provenance sentence depends on the status. A connected provider's readings live in the
 * live-provider runtime and are shown at /space-weather; saying "no live fetch has occurred in this
 * build" on its catalogue page — as this function once did for every provider regardless — is a
 * statement that stopped being true the moment one was connected.
 */
export function catalogueEnvelope(source: LiveSourceRecord): ProviderEnvelope {
  const connected = source.status === "connected";
  return {
    provider: source.name,
    endpoint: source.endpoint,
    license: source.licenseNote,
    status: source.status,
    stale: false,
    provenance: connected
      ? `This is ${source.name}'s catalogue entry: what it is, what it serves, and under what terms. It carries no measurement — the live readings from this provider are fetched at request time and shown at /space-weather, each with the provider's own timestamp.`
      : `This is ${source.name}'s catalogue entry. The integration is ${source.status}: no fetch has been made, so no value, timestamp or provider response is shown — and none is invented.`,
    limitations: source.limitations,
    // fetchedAt / generatedAt / validFrom / validUntil / data are intentionally absent: no fetch.
  };
}

/** @deprecated Renamed to `catalogueEnvelope`; kept so an external import does not break silently. */
export const plannedEnvelope = catalogueEnvelope;

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
