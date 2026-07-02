import { CATALOGUE, apiResponse } from "@/platform/open-data";

/**
 * GET /api/v0/datasets — the full open-data catalogue with real record counts,
 * licenses, formats, and honest status. Static (no query params).
 */
export const dynamic = "force-static";

export function GET(): Response {
  return apiResponse(
    { count: CATALOGUE.length, datasets: CATALOGUE },
    {
      provenance: "The unified dataset catalogue: domain datasets plus graph-level datasets. Record counts are computed from the engine; download checksums come from the export manifest.",
      count: CATALOGUE.length,
    },
  );
}
