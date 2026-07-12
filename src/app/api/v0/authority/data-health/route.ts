import { apiResponse } from "@/platform/open-data";
import { dataHealth } from "@/lib/data-health/metrics";

/**
 * GET /api/v0/authority/data-health — the full data-health snapshot: coverage,
 * quality, derived, freshness and provider status. Every figure is computed from the
 * live registries; freshness is evaluated against the current instant.
 */
export const dynamic = "force-dynamic";
export async function GET(): Promise<Response> {
  const h = dataHealth();
  return apiResponse(h, { provenance: "Computed from the live provenance registry and committed snapshots; no hard-coded totals." });
}
