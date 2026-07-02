import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { computeAuthoritySnapshot, COVERAGE_LABELS, type CoverageLevel } from "@/platform";
import { getAllSources, AUTHORITY_TYPE_LABELS } from "@/lib/sources";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES } from "@/lib/routes";

const DESCRIPTION =
  "The Asteria Star authority dashboard — a transparent, fully-derived view of scientific coverage: reviews, sources, relationships, datasets, and data-quality indicators. No fabricated statistics.";

export const metadata: Metadata = buildMetadata({ title: "Authority Dashboard", description: DESCRIPTION, path: ROUTES.authority });

export default function AuthorityPage() {
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Authority", url: ROUTES.authority },
  ];
  const s = computeAuthoritySnapshot();
  const sources = getAllSources();
  const pct = (n: number) => `${Math.round((n / s.entities) * 100)}%`;

  const headline = [
    { label: "Entities", value: s.entities },
    { label: "Relationships", value: s.relationships },
    { label: "Datasets", value: s.datasets },
    { label: "Sources", value: s.sourcesTotal },
    { label: "Primary sources", value: s.primarySources },
    { label: "Secondary sources", value: s.secondarySources },
    { label: "Reviewed", value: s.reviewed },
    { label: "Awaiting review", value: s.awaitingReview },
    { label: "Provenance records", value: s.provenanceRecords },
    { label: "Citations", value: s.citations },
  ];

  const coverage = [
    { label: "Has sources", value: s.coverage.withSources },
    { label: "Has provenance", value: s.withProvenance },
    { label: "Has timeline", value: s.coverage.withTimeline },
    { label: "Has images", value: s.coverage.withImages },
    { label: "Localized", value: s.coverage.localized },
    { label: "Reviewed", value: s.coverage.reviewed },
  ];

  const QUALITY_ACCENT: Record<CoverageLevel, string> = { complete: "bg-halo/70", partial: "bg-comet/70", none: "bg-stone/50" };

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Authority Dashboard", description: DESCRIPTION, url: ROUTES.authority })]} />
      <Container className="pt-8">
        <Breadcrumbs crumbs={crumbs} />
      </Container>
      <HeroSection
        accent="halo"
        eyebrow={<span>Scientific Authority</span>}
        title="Authority dashboard"
        lead="Trust is a product feature. Every number here is computed from real registry data — there are no fabricated statistics and no fake review history. Honest gaps stay visible."
      >
        <p className="mt-6 text-sm text-faint">
          graph v{s.version.graphVersion} · schema v{s.version.schemaVersion} · {s.sourcesConnected} of {s.sourcesTotal} sources connected to entities
        </p>
      </HeroSection>

      <Container className="mt-10 mb-14 space-y-12">
        <section aria-labelledby="headline-heading">
          <h2 id="headline-heading" className="sr-only">Headline numbers</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {headline.map((m) => (
              <div key={m.label} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <div className="font-display text-3xl font-bold text-fg">{m.value.toLocaleString()}</div>
                <div className="mt-1 text-xs text-faint">{m.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="quality-heading">
          <h2 id="quality-heading" className="font-display text-2xl font-bold">Quality distribution</h2>
          <p className="mt-2 max-w-2xl text-muted">Overall completeness across all {s.entities} entities, derived from structured indicators (sources, relationships, review, images, timeline, localization).</p>
          <div className="mt-5 space-y-3">
            {(["complete", "partial", "none"] as CoverageLevel[]).map((level) => {
              const count = s.qualityDistribution[level];
              const width = Math.round((count / s.entities) * 100);
              return (
                <div key={level} className="flex items-center gap-3">
                  <span className="w-20 shrink-0 text-sm text-muted">{COVERAGE_LABELS[level]}</span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-white/10">
                    <div className={`h-full rounded-full ${QUALITY_ACCENT[level]}`} style={{ width: `${width}%` }} />
                  </div>
                  <span className="w-24 shrink-0 text-right text-sm text-faint">{count.toLocaleString()} ({width}%)</span>
                </div>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="coverage-heading">
          <h2 id="coverage-heading" className="font-display text-2xl font-bold">Coverage</h2>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {coverage.map((c) => (
              <div key={c.label} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <div className="font-display text-2xl font-bold text-fg">{pct(c.value)}</div>
                <div className="mt-1 text-xs text-faint">{c.label}</div>
                <div className="text-[0.65rem] text-faint">{c.value} of {s.entities}</div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-faint">
            Review and provenance coverage now reflect the first real batch of scientific authority records — {s.reviewed} flagship
            entities reviewed by the internal Asteria Scientific Review Process, backed by {s.provenanceRecords} sourced provenance
            records and {s.citations} citations. Coverage across the full graph is honestly still low and stays visible. See the{" "}
            <Link href={ROUTES.transparency} className="text-nebula underline-offset-4 hover:underline">transparency pages</Link>.
          </p>
        </section>

        <section aria-labelledby="sources-heading">
          <h2 id="sources-heading" className="font-display text-2xl font-bold">Connected sources</h2>
          <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/[0.03] text-faint">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Source</th>
                  <th className="hidden px-4 py-2.5 font-medium sm:table-cell">Country</th>
                  <th className="px-4 py-2.5 font-medium">Authority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {sources.map((src) => (
                  <tr key={src.key} className="transition hover:bg-white/[0.02]">
                    <td className="px-4 py-2.5">
                      <a href={src.url} target="_blank" rel="noopener noreferrer" className="font-medium text-fg transition hover:text-nebula">{src.name}</a>
                      <span className="block text-xs text-faint">{src.organization}</span>
                    </td>
                    <td className="hidden px-4 py-2.5 text-muted sm:table-cell">{src.country}</td>
                    <td className="px-4 py-2.5 text-muted">{AUTHORITY_TYPE_LABELS[src.authorityType]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </Container>
    </>
  );
}
