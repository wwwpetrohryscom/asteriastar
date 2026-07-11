import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SourceList } from "@/components/ui/SourceList";
import { JsonLd } from "@/components/seo/JsonLd";
import { StatusBadge } from "@/components/interstellar/StatusBadge";
import type { ResolvedTrajectoryClass } from "@/platform/data-engine/interstellar-engine";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { absoluteUrl, ROUTES, interstellarObjectPath, interstellarTrajectoryPath } from "@/lib/routes";

export function TrajectoryClassView({ d }: { d: ResolvedTrajectoryClass }) {
  const r = d.record;
  const url = interstellarTrajectoryPath(r.slug);
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
        eyebrow={<span>Trajectory class{r.eccentricityRangeLabel ? ` · ${r.eccentricityRangeLabel}` : ""}</span>}
        title={r.name}
        lead={r.description}
      />
      <Container className="mt-8 mb-14 space-y-10">
        {r.definition ? (
          <section aria-labelledby="definition" className="scientific-card p-5">
            <h2 id="definition" className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Definition</h2>
            <p className="mt-2 text-sm text-muted">{r.definition}</p>
          </section>
        ) : null}

        {d.relatedClasses.length ? (
          <section aria-labelledby="ladder">
            <h2 id="ladder" className="font-display text-2xl font-bold">The eccentricity ladder</h2>
            <p className="mt-1 text-sm text-faint">Orbits run from bound and elliptical, through the parabolic boundary, to the strongly hyperbolic trajectories of interstellar objects.</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {d.relatedClasses.map((c) => (
                <li key={c.id}><Link href={c.href ?? "#"} className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-sm text-fg hover:border-white/25">{c.name} →</Link></li>
              ))}
            </ul>
          </section>
        ) : null}

        {d.members.length ? (
          <section aria-labelledby="members">
            <h2 id="members" className="font-display text-2xl font-bold">Objects on this trajectory</h2>
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {d.members.map((m) => (
                <li key={m.id} className="flex items-start justify-between gap-2 scientific-card p-4">
                  <div>
                    <Link href={interstellarObjectPath(m.slug)} className="font-medium text-fg hover:text-nasa">{m.name}</Link>
                    {m.trajectoryLabel ? <div className="mt-0.5 text-xs text-faint">{m.trajectoryLabel}</div> : null}
                  </div>
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
