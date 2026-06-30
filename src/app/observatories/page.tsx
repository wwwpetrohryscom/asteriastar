import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ObsCards } from "@/components/observatories/ObsCards";
import { engine } from "@/platform/data-engine";
import { OBS_DISCOVERIES } from "@/app/observatories/discovery";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, observatoryDiscoveryPath } from "@/lib/routes";

const COUNT = engine.observatories.count;
const FACILITIES = engine.observatories.byKind("observatory").length + engine.observatories.byKind("telescope").length + engine.observatories.byKind("space-telescope").length;
const DESCRIPTION = `The instruments and places humans use to observe the universe: ${FACILITIES} observatories, ground and space telescopes, plus instruments, surveys, and the observing bands they work in — ${COUNT} interconnected entities, from authoritative public sources.`;

export const metadata: Metadata = buildMetadata({ title: "Observatories & Telescopes", description: DESCRIPTION, path: ROUTES.observatories });

export default function ObservatoriesHub() {
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Observatories", url: ROUTES.observatories },
  ];
  const kinds = engine.observatories.kinds();
  const largest = engine.observatories.largestTelescopes(9);

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Observatories & Telescopes", description: DESCRIPTION, url: ROUTES.observatories })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection
        accent="halo"
        eyebrow={<span>Observatories &amp; Telescopes Encyclopedia</span>}
        title="How we observe the universe"
        lead={`From mountaintop optical giants to space telescopes and gravitational-wave detectors — ${FACILITIES} observatories and telescopes across ${COUNT} interconnected entities, spanning every band of the electromagnetic spectrum and beyond.`}
      >
        <p className="mt-6 text-sm text-faint">
          {kinds.map((k) => `${k.count} ${k.plural.toLowerCase()}`).join(" · ")}
        </p>
      </HeroSection>

      <Container className="mt-10 mb-14 space-y-12">
        <section aria-labelledby="largest">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="largest" className="font-display text-2xl font-bold">Largest telescopes</h2>
            <Link href={observatoryDiscoveryPath("largest-telescopes")} className="text-sm text-muted transition hover:text-fg">See all →</Link>
          </div>
          <div className="mt-4"><ObsCards records={largest} /></div>
        </section>

        <section aria-labelledby="discover">
          <h2 id="discover" className="font-display text-2xl font-bold">Discover</h2>
          <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {OBS_DISCOVERIES.map((d) => (
              <li key={d.slug}>
                <Link href={observatoryDiscoveryPath(d.slug)} className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.04]">
                  <h3 className="font-display text-lg font-semibold text-fg group-hover:text-nebula">{d.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{d.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-sm text-muted">
          <h2 className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-1.5">
            The observatories encyclopedia is curated from authoritative public sources — NASA, ESA, ESO, NOIRLab, NSF, NRAO, NAOJ, STScI, and observatory pages. Apertures, altitudes, first-light dates, operators, and instruments are well-established public facts; uncertain values are omitted, and future facilities are clearly marked as not yet operational. See the{" "}
            <Link href="/transparency/source-quality" className="text-nebula underline-offset-4 hover:underline">source quality</Link> page.
          </p>
        </section>
      </Container>
    </>
  );
}
