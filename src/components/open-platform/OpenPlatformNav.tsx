import Link from "next/link";
import { ROUTES } from "@/lib/routes";

const TABS: { slug: string; label: string; href: string }[] = [
  { slug: "", label: "Overview", href: ROUTES.openPlatform },
  { slug: "api", label: "API", href: `${ROUTES.openPlatform}/api` },
  { slug: "graph", label: "Graph", href: `${ROUTES.openPlatform}/graph` },
  { slug: "datasets", label: "Datasets", href: `${ROUTES.openPlatform}/datasets` },
  { slug: "downloads", label: "Downloads", href: `${ROUTES.openPlatform}/downloads` },
  { slug: "licenses", label: "Licenses", href: `${ROUTES.openPlatform}/licenses` },
  { slug: "sdk", label: "SDKs", href: `${ROUTES.openPlatform}/sdk` },
  { slug: "federation", label: "Federation", href: `${ROUTES.openPlatform}/federation` },
  { slug: "roadmap", label: "Roadmap", href: `${ROUTES.openPlatform}/roadmap` },
];

/** Section nav across the Open Platform pages (Program BX). The active tab is highlighted. */
export function OpenPlatformNav({ active }: { active: string }) {
  return (
    <nav aria-label="Open platform sections" className="mb-8 flex flex-wrap gap-1.5 border-b border-white/10 pb-3">
      {TABS.map((t) => {
        const on = t.slug === active;
        return (
          <Link key={t.slug || "overview"} href={t.href} aria-current={on ? "page" : undefined} className={`rounded-lg px-3 py-1.5 text-sm ${on ? "bg-nasa/15 text-nasa" : "text-muted hover:bg-white/5 hover:text-fg"}`}>
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
