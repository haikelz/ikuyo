import { visit } from "unist-util-visit";

/**
 * Parse meta string to extract filename from title="..." or title=...
 */
function parseFilenameFromMeta(meta) {
  if (!meta || typeof meta !== "string") return null;
  const titleMatch = meta.match(/title\s*=\s*["']?([^"'\s]+)["']?/);
  return titleMatch ? titleMatch[1] : null;
}

/**
 * Remark plugin to add data-filename and data-language to code blocks so they survive rehype/Shiki conversion
 */
export function remarkCodeFilename() {
  return (tree) => {
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
