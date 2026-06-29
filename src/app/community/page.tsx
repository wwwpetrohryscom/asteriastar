import type { Metadata } from "next";
import Link from "next/link";
import { CommunityLanding } from "@/components/community/CommunityLanding";
import { KnowledgeFeed } from "@/components/community/KnowledgeFeed";
import { IDENTITY_TYPES, IDENTITY_TYPE_LABELS } from "@/lib/community";
import { buildMetadata } from "@/lib/seo/metadata";
import type { Crumb } from "@/lib/seo/jsonld";
import { ROUTES } from "@/lib/routes";

const DESCRIPTION =
  "The future Asteria Star community — a knowledge-first scientific platform where contributors enrich the knowledge graph. Architecture preview: no accounts or data yet.";

export const metadata: Metadata = buildMetadata({
  title: "Community",
  description: DESCRIPTION,
  path: ROUTES.community,
});

const SECTIONS = [
  { title: "Observations", href: "/community/observations", desc: "Log what you see — every observation references a graph entity." },
  { title: "Astrophotography", href: "/community/astrophotography", desc: "Share images with full provenance, linked to the objects depicted." },
  { title: "Collections", href: "/community/collections", desc: "Curate entities into collections — references, never copies." },
  { title: "Contributors", href: "/community/contributors", desc: "Identities and a reputation model built on scientific quality." },
  { title: "Learn Together", href: "/community/learning", desc: "Shared learning paths through the universe." },
  { title: "Explore Together", href: "/community/explore-together", desc: "Find people around the objects and topics you study." },
];

const PHILOSOPHY = [
  { title: "Knowledge first", description: "Every feature must strengthen the knowledge platform. The graph is the source of truth." },
  { title: "Community second", description: "People are contributors. User content attaches to graph entities — never the reverse." },
  { title: "Algorithms last", description: "No addictive feed, no engagement-for-its-own-sake, no follower or reaction counts." },
];

export default function CommunityPage() {
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Community", url: ROUTES.community },
  ];

  return (
    <CommunityLanding
      title="Community"
      lead="A premium, knowledge-first community where people collaborate around the science of everything above Earth — and every contribution enriches the knowledge graph."
      path={ROUTES.community}
      description={DESCRIPTION}
      crumbs={crumbs}
    >
      <section aria-labelledby="philosophy-heading">
        <h2 id="philosophy-heading" className="font-display text-2xl font-bold">Our philosophy</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {PHILOSOPHY.map((p, i) => (
            <div key={p.title} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <p className="font-display text-3xl font-bold text-faint/40">{i + 1}</p>
              <h3 className="mt-2 font-display text-lg font-semibold text-fg">{p.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{p.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="ecosystem-heading">
        <h2 id="ecosystem-heading" className="font-display text-2xl font-bold">Explore the ecosystem</h2>
        <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SECTIONS.map((s) => (
            <li key={s.href}>
              <Link
                href={s.href}
                className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.04]"
              >
                <h3 className="font-display text-lg font-semibold text-fg group-hover:text-comet">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.desc}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="identity-heading">
        <h2 id="identity-heading" className="font-display text-2xl font-bold">Built for every kind of contributor</h2>
        <p className="mt-2 max-w-2xl text-muted">
          The identity architecture is designed to support — and later verify —
          a full range of scientific and educational identities.
        </p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {IDENTITY_TYPES.map((t) => (
            <li key={t} className="rounded-full border border-white/12 bg-white/[0.02] px-3.5 py-1.5 text-sm text-muted">
              {IDENTITY_TYPE_LABELS[t]}
            </li>
          ))}
        </ul>
      </section>

      <KnowledgeFeed />
    </CommunityLanding>
  );
}
