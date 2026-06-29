import Link from "next/link";
import { Logo } from "@/components/site/Logo";
import { MobileNav } from "@/components/site/MobileNav";
import { getAllSections } from "@/lib/content/registry";
import { sectionPath, ROUTES } from "@/lib/routes";

/**
 * Sticky, translucent site header. Desktop shows Explore + the seven hubs and a
 * search affordance; small screens collapse into the MobileNav. Rendered once
 * in the root layout.
 */
export function SiteHeader() {
  const navLinks = [
    { name: "Explore", href: ROUTES.explore },
    ...getAllSections().map((s) => ({ name: s.name, href: sectionPath(s) })),
  ];
  const utility = [
    { name: "Entity Index", href: ROUTES.entityIndex },
    { name: "About", href: ROUTES.about },
    { name: "Editorial Policy", href: ROUTES.editorialPolicy },
    { name: "Sources", href: ROUTES.sourcesPolicy },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-bg/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Logo />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-0.5">
            {navLinks.map((link, i) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-white/5 hover:text-fg ${
                    i === 0 ? "text-fg" : "text-muted"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href={ROUTES.entityIndex}
            aria-label="Search the knowledge graph"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-muted transition hover:bg-white/5 hover:text-fg"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </Link>
          <MobileNav sections={navLinks} utility={utility} />
        </div>
      </div>
    </header>
  );
}
