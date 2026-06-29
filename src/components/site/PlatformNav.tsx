"use client";

import { useState } from "react";
import Link from "next/link";
import type { NavGroup } from "@/lib/navigation";

/**
 * Premium grouped mega-menu (desktop). A small number of group triggers each
 * reveal a multi-column panel. Accessible disclosure: triggers are real buttons
 * with aria-expanded; the panel opens on hover, click, or keyboard focus and
 * closes on Escape, blur-out, or mouse-leave. The header stays uncluttered;
 * depth lives in the panels.
 */
export function PlatformNav({ groups }: { groups: NavGroup[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <nav
      aria-label="Primary"
      className="hidden lg:block"
      onMouseLeave={() => setOpenId(null)}
    >
      <ul className="flex items-center gap-0.5">
        {groups.map((group) =>
          group.href ? (
            <li key={group.id}>
              <Link
                href={group.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition hover:bg-white/5 hover:text-fg"
              >
                {group.label}
              </Link>
            </li>
          ) : (
            <li
              key={group.id}
              className="relative"
              onMouseEnter={() => setOpenId(group.id)}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                  setOpenId((v) => (v === group.id ? null : v));
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") setOpenId(null);
              }}
            >
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded={openId === group.id}
                onClick={() => setOpenId((v) => (v === group.id ? null : group.id))}
                onFocus={() => setOpenId(group.id)}
                className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted transition hover:bg-white/5 hover:text-fg aria-expanded:bg-white/5 aria-expanded:text-fg"
              >
                {group.label}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                  className={`mt-0.5 opacity-60 transition ${openId === group.id ? "rotate-180" : ""}`}
                >
                  <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div
                className={`absolute left-0 top-full z-50 pt-2 transition duration-150 ${
                  openId === group.id ? "visible opacity-100" : "invisible opacity-0"
                }`}
              >
                <div className="flex gap-8 rounded-2xl border border-white/10 bg-bg-elevated/95 p-5 shadow-2xl shadow-black/40 backdrop-blur-xl">
                  {group.columns?.map((col) => (
                    <div key={col.title} className="min-w-44">
                      <p className="px-2 pb-2 text-[0.7rem] font-medium uppercase tracking-[0.14em] text-faint">{col.title}</p>
                      <ul className="space-y-0.5">
                        {col.links.map((link) => (
                          <li key={link.href}>
                            <Link href={link.href} className="block rounded-lg px-2 py-1.5 transition hover:bg-white/5">
                              <span className="block text-sm font-medium text-fg">{link.name}</span>
                              {link.description && <span className="block text-xs text-faint">{link.description}</span>}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </li>
          ),
        )}
      </ul>
    </nav>
  );
}
