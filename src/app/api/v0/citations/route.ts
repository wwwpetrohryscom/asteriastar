import { apiResponse } from "@/platform/open-data";
import { CITATIONS } from "@/lib/citations";

/**
 * GET /api/v0/citations — the real citation registry, filterable by type,
 * source, entity, or dataset. Read-only, deterministic, engine-backed. No writes.
 */
export async function GET(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams;
  const type = params.get("type");
  const source = params.get("source");
  const entity = params.get("entity");
  const dataset = params.get("dataset");
  const rawLimit = Number(params.get("limit"));
  const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(Math.floor(rawLimit), 500) : 200;
  const offset = Math.max(0, Number(params.get("offset")) || 0);

  let list = CITATIONS;
  if (type) list = list.filter((c) => c.type === type);
  if (source) list = list.filter((c) => c.source === source);
  if (entity) list = list.filter((c) => c.entityIds?.includes(entity));
  if (dataset) list = list.filter((c) => c.datasetIds?.includes(dataset));
  const sorted = list.slice().sort((a, b) => a.id.localeCompare(b.id));
  const page = sorted.slice(offset, offset + limit);

  return apiResponse(
    { total: sorted.length, offset, limit, count: page.length, items: page },
    {
      provenance: "The citation registry. Every record is source-backed with a canonical URL; DOIs appear only where verified. No fabricated citations.",
      license: "CC BY-SA 4.0 (citation metadata); cited works retain their own terms.",
      count: page.length,
    },
  );
}
