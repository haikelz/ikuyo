export function sanitizeSlug(slug: string) {
  return slug.replace(/\.(md|mdx)$/, "");
}
