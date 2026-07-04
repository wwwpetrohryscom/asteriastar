/**
 * IndexNow integration for Asteria Star.
 *
 * IndexNow lets us notify search engines (Bing, Yandex, Seznam, Naver, and
 * partners) the moment content changes, instead of waiting to be re-crawled.
 *
 * The key itself is read from the `INDEXNOW_KEY` environment variable — it is
 * never hardcoded here. The one place the literal key must appear is the
 * protocol-required key file served at `/<key>.txt` (see
 * `scripts/generate-indexnow-key.ts` and `public/<key>.txt`), because IndexNow
 * requires the file to be named after, and to contain, the key.
 */
import { SITE_URL } from "@/lib/site";

/** The IndexNow submission endpoint. A single submission is shared across the
 *  participating search engines, so we only need to POST to one. */
export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

/** IndexNow accepts at most 10,000 URLs per request. */
export const INDEXNOW_MAX_URLS_PER_REQUEST = 10_000;

/** The IndexNow key, read from the environment. Empty string when unset. */
export function indexNowKey(): string {
  return (process.env.INDEXNOW_KEY ?? "").trim();
}

/** The host (bare domain) IndexNow submissions are made for. */
export function indexNowHost(siteUrl: string = SITE_URL): string {
  try {
    return new URL(siteUrl).host;
  } catch {
    return "asteriastar.com";
  }
}

/** The public URL of the protocol-required key file, `/<key>.txt`. */
export function indexNowKeyLocation(siteUrl: string = SITE_URL, key: string = indexNowKey()): string {
  return `${siteUrl.replace(/\/$/, "")}/${key}.txt`;
}

export interface IndexNowResult {
  submitted: number;
  batches: number;
  ok: boolean;
  skipped?: string;
  statuses: number[];
}

/**
 * Submit a list of absolute URLs to IndexNow. No-ops (rather than throwing) when
 * the key is missing, so a build or deploy never fails because of IndexNow.
 * URLs are de-duplicated and sent in batches within the protocol limit.
 */
export async function submitUrls(
  urls: string[],
  opts: { siteUrl?: string; key?: string; fetchImpl?: typeof fetch } = {},
): Promise<IndexNowResult> {
  const siteUrl = (opts.siteUrl ?? SITE_URL).replace(/\/$/, "");
  const key = opts.key ?? indexNowKey();
  const doFetch = opts.fetchImpl ?? fetch;
  const host = indexNowHost(siteUrl);
  const keyLocation = indexNowKeyLocation(siteUrl, key);

  if (!key) return { submitted: 0, batches: 0, ok: false, skipped: "INDEXNOW_KEY is not set", statuses: [] };

  // De-duplicate and keep only same-host absolute URLs (IndexNow rejects cross-host lists).
  const seen = new Set<string>();
  const urlList = urls.filter((u) => {
    if (seen.has(u)) return false;
    seen.add(u);
    try {
      return new URL(u).host === host;
    } catch {
      return false;
    }
  });
  if (urlList.length === 0) return { submitted: 0, batches: 0, ok: true, statuses: [] };

  const statuses: number[] = [];
  for (let i = 0; i < urlList.length; i += INDEXNOW_MAX_URLS_PER_REQUEST) {
    const batch = urlList.slice(i, i + INDEXNOW_MAX_URLS_PER_REQUEST);
    const res = await doFetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host, key, keyLocation, urlList: batch }),
    });
    statuses.push(res.status);
  }
  return { submitted: urlList.length, batches: statuses.length, ok: statuses.every((s) => s >= 200 && s < 300), statuses };
}
