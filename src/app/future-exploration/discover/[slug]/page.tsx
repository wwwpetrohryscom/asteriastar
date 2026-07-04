import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ConceptCards } from "@/components/future-exploration/ConceptCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, futureExplorationDiscoveryPath } from "@/lib/routes";
import { FUTURE_DISCOVERIES, getFutureDiscovery, reusedForDiscovery } from "@/app/future-exploration/discovery";
import Link from "next/link";

export const dynamicParams = false;
export function generateStaticParams() {
  return FUTURE_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/future-exploration/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getFutureDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: futureExplorationDiscoveryPath(slug) });
}

export default async function FutureDiscoverPage({ params }: PageProps<"/future-exploration/discover/[slug]">) {
  const { slug } = await params;
  const d = getFutureDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const reused = reusedForDiscovery(d);
  const url = futureExplorationDiscoveryPath(slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Future Exploration", url: ROUTES.futureExploration },
    { name: d.title, url },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="ember" eyebrow={<span>Future Exploration · {records.length + reused.length}</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14 space-y-8">
        {records.length ? <ConceptCards records={records} /> : null}
        {reused.length ? (
          <section aria-labelledby="reused-heading">
            <h2 id="reused-heading" className="font-display text-lg font-semibold text-fg">Already in development or en route</h2>
            <p className="mt-1 text-sm text-muted">These missions are already first-class entities in the graph — explore each on its page.</p>
            <ul className="mt-4 flex flex-wrap gap-2">{reused.map((m) => <li key={m.id}><Link href={m.href ?? "#"} className="rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1 text-sm text-fg hover:border-white/25">{m.name}</Link></li>)}</ul>
          </section>
        ) : null}
      </Container>
    </>
  );
}
