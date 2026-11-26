import type { ReactNode } from "react";

type PageIntroProps = { title: string; children?: ReactNode };

/** Page title and short introduction (brand guide §5: clear page introductions). */
export function PageIntro({ title, children }: PageIntroProps) {
  return (
    <div className="mb-10 max-w-[68ch]">
      <h1 className="text-3xl sm:text-4xl">{title}</h1>
      {children ? (
        <div className="mt-4 text-lg text-fg-muted">{children}</div>
      ) : null}
    </div>
  );
}
