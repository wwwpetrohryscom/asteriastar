import type { LiveEnvelope } from "@/platform/live-providers/envelope";
import { getLiveProduct } from "@/platform/live-providers/registry";

/**
 * Serialisation of live envelopes for the public API.
 *
 * The wire shape is the honesty model, field for field: an API consumer gets exactly what a page
 * gets, including the reason a value is missing. Nothing is flattened away for convenience —
 * `status`, `stale`, `fetchedAt` and `kind` are the fields that make the numbers safe to use, so
 * they are not optional extras.
 */

export interface SerialisedEnvelope<T = unknown> {
  provider: string;
  providerKey: string;
  productKey: string;
  organization: string;
  sourceUrl: string;
  license: string;
  status: string;
  stale: boolean;
  providerState: string;
  kind: string;
  fetchedAt?: string;
  generatedAt?: string;
  validFrom?: string;
  validUntil?: string;
  refreshCadenceSeconds?: number;
  cacheSeconds: number;
  staleAfterSeconds?: number;
  servedFromCache?: boolean;
  provenance: string;
  limitations?: string;
  error?: string;
  data?: T;
}

export function serialiseEnvelope<T>(env: LiveEnvelope<T>): SerialisedEnvelope<T> {
  const product = getLiveProduct(env.productKey);
  return {
    provider: env.provider,
    providerKey: env.providerKey,
    productKey: env.productKey,
    organization: env.organization,
    sourceUrl: env.sourceUrl,
    license: env.license,
    status: env.status,
    stale: env.stale,
    providerState: env.providerState,
    kind: env.kind,
    fetchedAt: env.fetchedAt,
    generatedAt: env.generatedAt,
    validFrom: env.validFrom,
    validUntil: env.validUntil,
    refreshCadenceSeconds: env.refreshCadenceSeconds,
    cacheSeconds: env.cacheSeconds,
    staleAfterSeconds: product?.freshness.staleAfterSeconds,
    servedFromCache: env.servedFromCache,
    provenance: env.provenance,
    limitations: env.limitations,
    error: env.error,
    // `data` is omitted rather than nulled when there is none: a consumer testing for the key gets
    // a clear answer, and a consumer that forgets to gets `undefined`, not a zero.
    ...(env.data !== undefined ? { data: env.data } : {}),
  };
}

export function serialiseSnapshot<T extends object>(snapshot: T): Record<string, SerialisedEnvelope> {
  const out: Record<string, SerialisedEnvelope> = {};
  for (const [key, value] of Object.entries(snapshot)) {
    out[key] = serialiseEnvelope(value as LiveEnvelope<unknown>);
  }
  return out;
}

/**
 * The `Cache-Control` for a live endpoint, derived from the shortest cache window among the
 * products it serves — so the HTTP cache can never outlive the data policy behind it.
 */
export function liveCacheControl(productKeys: string[]): string {
  const windows = productKeys.map((k) => getLiveProduct(k)?.cacheSeconds).filter((n): n is number => n !== undefined);
  const shortest = windows.length > 0 ? Math.min(...windows) : 60;
  // `stale-while-revalidate` is capped at the same window: serving a stale operational value for
  // longer than it is valid is exactly what this platform refuses to do elsewhere, and an HTTP
  // header is not an exception to that.
  return `public, max-age=${shortest}, s-maxage=${shortest}, stale-while-revalidate=${shortest}`;
}

/** A one-line summary of a snapshot's honesty state, for the API meta block. */
export function snapshotProvenance(snapshot: Record<string, SerialisedEnvelope>, subject: string): string {
  const total = Object.keys(snapshot).length;
  const withData = Object.values(snapshot).filter((e) => e.data !== undefined).length;
  const stale = Object.values(snapshot).filter((e) => e.stale).length;
  const failed = total - withData;
  return [
    `${subject}: ${withData} of ${total} products returned data.`,
    failed > 0 ? `${failed} could not be read and carry no value — nothing is substituted.` : "",
    stale > 0 ? `${stale} are past their validity window and are flagged stale.` : "",
    "Every value carries its provider, source URL, observation time and freshness. No value, timestamp or provider status is fabricated.",
  ]
    .filter(Boolean)
    .join(" ");
}
