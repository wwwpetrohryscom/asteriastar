import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CmDetail } from "@/components/celestial-mechanics/CmDetail";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { celestialMechanicsPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.celestialMechanics.all().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/celestial-mechanics/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = engine.celestialMechanics.get(slug);
  if (!r) return {};
  return buildMetadata({ title: r.name, description: r.description, path: celestialMechanicsPath(slug) });
}

export default async function CelestialMechanicsPage({ params }: PageProps<"/celestial-mechanics/[slug]">) {
  const { slug } = await params;
  const d = engine.celestialMechanics.resolveEntry(slug);
  if (!d) notFound();
  return <CmDetail d={d} />;
}
