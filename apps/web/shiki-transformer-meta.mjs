/**
 * Shiki transformer to add data-filename from meta title="..." to pre element
 */
function parseFilenameFromMeta(meta) {
  if (!meta || typeof meta !== "string") return null;
  const titleMatch = meta.match(/title\s*=\s*["']?([^"'\s]+)["']?/);
  return titleMatch ? titleMatch[1] : null;
}

export function transformerMetaFilename() {
  return {
    name: "transformer-meta-filename",
    pre(node) {
      const raw = this.options?.meta?.__raw ?? this.options?.meta;
      const metaStr = typeof raw === "string" ? raw : null;
      const filename = parseFilenameFromMeta(metaStr);
      if (filename && node.properties) {
        node.properties["data-filename"] = filename;
      }
    },
  };
}
