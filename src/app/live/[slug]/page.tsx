import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LiveDetail } from "@/components/live/LiveDetail";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { livePath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.liveScientificData.all().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/live/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = engine.liveScientificData.get(slug);
  if (!r) return {};
  return buildMetadata({ title: r.name, description: r.description, path: livePath(slug) });
}

export default async function LivePage({ params }: PageProps<"/live/[slug]">) {
  const { slug } = await params;
  const d = engine.liveScientificData.resolveEntry(slug);
  if (!d) notFound();
  return <LiveDetail d={d} />;
}
