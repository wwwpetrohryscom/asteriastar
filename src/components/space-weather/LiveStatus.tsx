import type { ReactNode } from "react";
import { StatusBadge, type StatusTone } from "@/components/ui/StatusBadge";
import { LIVE_STATUS_LABEL, OBSERVATION_KIND_LABEL, PROVIDER_STATE_LABEL, type LiveDataStatus, type LiveDatum, type LiveEnvelope, type ObservationKind, type ProviderState } from "@/platform/live-providers/envelope";
import { FreshnessWatch } from "@/components/space-weather/FreshnessWatch";
import { getLiveProduct } from "@/platform/live-providers/registry";

/**
 * The honest presentation primitives for live data.
 *
 * Every status is carried by a WORD, not only by a colour: red and green are reinforcement here,
 * never the message, so the state survives greyscale, colour-blindness and a high-contrast theme.
 * A value can only be rendered through these components together with its timestamp and its
 * provider, which is what makes "an unlabelled live number" impossible to write by accident.
 */

const STATUS_TONE: Record<LiveDataStatus, StatusTone> = {
  live: "verified-green",
  recent: "verified-green",
  delayed: "stale",
  forecast: "neutral",
  computed: "neutral",
  historical: "neutral",
  stale: "stale",
  unavailable: "unavailable",
  provider_error: "warning-red",
};

const PROVIDER_TONE: Record<ProviderState, StatusTone> = {
  CONNECTED: "verified-green",
  DEGRADED: "stale",
  UNAVAILABLE: "unavailable",
  PLANNED: "planned",
  DISABLED: "inactive",
};

export function LiveStatusBadge({ status }: { status: LiveDataStatus }) {
  return <StatusBadge tone={STATUS_TONE[status]}>{LIVE_STATUS_LABEL[status]}</StatusBadge>;
}

export function ProviderStateBadge({ state }: { state: ProviderState }) {
  return <StatusBadge tone={PROVIDER_TONE[state]}>{PROVIDER_STATE_LABEL[state]}</StatusBadge>;
}

/** A short label naming what kind of number this is. An observation and a model are never merged. */
export function KindLabel({ kind }: { kind: ObservationKind }) {
  return <span className="text-xs uppercase tracking-[0.12em] text-faint">{OBSERVATION_KIND_LABEL[kind]}</span>;
}

/** Format an ISO instant as a readable UTC stamp. Always absolute — a relative age alone ages badly. */
export function utcStamp(iso: string): string {
  return `${iso.slice(0, 10)} ${iso.slice(11, 16)} UTC`;
}

/**
 * The panel shown when a provider gave us nothing. It deliberately contains no number, no dash
 * standing in for one and no empty chart — there is nothing here that could be misread as a
 * measurement of zero.
 */
export function DataUnavailable({ envelope, what }: { envelope: LiveEnvelope<unknown>; what: string }) {
  return (
    <div role="note" className="rounded-2xl border border-nasa-red/40 bg-nasa-red/[0.08] p-5">
      <div className="flex flex-wrap items-center gap-2">
        <LiveStatusBadge status={envelope.status} />
        <span className="text-sm font-semibold text-fg">Current data unavailable</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        {what} could not be read from {envelope.provider}. No value is shown, and none is substituted from anywhere else.
      </p>
      {envelope.error && <p className="mt-2 text-xs text-faint">Reason: {envelope.error}</p>}
      {envelope.lastSuccessAt && (
        <p className="mt-2 text-xs text-faint">
          Last successful read in this server instance: {utcStamp(envelope.lastSuccessAt)}.
        </p>
      )}
    </div>
  );
}

/** The banner shown above a value that is real but out of date. */
export function StaleNotice({ envelope }: { envelope: LiveEnvelope<unknown> }) {
  if (!envelope.stale) return null;
  return (
    <p role="note" className="rounded-lg border border-nasa/40 bg-nasa/[0.08] px-3 py-2 text-xs leading-relaxed text-muted">
      <span className="font-semibold text-nasa">Stale.</span>{" "}
      {envelope.servedFromCache
        ? `The most recent refresh from ${envelope.provider} failed. The value below is the last one that was really fetched, at ${envelope.fetchedAt ? utcStamp(envelope.fetchedAt) : "an earlier time"} — it is not current.`
        : `This reading is older than ${envelope.provider}'s own publication cadence, so it no longer describes current conditions.`}
    </p>
  );
}

/**
 * One live measurement. The number, its unit, what kind of number it is, when it was measured and
 * by whom — all four, always. The freshness badge re-evaluates itself in the browser, because a
 * page can be served from a cache long after the status was computed on the server.
 */
export function LiveValue({
  datum,
  label,
  envelope,
  interpretation,
  precision = 1,
}: {
  datum: LiveDatum;
  label: string;
  envelope: LiveEnvelope<unknown>;
  interpretation?: { label: string; meaning: string; elevated: boolean };
  precision?: number;
}) {
  const product = getLiveProduct(envelope.productKey);
  const value = Number.isInteger(datum.value) ? String(datum.value) : datum.value.toFixed(precision);
  return (
    <div className="scientific-card flex h-full flex-col p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-faint">{label}</h3>
        <FreshnessWatch
          serverStatus={datum.status}
          referenceIso={product?.freshness.basis === "fetch" ? (envelope.fetchedAt ?? datum.observedAt) : datum.observedAt}
          policy={product?.freshness}
        />
      </div>
      <p className="mt-3 font-display text-3xl font-bold text-fg">
        {value}
        {datum.unit && <span className="ml-1.5 text-base font-medium text-muted">{datum.unit}</span>}
      </p>
      {interpretation && (
        <p className={`mt-1 text-sm font-medium ${interpretation.elevated ? "text-nasa" : "text-muted"}`}>{interpretation.label}</p>
      )}
      {interpretation && <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{interpretation.meaning}</p>}
      <dl className="mt-4 space-y-1 border-t border-white/5 pt-3 text-xs text-faint">
        <div className="flex justify-between gap-3">
          <dt>Measured</dt>
          <dd className="text-right font-medium text-muted">{utcStamp(datum.observedAt)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Type</dt>
          <dd className="text-right font-medium text-muted">{OBSERVATION_KIND_LABEL[datum.kind]}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Provider</dt>
          <dd className="text-right font-medium text-muted">{envelope.provider}</dd>
        </div>
      </dl>
      {datum.quality && <p className="mt-2 text-xs leading-relaxed text-faint">{datum.quality}</p>}
    </div>
  );
}

/**
 * Full provenance for one envelope: provider, exact URL, timestamps, cadence, cache window and
 * limitations. This is what makes every number on the page auditable by a reader who wants to
 * fetch the same file themselves.
 */
export function EnvelopeDetails({ envelope, title = "Provenance" }: { envelope: LiveEnvelope<unknown>; title?: string }) {
  const product = getLiveProduct(envelope.productKey);
  const rows: [string, ReactNode][] = [
    ["Status", LIVE_STATUS_LABEL[envelope.status]],
    ["Kind", OBSERVATION_KIND_LABEL[envelope.kind]],
    ["Provider", envelope.provider],
    ["Organisation", envelope.organization],
  ];
  if (envelope.fetchedAt) rows.push(["Fetched", utcStamp(envelope.fetchedAt)]);
  if (envelope.generatedAt) rows.push(["Generated by provider", utcStamp(envelope.generatedAt)]);
  if (envelope.validUntil) rows.push(["Valid until", utcStamp(envelope.validUntil)]);
  if (envelope.refreshCadenceSeconds) rows.push(["Provider cadence", humanDuration(envelope.refreshCadenceSeconds)]);
  rows.push(["Cached for", humanDuration(envelope.cacheSeconds)]);
  if (product) rows.push(["Treated as stale after", humanDuration(product.freshness.staleAfterSeconds)]);
  rows.push(["Licence", envelope.license]);

  return (
    <section className="scientific-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* h3, not h2: every page renders these UNDER its own "Provenance" h2, and heading-based
            navigation should show that containment rather than four peer top-level sections. */}
        <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-faint">{title}</h3>
        <LiveStatusBadge status={envelope.status} />
      </div>
      <dl className="mt-3 divide-y divide-white/5">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-3 py-2 text-sm">
            <dt className="text-faint">{k}</dt>
            <dd className="min-w-0 text-right font-medium break-words text-fg">{v}</dd>
          </div>
        ))}
      </dl>
      {envelope.sourceUrl && (
        <p className="mt-3 text-xs break-all text-faint">
          Source file:{" "}
          <a href={envelope.sourceUrl} target="_blank" rel="noreferrer nofollow" className="text-nasa underline-offset-4 hover:underline">
            {envelope.sourceUrl}
          </a>
        </p>
      )}
      <p className="mt-2 text-xs leading-relaxed text-faint">{envelope.provenance}</p>
      {envelope.limitations && <p className="mt-2 text-xs leading-relaxed text-faint">{envelope.limitations}</p>}
    </section>
  );
}

/** Seconds as a short human duration. Used for cadences and cache windows, never for a datum's age. */
export function humanDuration(seconds: number): string {
  if (seconds < 60) return `${seconds} s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} min`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} h`;
  return `${Math.round(seconds / 86400)} d`;
}
