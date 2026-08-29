/**
 * Live provider runtime (Programs CJ–CN).
 *
 * The shared machinery every live integration on AsteriaStar is built from: the honesty
 * envelope, the guarded fetch, the operational cache, the health record, the provider registry,
 * and the single `loadProduct` path from a provider to a page.
 *
 * The rules this layer exists to enforce, in one place:
 *   · a value is never shown without its provider, its timestamp and its freshness;
 *   · a provider that fails produces no value, never a substituted or invented one;
 *   · a cached value past its window is shown as stale or not at all;
 *   · "live" means an observation inside the provider's own publication cadence, and nothing else;
 *   · no operational observation is written to the repository.
 */
export * from "@/platform/live-providers/envelope";
export * from "@/platform/live-providers/registry";
export * from "@/platform/live-providers/client";
export { ALLOWED_PROVIDER_HOSTS, checkProviderUrl, fetchProviderJson, MAX_RESPONSE_BYTES } from "@/platform/live-providers/fetch";
export type { FetchFailureReason, FetchResult } from "@/platform/live-providers/fetch";
export { allHealth, getHealth, clearHealth, type ProviderHealth, type SchemaState } from "@/platform/live-providers/health";
export { cacheSize, clearCache, CACHE_FALLBACK_RETENTION_SECONDS } from "@/platform/live-providers/cache";
export * as normalise from "@/platform/live-providers/normalise";
