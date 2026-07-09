import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { GalleryCard } from "@/components/gallery/GalleryCard";
import { GALLERY_THEMES, getGalleryTheme, galleryImages } from "@/lib/gallery";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, galleryPath, imageCollectionPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return GALLERY_THEMES.map((t) => ({ category: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/gallery/[category]">): Promise<Metadata> {
  const { category } = await params;
  const theme = getGalleryTheme(category);
  if (!theme) return {};
  return buildMetadata({ title: `${theme.title} — Gallery`, description: theme.tagline, path: galleryPath(category) });
}

export default async function GalleryCategoryPage({ params }: PageProps<"/gallery/[category]">) {
  const { category } = await params;
  const theme = getGalleryTheme(category);
  if (!theme) notFound();
  const images = galleryImages(theme);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Gallery", url: ROUTES.gallery },
    { name: theme.title, url: galleryPath(category) },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: `${theme.title} — Gallery`, description: theme.tagline, url: galleryPath(category) })]} />
      <HeroSection
        backdrop
        backdropVariant="section"
        accent="halo"
        compact
        eyebrow={<span className="text-halo/90">Gallery · {images.length} images</span>}
        title={theme.title}
        lead={theme.tagline}
      />
      <Container className="pt-2"><Breadcrumbs crumbs={crumbs} /></Container>
      <Container className="mt-8 mb-14">
        {images.length > 0 ? (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((img) => (
              <li key={img.slug} className="contents"><GalleryCard img={img} /></li>
            ))}
          </ul>
        ) : (
          <p className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-muted">
            This collection is still being curated from openly-licensed archives.{" "}
            {theme.collection ? (
              <Link href={imageCollectionPath(theme.collection)} className="text-halo underline-offset-4 hover:underline">Browse the {theme.title} collection →</Link>
            ) : (
              <Link href={ROUTES.images} className="text-halo underline-offset-4 hover:underline">Browse the image archive →</Link>
            )}
          </p>
        )}
        <p className="mt-8 text-sm text-faint">
          Every image links to its official archive with full credit and licence. Asteria Star never re-hosts binaries or fabricates imagery.
        </p>
      </Container>
    </>
  );
}
