import Link from "next/link";
import { getSource, type SourceKey } from "@/lib/sources";
import { DATA_STATUS_LABEL, type DataStatus, type SkyEnvelope } from "@/platform/live-sky/schema";
import type { ProviderInfo } from "@/platform/live-sky/providers";

/**
 * Live Sky UI — honest data-state components. Their whole job is to make it
 * impossible to mistake architecture for live data: every panel states its
 * status, its source, and its provenance, and "prepared" states show no values.
 */

const STATUS_CLASSES: Record<DataStatus, string> = {
  reference: "border-success/40 bg-success/10 text-success-strong",
  prepared: "border-nasa/40 bg-nasa/10 text-nasa",
  computed: "border-white/20 bg-white/[0.045] text-muted",
  live: "border-success/40 bg-success/10 text-success-strong",
  stale: "border-nasa-red/50 bg-nasa-red/[0.12] text-nasa",
};

/** A small pill stating the honesty status of a datum. */
export function DataStatusBadge({ status }: { status: DataStatus }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_CLASSES[status]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {DATA_STATUS_LABEL[status]}
    </span>
  );
}

/** Inline source chips linking to the source registry entries. */
export function SourceLabel({ sources }: { sources: readonly SourceKey[] }) {
  if (!sources.length) return null;
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      {sources.map((k) => {
        const s = getSource(k);
        return (
          <a key={k} href={s.url} target="_blank" rel="noreferrer nofollow" className="rounded-md border border-white/10 bg-white/[0.03] px-1.5 py-0.5 text-xs text-faint transition hover:text-fg">
            {s.name}
          </a>
        );
      })}
    </span>
  );
}

/**
 * The prominent, honest panel: THIS page shows no live values.
 *
 * The headline used to read "No live data is shown", which was a claim about the whole platform.
 * Once NOAA SWPC and NASA DONKI were connected it became self-contradictory — the panel printed it
 * directly above a provider list saying "Status: connected". A page not showing live values and a
 * provider not being connected are two different facts, so the panel now states the first and, when
 * a listed provider is connected, says where its values actually are.
 */
export function PreparedForIntegration({
  providers,
  envelope,
  counterpart = { href: "/space-weather", label: "space-weather section" },
}: {
  providers: ProviderInfo[];
  envelope?: SkyEnvelope;
  /**
   * Where the working counterpart of this reference page lives. Not every one is space weather, and
   * pass `undefined` when there genuinely is none.
   */
  counterpart?: { href: string; label: string };
}) {
  const connected = providers.filter((p) => p.status === "connected");
  return (
    <aside role="note" className="rounded-2xl border border-nasa/40 bg-nasa/10 p-5">
      <div className="flex items-center gap-2">
        <DataStatusBadge status="prepared" />
        <span className="text-sm font-semibold text-nasa">This page shows no live values</span>
      </div>
      {/*
        The pointer to the working counterpart is NOT conditional on a provider being connected.
        It used to be, and the result was that `/sky/this-month` — whose only listed provider is an
        almanac that is still planned — told a reader nothing was available while `/events/this-month`
        served fifteen dated events one click away. What makes the counterpart real is that the page
        exists, not that this particular page's provider list happens to contain a connected entry.
      */}
      {counterpart && (
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Dated, current values for this subject are served in the{" "}
          <Link href={counterpart.href} className="text-nasa underline-offset-4 hover:underline">{counterpart.label}</Link>. This
          page is the reference material behind them.
          {connected.length > 0 && (
            <>
              {" "}
              {connected.length === 1 ? `${connected[0].name} is` : `${connected.map((p) => p.name).join(" and ")} are`} connected
              there, with the provider&apos;s own timestamps.
            </>
          )}
        </p>
      )}
      <p className="mt-2 text-sm leading-relaxed text-muted">
        {envelope?.provenance ??
          "This module is architecture only. The platform never fabricates live values, positions, forecasts, or event dates — nothing is shown until a real provider is connected and its licensing verified."}
      </p>
      {providers.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-faint">Prepared to integrate</p>
          <ul className="mt-2 space-y-2">
            {providers.map((p) => (
              <li key={p.key} className="scientific-card p-3">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <a href={p.url} target="_blank" rel="noreferrer nofollow" className="font-medium text-fg underline-offset-4 hover:text-nasa hover:underline">{p.name}</a>
                  <span className="text-xs text-faint">{p.organization}</span>
                </div>
                <p className="mt-1 text-sm text-muted">{p.dataKinds.join(" · ")}</p>
                <p className="mt-1 text-xs text-faint">Status: {p.status} · Access: {p.access} · {p.license}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}

/** A compact provenance card for a reference or prepared datum. */
export function EnvelopeCard({ envelope }: { envelope: SkyEnvelope }) {
  const rows: [string, string][] = [
    ["Status", DATA_STATUS_LABEL[envelope.status]],
    ["Source", envelope.source.map((s) => getSource(s).name).join(", ")],
    ["Generated", envelope.generatedAt ? envelope.generatedAt.slice(0, 10) : "— (no value generated)"],
    ["Confidence", envelope.confidence],
  ];
  return (
    <section aria-labelledby="provenance" className="scientific-card p-5">
      <div className="flex items-center justify-between gap-2">
        <h2 id="provenance" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Data provenance</h2>
        <DataStatusBadge status={envelope.status} />
      </div>
      <dl className="mt-3 divide-y divide-white/5">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-3 py-2 text-sm">
            <dt className="text-faint">{k}</dt>
            <dd className="text-right font-medium text-fg">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-xs leading-relaxed text-faint">{envelope.provenance}</p>
      <p className="mt-2 text-xs leading-relaxed text-faint">Licensing: {envelope.licenseNotes}</p>
    </section>
  );
}

/** Honest location placeholder — no geolocation is assumed or fabricated. */
export function LocationPlaceholder() {
  return (
    <section aria-labelledby="location" className="scientific-card p-5">
      <h2 id="location" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Your location</h2>
      <p className="mt-2 text-sm text-muted">Location-aware sky data is prepared for integration. No location is assumed, requested, or inferred yet — sky times depend entirely on where you are, and none are shown until you can set a location.</p>
      <button type="button" disabled aria-disabled className="mt-3 w-full cursor-not-allowed rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-faint">
        Set location — coming with live-data integration
      </button>
    </section>
  );
}

/** A generic linked reference card. */
export function RefCards({ refs }: { refs: { id: string; name: string; href: string }[] }) {
  if (!refs.length) return null;
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {refs.map((r) => (
        <Link key={r.id} href={r.href} className="scientific-card p-3 transition hover:border-white/25">
          <div className="font-medium text-fg">{r.name}</div>
        </Link>
      ))}
    </div>
  );
}

/** Section wrapper matching the platform's page style. */
export function SkySection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id}>
      <h2 id={id} className="font-display text-2xl font-bold">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}
