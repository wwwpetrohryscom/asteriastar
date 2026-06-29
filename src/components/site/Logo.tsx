import Link from "next/link";
import { SITE } from "@/lib/site";

/** The Asteria Star wordmark + sparkle, linking home. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${SITE.name} — home`}
      className={`group inline-flex items-center gap-2.5 ${className}`}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 64 64"
        fill="none"
        aria-hidden="true"
        className="shrink-0 transition-transform duration-500 group-hover:rotate-90"
      >
        <defs>
          <linearGradient id="logo-grad" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
            <stop stopColor="#a78bfa" />
            <stop offset="0.55" stopColor="#56b6f6" />
            <stop offset="1" stopColor="#34d3d3" />
          </linearGradient>
        </defs>
        <path
          d="M32 6 C34.6 22 42 29.4 58 32 C42 34.6 34.6 42 32 58 C29.4 42 22 34.6 6 32 C22 29.4 29.4 22 32 6 Z"
          fill="url(#logo-grad)"
        />
      </svg>
      <span className="font-display text-lg font-semibold tracking-tight text-fg">
        Asteria<span className="text-faint"> </span>
        <span className="accent-text" style={{ ["--accent-from" as string]: "#a78bfa", ["--accent-to" as string]: "#34d3d3" }}>
          Star
        </span>
      </span>
    </Link>
  );
}
