import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbSchema,
  collectionPageSchema,
  howToSchema,
  softwareApplicationSchema,
  type Crumb,
} from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { ROUTES, contributePath } from "@/lib/routes";
import { CONTRIBUTE_SECTIONS, DASHBOARD_PAGES, contributionsEngine } from "@/platform/contributions";

const DESCRIPTION =
  "Contribute to Asteria Star: a controlled, review-first scientific contribution workflow. Every improvement becomes a structured, sourced proposal attached to real knowledge-graph objects — reviewed before any versioned change. Not public editing; not a social network.";

export const metadata: Metadata = buildMetadata({ title: "Contribute", description: DESCRIPTION, path: ROUTES.contribute });

const S = contributionsEngine.stats;

const ACCESS = [
  { href: "/api/v0/contribution-types", title: "Contribution types API", desc: `${S.types} typed models (read-only JSON).` },
  { href: "/api/v0/review-states", title: "Review states API", desc: `${S.states}-state review machine.` },
  { href: "/api/v0/contribution-guidelines", title: "Guidelines API", desc: "Machine-readable workflow guidelines." },
  { href: contributePath("templates"), title: "Proposal templates", desc: "Copyable templates — nothing submits." },
];

export default function ContributePage() {
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Contribute", url: ROUTES.contribute },
  ];

  const guides = CONTRIBUTE_SECTIONS.filter((s) => s.kind === "guide");
  const reference = CONTRIBUTE_SECTIONS.filter((s) => s.kind === "reference");

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          collectionPageSchema({ name: "Contribute", description: DESCRIPTION, url: ROUTES.contribute }),
          howToSchema({
            name: "How to contribute to Asteria Star",
            description: "The review-first lifecycle every contribution follows.",
            url: ROUTES.contribute,
            steps: [
              { name: "Propose", text: "Draft a structured proposal attached to a real knowledge-graph object, with a source." },
              { name: "Validate", text: "Automated checks confirm the target resolves and the domain and evidence are honest." },
              { name: "Editorial review", text: "An editor checks scope and policy and routes the proposal." },
              { name: "Scientific review", text: "Where a factual claim is made, a domain expert verifies accuracy and evidence." },
              { name: "Decision", text: "Accepted, rejected, or returned for changes — always with a recorded reason." },
              { name: "Versioned update", text: "Only an accepted proposal may become a versioned graph update." },
            ],
          }),
          softwareApplicationSchema({
            name: "Asteria Star Contributions API",
            description: "Read-only endpoints describing contribution types, review states, and guidelines.",
            url: "/api/v0/contribution-guidelines",
            category: "DeveloperApplication",
          }),
        ]}
      />
      <Container className="pt-8">
        <Breadcrumbs crumbs={crumbs} />
      </Container>
      <HeroSection
        compact
        accent="comet"
        eyebrow={<span>Scientific contributions &amp; review</span>}
        title="Contribute"
        lead="Help improve the platform's data, sources, citations, images, relationships, and translations. This is a controlled, review-first workflow — every contribution is a structured proposal, reviewed before it can change anything."
      >
        <p className="mt-6 text-sm text-faint">
          {S.types} contribution types · {S.states} review states · {S.roles} roles · {S.changeKinds} change kinds · {S.impactCategories} quality dimensions
        </p>
      </HeroSection>

      <Container className="mt-8 mb-12 space-y-12">
        <aside className="flex gap-3 rounded-xl border border-white/25 bg-white/[0.05] p-4">
          <span aria-hidden className="mt-0.5 text-faint">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><path d="M12 8h.01M11 11h1v5h1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
          <p className="text-sm leading-relaxed text-muted">
            <strong className="text-fg">Architecture preview.</strong> This is <em>not</em> public editing, a wiki, or a social network. The workflow, engine, and API are live; submissions, accounts, and persistence are <em>planned</em>. There are no contributors, reviews, or approval history to show — and none are fabricated. The knowledge graph stays the source of truth.
          </p>
        </aside>

        <section aria-labelledby="start-heading">
          <h2 id="start-heading" className="font-display text-2xl font-bold">Start here</h2>
          <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ACCESS.map((a) => (
              <li key={a.href}>
                <Link href={a.href} className="block h-full scientific-card p-5 transition hover:border-white/25 hover:bg-white/[0.04]">
                  <span className="font-display text-base font-semibold text-fg">{a.title}</span>
                  <p className="mt-1 text-sm text-muted">{a.desc}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {[["Guides", guides], ["Reference", reference], ["Dashboards (architecture preview)", DASHBOARD_PAGES]].map(([label, items]) => (
          <section key={label as string} aria-label={label as string}>
            <h2 className="font-display text-2xl font-bold">{label as string}</h2>
            <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(items as typeof guides).map((s) => (
                <li key={s.slug}>
                  <Link href={contributePath(s.slug)} className="block h-full scientific-card p-5 transition hover:border-white/25 hover:bg-white/[0.04]">
                    <span className="text-[0.65rem] uppercase tracking-wider text-faint">{s.eyebrow}</span>
                    <span className="mt-1 block font-display text-base font-semibold text-fg">{s.title}</span>
                    <p className="mt-1 text-sm text-muted">{s.description}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section aria-label="Related">
          <h2 className="font-display text-2xl font-bold">Related</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {[[ROUTES.authority, "Scientific Authority"], [ROUTES.data, "Open Data"], [ROUTES.registry, "Registry"], [ROUTES.developersApi, "API reference"], [ROUTES.transparency, "Transparency"]].map(([href, label]) => (
              <Link key={href} href={href} className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-sm text-muted transition hover:border-white/25 hover:text-fg">{label}</Link>
            ))}
          </div>
        </section>
      </Container>
    </>
  );
}
