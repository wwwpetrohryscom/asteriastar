import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { GalleryCard } from "@/components/gallery/GalleryCard";
import { galleryCategories, getGalleryCategory } from "@/lib/gallery";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, galleryPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return galleryCategories().map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/gallery/[category]">): Promise<Metadata> {
  const { category } = await params;
  const c = getGalleryCategory(category);
  if (!c) return {};
  return buildMetadata({ title: `${c.title} — Gallery`, description: c.tagline, path: galleryPath(category) });
}

export default async function GalleryCategoryPage({ params }: PageProps<"/gallery/[category]">) {
  const { category } = await params;
  const c = getGalleryCategory(category);
  if (!c) notFound();
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Gallery", url: ROUTES.gallery },
    { name: c.title, url: galleryPath(category) },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: `${c.title} — Gallery`, description: c.tagline, url: galleryPath(category) })]} />

      <Container className="pt-10">
        <Breadcrumbs crumbs={crumbs} />
        <p className="mt-6 flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-nasa">
          <span aria-hidden className="inline-block h-3 w-1 rounded-full bg-nasa-red" />
          Gallery · {c.images.length} objects
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold text-white sm:text-5xl">{c.title}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{c.tagline}</p>
      </Container>

      <Container className="mt-8 mb-14">
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {c.images.map((img) => (
            <li key={img.id} className="contents"><GalleryCard img={img} /></li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-faint">
          Every image is a real observation, self-hosted with full credit and licence, and links to its object page.
          AsteriaStar never uses AI-generated or decorative art for scientific objects.
        </p>
      </Container>
    </>
  );
}
