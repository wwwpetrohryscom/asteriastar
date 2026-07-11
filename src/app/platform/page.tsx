import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { EngineShowcase } from "@/components/platform/EngineShowcase";
import {
  LAYERS,
  REGISTRIES,
  REGISTRY_STATS,
  EXTENSION_POINTS,
  EXTENSION_STATS,
  LOCALES,
  LOCALIZATION_STATS,
  SEARCH_PROVIDERS,
  COMPONENT_STATS,
  resolveEntity,
} from "@/platform";
import { getEntityById, getConnections, GRAPH_VERSION_INFO } from "@/knowledge-graph";
import { DATASETS } from "@/lib/datasets";
import { LEARNING_PATHS } from "@/lib/learn";
import { TIMELINES } from "@/lib/timelines";
import { COMPARISONS } from "@/lib/compare";
import {
  KnowledgeCard,
  DatasetCard,
  MissionCard,
  AstronomerCard,
  LearningCard,
  TimelineCard,
  ComparisonCard,
  RelationshipCard,
  ExplorerCard,
  GalleryCard,
  ObservationCard,
} from "@/components/platform/cards";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/seo/jsonld";
import { ROUTES } from "@/lib/routes";

const DESCRIPTION =
  "Asteria Platform Core — the layered, registry-driven knowledge platform behind the website. The knowledge graph is the operating core; every interface is a client.";

export const metadata: Metadata = buildMetadata({ title: "Platform", description: DESCRIPTION, path: ROUTES.platform });

export default function PlatformPage() {
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Platform", url: ROUTES.platform },
  ];
  const v = GRAPH_VERSION_INFO;

  // Live runtime example — assembled from every subsystem through one call.
  const sample = resolveEntity("planet:mars") ?? resolveEntity("galaxy:andromeda-galaxy");

  // Real data for the card showcase (existence-guarded).
  const showcaseEntity = getEntityById("galaxy:andromeda-galaxy") ?? getEntityById("planet:jupiter");
  const mission = getEntityById("space_mission:apollo-11") ?? getEntityById("space_mission:voyager-1");
  const astronomer = getEntityById("astronomer:galileo-galilei") ?? getEntityById("astronomer:edwin-hubble");
  const sampleConnection = showcaseEntity ? getConnections(showcaseEntity.id)[0] : undefined;
  const dataset = DATASETS.find((d) => d.slug === "stars") ?? DATASETS[0];

  const futureClients = [
    "Website", "Mobile App", "Desktop App", "Developer Portal", "Public API",
    "AI Applications", "Planetarium Integrations", "Educational Systems", "Future Community",
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          collectionPageSchema({ name: "Platform", description: DESCRIPTION, url: ROUTES.platform }),
        ]}
      />
      <Container className="pt-8">
        <Breadcrumbs crumbs={crumbs} />
      </Container>
      <HeroSection
        accent="halo"
        eyebrow={<span>Asteria Platform Core</span>}
        title="The platform behind the website"
        lead="The knowledge graph is the operating core. Everything references entities; nothing references pages. The website is one client — and so are the mobile app, desktop app, public API, and AI systems to come."
      >
        <p className="mt-6 text-sm text-faint">
          {v.entityCount} entities · {v.relationCount} relations · {REGISTRY_STATS.registries} registries · {LAYERS.length} layers · graph v{v.graphVersion} · schema v{v.schemaVersion}
        </p>
      </HeroSection>

      <Container className="mt-10 mb-14 space-y-14">
        {/* Clients */}
        <section aria-labelledby="clients-heading">
          <h2 id="clients-heading" className="font-display text-2xl font-bold">One core, many clients</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {futureClients.map((c) => (
              <li key={c} className="rounded-full border border-white/10 bg-white/[0.02] px-3.5 py-1.5 text-sm text-muted">{c}</li>
            ))}
          </ul>
        </section>

        {/* Layers */}
        <section aria-labelledby="layers-heading">
          <h2 id="layers-heading" className="font-display text-2xl font-bold">Architecture layers</h2>
          <p className="mt-2 max-w-2xl text-muted">Seven independent layers with an acyclic dependency contract. The Graph layer is the core; it never depends on a layer above it.</p>
          <ol className="mt-5 space-y-2">
            {LAYERS.map((layer) => (
              <li key={layer.id} className="flex flex-col gap-2 scientific-card p-4 sm:flex-row sm:items-baseline sm:gap-5">
                <div className="flex w-44 shrink-0 items-baseline gap-2">
                  <span className="font-mono text-xs text-faint">{layer.level}</span>
                  <span className="font-display font-semibold text-fg">{layer.name}</span>
                </div>
                <p className="flex-1 text-sm leading-relaxed text-muted">{layer.role}</p>
                <code className="shrink-0 text-xs text-faint">{layer.owns.join(", ")}</code>
              </li>
            ))}
          </ol>
        </section>

        {/* Universal registry */}
        <section aria-labelledby="registry-heading">
          <h2 id="registry-heading" className="font-display text-2xl font-bold">Universal registry</h2>
          <p className="mt-2 max-w-2xl text-muted">Nothing exists outside a registry. Every collection registers with a typed descriptor and a live count.</p>
          <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/[0.03] text-faint">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Registry</th>
                  <th className="hidden px-4 py-2.5 font-medium sm:table-cell">Layer</th>
                  <th className="px-4 py-2.5 text-right font-medium">Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {REGISTRIES.map((r) => (
                  <tr key={r.id} className="transition hover:bg-white/[0.02]">
                    <td className="px-4 py-2.5">
                      {r.href ? (
                        <Link href={r.href} className="font-medium text-fg transition hover:text-nasa">{r.name}</Link>
                      ) : (
                        <span className="font-medium text-fg">{r.name}</span>
                      )}
                      <span className="block text-xs text-faint">{r.description}</span>
                    </td>
                    <td className="hidden px-4 py-2.5 text-muted sm:table-cell">{r.layer}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-muted">{r.count.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Entity runtime */}
        <section aria-labelledby="runtime-heading">
          <h2 id="runtime-heading" className="font-display text-2xl font-bold">Entity runtime</h2>
          <p className="mt-2 max-w-2xl text-muted">One call — <code>resolveEntity(id)</code> — assembles everything about an entity from every subsystem, so every client sees the same reality.</p>
          {sample && (
            <div className="mt-5 scientific-card p-5">
              <p className="text-sm text-faint">Example: <code className="text-fg">{sample.id}</code></p>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {[
                  { label: "Relations", value: sample.relationCount },
                  { label: "Sources", value: sample.sources.length },
                  { label: "Datasets", value: sample.datasets.length },
                  { label: "Topics", value: sample.topics.length },
                  { label: "Recommended", value: sample.recommendations.length },
                  { label: "Entries", value: sample.entries.length },
                ].map((s) => (
                  <div key={s.label} className="scientific-card p-3 text-center">
                    <div className="font-display text-2xl font-bold text-fg">{s.value}</div>
                    <div className="text-xs text-faint">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Scientific Data Engine */}
        <EngineShowcase />

        {/* Components */}
        <section aria-labelledby="components-heading">
          <h2 id="components-heading" className="font-display text-2xl font-bold">Platform components</h2>
          <p className="mt-2 max-w-2xl text-muted">{COMPONENT_STATS.cards} reusable card types over a shared surface — composed identically by every client. Live examples:</p>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {showcaseEntity && <KnowledgeCard entity={showcaseEntity} relationCount={getConnections(showcaseEntity.id).length} />}
            {dataset && <DatasetCard dataset={dataset} />}
            {mission && <MissionCard entity={mission} />}
            {astronomer && <AstronomerCard entity={astronomer} />}
            {LEARNING_PATHS[0] && <LearningCard path={LEARNING_PATHS[0]} />}
            {TIMELINES[0] && <TimelineCard timeline={TIMELINES[0]} />}
            {COMPARISONS[0] && <ComparisonCard comparison={COMPARISONS[0]} />}
            {sampleConnection && <RelationshipCard connection={sampleConnection} />}
            <ExplorerCard title="Knowledge Explorer" description="Browse topics, entities, and connections across the graph." href={ROUTES.explore} />
            {showcaseEntity && <GalleryCard entity={showcaseEntity} />}
            <ObservationCard title="Visual observation" target="M31 — Andromeda Galaxy" />
          </div>
        </section>

        {/* Extensions + Localization + Search */}
        <section aria-labelledby="extend-heading" className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 id="extend-heading" className="font-display text-2xl font-bold">Extension points</h2>
            <p className="mt-2 text-muted">New capabilities register without changing the core ({EXTENSION_STATS.registered} registered).</p>
            <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {EXTENSION_POINTS.map((p) => (
                <li key={p.point} className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
                  <span className="text-sm font-medium text-fg">{p.name}</span>
                  <span className="block text-xs text-faint">{p.description}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold">Localization</h2>
            <p className="mt-2 text-muted">{LOCALIZATION_STATS.locales} languages prepared; identifiers are never localized.</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {LOCALES.map((l) => (
                <li key={l.code} className={`rounded-full border px-3 py-1.5 text-sm ${l.status === "active" ? "border-white/40 text-fg" : "border-white/10 text-faint"}`}>
                  {l.nativeName}
                  {l.status === "planned" && <span className="ml-1 text-[0.65rem] uppercase tracking-wider">soon</span>}
                </li>
              ))}
            </ul>
            <h3 className="mt-6 font-display text-lg font-semibold text-fg">Search providers</h3>
            <p className="mt-1 text-sm text-muted">{SEARCH_PROVIDERS.length} providers, every result tracing to a graph entity.</p>
          </div>
        </section>

        {/* CTA */}
        <section className="scientific-card p-6">
          <h2 className="font-display text-xl font-bold">Build on the platform</h2>
          <p className="mt-1.5 max-w-2xl text-muted">The graph is open and machine-readable. Explore the datasets, registries, and API contracts.</p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <Link href={ROUTES.developers} className="rounded-xl border border-white/15 px-4 py-2 font-medium text-fg transition hover:border-white/30 hover:bg-white/5">Developers</Link>
            <Link href={ROUTES.datasets} className="rounded-xl border border-white/15 px-4 py-2 font-medium text-fg transition hover:border-white/30 hover:bg-white/5">Datasets</Link>
            <Link href={ROUTES.registry} className="rounded-xl border border-white/15 px-4 py-2 font-medium text-fg transition hover:border-white/30 hover:bg-white/5">Registry</Link>
            <Link href={ROUTES.openData} className="rounded-xl border border-white/15 px-4 py-2 font-medium text-fg transition hover:border-white/30 hover:bg-white/5">Open Data</Link>
          </div>
        </section>
      </Container>
    </>
  );
}
