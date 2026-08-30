"use client";

import { useId, useMemo, useState } from "react";
import { tonight } from "@/platform/live-sky/tonight";
import type { TonightObservingData } from "@/platform/live-sky/models";
import { buildObservingPlan, type ObservingPlan } from "@/platform/observing/plan";
import { fetchCloudForecast, metForecastUrl, MET_ATTRIBUTION, MET_LICENSE_URL, COORDINATE_DECIMALS, type CloudForecast } from "@/platform/observing/weather";
import { findPasses, type SatellitePass } from "@/platform/satellites/passes";
import { compassPoint } from "@/platform/satellites/frames";
import type { Ephemeris, StateVector } from "@/platform/satellites/oem";
import type { AstronomicalEvent } from "@/platform/events/model";

/**
 * The personal observing dashboard.
 *
 * EVERYTHING LOCATION-DEPENDENT ON THIS PAGE IS COMPUTED IN THIS BROWSER. The twilight and darkness
 * windows, the Moon, the ranked planets, the ISS passes and the observing plan are all produced here
 * from engines the server also uses — the same code, running on the reader's machine. Their latitude
 * and longitude are never sent to AsteriaStar, never placed in the URL, never stored in
 * localStorage, and never written to a cookie. There is nothing to log because there is nothing to
 * receive, which is a stronger guarantee than a promise not to keep it.
 *
 * There is exactly ONE exception and it is the reader's own decision: if they press the cloud-cover
 * button, coordinates ROUNDED TO ABOUT A KILOMETRE are sent directly from this browser to the
 * Norwegian Meteorological Institute. Not through AsteriaStar — directly. The exact URL is printed
 * on the page before and after, so what was sent is never a matter of trust.
 *
 * The server supplied only things that do not depend on where the reader is: a window of NASA's
 * published ISS state vectors, tonight's astronomical events, and the current geomagnetic activity.
 */

interface SerialisedWindow {
  states: { t: number; p: [number, number, number]; v: [number, number, number] }[];
  startMs: number;
  endMs: number;
}

export interface TonightPlannerProps {
  /** NASA's ISS state vectors for the next couple of days. Location-independent. */
  issWindow: SerialisedWindow | null;
  /** Why the ISS section is empty, when it is. */
  issUnavailable?: string;
  /** Astronomical events inside the next 48 hours. Location-independent. */
  events: AstronomicalEvent[];
  /** The planetary K index and its label, or null when SWPC could not be reached. */
  geomagnetic: { kp: number; label: string; observedAt: string } | null;
  geomagneticUnavailable?: string;
}

type Computed = {
  data: TonightObservingData;
  plan: ObservingPlan;
  passes: SatellitePass[] | null;
  latitude: number;
  longitude: number;
};

function hm(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function hmDay(ms: number): string {
  return new Date(ms).toLocaleString(undefined, { weekday: "short", hour: "2-digit", minute: "2-digit" });
}

const BAND_TONE: Record<ObservingPlan["deepSky"]["band"], string> = {
  good: "border-success/40 bg-success/10 text-success-strong",
  fair: "border-nasa/40 bg-nasa/10 text-fg",
  poor: "border-nasa-red/40 bg-nasa-red/[0.08] text-muted",
  none: "border-white/20 bg-white/[0.045] text-muted",
};

export function TonightPlanner({ issWindow, issUnavailable, events, geomagnetic, geomagneticUnavailable }: TonightPlannerProps) {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [date, setDate] = useState("");
  const [computed, setComputed] = useState<Computed | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  // Replaced rather than mutated, so submitting the same mistake twice is announced twice.
  const [attempt, setAttempt] = useState(0);
  const [cloud, setCloud] = useState<CloudForecast | null>(null);
  const [cloudState, setCloudState] = useState<"idle" | "loading" | "failed">("idle");
  const [cloudProblem, setCloudProblem] = useState<string | null>(null);
  const baseId = useId();

  const ephemeris = useMemo<Ephemeris | null>(() => {
    if (!issWindow) return null;
    const states: StateVector[] = issWindow.states.map((s) => ({ timeMs: s.t, position: s.p, velocity: s.v }));
    return {
      objectName: "ISS", referenceFrame: "EME2000", timeSystem: "UTC",
      startMs: issWindow.startMs, stopMs: issWindow.endMs, states, ascendingNodes: [], comments: [],
    };
  }, [issWindow]);

  const plan = computed
    ? buildObservingPlan({ tonight: computed.data, cloud: cloud ?? undefined })
    : null;

  const onSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    setAttempt((n) => n + 1);
    // A new location invalidates the old forecast; keeping it would attach one place's weather to
    // another place's sky.
    setCloud(null);
    setCloudState("idle");
    setCloudProblem(null);

    const lat = Number(latitude.trim());
    const lon = Number(longitude.trim());
    if (!latitude.trim() || !Number.isFinite(lat) || lat < -90 || lat > 90) {
      setProblem("latitude must be a number between −90 and 90");
      setComputed(null);
      return;
    }
    if (!longitude.trim() || !Number.isFinite(lon) || lon < -180 || lon > 180) {
      setProblem("longitude must be a number between −180 and 180");
      setComputed(null);
      return;
    }

    // The clock is read once, here, at the moment the reader asks — not during render, where it
    // would silently move under them.
    const now = new Date();
    const result = tonight.forLocationDate(
      { latitude: lat, longitude: lon, ...(date ? { date } : {}) },
      now,
    );
    if (!result.ok) {
      setProblem(result.message);
      setComputed(null);
      return;
    }
    const data = result.value.data;
    if (!data) {
      setProblem("the observing engine returned nothing for that location");
      setComputed(null);
      return;
    }
    setProblem(null);
    setComputed({
      data,
      plan: buildObservingPlan({ tonight: data }),
      passes: ephemeris
        ? findPasses(ephemeris, { latitudeDeg: lat, longitudeDeg: lon, altitudeKm: 0 }, now.getTime(), issWindow!.endMs)
        : null,
      latitude: lat,
      longitude: lon,
    });
  };

  const onCloud = async (): Promise<void> => {
    if (!computed) return;
    setCloudState("loading");
    setCloudProblem(null);
    const result = await fetchCloudForecast(computed.latitude, computed.longitude);
    if (result.ok) {
      setCloud(result.value);
      setCloudState("idle");
    } else {
      setCloud(null);
      setCloudState("failed");
      setCloudProblem(result.problem);
    }
  };

  const field = "w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-fg focus-visible:outline-2 focus-visible:outline-nasa";
  // The engine returns messages like `date: …` and `timezone: …` as well as the two this component
  // validates itself, so the match is on the field name wherever it appears at the start — otherwise
  // a rejected date marked no field invalid at all and the message was announced without ever being
  // tied to the input that caused it.
  const invalidField = (name: string): boolean => Boolean(problem?.toLowerCase().startsWith(name));
  const latitudeInvalid = invalidField("latitude");
  const longitudeInvalid = invalidField("longitude");
  const dateInvalid = invalidField("date") || invalidField("timezone");
  const describe = (invalid: boolean): string => (invalid ? `${baseId}-help ${baseId}-error` : `${baseId}-help`);
  const visiblePasses = computed?.passes?.filter((p) => p.visibility === "visible") ?? [];

  return (
    <div className="space-y-8">
      <form onSubmit={onSubmit} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <fieldset>
          <legend className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Where you are observing from</legend>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Type coordinates. Nothing asks your browser for your position, and everything below is
            worked out on your own device from data already loaded — none of it is sent to
            AsteriaStar, nothing is remembered between visits, and the address bar never changes.
            There is exactly one request this page can make with what you type, and only if you press
            the cloud-cover button below: your browser then asks the Norwegian Meteorological
            Institute directly, with the coordinates rounded to about a kilometre. That is described
            in full before you press it.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end">
            <div>
              <label htmlFor={`${baseId}-lat`} className="block text-xs uppercase tracking-wider text-faint">Latitude</label>
              <input id={`${baseId}-lat`} className={`${field} mt-1`} inputMode="decimal" placeholder="51.4779"
                value={latitude} onChange={(e) => setLatitude(e.target.value)}
                aria-invalid={latitudeInvalid || undefined} aria-describedby={describe(latitudeInvalid)} />
            </div>
            <div>
              <label htmlFor={`${baseId}-lon`} className="block text-xs uppercase tracking-wider text-faint">Longitude</label>
              <input id={`${baseId}-lon`} className={`${field} mt-1`} inputMode="decimal" placeholder="-0.0015"
                value={longitude} onChange={(e) => setLongitude(e.target.value)}
                aria-invalid={longitudeInvalid || undefined} aria-describedby={describe(longitudeInvalid)} />
            </div>
            <div>
              <label htmlFor={`${baseId}-date`} className="block text-xs uppercase tracking-wider text-faint">Date (optional)</label>
              <input
                id={`${baseId}-date`} type="date" className={`${field} mt-1`} value={date}
                onChange={(e) => setDate(e.target.value)}
                aria-invalid={dateInvalid || undefined} aria-describedby={describe(dateInvalid)}
              />
            </div>
            <button type="submit" className="rounded-lg border border-nasa/50 bg-nasa/10 px-4 py-2 text-sm font-medium text-fg transition hover:bg-nasa/20">
              Plan tonight
            </button>
          </div>
          <p id={`${baseId}-help`} className="mt-2 text-xs text-faint">
            Decimal degrees. North and east are positive; south and west are negative. Leave the date
            blank for tonight. Times are shown in your device&apos;s own time zone, which the browser
            knows without being told.
          </p>
        </fieldset>
        {problem && (
          <p key={attempt} id={`${baseId}-error`} role="alert" className="mt-3 rounded-lg border border-nasa-red/40 bg-nasa-red/[0.08] px-3 py-2 text-sm text-muted">{problem}</p>
        )}
      </form>

      {/* Only the verdict is announced. Announcing the whole plan would read out several hundred
          words with no way to skip; the detail below is reached by ordinary navigation. */}
      <p role="status" aria-live="polite" className="text-sm text-muted">
        {!computed
          ? "Enter a latitude and longitude to build a plan for tonight."
          : `${plan?.deepSky.headline}. ${Math.round(plan?.darknessMinutes ?? 0)} minutes of astronomical darkness, ${plan?.planets.length ?? 0} naked-eye planets up, ${visiblePasses.length} visible ISS ${visiblePasses.length === 1 ? "pass" : "passes"}.`}
      </p>

      {computed && plan && (
        <div className="space-y-8">
          <section aria-labelledby="verdict-heading" className="scientific-card p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 id="verdict-heading" className="font-display text-lg font-bold text-fg">The plan</h2>
              <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-[0.12em] ${BAND_TONE[plan.deepSky.band]}`}>
                {plan.deepSky.headline}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted">{plan.deepSky.reason}</p>

            <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-4">
              <div>
                <dt className="text-xs uppercase tracking-wider text-faint">Best window</dt>
                <dd className="font-medium text-fg">
                  {plan.bestWindow ? `${hm(plan.bestWindow.startIso)} – ${hm(plan.bestWindow.endIso)}` : "none tonight"}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-faint">Astronomical darkness</dt>
                <dd className="font-medium text-fg">{Math.round(plan.darknessMinutes)} min</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-faint">Moon</dt>
                <dd className="font-medium text-fg">
                  {plan.moon ? `${Math.round(plan.moon.illuminationPercent)}% ${plan.moon.phaseName}` : "not computed"}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-faint">Moonlight impact</dt>
                <dd className="font-medium text-fg">{plan.moon?.impact ?? "—"}</dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="cloud-heading" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <h2 id="cloud-heading" className="font-display text-base font-semibold text-fg">Cloud cover</h2>
            {!cloud && cloudState !== "loading" && (
              <>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Everything above is geometry, and geometry does not know about weather. A cloud-cover
                  forecast is available from the Norwegian Meteorological Institute — but fetching it
                  means sending coordinates somewhere, so it does not happen unless you ask.
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  If you press the button, <strong className="text-fg">this browser</strong> requests{" "}
                  <code className="break-all text-xs text-faint">{metForecastUrl(computed.latitude, computed.longitude)}</code>{" "}
                  directly. AsteriaStar is not involved and never sees it. The coordinates are rounded
                  to {COORDINATE_DECIMALS} decimals — about a kilometre — before they are sent.
                </p>
                <button
                  type="button"
                  onClick={() => void onCloud()}
                  className="mt-3 rounded-lg border border-nasa/50 bg-nasa/10 px-4 py-2 text-sm font-medium text-fg transition hover:bg-nasa/20"
                >
                  Get the cloud forecast
                </button>
              </>
            )}
            {/*
              The cloud result gets its own polite live region. Everything else on this page appears
              as the result of a form submission, which assistive technology follows; this appears
              after an asynchronous request, and without an announcement a screen-reader user pressed
              a button and heard nothing at all. The failure already had `role="alert"`; success did
              not, which is the wrong way round to be inconsistent.
            */}
            <p role="status" aria-live="polite" className="sr-only">
              {cloudState === "loading"
                ? "Asking MET Norway for a cloud forecast."
                : cloudState === "failed"
                  ? `No cloud forecast: ${cloudProblem ?? "the request failed"}.`
                  : plan.cloud
                    ? `${plan.cloud.headline}: ${Math.round(plan.cloud.summary.meanPercent)} per cent mean cloud cover across the dark window.`
                    : plan.cloudUnavailable
                      ? plan.cloudUnavailable
                      : ""}
            </p>
            {cloudState === "loading" && <p className="mt-2 text-sm text-muted">Asking MET Norway…</p>}
            {cloudState === "failed" && (
              <p role="alert" className="mt-2 rounded-lg border border-nasa-red/40 bg-nasa-red/[0.08] px-3 py-2 text-sm text-muted">
                No forecast: {cloudProblem}. The plan above is unaffected — it never depended on it.
              </p>
            )}
            {/*
              A forecast arrived and could not be used — the window is past the end of what MET
              publishes. This used to render nothing at all, so the section collapsed to a bare
              heading after the reader's coordinates had already been sent.
            */}
            {cloud && !plan.cloud && plan.cloudUnavailable && (
              <p className="mt-2 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-sm leading-relaxed text-muted">
                {plan.cloudUnavailable} Cloud cover stays on the list of things this plan does not
                know, below.
              </p>
            )}
            {cloud && plan.cloud && (
              <>
                <p className="mt-2 text-lg font-semibold text-fg">{plan.cloud.headline}</p>
                <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-4">
                  <div><dt className="text-xs text-faint">Mean across the window</dt><dd className="font-medium text-fg">{Math.round(plan.cloud.summary.meanPercent)}%</dd></div>
                  <div><dt className="text-xs text-faint">Best hour</dt><dd className="font-medium text-fg">{Math.round(plan.cloud.summary.minPercent)}%</dd></div>
                  <div><dt className="text-xs text-faint">Worst hour</dt><dd className="font-medium text-fg">{Math.round(plan.cloud.summary.maxPercent)}%</dd></div>
                  <div><dt className="text-xs text-faint">Hourly points used</dt><dd className="font-medium text-fg">{plan.cloud.summary.samples}</dd></div>
                </dl>
                <p className="mt-3 text-xs leading-relaxed text-faint">{plan.cloud.caveat}</p>
                <p className="mt-2 text-xs leading-relaxed text-faint">
                  {MET_ATTRIBUTION}. Forecast issued {cloud.updatedAt ? new Date(cloud.updatedAt).toLocaleString() : "at an unstated time"}; fetched by
                  this browser at {new Date(cloud.fetchedAt).toLocaleString()}. Coordinates sent:{" "}
                  {cloud.sentLatitude}, {cloud.sentLongitude}.{" "}
                  <a href={MET_LICENSE_URL} target="_blank" rel="noreferrer nofollow" className="text-nasa underline-offset-4 hover:underline">Licence</a>
                </p>
              </>
            )}
          </section>

          {plan.planets.length > 0 && (
            <section aria-labelledby="planets-heading">
              <h2 id="planets-heading" className="font-display text-lg font-bold text-fg">Planets up tonight</h2>
              <ul className="mt-3 space-y-2">
                {plan.planets.map((p) => (
                  <li key={p.name} className="scientific-card flex flex-wrap items-baseline justify-between gap-3 p-4">
                    <span className="font-display text-base font-semibold text-fg">{p.name}</span>
                    <span className="text-sm text-muted">
                      magnitude {p.magnitude.toFixed(1)} · {p.altitudeDeg.toFixed(0)}° up in the {compassPoint(p.azimuthDeg)}
                      {p.score !== null ? ` · observability ${Math.round(p.score)}/100` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section aria-labelledby="iss-heading">
            <h2 id="iss-heading" className="font-display text-lg font-bold text-fg">The Space Station</h2>
            {!issWindow && (
              <p className="mt-2 rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-muted">
                No pass predictions: {issUnavailable ?? "NASA's published ephemeris could not be read."} Nothing is estimated in its place.
              </p>
            )}
            {issWindow && visiblePasses.length === 0 && (
              <p className="mt-2 rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-muted">
                No visible pass from your location before the published ephemeris runs out. That is a
                real answer — at some latitudes the station simply does not come high enough in a dark
                sky for days at a time.
              </p>
            )}
            {visiblePasses.length > 0 && (
              <ul className="mt-3 space-y-2">
                {visiblePasses.map((p) => (
                  <li key={p.startMs} className="scientific-card flex flex-wrap items-baseline justify-between gap-3 p-4">
                    <span className="font-display text-base font-semibold text-fg">{hmDay(p.startMs)}</span>
                    <span className="text-sm text-muted">
                      up to {p.maxElevationDeg.toFixed(0)}°, {p.riseCompass} to {p.setCompass}, {Math.round(p.durationSeconds / 60)} min
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section aria-labelledby="excluded-heading" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <h2 id="excluded-heading" className="font-display text-base font-semibold text-fg">What this plan does not know</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted">
              {plan.excluded.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>
      )}

      <section aria-labelledby="context-heading" className="space-y-4">
        <h2 id="context-heading" className="font-display text-lg font-bold text-fg">Everywhere on Earth tonight</h2>
        <p className="text-sm text-muted">
          These do not depend on where you are, so they are the same for every reader and were computed
          on the server.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="scientific-card p-4">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Geomagnetic activity</h3>
            {geomagnetic ? (
              <>
                <p className="mt-1 text-2xl font-semibold text-fg">Kp {geomagnetic.kp.toFixed(1)}</p>
                <p className="text-sm text-muted">{geomagnetic.label}</p>
                <p className="mt-2 text-xs leading-relaxed text-faint">
                  Observed at {new Date(geomagnetic.observedAt).toLocaleString()}. Whether aurora reaches
                  YOUR sky depends on your geomagnetic latitude, which is not your geographic one, and
                  on how far the oval has expanded — AsteriaStar does not compute a verdict for a place,
                  and NOAA publishes the viewline that does.
                </p>
              </>
            ) : (
              <p className="mt-1 text-sm text-muted">Unavailable: {geomagneticUnavailable ?? "NOAA could not be reached."}</p>
            )}
          </div>
          <div className="scientific-card p-4">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Events in the next two days</h3>
            {events.length === 0 ? (
              <p className="mt-1 text-sm text-muted">Nothing dated falls in the next forty-eight hours.</p>
            ) : (
              <ul className="mt-1 space-y-1 text-sm text-muted">
                {events.map((e) => (
                  <li key={e.eventId}>
                    <span className="font-medium text-fg">{e.title}</span> — {new Date(e.start).toUTCString().slice(0, 22)} UTC
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
