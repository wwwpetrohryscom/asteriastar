/**
 * The operational cache for live provider responses.
 *
 * Deliberately in-memory and process-local. Operational observations are not committed to the
 * repository and are not written to disk: the repository holds reviewed scientific data, and
 * turning it into a time-series database for solar-wind readings would make every one of its
 * guarantees weaker. Nothing here survives a cold start, and that is the intended retention
 * policy — the only durable record of a fetch is that there is none.
 *
 * It keeps the last successful value past its TTL for one reason: so that when a provider
 * fails, the page can show the last real observation *labelled as stale* instead of a blank.
 * That is the roadmap's failure contract — a real past value, honestly aged, never a
 * substituted or invented present one.
 */

export interface CacheEntry<T> {
  value: T;
  /** When this value was fetched (ISO 8601). Real; never adjusted on a cache hit. */
  fetchedAt: string;
  /** Monotonic-ish stamp used for expiry, in epoch milliseconds. */
  storedAtMs: number;
  /** How long this entry counts as fresh, in seconds. */
  ttlSeconds: number;
}

/**
 * Hard ceiling on retained entries. The key space is a fixed set of product keys, so this can
 * only be exceeded by a programming error; the cap makes that error bounded rather than fatal.
 */
const MAX_ENTRIES = 200;

/**
 * How long a superseded value is retained for the failure path, past its TTL. Beyond this it is
 * dropped: an observation this old has no value even as a labelled fallback.
 */
export const CACHE_FALLBACK_RETENTION_SECONDS = 6 * 3600;

const store = new Map<string, CacheEntry<unknown>>();

/** Read a cache entry regardless of freshness. The caller decides what an old value means. */
export function peek<T>(key: string): CacheEntry<T> | undefined {
  const hit = store.get(key) as CacheEntry<T> | undefined;
  if (!hit) return undefined;
  const ageSeconds = (Date.now() - hit.storedAtMs) / 1000;
  if (ageSeconds > hit.ttlSeconds + CACHE_FALLBACK_RETENTION_SECONDS) {
    store.delete(key);
    return undefined;
  }
  return hit;
}

/** Whether a cache entry is still inside its TTL. */
export function isFresh(entry: CacheEntry<unknown>): boolean {
  return (Date.now() - entry.storedAtMs) / 1000 <= entry.ttlSeconds;
}

/** Age of a cache entry in seconds. */
export function entryAgeSeconds(entry: CacheEntry<unknown>): number {
  return Math.max(0, Math.round((Date.now() - entry.storedAtMs) / 1000));
}

export function put<T>(key: string, value: T, fetchedAt: string, ttlSeconds: number): void {
  if (store.size >= MAX_ENTRIES && !store.has(key)) {
    // Evict the oldest entry. Insertion order is Map's iteration order, and entries are
    // re-inserted on every refresh, so the first key is the least recently refreshed.
    const oldest = store.keys().next();
    if (!oldest.done) store.delete(oldest.value);
  }
  store.set(key, { value, fetchedAt, storedAtMs: Date.now(), ttlSeconds });
}

/** Number of retained entries — reported by the health surface, never the values themselves. */
export function cacheSize(): number {
  return store.size;
}

/** Drop everything. Used by tests; there is no production caller. */
export function clearCache(): void {
  store.clear();
}
