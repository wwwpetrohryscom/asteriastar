"use client";

import { useEffect, useState } from "react";

/**
 * Real Moon data panel (Program P). Fetches the computed Moon phase from
 * /api/v0/live-sky/moon and shows it with its full honesty envelope — the real
 * computation time, validity window, source, method, and stale flag. It never
 * fabricates a value: on failure it shows a structured error, and it clearly
 * labels the data as computed (deterministic), not a live provider feed. No
 * location is requested or used.
 */

interface MoonEnvelope {
  status: string;
  source: string[];
  generatedAt: string | null;
  validFrom: string | null;
  validUntil: string | null;
  confidence: string;
  stale: boolean;
  provenance: string;
  licenseNotes: string;
}
interface MoonPayload {
  phase: string;
  phaseName: string;
  phaseAngleDeg: number;
  illuminationPercent: number;
  illuminationFraction: number;
  synodicAgeDays: number;
  waxing: boolean;
  method: string;
  atIso: string;
  calculationNotes: string;
  envelope: MoonEnvelope;
}

const STATUS_CLASS: Record<string, string> = {
  computed: "border-sky-400/30 bg-sky-400/10 text-sky-300",
  live: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  stale: "border-rose-400/30 bg-rose-400/10 text-rose-300",
};

function fmt(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toUTCString();
}

type PanelState = { kind: "loading" } | { kind: "ok"; d: MoonPayload } | { kind: "error"; msg: string };

/** Pure fetch — returns the next state; never calls setState itself. */
async function fetchMoonState(): Promise<PanelState> {
  try {
    const res = await fetch("/api/v0/live-sky/moon", { cache: "no-store" });
    if (!res.ok) return { kind: "error", msg: `The moon service returned ${res.status}. No value is shown rather than a fabricated one.` };
    const json = await res.json();
    return { kind: "ok", d: json.data as MoonPayload };
  } catch {
    return { kind: "error", msg: "The moon service is unreachable. No value is shown rather than a fabricated one." };
  }
}

export function MoonDataPanel() {
  const [state, setState] = useState<PanelState>({ kind: "loading" });

  /** Button handler (setState in an event handler is allowed). */
  function reload() {
    setState({ kind: "loading" });
    void fetchMoonState().then(setState);
  }

  useEffect(() => {
    let active = true;
    void fetchMoonState().then((s) => {
      if (active) setState(s);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section aria-labelledby="moon-data-heading" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="moon-data-heading" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Current Moon phase</h2>
        {state.kind === "ok" && (
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_CLASS[state.d.envelope.stale ? "stale" : state.d.envelope.status] ?? STATUS_CLASS.computed}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
            {state.d.envelope.stale ? "Stale — refreshing" : "Computed"}
          </span>
        )}
      </div>

      {state.kind === "loading" && <p className="mt-4 text-sm text-faint" role="status">Computing current Moon phase…</p>}

      {state.kind === "error" && (
        <div className="mt-4 rounded-xl border border-rose-400/20 bg-rose-400/[0.04] p-4">
          <p className="text-sm text-rose-200">{state.msg}</p>
          <button onClick={reload} className="mt-3 rounded-lg border border-white/15 px-3 py-1.5 text-sm text-fg hover:border-white/30">Retry</button>
        </div>
      )}

      {state.kind === "ok" && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="col-span-2 rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="font-display text-2xl font-bold text-fg">{state.d.phaseName}</div>
              <div className="mt-1 text-xs text-faint">{state.d.waxing ? "Waxing" : "Waning"} · {state.d.method}</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="font-display text-2xl font-bold text-fg">{state.d.illuminationPercent}%</div>
              <div className="mt-1 text-xs text-faint">Illuminated</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="font-display text-2xl font-bold text-fg">{state.d.synodicAgeDays}d</div>
              <div className="mt-1 text-xs text-faint">Moon age</div>
            </div>
          </div>

          <dl className="mt-4 divide-y divide-white/5 text-sm">
            {[
              ["Sun–Moon angle", `${state.d.phaseAngleDeg}°`],
              ["Computed at", fmt(state.d.envelope.generatedAt)],
              ["Valid until", fmt(state.d.envelope.validUntil)],
              ["Method", "Deterministic calculation (not a live provider feed)"],
              ["Source", state.d.envelope.source.join(", ").toUpperCase()],
              ["Confidence", state.d.envelope.confidence],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3 py-2">
                <dt className="text-muted">{k}</dt>
                <dd className="text-right font-mono text-xs text-faint">{v}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-4 border-t border-white/10 pt-3 text-xs leading-relaxed text-faint">{state.d.calculationNotes}</p>
          <p className="mt-2 text-xs leading-relaxed text-faint">
            <strong className="text-muted">Privacy:</strong> phase and illumination are global — no location is requested, inferred, or used. Programmatic access:{" "}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- links to a JSON API route, not a page */}
            <a href="/api/v0/live-sky/moon" className="text-nebula underline-offset-4 hover:underline">/api/v0/live-sky/moon</a>.
          </p>
          <button onClick={reload} className="mt-3 rounded-lg border border-white/15 px-3 py-1.5 text-sm text-fg hover:border-white/30">Refresh</button>
        </>
      )}
    </section>
  );
}
