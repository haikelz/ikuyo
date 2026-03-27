import { toString as mdastToString } from "mdast-util-to-string";
import getReadingTime from "reading-time";
import { visit } from "unist-util-visit";

function parseFilenameFromMeta(meta: string | null) {
  if (!meta || typeof meta !== "string") return null;
  const titleMatch = meta.match(/title\s*=\s*["']?([^"'\s]+)["']?/);
  return titleMatch ? titleMatch[1] : null;
}

/**
 * Remark plugin to add data-filename and data-language to code blocks so they survive rehype/Shiki conversion
 */
export function remarkCodeFilename() {
  return (tree: any) => {
    visit(tree, "code", (node) => {
      node.data = node.data || {};
      node.data.hProperties = node.data.hProperties || {};

      if (node.meta) {
        const filename = parseFilenameFromMeta(node.meta);
        if (filename) {
          node.data.hProperties["data-filename"] = filename;
        }
      }
      if (node.lang) {
        node.data.hProperties["data-language"] = node.lang;
      }
    });
  };
}

export function remarkReadingTime() {
  return function (tree: any, { data }: { data: any }) {
    const textOnPage = mdastToString(tree);
    const readingTime = getReadingTime(textOnPage);

    data.astro.frontmatter.minutesRead = readingTime.text;
  };
}
