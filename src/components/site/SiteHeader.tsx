import Link from "next/link";
import { Logo } from "@/components/site/Logo";
import { MobileNav } from "@/components/site/MobileNav";
import { PlatformNav } from "@/components/site/PlatformNav";
import { getNavGroups } from "@/lib/navigation";
import { ROUTES } from "@/lib/routes";

/**
 * Sticky, translucent platform header. Desktop shows the grouped mega-menu
 * (PlatformNav) and a search affordance; small screens collapse into the
 * grouped MobileNav. Rendered once in the root layout.
 */
export function SiteHeader() {
  const groups = getNavGroups();

  return (
    <header className="sticky top-0 z-50 border-b border-silver/12 bg-bg/82 backdrop-blur-xl">
      <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Logo />

        <PlatformNav groups={groups} />

        <div className="flex items-center gap-1">
          <Link
            href={ROUTES.search}
            aria-label="Search the knowledge graph"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-muted transition hover:bg-white/5 hover:text-fg"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </Link>
          <MobileNav groups={groups} />
        </div>
      </div>
    </header>
  );
}
