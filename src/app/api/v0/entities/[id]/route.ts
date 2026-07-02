import { getEntity, apiResponse, apiError } from "@/platform/open-data";

/**
 * GET /api/v0/entities/[id] — resolve one entity by stable id (type:slug),
 * including its typed relationships. Dynamic (per-id); returns 404 if unknown.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await params;
  const entity = getEntity(decodeURIComponent(id));
  if (!entity) return apiError(404, `No entity with id '${decodeURIComponent(id)}'.`);
  return apiResponse(entity, {
    provenance: "Resolved through the entity engine; relationships are the entity's real graph connections across all domains.",
  });
}
