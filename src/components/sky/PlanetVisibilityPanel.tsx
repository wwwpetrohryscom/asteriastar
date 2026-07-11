"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Planet Visibility panel (Program S). Takes an EXPLICIT latitude, longitude,
 * optional date, and optional IANA timezone, and fetches computed planet
 * visibility from /api/v0/live-sky/planets. It never uses browser geolocation or
 * IP lookup and never stores anything. On failure it shows a structured,
 * announced error and no value; visibility is reported conservatively and every
 * "not visible" carries an honest reason.
 */

interface Ev { iso: string | null; local: string | null }
interface Planet {
  objectEntityId: string;
  planetName: string;
  events: { rise: Ev; set: Ev; transit: Ev };
  position: { altitudeDeg: number; azimuthDeg: number; elongationDeg: number; apparentMagnitude: number; distanceAu: number };
  visibility: { aboveHorizonAtReferenceTime: boolean; visibleTonight: boolean; visibilityWindow: string; morningOrEvening: string; bestTimeIso: string | null; observingSummary: string; limitingFactors: string[] };
  status: string[];
}
interface PlanetsPayload {
  input: { latitude: number; longitude: number; date: string; timezone: string };
  referenceTimeIso: string;
  planets: Planet[];
  accuracyNotes: string;
  envelope: { generatedAt: string | null; validUntil: string | null; source: string[]; confidence: string; stale: boolean };
}

type State = { kind: "idle" } | { kind: "loading" } | { kind: "ok"; d: PlanetsPayload } | { kind: "error"; msg: string };

function fmtUTC(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toUTCString();
}
function compass(az: number): string {
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return dirs[Math.round(az / 22.5) % 16];
}

export function PlanetVisibilityPanel() {
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
      const res = await fetch(`/api/v0/live-sky/planets?${qs.toString()}`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) {
        const msg = json?.error?.message ?? `The request was rejected (${res.status}). No value is shown rather than a fabricated one.`;
        setState({ kind: "error", msg: typeof msg === "string" ? msg : "Invalid request." });
        return;
      }
      setState({ kind: "ok", d: json.data as PlanetsPayload });
    } catch {
      setState({ kind: "error", msg: "The planet service is unreachable. No value is shown rather than a fabricated one." });
    }
  }

  return (
    <section aria-labelledby="planet-vis-heading" className="scientific-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="planet-vis-heading" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Planet visibility calculator</h2>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/[0.045] px-2.5 py-0.5 text-xs font-medium text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
          Computed
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
          <button type="submit" className="rounded-lg border border-white/20 bg-white/[0.045] px-4 py-2 text-sm font-medium text-white transition hover:bg-nasa/20">Calculate</button>
        </div>
      </form>

      <p className="mt-3 text-xs leading-relaxed text-faint">
        <strong className="text-muted">Privacy:</strong> your location is used only for this calculation and is <strong className="text-muted">not stored</strong>. No browser geolocation or IP lookup is used — coordinates come only from what you type. Leave the date blank for the planets right now.
      </p>

      {state.kind === "idle" && (
        <p className="mt-4 scientific-card p-4 text-sm text-muted" role="status">
          Enter a latitude and longitude to compute which naked-eye planets are up tonight — their rise, transit, and set times, altitude, and how favourably each is placed. Nothing is shown until you do; no location is assumed.
        </p>
      )}
      {state.kind === "loading" && <p className="mt-4 text-sm text-faint" role="status">Computing planetary positions…</p>}
      {state.kind === "error" && (
        <div role="alert" className="mt-4 rounded-xl border border-nasa-red/50 bg-nasa-red/[0.12] p-4">
          <p className="text-sm text-nasa">{state.msg}</p>
        </div>
      )}
      {state.kind === "ok" && <PlanetsResult d={state.d} />}
    </section>
  );
}

function PlanetsResult({ d }: { d: PlanetsPayload }) {
  const tz = d.input.timezone;
  return (
    <div className="mt-5 space-y-4">
      <ul className="space-y-3">
        {d.planets.map((p) => (
          <li key={p.objectEntityId} className="scientific-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-lg font-semibold text-fg">{p.planetName}</span>
                <span className="text-xs text-faint">mag {p.position.apparentMagnitude}</span>
              </div>
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${p.visibility.visibleTonight ? "border-success/40 bg-success/10 text-success-strong" : "border-white/15 bg-white/[0.03] text-faint"}`}>
                {p.visibility.visibleTonight ? `Visible · ${p.visibility.morningOrEvening}` : "Not visible tonight"}
              </span>
            </div>
            <p className="mt-1.5 text-sm text-muted">{p.visibility.observingSummary}</p>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs sm:grid-cols-4">
              <Row k="Rise" v={p.events.rise.local ?? "—"} />
              <Row k="Transit" v={p.events.transit.local ?? "—"} />
              <Row k="Set" v={p.events.set.local ?? "—"} />
              <Row k="Altitude now" v={`${p.position.altitudeDeg}° ${p.position.altitudeDeg > 0 ? compass(p.position.azimuthDeg) : ""}`} />
            </dl>
            {p.visibility.limitingFactors.length > 0 && (
              <p className="mt-2 text-xs text-nasa/80">{p.visibility.limitingFactors.join(" ")}</p>
            )}
          </li>
        ))}
      </ul>

      <div className="rounded-xl border border-nasa/40 bg-nasa/10 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-nasa">Accuracy</p>
        <p className="mt-1 text-xs leading-relaxed text-muted">{d.accuracyNotes}</p>
      </div>

      <div className="border-t border-white/10 pt-3 text-xs leading-relaxed text-faint">
        <p><strong className="text-muted">Method:</strong> deterministic calculation (not a live provider feed). <strong className="text-muted">Source:</strong> {d.envelope.source.join(", ").toUpperCase()} · confidence {d.envelope.confidence}{d.envelope.stale ? " · stale — refreshing" : ""}. Times shown in {tz}.</p>
        <p className="mt-1"><strong className="text-muted">Computed at:</strong> {fmtUTC(d.envelope.generatedAt)} · for {d.input.latitude}°, {d.input.longitude}° · positions as of {fmtUTC(d.referenceTimeIso)}.</p>
        <p className="mt-1">
          Programmatic access:{" "}
          <a href={`/api/v0/live-sky/planets?latitude=${d.input.latitude}&longitude=${d.input.longitude}${tz !== "UTC" ? `&timezone=${encodeURIComponent(tz)}` : ""}`} className="text-nasa underline-offset-4 hover:underline">/api/v0/live-sky/planets</a>.
        </p>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-2 border-b border-white/5 pb-1">
      <dt className="text-faint">{k}</dt>
      <dd className="font-mono text-fg">{v}</dd>
    </div>
  );
}
