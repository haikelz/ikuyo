import type { HeadingNodeTocProps, HeadingTocProps } from "@/types";

export function buildHierarchy(
  headings: HeadingTocProps[],
  rootDepth: number = 2,
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
