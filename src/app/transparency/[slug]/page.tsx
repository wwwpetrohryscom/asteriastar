import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  TRANSPARENCY_PAGES,
  getTransparencyPage,
  TransparencyWidgetView,
} from "@/app/transparency/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, transparencyPath } from "@/lib/routes";

export const dynamicParams = false;

export function generateStaticParams() {
  return TRANSPARENCY_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/transparency/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = getTransparencyPage(slug);
  if (!page) return {};
  return buildMetadata({ title: page.title, description: page.description, path: transparencyPath(slug) });
}

export default async function TransparencyDetailPage({ params }: PageProps<"/transparency/[slug]">) {
  const { slug } = await params;
  const page = getTransparencyPage(slug);
  if (!page) notFound();

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Transparency", url: ROUTES.transparency },
    { name: page.title, url: transparencyPath(slug) },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: page.title, description: page.description, url: transparencyPath(slug) })]} />
      <Container className="pt-8">
        <Breadcrumbs crumbs={crumbs} />
      </Container>
      <HeroSection compact accent="halo" eyebrow={<span>Transparency</span>} title={page.title} lead={page.intro} />

      <Container className="mt-8 mb-14 max-w-3xl space-y-8">
        {page.sections.map((sec) => (
          <section key={sec.heading} aria-labelledby={`s-${sec.heading}`}>
            <h2 id={`s-${sec.heading}`} className="font-display text-xl font-semibold text-fg">{sec.heading}</h2>
            {sec.body.map((p, i) => (
              <p key={i} className="mt-2 leading-relaxed text-muted">{p}</p>
            ))}
            {sec.list && (
              <ul className="mt-3 list-disc space-y-1 pl-5 text-muted marker:text-faint">
                {sec.list.map((li) => <li key={li}>{li}</li>)}
              </ul>
            )}
          </section>
        ))}

        {page.widget && (
          <section aria-labelledby="widget-heading">
            <h2 id="widget-heading" className="sr-only">Reference</h2>
            <TransparencyWidgetView widget={page.widget} />
          </section>
        )}

        <nav aria-label="More transparency" className="border-t border-white/10 pt-5">
          <p className="text-xs uppercase tracking-wider text-faint">More transparency</p>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
            {TRANSPARENCY_PAGES.filter((p) => p.slug !== slug).map((p) => (
              <li key={p.slug}>
                <Link href={transparencyPath(p.slug)} className="text-muted underline-offset-4 transition hover:text-fg hover:underline">{p.title}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </>
  );
}
