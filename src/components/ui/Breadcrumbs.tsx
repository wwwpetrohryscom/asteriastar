import Link from "next/link";
import type { Crumb } from "@/lib/seo/jsonld";

/**
 * Visual breadcrumb trail. The matching BreadcrumbList JSON-LD is emitted from
 * the page using the same `crumbs` array, so the two never disagree.
 */
export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-faint">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={crumb.url} className="flex items-center gap-1.5">
              {isLast ? (
                <span aria-current="page" className="text-muted">
                  {crumb.name}
                </span>
              ) : (
                <Link href={crumb.url} className="transition hover:text-nasa">
                  {crumb.name}
                </Link>
              )}
              {!isLast && (
                <span aria-hidden className="text-faint/50">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
