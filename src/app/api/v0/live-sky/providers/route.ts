import { apiResponse } from "@/platform/open-data";
import { liveSkyEngine } from "@/platform/data-engine/live-sky-engine";

/**
 * GET /api/v0/live-sky/providers — the external-provider registry the live-sky
 * layer is designed to integrate. Static. Integration status is honest: no
 * provider is connected, so no live observational data is served.
 */
export const dynamic = "force-static";

export function GET(): Response {
  const providers = liveSkyEngine.providers().map((p) => ({
    id: p.key,
    name: p.name,
    organization: p.organization,
    url: p.url,
    status: p.status,
    access: p.access,
    license: p.license,
    dataKinds: p.dataKinds,
    sources: p.sources,
  }));
  return apiResponse(
    { count: providers.length, connected: liveSkyEngine.connectedProviderCount, providers },
    {
      provenance: "Provider registry via the live-sky engine. Every provider reports its real integration status; `connected` is the count of live integrations (currently none).",
      count: providers.length,
    },
  );
}
