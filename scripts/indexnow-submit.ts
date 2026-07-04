/**
 * Submit the site's current URLs to IndexNow.
 *
 * Intended to run AFTER a production deployment (see .github/workflows/indexnow.yml):
 * it fetches the live sitemap, extracts every URL, and notifies IndexNow so search
 * engines re-crawl what changed. Standalone by design — it reads everything from the
 * environment and has no application imports, so it runs safely in CI.
 *
 *   tsx scripts/indexnow-submit.ts [url1 url2 ...]
 *
 * With explicit URLs as arguments, only those are submitted; otherwise the whole
 * sitemap is submitted. The IndexNow key is read from INDEXNOW_KEY and is never
 * hardcoded.
 */
export {}; // Ensure this file is treated as a module (isolated scope), not a global script.

const ENDPOINT = "https://api.indexnow.org/indexnow";
const MAX_PER_REQUEST = 10_000;

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? "https://asteriastar.com").replace(/\/$/, "");
const KEY = (process.env.INDEXNOW_KEY ?? "").trim();

function host(u: string): string {
  return new URL(u).host;
}

async function fetchSitemapUrls(retries = 5, delayMs = 5_000): Promise<string[]> {
  const sitemapUrl = `${SITE_URL}/sitemap.xml`;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(sitemapUrl, { headers: { "User-Agent": "AsteriaStar-IndexNow/1.0" } });
      if (res.ok) {
        const xml = await res.text();
        const locs = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1].trim());
        return [...new Set(locs)];
      }
      console.warn(`[indexnow] sitemap fetch attempt ${attempt}: HTTP ${res.status}`);
    } catch (err) {
      console.warn(`[indexnow] sitemap fetch attempt ${attempt} failed: ${(err as Error).message}`);
    }
    if (attempt < retries) await new Promise((r) => setTimeout(r, delayMs));
  }
  return [];
}

async function main() {
  if (!KEY) {
    console.log("[indexnow] INDEXNOW_KEY not set — skipping submission (no-op).");
    return;
  }
  const keyLocation = `${SITE_URL}/${KEY}.txt`;
  const argUrls = process.argv.slice(2).filter((a) => a.startsWith("http"));
  const urls = (argUrls.length > 0 ? argUrls : await fetchSitemapUrls()).filter((u) => {
    try {
      return host(u) === host(SITE_URL);
    } catch {
      return false;
    }
  });

  if (urls.length === 0) {
    console.log("[indexnow] No URLs to submit.");
    return;
  }

  let failed = false;
  for (let i = 0; i < urls.length; i += MAX_PER_REQUEST) {
    const urlList = urls.slice(i, i + MAX_PER_REQUEST);
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host: host(SITE_URL), key: KEY, keyLocation, urlList }),
    });
    // IndexNow returns 200 (accepted) or 202 (accepted, pending). Others indicate a problem.
    if (res.status === 200 || res.status === 202) {
      console.log(`[indexnow] Submitted ${urlList.length} URL(s) — HTTP ${res.status}`);
    } else {
      failed = true;
      console.error(`[indexnow] Submission failed — HTTP ${res.status}: ${await res.text().catch(() => "")}`);
    }
  }
  console.log(`[indexnow] Done. Submitted ${urls.length} URL(s) to IndexNow for ${host(SITE_URL)}.`);
  if (failed) process.exitCode = 1;
}

main().catch((err) => {
  console.error(`[indexnow] Unexpected error: ${(err as Error).message}`);
  process.exitCode = 1;
});
