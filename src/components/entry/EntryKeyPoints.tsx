/** A highlighted "key points" / takeaways block. */
export function EntryKeyPoints({
  points,
  title = "Key points",
}: {
  points: string[];
  title?: string;
}) {
  if (points.length === 0) return null;
  return (
    <section
      aria-labelledby="keypoints-heading"
      className="scientific-card p-5"
    >
      <h2 id="keypoints-heading" className="font-display text-base font-semibold text-fg">
        {title}
      </h2>
      <ul className="mt-3 space-y-2.5">
        {points.map((point) => (
          <li key={point} className="flex gap-3 text-sm leading-relaxed text-muted">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
              className="mt-0.5 shrink-0 text-[var(--accent,#c8d2e6)]"
            >
              <path
                d="M20 6 9 17l-5-5"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
