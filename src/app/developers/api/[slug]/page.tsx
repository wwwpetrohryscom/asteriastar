import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { EndpointCard } from "@/components/data/EndpointCard";
import { ENDPOINT_GROUPS, getEndpointGroup } from "@/platform/open-data";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, apiGroupPath } from "@/lib/routes";

export const dynamic = "force-static";

export function generateStaticParams() {
  return ENDPOINT_GROUPS.map((slug) => ({ slug }));
}

const GROUP_TITLE: Record<string, string> = {
  entities: "Entities", relationships: "Relationships", search: "Search",
  traversal: "Traversal", datasets: "Datasets", images: "Images", "live-sky": "Live sky", meta: "Meta",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const title = GROUP_TITLE[slug] ?? slug;
  return buildMetadata({ title: `${title} API`, description: `Asteria Star Open Data API — the ${title.toLowerCase()} endpoints.`, path: apiGroupPath(slug) });
}

export default async function ApiGroupPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const endpoints = getEndpointGroup(slug);
  if (endpoints.length === 0) notFound();
  const title = GROUP_TITLE[slug] ?? slug;

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Developers", url: ROUTES.developers },
    { name: "API", url: ROUTES.developersApi },
    { name: title, url: apiGroupPath(slug) },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          collectionPageSchema({ name: `${title} API`, description: `The ${title.toLowerCase()} endpoints.`, url: apiGroupPath(slug) }),
        ]}
      />
      <Container className="pt-8">
        <Breadcrumbs crumbs={crumbs} />
      </Container>
      <HeroSection compact accent="halo" eyebrow={<span>Open Data API · v0</span>} title={`${title} API`} lead={`Read-only ${title.toLowerCase()} endpoints, backed by the Scientific Data Engine.`} />
      <Container className="mt-8 mb-12 space-y-4">
        {endpoints.map((e) => <EndpointCard key={e.id} endpoint={e} />)}
        <p className="pt-4">
          <Link href={ROUTES.developersApi} className="text-sm text-nebula underline-offset-4 hover:underline">← All endpoints</Link>
        </p>
      </Container>
    </>
  );
}
