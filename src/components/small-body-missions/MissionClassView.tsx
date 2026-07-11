import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SourceList } from "@/components/ui/SourceList";
import { JsonLd } from "@/components/seo/JsonLd";
import { MissionsCards } from "@/components/small-body-missions/MissionsCards";
import type { ResolvedMissionClass } from "@/platform/data-engine/small-body-missions-engine";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { absoluteUrl, ROUTES, smallBodyTypePath } from "@/lib/routes";

export function MissionClassView({ d }: { d: ResolvedMissionClass }) {
  const r = d.record;
  const url = smallBodyTypePath(r.slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Small-Body Missions", url: ROUTES.smallBodyMissions },
    { name: r.name, url },
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: r.name,
    description: r.description,
    url: absoluteUrl(url),
  };
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), jsonLd]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="halo" eyebrow={<span>Mission class · {d.members.length} missions</span>} title={r.name} lead={r.description} />
      <Container className="mt-8 mb-14 space-y-10">
        {r.definition ? (
          <section aria-labelledby="definition" className="scientific-card p-5">
            <h2 id="definition" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Definition</h2>
            <p className="mt-2 text-sm text-muted">{r.definition}</p>
          </section>
        ) : null}
        {d.members.length ? (
          <section aria-labelledby="members">
            <h2 id="members" className="font-display text-2xl font-bold">Missions of this class</h2>
            <div className="mt-4"><MissionsCards records={d.members} /></div>
          </section>
        ) : null}
        <SourceList keys={r.sources} title="Sources" />
      </Container>
    </>
  );
}
