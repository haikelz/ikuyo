import { h } from "hastscript";
import { visit } from "unist-util-visit";

const codeBlockCopyClass = [
  "inline-flex min-h-9 shrink-0 items-center justify-center rounded-md border border-border bg-card px-2.5 text-xs text-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring",
  "code-block-copy",
].join(" ");

/**
 * Parse meta string to extract filename from title="..." or title=...
 * @param {string} meta - The meta string from code block (e.g. 'title="next.config.js"')
 * @returns {string|null} - The filename or null
 */
function parseFilenameFromMeta(meta: string | null): string | null {
  if (!meta || typeof meta !== "string") return null;
  const titleMatch = meta.match(/title\s*=\s*["']?([^"'\s]+)["']?/);
  return titleMatch ? titleMatch[1] : null;
}

/**
 * Extract language from className (e.g. "language-js" -> "js")
 * @param {string[]|string} classNames - Array of class names or space-separated string
 * @returns {string|null} - The language or null
 */
function getLanguageFromClass(classNames: string[] | string): string | null {
  const classes = Array.isArray(classNames)
    ? classNames
    : typeof classNames === "string"
      ? classNames.split(/\s+/)
      : [];
  const langClass = classes.find(
    (c) =>
      typeof c === "string" &&
      (c.startsWith("language-") || c.includes("language-")),
  );
  if (langClass) {
    const match = langClass.match(/language-([a-z0-9+-]+)/i);
    return match ? match[1] : langClass.replace("language-", "");
  }
  return null;
}

/**
 * Recursively find language-* class in a hast node
 */
function findLanguageInNode(node: any): string | null {
  if (!node) return null;
  if (node.type === "element" && node.properties) {
    const lang = getLanguageFromClass(node.properties.className);
    if (lang) return lang;
  }
  if (node.children) {
    for (const child of node.children) {
      const lang = findLanguageInNode(child);
      if (lang) return lang;
    }
  }
  return null;
}

/**
 * Rehype plugin to wrap code blocks with filename header and copy button
 */
export function rehypeCodeBlockWrapper() {
  return (tree: any) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "pre") return;

      const codeNode = node.children?.find(
        (child: any) => child.type === "element" && child.tagName === "code",
      );
      if (!codeNode) return;

      const codeProps = codeNode.properties || {};
      const preProps = node.properties || {};
      const codeClassNames = codeProps.className ?? [];
      const preClassNames = preProps.className ?? [];
      const meta =
        codeProps.meta ?? codeProps.dataMeta ?? codeProps["data-meta"] ?? null;
      const dataFilename =
        preProps["data-filename"] ??
        preProps.dataFilename ??
        codeProps["data-filename"] ??
        codeProps.dataFilename ??
        null;
      const language =
        preProps["data-language"] ??
        preProps.dataLanguage ??
        codeProps.language ??
        codeProps.dataLanguage ??
        codeProps["data-language"] ??
        getLanguageFromClass(preClassNames) ??
        getLanguageFromClass(codeClassNames) ??
        findLanguageInNode(node);

      const filename = dataFilename ?? parseFilenameFromMeta(meta);
      const label = filename ?? language ?? "Code";
      let lineCount = 1;
      visit(codeNode, "text", (text: any) => { lineCount += (text.value.match(/\n/g) ?? []).length; });
      const collapsible = lineCount > 16;

      const wrapper = h(
        "div",
        {
          className: [
            "code-block-wrapper",
            "relative",
            "my-6",
            "overflow-hidden",
            "rounded-lg",
            "border",
            "border-border",
          ],
        },
        [
          h("div", { className: ["code-block-header", "flex", "flex-wrap", "items-center", "gap-2", "border-b", "border-border", "bg-muted/40", "px-3", "py-2"] }, [
            h("span", { className: ["code-block-filename", "min-w-0", "flex-1", "break-all", "font-mono", "text-xs", "text-muted-foreground"] }, label),
            ...(filename && language ? [h("span", { className: ["font-mono", "text-xs", "text-muted-foreground"] }, language)] : []),
            h("button", { type: "button", className: codeBlockCopyClass.split(/\s+/), "data-wrap-button": "true", "aria-label": "Wrap code", "aria-pressed": "false" }, "Wrap"),
            h("button", { type: "button", className: codeBlockCopyClass.split(/\s+/), "data-copy-button": "true", "aria-label": "Copy code" }, "Copy"),
          ]),
          h("div", { className: ["code-block-content"], "data-collapsed": collapsible ? "true" : "false", tabIndex: 0, role: "region", "aria-label": `${label} code` }, [node]),
          ...(collapsible ? [h("button", { type: "button", className: ["code-block-expand", "w-full", "border-t", "border-border", "bg-muted/40", "py-2", "text-xs", "text-foreground", "hover:bg-muted", "focus-visible:outline-2", "focus-visible:outline-ring"], "data-expand-button": "true", "aria-expanded": "false" }, "Show full code")] : []),
        ].filter(Boolean),
      );

      parent.children[index!] = wrapper;
    });
  };
}
