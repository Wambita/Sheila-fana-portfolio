/**
 * Quiet fallback while streamed content arrives (brand guide §6: no shimmer or pulsing).
 * Announced politely to screen readers.
 */
export function Loading() {
  return (
    <p role="status" className="text-fg-muted">
      Loading…
    </p>
  );
}
