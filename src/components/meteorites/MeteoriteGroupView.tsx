import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { SourceList } from "@/components/ui/SourceList";
import { JsonLd } from "@/components/seo/JsonLd";
import { ReviewBadge } from "@/components/authority/TrustBadges";
import { EntityProvenancePanel } from "@/components/authority/EntityProvenancePanel";
import { MeteoritesCards } from "@/components/meteorites/MeteoritesCards";
import type { ResolvedMeteoriteGroup } from "@/platform/data-engine/meteorite-engine";
import { RELATION_LABELS, INVERSE_RELATION_LABELS } from "@/knowledge-graph/schema";
import { entityGraphPath } from "@/knowledge-graph";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES, meteoriteGroupPath } from "@/lib/routes";

/** Shared detail view for a meteorite grouping — class / group / recovery site. */
export function MeteoriteGroupView({ d, kindLabel, url }: { d: ResolvedMeteoriteGroup; kindLabel: string; url: string }) {
  const r = d.record;
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Meteorites", url: ROUTES.meteorites },
    { name: r.name, url },
  ];
  const science = d.connections.science;

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), collectionPageSchema({ name: r.name, description: r.description, url })]} />
      <Container className="pt-8"><Breadcrumbs crumbs={crumbs} /></Container>
      <HeroSection compact accent="nebula" eyebrow={<span>{kindLabel}</span>} title={r.name} lead={r.definition ?? r.description}>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge tone="accent">{kindLabel}</Badge>
          {d.parentBodies.map((p) => <Link key={p.id} href={p.href ?? "#"} className="text-sm text-nebula hover:underline">Parent body: {p.name}</Link>)}
        </div>
      </HeroSection>

      <Container className="mt-8 mb-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-10">
            <section aria-labelledby="overview">
              <h2 id="overview" className="font-display text-2xl font-bold">Overview</h2>
              <p className="mt-3 leading-relaxed text-muted">{r.description}</p>
            </section>

            {d.subgroups.length ? (
              <section aria-labelledby="subgroups">
                <h2 id="subgroups" className="font-display text-2xl font-bold">Groups</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {d.subgroups.map((g) => (
                    <Link key={g.id} href={meteoriteGroupPath(g.slug)} className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-sm text-fg hover:border-white/25">{g.name}</Link>
                  ))}
                </div>
              </section>
            ) : null}

            {d.members.length ? (
              <section aria-labelledby="members">
                <h2 id="members" className="font-display text-2xl font-bold">Meteorites</h2>
                <p className="mt-1 text-sm text-faint">{d.members.length} modelled meteorite{d.members.length === 1 ? "" : "s"}.</p>
                <div className="mt-3"><MeteoritesCards records={d.members} /></div>
              </section>
            ) : null}

            {science.length ? (
              <section aria-labelledby="connections">
                <h2 id="connections" className="font-display text-2xl font-bold">Knowledge connections</h2>
                <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {science.slice(0, 24).map((cx) => (
                    <li key={cx.relation.id} className="flex items-baseline justify-between gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-sm">
                      <span className="text-faint">{cx.outgoing ? RELATION_LABELS[cx.relation.type] : INVERSE_RELATION_LABELS[cx.relation.type]}</span>
                      <Link href={entityGraphPath(cx.other)} className="text-right font-medium text-fg hover:text-nebula">{cx.other.name}</Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <SourceList keys={r.sources} title="Sources" />
          </div>

          <aside className="space-y-6">
            {d.quality && <EntityProvenancePanel entityId={d.quality.entityId} />}
            {d.quality && (
              <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-faint">Authority</h2>
                <div className="mt-3"><ReviewBadge status={d.reviewStatus} /></div>
                <p className="mt-3 text-xs leading-relaxed text-faint">Classifications follow the Meteoritical Society. Unknown values are left blank. See{" "}<Link href="/transparency/source-quality" className="text-nebula underline-offset-4 hover:underline">source quality</Link>.</p>
              </section>
            )}
          </aside>
        </div>
      </Container>
    </>
  );
}
