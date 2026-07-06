import { apiResponse } from "@/platform/open-data";
import { liveScientificDataEngine } from "@/platform/data-engine/live-data-engine";

/**
 * GET /api/v0/live/status — the honest status of every live scientific-data provider AsteriaStar
 * models. Static. No provider is connected in this deployment, so no live value is served; every
 * provider reports its real status, endpoint, and licence. Nothing is fabricated.
 */
export const dynamic = "force-static";

export function GET(): Response {
  const report = liveScientificDataEngine.statusReport();
  return apiResponse(
    {
      total: report.total,
      connected: report.connected,
      planned: report.planned,
      byStatus: report.byStatus,
      providers: report.sources,
    },
    {
      provenance: report.generatedNote,
      count: report.total,
    },
  );
}
