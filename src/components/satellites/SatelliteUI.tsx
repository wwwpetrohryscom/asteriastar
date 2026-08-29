import Link from "next/link";
import { DataUnavailable, StaleNotice } from "@/components/space-weather/LiveStatus";
import { FreshnessWatch } from "@/components/space-weather/FreshnessWatch";
import { getLiveProduct } from "@/platform/live-providers/registry";
import type { LiveEnvelope } from "@/platform/live-providers/envelope";
import { satelliteLivePath, ROUTES, type SatelliteLiveSlug } from "@/lib/routes";

/**
 * Shared presentation for the live satellite pages.
 *
 * The section's governing sentence, repeated wherever it applies: one satellite is served live, and
 * that is an outcome of checking what is actually available rather than a stage on the way to more.
 */

export const SATELLITE_LIVE_PAGES: { slug: SatelliteLiveSlug; title: string; blurb: string }[] = [
  { slug: "live", title: "Live status", blurb: "What orbital data is connected, what is not, and why." },
  { slug: "iss", title: "The ISS", blurb: "Where the station is right now, from NASA's own trajectory file." },
  { slug: "passes", title: "Passes", blurb: "When it crosses your sky — computed in your browser, from coordinates you type." },
  { slug: "bright", title: "Bright satellites", blurb: "What is actually visible to the naked eye, and what makes it so." },
  { slug: "constellations/live", title: "Constellations", blurb: "The large satellite constellations, and the state of live data for them." },
];

export function SatelliteNav({ current }: { current?: SatelliteLiveSlug }) {
  return (
    <nav aria-label="Live satellite sections" className="flex flex-wrap gap-2">
      <Link href={ROUTES.satellites} className="rounded-full border border-white/12 px-3 py-1.5 text-sm text-muted transition hover:border-white/30 hover:text-fg">
        Satellite encyclopedia
      </Link>
      {SATELLITE_LIVE_PAGES.map((p) => (
        <Link
          key={p.slug}
          href={satelliteLivePath(p.slug)}
          aria-current={current === p.slug ? "page" : undefined}
          className={`rounded-full border px-3 py-1.5 text-sm transition ${current === p.slug ? "border-nasa/50 bg-nasa/10 text-fg" : "border-white/12 text-muted hover:border-white/30 hover:text-fg"}`}
        >
          {p.title}
        </Link>
      ))}
    </nav>
  );
}

/** The panel shell, matching the other live sections: heading, freshness, stale banner, no-data path. */
export function SatellitePanel({
  envelope,
  title,
  what,
  id,
  children,
}: {
  envelope: LiveEnvelope<unknown>;
  title: string;
  what: string;
  id: string;
  children: React.ReactNode;
}) {
  const product = getLiveProduct(envelope.productKey);
  const reference = product?.freshness.basis === "fetch" ? envelope.fetchedAt : (envelope.generatedAt ?? envelope.fetchedAt);
  const hasData = envelope.data !== undefined;
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

/** One measured quantity about the station. */
export function SatelliteStat({ value, unit, label, sub }: { value: string; unit?: string; label: string; sub?: string }) {
  return (
    <li className="scientific-card p-5">
      <p className="font-display text-3xl font-bold text-fg">
        {value}
        {unit && <span className="ml-1.5 text-base font-medium text-muted">{unit}</span>}
      </p>
      <p className="mt-1 text-sm font-medium text-muted">{label}</p>
      {sub && <p className="mt-1 text-xs text-faint">{sub}</p>}
    </li>
  );
}

/**
 * The privacy statement, shown wherever a location could be entered.
 *
 * It describes the architecture rather than making a promise, because the two are different kinds
 * of assurance and only one of them can be checked by reading the page's network traffic.
 */
export function LocationPrivacyNote() {
  return (
    <section aria-labelledby="privacy-heading" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <h2 id="privacy-heading" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Where your location goes</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Nowhere. The pass calculation runs in your browser on orbital data the page already loaded, so the coordinates you type
        are never transmitted — not to AsteriaStar, not to NASA, and not into the address bar. You can verify that by watching
        your browser&apos;s network tab while you use it: there is no request to make.
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Nothing asks the browser for your position, nothing infers it from your network address, and nothing is remembered
        between visits — no cookie, no stored value, no analytics event. Close the tab and there is nothing left of it.
      </p>
    </section>
  );
}

/**
 * The standing explanation of why exactly one satellite is live here. It appears on every page in
 * the section, because a reader arriving at any of them deserves the answer immediately.
 */
export function CoverageNote() {
  return (
    <p className="text-xs leading-relaxed text-faint">
      One satellite is tracked live on this platform, and it is the International Space Station — because NASA publishes its
      operational trajectory openly and documents it. General catalogues of orbital elements for other satellites are either
      behind credentials whose terms do not permit this use, or served by hosts that refuse automated access. AsteriaStar does
      not scrape satellite-tracking sites, so the rest of the sky is honestly absent rather than approximately present.
    </p>
  );
}
