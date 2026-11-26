import type { ReactNode } from "react";

type PageIntroProps = {
  title: string;
  /** Small context line above the title, e.g. the section or a back link. */
  eyebrow?: ReactNode;
  children?: ReactNode;
};

/** Page title and short introduction (brand guide §5: clear page introductions). */
export function PageIntro({ title, eyebrow, children }: PageIntroProps) {
  return (
    <header className="mb-12 max-w-[68ch] md:mb-16">
      {eyebrow ? (
        <div className="mb-5 font-mono text-xs text-fg-muted">{eyebrow}</div>
      ) : null}
      <h1 className="text-[clamp(2.25rem,1.6rem+2.6vw,3.75rem)] leading-[1.08]">
        {title}
      </h1>
      {children ? (
        <div className="mt-5 text-lg text-fg-muted md:text-xl">{children}</div>
      ) : null}
    </header>
  );
}
