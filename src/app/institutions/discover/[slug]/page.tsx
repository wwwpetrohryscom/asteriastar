import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { InstCards, OrgChips } from "@/components/institutions/InstCards";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, institutionsDiscoveryPath } from "@/lib/routes";
import { INSTITUTION_DISCOVERIES, getInstitutionDiscovery } from "@/app/institutions/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return INSTITUTION_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/institutions/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getInstitutionDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: institutionsDiscoveryPath(slug) });
}

export default async function InstDiscoverPage({ params }: PageProps<"/institutions/discover/[slug]">) {
  const { slug } = await params;
  const d = getInstitutionDiscovery(slug);
  if (!d) notFound();
  const { records, reused, count } = engine.institutions.memberSet(d.typeSlugs);
  const url = institutionsDiscoveryPath(slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Institutions", url: ROUTES.institutions },
    { name: d.title, url },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="halo" eyebrow={<span>Institutions · {count}</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14 space-y-8">
        {records.length ? <InstCards records={records} /> : null}
        {reused.length ? (
          <section aria-labelledby="reused-heading">
            <h2 id="reused-heading" className="font-display text-lg font-semibold text-fg">In the knowledge graph</h2>
            <p className="mt-1 text-sm text-muted">These organizations are already first-class entities in the graph — explore each on its page.</p>
            <div className="mt-4"><OrgChips refs={reused} /></div>
          </section>
        ) : null}
      </Container>
    </>
  );
}
