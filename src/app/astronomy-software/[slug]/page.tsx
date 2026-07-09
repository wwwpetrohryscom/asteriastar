import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SoftwareDetail } from "@/components/astronomy-software/SoftwareDetail";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { astronomySoftwarePath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.astronomySoftware.all().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/astronomy-software/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = engine.astronomySoftware.get(slug);
  if (!r) return {};
  return buildMetadata({ title: r.name, description: r.description, path: astronomySoftwarePath(slug) });
}

export default async function AstronomySoftwareEntryPage({ params }: PageProps<"/astronomy-software/[slug]">) {
  const { slug } = await params;
  const d = engine.astronomySoftware.resolveEntry(slug);
  if (!d) notFound();
  return <SoftwareDetail d={d} />;
}
