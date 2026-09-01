import Link from "next/link";
import type { ReactNode } from "react";

/**
 * A navigation destination that may or may not belong to this application.
 *
 * `/blog` is served by a separate Netlify project through a proxy rewrite. It is same-origin, so it
 * looks like an internal path and should — but it is not in this application's route manifest, and
 * `next/link` would attempt a client-side transition to a route that does not exist here. A plain
 * anchor produces a real navigation, which is what crossing between two applications actually is.
 *
 * Everything else keeps `next/link` and its prefetching.
 */
export function NavItem({
  href,
  external,
  className,
  children,
}: {
  href: string;
  external?: boolean;
  className?: string;
  children: ReactNode;
}) {
  if (external) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
