import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SysDetail } from "@/components/spacecraft-systems/SysDetail";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { spacecraftSystemsPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.spacecraftSystems.all().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/spacecraft-systems/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = engine.spacecraftSystems.get(slug);
  if (!r) return {};
  return buildMetadata({ title: r.name, description: r.description, path: spacecraftSystemsPath(slug) });
}

export default async function SpacecraftSystemsPage({ params }: PageProps<"/spacecraft-systems/[slug]">) {
  const { slug } = await params;
  const d = engine.spacecraftSystems.resolveEntry(slug);
  if (!d) notFound();
  return <SysDetail d={d} />;
}
