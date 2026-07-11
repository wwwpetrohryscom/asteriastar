import Link from "next/link";

export interface StickySectionNavItem {
  href: string;
  label: string;
}

export function StickySectionNav({
  items,
  label = "Section navigation",
  className = "",
}: {
  items: StickySectionNavItem[];
  label?: string;
  className?: string;
}) {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label={label}
      className={`sticky top-20 z-20 border-y border-white/10 bg-black/90 backdrop-blur-md ${className}`}
    >
      <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 py-2 sm:px-8">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="shrink-0 rounded-full px-3 py-1.5 text-sm font-medium text-faint transition hover:bg-white/[0.055] hover:text-white"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
