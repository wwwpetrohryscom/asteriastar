import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InstDetail } from "@/components/instruments/InstDetail";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { instrumentsPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.instruments.all().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/instruments/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = engine.instruments.get(slug);
  if (!r) return {};
  return buildMetadata({ title: r.name, description: r.description, path: instrumentsPath(slug) });
}

export default async function InstrumentPage({ params }: PageProps<"/instruments/[slug]">) {
  const { slug } = await params;
  const d = engine.instruments.resolveEntry(slug);
  if (!d) notFound();
  return <InstDetail d={d} />;
}
