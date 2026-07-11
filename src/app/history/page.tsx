import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { HistoryCardGrid } from "@/components/history/HistoryCardGrid";
import { engine } from "@/platform/data-engine";
import { HISTORY_DISCOVERIES } from "@/app/history/discovery";
import { formatLifespan, formatHistYear } from "@/knowledge-graph/data/history-catalog/types";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, historyPath, historyDiscoveryPath, timelinePath } from "@/lib/routes";

const h = engine.history;
const DESCRIPTION = `The history of humanity discovering the universe: ${h.astronomerCount} astronomers, ${h.discoveryCount} landmark discoveries, ${h.publicationCount} historic publications, and the theories, catalogues, and eras that connect them — all as first-class knowledge-graph entities.`;

export const metadata: Metadata = buildMetadata({ title: "History of Astronomy Encyclopedia", description: DESCRIPTION, path: ROUTES.history });

export default function HistoryHub() {
  const crumbs: Crumb[] = [{ name: "Home", url: "/" }, { name: "History of Astronomy", url: ROUTES.history }];
  const featured = h.featured();
  const eras = h.eras();
  const timeline = h.timeline();

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "History of Astronomy Encyclopedia", description: DESCRIPTION, url: ROUTES.history })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        accent="stone"
        eyebrow={<span>History of Astronomy</span>}
        title="How humanity discovered the universe"
        lead="From Babylonian sky-watchers and the Almagest to gravitational waves and the first image of a black hole — the people, discoveries, publications, and ideas that built our understanding of the cosmos."
      >
        <p className="mt-6 text-sm text-faint">
          {h.astronomerCount} astronomers · {h.discoveryCount} discoveries · {h.publicationCount} publications · {h.eraCount} eras · <Link href={timelinePath("history-of-astronomy")} className="text-nasa hover:underline">the full timeline →</Link>
        </p>
      </HeroSection>

      <Container className="mt-10 mb-14 space-y-12">
        <section aria-labelledby="eras-heading">
          <h2 id="eras-heading" className="font-display text-2xl font-bold">Eras &amp; traditions</h2>
          <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {eras.map((era) => (
              <li key={era.slug}>
                <Link href={historyPath(era.slug)} className="group flex h-full flex-col scientific-card p-5 transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.04]">
                  <span className="text-xs uppercase tracking-wide text-faint">{eraRange(era.startYear, era.endYear)}</span>
                  <h3 className="mt-1 font-display text-lg font-semibold text-fg group-hover:text-nasa">{era.name}</h3>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="featured-heading">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="featured-heading" className="font-display text-2xl font-bold">Featured astronomers</h2>
            <Link href={historyDiscoveryPath("astronomers-a-z")} className="text-sm text-muted transition hover:text-fg">Astronomers A–Z →</Link>
          </div>
          <div className="mt-5">
            <HistoryCardGrid cards={featured.map((a) => ({ slug: a.slug, name: a.name, kind: "Astronomer", meta: formatLifespan(a) ?? a.nationality, href: historyPath(a.slug) }))} />
          </div>
        </section>

        <section aria-labelledby="discover-heading">
          <h2 id="discover-heading" className="font-display text-2xl font-bold">Explore the history</h2>
          <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {HISTORY_DISCOVERIES.map((d) => (
              <li key={d.slug}>
                <Link href={historyDiscoveryPath(d.slug)} className="group flex h-full flex-col scientific-card p-5 transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.04]">
                  <h3 className="font-display text-lg font-semibold text-fg group-hover:text-nasa">{d.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{d.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="timeline-heading">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="timeline-heading" className="font-display text-2xl font-bold">Timeline</h2>
            <Link href={timelinePath("history-of-astronomy")} className="text-sm text-muted transition hover:text-fg">Full timeline →</Link>
          </div>
          <ol className="mt-5 space-y-2">
            {timeline.map((it) => (
              <li key={it.slug}>
                <Link href={historyPath(it.slug)} className="flex items-baseline gap-4 rounded-lg border border-white/5 bg-white/[0.02] px-4 py-2.5 transition hover:border-white/20 hover:bg-white/[0.04]">
                  <span className="w-24 shrink-0 font-mono text-sm text-faint">{formatHistYear(it.year, it.yearApprox)}</span>
                  <span className="font-medium text-fg">{it.label}</span>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <section className="scientific-card p-5 text-sm text-muted">
          <h2 className="font-display text-base font-semibold text-fg">Sources &amp; provenance</h2>
          <p className="mt-1.5">
            Every biography, date, discovery, publication, and award is drawn from authoritative reference sources — the IAU, NASA, ESA, ESO, NASA ADS, the Nobel Foundation, and Encyclopaedia Britannica. Nothing is fabricated; astronomers already in the knowledge graph are reused, not duplicated. See the{" "}
            <Link href="/transparency/source-quality" className="text-nasa underline-offset-4 hover:underline">source quality</Link> page.
          </p>
        </section>
      </Container>
    </>
  );
}

function eraRange(start?: number, end?: number): string {
  const s = formatHistYear(start); const e = end != null ? formatHistYear(end) : "present";
  return s ? `${s} – ${e}` : "";
}
