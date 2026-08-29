import { apiError, apiResponse } from "@/platform/open-data";
import { neoSnapshot, matchCatalogue, reage } from "@/platform/neo/service";
import { liveCacheControl } from "@/platform/space-weather/api";

/**
 * GET /api/v0/live/neo/{designation} — everything the live feeds currently say about one object.
 *
 * THIS ENDPOINT DOES NOT PROXY THE PROVIDER. The designation comes from the request, and no value
 * from a request is ever placed into a provider URL anywhere in this codebase — that is the rule the
 * fetch guard exists to enforce and it is not weakened for convenience here. Instead the four feeds
 * are loaded exactly as every page loads them, from their own constant URLs and the same cache, and
 * the designation is matched locally.
 *
 * The consequence is worth stating plainly in the response: an object absent from these feeds is not
 * necessarily absent from JPL's database. It is absent from the close-approach window, the Sentry
 * table, the recent-entries query and the confirmation page — which is a much narrower claim, and
 * the only one this endpoint is entitled to make.
 */
export const dynamic = "force-dynamic";

/** Fold a designation for comparison: case, spaces and punctuation removed. */
function fold(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export async function GET(req: Request, { params }: { params: Promise<{ designation: string }> }): Promise<Response> {
  const { designation: raw } = await params;

  // Next hands this already decoded, but a stray "%" survives into it and `decodeURIComponent`
  // THROWS on one — turning the documented 400 into an unhandled 500. Decoding is attempted for
  // the double-encoded case and the raw value is used when it fails.
  let requested: string;
  try {
    requested = decodeURIComponent(raw ?? "").trim();
  } catch {
    requested = (raw ?? "").trim();
  }

  // Bounded and character-checked before it is used for anything, including a comparison: a
  // designation is letters, digits, spaces, hyphens and slashes, and nothing else.
  if (!requested || requested.length > 40 || !/^[A-Za-z0-9 ./-]+$/.test(requested)) {
    return apiError(400, "designation must be 1-40 characters of letters, digits, spaces, dots, slashes or hyphens (e.g. 99942, 2004 MN4, 2026 QQ1).");
  }

  const now = new Date();
  const s = reage(await neoSnapshot(), now.toISOString());
  const key = fold(requested);

  const approaches = (s.closeApproaches.data ?? []).filter((a) => fold(a.designation) === key);
  const sentry = (s.sentry.data ?? []).find((o) => fold(o.designation) === key);
  const recent = (s.recent.data ?? []).find((r) => fold(r.designation) === key);
  const candidate = (s.candidates.data ?? []).find((c) => fold(c.temporaryDesignation) === key);

  const found = approaches.length > 0 || sentry || recent || candidate;
  const catalogue = matchCatalogue(requested, approaches[0]?.fullName ?? sentry?.fullName ?? recent?.fullName);

  return apiResponse(
    {
      designation: requested,
      foundInLiveFeeds: Boolean(found),
      catalogue,
      closeApproaches: approaches,
      sentry: sentry ?? null,
      recentEntry: recent ?? null,
      confirmationPageCandidate: candidate ?? null,
    },
    {
      provenance: found
        ? "Assembled from the live close-approach, Sentry, recent-entry and confirmation-page feeds. No request was made to a provider for this designation: the designation came from the URL, and no value from a request is ever placed into a provider URL."
        : "This designation appears in none of the four live feeds AsteriaStar reads. That is NOT a statement that the object does not exist or is unknown to JPL — only that it is not currently in the close-approach window, on the Sentry table, among recent database entries, or on the Minor Planet Centre's confirmation page.",
      license: "Underlying data: public domain (US Government work) NASA/JPL-Caltech, and public IAU Minor Planet Center data.",
      source: "NASA/JPL Center for Near-Earth Object Studies and the IAU Minor Planet Center, via the AsteriaStar live-provider runtime",
      generatedAt: now.toISOString(),
      count: approaches.length,
      cacheControl: liveCacheControl(["jpl:close-approaches", "jpl:sentry", "jpl:recent-neos", "mpc:neocp"]),
    },
  );
}
