import { NavItem } from "@/components/site/NavItem";
import { JOURNAL } from "@/lib/journal/config";
import { getRelatedJournalArticles } from "@/lib/journal/related";

/**
 * Journal articles written about the page this renders on.
 *
 * Drop it into any page and give it that page's path:
 *
 *   <JournalRelated path="/exoplanets" />
 *
 * It renders nothing at all unless an editor has explicitly pointed an article at that path — no
 * empty heading, no "no articles yet", no box. The match is exact and declared, so what appears here
 * is always something a person decided was related, never something a similarity score guessed.
 *
 * Adding this to a page makes that page revalidate on the Journal index's schedule
 * (JOURNAL_RELATED_REVALIDATE_SECONDS), which is how a newly published article reaches it without
 * this project rebuilding. If the Journal is unreachable the list is empty and the section is
 * absent — the host page is unaffected either way.
 */
export async function JournalRelated({ path }: { path: string }) {
  const articles = await getRelatedJournalArticles(path);
  if (articles.length === 0) return null;

  return (
    <section aria-labelledby="journal-related" className="mt-16 rounded-lg border border-silver/12 bg-bg-elevated/60 p-6 sm:p-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.16em] text-faint">From the Journal</p>
          <h2 id="journal-related" className="mt-1 font-display text-xl font-bold text-fg">
            Reporting on this subject
          </h2>
        </div>
        <NavItem href={JOURNAL.basePath} external className="hidden shrink-0 text-sm text-muted transition hover:text-fg sm:block">
          {JOURNAL.name} →
        </NavItem>
      </div>

      <ul className="mt-5 flex flex-col divide-y divide-white/8 border-t border-white/8">
        {articles.map((article) => (
          <li key={article.id}>
            <NavItem href={article.href} external className="group block py-4 transition">
              <span className="flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.12em] text-faint">
                {article.sectionTitle && <span className="text-nasa">{article.sectionTitle}</span>}
                <time dateTime={article.publishedAt}>{article.publishedLabel}</time>
              </span>
              <span className="mt-1 block font-display text-base font-semibold text-fg transition group-hover:text-nasa">
                {article.title}
              </span>
              {article.description && <span className="mt-1 block text-sm leading-relaxed text-muted">{article.description}</span>}
            </NavItem>
          </li>
        ))}
      </ul>
    </section>
  );
}
