import { Container } from "@/components/ui/Container";

/** Global route loading state — an on-brand, restrained placeholder. */
export default function Loading() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <span
        aria-hidden
        className="h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-nebula"
      />
      <p className="mt-4 text-sm text-muted">Loading…</p>
      <span className="sr-only" role="status">
        Loading content
      </span>
    </Container>
  );
}
