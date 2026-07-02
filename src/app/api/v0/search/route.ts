import { searchEntities, apiResponse, apiError } from "@/platform/open-data";

/**
 * GET /api/v0/search — deterministic, non-semantic entity search.
 * Dynamic (reads query params). Ranking is a fixed rule set, not AI/fuzzy.
 */
export async function GET(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams;
  if (!(params.get("q") ?? "").trim()) return apiError(400, "Missing required query parameter 'q'.");
  const result = searchEntities(params);
  return apiResponse(result, {
    provenance: "Deterministic search over entity names, aliases, and ids. Score reflects a fixed match tier (exact > prefix > alias > substring); there is no semantic or AI ranking.",
    count: result.count,
  });
}
