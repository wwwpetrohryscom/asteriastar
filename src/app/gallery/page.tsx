import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { StarChartAccent, ConstellationDivider } from "@/components/cosmos/Cosmos";
import { GalleryCard } from "@/components/gallery/GalleryCard";
import { GALLERY_THEMES, galleryImages } from "@/lib/gallery";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, galleryPath } from "@/lib/routes";

const DESCRIPTION =
  "A gallery of the cosmos — James Webb and Hubble, the Solar System, the deep sky, and the Earth from space — curated from openly-licensed and public-domain sources (NASA, ESA/Hubble, ESA/Webb, ESO, NOIRLab). Every image carries its credit, licence, and a link to the official archive; we never re-host or fabricate imagery.";

export const metadata: Metadata = buildMetadata({ title: "Gallery", description: DESCRIPTION, path: ROUTES.gallery });

export default function GalleryPage() {
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Gallery", url: ROUTES.gallery },
  ];
  const themes = GALLERY_THEMES.map((t) => ({ theme: t, images: galleryImages(t) }));
  const total = new Set(themes.flatMap((t) => t.images.map((i) => i.slug))).size;

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Gallery", description: DESCRIPTION, url: ROUTES.gallery })]} />
      <HeroSection
        backdrop
        accent="halo"
        eyebrow={<span className="text-halo/90">Openly-licensed cosmic imagery</span>}
        title={<>The <span className="accent-text">Gallery</span></>}
        lead="Webb and Hubble, the Solar System, the deep sky, and the Earth from space — every image credited, licensed, and linked to its official archive."
      >
        <Container className="!px-0">
          <div className="mt-6 flex flex-wrap gap-2">
            {GALLERY_THEMES.map((t) => (
              <Link key={t.slug} href={galleryPath(t.slug)} className="rounded-full border border-white/12 bg-white/[0.02] px-3 py-1 text-sm text-muted transition hover:border-halo/40 hover:text-fg">
                {t.title}
              </Link>
            ))}
          </div>
        </Container>
      </HeroSection>

      <Container className="pt-2"><Breadcrumbs crumbs={crumbs} /></Container>

      {themes.map(({ theme, images }, idx) => (
        <div key={theme.slug}>
          {idx > 0 ? <ConstellationDivider idKey={theme.slug} className="mt-14" /> : null}
          <Container className={idx > 0 ? "mt-6" : "mt-12"}>
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <h2 className="flex items-center gap-2.5 font-display text-2xl font-bold sm:text-3xl">
                  <StarChartAccent /> {theme.title}
                </h2>
                <p className="mt-2 max-w-2xl text-muted">{theme.tagline}</p>
              </div>
              {images.length > 0 ? (
                <Link href={galleryPath(theme.slug)} className="hidden shrink-0 text-sm text-muted transition hover:text-fg sm:block">
                  See all {images.length} →
                </Link>
              ) : null}
            </div>
            {images.length > 0 ? (
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {images.slice(0, 6).map((img) => (
                  <li key={img.slug} className="contents"><GalleryCard img={img} /></li>
                ))}
              </ul>
            ) : (
              <p className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-sm text-muted">
                This collection is growing. Browse the full{" "}
                <Link href={ROUTES.images} className="text-halo underline-offset-4 hover:underline">image archive</Link>{" "}for everything catalogued so far.
              </p>
            )}
          </Container>
        </div>
      ))}

      <Container className="mt-16 mb-14">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-sm text-muted">
          <span className="font-semibold text-fg">Provenance first.</span> The gallery draws on {total} catalogued images from openly-licensed and public-domain archives — NASA, ESA/Hubble, ESA/Webb, ESO, NOIRLab, and Wikimedia Commons. Every image shows its credit and licence and links to the official source; Asteria Star never re-hosts binaries or fabricates imagery. See{" "}
          <Link href="/transparency/source-quality" className="text-halo underline-offset-4 hover:underline">source quality</Link>.
        </div>
      </Container>
    </>
  );
}
