import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaDetail } from "@/components/citizen-astronomy/CaDetail";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { citizenAstronomyPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.citizenAstronomy.all().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/citizen-astronomy/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = engine.citizenAstronomy.get(slug);
  if (!r) return {};
  return buildMetadata({ title: r.name, description: r.description, path: citizenAstronomyPath(slug) });
}

export default async function CitizenAstronomyPage({ params }: PageProps<"/citizen-astronomy/[slug]">) {
  const { slug } = await params;
  const d = engine.citizenAstronomy.resolveEntry(slug);
  if (!d) notFound();
  return <CaDetail d={d} />;
}
