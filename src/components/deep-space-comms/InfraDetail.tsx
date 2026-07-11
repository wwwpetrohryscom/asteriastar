import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SourceList } from "@/components/ui/SourceList";
import { JsonLd } from "@/components/seo/JsonLd";
import { EntityProvenancePanel } from "@/components/authority/EntityProvenancePanel";
import { FactRow, QualityPanel } from "@/components/deep-space-comms/NetworkDetail";
import { hrefForRecord } from "@/components/deep-space-comms/DSCommCards";
import type { ResolvedInfra } from "@/platform/data-engine/deep-space-comms-engine";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { absoluteUrl, ROUTES } from "@/lib/routes";
import { KIND_LABEL } from "@/knowledge-graph/data/deep-space-comms-catalog/types";
import { entryPathFor } from "@/knowledge-graph/data/deep-space-comms-catalog";

type Ref = { id: string; name: string; href?: string };

/** Adaptive detail for antennas, signal bands, navigation systems, and comm systems. */
export function InfraDetail({ d }: { d: ResolvedInfra }) {
  const r = d.record;
  const url = entryPathFor(r) ?? `/explore/entity/${r.id.slice(0, r.id.indexOf(":"))}/${r.slug}`;
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Deep Space Network", url: ROUTES.deepSpaceNetwork },
    { name: r.name, url },
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: r.name,
    ...(r.altNames?.length ? { alternateName: r.altNames } : {}),
    description: r.description,
    url: absoluteUrl(url),
  };
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), jsonLd]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="aurora" eyebrow={<span>{KIND_LABEL[r.kind]}</span>} title={r.name} lead={r.description} />
      <Container className="mt-8 mb-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0 space-y-10">
            {r.latencyNote ? (
              <section aria-labelledby="latency" className="scientific-card p-5">
                <h2 id="latency" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Signal light-time</h2>
                <p className="mt-2 text-sm text-muted">{r.latencyNote}</p>
              </section>
            ) : null}

            {d.usedBy.length ? (
              <section aria-labelledby="usedby">
                <h2 id="usedby" className="font-display text-2xl font-bold">Used by</h2>
                <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {d.usedBy.map((x) => (
                    <li key={x.id} className="scientific-card p-4">
                      <Link href={hrefForRecord(x)} className="font-medium text-fg hover:text-nasa">{x.name}</Link>
                      <div className="mt-0.5 text-xs text-faint">{KIND_LABEL[x.kind]}</div>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {d.related.length ? (
              <section aria-labelledby="related">
                <h2 id="related" className="font-display text-2xl font-bold">Related</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {d.related.map((x: Ref) => <li key={x.id}><Link href={x.href ?? "#"} className="rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1 text-sm text-fg hover:border-white/25">{x.name}</Link></li>)}
                </ul>
              </section>
            ) : null}

            <SourceList keys={r.sources} title="Sources" />
          </div>

          <aside className="space-y-6">
            <section aria-labelledby="quick" className="scientific-card p-5">
              <h2 id="quick" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Quick facts</h2>
              <dl className="mt-3 divide-y divide-white/5 text-sm">
                {r.role ? <FactRow label="Role" value={r.role} /> : null}
                {r.diameterLabel ? <FactRow label="Diameter" value={r.diameterLabel} /> : null}
                {r.frequencyLabel ? <FactRow label="Frequency" value={r.frequencyLabel} /> : null}
                {r.wavelengthLabel ? <FactRow label="Wavelength" value={r.wavelengthLabel} /> : null}
                {d.station ? <FactRow label="Location" value={d.station.name} href={d.station.href} /> : null}
                {d.bands.length ? <FactRow label="Bands" value={d.bands.map((b) => b.name).join(", ")} /> : null}
              </dl>
            </section>
            {d.quality && <EntityProvenancePanel entityId={d.quality.entityId} />}
            {d.quality && <QualityPanel quality={d.quality} reviewStatus={d.reviewStatus} />}
          </aside>
        </div>
      </Container>
    </>
  );
}
