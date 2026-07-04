import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { TDCards } from "@/components/time-domain/TDCards";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, timeDomainDiscoveryPath } from "@/lib/routes";
import { TD_DISCOVERIES } from "@/app/time-domain/discovery";

const DESCRIPTION =
  "A multi-wavelength and time-domain atlas of how the dynamic universe is observed — across radio, infrared, optical, ultraviolet, X-ray and gamma-ray light, and through gravitational waves, neutrinos, and cosmic rays. The transient classes (supernovae, gamma-ray bursts, kilonovae, fast radio bursts, tidal disruption events), the alert infrastructure (GCN, VOEvent, TNS, ATel, the Rubin stream), and the discovery-to-publication workflow. Reuses the platform's observing bands, multi-messenger methods, surveys, and observatories; nothing is fabricated.";

export const metadata: Metadata = buildMetadata({ title: "Multi-Wavelength & Time-Domain Astronomy", description: DESCRIPTION, path: ROUTES.timeDomain });

export default function TimeDomainHubPage() {
  const e = engine.timeDomain;
  const bands = e.spectrumBands();
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Time-Domain", url: ROUTES.timeDomain },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Multi-Wavelength & Time-Domain Astronomy", description: DESCRIPTION, url: ROUTES.timeDomain })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="plasma" eyebrow={<span>Atlas · {bands.length} bands &amp; messengers · {e.transientCount} transient classes</span>} title="Multi-Wavelength &amp; Time-Domain Astronomy" lead="The universe is not still. This atlas maps how we watch it change — across every wavelength of light and through gravitational waves, neutrinos, and cosmic rays — and the transients, alert networks, and workflows that turn a flicker in the sky into science within hours." />
      <Container className="mt-8 mb-14 space-y-12">
        <section aria-labelledby="spectrum-heading">
          <h2 id="spectrum-heading" className="font-display text-2xl font-bold">Across the spectrum &amp; messengers</h2>
          <p className="mt-1 text-sm text-muted">The multi-wavelength axis reuses the platform&apos;s observing bands — each links to its observatories.</p>
          <ul className="mt-4 flex flex-wrap gap-2">{bands.map((b) => <li key={b.id}><Link href={b.href ?? "#"} className="rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1 text-sm text-fg hover:border-white/25">{b.name}</Link></li>)}</ul>
        </section>
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore the dynamic sky</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TD_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <Link href={timeDomainDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-plasma hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{d.get().length} entries</span>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="transients-heading">
          <h2 id="transients-heading" className="font-display text-2xl font-bold">Transient classes</h2>
          <div className="mt-4"><TDCards records={e.transients()} /></div>
        </section>
        <section aria-labelledby="data-heading" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">Each transient class, alert system, and workflow stage is a first-class knowledge-graph entity resolved through the Scientific Data Engine, reusing the observing bands, multi-messenger methods, surveys, and observatories already in the graph. Curated from NASA and ESA. See{" "}<Link href="/transparency/source-quality" className="text-plasma underline-offset-4 hover:underline">source quality</Link>.</p>
        </section>
      </Container>
    </>
  );
}
