import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { CosmoCardGrid } from "@/components/cosmology/CosmoCardGrid";
import { ConsensusLegend } from "@/components/cosmology/Consensus";
import { engine } from "@/platform/data-engine";
import { COSMO_DISCOVERIES } from "@/app/cosmology/discovery";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, cosmologyPath, cosmologyDiscoveryPath, timelinePath } from "@/lib/routes";

const c = engine.cosmology;
const DESCRIPTION = `The complete scientific model of the Universe: ${c.conceptCount} cosmological and physical concepts, ${c.modelCount} models, and ${c.objectCount} classes of astrophysical object — each explicitly classified by scientific consensus, from established science to speculative hypothesis.`;

export const metadata: Metadata = buildMetadata({ title: "Cosmology & Universe Encyclopedia", description: DESCRIPTION, path: ROUTES.cosmology });

export default function CosmologyHub() {
  const crumbs: Crumb[] = [{ name: "Home", url: "/" }, { name: "Cosmology & Universe", url: ROUTES.cosmology }];
  const featured = c.featured();
  const timeline = c.timeline();

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Cosmology & Universe Encyclopedia", description: DESCRIPTION, url: ROUTES.cosmology })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        accent="plasma"
        eyebrow={<span>Cosmology &amp; Universe</span>}
        title="The scientific model of the Universe"
        lead="How the Universe began, how it evolved, and how cosmologists measure it — from the Big Bang and cosmic inflation to dark matter, dark energy, and black holes. Every topic is labelled by its scientific consensus, and established science is never mixed with speculation."
      >
        <p className="mt-6 text-sm text-faint">
          {c.conceptCount} concepts · {c.modelCount} models · {c.objectCount} object classes · <Link href={timelinePath("universe-timeline")} className="text-nebula hover:underline">the Universe timeline →</Link>
        </p>
      </HeroSection>

      <Container className="mt-10 mb-14 space-y-12">
        <ConsensusLegend />

        <section aria-labelledby="featured-heading">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="featured-heading" className="font-display text-2xl font-bold">Featured topics</h2>
            <Link href={cosmologyDiscoveryPath("cosmology")} className="text-sm text-muted transition hover:text-fg">All concepts →</Link>
          </div>
          <div className="mt-5">
            <CosmoCardGrid cards={featured.map((t) => ({ slug: t.slug, name: t.name, kind: "Concept", consensus: t.consensus, href: cosmologyPath(t.slug) }))} />
          </div>
        </section>

        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore cosmology</h2>
          <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {COSMO_DISCOVERIES.map((d) => (
              <li key={d.slug}>
                <Link href={cosmologyDiscoveryPath(d.slug)} className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.04]">
                  <h3 className="font-display text-lg font-semibold text-fg group-hover:text-nebula">{d.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{d.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="timeline-heading">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="timeline-heading" className="font-display text-2xl font-bold">The Universe timeline</h2>
            <Link href={timelinePath("universe-timeline")} className="text-sm text-muted transition hover:text-fg">Full timeline →</Link>
          </div>
          <ol className="mt-5 space-y-2">
            {timeline.map((p) => (
              <li key={p.order}>
                {p.slug ? (
                  <Link href={cosmologyPath(p.slug)} className="flex items-baseline gap-4 rounded-lg border border-white/5 bg-white/[0.02] px-4 py-2.5 transition hover:border-white/20 hover:bg-white/[0.04]">
                    <span className="w-44 shrink-0 font-mono text-sm text-faint">{p.time}</span>
                    <span className="font-medium text-fg">{p.title}</span>
                  </Link>
                ) : (
                  <div className="flex items-baseline gap-4 rounded-lg border border-white/5 bg-white/[0.02] px-4 py-2.5">
                    <span className="w-44 shrink-0 font-mono text-sm text-faint">{p.time}</span>
                    <span className="font-medium text-fg">{p.title}</span>
                  </div>
                )}
              </li>
            ))}
          </ol>
          <p className="mt-3 text-xs text-faint">Times are current best estimates and carry real scientific uncertainty; far-future entries are model-dependent projections, not certainties.</p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-sm text-muted">
          <h2 className="font-display text-base font-semibold text-fg">Sources &amp; provenance</h2>
          <p className="mt-1.5">
            Cosmological parameters, measurements, and consensus classifications are drawn from authoritative sources — the Planck Collaboration, NASA, ESA, ESO, the LIGO and Event Horizon Telescope collaborations, DESI, SDSS, and peer-reviewed literature. Nothing is fabricated; theories, discoveries, scientists, and observatories already in the graph are reused, not duplicated. See the{" "}
            <Link href="/transparency/source-quality" className="text-nebula underline-offset-4 hover:underline">source quality</Link> page.
          </p>
        </section>
      </Container>
    </>
  );
}
