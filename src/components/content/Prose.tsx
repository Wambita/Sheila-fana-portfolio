import { paragraphs } from "@/lib/format";

/**
 * Owner-written plain text, split into paragraphs on blank lines. Rendered as text,
 * never as HTML, so database content can't inject markup.
 */
export function Prose({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <div className={`flex max-w-[68ch] flex-col gap-4 ${className}`}>
      {paragraphs(text).map((paragraph, index) => (
        <p key={index} className="whitespace-pre-line">
          {paragraph}
        </p>
      ))}
    </div>
  );
}
