import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { EnvCards } from "@/components/space-environment/EnvCards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, spaceEnvironmentDiscoveryPath } from "@/lib/routes";
import { ENV_DISCOVERIES, getEnvDiscovery } from "@/app/space-environment/discovery";

export const dynamicParams = false;
export function generateStaticParams() {
  return ENV_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/space-environment/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getEnvDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: spaceEnvironmentDiscoveryPath(slug) });
}

export default async function EnvDiscoverPage({ params }: PageProps<"/space-environment/discover/[slug]">) {
  const { slug } = await params;
  const d = getEnvDiscovery(slug);
  if (!d) notFound();
  const records = d.get();
  const url = spaceEnvironmentDiscoveryPath(slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Space Environment", url: ROUTES.spaceEnvironment },
    { name: d.title, url },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="ember" eyebrow={<span>Space Environment · {records.length}</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14">
        <EnvCards records={records} />
      </Container>
    </>
  );
}
