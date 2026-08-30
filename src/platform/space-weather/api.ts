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
/**
 * How long a shared cache may hold this response.
 *
 * `failed` is the parameter that matters most and is easiest to forget. The window is derived from
 * the product's cache policy, and one of the eclipse catalogues is cached for a WEEK because its
 * contents were computed once in 2007 and never change. Applying that window to a response that
 * contains no data — because NASA was briefly unreachable — pinned an empty body at the CDN for
 * seven days: a momentary outage became a week-long one, and nothing on the origin could undo it.
 * A response with nothing in it is cached for a minute, whatever the product's policy says.
 */
export function liveCacheControl(productKeys: string[], failed = false): string {
  if (failed) return "public, max-age=60, s-maxage=60, stale-while-revalidate=60";
  const products = productKeys.map((k) => getLiveProduct(k)).filter((p) => p !== undefined);
  const shortestCache = products.length > 0 ? Math.min(...products.map((p) => p.cacheSeconds)) : 60;
  const shortestStale = products.length > 0 ? Math.min(...products.map((p) => p.freshness.staleAfterSeconds)) : 3600;

  /*
   * `stale-while-revalidate` ADDS to `max-age`; it does not cap it. A shared cache may serve a
   * response for up to `max-age + stale-while-revalidate` seconds while it refreshes in the
   * background — so the two together, not max-age alone, are what bound how old a served response
   * can be. (An earlier comment here claimed the opposite, which is a common enough misreading of
   * RFC 5861 to be worth naming.)
   *
   * The total is therefore held below the shortest product's own stale threshold: a cache is
   * allowed to serve a value that is not the provider's newest, and is never allowed to serve one
   * this platform would itself refuse to call current. The body always carries the real
   * `fetchedAt` and `status`, so a consumer can age any response exactly regardless.
   */
  const swr = Math.max(0, Math.min(shortestCache, shortestStale - shortestCache));
  return `public, max-age=${shortestCache}, s-maxage=${shortestCache}, stale-while-revalidate=${swr}`;
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
