import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { EntryMetaBadges } from "@/components/entry/EntryMetaBadges";
import { accentVars } from "@/lib/theme";
import type { AccentToken } from "@/lib/content/types";
import type { Entry } from "@/lib/content/entry-types";

/** Hero header for an entry page: context eyebrow, title, summary, and badges. */
export function EntryHeader({
  entry,
  accent,
  sectionName,
  categoryName,
  categoryHref,
}: {
  entry: Entry;
  accent: AccentToken;
  sectionName: string;
  categoryName: string;
  categoryHref: string;
}) {
  return (
    <section style={accentVars(accent)} className="pt-10 pb-2">
      <Container>
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-faint">
          {sectionName} ·{" "}
          <Link href={categoryHref} className="text-[var(--accent)] transition hover:text-fg">
            {categoryName}
          </Link>
        </p>
        <h1 className="max-w-4xl font-display text-3xl font-bold sm:text-5xl">
          {entry.title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
          {entry.heroSummary}
        </p>
        <div className="mt-5">
          <EntryMetaBadges kind={entry.kind} difficulty={entry.difficulty} />
        </div>
      </Container>
    </section>
  );
}
