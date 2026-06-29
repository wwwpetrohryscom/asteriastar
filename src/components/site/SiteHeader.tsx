import Link from "next/link";
import { Logo } from "@/components/site/Logo";
import { MobileNav } from "@/components/site/MobileNav";
import { getAllSections } from "@/lib/content/registry";
import { sectionPath } from "@/lib/routes";
import { ROUTES } from "@/lib/routes";

/**
 * Sticky, translucent site header. Desktop shows the seven hubs; small screens
 * collapse into the MobileNav. Rendered once in the root layout.
 */
export function SiteHeader() {
  const sections = getAllSections().map((s) => ({
    name: s.name,
    href: sectionPath(s),
  }));
  const utility = [
    { name: "About", href: ROUTES.about },
    { name: "Editorial Policy", href: ROUTES.editorialPolicy },
    { name: "Sources", href: ROUTES.sourcesPolicy },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-bg/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Logo />

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-0.5">
            {sections.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition hover:bg-white/5 hover:text-fg"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <MobileNav sections={sections} utility={utility} />
      </div>
    </header>
  );
}
