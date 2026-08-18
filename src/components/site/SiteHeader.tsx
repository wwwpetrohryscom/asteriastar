import { Logo } from "@/components/site/Logo";
import { MobileNav } from "@/components/site/MobileNav";
import { PlatformNav } from "@/components/site/PlatformNav";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { getNavGroups } from "@/lib/navigation";

/**
 * Sticky, translucent platform header. Desktop shows the grouped mega-menu
 * (PlatformNav) and the global search trigger; small screens collapse into the
 * grouped MobileNav with search still reachable. Rendered once in the root
 * layout, so search is available from every page without navigating to one.
 */
export function SiteHeader() {
  const groups = getNavGroups();

  return (
    <header className="sticky top-0 z-50 border-b border-silver/12 bg-bg/82 backdrop-blur-xl">
      <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Logo />

        <PlatformNav groups={groups} />

        <div className="flex items-center gap-1">
          <GlobalSearch />
          <MobileNav groups={groups} />
        </div>
      </div>
    </header>
  );
}
