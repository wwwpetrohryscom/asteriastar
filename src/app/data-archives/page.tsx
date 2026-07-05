import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ArCards } from "@/components/data-archives/ArCards";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, dataArchivesDiscoveryPath } from "@/lib/routes";
import { AT_DISCOVERIES } from "@/app/data-archives/discovery";

const DESCRIPTION =
  "Where astronomy's data lives and how it is shared — the open-science infrastructure beneath every result. The great science archives (MAST, the ESA archives, IRSA, HEASARC, NED, and the Strasbourg CDS with SIMBAD and VizieR); the data standards astronomy is built on (FITS, VOTable, ASDF); the Virtual Observatory protocols that make the world's archives searchable as one (TAP, Cone Search, SIA, SSA); and the open-science practices — data pipelines and calibration, cross-matching, the ADS literature service, persistent identifiers, and FAIR reproducibility. Reuses the platform's operating organisations, the telescopes and surveys whose data the archives hold, the calibration method, the Harvard classification, and VOEvent; nothing is fabricated.";

export const metadata: Metadata = buildMetadata({ title: "Space Data Archives & Open Science", description: DESCRIPTION, path: ROUTES.dataArchives });

export default function DataArchivesHubPage() {
  const e = engine.dataArchives;
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Data Archives", url: ROUTES.dataArchives },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Space Data Archives & Open Science Infrastructure", description: DESCRIPTION, url: ROUTES.dataArchives })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="nebula" eyebrow={<span>Encyclopedia · {e.archiveCount} archives · {e.count} entries</span>} title="Space Data Archives &amp; Open Science" lead="Every discovery on this platform rests on data someone archived, in a format someone standardised, findable through a protocol someone agreed on. This is that hidden infrastructure — the archives that hold the observations of the world's telescopes, the formats that let the data be shared, and the practices that make it findable, citable, and reusable." />
      <Container className="mt-8 mb-14 space-y-12">
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore the infrastructure</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {AT_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <Link href={dataArchivesDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-nebula hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} entries</span>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="archives-heading">
          <h2 id="archives-heading" className="font-display text-2xl font-bold">The science archives</h2>
          <div className="mt-4"><ArCards records={e.archives()} /></div>
        </section>
        <section aria-labelledby="data-heading" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">Each archive, data standard, Virtual Observatory protocol, and open-science practice is a first-class knowledge-graph entity resolved through the Scientific Data Engine, reusing the operating organisations, the telescopes and surveys whose data the archives hold, the calibration method, the Harvard classification, and VOEvent already in the graph. Curated from NASA, ESA, and the archive operators themselves. See{" "}<Link href="/transparency/source-quality" className="text-nebula underline-offset-4 hover:underline">source quality</Link>.</p>
        </section>
      </Container>
    </>
  );
}
