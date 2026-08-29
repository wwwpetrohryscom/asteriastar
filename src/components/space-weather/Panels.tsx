import type { LiveEnvelope } from "@/platform/live-providers/envelope";
import type {
  ActiveRegionReport, AuroraForecastSummary, DonkiCmeEvent, DonkiFlareEvent, DonkiSepEvent, DonkiStormEvent,
  NoaaScaleDay, SpaceWeatherAlert, XrayFlareState,
} from "@/platform/space-weather/model";
import { explainAuroraBoundary, explainFlareClass, explainScale, scaleElevated, scaleLabel } from "@/platform/space-weather/explain";
import { DataUnavailable, KindLabel, StaleNotice, utcStamp } from "@/components/space-weather/LiveStatus";
import { FreshnessWatch } from "@/components/space-weather/FreshnessWatch";
import { getLiveProduct } from "@/platform/live-providers/registry";
import { StatusBadge } from "@/components/ui/StatusBadge";

/**
 * The space-weather panels.
 *
 * Each takes a whole envelope rather than a value, so the unavailable and stale paths are handled
 * in the same place the data path is — a panel physically cannot render a number without having
 * dealt with the case where there isn't one. Every panel that shows nothing says why.
 */

/** The shell every panel shares: heading, status, stale banner, and the unavailable path. */
function Panel({
  envelope,
  title,
  what,
  children,
  id,
}: {
  envelope: LiveEnvelope<unknown>;
  title: string;
  what: string;
  children: React.ReactNode;
  id: string;
}) {
  const hasData = envelope.data !== undefined;
  const product = getLiveProduct(envelope.productKey);
  const reference = product?.freshness.basis === "fetch" ? envelope.fetchedAt : (envelope.generatedAt ?? envelope.fetchedAt);
  return (
    <section aria-labelledby={id} className="space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id={id} className="font-display text-xl font-bold">{title}</h2>
        <FreshnessWatch serverStatus={envelope.status} referenceIso={reference} policy={product?.freshness} />
      </div>
      {!hasData ? <DataUnavailable envelope={envelope} what={what} /> : (
        <>
          <StaleNotice envelope={envelope} />
          {children}
        </>
      )}
    </section>
  );
}

/* ----------------------------------------------------------- NOAA scales */

const SCALE_KINDS = [
  ["G", "Geomagnetic storms"],
  ["S", "Solar radiation storms"],
  ["R", "Radio blackouts"],
] as const;

function levelOf(day: NoaaScaleDay, kind: "R" | "S" | "G"): number | undefined {
  const block = kind === "R" ? day.radioBlackout : kind === "S" ? day.solarRadiation : day.geomagnetic;
  return block?.scale;
}

export function ScalePanel({ envelope, current, forecast }: { envelope: LiveEnvelope<NoaaScaleDay[]>; current?: NoaaScaleDay; forecast: NoaaScaleDay[] }) {
  return (
    <Panel envelope={envelope} title="NOAA space weather scales" what="The NOAA R, S and G scales" id="scales-heading">
      {current && (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {SCALE_KINDS.map(([kind, name]) => {
            const level = levelOf(current, kind);
            const elevated = level !== undefined && scaleElevated(level);
            return (
              <li key={kind} className="scientific-card p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-fg">{name}</h3>
                  <StatusBadge tone={elevated ? "warning-red" : level && level > 0 ? "stale" : "verified-green"}>
                    {level === undefined ? "No level published" : scaleLabel(kind, level)}
                  </StatusBadge>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-faint">{explainScale(kind)}</p>
              </li>
            );
          })}
        </ul>
      )}
      {current && (
        <p className="text-xs text-faint">
          Observed levels for {current.date}, stamped by NOAA at {utcStamp(current.at)}. A level of zero means the threshold was
          genuinely not reached — it is a measurement, not a missing value.
        </p>
      )}

      {forecast.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full min-w-[420px] text-left text-sm">
            <caption className="px-3 pt-3 text-left text-xs text-faint">
              NOAA&apos;s three-day forecast. These are predictions, not observations: the G column is an expected level and the
              R and S columns are probabilities.
            </caption>
            <thead className="text-faint">
              <tr>
                <th scope="col" className="px-3 py-2 text-xs font-medium">Date</th>
                <th scope="col" className="px-3 py-2 text-xs font-medium">Geomagnetic (G)</th>
                <th scope="col" className="px-3 py-2 text-xs font-medium">Radio blackout ≥ R1</th>
                <th scope="col" className="px-3 py-2 text-xs font-medium">Radiation storm</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {forecast.map((d) => (
                <tr key={d.date}>
                  <td className="px-3 py-2 text-muted">{d.date}</td>
                  <td className="px-3 py-2 font-medium text-fg">
                    {d.geomagnetic ? (d.geomagnetic.scale > 0 ? `G${d.geomagnetic.scale} ${d.geomagnetic.text ?? ""}` : "None expected") : "—"}
                  </td>
                  <td className="px-3 py-2 text-muted">{d.probabilities?.radioMinor !== undefined ? `${d.probabilities.radioMinor}%` : "—"}</td>
                  <td className="px-3 py-2 text-muted">{d.probabilities?.solarRadiation !== undefined ? `${d.probabilities.solarRadiation}%` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}

/* --------------------------------------------------------------- alerts */

const ALERT_TONE = { watch: "stale", warning: "stale", alert: "warning-red", summary: "neutral", cancellation: "inactive", other: "neutral" } as const;

export function AlertPanel({ envelope, active, recent, nowIso }: { envelope: LiveEnvelope<SpaceWeatherAlert[]>; active: SpaceWeatherAlert[]; recent: SpaceWeatherAlert[]; nowIso: string }) {
  return (
    <Panel envelope={envelope} title="Watches, warnings and alerts" what="SWPC's operational message stream" id="alerts-heading">
      {active.length === 0 ? (
        <p className="rounded-lg border border-success/30 bg-success/[0.06] px-4 py-3 text-sm text-muted">
          No SWPC watch, warning or alert is inside its stated validity window right now. This is a real reading of the message
          stream, not an absence of data.
        </p>
      ) : (
        <ul className="space-y-3">
          {active.map((a) => (
            <li key={`${a.productId}-${a.issuedAt}`} className="scientific-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-fg">{a.headline}</h3>
                <StatusBadge tone={ALERT_TONE[a.kind]}>{a.kind}</StatusBadge>
              </div>
              <dl className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-faint">
                <div className="flex gap-1.5"><dt>Issued</dt><dd className="text-muted">{utcStamp(a.issuedAt)}</dd></div>
                {a.validFrom && <div className="flex gap-1.5"><dt>From</dt><dd className="text-muted">{utcStamp(a.validFrom)}</dd></div>}
                {a.validUntil && <div className="flex gap-1.5"><dt>Until</dt><dd className="text-muted">{utcStamp(a.validUntil)}</dd></div>}
                {a.scale && <div className="flex gap-1.5"><dt>Scale</dt><dd className="text-muted">{a.scale}</dd></div>}
                <div className="flex gap-1.5"><dt>Product</dt><dd className="text-muted">{a.productId}</dd></div>
              </dl>
              <details className="mt-2">
                <summary className="cursor-pointer text-xs text-muted hover:text-fg">Full message as issued</summary>
                {/* Provider text, normalised to plain text and rendered as text. Never as markup. */}
                <pre className="mt-2 overflow-x-auto rounded-lg border border-white/10 bg-black/40 p-3 text-xs whitespace-pre-wrap text-muted">{a.message}</pre>
              </details>
            </li>
          ))}
        </ul>
      )}

      {recent.length > 0 && (
        <details>
          <summary className="cursor-pointer text-sm text-muted hover:text-fg">Recently issued messages ({recent.length})</summary>
          <ul className="mt-3 space-y-2">
            {recent.map((a) => (
              <li key={`r-${a.productId}-${a.issuedAt}`} className="flex flex-wrap items-baseline justify-between gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm">
                <span className="text-muted">{a.headline}</span>
                <span className="text-xs text-faint">{utcStamp(a.issuedAt)}{a.validUntil && a.validUntil <= nowIso ? " · expired" : ""}</span>
              </li>
            ))}
          </ul>
        </details>
      )}
    </Panel>
  );
}

/* -------------------------------------------------------------- the Sun */

export function XrayFlarePanel({ envelope }: { envelope: LiveEnvelope<XrayFlareState> }) {
  const f = envelope.data;
  const interpretation = f?.currentClass ? explainFlareClass(f.currentClass) : undefined;
  return (
    <Panel envelope={envelope} title="X-ray flux and the current flare" what="The GOES X-ray flare state" id="xray-heading">
      {f && (
        <div className="scientific-card p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <p className="font-display text-3xl font-bold text-fg">{f.currentClass ?? "No class published"}</p>
            {f.inProgress && <StatusBadge tone="stale">Event in progress</StatusBadge>}
          </div>
          {interpretation && <p className="mt-2 text-sm leading-relaxed text-muted">{interpretation.meaning}</p>}
          <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-1 border-t border-white/5 pt-3 text-xs sm:grid-cols-2">
            <div className="flex justify-between gap-3"><dt className="text-faint">Reading taken</dt><dd className="text-muted">{utcStamp(f.observedAt)}</dd></div>
            {f.satellite !== undefined && <div className="flex justify-between gap-3"><dt className="text-faint">Satellite</dt><dd className="text-muted">GOES-{f.satellite}</dd></div>}
            {f.beganAt && <div className="flex justify-between gap-3"><dt className="text-faint">Event began</dt><dd className="text-muted">{utcStamp(f.beganAt)}</dd></div>}
            {f.peakedAt && <div className="flex justify-between gap-3"><dt className="text-faint">Peak</dt><dd className="text-muted">{utcStamp(f.peakedAt)}{f.peakClass ? ` · ${f.peakClass}` : ""}</dd></div>}
            {f.endedAt && <div className="flex justify-between gap-3"><dt className="text-faint">Event ended</dt><dd className="text-muted">{utcStamp(f.endedAt)}</dd></div>}
          </dl>
          {f.inProgress && (
            <p className="mt-3 text-xs leading-relaxed text-faint">
              This event has no end time yet, so its peak class can still rise. The class shown is the flux at the reading time,
              not a final classification.
            </p>
          )}
        </div>
      )}
    </Panel>
  );
}

export function ActiveRegionPanel({ envelope }: { envelope: LiveEnvelope<ActiveRegionReport> }) {
  const r = envelope.data;
  return (
    <Panel envelope={envelope} title="Active regions on the visible disc" what="NOAA's daily solar region summary" id="regions-heading">
      {r && (
        <>
          <p className="text-sm text-muted">
            {r.regionCount === 0
              ? `NOAA numbered no active regions on the visible disc in the report for ${r.observedDate}.`
              : `${r.regionCount} numbered active region${r.regionCount === 1 ? "" : "s"} in the report for ${r.observedDate}${
                  r.spotTotal !== undefined
                    ? `, with ${r.spotTotal} sunspots counted across ${
                        r.spotTotalFromRegions === r.regionCount ? "them" : `${r.spotTotalFromRegions} of them — NOAA published no spot count for the ${r.regionCount - (r.spotTotalFromRegions ?? 0)} remaining`
                      }`
                    : ""
                }.`}
          </p>
          {r.regions.length > 0 && (
            <div className="overflow-x-auto rounded-lg border border-white/10">
              <table className="w-full min-w-[540px] text-left text-sm">
                <caption className="px-3 pt-3 text-left text-xs text-faint">
                  Sunspot area is in millionths of a solar hemisphere. The spot counts here are counts within numbered regions and
                  are not the International Sunspot Number, which is defined differently.
                </caption>
                <thead className="text-faint">
                  <tr>
                    <th scope="col" className="px-3 py-2 text-xs font-medium">Region</th>
                    <th scope="col" className="px-3 py-2 text-xs font-medium">Location</th>
                    <th scope="col" className="px-3 py-2 text-xs font-medium">Area</th>
                    <th scope="col" className="px-3 py-2 text-xs font-medium">Spots</th>
                    <th scope="col" className="px-3 py-2 text-xs font-medium">Class</th>
                    <th scope="col" className="px-3 py-2 text-xs font-medium">M / X flare chance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {r.regions.map((region) => (
                    <tr key={region.number}>
                      <td className="px-3 py-2 font-medium text-fg">{region.number}</td>
                      <td className="px-3 py-2 text-muted">{region.location ?? "—"}</td>
                      <td className="px-3 py-2 text-muted">{region.areaMillionths ?? "—"}</td>
                      <td className="px-3 py-2 text-muted">{region.spotCount ?? "—"}</td>
                      <td className="px-3 py-2 text-muted">{[region.spotClass, region.magClass].filter(Boolean).join(" / ") || "—"}</td>
                      <td className="px-3 py-2 text-muted">
                        {region.flareProbability?.m !== undefined || region.flareProbability?.x !== undefined
                          ? `${region.flareProbability?.m !== undefined ? `${region.flareProbability.m}%` : "—"} / ${region.flareProbability?.x !== undefined ? `${region.flareProbability.x}%` : "—"}`
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </Panel>
  );
}

/* --------------------------------------------------------------- aurora */

export function AuroraPanel({ envelope }: { envelope: LiveEnvelope<AuroraForecastSummary> }) {
  const a = envelope.data;
  return (
    <Panel envelope={envelope} title="Aurora forecast" what="NOAA's OVATION aurora model" id="aurora-heading">
      {a && (
        <>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {([["Northern hemisphere", a.northern], ["Southern hemisphere", a.southern]] as const).map(([name, h]) => {
              const interpretation = explainAuroraBoundary(h.equatorwardBoundaryLat, h.maxProbabilityPercent, a.thresholdPercent);
              return (
                <li key={name} className="scientific-card p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-faint">{name}</h3>
                    <KindLabel kind="computed" />
                  </div>
                  <p className={`mt-2 font-display text-2xl font-bold ${interpretation.elevated ? "text-nasa" : "text-fg"}`}>{interpretation.label}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{interpretation.meaning}</p>
                </li>
              );
            })}
          </ul>
          <div className="scientific-card p-4 text-xs leading-relaxed text-faint">
            <p>
              Derived from NOAA&apos;s OVATION grid by method <code className="text-muted">{a.method}</code>: the most equatorward
              latitude at which the model gives at least a {a.thresholdPercent}% chance of visible aurora at any longitude, over
              all {a.gridCells.toLocaleString("en-GB")} grid cells in the response. The computation is AsteriaStar&apos;s; the
              probabilities are NOAA&apos;s.
            </p>
            <p className="mt-2">
              The model observation is from {utcStamp(a.observedAt)} and the forecast is valid for {utcStamp(a.forecastFor)}.
              This says nothing about any particular place: cloud, moonlight, light pollution and your northern horizon are not in
              this dataset, and AsteriaStar will not guess at them.
            </p>
          </div>
        </>
      )}
    </Panel>
  );
}

/* ---------------------------------------------------------- DONKI events */

/**
 * NOAA active-region numbers passed 10,000 long ago. DONKI records the full number; SWPC's daily
 * region report publishes only its last four digits. Both appear on the solar-activity page, so
 * the convention is stated rather than either provider's value being silently rewritten.
 */
export function RegionNumberNote() {
  return (
    <p className="rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-xs leading-relaxed text-faint">
      Region numbers here are DONKI&apos;s full five-digit NOAA numbers. NOAA&apos;s daily region report, above, publishes the
      last four digits of the same number — so DONKI&apos;s region 14518 and the report&apos;s region 4518 are one region. Neither
      provider&apos;s value is rewritten.
    </p>
  );
}

/** The caveat CCMC states about DONKI, shown wherever DONKI events are. */
export function DonkiCaveat() {
  return (
    <p className="rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-xs leading-relaxed text-faint">
      DONKI is NASA CCMC&apos;s analyst-curated research catalogue, and CCMC states that its real-time contents
      &ldquo;should be considered only as prototyping quality and in research context&rdquo;. Curation lags events by hours, so an
      empty list here means nothing has been catalogued yet — not that nothing happened. For operational status, read the SWPC
      alerts above.
    </p>
  );
}

function EmptyFeed({ what }: { what: string }) {
  return (
    <p className="rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-muted">
      No {what} are catalogued in this window. The feed was read successfully and returned no records.
    </p>
  );
}

export function FlareEventPanel({ envelope, limit = 8 }: { envelope: LiveEnvelope<DonkiFlareEvent[]>; limit?: number }) {
  const events = envelope.data ?? [];
  return (
    <Panel envelope={envelope} title="Catalogued solar flares" what="The DONKI flare catalogue" id="flare-events-heading">
      {events.length === 0 ? <EmptyFeed what="flares" /> : (
        <ul className="space-y-2">
          {events.slice(0, limit).map((e) => (
            <li key={e.id} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-lg border border-white/10 px-4 py-3 text-sm">
              <span className="font-medium text-fg">
                {e.flareClass ?? "Unclassified"}
                {e.activeRegion ? <span className="ml-2 text-xs font-normal text-faint">region {e.activeRegion}</span> : null}
                {e.sourceLocation ? <span className="ml-2 text-xs font-normal text-faint">{e.sourceLocation}</span> : null}
              </span>
              <span className="text-xs text-faint">
                began {utcStamp(e.beganAt)}
                {e.peakedAt ? ` · peak ${e.peakedAt.slice(11, 16)}` : ""}
                {e.link ? <> · <a href={e.link} target="_blank" rel="noreferrer nofollow" className="text-nasa underline-offset-4 hover:underline">DONKI record</a></> : null}
              </span>
            </li>
          ))}
        </ul>
      )}
      <RegionNumberNote />
      <DonkiCaveat />
    </Panel>
  );
}

export function CmeEventPanel({ envelope, limit = 8 }: { envelope: LiveEnvelope<DonkiCmeEvent[]>; limit?: number }) {
  const events = envelope.data ?? [];
  return (
    <Panel envelope={envelope} title="Catalogued coronal mass ejections" what="The DONKI CME catalogue" id="cme-events-heading">
      {events.length === 0 ? <EmptyFeed what="coronal mass ejections" /> : (
        <ul className="space-y-2">
          {events.slice(0, limit).map((e) => (
            <li key={e.id} className="rounded-lg border border-white/10 px-4 py-3 text-sm">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span className="font-medium text-fg">
                  {e.analysis?.speedKmS !== undefined ? `${e.analysis.speedKmS.toFixed(0)} km/s` : "Speed not analysed"}
                  {e.analysis?.halfAngleDeg !== undefined ? <span className="ml-2 text-xs font-normal text-faint">half-angle {e.analysis.halfAngleDeg}°</span> : null}
                  {e.sourceLocation ? <span className="ml-2 text-xs font-normal text-faint">{e.sourceLocation}</span> : null}
                </span>
                <span className="text-xs text-faint">
                  first seen {utcStamp(e.startedAt)}
                  {e.link ? <> · <a href={e.link} target="_blank" rel="noreferrer nofollow" className="text-nasa underline-offset-4 hover:underline">DONKI record</a></> : null}
                </span>
              </div>
              {e.analysis && !e.analysis.isMostAccurate && (
                <p className="mt-1 text-xs text-faint">From a preliminary analysis; DONKI has not marked a fit as the accepted one.</p>
              )}
              {e.note && <p className="mt-1 text-xs leading-relaxed text-faint">{e.note}</p>}
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs leading-relaxed text-faint">
        Most coronal mass ejections are not directed at Earth. A speed here describes the ejection, not an impact: whether one
        reaches Earth, and when, is a separate modelled question that this catalogue does not answer.
      </p>
      <DonkiCaveat />
    </Panel>
  );
}

export function StormEventPanel({ envelope, limit = 6 }: { envelope: LiveEnvelope<DonkiStormEvent[]>; limit?: number }) {
  const events = envelope.data ?? [];
  return (
    <Panel envelope={envelope} title="Catalogued geomagnetic storms" what="The DONKI geomagnetic storm catalogue" id="storm-events-heading">
      {events.length === 0 ? <EmptyFeed what="geomagnetic storms" /> : (
        <ul className="space-y-2">
          {events.slice(0, limit).map((e) => (
            <li key={e.id} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-lg border border-white/10 px-4 py-3 text-sm">
              <span className="font-medium text-fg">
                {e.maxKp !== undefined ? `Peak Kp ${e.maxKp.toFixed(2)}` : "Kp not recorded"}
                <span className="ml-2 text-xs font-normal text-faint">{e.kpValues.length} recorded interval{e.kpValues.length === 1 ? "" : "s"}</span>
              </span>
              <span className="text-xs text-faint">
                began {utcStamp(e.startedAt)}
                {e.link ? <> · <a href={e.link} target="_blank" rel="noreferrer nofollow" className="text-nasa underline-offset-4 hover:underline">DONKI record</a></> : null}
              </span>
            </li>
          ))}
        </ul>
      )}
      <DonkiCaveat />
    </Panel>
  );
}

export function SepEventPanel({ envelope, limit = 6 }: { envelope: LiveEnvelope<DonkiSepEvent[]>; limit?: number }) {
  const events = envelope.data ?? [];
  return (
    <Panel envelope={envelope} title="Catalogued solar energetic particle events" what="The DONKI SEP catalogue" id="sep-events-heading">
      {events.length === 0 ? <EmptyFeed what="solar energetic particle events" /> : (
        <ul className="space-y-2">
          {events.slice(0, limit).map((e) => (
            <li key={e.id} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-lg border border-white/10 px-4 py-3 text-sm">
              <span className="font-medium text-fg">{e.instruments[0] ?? "Instrument not recorded"}</span>
              <span className="text-xs text-faint">
                {utcStamp(e.eventAt)}
                {e.link ? <> · <a href={e.link} target="_blank" rel="noreferrer nofollow" className="text-nasa underline-offset-4 hover:underline">DONKI record</a></> : null}
              </span>
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs leading-relaxed text-faint">
        Each record names the instrument and energy channel that detected the event, because a detection in one channel is not a
        detection in another.
      </p>
      <DonkiCaveat />
    </Panel>
  );
}
