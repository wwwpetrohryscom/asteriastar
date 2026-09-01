"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { NavItem } from "@/components/site/NavItem";
import { usePathname } from "next/navigation";
import type { NavGroup, NavLink } from "@/lib/navigation";

/**
 * Hamburger menu for small screens. Groups mirror the desktop mega-menu.
 *
 * The panel is PORTALLED to document.body, and it has to be. It is `position: fixed`, but the header
 * it lives in sets `backdrop-blur-xl` — and a `backdrop-filter` makes an element the containing block
 * for its fixed-position descendants. The panel was therefore being positioned and sized against the
 * header rather than the viewport: measured on production it opened 49px tall, showing one word
 * before the page content resumed underneath it. Every link below that was in the DOM, scrollable in
 * principle, and unreachable in practice.
 *
 * A portal moves it out of that containing block without touching the header's blur, which is a
 * deliberate part of the design. This was a pre-existing defect, found while checking that the
 * Journal was reachable on mobile.
 */
export function MobileNav({ groups }: { groups: NavGroup[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [openedAt, setOpenedAt] = useState(pathname);

  // Close the menu whenever the route changes (including back/forward).
  if (pathname !== openedAt) {
    setOpenedAt(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-fg transition hover:border-white/25 hover:bg-white/5"
      >
        <span className="relative block h-4 w-5">
          <span className={`absolute left-0 block h-0.5 w-5 bg-current transition-all duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
          <span className={`absolute left-0 top-1.5 block h-0.5 w-5 bg-current transition-all duration-300 ${open ? "opacity-0" : "opacity-100"}`} />
          <span className={`absolute left-0 block h-0.5 w-5 bg-current transition-all duration-300 ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
        </span>
      </button>

      {open &&
        createPortal(
          <div
            id="mobile-menu"
            className="fixed inset-x-0 bottom-0 z-40 overflow-y-auto border-t border-white/10 bg-bg/95 px-5 py-6 backdrop-blur-xl [top:calc(var(--ecosystem-bar-height)+var(--site-header-height))]"
          >
          <nav aria-label="Primary" className="flex flex-col gap-6">
            {/*
              Direct destinations first.

              The mobile menu renders every group in order, and the first of them — Explore — is
              roughly eighty links long. A Journal entry left in source order landed 74th of 118: in
              the menu, technically, and past the point anyone scrolls. Groups that ARE a destination
              are pulled to the top instead, where a single tap reaches them.
            */}
            {groups.some((g) => g.href) && (
              <ul className="flex flex-col border-b border-white/10 pb-4">
                {groups
                  .filter((group) => group.href)
                  .map((group) => (
                    <li key={group.id}>
                      <NavItem
                        href={group.href!}
                        external={group.external}
                        className="block rounded-lg px-3 py-2.5 text-base font-semibold text-fg transition hover:bg-white/5"
                      >
                        {group.label}
                      </NavItem>
                    </li>
                  ))}
              </ul>
            )}

            {groups.map((group) => {
              // Already rendered in the block above, and not as a heading with one link of its own
              // name beneath it — that read like a category containing itself.
              if (group.href) return null;
              const links: NavLink[] = group.columns?.flatMap((c) => c.links) ?? [];
              return (
                <div key={group.id}>
                  <p className="px-3 pb-1.5 text-xs font-medium uppercase tracking-[0.14em] text-faint">{group.label}</p>
                  <ul className="flex flex-col">
                    {links.map((link) => (
                      <li key={link.href}>
                        <NavItem href={link.href} external={link.external} className="block rounded-lg px-3 py-2.5 text-base font-medium text-fg transition hover:bg-white/5">
                          {link.name}
                        </NavItem>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </nav>
          </div>,
          document.body,
        )}
    </div>
  );
}
