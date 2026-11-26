import { PageIntro } from "./PageIntro";

/**
 * Honest placeholder for sections whose content arrives in later phases.
 * Never replace with invented content (CLAUDE.md).
 */
export function InDevelopment({ title }: { title: string }) {
  return (
    <PageIntro title={title}>
      <p>
        This section is being built. Content will appear here once it has been
        reviewed.
      </p>
    </PageIntro>
  );
}
