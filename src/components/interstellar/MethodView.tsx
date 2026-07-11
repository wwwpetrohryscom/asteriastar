import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SourceList } from "@/components/ui/SourceList";
import { JsonLd } from "@/components/seo/JsonLd";
import { StatusBadge } from "@/components/interstellar/StatusBadge";
import type { ResolvedMethod } from "@/platform/data-engine/interstellar-engine";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { absoluteUrl, ROUTES, interstellarObjectPath, interstellarDetectionPath } from "@/lib/routes";

export function MethodView({ d }: { d: ResolvedMethod }) {
  const r = d.record;
  const url = interstellarDetectionPath(r.slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Interstellar Objects", url: ROUTES.interstellarObjects },
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
      <HeroSection
        compact
        accent="aurora"
        eyebrow={<span>Detection method</span>}
        title={r.name}
        lead={r.description}
      />
      <Container className="mt-8 mb-14 space-y-10">
        {r.definition ? (
          <section aria-labelledby="inbrief" className="scientific-card p-5">
            <h2 id="inbrief" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">In brief</h2>
            <p className="mt-2 text-sm text-muted">{r.definition}</p>
          </section>
        ) : null}

        {d.usedBy.length ? (
          <section aria-labelledby="usedby">
            <h2 id="usedby" className="font-display text-2xl font-bold">Objects identified this way</h2>
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {d.usedBy.map((m) => (
                <li key={m.id} className="flex items-start justify-between gap-2 scientific-card p-4">
                  <Link href={interstellarObjectPath(m.slug)} className="font-medium text-fg hover:text-nasa">{m.name}</Link>
                  {m.status ? <StatusBadge status={m.status} /> : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <SourceList keys={r.sources} title="Sources" />
      </Container>
    </>
  );
}
