/**
 * Slug that is never a real item (slugs are kebab-case; underscores are rejected by the
 * database CHECK). Its page renders the 404.
 */
export const PLACEHOLDER_SLUG = "__none";

/**
 * With Cache Components, `generateStaticParams` must return at least one entry, but a
 * section can legitimately have no published content yet. In that case, return a
 * placeholder whose page calls `notFound()`. Real slugs published later render on their
 * first visit and are then cached.
 */
export function placeholderParam(
  params: Array<{ slug: string }>,
): Array<{ slug: string }> {
  return params.length > 0 ? params : [{ slug: PLACEHOLDER_SLUG }];
}
