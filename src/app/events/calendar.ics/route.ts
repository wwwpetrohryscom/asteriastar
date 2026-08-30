import { buildCalendar, rollingYear } from "@/platform/events/service";
import { toIcs } from "@/platform/events/ics";
import { SITE_URL } from "@/lib/site";
import { ROUTES } from "@/lib/routes";

/**
 * GET /events/calendar.ics — the next year of events as an iCalendar file.
 *
 * Subscribable, not just downloadable: calendar clients poll this URL, so the UIDs are stable and an
 * event that moves updates in place rather than appearing twice. Everything unconfirmed —
 * launches, annual shower forecasts — is marked `STATUS:TENTATIVE`, which is the only mechanism the
 * format has for saying "this date may move" and which clients render differently.
 *
 * A provider outage produces a smaller file, never a wrong one: whatever could be assembled is
 * exported and the rest is simply absent, exactly as on the pages.
 */
export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  const now = new Date();
  const window = rollingYear(now.getTime());
  const calendar = await buildCalendar(window.fromMs, window.toMs, { now });

  const body = toIcs(calendar.events, {
    pageUrl: `${SITE_URL}${ROUTES.events}`,
    calendarName: "AsteriaStar — Observing Calendar",
    nowMs: now.getTime(),
  });

  return new Response(body, {
    headers: {
      "content-type": "text/calendar; charset=utf-8",
      // Named so a download lands with a sensible filename, without forcing an attachment on a
      // client that would rather subscribe.
      "content-disposition": 'inline; filename="asteriastar-events.ics"',
      // Half an hour matches the launch feed's cache: the computed events would be good for a year,
      // but the file is one document and its freshness is that of its shortest-lived part.
      "cache-control": "public, max-age=0, s-maxage=1800, stale-while-revalidate=1800",
      "x-content-type-options": "nosniff",
    },
  });
}
