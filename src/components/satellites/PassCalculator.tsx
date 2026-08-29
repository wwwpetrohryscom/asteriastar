"use client";

import { useId, useMemo, useState } from "react";
import { findPasses, validateObserver, type SatellitePass } from "@/platform/satellites/passes";
import { compassPoint } from "@/platform/satellites/frames";
import type { Ephemeris, StateVector } from "@/platform/satellites/oem";

/**
 * The ISS pass calculator.
 *
 * IT RUNS IN THE BROWSER, and that is the point. The server sends a window of NASA's published
 * state vectors — the same file it uses itself — and the arithmetic happens on the reader's own
 * machine. Their latitude and longitude are never sent anywhere: not to AsteriaStar, not to NASA,
 * not to an analytics endpoint, and not into a URL. There is nothing to log because there is
 * nothing to receive.
 *
 * That is a stronger guarantee than a promise not to store coordinates, and it is the reason this
 * is a client component rather than a form that posts to an API. The API exists too, for people
 * writing their own software, and it documents that it does not log what it is given — but a
 * guarantee enforced by architecture beats one enforced by policy.
 *
 * Nothing is remembered between visits either: no localStorage, no cookie, no query parameter. Type
 * a location, get an answer, close the tab, and nothing of it remains.
 */

interface SerialisedWindow {
  states: { t: number; p: [number, number, number]; v: [number, number, number] }[];
  startMs: number;
  endMs: number;
}

const VISIBILITY_LABEL: Record<SatellitePass["visibility"], { label: string; detail: string; tone: string }> = {
  visible: { label: "Visible", detail: "Sunlit station, dark sky — visible to the naked eye if the weather allows.", tone: "border-success/40 bg-success/10 text-success-strong" },
  daylight: { label: "Daylight", detail: "Overhead and sunlit, but your sky is too bright to pick it out.", tone: "border-white/20 bg-white/[0.045] text-muted" },
  eclipsed: { label: "In shadow", detail: "Overhead in a dark sky, but the station is inside Earth's shadow and reflects nothing.", tone: "border-white/20 bg-white/[0.045] text-muted" },
  "not-visible": { label: "Not visible", detail: "Above the horizon, but neither sunlit nor in a dark sky.", tone: "border-white/20 bg-white/[0.045] text-muted" },
};

function formatLocal(ms: number): string {
  return new Date(ms).toLocaleString(undefined, { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export function PassCalculator({ window: win, coverageEndMs }: { window: SerialisedWindow; coverageEndMs: number }) {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  // The instant the reader asked is captured with the coordinates, not read during render: passes
  // should be computed from one fixed moment, not silently recomputed from a new "now" every time
  // the component happens to re-render.
  const [submitted, setSubmitted] = useState<{ lat: number; lon: number; fromMs: number } | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  // Incremented on every failed submission so the alert node is REPLACED rather than re-rendered
  // with identical text. Without it, submitting the same mistake twice mutates nothing in the DOM
  // and assistive technology announces nothing — the button appears to do nothing at all.
  const [attempt, setAttempt] = useState(0);
  const baseId = useId();

  // The window is rebuilt into the shape the pure pass finder expects. Doing this in a memo keeps
  // it off the render path for every keystroke.
  const ephemeris = useMemo<Ephemeris>(() => {
    const states: StateVector[] = win.states.map((s) => ({ timeMs: s.t, position: s.p, velocity: s.v }));
    return {
      objectName: "ISS",
      referenceFrame: "EME2000",
      timeSystem: "UTC",
      startMs: win.startMs,
      stopMs: win.endMs,
      states,
      ascendingNodes: [],
      comments: [],
    };
  }, [win]);

  const passes = useMemo(() => {
    if (!submitted) return null;
    return findPasses(ephemeris, { latitudeDeg: submitted.lat, longitudeDeg: submitted.lon, altitudeKm: 0 }, submitted.fromMs, win.endMs);
  }, [ephemeris, submitted, win.endMs]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const check = validateObserver(latitude, longitude);
    setAttempt((n) => n + 1);
    if (!check.ok) {
      setProblem(check.problem);
      setSubmitted(null);
      return;
    }
    setProblem(null);
    setSubmitted({ lat: check.observer.latitudeDeg, lon: check.observer.longitudeDeg, fromMs: Date.now() });
  };

  const field = "w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-fg focus-visible:outline-2 focus-visible:outline-nasa";
  const visible = passes?.filter((p) => p.visibility === "visible") ?? [];
  // Which field the message is about, so the rejected input is the one marked invalid rather than
  // both. A reader tabbing back must land on a field that says it was the problem.
  const latitudeInvalid = Boolean(problem?.startsWith("latitude"));
  const longitudeInvalid = Boolean(problem?.startsWith("longitude"));
  const describe = (invalid: boolean) => (invalid ? `${baseId}-help ${baseId}-error` : `${baseId}-help`);

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <fieldset>
          <legend className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Your location</legend>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Type coordinates. Nothing here asks your browser for your position, and nothing you type leaves this page — the
            calculation runs on your own device using orbital data already loaded. There is no request to send it in.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <div>
              <label htmlFor={`${baseId}-lat`} className="block text-xs uppercase tracking-wider text-faint">Latitude</label>
              <input
                id={`${baseId}-lat`} className={`${field} mt-1`} inputMode="decimal" placeholder="51.4779"
                value={latitude} onChange={(e) => setLatitude(e.target.value)}
                aria-invalid={latitudeInvalid || undefined}
                aria-describedby={describe(latitudeInvalid)}
              />
            </div>
            <div>
              <label htmlFor={`${baseId}-lon`} className="block text-xs uppercase tracking-wider text-faint">Longitude</label>
              <input
                id={`${baseId}-lon`} className={`${field} mt-1`} inputMode="decimal" placeholder="-0.0015"
                value={longitude} onChange={(e) => setLongitude(e.target.value)}
                aria-invalid={longitudeInvalid || undefined}
                aria-describedby={describe(longitudeInvalid)}
              />
            </div>
            <button type="submit" className="rounded-lg border border-nasa/50 bg-nasa/10 px-4 py-2 text-sm font-medium text-fg transition hover:bg-nasa/20">
              Find passes
            </button>
          </div>
          <p id={`${baseId}-help`} className="mt-2 text-xs text-faint">
            Decimal degrees. North and east are positive; south and west are negative.
          </p>
        </fieldset>
        {problem && (
          <p key={attempt} id={`${baseId}-error`} role="alert" className="mt-3 rounded-lg border border-nasa-red/40 bg-nasa-red/[0.08] px-3 py-2 text-sm text-muted">{problem}</p>
        )}
      </form>

      <div>
        {/*
          ONLY the summary is a live region. Announcing the whole list would read out every heading,
          definition list and sentence — several hundred words for a busy location — with no way to
          skip forward, because a polite announcement is not navigable. The list sits outside it and
          is reached by ordinary navigation, which is what a reader can actually move around in.
        */}
        <p role="status" aria-live="polite" className="text-sm text-muted">
          {passes === null
            ? "Enter a latitude and longitude to see the next passes."
            : passes.length === 0
              ? "No pass reaches ten degrees above your horizon before the published ephemeris runs out."
              : `${passes.length} pass${passes.length === 1 ? "" : "es"} above ten degrees, of which ${visible.length} ${visible.length === 1 ? "is" : "are"} visible.`}
        </p>

        {passes !== null && passes.length === 0 && (
          <p className="mt-3 rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-muted">
            The ephemeris runs out on {new Date(coverageEndMs).toISOString().slice(0, 16).replace("T", " ")} UTC. That is a real
            answer: at some latitudes the station simply does not come high enough for days at a time.
          </p>
        )}

        {passes !== null && passes.length > 0 && (
          <>
            <p className="mt-1 text-sm text-muted">
              A visible pass is a sunlit station in a dark sky. The rest are overhead but cannot be seen, and are listed with the
              reason.
            </p>
            <ul className="mt-4 space-y-3">
              {passes.map((p) => {
                const v = VISIBILITY_LABEL[p.visibility];
                return (
                  <li key={p.startMs} className="scientific-card p-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-display text-base font-semibold text-fg">{formatLocal(p.startMs)}</h3>
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-[0.12em] ${v.tone}`}>{v.label}</span>
                    </div>
                    <dl className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-sm sm:grid-cols-4">
                      <div><dt className="text-xs text-faint">Max elevation</dt><dd className="font-medium text-fg">{p.maxElevationDeg.toFixed(0)}°</dd></div>
                      <div><dt className="text-xs text-faint">Appears</dt><dd className="font-medium text-fg">{p.riseCompass} ({p.riseAzimuthDeg.toFixed(0)}°)</dd></div>
                      <div><dt className="text-xs text-faint">Disappears</dt><dd className="font-medium text-fg">{p.setCompass} ({p.setAzimuthDeg.toFixed(0)}°)</dd></div>
                      <div><dt className="text-xs text-faint">Duration</dt><dd className="font-medium text-fg">{Math.round(p.durationSeconds / 60)} min</dd></div>
                    </dl>
                    <p className="mt-2 text-xs leading-relaxed text-faint">
                      {v.detail} Closest approach {p.minRangeKm.toFixed(0)} km, highest in the {compassPoint(p.peakAzimuthDeg)}.
                      {p.visibility === "visible" && p.visibleFromMs && p.visibleToMs && p.visibleToMs > p.visibleFromMs
                        ? ` Visible between ${formatLocal(p.visibleFromMs)} and ${formatLocal(p.visibleToMs)}.`
                        : ""}
                    </p>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>

      <p className="rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-xs leading-relaxed text-faint">
        Times are shown in your device&apos;s own time zone, which the browser knows without being told. A pass listed as visible
        is one that is geometrically above your horizon, sunlit, and in a sky dark enough to see it — <strong>not</strong> a
        forecast that you will see it. No cloud, haze or local-horizon data is connected to this platform, so the weather is
        entirely your problem.
      </p>
    </div>
  );
}
