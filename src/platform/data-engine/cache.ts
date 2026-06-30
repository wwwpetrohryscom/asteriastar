/**
 * Tiny deterministic memoizer for the data engine.
 *
 * Engine results are deterministic and treated as read-only by convention, so
 * caching by a string key is safe and makes repeated resolution (e.g. the same
 * entity across a build) cheap. No eviction is needed at build scale; `clear()`
 * exists for tests and long-lived processes (a future CLI / API).
 */
export function memoize<R>(fn: (key: string) => R): ((key: string) => R) & { clear(): void } {
  const cache = new Map<string, R>();
  const wrapped = (key: string): R => {
    const hit = cache.get(key);
    if (hit !== undefined || cache.has(key)) return hit as R;
    const value = fn(key);
    cache.set(key, value);
    return value;
  };
  wrapped.clear = () => cache.clear();
  return wrapped;
}
