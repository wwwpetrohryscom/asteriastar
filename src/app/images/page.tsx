import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ImageGallery } from "@/components/images/ImageUI";
import { engine } from "@/platform/data-engine";
import { ACTIVE_GALLERIES } from "@/app/images/galleries";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, imageCollectionPath, imageGalleryPath, astrophotographyPath } from "@/lib/routes";

const im = engine.images;
const DESCRIPTION = "A scientific image archive where every image has verified provenance. Asteria Star catalogues openly-licensed and public-domain imagery from NASA, ESA, ESO, STScI, the EHT, and others — recording each image's source, instrument, license, and credit, and linking to the official archive.";

export const metadata: Metadata = buildMetadata({ title: "Scientific Image Archive", description: DESCRIPTION, path: ROUTES.images });

export default function ImagesHub() {
  const crumbs: Crumb[] = [{ name: "Home", url: "/" }, { name: "Image Archive", url: ROUTES.images }];
  const featured = im.latest(6);
  const collections = im.collections.withCounts();

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: "Scientific Image Archive", description: DESCRIPTION, url: ROUTES.images })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection accent="halo" eyebrow={<span>Scientific Image Archive</span>} title="Every image has provenance" lead="A photograph is not decoration — it is scientific evidence. This archive catalogues openly-licensed and public-domain astronomical imagery with verified provenance: source, instrument, license, and credit, all linked to the Knowledge Graph.">
        <p className="mt-6 text-sm text-faint">{im.stats.images} images · {im.stats.collections} collections · {im.stats.sources} source archives · every image openly licensed or public domain</p>
      </HeroSection>

      <Container className="mt-8 mb-14 space-y-12">
        <aside role="note" className="rounded-2xl border border-white/25 bg-white/[0.06] p-5">
          <p className="text-sm font-semibold text-white">A provenance catalogue, not a re-host</p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">Asteria Star records verified metadata and links to each image&apos;s official source archive. It does not re-host or hotlink image binaries it has not verified, and it never fabricates a photograph, credit, licence, capture date, or source URL. Only openly-licensed or public-domain images are catalogued.</p>
        </aside>

        <section aria-labelledby="featured">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="featured" className="font-display text-2xl font-bold">Featured images</h2>
            <Link href={imageGalleryPath("latest")} className="text-sm text-muted transition hover:text-fg">Latest images →</Link>
          </div>
          <div className="mt-5"><ImageGallery images={featured} /></div>
        </section>

        <section aria-labelledby="collections">
          <h2 id="collections" className="font-display text-2xl font-bold">Collections</h2>
          <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map(({ collection, count }) => (
              <li key={collection.slug}>
                <Link href={imageCollectionPath(collection.slug)} className="group flex h-full flex-col scientific-card p-5 transition hover:-translate-y-0.5 hover:border-white/25">
                  <div className="flex items-baseline justify-between gap-2"><h3 className="font-display text-lg font-semibold text-fg group-hover:text-nasa">{collection.name}</h3><span className="text-xs text-faint">{count}</span></div>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{collection.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="galleries">
          <h2 id="galleries" className="font-display text-2xl font-bold">Galleries</h2>
          <ul className="mt-5 flex flex-wrap gap-2.5">
            {ACTIVE_GALLERIES.map((g) => (
              <li key={g.slug}>
                <Link href={imageGalleryPath(g.slug)} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3.5 py-1.5 text-sm text-muted transition hover:border-white/25 hover:text-fg">{g.title}<span className="text-xs text-faint">{g.images().length}</span></Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="sources">
          <h2 id="sources" className="font-display text-2xl font-bold">Source archives &amp; providers</h2>
          <p className="mt-2 text-sm text-muted">The platform is prepared to ingest from these open archives; images are currently catalogued by hand with verified provenance. All providers are <strong className="text-fg">planned</strong> — nothing is scraped or ingested automatically yet.</p>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {im.providers().map((p) => (
              <li key={p.key} className="scientific-card p-4">
                <div className="flex items-baseline justify-between gap-2"><a href={p.url} target="_blank" rel="noreferrer nofollow" className="font-medium text-fg hover:text-nasa">{p.name}</a><span className="text-xs text-faint">{p.status}</span></div>
                <p className="mt-1 text-sm text-muted">{p.organization} · {p.defaultLicense}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="scientific-card p-5 text-sm text-muted">
          <h2 className="font-display text-base font-semibold text-fg">Astrophotography</h2>
          <p className="mt-1.5">Amateur and professional astrophotography — equipment, processing, and observation guides — are kept clearly separate from institutional scientific imagery. <Link href={astrophotographyPath("equipment")} className="text-nasa hover:underline">Explore the astrophotography guides →</Link></p>
        </section>
      </Container>
    </>
  );
}
