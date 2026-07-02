import { buildOpenApiSpec } from "@/platform/open-data";

/**
 * GET /api/v0/openapi.json — the OpenAPI 3.1 document for the implemented API.
 * Returned as the bare spec (not envelope-wrapped) so standard OpenAPI tooling
 * can consume it directly. Static and deterministic.
 */
export const dynamic = "force-static";

export function GET(): Response {
  const spec = buildOpenApiSpec();
  return new Response(JSON.stringify(spec, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
