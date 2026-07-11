import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ExoplanetTable } from "@/components/exoplanets/ExoplanetTable";
import { EXO_DISCOVERIES, getExoDiscovery } from "@/app/exoplanets/discovery";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, exoplanetPath, exoplanetDiscoveryPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return EXO_DISCOVERIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/exoplanets/discover/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getExoDiscovery(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: exoplanetDiscoveryPath(slug) });
}

export default async function ExoDiscoverPage({ params }: PageProps<"/exoplanets/discover/[slug]">) {
  const { slug } = await params;
  const d = getExoDiscovery(slug);
  if (!d) notFound();
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Exoplanets", url: ROUTES.exoplanets },
    { name: d.title, url: exoplanetDiscoveryPath(slug) },
  ];
  const count = d.view === "planets" ? d.get().length : d.getSystems().length;
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: d.title, description: d.description, url: exoplanetDiscoveryPath(slug) })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="ember" eyebrow={<span>Discover</span>} title={d.title} lead={d.description} />
      <Container className="mt-8 mb-14">
        <p className="mb-4 text-sm text-faint">{count} {d.view === "systems" ? (count === 1 ? "system" : "systems") : count === 1 ? "planet" : "planets"}.</p>
        {d.view === "planets" ? (
          <ExoplanetTable planets={d.get()} />
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {d.getSystems().map((s) => (
              <li key={s.id}>
                <Link href={exoplanetPath(s.slug)} className="group flex h-full flex-col scientific-card p-5 transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.04]">
                  <h3 className="font-display text-lg font-semibold text-fg group-hover:text-nasa">{s.name}</h3>
                  <p className="mt-1 text-xs uppercase tracking-wide text-faint">{s.planets.length} known planets</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </>
  );
}
