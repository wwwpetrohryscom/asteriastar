import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OsDetail } from "@/components/observing/OsDetail";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { observingPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.observingSuite.all().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/observing/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = engine.observingSuite.get(slug);
  if (!r) return {};
  return buildMetadata({ title: r.name, description: r.description, path: observingPath(slug) });
}

export default async function ObservingPage({ params }: PageProps<"/observing/[slug]">) {
  const { slug } = await params;
  const d = engine.observingSuite.resolveEntry(slug);
  if (!d) notFound();
  return <OsDetail d={d} />;
}
