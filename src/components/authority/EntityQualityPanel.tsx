import Link from "next/link";
import { QUALITY_DIMENSION_LABELS, type QualityDimension } from "@/platform";
import type { ResolvedEntity } from "@/platform/data-engine";
import {
  CoverageBadge,
  ReviewBadge,
  SourceIndicator,
  VersionLabel,
} from "@/components/authority/TrustBadges";

/**
 * "Scientific quality" — exposes an entity's structured completeness: review
 * status, source coverage, and a per-dimension breakdown. Driven by the
 * Scientific Data Engine's resolved entity (quality is derived from real data,
 * never invented); honest gaps stay visible.
 */
export function EntityQualityPanel({ resolved }: { resolved: ResolvedEntity }) {
  const q = resolved.quality;
  const dims = Object.keys(q.indicators) as QualityDimension[];
  const interpretive = resolved.domain !== "science";

  return (
    <section
      aria-labelledby="quality-heading"
      className="scientific-card p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 id="quality-heading" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">
          Scientific quality
        </h2>
        <span className="text-xs text-faint">{q.completenessPercent}% complete</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <ReviewBadge status={resolved.reviewStatus} />
        <SourceIndicator count={resolved.sources.length} />
        <VersionLabel version={resolved.version.graphVersion} />
      </div>

      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-white/70" style={{ width: `${q.completenessPercent}%` }} />
      </div>

      <dl className="mt-4 grid grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2">
        {dims.map((d) => (
          <div key={d} className="flex items-center justify-between gap-2 py-0.5 text-sm">
            <dt className="text-muted">{QUALITY_DIMENSION_LABELS[d]}</dt>
            <dd><CoverageBadge level={q.indicators[d]} /></dd>
          </div>
        ))}
      </dl>

      <p className="mt-4 border-t border-white/10 pt-3 text-xs leading-relaxed text-faint">
        {interpretive ? (
          <>Interpretive tradition — presented as cultural context, not scientific evidence.</>
        ) : (
          <>Scientific entity. See the{" "}
            <Link href="/transparency/evidence-framework" className="text-nasa underline-offset-4 hover:underline">evidence framework</Link>{" "}
            and{" "}
            <Link href="/authority" className="text-nasa underline-offset-4 hover:underline">authority dashboard</Link>.
          </>
        )}
      </p>
    </section>
  );
}
