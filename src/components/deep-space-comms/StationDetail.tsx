import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SourceList } from "@/components/ui/SourceList";
import { JsonLd } from "@/components/seo/JsonLd";
import { EntityProvenancePanel } from "@/components/authority/EntityProvenancePanel";
import { FactRow, QualityPanel } from "@/components/deep-space-comms/NetworkDetail";
import { hrefForRecord } from "@/components/deep-space-comms/DSCommCards";
import type { ResolvedStation } from "@/platform/data-engine/deep-space-comms-engine";
import { RELATION_LABELS, INVERSE_RELATION_LABELS } from "@/knowledge-graph/schema";
import { entityGraphPath } from "@/knowledge-graph";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { absoluteUrl, ROUTES, dsnStationPath } from "@/lib/routes";
import { KIND_LABEL } from "@/knowledge-graph/data/deep-space-comms-catalog/types";

export function StationDetail({ d }: { d: ResolvedStation }) {
  const s = d.record;
  const url = dsnStationPath(s.slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Deep Space Network", url: ROUTES.deepSpaceNetwork },
    { name: s.name, url },
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: s.name,
    ...(s.altNames?.length ? { alternateName: s.altNames } : {}),
    description: s.description,
    url: absoluteUrl(url),
  };
  const science = d.connections.science;
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), jsonLd]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="aurora" eyebrow={<span>{KIND_LABEL[s.kind]}{s.countryLabel ? ` · ${s.countryLabel}` : ""}</span>} title={s.name} lead={s.description} />
      <Container className="mt-8 mb-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-10">
            {d.antennas.length ? (
              <section aria-labelledby="antennas">
                <h2 id="antennas" className="font-display text-2xl font-bold">Antennas</h2>
                <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {d.antennas.map((a) => (
                    <li key={a.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                      <Link href={hrefForRecord(a)} className="font-medium text-fg hover:text-aurora">{a.name}</Link>
                      {a.diameterLabel ? <div className="mt-0.5 text-xs text-faint">{a.diameterLabel}</div> : null}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {science.length ? (
              <section aria-labelledby="connections">
                <h2 id="connections" className="font-display text-2xl font-bold">Knowledge connections</h2>
                <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {science.slice(0, 24).map((cx) => (
                    <li key={cx.relation.id} className="flex items-baseline justify-between gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-sm">
                      <span className="text-faint">{cx.outgoing ? RELATION_LABELS[cx.relation.type] : INVERSE_RELATION_LABELS[cx.relation.type]}</span>
                      <Link href={entityGraphPath(cx.other)} className="text-right font-medium text-fg hover:text-aurora">{cx.other.name}</Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <SourceList keys={s.sources} title="Sources" />
          </div>

          <aside className="space-y-6">
            <section aria-labelledby="quick" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <h2 id="quick" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Quick facts</h2>
              <dl className="mt-3 divide-y divide-white/5 text-sm">
                {d.network ? <FactRow label="Network" value={d.network.name} href={d.network.href} /> : null}
                {d.operator ? <FactRow label="Operator" value={d.operator.name} href={d.operator.href} /> : (s.operatorLabel ? <FactRow label="Operator" value={s.operatorLabel} /> : null)}
                {s.locationLabel ? <FactRow label="Location" value={s.locationLabel} /> : null}
                {s.countryLabel ? <FactRow label="Country" value={s.countryLabel} /> : null}
                {s.diameterLabel ? <FactRow label="Antennas" value={s.diameterLabel} /> : null}
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
