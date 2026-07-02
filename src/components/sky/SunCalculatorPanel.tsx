"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Sun & Twilight calculator panel (Program Q). Takes an EXPLICIT latitude,
 * longitude, date, and (optional) IANA timezone, and fetches the computed times
 * from /api/v0/live-sky/sun. It never uses browser geolocation, never looks up
 * the user's location by IP, and never stores anything: the latitude/longitude
 * live only in the query for this one request. On failure it shows a structured
 * error and no value; polar day/night and absent twilight are shown honestly.
 */

interface SunEvent {
  iso: string | null;
  local: string | null;
}
interface SunPayload {
  input: { latitude: number; longitude: number; date: string; timezone: string; utcOffsetMinutes: number };
  events: Record<
    | "sunrise" | "sunset" | "solarNoon"
    | "civilDawn" | "civilDusk" | "nauticalDawn" | "nauticalDusk" | "astronomicalDawn" | "astronomicalDusk",
    SunEvent
  >;
  duration: { daylightMinutes: number; civilTwilightMinutes: number; nauticalTwilightMinutes: number; astronomicalTwilightMinutes: number };
  solar: { declinationDeg: number; equationOfTimeMinutes: number; noonElevationDeg: number };
  status: string[];
  method: string;
  calculationNotes: string;
  envelope: { generatedAt: string | null; validFrom: string | null; validUntil: string | null; source: string[]; confidence: string };
}

const CONDITION_LABEL: Record<string, string> = {
  normal: "Normal day",
  polar_day: "Midnight Sun — the Sun does not set",
  polar_night: "Polar night — the Sun does not rise",
  no_civil_twilight: "No civil darkness (white night)",
  no_nautical_twilight: "No nautical darkness",
  no_astronomical_twilight: "No astronomical night",
};

type State = { kind: "idle" } | { kind: "loading" } | { kind: "ok"; d: SunPayload } | { kind: "error"; msg: string };

function durationLabel(min: number): string {
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  return `${h}h ${String(m).padStart(2, "0")}m`;
}

function fmtUTC(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toUTCString();
}

export function SunCalculatorPanel() {
  const [state, setState] = useState<State>({ kind: "idle" });
  const latRef = useRef<HTMLInputElement>(null);
  const lonRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const tzRef = useRef<HTMLInputElement>(null);

  // Pre-fill the date with today (client-only, via the DOM — no state, so no
  // hydration mismatch) and the timezone with the browser's IANA zone as a
  // convenience default the user can clear or change. Nothing is submitted or
  // stored until the user presses Calculate.
  useEffect(() => {
    if (dateRef.current && !dateRef.current.value) {
      dateRef.current.value = new Date().toISOString().slice(0, 10);
    }
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
      const res = await fetch(`/api/v0/live-sky/sun?${qs.toString()}`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) {
        const msg = json?.error?.message ?? json?.error ?? `The request was rejected (${res.status}). No value is shown rather than a fabricated one.`;
        setState({ kind: "error", msg: typeof msg === "string" ? msg : "Invalid request." });
        return;
      }
      setState({ kind: "ok", d: json.data as SunPayload });
    } catch {
      setState({ kind: "error", msg: "The Sun service is unreachable. No value is shown rather than a fabricated one." });
    }
  }

  return (
    <section aria-labelledby="sun-calc-heading" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="sun-calc-heading" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Sun &amp; twilight calculator</h2>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-400/10 px-2.5 py-0.5 text-xs font-medium text-sky-300">
          <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
          Computed
        </span>
      </div>

      <form onSubmit={onSubmit} className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <label className="text-xs text-faint">
          Latitude
          <input ref={latRef} name="latitude" type="text" inputMode="decimal" placeholder="50.08" className="mt-1 w-full rounded-lg border border-white/15 bg-white/[0.03] px-2.5 py-1.5 text-sm text-fg outline-none focus:border-sky-400/50" />
        </label>
        <label className="text-xs text-faint">
          Longitude
          <input ref={lonRef} name="longitude" type="text" inputMode="decimal" placeholder="14.44" className="mt-1 w-full rounded-lg border border-white/15 bg-white/[0.03] px-2.5 py-1.5 text-sm text-fg outline-none focus:border-sky-400/50" />
        </label>
        <label className="text-xs text-faint">
          Date
          <input ref={dateRef} name="date" type="date" className="mt-1 w-full rounded-lg border border-white/15 bg-white/[0.03] px-2.5 py-1.5 text-sm text-fg outline-none focus:border-sky-400/50" />
        </label>
        <label className="text-xs text-faint">
          Timezone (IANA, optional)
          <input ref={tzRef} name="timezone" type="text" placeholder="Europe/Prague" className="mt-1 w-full rounded-lg border border-white/15 bg-white/[0.03] px-2.5 py-1.5 text-sm text-fg outline-none focus:border-sky-400/50" />
        </label>
        <div className="col-span-2 sm:col-span-4">
          <button type="submit" className="rounded-lg border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sm font-medium text-sky-200 transition hover:bg-sky-400/20">
            Calculate
          </button>
        </div>
      </form>

      <p className="mt-3 text-xs leading-relaxed text-faint">
        <strong className="text-muted">Privacy:</strong> your location is used only for this calculation and is <strong className="text-muted">not stored</strong>. No browser geolocation or IP lookup is used — coordinates come only from what you type. Times are shown in the timezone you enter (UTC if blank).
      </p>

      {state.kind === "idle" && (
        <p className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm text-muted" role="status">
          Enter a latitude and longitude to compute sunrise, sunset, solar noon, day length, and the three twilight phases. Nothing is shown until you do — no location is assumed.
        </p>
      )}

      {state.kind === "loading" && <p className="mt-4 text-sm text-faint" role="status">Computing solar times…</p>}

      {state.kind === "error" && (
        <div role="alert" className="mt-4 rounded-xl border border-rose-400/20 bg-rose-400/[0.04] p-4">
          <p className="text-sm text-rose-200">{state.msg}</p>
        </div>
      )}

      {state.kind === "ok" && <SunResult d={state.d} />}
    </section>
  );
}

function SunResult({ d }: { d: SunPayload }) {
  const tz = d.input.timezone;
  const t = (e: SunEvent): string => e.local ?? "—";
  const twilightRows: [string, SunEvent, SunEvent, number][] = [
    ["Astronomical", d.events.astronomicalDawn, d.events.astronomicalDusk, d.duration.astronomicalTwilightMinutes],
    ["Nautical", d.events.nauticalDawn, d.events.nauticalDusk, d.duration.nauticalTwilightMinutes],
    ["Civil", d.events.civilDawn, d.events.civilDusk, d.duration.civilTwilightMinutes],
  ];
  const conditions = d.status.filter((s) => s !== "normal");

  return (
    <div className="mt-5 space-y-5">
      {conditions.length > 0 && (
        <div className="rounded-xl border border-amber-400/25 bg-amber-400/[0.06] p-4">
          <ul className="space-y-1 text-sm text-amber-100">
            {conditions.map((s) => (
              <li key={s}><strong>{CONDITION_LABEL[s] ?? s}.</strong> Some events below are shown as “—” because the Sun does not cross that altitude on this date.</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Sunrise" value={t(d.events.sunrise)} />
        <Stat label="Sunset" value={t(d.events.sunset)} />
        <Stat label="Solar noon" value={t(d.events.solarNoon)} />
        <Stat label="Day length" value={durationLabel(d.duration.daylightMinutes)} />
      </div>

      <div>
        <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Twilight ({tz})</h3>
        <div className="mt-2 overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.03] text-xs uppercase tracking-wide text-faint">
              <tr><th className="px-3 py-2 text-left font-medium">Phase</th><th className="px-3 py-2 text-left font-medium">Dawn</th><th className="px-3 py-2 text-left font-medium">Dusk</th><th className="px-3 py-2 text-right font-medium">Total</th></tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {twilightRows.map(([name, dawn, dusk, mins]) => (
                <tr key={name}>
                  <td className="px-3 py-2 text-fg">{name}</td>
                  <td className="px-3 py-2 font-mono text-xs text-muted">{t(dawn)}</td>
                  <td className="px-3 py-2 font-mono text-xs text-muted">{t(dusk)}</td>
                  <td className="px-3 py-2 text-right font-mono text-xs text-faint">{durationLabel(mins)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <dl className="grid grid-cols-3 gap-3 text-center">
        <Mini label="Declination" value={`${d.solar.declinationDeg}°`} />
        <Mini label="Equation of time" value={`${d.solar.equationOfTimeMinutes} min`} />
        <Mini label="Noon elevation" value={`${d.solar.noonElevationDeg}°`} />
      </dl>

      <div className="border-t border-white/10 pt-3 text-xs leading-relaxed text-faint">
        <p><strong className="text-muted">Method:</strong> deterministic calculation (not a live provider feed). <strong className="text-muted">Source:</strong> {d.envelope.source.join(", ").toUpperCase()} · confidence {d.envelope.confidence}.</p>
        <p className="mt-1"><strong className="text-muted">Computed at:</strong> {fmtUTC(d.envelope.generatedAt)} · for the civil date {d.input.date} at {d.input.latitude}°, {d.input.longitude}°.</p>
        <p className="mt-1">{d.calculationNotes}</p>
        <p className="mt-1">
          Programmatic access:{" "}
          <a href={`/api/v0/live-sky/sun?latitude=${d.input.latitude}&longitude=${d.input.longitude}&date=${d.input.date}${tz !== "UTC" ? `&timezone=${tz}` : ""}`} className="text-nebula underline-offset-4 hover:underline">/api/v0/live-sky/sun</a>.
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <div className="font-display text-2xl font-bold text-fg">{value}</div>
      <div className="mt-1 text-xs text-faint">{label}</div>
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
