import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SourceList } from "@/components/ui/SourceList";
import { JsonLd } from "@/components/seo/JsonLd";
import type { ResolvedSample } from "@/platform/data-engine/small-body-missions-engine";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { absoluteUrl, ROUTES, smallBodySamplePath, smallBodyMissionPath } from "@/lib/routes";

export function SampleView({ d }: { d: ResolvedSample }) {
  const s = d.record;
  const url = smallBodySamplePath(s.slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Small-Body Missions", url: ROUTES.smallBodyMissions },
    { name: s.name, url },
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Thing",
    name: s.name,
    description: s.description,
    url: absoluteUrl(url),
  };
  const rows: { label: string; value?: string; href?: string }[] = [
    { label: "Source body", value: d.body?.name, href: d.body?.href },
    { label: "Returned by", value: d.collectedBy?.name, href: d.collectedBy ? smallBodyMissionPath(d.collectedBy.slug) : undefined },
    { label: "Returned mass", value: s.massLabel },
    { label: "Analysis", value: s.analysisLabel },
  ].filter((r) => r.value);
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), jsonLd]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="halo" eyebrow={<span>Returned sample</span>} title={s.name} lead={s.description} />
      <Container className="mt-8 mb-14 space-y-8">
        <section aria-labelledby="facts" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h2 id="facts" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Sample facts</h2>
          <dl className="mt-3 divide-y divide-white/5">
            {rows.map((r) => (
              <div key={r.label} className="flex justify-between gap-3 py-2 text-sm">
                <dt className="text-faint">{r.label}</dt>
                <dd className="text-right font-medium text-fg">{r.href ? <Link href={r.href} className="hover:text-halo">{r.value}</Link> : r.value}</dd>
              </div>
            ))}
          </dl>
        </section>
        <SourceList keys={s.sources} title="Sources" />
      </Container>
    </>
  );
}
