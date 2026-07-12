import Link from "next/link";
import type { ReactNode } from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES } from "@/lib/routes";
import type { HealthStatus } from "@/lib/data-health/metrics";

/** Shared page shell for the data-health subpages (breadcrumbs + hero + container). */
export function DataHealthShell({ title, description, path, asOf, children }: { title: string; description: string; path: string; asOf?: string; children: ReactNode }) {
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" }, { name: "Authority", url: ROUTES.authority },
    { name: "Data health", url: "/authority/data-health" }, { name: title, url: path },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs)]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection eyebrow="Data health" title={title} lead={`${description}${asOf ? ` As of ${asOf}.` : ""}`} />
      <Container className="mt-10 mb-14 space-y-10">{children}</Container>
    </>
  );
}

/**
 * Presentational primitives for the data-health dashboard. Truthful by design: a status
 * is only "healthy" (green) when genuinely so; failures/conflicts/stale are red/amber.
 * No composite score — just honest counts and statuses. Existing card styling only.
 */

const STATUS_STYLE: Record<HealthStatus, { label: string; cls: string }> = {
  healthy: { label: "Healthy", cls: "text-success-strong border-success/30 bg-success/10" },
  warning: { label: "Aging", cls: "text-amber-400 border-amber-400/30 bg-amber-400/10" },
  stale: { label: "Stale", cls: "text-red-400 border-red-400/30 bg-red-400/10" },
  failed: { label: "Failed", cls: "text-red-400 border-red-400/40 bg-red-400/10" },
  unavailable: { label: "Unavailable", cls: "text-red-400 border-red-400/30 bg-red-400/10" },
  unverified: { label: "Unverified", cls: "text-faint border-white/20 bg-white/5" },
  conflict: { label: "Conflict", cls: "text-amber-400 border-amber-400/40 bg-amber-400/10" },
  planned: { label: "Planned", cls: "text-nasa border-nasa/30 bg-nasa/10" },
};

export function StatusPill({ status }: { status: HealthStatus }) {
  const s = STATUS_STYLE[status];
  return <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${s.cls}`}>{s.label}</span>;
}

export function MetricCard({ label, value, sub, href }: { label: string; value: ReactNode; sub?: ReactNode; href?: string }) {
  const inner = (
    <>
      <div className="text-xs uppercase tracking-wider text-faint">{label}</div>
      <div className="mt-1 font-display text-2xl font-bold text-fg">{value}</div>
      {sub ? <div className="mt-0.5 text-xs text-muted">{sub}</div> : null}
    </>
  );
  return href
    ? <Link href={href} className="scientific-card block p-4 transition hover:border-white/25">{inner}</Link>
    : <div className="scientific-card p-4">{inner}</div>;
}

export function MetricGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{children}</div>;
}

export function HealthTable({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full text-left text-sm">
        <thead><tr className="border-b border-white/10 text-faint">{head.map((h) => <th key={h} className="px-4 py-2.5 font-medium">{h}</th>)}</tr></thead>
        <tbody className="divide-y divide-white/5">
          {rows.map((r, i) => <tr key={i} className="transition hover:bg-white/[0.02]">{r.map((c, j) => <td key={j} className="px-4 py-2.5 text-fg">{c}</td>)}</tr>)}
        </tbody>
      </table>
    </div>
  );
}

/** Count table sorted desc — for by-domain/status/source distributions. */
export function DistributionTable({ title, data }: { title: string; data: Record<string, number> }) {
  const rows = Object.entries(data).sort((a, b) => b[1] - a[1]);
  return (
    <div>
      <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-faint">{title}</h3>
      <div className="mt-2 space-y-1">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between gap-3 text-sm">
            <span className="text-muted">{k}</span>
            <span className="font-medium text-fg">{v.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
