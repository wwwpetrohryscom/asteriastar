import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AbDetail } from "@/components/astrobiology/AbDetail";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { astrobiologyPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.astrobiology.all().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/astrobiology/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = engine.astrobiology.get(slug);
  if (!r) return {};
  return buildMetadata({ title: r.name, description: r.description, path: astrobiologyPath(slug) });
}

export default async function AstrobiologyPage({ params }: PageProps<"/astrobiology/[slug]">) {
  const { slug } = await params;
  const d = engine.astrobiology.resolveEntry(slug);
  if (!d) notFound();
  return <AbDetail d={d} />;
}
