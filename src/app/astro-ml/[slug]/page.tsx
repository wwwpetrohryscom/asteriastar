import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MlDetail } from "@/components/astro-ml/MlDetail";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { astroMlPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.astroMl.all().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/astro-ml/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = engine.astroMl.get(slug);
  if (!r) return {};
  return buildMetadata({ title: r.name, description: r.description, path: astroMlPath(slug) });
}

export default async function AstroMlPage({ params }: PageProps<"/astro-ml/[slug]">) {
  const { slug } = await params;
  const d = engine.astroMl.resolveEntry(slug);
  if (!d) notFound();
  return <MlDetail d={d} />;
}
