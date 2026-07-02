"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Location-aware Moon panel (Program R). Takes an EXPLICIT latitude, longitude,
 * optional date, and optional IANA timezone, and fetches computed moonrise,
 * moonset, transit, position, phase, and horizon status from
 * /api/v0/live-sky/moon. It never uses browser geolocation or IP lookup and
 * never stores anything: the coordinates live only in the query for one request.
 * On failure it shows a structured, announced error and no value; polar and
 * no-rise/no-set cases are shown honestly.
 */

interface Ev { iso: string | null; local: string | null; azimuthDeg?: number | null; altitudeDeg?: number | null }
interface MoonPos {
  input: { latitude: number; longitude: number; date: string; timezone: string; utcOffsetMinutes: number };
  referenceTimeIso: string;
  events: { moonrise: Ev; moonset: Ev; lunarTransit: Ev; lunarLowerTransit: Ev };
  position: { altitudeDeg: number; azimuthDeg: number; rightAscensionDeg: number; declinationDeg: number; distanceKm: number; hourAngleDeg: number };
  phase: { phaseName: string; phaseAngleDeg: number; illuminationPercent: number; synodicAgeDays: number; waxing: boolean };
  horizon: { aboveHorizonAtReferenceTime: boolean; alwaysAboveHorizon: boolean; alwaysBelowHorizon: boolean; noMoonrise: boolean; noMoonset: boolean; multipleEventsSameDay: boolean };
  method: string;
  accuracyNotes: string;
  envelope: { generatedAt: string | null; validUntil: string | null; source: string[]; confidence: string; stale: boolean };
}

type State = { kind: "idle" } | { kind: "loading" } | { kind: "ok"; d: MoonPos } | { kind: "error"; msg: string };

function fmtUTC(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toUTCString();
}
/** Compass point for an azimuth in degrees. */
function compass(az: number | null | undefined): string {
  if (az == null) return "";
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return dirs[Math.round(az / 22.5) % 16];
}

export function MoonPositionPanel() {
  const [state, setState] = useState<State>({ kind: "idle" });
  const latRef = useRef<HTMLInputElement>(null);
  const lonRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const tzRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (tzRef.current && !tzRef.current.value) {
      try {
        tzRef.current.value = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
      } catch {
        /* leave blank → UTC */
      }
    }
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    const latitude = latRef.current?.value.trim() ?? "";
    const longitude = lonRef.current?.value.trim() ?? "";
    const date = dateRef.current?.value.trim() ?? "";
    const timezone = tzRef.current?.value.trim() ?? "";
    if (!latitude || !longitude) {
      setState({ kind: "error", msg: "Enter a latitude and a longitude. No location is ever guessed or looked up." });
      return;
    }
    const qs = new URLSearchParams({ latitude, longitude });
    if (date) qs.set("date", date);
    if (timezone) qs.set("timezone", timezone);
    setState({ kind: "loading" });
    try {
      const res = await fetch(`/api/v0/live-sky/moon?${qs.toString()}`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) {
        const msg = json?.error?.message ?? `The request was rejected (${res.status}). No value is shown rather than a fabricated one.`;
        setState({ kind: "error", msg: typeof msg === "string" ? msg : "Invalid request." });
        return;
      }
      setState({ kind: "ok", d: json.data as MoonPos });
    } catch {
      setState({ kind: "error", msg: "The Moon service is unreachable. No value is shown rather than a fabricated one." });
    }
  }

  return (
    <section aria-labelledby="moon-pos-heading" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="moon-pos-heading" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Moonrise, moonset &amp; position</h2>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-400/10 px-2.5 py-0.5 text-xs font-medium text-sky-300">
          <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
          Computed
        </span>
      </div>

      <form onSubmit={onSubmit} className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <label className="text-xs text-faint">Latitude
          <input ref={latRef} name="latitude" type="text" inputMode="decimal" placeholder="51.48" className="mt-1 w-full rounded-lg border border-white/15 bg-white/[0.03] px-2.5 py-1.5 text-sm text-fg outline-none focus:border-sky-400/50" />
        </label>
        <label className="text-xs text-faint">Longitude
          <input ref={lonRef} name="longitude" type="text" inputMode="decimal" placeholder="-0.01" className="mt-1 w-full rounded-lg border border-white/15 bg-white/[0.03] px-2.5 py-1.5 text-sm text-fg outline-none focus:border-sky-400/50" />
        </label>
        <label className="text-xs text-faint">Date <span className="text-faint/70">(optional — now)</span>
          <input ref={dateRef} name="date" type="date" className="mt-1 w-full rounded-lg border border-white/15 bg-white/[0.03] px-2.5 py-1.5 text-sm text-fg outline-none focus:border-sky-400/50" />
        </label>
        <label className="text-xs text-faint">Timezone (IANA)
          <input ref={tzRef} name="timezone" type="text" placeholder="Europe/London" className="mt-1 w-full rounded-lg border border-white/15 bg-white/[0.03] px-2.5 py-1.5 text-sm text-fg outline-none focus:border-sky-400/50" />
        </label>
        <div className="col-span-2 sm:col-span-4">
          <button type="submit" className="rounded-lg border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sm font-medium text-sky-200 transition hover:bg-sky-400/20">Calculate</button>
        </div>
      </form>

      <p className="mt-3 text-xs leading-relaxed text-faint">
        <strong className="text-muted">Privacy:</strong> your location is used only for this calculation and is <strong className="text-muted">not stored</strong>. No browser geolocation or IP lookup is used — coordinates come only from what you type. Leave the date blank for the Moon&apos;s position right now.
      </p>

      {state.kind === "idle" && (
        <p className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm text-muted" role="status">
          The Moon phase and illumination above are global. Enter a latitude and longitude to compute moonrise, moonset, transit, and the Moon&apos;s altitude and azimuth for your location — nothing is shown until you do, and no location is assumed.
        </p>
      )}
      {state.kind === "loading" && <p className="mt-4 text-sm text-faint" role="status">Computing lunar position…</p>}
      {state.kind === "error" && (
        <div role="alert" className="mt-4 rounded-xl border border-rose-400/20 bg-rose-400/[0.04] p-4">
          <p className="text-sm text-rose-200">{state.msg}</p>
        </div>
      )}
      {state.kind === "ok" && <MoonPosResult d={state.d} />}
    </section>
  );
}

function MoonPosResult({ d }: { d: MoonPos }) {
  const h = d.horizon;
  const horizonLabel = h.alwaysAboveHorizon
    ? "Circumpolar — the Moon does not set on this date"
    : h.alwaysBelowHorizon
      ? "The Moon stays below the horizon all day"
      : h.aboveHorizonAtReferenceTime
        ? "The Moon is above the horizon"
        : "The Moon is below the horizon";
  const e = d.events;
  const noEventSub = h.alwaysAboveHorizon ? "up all day" : h.alwaysBelowHorizon ? "below all day" : "none today";
  const riseSub = e.moonrise.azimuthDeg != null ? `${compass(e.moonrise.azimuthDeg)} ${e.moonrise.azimuthDeg}°` : noEventSub;
  const setSub = e.moonset.azimuthDeg != null ? `${compass(e.moonset.azimuthDeg)} ${e.moonset.azimuthDeg}°` : noEventSub;
  const transitSub = e.lunarTransit.altitudeDeg != null ? `alt ${e.lunarTransit.altitudeDeg}°` : (h.alwaysBelowHorizon ? "below all day" : "");

  return (
    <div className="mt-5 space-y-5">
      <div className={`rounded-xl border p-4 ${h.aboveHorizonAtReferenceTime ? "border-emerald-400/25 bg-emerald-400/[0.06]" : "border-white/10 bg-white/[0.02]"}`}>
        <p className="text-sm font-medium text-fg">{horizonLabel}.</p>
        {(h.noMoonrise || h.noMoonset) && !h.alwaysAboveHorizon && !h.alwaysBelowHorizon && (
          <p className="mt-1 text-xs text-faint">{h.noMoonrise ? "No moonrise" : ""}{h.noMoonrise && h.noMoonset ? " or " : ""}{h.noMoonset ? "no moonset" : ""} occurs on this local date — shown as “—”.</p>
        )}
        {h.multipleEventsSameDay && (
          <p className="mt-1 text-xs text-faint">At this latitude the Moon rises or sets more than once on this date; the first of each is shown.</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Stat label="Moonrise" value={e.moonrise.local ?? "—"} sub={riseSub} />
        <Stat label="Transit" value={e.lunarTransit.local ?? "—"} sub={transitSub} />
        <Stat label="Moonset" value={e.moonset.local ?? "—"} sub={setSub} />
      </div>

      <div>
        <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Position &amp; phase <span className="normal-case text-faint/70">({d.input.timezone})</span></h3>
        <dl className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Mini label="Altitude" value={`${d.position.altitudeDeg}°`} />
          <Mini label="Azimuth" value={`${compass(d.position.azimuthDeg)} ${d.position.azimuthDeg}°`} />
          <Mini label="Illumination" value={`${d.phase.illuminationPercent}%`} />
          <Mini label="Distance" value={`${d.position.distanceKm.toLocaleString("en-US")} km`} />
          <Mini label="Phase" value={d.phase.phaseName} />
          <Mini label="Moon age" value={`${d.phase.synodicAgeDays} d`} />
          <Mini label="Trend" value={d.phase.waxing ? "Waxing" : "Waning"} />
          <Mini label="Declination" value={`${d.position.declinationDeg}°`} />
        </dl>
      </div>

      <div className="rounded-xl border border-amber-400/20 bg-amber-400/[0.05] p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-200">Accuracy</p>
        <p className="mt-1 text-xs leading-relaxed text-amber-100/90">{d.accuracyNotes}</p>
      </div>

      <div className="border-t border-white/10 pt-3 text-xs leading-relaxed text-faint">
        <p><strong className="text-muted">Method:</strong> deterministic calculation (not a live provider feed). <strong className="text-muted">Source:</strong> {d.envelope.source.join(", ").toUpperCase()} · confidence {d.envelope.confidence}{d.envelope.stale ? " · stale — refreshing" : ""}.</p>
        <p className="mt-1"><strong className="text-muted">Computed at:</strong> {fmtUTC(d.envelope.generatedAt)} · for {d.input.latitude}°, {d.input.longitude}° · position as of {fmtUTC(d.referenceTimeIso)}.</p>
        <p className="mt-1">
          Programmatic access:{" "}
          <a href={`/api/v0/live-sky/moon?latitude=${d.input.latitude}&longitude=${d.input.longitude}${d.input.timezone !== "UTC" ? `&timezone=${d.input.timezone}` : ""}`} className="text-nebula underline-offset-4 hover:underline">/api/v0/live-sky/moon</a>.
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <div className="text-xs text-faint">{label}</div>
      <div className="mt-1 font-display text-xl font-bold text-fg">{value}</div>
      {sub ? <div className="mt-0.5 text-xs text-faint">{sub}</div> : null}
    </div>
  );
}
function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
      <div className="font-mono text-sm text-fg">{value}</div>
      <div className="mt-0.5 text-xs text-faint">{label}</div>
    </div>
  );
}
