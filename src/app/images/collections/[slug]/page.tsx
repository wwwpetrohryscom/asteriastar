import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { JsonLd } from "@/components/seo/JsonLd";
import { ImageGallery } from "@/components/images/ImageUI";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, imageCollectionPath } from "@/lib/routes";

const im = engine.images;

export const dynamicParams = false;
export function generateStaticParams() {
  return im.collections.slugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/images/collections/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = im.collections.get(slug);
  if (!c) return {};
  return buildMetadata({ title: `${c.name} — Image Collection`, description: c.description, path: imageCollectionPath(slug) });
}

export default async function CollectionPage({ params }: PageProps<"/images/collections/[slug]">) {
  const { slug } = await params;
  const c = im.collections.get(slug);
  if (!c) notFound();
  const images = im.collections.images(slug);
  const crumbs: Crumb[] = [{ name: "Home", url: "/" }, { name: "Image Archive", url: ROUTES.images }, { name: c.name, url: imageCollectionPath(slug) }];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: c.name, description: c.description, url: imageCollectionPath(slug) })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="halo" eyebrow={<span>Image Collection</span>} title={c.name} lead={c.description}>
        <div className="mt-4"><Badge tone="accent">Image Archive</Badge></div>
      </HeroSection>
      <Container className="mt-8 mb-14">
        <p className="mb-4 text-sm text-faint">{images.length} {images.length === 1 ? "image" : "images"}, each with verified provenance.</p>
        <ImageGallery images={images} />
      </Container>
    </>
  );
}
