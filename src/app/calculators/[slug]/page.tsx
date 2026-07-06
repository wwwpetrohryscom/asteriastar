import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalcDetail } from "@/components/calculators/CalcDetail";
import { engine } from "@/platform/data-engine";
import { buildMetadata } from "@/lib/seo/metadata";
import { calculatorPath } from "@/lib/routes";

export const dynamicParams = false;
export function generateStaticParams() {
  return engine.scientificCalculators.all().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/calculators/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = engine.scientificCalculators.get(slug);
  if (!r) return {};
  return buildMetadata({ title: r.name, description: r.description, path: calculatorPath(slug) });
}

export default async function CalculatorPage({ params }: PageProps<"/calculators/[slug]">) {
  const { slug } = await params;
  const d = engine.scientificCalculators.resolveEntry(slug);
  if (!d) notFound();
  return <CalcDetail d={d} />;
}
