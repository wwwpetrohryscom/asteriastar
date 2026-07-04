import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { MethodCards } from "@/components/methods/MethodCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, methodDiscoveryPath } from "@/lib/routes";
import { METHOD_DISCOVERIES, getMethodDiscovery, reusedForMethodDiscovery } from "@/app/methods/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return METHOD_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/methods/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getMethodDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: methodDiscoveryPath(slug) });
}

export default async function MethodDiscoverPage({ params }: PageProps<"/methods/discover/[slug]">) {
  const { slug } = await params;
  const d = getMethodDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const reused = reusedForMethodDiscovery(d);
  const url = methodDiscoveryPath(slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Methods", url: ROUTES.methods },
    { name: d.title, url },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="nebula" eyebrow={<span>Methods · {records.length + reused.length}</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14 space-y-8">
        {records.length ? <MethodCards records={records} /> : null}
        {reused.length ? (
          <section aria-labelledby="reused-heading">
            <h2 id="reused-heading" className="font-display text-lg font-semibold text-fg">Also in the knowledge graph</h2>
            <p className="mt-1 text-sm text-muted">These techniques are already first-class entities — explore each on its page.</p>
            <ul className="mt-4 flex flex-wrap gap-2">{reused.map((m) => <li key={m.id}><Link href={m.href ?? "#"} className="rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1 text-sm text-fg hover:border-white/25">{m.name}</Link></li>)}</ul>
          </section>
        ) : null}
      </Container>
    </>
  );
}
