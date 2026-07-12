import { apiResponse } from "@/platform/open-data";
import { MISSION_PRIMARY_META, wikidataMigrationStatus, primaryConflicts } from "@/knowledge-graph/data/mission-primary";

/**
 * GET /api/v0/authority/mission-primary — primary mission engineering verification
 * (Program 4). Reports, per field, how many committed Wikidata/catalogue values are now
 * confirmed by an official agency primary source vs still resting on a secondary source,
 * plus every surfaced primary-vs-committed conflict (both values preserved). Every figure
 * is computed from the committed corroboration snapshot; a value is confirmed only when the
 * primary document literally contains it — nothing is transcribed from the page.
 */
export const dynamic = "force-dynamic";
export async function GET(): Promise<Response> {
  return apiResponse(
    { meta: MISSION_PRIMARY_META, wikidataMigration: wikidataMigrationStatus(), conflicts: primaryConflicts() },
    { provenance: "Corroboration of committed values against official agency primary sources; confirmed only when the primary document literally contains the value; conflicts preserve both values." },
  );
}
