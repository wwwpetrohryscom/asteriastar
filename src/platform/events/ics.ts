import { BASIS_LABEL, CATEGORY_LABEL, type AstronomicalEvent } from "@/platform/events/model";

/**
 * iCalendar export (RFC 5545).
 *
 * A calendar file leaves the site and lands in software that knows nothing about provenance, so the
 * honesty has to survive the format. Three mechanisms carry it:
 *
 *  - `STATUS:TENTATIVE` on every event that is not confirmed. Planned launches and annual shower
 *    forecasts are tentative in exactly the sense the standard means, and calendar clients show them
 *    differently. Only computed instants and published predictions get `CONFIRMED`.
 *  - The basis is written into the summary in brackets, because most clients show the summary and
 *    nothing else in a month view.
 *  - The description carries the method or the source, the uncertainty, and the link back.
 *
 * Events whose instant is not known to the hour become all-day entries with `VALUE=DATE`, so a
 * launch scheduled to the month does not appear in a calendar at a specific minute it was never
 * claimed to have.
 */

const CRLF = "\r\n";

/**
 * RFC 5545 §3.3.11: backslash, semicolon and comma are escaped; newlines become `\n`.
 *
 * Line endings are normalised FIRST, so a lone carriage return — which the old order left untouched,
 * because it only matched `\r?\n` — cannot survive into a value and be read as a line break by one
 * client and as nothing by another.
 */
function escapeText(value: string): string {
  return value
    .replace(/\r\n?/g, "\n")
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

/**
 * RFC 5545 §3.1: content lines are folded at 75 octets. Folding counts BYTES, not characters, so the
 * measurement is done on the UTF-8 encoding — a degree sign or an en dash is two or three octets, and
 * folding by character length would produce lines that are over the limit and, worse, could split a
 * multi-byte sequence.
 */
function fold(line: string): string {
  const bytes = Buffer.from(line, "utf8");
  if (bytes.length <= 75) return line;
  const parts: string[] = [];
  let start = 0;
  let limit = 75;
  while (start < bytes.length) {
    let end = Math.min(start + limit, bytes.length);
    // Never split inside a UTF-8 sequence: continuation bytes are 10xxxxxx.
    while (end > start && end < bytes.length && (bytes[end] & 0xc0) === 0x80) end -= 1;
    parts.push(bytes.subarray(start, end).toString("utf8"));
    start = end;
    limit = 74; // continuation lines begin with a space, which counts towards the octet limit
  }
  return parts.join(`${CRLF} `);
}

function stampUtc(ms: number): string {
  return new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function dateUtc(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10).replace(/-/g, "");
}

/** Events this coarse become all-day entries rather than pretending to a clock time. */
const ALL_DAY: ReadonlySet<AstronomicalEvent["precision"]> = new Set(["night", "day", "month", "quarter", "year"]);

function describe(event: AstronomicalEvent, siteUrl: string): string {
  const parts: string[] = [event.summary];
  if (event.method) parts.push(`Computed by AsteriaStar: ${event.method.note} (${event.method.algorithm} v${event.method.version}).`);
  if (event.source) parts.push(`Source: ${event.source.label} — ${event.source.url}`);
  if (event.source?.lastVerifiedAt) parts.push(`Source last confirmed this entry at ${event.source.lastVerifiedAt}.`);
  if (event.uncertainty) parts.push(`Uncertainty: ${event.uncertainty}`);
  parts.push(`Applies: ${event.applicability.detail}`);
  for (const fact of event.facts ?? []) parts.push(`${fact.label}: ${fact.value}`);
  parts.push(`More: ${siteUrl}`);
  return parts.join("\n");
}

export interface IcsOptions {
  /** Absolute URL of the page the calendar was exported from. */
  pageUrl: string;
  calendarName: string;
  /** The instant the file was generated; a real time, never a placeholder. */
  nowMs: number;
}

export function toIcs(events: AstronomicalEvent[], options: IcsOptions): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//AsteriaStar//Astronomical Events Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeText(options.calendarName)}`,
    "X-WR-TIMEZONE:UTC",
  ];

  for (const event of events) {
    const start = Date.parse(event.start);
    if (!Number.isFinite(start)) continue;
    const allDay = ALL_DAY.has(event.precision);
    const end = event.end && Number.isFinite(Date.parse(event.end)) ? Date.parse(event.end) : undefined;

    lines.push("BEGIN:VEVENT");
    // Stable across regenerations: the same event exported twice updates in place rather than
    // appearing a second time in the reader's calendar. Escaped like every other TEXT value — an id
    // is partly provider-derived, and a raw semicolon or comma in it is non-conformant and read
    // differently by different clients, which is exactly what a stable UID must not be.
    lines.push(`UID:${escapeText(event.eventId)}@asteriastar`);
    lines.push(`DTSTAMP:${stampUtc(options.nowMs)}`);
    if (allDay) {
      lines.push(`DTSTART;VALUE=DATE:${dateUtc(start)}`);
      // DTEND is exclusive for all-day events, so the day after the last day is the right value.
      lines.push(`DTEND;VALUE=DATE:${dateUtc((end ?? start) + 86_400_000)}`);
    } else {
      lines.push(`DTSTART:${stampUtc(start)}`);
      if (end && end > start) lines.push(`DTEND:${stampUtc(end)}`);
    }
    lines.push(`SUMMARY:${escapeText(`${event.title} [${BASIS_LABEL[event.basis]}]`)}`);
    lines.push(`DESCRIPTION:${escapeText(describe(event, options.pageUrl))}`);
    lines.push(`CATEGORIES:${escapeText(CATEGORY_LABEL[event.category])}`);
    lines.push(`STATUS:${event.confirmed ? "CONFIRMED" : "TENTATIVE"}`);
    lines.push(`URL:${options.pageUrl}`);
    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");
  return `${lines.map(fold).join(CRLF)}${CRLF}`;
}
