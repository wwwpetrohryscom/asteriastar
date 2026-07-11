import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SourceList } from "@/components/ui/SourceList";
import { JsonLd } from "@/components/seo/JsonLd";
import { engine } from "@/platform/data-engine";
import { getEntityById, entityGraphPath } from "@/knowledge-graph";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, constellationAsterismPath, constellationPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.constellations.asterisms().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/constellations/asterism/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const a = engine.constellations.resolveAsterism(slug);
  if (!a) return {};
  return buildMetadata({ title: a.name, description: a.description, path: constellationAsterismPath(slug) });
}

export default async function AsterismPage({ params }: PageProps<"/constellations/asterism/[slug]">) {
  const { slug } = await params;
  const a = engine.constellations.resolveAsterism(slug);
  if (!a) notFound();
  const url = constellationAsterismPath(slug);
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Constellations", url: ROUTES.constellations },
    { name: a.name, url },
  ];
  const stars = (a.starIds ?? []).map((id) => getEntityById(id)).filter((e): e is NonNullable<typeof e> => Boolean(e));

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: a.name, description: a.description, url })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="nebula" eyebrow={<span>Asterism</span>} title={a.name} lead={a.description} />
      <Container className="mt-8 mb-14 space-y-8">
        <section aria-labelledby="cons">
          <h2 id="cons" className="font-display text-2xl font-bold">Constellations</h2>
          <p className="mt-1 text-sm text-faint">The constellation{a.constellationSlugs.length === 1 ? "" : "s"} this pattern draws its stars from.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {a.constellationSlugs.map((cs) => {
              const c = engine.constellations.get(cs);
              return <Link key={cs} href={constellationPath(cs)} className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-sm text-fg hover:border-white/25">{c?.name ?? cs}</Link>;
            })}
          </div>
        </section>

        {stars.length > 0 ? (
          <section aria-labelledby="stars">
            <h2 id="stars" className="font-display text-2xl font-bold">Stars</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {stars.map((s) => (
                <Link key={s.id} href={entityGraphPath(s)} className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-sm text-fg hover:border-white/25">{s.name}</Link>
              ))}
            </div>
          </section>
        ) : null}

        <p className="rounded-xl border border-nasa/40 bg-nasa/10 p-4 text-sm text-muted">
          An asterism is a recognisable star pattern that is <strong>not</strong> one of the 88 official IAU constellations. Explore the{" "}
          <Link href={ROUTES.constellations} className="text-nasa underline-offset-4 hover:underline">88 constellations →</Link>
        </p>

        <SourceList keys={a.sources} title="Sources" />
      </Container>
    </>
  );
}
