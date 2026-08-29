import { loadProduct, type ParseResult } from "@/platform/live-providers/client";
import { array, boundedNum, flareClass, line, record, text, timestamp } from "@/platform/live-providers/normalise";
import type { LiveEnvelope } from "@/platform/live-providers/envelope";
import type { DonkiCmeEvent, DonkiFlareEvent, DonkiSepEvent, DonkiStormEvent } from "@/platform/space-weather/model";

/**
 * NASA CCMC DONKI client.
 *
 * DONKI is an analyst-curated research catalogue, not an operational feed, and CCMC says so
 * plainly: its contents are "prototyping quality and in research context". That caveat travels
 * with every event this client returns — DONKI answers "what happened", SWPC answers "what is
 * happening", and the two are never presented as the same claim.
 *
 * Every event is dropped unless it carries an identifier and a real timestamp. Curation lags
 * reality, so an empty result means "nothing catalogued yet", which is what the pages say — never
 * "nothing happened".
 */

/** DONKI links point back into its own viewer; anything else in that field is not a DONKI link. */
function donkiLink(value: unknown): string | undefined {
  const l = line(value, 300);
  if (!l) return undefined;
  try {
    const u = new URL(l);
    return u.protocol === "https:" && u.hostname.endsWith(".nasa.gov") ? u.toString() : undefined;
  } catch {
    return undefined;
  }
}

/** Instrument display names, deduplicated and bounded. */
function instruments(value: unknown): string[] {
  const out: string[] = [];
  for (const i of array(value)) {
    const o = record(i);
    const name = line(o?.displayName, 80);
    if (name && !out.includes(name)) out.push(name);
    if (out.length >= 8) break;
  }
  return out;
}

/* ----------------------------------------------------------------- flares */

function parseFlares(raw: unknown): ParseResult<DonkiFlareEvent[]> {
  if (!Array.isArray(raw)) return { ok: false, problem: "expected an array of flare records" };
  const events: DonkiFlareEvent[] = [];
  for (const r of raw) {
    const o = record(r);
    if (!o) continue;
    const id = line(o.flrID, 64);
    const beganAt = timestamp(o.beginTime);
    if (!id || !beganAt) continue;
    events.push({
      id,
      beganAt,
      peakedAt: timestamp(o.peakTime),
      endedAt: timestamp(o.endTime),
      flareClass: flareClass(o.classType),
      sourceLocation: line(o.sourceLocation, 16),
      activeRegion: boundedNum(o.activeRegionNum, 1, 99999),
      instruments: instruments(o.instruments),
      link: donkiLink(o.link),
      note: text(o.note, 600),
    });
  }
  events.sort((a, b) => b.beganAt.localeCompare(a.beganAt));
  return { ok: true, value: events };
}

export function flares(): Promise<LiveEnvelope<DonkiFlareEvent[]>> {
  return loadProduct("donki:flares", parseFlares);
}

/* ------------------------------------------------------------------- CMEs */

/**
 * A CME may carry several analyses; DONKI marks at most one `isMostAccurate`. That one is used,
 * and the flag is carried through — a speed from a preliminary fit is not the same number as a
 * speed from the accepted one, and a page that hides the difference is overstating what is known.
 */
function bestAnalysis(value: unknown): DonkiCmeEvent["analysis"] {
  const analyses = array(value).map(record).filter((a): a is Record<string, unknown> => Boolean(a));
  if (analyses.length === 0) return undefined;
  const chosen = analyses.find((a) => a.isMostAccurate === true) ?? analyses[analyses.length - 1];
  const speedKmS = boundedNum(chosen.speed, 50, 5000);
  const halfAngleDeg = boundedNum(chosen.halfAngle, 0, 180);
  const type = line(chosen.type, 8);
  if (speedKmS === undefined && halfAngleDeg === undefined && !type) return undefined;
  return { speedKmS, halfAngleDeg, type, isMostAccurate: chosen.isMostAccurate === true };
}

function parseCmes(raw: unknown): ParseResult<DonkiCmeEvent[]> {
  if (!Array.isArray(raw)) return { ok: false, problem: "expected an array of CME records" };
  const events: DonkiCmeEvent[] = [];
  for (const r of raw) {
    const o = record(r);
    if (!o) continue;
    const id = line(o.activityID, 64);
    const startedAt = timestamp(o.startTime);
    if (!id || !startedAt) continue;
    events.push({
      id,
      startedAt,
      sourceLocation: line(o.sourceLocation, 16),
      activeRegion: boundedNum(o.activeRegionNum, 1, 99999),
      instruments: instruments(o.instruments),
      link: donkiLink(o.link),
      note: text(o.note, 600),
      analysis: bestAnalysis(o.cmeAnalyses),
    });
  }
  events.sort((a, b) => b.startedAt.localeCompare(a.startedAt));
  return { ok: true, value: events };
}

export function cmes(): Promise<LiveEnvelope<DonkiCmeEvent[]>> {
  return loadProduct("donki:cmes", parseCmes);
}

/* ------------------------------------------------------- geomagnetic storms */

function parseStorms(raw: unknown): ParseResult<DonkiStormEvent[]> {
  if (!Array.isArray(raw)) return { ok: false, problem: "expected an array of storm records" };
  const events: DonkiStormEvent[] = [];
  for (const r of raw) {
    const o = record(r);
    if (!o) continue;
    const id = line(o.gstID, 64);
    const startedAt = timestamp(o.startTime);
    if (!id || !startedAt) continue;

    const kpValues: DonkiStormEvent["kpValues"] = [];
    for (const k of array(o.allKpIndex)) {
      const ko = record(k);
      const observedAt = timestamp(ko?.observedTime);
      const kp = boundedNum(ko?.kpIndex, 0, 9);
      if (!observedAt || kp === undefined) continue;
      kpValues.push({ observedAt, kp, source: line(ko?.source, 24) });
    }
    kpValues.sort((a, b) => a.observedAt.localeCompare(b.observedAt));

    events.push({
      id,
      startedAt,
      link: donkiLink(o.link),
      kpValues,
      maxKp: kpValues.length > 0 ? Math.max(...kpValues.map((k) => k.kp)) : undefined,
    });
  }
  events.sort((a, b) => b.startedAt.localeCompare(a.startedAt));
  return { ok: true, value: events };
}

export function geomagneticStorms(): Promise<LiveEnvelope<DonkiStormEvent[]>> {
  return loadProduct("donki:geomagnetic-storms", parseStorms);
}

/* ------------------------------------------ solar energetic particle events */

function parseSep(raw: unknown): ParseResult<DonkiSepEvent[]> {
  if (!Array.isArray(raw)) return { ok: false, problem: "expected an array of SEP records" };
  const events: DonkiSepEvent[] = [];
  for (const r of raw) {
    const o = record(r);
    if (!o) continue;
    const id = line(o.sepID, 64);
    const eventAt = timestamp(o.eventTime);
    if (!id || !eventAt) continue;
    events.push({ id, eventAt, instruments: instruments(o.instruments), link: donkiLink(o.link) });
  }
  events.sort((a, b) => b.eventAt.localeCompare(a.eventAt));
  return { ok: true, value: events };
}

export function sepEvents(): Promise<LiveEnvelope<DonkiSepEvent[]>> {
  return loadProduct("donki:sep", parseSep);
}
