import { listRelationships, apiResponse } from "@/platform/open-data";

/**
 * GET /api/v0/relationships — paginated, filterable list of typed relationships.
 * Dynamic (reads query params). Interpretive links are never labelled science.
 */
export async function GET(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams;
  const result = listRelationships(params);
  return apiResponse(result, {
    provenance: "Projection of the canonical graph's typed relationships via the relationship engine. Each edge keeps its domain and confidence.",
    count: result.count,
  });
}
