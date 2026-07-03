import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CometDetail } from "@/components/comets/CometDetail";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { cometPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.comets.pages().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/comets/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = engine.comets.get(slug);
  if (!r) return {};
  return buildMetadata({ title: r.name, description: r.description, path: cometPath(slug) });
}

export default async function CometPage({ params }: PageProps<"/comets/[slug]">) {
  const { slug } = await params;
  const d = engine.comets.resolveComet(slug);
  if (!d) notFound();
  return <CometDetail d={d} kindLabel="Comet" url={cometPath(slug)} />;
}
