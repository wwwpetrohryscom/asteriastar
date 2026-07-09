import Link from "next/link";
import { Emblem } from "@/lib/brand/logo";
import { SITE } from "@/lib/site";

/** The AsteriaStar emblem + wordmark, linking home. */
export function Logo({ className = "", idSuffix = "header" }: { className?: string; idSuffix?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${SITE.name} — home`}
      className={`group inline-flex items-center gap-2.5 ${className}`}
    >
      <Emblem
        size={30}
        id={`logo-${idSuffix}`}
        className="shrink-0 rounded-lg transition-transform duration-500 group-hover:scale-105"
      />
      <span className="font-display text-lg font-semibold uppercase tracking-[0.04em] text-fg">
        Asteria<span
          className="accent-text"
          style={{ ["--accent-from" as string]: "#f8dd96", ["--accent-to" as string]: "#b8860b" }}
        >
          Star
        </span>
      </span>
    </Link>
  );
}
