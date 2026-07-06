import { apiError, apiResponse } from "@/platform/open-data";
import { engine } from "@/platform/data-engine";

/**
 * GET /api/v0/assistant/explain?id=<entityId> — a grounded explanation of an entity: its description,
 * its real relations, and its cited sources. Deterministic; no language model. Nothing is generated.
 */
export async function GET(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams;
  const id = params.get("id");
  if (!id) return apiError(400, "Missing required query parameter 'id'.");
  const result = engine.groundedAssistant.explain(id);
  if (!result) return apiError(404, `No entity found for id '${id}'.`);
  const citations = engine.groundedAssistant.citations(id);
  return apiResponse(
    { ...result, citations: citations?.citations ?? [] },
    {
      provenance: "Grounded explanation assembled ONLY from the entity's own description, its real graph relations, and its cited sources. Deterministic, no language model; nothing generated or invented.",
      count: result.links.length,
    },
  );
}
