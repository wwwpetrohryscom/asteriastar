import { listEntities, apiResponse } from "@/platform/open-data";

/**
 * GET /api/v0/entities — paginated list of canonical entities.
 * Dynamic (reads query params); deterministic and read-only.
 */
export async function GET(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams;
  const result = listEntities(params);
  return apiResponse(result, {
    provenance: "Projection of the canonical knowledge graph via the entity engine. Filters applied server-side; order is stable by entity id.",
    count: result.count,
  });
}
