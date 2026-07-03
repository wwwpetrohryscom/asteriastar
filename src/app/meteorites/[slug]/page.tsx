import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MeteoriteDetail } from "@/components/meteorites/MeteoriteDetail";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { meteoritePath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.meteorites.meteorites().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/meteorites/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = engine.meteorites.get(slug);
  if (!r) return {};
  return buildMetadata({ title: r.name, description: r.description, path: meteoritePath(slug) });
}

export default async function MeteoritePage({ params }: PageProps<"/meteorites/[slug]">) {
  const { slug } = await params;
  const d = engine.meteorites.resolveMeteorite(slug);
  if (!d) notFound();
  return <MeteoriteDetail d={d} />;
}
