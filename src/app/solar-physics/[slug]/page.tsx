import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SolarDetail } from "@/components/solar-physics/SolarDetail";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { solarPhysicsPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.solarPhysics.all().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/solar-physics/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = engine.solarPhysics.get(slug);
  if (!r) return {};
  return buildMetadata({ title: r.name, description: r.description, path: solarPhysicsPath(slug) });
}

export default async function SolarPhysicsEntryPage({ params }: PageProps<"/solar-physics/[slug]">) {
  const { slug } = await params;
  const d = engine.solarPhysics.resolveEntry(slug);
  if (!d) notFound();
  return <SolarDetail d={d} />;
}
