/**
 * OpenNext configuration for Cloudflare Workers.
 *
 * The platform needs a server: 45 ISR pages (live space weather, ISS, NEO, events — revalidating every
 * 1 minute to 1 day) and 44 dynamic routes (the Open Data / Live Sky / provenance API handlers,
 * /assistant/*, /authority/data-health/*, /events/calendar.ics). OpenNext runs the Next.js server in
 * the Worker; everything below is about where the ~8,851 prerendered pages and their ISR updates live.
 *
 * - Incremental cache: R2 (bucket bound as NEXT_INC_CACHE_R2_BUCKET in wrangler.jsonc), fronted by
 *   the regional Cache API so a hot page is not an R2 read on every request. The prerendered pages are
 *   uploaded to R2 at deploy time by `opennextjs-cloudflare deploy`.
 * - Queue: a Durable Object dedupes time-based revalidations, so a page whose revalidate window has
 *   passed is regenerated once, in the background, while visitors keep getting the stale copy — the
 *   same stale-while-revalidate behaviour the Netlify runtime had.
 * - Cache interception: a cached page is answered before the Next.js server is loaded at all.
 *
 * No tag cache: nothing in src/ calls revalidateTag / revalidatePath / unstable_cache.
 *
 * `buildCommand` runs the normal build (prebuild gates included) and then collapses the duplicate
 * Turbopack server chunks — without that step the Worker is ~37 MB gzipped, over the 10 MiB limit.
 * See scripts/cloudflare/dedupe-server-chunks.mjs.
 */
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import { withRegionalCache } from "@opennextjs/cloudflare/overrides/incremental-cache/regional-cache";
import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";

const config = defineCloudflareConfig({
  incrementalCache: withRegionalCache(r2IncrementalCache, { mode: "long-lived" }),
  queue: doQueue,
  enableCacheInterception: true,
});

export default {
  ...config,
  buildCommand: "npm run build && node scripts/cloudflare/dedupe-server-chunks.mjs",
};
