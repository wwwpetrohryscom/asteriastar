import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AiDetail } from "@/components/astroinformatics/AiDetail";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { astroinformaticsPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.astroinformatics.all().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/astroinformatics/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = engine.astroinformatics.get(slug);
  if (!r) return {};
  return buildMetadata({ title: r.name, description: r.description, path: astroinformaticsPath(slug) });
}

export default async function AstroinformaticsPage({ params }: PageProps<"/astroinformatics/[slug]">) {
  const { slug } = await params;
  const d = engine.astroinformatics.resolveEntry(slug);
  if (!d) notFound();
  return <AiDetail d={d} />;
}
