import { apiResponse, apiError } from "@/platform/open-data";
import { getCitation, formatCitationAll } from "@/lib/citations";

/**
 * GET /api/v0/citations/[id] — a single citation with its formatted references.
 * Dynamic (per-id); returns 404 if unknown. Read-only.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await params;
  const decoded = decodeURIComponent(id);
  const citation = getCitation(decoded);
  if (!citation) return apiError(404, `No citation with id '${decoded}'.`);
  return apiResponse(
    { ...citation, formats: formatCitationAll(citation) },
    {
      provenance: "Citation registry entry, formatted through the citation engine. Fields are real; DOIs are verified, never invented.",
      license: "CC BY-SA 4.0 (citation metadata); the cited work retains its own terms.",
    },
  );
}
