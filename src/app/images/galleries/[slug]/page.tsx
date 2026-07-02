import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { JsonLd } from "@/components/seo/JsonLd";
import { ImageGallery } from "@/components/images/ImageUI";
import { ACTIVE_GALLERIES, getGallery } from "@/app/images/galleries";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, imageGalleryPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return ACTIVE_GALLERIES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/images/galleries/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const g = getGallery(slug);
  if (!g) return {};
  return buildMetadata({ title: `${g.title} — Scientific Images`, description: g.description, path: imageGalleryPath(slug) });
}

export default async function GalleryPage({ params }: PageProps<"/images/galleries/[slug]">) {
  const { slug } = await params;
  const g = getGallery(slug);
  if (!g) notFound();
  const images = g.images();
  const crumbs: Crumb[] = [{ name: "Home", url: "/" }, { name: "Image Archive", url: ROUTES.images }, { name: g.title, url: imageGalleryPath(slug) }];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: g.title, description: g.description, url: imageGalleryPath(slug) })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="halo" eyebrow={<span>Gallery</span>} title={g.title} lead={g.description}>
        <div className="mt-4"><Badge tone="accent">Image Archive</Badge></div>
      </HeroSection>
      <Container className="mt-8 mb-14">
        <p className="mb-4 text-sm text-faint">{images.length} {images.length === 1 ? "image" : "images"}.</p>
        <ImageGallery images={images} />
      </Container>
    </>
  );
}
