import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { InstCards } from "@/components/institutions/InstCards";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, institutionsDiscoveryPath } from "@/lib/routes";
import { INSTITUTION_DISCOVERIES, institutionDiscoveryCount } from "@/app/institutions/discovery";

const DESCRIPTION =
  "An encyclopedia of the world's space agencies, institutions, and laboratories — NASA, ESA, JAXA, ISRO, Roscosmos and the national agencies; the field centers of Goddard, Johnson, ESTEC, and Tsukuba; the laboratories that build robotic spacecraft (JPL, APL, SwRI); the commercial launch companies; and the observatory operators. Reuses the platform's existing organizations and wires them into their institutional structure; every location and role is source-backed and unknown values are left blank.";

export const metadata: Metadata = buildMetadata({ title: "Space Agencies, Institutions & Laboratories", description: DESCRIPTION, path: ROUTES.institutions });

export default function InstitutionsHubPage() {
  const e = engine.institutions;
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Institutions", url: ROUTES.institutions },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Space Agencies, Institutions & Laboratories", description: DESCRIPTION, url: ROUTES.institutions })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="halo" eyebrow={<span>Encyclopedia · {e.types().length} institution types · {e.orgCount} field centers &amp; labs</span>} title="Space Agencies, Institutions &amp; Laboratories" lead="Behind every mission is an institution — an agency that funds it, a field center that builds it, a laboratory that flies it, a company that launches it. This encyclopedia maps the organizations of the space enterprise and how they fit together." />
      <Container className="mt-8 mb-14 space-y-12">
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className="font-display text-2xl font-bold">Explore the institutions</h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {INSTITUTION_DISCOVERIES.map((d) => (
              <li key={d.slug} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <Link href={institutionsDiscoveryPath(d.slug)} className="font-display text-base font-semibold text-fg underline-offset-4 hover:text-halo hover:underline">{d.title}</Link>
                <p className="mt-1 flex-1 text-sm text-muted">{d.description}</p>
                <span className="mt-3 text-xs text-faint">{institutionDiscoveryCount(d)} organizations</span>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="types-heading">
          <h2 id="types-heading" className="font-display text-2xl font-bold">Institution types</h2>
          <div className="mt-4"><InstCards records={e.types()} /></div>
        </section>
        <section aria-labelledby="centers-heading">
          <h2 id="centers-heading" className="font-display text-2xl font-bold">Field centers &amp; laboratories</h2>
          <div className="mt-4"><InstCards records={e.orgs()} /></div>
        </section>
        <section aria-labelledby="data-heading" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h2 id="data-heading" className="font-display text-base font-semibold text-fg">Data &amp; provenance</h2>
          <p className="mt-2 text-sm text-muted">Each institution type and organization is a first-class knowledge-graph entity resolved through the Scientific Data Engine. The agencies, commercial companies, and observatory operators already in the graph are reused and enriched with their type and parent, never duplicated. Curated from NASA, ESA, and JAXA. Unknown values are left blank. See{" "}<Link href="/transparency/source-quality" className="text-halo underline-offset-4 hover:underline">source quality</Link>.</p>
        </section>
      </Container>
    </>
  );
}
