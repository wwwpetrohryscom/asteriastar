import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataUnavailable, StaleNotice, utcStamp } from "@/components/space-weather/LiveStatus";
import { FreshnessWatch } from "@/components/space-weather/FreshnessWatch";
import { getLiveProduct } from "@/platform/live-providers/registry";
import type { LiveEnvelope } from "@/platform/live-providers/envelope";
import { formatDiameter, type ApproachDistance, type CatalogueMatch, type ObjectSize, type ResolvedCloseApproach, type SentryObject } from "@/platform/neo/model";
import { palermoMeaning, torinoMeaning, torinoIsElevated } from "@/platform/neo/service";
import { NEO_SLUGS, neoPath, ROUTES, type NeoSlug } from "@/lib/routes";

/**
 * Presentation for near-Earth object data.
 *
 * The wording rules are as important as the markup. A close approach is described by its distance,
 * never by an adjective: "10.9 lunar distances" says everything, and "a near miss" says something
 * the data does not. Nothing is called dangerous unless a published scale says so, and the scales'
 * own definitions are quoted rather than paraphrased into drama.
 */

export const NEO_PAGES: { slug: NeoSlug; title: string; blurb: string }[] = [
  { slug: "close-approaches", title: "Close approaches", blurb: "Every object passing within 0.05 au over the next 60 days, with its uncertainty." },
  { slug: "objects", title: "Objects", blurb: "The objects behind the feeds, and whether AsteriaStar has catalogued them." },
  { slug: "risk", title: "Impact risk", blurb: "JPL's Sentry table: what it monitors, and what its numbers actually mean." },
  { slug: "recently-discovered", title: "Recently discovered", blurb: "New entries in the small-body database, and the MPC's unconfirmed candidates." },
  { slug: "planetary-defense", title: "Planetary defence", blurb: "How objects are found, tracked and — in one demonstrated case — deflected." },
];

export function NeoNav({ current }: { current?: NeoSlug }) {
  return (
    <nav aria-label="Near-Earth object sections" className="flex flex-wrap gap-2">
      <Link
        href={ROUTES.neo}
        aria-current={current === undefined ? "page" : undefined}
        className={`rounded-full border px-3 py-1.5 text-sm transition ${current === undefined ? "border-nasa/50 bg-nasa/10 text-fg" : "border-white/12 text-muted hover:border-white/30 hover:text-fg"}`}
      >
        Overview
      </Link>
      {NEO_PAGES.map((p) => (
        <Link
          key={p.slug}
          href={neoPath(p.slug)}
          aria-current={current === p.slug ? "page" : undefined}
          className={`rounded-full border px-3 py-1.5 text-sm transition ${current === p.slug ? "border-nasa/50 bg-nasa/10 text-fg" : "border-white/12 text-muted hover:border-white/30 hover:text-fg"}`}
        >
          {p.title}
        </Link>
      ))}
    </nav>
  );
}

/** The standing note about tone and sourcing for the section. */
export function NeoHonestyNote() {
  return (
    <p className="text-xs leading-relaxed text-faint">
      Every figure here is JPL&apos;s or the Minor Planet Centre&apos;s. AsteriaStar computes no impact probability and applies no
      danger rating of its own: where a hazard is named, it is on a scale the issuing agency defined, quoted as they define it. A
      close approach is described by its distance and its uncertainty, because that is what the data says. Objects pass within a
      few lunar distances routinely, and the word for that is &ldquo;routine&rdquo;.
    </p>
  );
}

/** A distance in the three units, with the astronomical one leading. */
export function Distance({ d, compact = false }: { d: ApproachDistance; compact?: boolean }) {
  const ld = d.lunarDistances;
  return (
    <span className="whitespace-nowrap">
      <span className="font-medium text-fg">{ld < 10 ? ld.toFixed(2) : ld.toFixed(1)} LD</span>
      {!compact && (
        <span className="ml-1.5 text-xs text-faint">
          {(d.km / 1e6).toFixed(3)} million km · {d.au.toFixed(5)} au
        </span>
      )}
    </span>
  );
}

/** A size, stated as measured or as an explicit range under a stated assumption. */
export function Size({ size }: { size?: ObjectSize }) {
  if (!size) return <span className="text-faint">not published</span>;
  if (size.kind === "measured") {
    return (
      <span className="whitespace-nowrap">
        <span className="font-medium text-fg">{formatDiameter(size.km)}</span>
        <span className="ml-1.5 text-xs text-faint">measured</span>
      </span>
    );
  }
  if (size.kind === "provider-estimate") {
    return (
      <span className="whitespace-nowrap">
        <span className="font-medium text-fg">{formatDiameter(size.km)}</span>
        <span className="ml-1.5 text-xs text-faint">JPL figure, albedo {size.assumedAlbedo} unless measured</span>
      </span>
    );
  }
  return (
    <span className="whitespace-nowrap">
      <span className="font-medium text-fg">
        {formatDiameter(size.minKm)}–{formatDiameter(size.maxKm)}
      </span>
      <span className="ml-1.5 text-xs text-faint">estimated from H {size.absoluteMagnitude.toFixed(1)}</span>
    </span>
  );
}

/**
 * Whether AsteriaStar has this object catalogued. The un-catalogued case is stated plainly rather
 * than left blank: a live record about a real object that this encyclopedia has never written about
 * is the ordinary case, and pretending otherwise by minting an entity would be the failure.
 */
export function CatalogueLink({ match }: { match: CatalogueMatch }) {
  if (match.notYetCatalogued || !match.entityPath) {
    return <span className="text-xs text-faint">Not yet catalogued in AsteriaStar</span>;
  }
  return (
    <Link href={match.entityPath} className="text-xs text-nasa underline-offset-4 hover:underline">
      {match.entityName} →
    </Link>
  );
}

/**
 * One headline figure — or an honest gap where the provider did not answer.
 *
 * `value === undefined` means the feed could not be read. Rendering a zero there would turn a JPL
 * outage into a confident statement about how many objects are being monitored, which on this
 * subject is a falsely reassuring one. So the card says so, and the surrounding prose is written to
 * cope with the figure being missing rather than assuming it never is.
 */
export function NeoStat({ value, label, sub, unavailableNote }: { value?: number | string; label: string; sub: string; unavailableNote?: string }) {
  const missing = value === undefined;
  return (
    <li className="scientific-card p-5">
      {missing ? (
        <>
          <p className="font-display text-xl font-bold text-nasa">Unavailable</p>
          <p className="mt-1 text-sm font-medium text-muted">{label}</p>
          <p className="mt-1 text-xs text-faint">{unavailableNote ?? "The provider could not be reached; no figure is shown and none is assumed."}</p>
        </>
      ) : (
        <>
          <p className="font-display text-3xl font-bold text-fg">{typeof value === "number" ? value.toLocaleString("en-GB") : value}</p>
          <p className="mt-1 text-sm font-medium text-muted">{label}</p>
          <p className="mt-1 text-xs text-faint">{sub}</p>
        </>
      )}
    </li>
  );
}

/** The panel shell: heading, live freshness, stale banner, and the no-data path. */
export function NeoPanel({
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

/** One close approach, as a table row. */
export function ApproachRow({ a }: { a: ResolvedCloseApproach }) {
  return (
    <tr>
      <td className="px-3 py-2">
        <span className="font-medium text-fg">{a.designation}</span>
        <span className="block"><CatalogueLink match={a.catalogue} /></span>
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-muted">
        {a.approachTdb.replace("T", " ")} <span className="text-faint">TDB</span>
        {a.timeUncertainty && <span className="block text-xs text-faint">±{a.timeUncertainty} (3σ)</span>}
      </td>
      <td className="px-3 py-2">
        <Distance d={a.distance} compact />
        {a.distanceMin && a.distanceMax && (
          <span className="block text-xs text-faint">
            3σ range {a.distanceMin.lunarDistances.toFixed(2)}–{a.distanceMax.lunarDistances.toFixed(2)} LD
          </span>
        )}
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-muted">{a.relativeVelocityKmS?.toFixed(1) ?? "—"} km/s</td>
      <td className="px-3 py-2"><Size size={a.size} /></td>
      <td className="px-3 py-2">
        {a.sentry ? (
          <Link href={neoPath("risk")} className="text-xs text-nasa underline-offset-4 hover:underline">On the Sentry table →</Link>
        ) : (
          <span className="text-xs text-faint">Not on the Sentry table</span>
        )}
      </td>
    </tr>
  );
}

export function ApproachTable({ approaches, caption }: { approaches: ResolvedCloseApproach[]; caption: string }) {
  if (approaches.length === 0) {
    return (
      <p className="rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-muted">
        No object passes within this window. The feed was read successfully and returned no approaches — that is an answer, not a
        gap.
      </p>
    );
  }
  return (
    <div className="overflow-x-auto rounded-lg border border-white/10">
      <table className="w-full min-w-[760px] text-left text-sm">
        <caption className="px-3 pt-3 text-left text-xs text-faint">{caption}</caption>
        <thead className="text-faint">
          <tr>
            <th scope="col" className="px-3 py-2 text-xs font-medium">Object</th>
            <th scope="col" className="px-3 py-2 text-xs font-medium">Closest approach (TDB)</th>
            <th scope="col" className="px-3 py-2 text-xs font-medium">Distance</th>
            <th scope="col" className="px-3 py-2 text-xs font-medium">Relative velocity</th>
            <th scope="col" className="px-3 py-2 text-xs font-medium">Estimated size</th>
            <th scope="col" className="px-3 py-2 text-xs font-medium">Risk monitoring</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {approaches.map((a) => <ApproachRow key={`${a.designation}-${a.approachTdb}`} a={a} />)}
        </tbody>
      </table>
    </div>
  );
}

/** One Sentry object. The scales speak for themselves; nothing is added. */
export function SentryRow({ s }: { s: SentryObject }) {
  const torino = torinoMeaning(s.torinoMaximum);
  return (
    <tr>
      <td className="px-3 py-2">
        <span className="font-medium text-fg">{s.fullName ?? s.designation}</span>
        {s.lastObservationUtc && <span className="block text-xs text-faint">last observed {s.lastObservationUtc} UTC</span>}
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-muted">
        {s.impactProbability === undefined
          ? "—"
          : s.impactProbability <= 0
            ? "0 — no impact remains possible in this solution"
            : `1 in ${Math.round(1 / s.impactProbability).toLocaleString("en-GB")}`}
        {s.potentialImpacts !== undefined && <span className="block text-xs text-faint">{s.potentialImpacts} potential impact{s.potentialImpacts === 1 ? "" : "s"}</span>}
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-muted">{s.yearRange ?? "—"}</td>
      <td className="px-3 py-2 whitespace-nowrap">
        <span className="font-medium text-fg">{s.palermoCumulative?.toFixed(2) ?? "—"}</span>
        {s.palermoCumulative !== undefined && s.palermoCumulative < -2 && <span className="ml-2 text-xs text-faint">below concern threshold</span>}
      </td>
      <td className="px-3 py-2 whitespace-nowrap">
        {/* Level 1 is "normal" on the scale's own wording, so it is not given an alarming tone. */}
        {s.torinoMaximum !== undefined ? (
          <StatusBadge tone={torinoIsElevated(s.torinoMaximum) ? "warning-red" : "verified-green"}>Torino {s.torinoMaximum}</StatusBadge>
        ) : (
          <span className="text-faint">—</span>
        )}
        {torino && s.torinoMaximum !== undefined && s.torinoMaximum > 0 && <span className="block text-xs text-faint">{torino}</span>}
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-muted">{s.diameterKm !== undefined ? formatDiameter(s.diameterKm) : "—"}</td>
    </tr>
  );
}

/** The Palermo explanation, shown once beside any Sentry table. */
export function PalermoNote({ topRating }: { topRating?: number }) {
  return (
    <div className="scientific-card p-5 text-sm leading-relaxed text-muted">
      <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Reading these numbers</h3>
      <p className="mt-2">{palermoMeaning(topRating)}</p>
      <p className="mt-2">
        An impact probability of &ldquo;1 in 300,000&rdquo; is not a forecast that something will happen; it is the width of the
        remaining uncertainty in an orbit. JPL states plainly that these probabilities &ldquo;can easily be inaccurate by a factor
        of a few, and occasionally by a factor of ten or more&rdquo;.
      </p>
      <p className="mt-2">
        Objects <em>leave</em> this table. That is what normally happens: more observations shrink the orbit&apos;s uncertainty
        until the possible impact is ruled out entirely. A disappearance from Sentry is the system working, not data going missing.
      </p>
    </div>
  );
}

export { utcStamp, NEO_SLUGS };
