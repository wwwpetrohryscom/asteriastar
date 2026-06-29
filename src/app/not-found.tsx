import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getAllSections } from "@/lib/content/registry";
import { sectionPath } from "@/lib/routes";
import Link from "next/link";

export default function NotFound() {
  const sections = getAllSections();
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="font-display text-7xl font-bold accent-text">404</p>
      <h1 className="mt-4 font-display text-2xl font-semibold text-fg sm:text-3xl">
        Lost in space
      </h1>
      <p className="mt-3 max-w-md text-muted">
        This page has drifted beyond our charts. Let&apos;s get you back to
        something we can map.
      </p>
      <div className="mt-8">
        <Button href="/">Return home</Button>
      </div>
      <nav aria-label="Knowledge hubs" className="mt-10">
        <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-muted">
          {sections.map((section) => (
            <li key={section.slug}>
              <Link href={sectionPath(section)} className="transition hover:text-fg">
                {section.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Container>
  );
}
