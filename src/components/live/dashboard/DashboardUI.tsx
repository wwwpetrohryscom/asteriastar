import Link from "next/link";
import { liveDashboardPath, ROUTES, type LiveDashboardSlug } from "@/lib/routes";
import { EnvelopeDetails, LiveStatusBadge } from "@/components/space-weather/LiveStatus";
import type { LiveEnvelope } from "@/platform/live-providers/envelope";

/**
 * Shared furniture for the live dashboard.
 *
 * The dashboard exists to answer one question — what is happening right now, and what does it mean
 * for tonight — and it does that by summarising the four operational sections rather than repeating
 * them. Every tile shows two or three current values, says when they were measured, and hands the
 * reader on to the section that explains them. Nothing here re-derives anything.
 */

export const LIVE_DASHBOARD_PAGES: { slug: LiveDashboardSlug; title: string; blurb: string }[] = [
  { slug: "tonight", title: "Tonight", blurb: "A plan for coordinates you type, computed in your browser." },
  { slug: "space-weather", title: "Space weather", blurb: "The solar wind and the geomagnetic index, right now." },
  { slug: "neo", title: "Near-Earth objects", blurb: "What is passing, and what is being watched." },
  { slug: "satellites", title: "Satellites", blurb: "Where the Space Station is at this moment." },
  { slug: "events", title: "Events", blurb: "What the calendar says is happening this week." },
];

export function LiveDashboardNav({ current }: { current?: LiveDashboardSlug | "home" }) {
  return (
    <nav aria-label="Live dashboard sections" className="flex flex-wrap gap-2">
      <Link
        href={ROUTES.live}
        aria-current={current === "home" ? "page" : undefined}
        className={`rounded-full border px-3 py-1.5 text-sm transition ${current === "home" ? "border-nasa/50 bg-nasa/10 text-fg" : "border-white/12 text-muted hover:border-white/30 hover:text-fg"}`}
      >
        Live now
      </Link>
      {LIVE_DASHBOARD_PAGES.map((p) => (
        <Link
          key={p.slug}
          href={liveDashboardPath(p.slug)}
          aria-current={current === p.slug ? "page" : undefined}
          className={`rounded-full border px-3 py-1.5 text-sm transition ${current === p.slug ? "border-nasa/50 bg-nasa/10 text-fg" : "border-white/12 text-muted hover:border-white/30 hover:text-fg"}`}
        >
          {p.title}
        </Link>
      ))}
    </nav>
  );
}

/**
 * One current value.
 *
 * `value` is optional on purpose: a tile with nothing to show renders the reason, not a dash that
 * could be read as zero. There is no path here that turns an absent measurement into a number.
 */
export function DashboardStat({
  label,
  value,
  unit,
  detail,
  unavailable,
}: {
  label: string;
  value?: string | number;
  unit?: string;
  detail?: string;
  unavailable?: string;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-faint">{label}</p>
      {value !== undefined ? (
        <p className="mt-0.5 font-display text-2xl font-semibold text-fg">
          {value}
          {unit ? <span className="ml-1 text-base font-normal text-muted">{unit}</span> : null}
        </p>
      ) : (
        <p className="mt-0.5 text-sm text-muted">{unavailable ?? "Not available"}</p>
      )}
      {detail && <p className="mt-0.5 text-xs leading-relaxed text-faint">{detail}</p>}
    </div>
  );
}

/** A domain tile: a heading, its freshness, some current values, and the way onward. */
export function DashboardTile({
  title,
  envelope,
  href,
  hrefLabel,
  children,
}: {
  title: string;
  /** The envelope whose freshness governs the tile. Its status badge is shown beside the heading. */
  envelope?: LiveEnvelope<unknown>;
  href: string;
  hrefLabel: string;
  children: React.ReactNode;
}) {
  return (
    <section className="scientific-card p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-lg font-bold text-fg">{title}</h2>
        {envelope && <LiveStatusBadge status={envelope.status} />}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">{children}</div>
      <p className="mt-4 text-sm">
        <Link href={href} className="text-nasa underline-offset-4 hover:underline">{hrefLabel} →</Link>
      </p>
    </section>
  );
}

export function DashboardProvenance({ envelopes }: { envelopes: LiveEnvelope<unknown>[] }) {
  return (
    <section aria-labelledby="provenance-heading" className="space-y-3">
      <h2 id="provenance-heading" className="font-display text-xl font-bold">Provenance</h2>
      {envelopes.map((envelope) => (
        <EnvelopeDetails key={envelope.productKey} envelope={envelope} title={`Provenance — ${envelope.productKey}`} />
      ))}
    </section>
  );
}

/** The standing statement about location, shown on every dashboard surface. */
export function LocationNote() {
  return (
    <p className="rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-sm leading-relaxed text-muted">
      Nothing on this dashboard knows where you are. Every value here is the same for every reader on
      Earth. The one page that does need a location —{" "}
      <Link href={liveDashboardPath("tonight")} className="underline decoration-white/30 underline-offset-2 hover:text-fg">Tonight</Link>{" "}
      — takes it from a form and computes with it in your own browser. Your browser is never asked for
      your position, nothing is remembered between visits, and no coordinate is ever sent to
      AsteriaStar or placed in one of its URLs. If you choose to ask for a cloud forecast, your
      browser requests it from the Norwegian Meteorological Institute directly, with the coordinates
      rounded to about a kilometre — that is the only time anything you typed leaves your device, it
      goes to them and not to us, and the exact request is printed on the page.
    </p>
  );
}
