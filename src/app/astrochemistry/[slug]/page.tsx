import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AcDetail } from "@/components/astrochemistry/AcDetail";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { astrochemistryPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.astrochemistry.all().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/astrochemistry/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = engine.astrochemistry.get(slug);
  if (!r) return {};
  return buildMetadata({ title: r.name, description: r.description, path: astrochemistryPath(slug) });
}

export default async function AstrochemistryPage({ params }: PageProps<"/astrochemistry/[slug]">) {
  const { slug } = await params;
  const d = engine.astrochemistry.resolveEntry(slug);
  if (!d) notFound();
  return <AcDetail d={d} />;
}
