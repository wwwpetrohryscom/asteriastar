import { array, line, record, timestamp } from "@/platform/live-providers/normalise";
import type { ParseResult } from "@/platform/live-providers/client";
import type { AstronomicalEvent, EventPrecision } from "@/platform/events/model";

/**
 * Upcoming orbital launches, from the Launch Library API.
 *
 * This is the one provider in the calendar that is not a space agency, and it is labelled that way
 * everywhere it appears. There is no authoritative machine-readable global launch schedule: each
 * operator announces its own launches, in prose, on its own site, on its own timetable. The Space
 * Devs maintain an open database that aggregates those announcements, and it carries the two fields
 * that make an honest launch calendar possible at all:
 *
 *  - `last_updated` — when the entry was last confirmed. A launch date nobody has touched in three
 *    weeks is a rumour with a timestamp, and this is how a reader can tell.
 *  - `net_precision` — how precisely the date is known, from "Second" down to "Year". A launch
 *    scheduled to the quarter and a launch scheduled to the second render identically everywhere
 *    else; here they do not.
 *
 * Every launch is therefore a PLANNED event: never marked confirmed, never given more precision
 * than the provider claims for it, and always shown with the age of its last confirmation. Launch
 * dates move, and this calendar says so rather than pretending otherwise.
 */

export const LAUNCH_API_URL = "https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=40&mode=list";
export const LAUNCH_DOCS_URL = "https://thespacedevs.com/llapi";

/**
 * The provider's precision vocabulary, mapped onto ours.
 *
 * The quarter case is a regular expression rather than a key, and that is not tidiness. The provider
 * does not emit the word "Quarter": it emits "Quarter 3" and "Quarter 4", and a table keyed on
 * "Quarter" therefore missed EVERY quarter-precision launch and fell through to "day" — eight of the
 * forty in the feed on the day this was written, each rendering as a definite calendar date for an
 * entry the provider itself marks "To Be Determined". That is precisely the failure this module
 * exists to prevent, and it survived because the fixtures used a word the API never sends.
 *
 * Anything still unrecognised falls back to a day, and the provider's own label is shown alongside
 * regardless, so the next vocabulary change is visible on the page instead of silently flattened.
 */
const PRECISION: Record<string, EventPrecision> = {
  Second: "minute",
  Minute: "minute",
  Hour: "hour",
  Day: "day",
  Month: "month",
  Year: "year",
};

/** `Quarter`, `Quarter 3`, `Q4` — every form the provider has been seen to use, and the obvious kin. */
const QUARTER_RE = /^(quarter|q)\s*[1-4]?$/i;

function mapPrecision(providerWord: string | undefined): EventPrecision {
  if (!providerWord) return "day";
  if (QUARTER_RE.test(providerWord)) return "quarter";
  return PRECISION[providerWord] ?? "day";
}

/**
 * The most launches this integration will accept from one response.
 *
 * The URL asks for forty. The byte ceiling alone would admit about three and a half thousand, which
 * renders to ten megabytes of HTML and a three-and-a-half megabyte calendar file — past the response
 * limit of the platform this runs on. A provider changing its default page size should not be able
 * to do that, so the count is bounded here as well as in the query string.
 */
const MAX_LAUNCHES = 60;

export interface UpcomingLaunch {
  id: string;
  name: string;
  /** No Earlier Than, ISO 8601 UTC. */
  net: string;
  /** The provider's word for how precisely `net` is known. */
  netPrecision?: string;
  precision: EventPrecision;
  windowStart?: string;
  windowEnd?: string;
  /** The provider's scheduling status, e.g. "Go for Launch", "To Be Determined". */
  status?: string;
  statusDescription?: string;
  provider?: string;
  mission?: string;
  missionType?: string;
  pad?: string;
  location?: string;
  /** When the provider last confirmed this entry. */
  lastUpdated?: string;
  /** The provider's own record for this launch. */
  detailUrl?: string;
}

export interface LaunchFeed {
  total: number;
  launches: UpcomingLaunch[];
}

export function parseLaunches(raw: unknown): ParseResult<LaunchFeed> {
  const root = record(raw);
  if (!root) return { ok: false, problem: "launch feed was not a JSON object" };
  const rows = array(root.results);
  if (rows.length === 0) return { ok: false, problem: "launch feed contained no results" };

  const launches: UpcomingLaunch[] = [];
  for (const row of rows) {
    const r = record(row);
    if (!r) continue;
    const id = line(r.id, 64);
    const name = line(r.name, 200);
    const net = timestamp(r.net);
    // A truncated identifier is not an identifier. `line` marks what it shortens with an ellipsis,
    // and two overlong ids sharing a prefix would collapse to the same event — one silently
    // replacing the other in a reader's subscribed calendar. Real ids here are UUIDs; anything that
    // needed shortening is not one, and the row is dropped rather than given a colliding key.
    if (!id || !name || !net || id.endsWith("\u2026")) continue;

    const status = record(r.status);
    const precisionRecord = record(r.net_precision);
    const netPrecision = line(precisionRecord?.name, 40);
    const detail = line(r.url, 300);

    launches.push({
      id,
      name,
      net,
      netPrecision,
      precision: mapPrecision(netPrecision),
      windowStart: timestamp(r.window_start),
      windowEnd: timestamp(r.window_end),
      status: line(status?.name, 80),
      statusDescription: line(status?.description, 300),
      provider: line(r.lsp_name, 120),
      mission: line(r.mission, 200),
      missionType: line(r.mission_type, 80),
      pad: line(r.pad, 160),
      location: line(r.location, 160),
      lastUpdated: timestamp(r.last_updated),
      // Only the provider's own https record is kept; anything else is dropped rather than linked.
      detailUrl: detail && detail.startsWith("https://ll.thespacedevs.com/") ? detail : undefined,
    });
  }

  /*
   * A single unreadable row is skipped here, unlike the eclipse catalogue, where an unreadable row
   * fails the whole response. The difference is that the canon has a KNOWN total — two hundred and
   * twenty-four solar eclipses this century — so a skipped row is a missing eclipse that nothing
   * else would reveal. A launch feed is open-ended and its contents change hourly; there is no total
   * to check against, and discarding thirty-nine good launches because the fortieth was malformed
   * would be the worse failure. If nothing at all survives, that is refused.
   */
  if (launches.length === 0) return { ok: false, problem: "no launch rows in the feed had a usable name and NET" };
  launches.sort((a, b) => Date.parse(a.net) - Date.parse(b.net));
  // `total` is the number KEPT, and the soonest launches are the ones kept — a truncated feed must
  // not report a count it is not showing.
  const kept = launches.slice(0, MAX_LAUNCHES);
  return { ok: true, value: { total: kept.length, launches: kept } };
}

/** How stale a confirmation is, in words a reader can weigh. */
export function confirmationAge(lastUpdated: string | undefined, nowMs: number): string {
  if (!lastUpdated) return "The provider does not record when this entry was last confirmed, so its age is unknown.";
  const hours = (nowMs - Date.parse(lastUpdated)) / 3_600_000;
  if (!Number.isFinite(hours)) return "The provider does not record when this entry was last confirmed, so its age is unknown.";
  if (hours < 0) return "Last confirmed by the provider just now.";
  if (hours < 48) return `Last confirmed by the provider ${Math.max(1, Math.round(hours))} hours ago.`;
  const days = Math.round(hours / 24);
  if (days <= 14) return `Last confirmed by the provider ${days} days ago.`;
  return `Last confirmed by the provider ${days} days ago — long enough that the date may have moved without the entry being updated.`;
}

export function launchEvents(feed: LaunchFeed, fromMs: number, toMs: number, nowMs: number): AstronomicalEvent[] {
  return feed.launches
    .filter((l) => {
      const t = Date.parse(l.net);
      return t >= fromMs && t <= toMs;
    })
    .map((l) => {
      const where = [l.pad, l.location].filter(Boolean).join(", ");
      const facts: { label: string; value: string }[] = [];
      if (l.status) facts.push({ label: "Provider status", value: l.statusDescription ? `${l.status} — ${l.statusDescription}` : l.status });
      if (l.netPrecision) facts.push({ label: "Date known to the", value: `${l.netPrecision.toLowerCase()}, as the provider states it` });
      if (l.provider) facts.push({ label: "Launch provider", value: l.provider });
      if (l.missionType) facts.push({ label: "Mission type", value: l.missionType });
      if (where) facts.push({ label: "Launch site", value: where });
      if (l.windowStart && l.windowEnd && l.windowEnd !== l.windowStart) {
        facts.push({ label: "Launch window", value: `${l.windowStart} to ${l.windowEnd}` });
      }
      facts.push({ label: "Last confirmed", value: confirmationAge(l.lastUpdated, nowMs) });

      return {
        eventId: `launch-${l.id}`,
        title: l.name,
        summary: `${l.mission ? `${l.mission}. ` : ""}A planned launch, not a fixed one: the time shown is the provider's No Earlier Than date${l.netPrecision ? `, known to the ${l.netPrecision.toLowerCase()}` : ""}. ${confirmationAge(l.lastUpdated, nowMs)}`,
        category: "launch",
        eventType: "orbital-launch",
        basis: "planned",
        start: l.net,
        precision: l.precision,
        applicability: {
          scope: "site",
          detail: where ? `Lifts off from ${where}. Whether it is visible to you depends entirely on where you are relative to the site and the trajectory.` : "Launch site not stated by the provider.",
        },
        source: {
          providerKey: "thespacedevs-launchlibrary",
          label: "Launch Library 2 (The Space Devs) — a community-maintained aggregator of operator announcements, not an agency schedule",
          url: l.detailUrl ?? LAUNCH_API_URL,
          lastVerifiedAt: l.lastUpdated,
        },
        uncertainty: `Planned dates move, routinely by weeks. ${l.netPrecision === "Second" || l.netPrecision === "Minute" ? "This one is currently held to the minute, which usually means it is close and confirmed." : "This one is not yet held to a precise time."}`,
        confirmed: false,
        facts,
      } satisfies AstronomicalEvent;
    });
}
