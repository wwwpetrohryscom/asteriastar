import { apiResponse } from "@/platform/open-data";
import { getAllSources } from "@/lib/sources";

/**
 * GET /api/v0/sources — the platform's authoritative source registry: every source's name,
 * organisation, canonical URL, scope, authority type, and usage terms. Static and real — the basis of
 * every citation's provenance. Nothing is fabricated.
 */
export const dynamic = "force-static";

export function GET(): Response {
  const sources = getAllSources().map((s) => ({
    key: s.key,
    name: s.name,
    organization: s.organization,
    url: s.url,
    scope: s.scope,
    country: s.country,
    authorityType: s.authorityType,
    usage: s.usage,
  }));
  return apiResponse(
    { count: sources.length, sources },
    {
      provenance: "The platform's authoritative source registry (src/lib/sources). Every source carries its real organisation, canonical URL, scope, authority type, and usage terms; this is the provenance behind every cited fact.",
      count: sources.length,
    },
  );
}
