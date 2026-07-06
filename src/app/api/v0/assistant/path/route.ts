import { apiError, apiResponse } from "@/platform/open-data";
import { engine } from "@/platform/data-engine";

/**
 * GET /api/v0/assistant/path?from=<entityId>&to=<entityId> — the shortest evidence path between two
 * entities: a real chain of graph relations connecting them. Deterministic; no language model. Returns
 * an empty path when the two are identical, and 404 with an honest message when no path exists.
 */
export async function GET(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams;
  const from = params.get("from");
  const to = params.get("to");
  if (!from || !to) return apiError(400, "Missing required query parameters 'from' and 'to'.");
  const path = engine.groundedAssistant.evidencePath(from, to);
  if (path === null) return apiError(404, `No evidence path found between '${from}' and '${to}' — not enough graph evidence to connect them.`);
  return apiResponse(
    { from, to, length: path.length, path },
    {
      provenance: "Shortest evidence path via breadth-first search over the real knowledge graph. Every step is a genuine relation; the path can be checked link by link. Deterministic, no language model.",
      count: path.length,
    },
  );
}
