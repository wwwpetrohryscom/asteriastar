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
    provenance:
      "Deterministic search over entity names, aliases, and ids. Score reflects a fixed match tier, strongest first: " +
      "exact title (100) > exact alias or catalogue identifier (90) > title prefix (70) > alias prefix (55) > " +
      "word prefix (45) > all query tokens present (35) > substring (30) > close spelling (10). " +
      "Queries are folded before matching: diacritics stripped, Unicode apostrophes and dashes normalised, and " +
      "identifier separators collapsed so 'M 31', 'M-31' and 'M31' are one query. Close-spelling matches are only " +
      "attempted when a strict pass found almost nothing, so a typo can never displace a real match. " +
      "There is no semantic, learned, or AI ranking. " +
      "SCOPE: this endpoint searches Knowledge Graph entities and the aliases stored ON those entities. " +
      "The on-site search index is additionally enriched at build time with catalogue identifiers that the " +
      "graph does not mirror — HIP/HD/HR/Gliese numbers, Messier/NGC/IC/Caldwell designations, and " +
      "observatory abbreviations such as HST or GBT — so a few identifier queries resolve on the site that " +
      "do not resolve here. Closing that gap means mirroring those identifiers onto the graph entities " +
      "themselves, which is a data change rather than an API change.",
    count: result.count,
  });
}
