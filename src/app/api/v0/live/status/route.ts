import { apiResponse } from "@/platform/open-data";
import { liveScientificDataEngine } from "@/platform/data-engine/live-data-engine";

/**
 * GET /api/v0/live/status — the honest status of every live scientific-data provider AsteriaStar
 * models: its endpoint, licence and connection state. Static, because it reports the CATALOGUE, not
 * a measurement — the live values themselves are served by /api/v0/live/space-weather and the
 * runtime request record by /api/v0/live/providers. Nothing here is fabricated.
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
