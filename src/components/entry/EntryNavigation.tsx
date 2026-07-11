import Link from "next/link";
import type { Entry } from "@/lib/content/entry-types";

/**
 * Bottom-of-page navigation: previous / next entry within the same category,
 * plus a back-link to the category. Improves crawl depth and reader flow.
 */
export function EntryNavigation({
  previous,
  next,
  categoryName,
  categoryHref,
}: {
  previous?: Entry;
  next?: Entry;
  categoryName: string;
  categoryHref: string;
}) {
  return (
    <nav
      aria-label="Entry navigation"
      className="mt-4 border-t border-white/10 pt-6"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:justify-between">
        {previous ? (
          <Link
            href={previous.path}
            className="group flex-1 scientific-card p-4 transition hover:border-white/25 hover:bg-white/[0.04]"
          >
            <span className="text-xs text-faint">← Previous</span>
            <span className="mt-1 block font-medium text-fg group-hover:text-nasa">
              {previous.title}
            </span>
          </Link>
        ) : (
          <span className="hidden flex-1 sm:block" />
        )}

        {next ? (
          <Link
            href={next.path}
            className="group flex-1 scientific-card p-4 text-right transition hover:border-white/25 hover:bg-white/[0.04]"
          >
            <span className="text-xs text-faint">Next →</span>
            <span className="mt-1 block font-medium text-fg group-hover:text-nasa">
              {next.title}
            </span>
          </Link>
        ) : (
          <span className="hidden flex-1 sm:block" />
        )}
      </div>

      <div className="mt-4 text-center">
        <Link
          href={categoryHref}
          className="text-sm text-muted underline-offset-4 transition hover:text-fg hover:underline"
        >
          ← Back to {categoryName}
        </Link>
      </div>
    </nav>
  );
}
