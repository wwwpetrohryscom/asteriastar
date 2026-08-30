import { apiResponse } from "@/platform/open-data";
import { liveCacheControl, serialiseEnvelope } from "@/platform/space-weather/api";
import { upcomingLaunches } from "@/platform/events/service";
import { LAUNCH_DOCS_URL } from "@/platform/events/launches";

/**
 * GET /api/v0/live/events/launches — the upcoming launch schedule, as the provider states it.
 *
 * Two fields matter more than the rest and are passed straight through: `netPrecision`, the
 * provider's own statement of how precisely the date is known, and `lastUpdated`, when the provider
 * last confirmed the entry. Without them a launch date is unusable, and flattening them away would
 * turn intentions into appointments.
 */
export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  const now = new Date();
  const envelope = await upcomingLaunches({ now });

  return apiResponse(serialiseEnvelope(envelope), {
    provenance: `Upcoming orbital launches from Launch Library 2, maintained by The Space Devs — a community aggregation of operator and agency announcements, NOT a schedule published by any space agency (${LAUNCH_DOCS_URL}). Every date is a No Earlier Than value that moves, often by weeks. \`netPrecision\` is the provider's own statement of how precisely the date is known, from the second down to the year, and \`lastUpdated\` is when the provider last confirmed the entry.`,
    license: "Launch Library 2 is offered free of charge by The Space Devs within their stated request rate; attribution is given.",
    source: "Launch Library 2 (The Space Devs)",
    generatedAt: now.toISOString(),
    count: envelope.data?.launches.length ?? 0,
    stale: envelope.stale,
    cacheControl: liveCacheControl(["ll2:upcoming-launches"], !envelope.data),
  });
}
