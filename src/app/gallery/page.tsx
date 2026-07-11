import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { GalleryCard } from "@/components/gallery/GalleryCard";
import { galleryCategories, galleryObjectCount } from "@/lib/gallery";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, galleryPath } from "@/lib/routes";

const DESCRIPTION =
  "A gallery of real, openly-licensed astronomy imagery — galaxies, nebulae, planets, moons, telescopes and missions — self-hosted from NASA, ESA/Hubble, ESA/Webb, ESO, NOIRLab and Wikimedia Commons. Every image is credited, licensed, and depicts the actual object.";

export const metadata: Metadata = buildMetadata({ title: "Gallery", description: DESCRIPTION, path: ROUTES.gallery });

export default function GalleryPage() {
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Gallery", url: ROUTES.gallery },
  ];
  const categories = galleryCategories();
  const total = galleryObjectCount();

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Gallery", description: DESCRIPTION, url: ROUTES.gallery })]} />

      <Container className="pt-10">
        <Breadcrumbs crumbs={crumbs} />
        <p className="mt-6 flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-nasa">
          <span aria-hidden className="inline-block h-3 w-1 rounded-full bg-nasa-red" />
          {total} objects · real imagery
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold text-white sm:text-5xl">The Gallery</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
          Real, openly-licensed photographs of the Universe — galaxies, nebulae, planets, moons, telescopes and
          missions — each depicting the actual object, credited and linked to its page.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((c) => (
            <Link key={c.slug} href={galleryPath(c.slug)} className="rounded-full border border-white/15 bg-white/[0.03] px-3 py-1 text-sm text-muted transition hover:border-nasa/50 hover:text-fg">
              {c.title}
            </Link>
          ))}
        </div>
      </Container>

      {categories.map((c) => (
        <Container key={c.slug} className="mt-14">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-fg sm:text-3xl">{c.title}</h2>
              <p className="mt-2 max-w-2xl text-muted">{c.tagline}</p>
            </div>
            {c.images.length > 6 && (
              <Link href={galleryPath(c.slug)} className="hidden shrink-0 text-sm text-muted transition hover:text-fg sm:block">
                See all {c.images.length} →
              </Link>
            )}
          </div>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {c.images.slice(0, 6).map((img) => (
              <li key={img.id} className="contents"><GalleryCard img={img} /></li>
            ))}
          </ul>
        </Container>
      ))}

      <Container className="mt-16 mb-14">
        <div className="rounded-lg border border-white/10 bg-bg-elevated/70 p-5 text-sm text-muted">
          <span className="font-semibold text-fg">Real imagery, honest provenance.</span> Every photograph is a genuine
          observation from an openly-licensed or public-domain archive — NASA, ESA/Hubble, ESA/Webb, ESO, NOIRLab and
          Wikimedia Commons — self-hosted and optimized, with credit and licence on every image. AsteriaStar never uses
          AI-generated or decorative art for scientific objects. See{" "}
          <Link href="/transparency/source-quality" className="text-nasa underline-offset-4 hover:underline">source quality</Link>.
        </div>
      </Container>
    </>
  );
}
