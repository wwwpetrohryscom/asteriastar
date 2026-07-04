import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InstDetail } from "@/components/institutions/InstDetail";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { institutionsPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.institutions.all().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/institutions/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = engine.institutions.get(slug);
  if (!r) return {};
  return buildMetadata({ title: r.name, description: r.description, path: institutionsPath(slug) });
}

export default async function InstitutionPage({ params }: PageProps<"/institutions/[slug]">) {
  const { slug } = await params;
  const d = engine.institutions.resolveEntry(slug);
  if (!d) notFound();
  return <InstDetail d={d} />;
}
