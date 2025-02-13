import type { HeadingNodeTocProps, HeadingTocProps } from "@/types";

/**
 * Builds a hierarchical structure from a flat array of headings
 * @param headings - Array of heading objects containing depth, text, and id
 * @param rootDepth - The depth level that should be considered as root (default: 2)
 * @returns Array of heading nodes with their nested subheadings
 */
export function buildHierarchy(
  headings: HeadingTocProps[],
  rootDepth: number = 2
): HeadingNodeTocProps[] {
  if (!headings?.length) {
    return [];
  }

  const parentHeadings = new Map<number, HeadingNodeTocProps>();
  const tableOfContents: HeadingNodeTocProps[] = [];

  tableOfContents.length = headings.filter((h) => h.depth === rootDepth).length;
  let tocIndex = 0;

  for (const heading of headings) {
    const headingNode: HeadingNodeTocProps = {
      ...heading,
      subheadings: [],
    };

    parentHeadings.set(heading.depth, headingNode);

    if (heading.depth === rootDepth) {
      tableOfContents[tocIndex++] = headingNode;
    } else {
      const parent = parentHeadings.get(heading.depth - 1);
      if (parent) {
        parent.subheadings.push(headingNode);
      }
    }
  }

  return tableOfContents;
}
