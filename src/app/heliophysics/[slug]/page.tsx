import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HpDetail } from "@/components/heliophysics/HpDetail";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { heliophysicsPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.heliophysics.all().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/heliophysics/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = engine.heliophysics.get(slug);
  if (!r) return {};
  return buildMetadata({ title: r.name, description: r.description, path: heliophysicsPath(slug) });
}

export default async function HeliophysicsPage({ params }: PageProps<"/heliophysics/[slug]">) {
  const { slug } = await params;
  const d = engine.heliophysics.resolveEntry(slug);
  if (!d) notFound();
  return <HpDetail d={d} />;
}
