import { NextResponse } from "next/server";
import sitemap from "@/app/sitemap";
import { submitUrls, indexNowKey } from "@/lib/indexnow";

/**
 * POST/GET /api/indexnow — submit the site's current sitemap URLs to IndexNow.
 *
 * Designed to be called by a post-deployment hook (a Vercel Deploy Hook, a CI
 * step, or the GitHub Action in .github/workflows/indexnow.yml). It reads the
 * IndexNow key from the environment and never exposes or hardcodes it.
 *
 * Triggering only ever resubmits our own public URLs, so it is safe to leave
 * open; when INDEXNOW_TRIGGER_TOKEN is set, a matching `token` (query or
 * `x-indexnow-token` header) is required as a light guard against noise.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function handle(request: Request): Promise<Response> {
  if (!indexNowKey()) {
    return NextResponse.json({ ok: false, error: "INDEXNOW_KEY is not configured" }, { status: 503 });
  }

  const requiredToken = process.env.INDEXNOW_TRIGGER_TOKEN?.trim();
  if (requiredToken) {
    const url = new URL(request.url);
    const provided = request.headers.get("x-indexnow-token") ?? url.searchParams.get("token") ?? "";
    if (provided !== requiredToken) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
  }

  const urls = sitemap().map((entry) => entry.url);
  const result = await submitUrls(urls);
  return NextResponse.json(
    { ok: result.ok, submitted: result.submitted, batches: result.batches, statuses: result.statuses, skipped: result.skipped },
    { status: result.ok || result.submitted === 0 ? 200 : 502 },
  );
}

export async function POST(request: Request) {
  return handle(request);
}

export async function GET(request: Request) {
  return handle(request);
}
