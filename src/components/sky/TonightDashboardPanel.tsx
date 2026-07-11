"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tonight Observing Dashboard (Program T). Takes an EXPLICIT latitude, longitude,
 * optional date, and optional IANA timezone, and fetches the computed composite
 * from /api/v0/live-sky/tonight — twilight/darkness, the Moon, and ranked planet
 * visibility. It never uses browser geolocation or IP lookup and never stores
 * anything. It shows only what the engines compute: no weather, cloud, seeing,
 * ISS, aurora, meteor, or comet data is invented, and every limitation is stated.
 */

interface Ev { iso: string | null; local: string | null }
interface Win { startIso: string; endIso: string }
interface TPlanet {
  planetName: string;
  visibleTonight: boolean;
  bestTimeIso: string | null;
  altitudeDeg: number;
  azimuthDeg: number;
  apparentMagnitude: number;
  limitingFactors: string[];
  visibilityScore: number | null;
}
interface Tonight {
  input: { latitude: number; longitude: number; date: string; timezone: string };
  referenceTimeIso: string;
  summary: { observingDate: string; darknessAvailable: boolean; darknessMinutes: number; nightType: string; bestOverallWindow: Win | null; limitations: string[] };
  sun: {
    sunrise: Ev; sunset: Ev; solarNoon: Ev;
    civilTwilight: { dawn: Ev; dusk: Ev }; nauticalTwilight: { dawn: Ev; dusk: Ev }; astronomicalTwilight: { dawn: Ev; dusk: Ev };
    daylightMinutes: number; darknessWindows: Win[];
  } | null;
  moon: { phaseName: string; illuminationPercent: number; moonrise: Ev; moonset: Ev; lunarTransit: Ev; currentAltitudeDeg: number; currentAzimuthDeg: number; moonlightImpact: string; limitations: string[] } | null;
  planets: TPlanet[];
  recommendations: { topPlanets: string[]; bestMoonObservingWindow: string | null; bestDarkSkyWindow: string | null; notAvailable: string[] };
  accuracyNotes: string;
  envelope: { generatedAt: string | null; source: string[]; confidence: string; stale: boolean };
}

type State = { kind: "idle" } | { kind: "loading" } | { kind: "ok"; d: Tonight } | { kind: "error"; msg: string };

const NIGHT_LABEL: Record<string, { text: string; cls: string }> = {
  normal_night: { text: "Normal night", cls: "border-success/40 bg-success/10 text-success-strong" },
  short_night: { text: "Short night", cls: "border-nasa/40 bg-nasa/10 text-nasa" },
  no_darkness: { text: "No true darkness", cls: "border-nasa/40 bg-nasa/10 text-nasa" },
  polar_day: { text: "Polar day — no night", cls: "border-nasa-red/50 bg-nasa-red/[0.12] text-nasa" },
  polar_night: { text: "Polar night", cls: "border-white/20 bg-white/[0.045] text-muted" },
};
const IMPACT_CLS: Record<string, string> = {
  low: "border-success/40 bg-success/10 text-success-strong",
  moderate: "border-nasa/40 bg-nasa/10 text-nasa",
  high: "border-nasa-red/50 bg-nasa-red/[0.12] text-nasa",
  unknown: "border-white/15 bg-white/[0.03] text-faint",
};

function fmtUTC(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toUTCString();
}
function compass(az: number): string {
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return dirs[Math.round(az / 22.5) % 16];
}
/** UTC "HH:mm" for a window boundary (the dark window is reported as UTC instants). */
function hmUTC(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toISOString().slice(11, 16);
}

export function TonightDashboardPanel() {
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
      const res = await fetch(`/api/v0/live-sky/tonight?${qs.toString()}`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) {
        const msg = json?.error?.message ?? `The request was rejected (${res.status}). No value is shown rather than a fabricated one.`;
        setState({ kind: "error", msg: typeof msg === "string" ? msg : "Invalid request." });
        return;
      }
      setState({ kind: "ok", d: json.data as Tonight });
    } catch {
      setState({ kind: "error", msg: "The service is unreachable. No value is shown rather than a fabricated one." });
    }
  }

  return (
    <section aria-labelledby="tonight-heading" className="scientific-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="tonight-heading" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Tonight observing dashboard</h2>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/[0.045] px-2.5 py-0.5 text-xs font-medium text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
          Computed composite
        </span>
      </div>

      <form onSubmit={onSubmit} className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <label className="text-xs text-faint">Latitude
          <input ref={latRef} name="latitude" type="text" inputMode="decimal" placeholder="50.08" className="mt-1 w-full rounded-lg border border-white/15 bg-white/[0.03] px-2.5 py-1.5 text-sm text-fg outline-none focus:border-nasa/60" />
        </label>
        <label className="text-xs text-faint">Longitude
          <input ref={lonRef} name="longitude" type="text" inputMode="decimal" placeholder="14.44" className="mt-1 w-full rounded-lg border border-white/15 bg-white/[0.03] px-2.5 py-1.5 text-sm text-fg outline-none focus:border-nasa/60" />
        </label>
        <label className="text-xs text-faint">Date <span className="text-faint/70">(optional — now)</span>
          <input ref={dateRef} name="date" type="date" className="mt-1 w-full rounded-lg border border-white/15 bg-white/[0.03] px-2.5 py-1.5 text-sm text-fg outline-none focus:border-nasa/60" />
        </label>
        <label className="text-xs text-faint">Timezone (IANA)
          <input ref={tzRef} name="timezone" type="text" placeholder="Europe/Prague" className="mt-1 w-full rounded-lg border border-white/15 bg-white/[0.03] px-2.5 py-1.5 text-sm text-fg outline-none focus:border-nasa/60" />
        </label>
        <div className="col-span-2 sm:col-span-4">
          <button type="submit" className="rounded-lg border border-white/20 bg-white/[0.045] px-4 py-2 text-sm font-medium text-white transition hover:bg-nasa/20">Show tonight</button>
        </div>
      </form>

      <p className="mt-3 text-xs leading-relaxed text-faint">
        <strong className="text-muted">Privacy:</strong> your location is used only for this calculation and is <strong className="text-muted">not stored</strong>. No browser geolocation or IP lookup — coordinates come only from what you type. Leave the date blank for tonight.
      </p>

      {state.kind === "idle" && (
        <p className="mt-4 scientific-card p-4 text-sm text-muted" role="status">
          Enter a latitude and longitude to compose tonight&apos;s observing conditions — the twilight and darkness windows, the Moon, and which planets are best placed. Nothing is shown until you do; no location is assumed.
        </p>
      )}
      {state.kind === "loading" && <p className="mt-4 text-sm text-faint" role="status">Composing tonight&apos;s sky…</p>}
      {state.kind === "error" && (
        <div role="alert" className="mt-4 rounded-xl border border-nasa-red/50 bg-nasa-red/[0.12] p-4">
          <p className="text-sm text-nasa">{state.msg}</p>
        </div>
      )}
      {state.kind === "ok" && <Dashboard d={state.d} />}
    </section>
  );
}

function Dashboard({ d }: { d: Tonight }) {
  const night = NIGHT_LABEL[d.summary.nightType] ?? NIGHT_LABEL.no_darkness;
  const tz = d.input.timezone;
  const darkH = Math.floor(d.summary.darknessMinutes / 60);
  const darkM = d.summary.darknessMinutes % 60;

  return (
    <div className="mt-5 space-y-5">
      {/* Summary */}
      <div className="scientific-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${night.cls}`}>{night.text}</span>
          <span className="text-xs text-faint">{d.summary.observingDate} · {tz}</span>
        </div>
        <p className="mt-2 text-sm text-muted">
          {d.summary.darknessAvailable
            ? <>About <strong className="text-fg">{darkH}h {String(darkM).padStart(2, "0")}m</strong> of astronomical darkness{d.summary.bestOverallWindow ? <> — the dark window runs {hmUTC(d.summary.bestOverallWindow.startIso)}–{hmUTC(d.summary.bestOverallWindow.endIso)} UTC.</> : "."}</>
            : "The sky does not get astronomically dark on this date."}
        </p>
      </div>

      {/* Twilight / darkness */}
      {d.sun && (
        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Sun &amp; twilight ({tz})</h3>
          <div className="mt-2 overflow-hidden rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-white/5">
                {[
                  ["Sunset", d.sun.sunset.local], ["Civil dusk", d.sun.civilTwilight.dusk.local], ["Nautical dusk", d.sun.nauticalTwilight.dusk.local], ["Astronomical dusk", d.sun.astronomicalTwilight.dusk.local],
                  ["Astronomical dawn", d.sun.astronomicalTwilight.dawn.local], ["Sunrise", d.sun.sunrise.local],
                ].map(([k, v]) => (
                  <tr key={k}><td className="px-3 py-1.5 text-muted">{k}</td><td className="px-3 py-1.5 text-right font-mono text-xs text-fg">{v ?? "—"}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Moon */}
      {d.moon && (
        <div className="scientific-card p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-display text-base font-semibold text-fg">Moon — {d.moon.phaseName}, {d.moon.illuminationPercent}% lit</h3>
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${IMPACT_CLS[d.moon.moonlightImpact] ?? IMPACT_CLS.unknown}`}>Moonlight: {d.moon.moonlightImpact}</span>
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs sm:grid-cols-4">
            <Cell k="Moonrise" v={d.moon.moonrise.local ?? "—"} />
            <Cell k="Transit" v={d.moon.lunarTransit.local ?? "—"} />
            <Cell k="Moonset" v={d.moon.moonset.local ?? "—"} />
            <Cell k="Altitude" v={`${d.moon.currentAltitudeDeg}° ${d.moon.currentAltitudeDeg > 0 ? compass(d.moon.currentAzimuthDeg) : ""}`} />
          </dl>
        </div>
      )}

      {/* Planets ranked */}
      <div>
        <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Planets tonight, best-placed first</h3>
        <ul className="mt-2 space-y-2">
          {[...d.planets].sort((a, b) => (b.visibilityScore ?? -1) - (a.visibilityScore ?? -1)).map((p) => (
            <li key={p.planetName} className="scientific-card p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium text-fg">{p.planetName} <span className="text-xs text-faint">mag {p.apparentMagnitude}</span></span>
                {p.visibleTonight && p.visibilityScore !== null
                  ? <span className="inline-flex items-center gap-2 text-xs text-success-strong"><span className="inline-block h-1.5 w-16 overflow-hidden rounded-full bg-white/10"><span className="block h-full rounded-full bg-success/70" style={{ width: `${p.visibilityScore}%` }} /></span>score {p.visibilityScore}</span>
                  : <span className="text-xs text-faint">Not visible tonight</span>}
              </div>
              {p.limitingFactors.length > 0 && <p className="mt-1 text-xs text-nasa/80">{p.limitingFactors.join(" ")}</p>}
            </li>
          ))}
        </ul>
      </div>

      {/* Recommendations */}
      <div className="rounded-xl border border-white/20 bg-white/[0.045] p-4 text-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-white">Best tonight</p>
        <ul className="mt-2 space-y-1 text-muted">
          {d.recommendations.topPlanets.length > 0
            ? <li><strong className="text-fg">Planets:</strong> {d.recommendations.topPlanets.join(", ")}.</li>
            : <li><strong className="text-fg">Planets:</strong> none well placed tonight.</li>}
          {d.recommendations.bestMoonObservingWindow && <li><strong className="text-fg">Moon:</strong> {d.recommendations.bestMoonObservingWindow}</li>}
          {d.recommendations.bestDarkSkyWindow && <li><strong className="text-fg">Dark sky:</strong> {d.recommendations.bestDarkSkyWindow}</li>}
        </ul>
      </div>

      {/* Limitations */}
      <div className="rounded-xl border border-nasa/40 bg-nasa/10 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-nasa">Limitations &amp; not included</p>
        <ul className="mt-1 list-disc space-y-0.5 pl-5 text-xs leading-relaxed text-muted">
          {d.summary.limitations.map((l, i) => <li key={`lim-${i}`}>{l}</li>)}
          <li>Not included: {d.recommendations.notAvailable.join("; ")}.</li>
        </ul>
        <p className="mt-2 text-xs text-faint">{d.accuracyNotes}</p>
      </div>

      <div className="border-t border-white/10 pt-3 text-xs leading-relaxed text-faint">
        <p><strong className="text-muted">Method:</strong> computed composite of the Sun, Moon &amp; Planet engines (not a live provider feed). <strong className="text-muted">Source:</strong> {d.envelope.source.join(", ").toUpperCase()} · confidence {d.envelope.confidence}{d.envelope.stale ? " · stale — refreshing" : ""}.</p>
        <p className="mt-1"><strong className="text-muted">Computed at:</strong> {fmtUTC(d.envelope.generatedAt)} · for {d.input.latitude}°, {d.input.longitude}° · Moon &amp; planet positions as of {fmtUTC(d.referenceTimeIso)}.</p>
        <p className="mt-1">
          Programmatic access:{" "}
          <a href={`/api/v0/live-sky/tonight?latitude=${d.input.latitude}&longitude=${d.input.longitude}&date=${d.input.date}${tz !== "UTC" ? `&timezone=${encodeURIComponent(tz)}` : ""}`} className="text-nasa underline-offset-4 hover:underline">/api/v0/live-sky/tonight</a>.
        </p>
      </div>
    </div>
  );
}

function Cell({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-2 border-b border-white/5 pb-1">
      <dt className="text-faint">{k}</dt>
      <dd className="font-mono text-fg">{v}</dd>
    </div>
  );
}
