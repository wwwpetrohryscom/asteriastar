import type { Metadata } from "next";
import Link from "next/link";
import { CommunityLanding } from "@/components/community/CommunityLanding";
import { LEARNING_PATHS } from "@/lib/learn";
import { buildMetadata } from "@/lib/seo/metadata";
import type { Crumb } from "@/lib/seo/jsonld";
import { ROUTES, learnPath } from "@/lib/routes";

const PATH = "/community/learning";
const DESCRIPTION =
  "Learn together — shared learning paths through the universe, designed to support future cohorts, educators, and study groups built on the knowledge graph.";

export const metadata: Metadata = buildMetadata({ title: "Learn Together", description: DESCRIPTION, path: PATH });

export default function LearningTogetherPage() {
  const crumbs: Crumb[] = [
    { name: "Home", url: "/" },
    { name: "Community", url: ROUTES.community },
    { name: "Learn Together", url: PATH },
  ];
  return (
    <CommunityLanding
      title="Learn Together"
      lead="Learning is better shared. The community layer is designed for educators, students, and study groups to follow structured paths through the universe together."
      path={PATH}
      description={DESCRIPTION}
      crumbs={crumbs}
    >
      <section aria-labelledby="start-heading">
        <h2 id="start-heading" className="font-display text-2xl font-bold">Start with a path</h2>
        <p className="mt-2 max-w-2xl text-muted">
          The learning paths below are live today. Future community features —
          cohorts, educator tools, and shared progress — will build on them,
          keyed to stable path and entity ids.
        </p>
        <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {LEARNING_PATHS.map((p) => (
            <li key={p.slug}>
              <Link
                href={learnPath(p.slug)}
                className="group flex h-full flex-col scientific-card p-5 transition hover:border-white/25 hover:bg-white/[0.04]"
              >
                <span className="font-display text-base font-semibold text-fg group-hover:text-muted">{p.title}</span>
                <span className="mt-1 text-sm text-muted">{p.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </CommunityLanding>
  );
}
