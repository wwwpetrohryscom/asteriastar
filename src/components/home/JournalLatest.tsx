import { NavItem } from "@/components/site/NavItem";
import { Container } from "@/components/ui/Container";
import { JOURNAL } from "@/lib/journal/config";
import { getLatestJournalArticles } from "@/lib/journal/latest";

/**
 * The homepage's acknowledgement that AsteriaStar publishes a Journal.
 *
 * A Server Component: the article rows are in the delivered HTML, so a reader with no JavaScript and
 * a crawler with no patience both see them. The data comes from the Journal's own feed at request
 * time rather than at build time, which is what keeps publishing an article from rebuilding this
 * application.
 *
 * It degrades in one step rather than disappearing. If the feed is unavailable — the Journal
 * deploying, a timeout, anything — `getLatestJournalArticles` returns an empty list and this renders
 * the heading and the link to the publication without rows. The reader still learns the Journal
 * exists and can still reach it; only the previews are missing. There is no failure state that
 * removes the Journal from the homepage, and none that can fail the page.
 *
 * No badge, no ticker, no "new". The section is here because the Journal is part of the site, not
 * because it is being advertised.
 */
export async function JournalLatest() {
  const articles = await getLatestJournalArticles();

  return (
    <Container className="mt-20">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.16em] text-faint">From the Journal</p>
          <h2 className="mt-1 font-display text-2xl font-bold text-fg sm:text-3xl">{JOURNAL.name}</h2>
          <p className="mt-2 max-w-2xl text-muted">
            Astronomy and space-science reporting held to the same sourcing standard as the platform&rsquo;s data —
            every claim traceable to where it came from.
          </p>
        </div>
        <NavItem
          href={JOURNAL.basePath}
          external
          className="hidden shrink-0 text-sm text-muted transition hover:text-fg sm:block"
        >
          All articles →
        </NavItem>
      </div>

      {articles.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.slice(0, 3).map((article) => (
            <li key={article.id}>
              <NavItem
                href={article.href}
                external
                className="flex h-full flex-col rounded-lg border border-silver/12 bg-bg-elevated/72 p-5 transition hover:-translate-y-0.5 hover:border-nasa/50 hover:bg-surface/82"
              >
                <span className="flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.12em] text-faint">
                  {article.sectionTitle && <span className="text-nasa">{article.sectionTitle}</span>}
                  <time dateTime={article.publishedAt}>{article.publishedLabel}</time>
                </span>
                <span className="mt-2 font-display text-lg font-semibold leading-snug text-fg">{article.title}</span>
                {article.description && (
                  <span className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{article.description}</span>
                )}
              </NavItem>
            </li>
          ))}
        </ul>
      )}

      {/* The desktop link sits beside the heading; on small screens it belongs after the rows. */}
      <NavItem
        href={JOURNAL.basePath}
        external
        className="mt-6 inline-block text-sm text-muted transition hover:text-fg sm:hidden"
      >
        All articles →
      </NavItem>
    </Container>
  );
}
