import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { JsonLd } from "@/components/seo/JsonLd";
import { SourceList } from "@/components/ui/SourceList";
import { ImagePlaceholder, LicenseBadge, MetadataPanel, ProvenancePanel, ImageGallery, ImageSection, RefCards } from "@/components/images/ImageUI";
import { engine } from "@/platform/data-engine";
import { LICENSE_BY_SLUG } from "@/platform/images";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { absoluteUrl, ROUTES, imagePath, imageCollectionPath } from "@/lib/routes";

const im = engine.images;

export const dynamicParams = false;
export function generateStaticParams() {
  return im.slugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/images/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = im.resolve(slug);
  if (!d) return {};
  return buildMetadata({ title: d.record.title, description: d.record.caption.slice(0, 200), path: imagePath(slug) });
}

export default async function ImagePage({ params }: PageProps<"/images/[slug]">) {
  const { slug } = await params;
  const d = im.resolve(slug);
  if (!d) notFound();
  const r = d.record;
  const url = imagePath(slug);
  const license = LICENSE_BY_SLUG.get(r.licenseSlug);
  const crumbs: Crumb[] = [{ name: "Home", url: "/" }, { name: "Image Archive", url: ROUTES.images }, { name: r.title, url }];

  // ImageObject JSON-LD — real metadata ABOUT the image (no fabricated file URL).
  const imageLd: Record<string, unknown> = {
    "@context": "https://schema.org", "@type": "ImageObject",
    name: r.title, caption: r.caption, description: r.scientificDescription,
    creditText: r.credit, creator: { "@type": "Organization", name: r.institution },
    url: absoluteUrl(url),
    ...(license ? { license: license.url } : {}),
    ...(r.copyright ? { copyrightNotice: r.copyright } : {}),
    ...(r.captureDate ? { dateCreated: r.captureDate } : {}),
    ...(r.publicationYear ? { datePublished: String(r.publicationYear) } : {}),
    ...(d.provenance.source ? { acquireLicensePage: d.provenance.source.archiveUrl } : {}),
  };

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), imageLd]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <Container className="mt-4">
        <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-faint">
          <span>Scientific Image</span>{d.capturedBy && <span>· {d.capturedBy.name}</span>}
        </div>
        <h1 className="max-w-4xl font-display text-3xl font-bold sm:text-4xl">{r.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-2"><Badge tone="accent">Image Archive</Badge><LicenseBadge slug={r.licenseSlug} /></div>
        <div className="mt-6"><ImagePlaceholder img={r} aspect="aspect-[2/1]" /></div>
        <p className="mt-3 text-sm leading-relaxed text-muted"><span className="text-faint">Caption:</span> {r.caption}</p>
      </Container>

      <Container className="mt-8 mb-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
          <div className="space-y-10">
            <ImageSection id="context" title="Scientific context"><p className="leading-relaxed text-muted">{r.scientificDescription}</p></ImageSection>
            <ImageSection id="subject" title="Subject & instruments">
              <RefCards refs={[
                ...(d.depicts ? [{ ...d.depicts, name: `Depicts: ${d.depicts.name}` }] : []),
                ...(d.capturedBy ? [{ ...d.capturedBy, name: `Captured by: ${d.capturedBy.name}` }] : []),
                ...(d.takenAt ? [{ ...d.takenAt, name: `Taken at: ${d.takenAt.name}` }] : []),
                ...d.related.map((x) => ({ ...x, name: `Related: ${x.name}` })),
                ...(d.relatedDiscovery ? [{ ...d.relatedDiscovery, name: `Discovery: ${d.relatedDiscovery.name}` }] : []),
              ]} />
              {r.instrument && <p className="mt-3 text-sm text-faint">Instrument: {r.instrument}{r.wavelengthBand ? ` · ${r.wavelengthBand}` : ""}</p>}
            </ImageSection>
            {d.record.collections.length > 0 && (
              <ImageSection id="collections" title="Collections">
                <div className="flex flex-wrap gap-2">
                  {d.record.collections.map((c) => {
                    const col = im.collections.get(c);
                    return col ? <Link key={c} href={imageCollectionPath(c)} className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-sm text-muted transition hover:border-white/25 hover:text-fg">{col.name}</Link> : null;
                  })}
                </div>
              </ImageSection>
            )}
            {d.relatedImages.length > 0 && <ImageSection id="related" title="Related images"><ImageGallery images={d.relatedImages} /></ImageSection>}
            <SourceList keys={[d.provenance.source?.sourceKey].filter((x): x is NonNullable<typeof x> => Boolean(x))} title="Source & references" />
          </div>
          <aside className="space-y-6">
            <ProvenancePanel provenance={d.provenance} />
            <MetadataPanel rows={d.metadata} unrecorded={d.unrecorded} />
          </aside>
        </div>
      </Container>
    </>
  );
}
