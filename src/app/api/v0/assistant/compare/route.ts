import { apiError, apiResponse } from "@/platform/open-data";
import { engine } from "@/platform/data-engine";

/**
 * GET /api/v0/assistant/compare?a=<entityId>&b=<entityId> — a grounded comparison of two entities by the
 * real common ground between them: the entities they BOTH connect to in the graph. Deterministic; no
 * language model. A comparison built from real relations, not rhetoric.
 */
export async function GET(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams;
  const a = params.get("a");
  const b = params.get("b");
  if (!a || !b) return apiError(400, "Missing required query parameters 'a' and 'b'.");
  const result = engine.groundedAssistant.compare(a, b);
  if (!result) return apiError(404, "One or both entities were not found.");
  return apiResponse(result, {
    provenance: "Grounded comparison: the shared entities both inputs connect to in the knowledge graph. Deterministic, no language model; every shared item is a real graph neighbour of both.",
    count: result.shared.length,
  });
}
