"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

/**
 * The only client-side code in the ecosystem layer: open/close for the panel.
 *
 * It takes the panel as `children`, which the SERVER renders. That is the whole
 * point of the split — every ecosystem link is in the initial HTML and in the
 * crawler's DOM whether or not this component ever hydrates, while the button
 * that reveals them is the small interactive part.
 *
 * The panel is toggled with the `hidden` attribute rather than being mounted on
 * demand. Content that is present and revealed by a control the user can
 * operate is a disclosure widget; content injected only after a click would not
 * be in the server HTML at all.
 */
export function EcosystemDisclosure({
  label,
  summary,
  children,
}: {
  label: string;
  summary: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Escape closes and returns focus to the trigger, so keyboard users are never
  // stranded inside the panel.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    function onPointerDown(e: PointerEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="contents">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="group flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-[0.7rem] font-medium text-faint transition-colors hover:text-fg focus-visible:text-fg sm:text-xs"
      >
        <span className="hidden sm:inline">{summary}</span>
        <span className="sm:hidden">Explore</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 12 12"
          className={`h-2.5 w-2.5 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        >
          <path d="M2 4.5 6 8.5 10 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="sr-only">{open ? `Collapse ${label}` : `Expand ${label}`}</span>
      </button>

      {/*
        Rendered by the server, hidden until asked for. `hidden` keeps it out of
        the accessibility tree and out of the tab order while collapsed, so the
        panel's ~33 links never appear as invisible tab stops.
      */}
      <div
        id={panelId}
        hidden={!open}
        className="absolute inset-x-0 top-full z-[60] max-h-[calc(100dvh-var(--global-header-offset)-1rem)] overflow-y-auto overscroll-contain border-b border-silver/12 bg-bg-elevated shadow-2xl shadow-black/60"
      >
        {children}
      </div>
    </div>
  );
}
