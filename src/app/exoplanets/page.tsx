import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ExoplanetTable } from "@/components/exoplanets/ExoplanetTable";
import { engine } from "@/platform/data-engine";
import { EXO_DISCOVERIES } from "@/app/exoplanets/discovery";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, exoplanetPath, exoplanetDiscoveryPath } from "@/lib/routes";

const e = engine.exoplanets;
const DESCRIPTION = `An encyclopedia of ${e.planetCount} confirmed exoplanets across ${e.systemCount} multi-planet systems — host stars, detection methods, classes, and discovery missions — as first-class knowledge-graph entities, built on the NASA Exoplanet Archive.`;

export const metadata: Metadata = buildMetadata({ title: "Exoplanets Encyclopedia", description: DESCRIPTION, path: ROUTES.exoplanets });

export default function ExoplanetsHub() {
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Exoplanets", url: ROUTES.exoplanets },
  ];
  const famous = e.famous(12);
  const methods = e.methods();
  const classes = e.classes();

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Exoplanets Encyclopedia", description: DESCRIPTION, url: ROUTES.exoplanets })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        accent="ember"
        eyebrow={<span>Exoplanets Encyclopedia</span>}
        title="Worlds beyond the Sun"
        lead={`${e.planetCount} confirmed exoplanets — from scorching hot Jupiters to potentially habitable worlds — each connected to its host star, planetary system, detection method, and discovery mission. Built on the NASA Exoplanet Archive.`}
      >
        <p className="mt-6 text-sm text-faint">
          {e.planetCount} exoplanets · {e.systemCount} multi-planet systems · {e.hostCount} host stars · {e.habitable().length} habitable-zone candidates · data from the NASA Exoplanet Archive
        </p>
      </HeroSection>

      <Container className="mt-10 mb-14 space-y-12">
        <section aria-labelledby="famous-heading">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="famous-heading" className="font-display text-2xl font-bold">Famous exoplanets</h2>
            <Link href={exoplanetDiscoveryPath("all-exoplanets")} className="text-sm text-muted transition hover:text-fg">All exoplanets →</Link>
          </div>
          <div className="mt-4"><ExoplanetTable planets={famous} /></div>
        </section>

        <section aria-labelledby="discover-heading">
          <h2 id="discover-heading" className="font-display text-2xl font-bold">Discover</h2>
          <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {EXO_DISCOVERIES.map((d) => (
              <li key={d.slug}>
                <Link href={exoplanetDiscoveryPath(d.slug)} className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.04]">
                  <h3 className="font-display text-lg font-semibold text-fg group-hover:text-nebula">{d.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{d.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="methods-heading">
          <h2 id="methods-heading" className="font-display text-2xl font-bold">Detection methods</h2>
          <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {methods.map((m) => (
              <li key={m.slug}>
                <Link href={exoplanetPath(m.slug)} className="block rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-white/25">
                  <div className="flex items-baseline justify-between gap-2"><span className="font-medium text-fg">{m.name}</span><span className="text-xs text-faint">{m.count}</span></div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="classes-heading">
          <h2 id="classes-heading" className="font-display text-2xl font-bold">Browse by class</h2>
          <ul className="mt-5 flex flex-wrap gap-2.5">
            {classes.map((c) => (
              <li key={c.slug}>
                <Link href={exoplanetPath(c.slug)} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3.5 py-1.5 text-sm text-muted transition hover:border-white/25 hover:text-fg">{c.plural}<span className="text-xs text-faint">{c.count}</span></Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-sm text-muted">
          <h2 className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-1.5">
            Exoplanets are generated from the <a href="https://exoplanetarchive.ipac.caltech.edu" target="_blank" rel="noopener noreferrer" className="text-nebula underline-offset-4 hover:underline">NASA Exoplanet Archive</a> — the authoritative catalogue of confirmed planets. Every value is real archive data; nothing is inferred or synthesised, and habitability is never asserted as a certainty. Host stars already in the Star Encyclopedia are reused, not duplicated. See the{" "}
            <Link href="/transparency/source-quality" className="text-nebula underline-offset-4 hover:underline">source quality</Link> page.
          </p>
        </section>
      </Container>
    </>
  );
}
