import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { StatusBadge } from "@/components/data/StatusBadge";
import {
  ENDPOINTS,
  IMPLEMENTED_ENDPOINTS,
  PLANNED_ENDPOINTS,
  CATALOGUE_STATS,
  CHANGELOG,
  VERSIONING_POLICY,
  DEVELOPER_DOCS,
  DEVELOPER_DOC_SLUGS,
  getDeveloperDoc,
  buildOpenApiSpec,
} from "@/platform/open-data";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, developerDocPath, absoluteUrl } from "@/lib/routes";

export const dynamic = "force-static";

export function generateStaticParams() {
  return DEVELOPER_DOC_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDeveloperDoc(slug);
  if (!doc) return buildMetadata({ title: "Developers", description: "Developer documentation.", path: ROUTES.developers });
  return buildMetadata({ title: doc.title, description: doc.description, path: developerDocPath(slug) });
}

const card = "scientific-card p-5";

function OpenApiDoc() {
  const spec = buildOpenApiSpec();
  return (
    <div className="space-y-4">
      <p className="max-w-2xl text-sm leading-relaxed text-muted">
        The OpenAPI 3.1 document describes every implemented endpoint ({Object.keys(spec.paths).length} paths) and the response
        envelope. Planned endpoints are intentionally excluded, so the spec never advertises anything that is not real.
      </p>
      <Link href="/api/v0/openapi.json" className="inline-block rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2 font-mono text-sm text-nasa underline-offset-4 hover:border-white/25 hover:underline">
        GET /api/v0/openapi.json
      </Link>
      <p className="text-xs text-faint">Load it into Swagger UI, Redoc, or any OpenAPI 3.1 client. It is static and deterministic.</p>
    </div>
  );
}

function StatusDoc() {
  return (
    <div className="space-y-6">
      <p className="max-w-2xl text-sm leading-relaxed text-muted">
        A single honest view of what exists. {IMPLEMENTED_ENDPOINTS.length} endpoints are implemented and{" "}
        {PLANNED_ENDPOINTS.length} are planned; the catalogue holds {CATALOGUE_STATS.total} datasets
        ({CATALOGUE_STATS.stable} stable, {CATALOGUE_STATS.prepared} prepared, {CATALOGUE_STATS.planned} planned,
        {" "}{CATALOGUE_STATS.architecture} methodology).
      </p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-faint">
              <th className="pb-2 pr-4 font-medium">Endpoint</th>
              <th className="pb-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {ENDPOINTS.map((e) => (
              <tr key={e.id}>
                <td className="py-2 pr-4 font-mono text-xs text-fg">{e.method} {e.path}</td>
                <td className="py-2"><StatusBadge status={e.status === "implemented" ? "implemented" : "planned"} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ChangelogDoc() {
  return (
    <div className="space-y-6">
      <div className="grid gap-2 sm:grid-cols-2">
        {VERSIONING_POLICY.map((v) => (
          <div key={v.name} className={card}>
            <span className="font-medium text-fg">{v.name}</span>
            <span className="ml-2 font-mono text-xs text-nasa">{v.current}</span>
            <p className="mt-1 text-sm text-muted">{v.bumps}</p>
          </div>
        ))}
      </div>
      <div className="space-y-4">
        {CHANGELOG.map((e) => (
          <div key={`${e.area}-${e.version}`} className={card}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-display font-semibold text-fg">{e.title}</span>
              <span className="font-mono text-xs text-faint">{e.area} {e.version} · {e.date}</span>
            </div>
            <ul className="mt-2 space-y-1">
              {e.changes.map((c) => <li key={c} className="flex gap-2 text-sm text-muted"><span aria-hidden className="mt-1 text-faint">–</span><span>{c}</span></li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function RateLimitsDoc() {
  return (
    <div className="space-y-4">
      <p className="max-w-2xl text-sm leading-relaxed text-muted">
        There are <strong className="text-fg">no rate limits today</strong>. The API is read-only, deterministic, and
        cacheable, so responses can be served from cache and CDNs. This page describes the intended posture, not an enforced
        quota — nothing here pretends a limiter exists that does not.
      </p>
      <ul className="space-y-2 text-sm text-muted">
        <li className="flex gap-2"><span aria-hidden className="mt-1 text-success-strong">•</span><span>Responses set <span className="font-mono text-fg">Cache-Control: public, max-age=3600, stale-while-revalidate=86400</span>.</span></li>
        <li className="flex gap-2"><span aria-hidden className="mt-1 text-success-strong">•</span><span>Please cache aggressively and prefer the bulk exports for large pulls.</span></li>
        <li className="flex gap-2"><span aria-hidden className="mt-1 text-success-strong">•</span><span>If quotas are ever introduced, they will be versioned and documented here first.</span></li>
      </ul>
    </div>
  );
}

function SdkDoc() {
  const example = `const res = await fetch("${absoluteUrl("/api/v0/entities/planet:mars")}");
const { meta, data } = await res.json();
console.log(data.name, "—", meta.license);`;
  return (
    <div className="space-y-4">
      <p className="max-w-2xl text-sm leading-relaxed text-muted">
        No SDK is published yet. Because the API is plain JSON over <span className="font-mono text-fg">GET</span>, any HTTP
        client works today — a typed SDK is planned to wrap the envelope and endpoints.
      </p>
      <pre className="overflow-auto rounded-lg border border-white/10 bg-black/30 p-4 font-mono text-xs leading-relaxed text-faint">{example}</pre>
      <p className="text-xs text-faint">Until an SDK ships, the <Link href="/api/v0/openapi.json" className="text-nasa underline-offset-4 hover:underline">OpenAPI spec</Link> can generate a client in most languages.</p>
    </div>
  );
}

const DOCS: Record<string, () => React.ReactElement> = {
  openapi: OpenApiDoc, status: StatusDoc, changelog: ChangelogDoc, "rate-limits": RateLimitsDoc, sdk: SdkDoc,
};

export default async function DeveloperDocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getDeveloperDoc(slug);
  const Body = DOCS[slug];
  if (!doc || !Body) notFound();

  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Developers", url: ROUTES.developers },
    { name: doc.title, url: developerDocPath(slug) },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          collectionPageSchema({ name: doc.title, description: doc.description, url: developerDocPath(slug) }),
        ]}
      />
      <Container className="pt-8">
        <Breadcrumbs crumbs={crumbs} />
      </Container>
      <HeroSection compact accent="halo" eyebrow={<span>{doc.eyebrow}</span>} title={doc.title} lead={doc.description}>
        <div className="mt-4"><StatusBadge status={doc.status} /></div>
      </HeroSection>
      <Container className="mt-8 mb-12">
        <Body />
        <nav aria-label="Developers" className="mt-14 border-t border-white/10 pt-6">
          <p className="text-xs uppercase tracking-wider text-faint">More developer docs</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href={ROUTES.developersApi} className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-sm text-muted transition hover:border-white/25 hover:text-fg">API reference</Link>
            {DEVELOPER_DOCS.filter((d) => d.slug !== slug).map((d) => (
              <Link key={d.slug} href={developerDocPath(d.slug)} className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-sm text-muted transition hover:border-white/25 hover:text-fg">{d.title}</Link>
            ))}
          </div>
        </nav>
      </Container>
    </>
  );
}
