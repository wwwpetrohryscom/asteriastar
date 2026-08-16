import Link from "next/link";
import {
  QUALITY_DIMENSION_LABELS,
  QUALITY_BAND_LABELS,
  QUALITY_BAND_MEANING,
  NOT_APPLICABLE_REASON,
  type QualityDimension,
} from "@/platform";
import type { ResolvedEntity } from "@/platform/data-engine";
import {
  CoverageBadge,
  ReviewBadge,
  SourceIndicator,
  VersionLabel,
} from "@/components/authority/TrustBadges";

/**
 * "Scientific quality" — an entity's structured completeness: review status,
 * source coverage, and a per-dimension breakdown, driven by the Scientific Data
 * Engine's resolved entity. Quality is derived from real data, never invented,
 * and honest gaps stay visible.
 *
 * This panel reports a categorical BAND rather than a percentage. See
 * src/platform/authority/quality.ts for why: averaging a handful of
 * three-valued dimensions into "13%" implied a precision the model never had,
 * and it counted the absence of things that cannot exist — no resolved
 * photograph of an exoplanet exists — as if they were closeable gaps.
 *
 * Dimensions that cannot apply to an entity are shown as "Not applicable" with
 * the reason on hover, and are excluded from the band entirely.
 */
export function EntityQualityPanel({ resolved }: { resolved: ResolvedEntity }) {
  const q = resolved.quality;
  const dims = Object.keys(q.indicators) as QualityDimension[];
  const interpretive = resolved.domain !== "science";

  // The bar shows the applicable fraction — a figure with a defensible meaning,
  // stated in words directly beneath it.
  const filled =
    q.applicableCount === 0
      ? 0
      : Math.round(((q.completeCount + q.partialCount * 0.5) / q.applicableCount) * 100);

  return (
    <section aria-labelledby="quality-heading" className="scientific-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <h2
          id="quality-heading"
          className="font-display text-sm font-semibold uppercase tracking-wider text-faint"
        >
          Scientific quality
        </h2>
        <span className="text-xs font-medium text-fg" title={QUALITY_BAND_MEANING[q.band]}>
          {QUALITY_BAND_LABELS[q.band]}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <ReviewBadge status={resolved.reviewStatus} />
        <SourceIndicator count={resolved.sources.length} />
        <VersionLabel version={resolved.version.graphVersion} />
      </div>

      <div
        className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10"
        role="img"
        aria-label={`${q.completeCount} of ${q.applicableCount} applicable coverage dimensions complete`}
      >
        <div className="h-full rounded-full bg-white/70" style={{ width: `${filled}%` }} />
      </div>
      <p className="mt-1.5 text-xs text-faint">
        {q.completeCount} of {q.applicableCount} applicable dimension
        {q.applicableCount === 1 ? "" : "s"} complete
        {q.partialCount > 0 ? `, ${q.partialCount} partial` : ""}
      </p>

      <dl className="mt-4 grid grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2">
        {dims.map((d) => {
          const level = q.indicators[d];
          const reason = level === "not-applicable" ? NOT_APPLICABLE_REASON[d] : undefined;
          return (
            <div key={d} className="flex items-center justify-between gap-2 py-0.5 text-sm">
              <dt className="min-w-0 break-words text-muted" title={reason || undefined}>
                {QUALITY_DIMENSION_LABELS[d]}
              </dt>
              <dd className="shrink-0">
                <CoverageBadge level={level} title={reason} />
              </dd>
            </div>
          );
        })}
      </dl>

      <p className="mt-4 border-t border-white/10 pt-3 text-xs leading-relaxed text-faint">
        {interpretive ? (
          <>Interpretive tradition — presented as cultural context, not scientific evidence.</>
        ) : (
          <>
            Scientific entity. Dimensions that cannot apply to this object are excluded rather
            than counted as gaps. See the{" "}
            <Link
              href="/transparency/evidence-framework"
              className="text-nasa underline-offset-4 hover:underline"
            >
              evidence framework
            </Link>{" "}
            and{" "}
            <Link href="/authority" className="text-nasa underline-offset-4 hover:underline">
              authority dashboard
            </Link>
            .
          </>
        )}
      </p>
    </section>
  );
}
