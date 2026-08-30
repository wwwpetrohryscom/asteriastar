"use client";

import { useEffect, useState } from "react";
import { moon } from "@/platform/live-sky/moon";

/**
 * Real Moon data panel (Program P). COMPUTES the Moon phase in this browser and
 * shows it with its full honesty envelope — the real
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
  computed: "border-white/20 bg-white/[0.045] text-muted",
  live: "border-success/40 bg-success/10 text-success-strong",
  stale: "border-nasa-red/50 bg-nasa-red/[0.12] text-nasa",
};

function fmt(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toUTCString();
}

type PanelState = { kind: "loading" } | { kind: "ok"; d: MoonPayload } | { kind: "error"; msg: string };

/**
 * Computed here, in this browser, with no request at all.
 *
 * This used to call an API route for a value that is a pure function of the clock. The round trip
 * bought nothing — the same code runs on both sides — and it meant a page could show nothing at all
 * because a network hiccup interrupted arithmetic. Returns the next state; never calls setState.
 */
function computeMoonState(): PanelState {
  try {
    const now = new Date();
    const { data, envelope } = moon.current(now);
    return { kind: "ok", d: { ...data, envelope } as MoonPayload };
  } catch {
    return { kind: "error", msg: "The Moon calculation failed in this browser. No value is shown rather than a fabricated one." };
  }
}

export function MoonDataPanel() {
  const [state, setState] = useState<PanelState>({ kind: "loading" });

  /** Button handler (setState in an event handler is allowed). */
  function reload() {
    setState(computeMoonState());
  }

  // Computed after mount rather than during render, so the server-rendered markup and the first
  // client render agree: the value depends on the clock, and the clock differs between them. The
  // update happens inside `evaluate` rather than in the effect body, matching the pattern the rest
  // of the platform's clock-dependent components use.
  useEffect(() => {
    const evaluate = (): void => {
      setState(computeMoonState());
    };
    evaluate();
  }, []);

  return (
    <section aria-labelledby="moon-data-heading" className="scientific-card p-5">
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
        <div className="mt-4 rounded-xl border border-nasa-red/50 bg-nasa-red/[0.12] p-4">
          <p className="text-sm text-nasa">{state.msg}</p>
          <button onClick={reload} className="mt-3 rounded-lg border border-white/15 px-3 py-1.5 text-sm text-fg hover:border-white/30">Retry</button>
        </div>
      )}

      {state.kind === "ok" && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="col-span-2 scientific-card p-4">
              <div className="font-display text-2xl font-bold text-fg">{state.d.phaseName}</div>
              <div className="mt-1 text-xs text-faint">{state.d.waxing ? "Waxing" : "Waning"} · {state.d.method}</div>
            </div>
            <div className="scientific-card p-4">
              <div className="font-display text-2xl font-bold text-fg">{state.d.illuminationPercent}%</div>
              <div className="mt-1 text-xs text-faint">Illuminated</div>
            </div>
            <div className="scientific-card p-4">
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
            <a href="/api/v0/live-sky/moon" className="text-nasa underline-offset-4 hover:underline">/api/v0/live-sky/moon</a>.
          </p>
          <button onClick={reload} className="mt-3 rounded-lg border border-white/15 px-3 py-1.5 text-sm text-fg hover:border-white/30">Refresh</button>
        </>
      )}
    </section>
  );
}
