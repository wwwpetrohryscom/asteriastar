import { traverse, apiResponse, apiError } from "@/platform/open-data";

/**
 * GET /api/v0/traversal — breadth-first graph traversal from a start entity.
 * Dynamic (reads query params). Cycle-protected; bounded by maxDepth and limit.
 */
export async function GET(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams;
  if (!params.get("start")) return apiError(400, "Missing required query parameter 'start'.");
  const result = traverse(params);
  if ("error" in result) return apiError(404, result.error ?? "Traversal failed.");
  return apiResponse(result, {
    provenance: "Breadth-first traversal via the traversal engine. Cycle-safe; truncation (if any) is reported in `warnings`. Edges retain their real relation type and domain.",
    count: result.nodes.length,
  });
}
