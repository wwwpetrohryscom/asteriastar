"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavGroup } from "@/lib/navigation";

/** Hamburger menu for small screens. Groups mirror the desktop mega-menu. */
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

      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto border-t border-white/10 bg-bg/95 px-5 py-6 backdrop-blur-xl"
        >
          <nav aria-label="Primary" className="flex flex-col gap-6">
            {groups.map((group) => {
              const links = group.href
                ? [{ name: group.label, href: group.href }]
                : group.columns?.flatMap((c) => c.links) ?? [];
              return (
                <div key={group.id}>
                  <p className="px-3 pb-1.5 text-xs font-medium uppercase tracking-[0.14em] text-faint">{group.label}</p>
                  <ul className="flex flex-col">
                    {links.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className="block rounded-lg px-3 py-2.5 text-base font-medium text-fg transition hover:bg-white/5">
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}
